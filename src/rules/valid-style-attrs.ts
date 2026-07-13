import { Rule } from 'htmlhint/types';
import postcss from 'postcss';

// A CSS problem, with an optional location *relative to the parsed CSS* (1-based
// line/column, as PostCSS reports it). The rule translates that into an absolute
// document position when it reports.
type CssError = {
    message: string,
    line?: number,
    column?: number
};

// Validate a chunk of CSS with PostCSS — the same parser `capsule-capsulate`
// uses to inline styles via juice — so anything that validates clean here won't
// choke capsulate downstream. This replaces the old split-on-`;` heuristics: a
// real parser reliably catches structural errors the string-splitting missed
// (most notably a missing semicolon that silently merges two declarations), and
// walking the parsed AST lets us flag empty properties/values without regex.
//
// `block` selects the input shape: a `<style>` block is a full stylesheet parsed
// as-is; a `style` attribute is a bare declaration list, so we wrap it in a dummy
// rule to give PostCSS something valid to parse around.
function validateCss(css: string, block: boolean): CssError[] {
    let root: postcss.Root;

    try {
        root = postcss.parse(block ? css : `*{${css}}`);
    }
    catch (e) {
        // PostCSS throws a CssSyntaxError carrying a human-readable `reason`
        // (e.g. "Missed semicolon") and the offending line/column.
        const error = e as { reason?: string, message?: string, line?: number, column?: number };

        return [{
            message: error.reason ?? error.message ?? 'Invalid CSS.',
            line: error.line,
            column: error.column
        }];
    }

    // Parsed cleanly, but PostCSS is permissive — it accepts empty properties and
    // values that are still invalid CSS. Inspect the AST to flag those.
    const errors: CssError[] = [];

    root.walkDecls(decl => {
        const start = decl.source?.start;

        if(!decl.prop.trim()) {
            errors.push({ message: `Declaration "${decl.toString().trim()}" is missing a property.`, line: start?.line, column: start?.column });
        }
        else if(!decl.value.trim()) {
            errors.push({ message: `Property "${decl.prop}" has an empty value.`, line: start?.line, column: start?.column });
        }
    });

    return errors;
}

const rule: Rule = {
    id: 'valid-style-attrs',
    description: 'Style attributes and <style> blocks must contain valid CSS.',
    init(parser, reporter) {
        // Inline `style` attributes. The attribute is single-line, so we anchor
        // every error at the attribute itself rather than at a column inside it.
        parser.addListener('tagstart', event => {
            for(const attr of event.attrs.filter(({ name }) => name === 'style')) {
                for(const error of validateCss(attr.value, false)) {
                    reporter.error(
                        error.message,
                        event.line,
                        event.col + event.raw.indexOf(attr.raw.trim()),
                        this,
                        attr.raw.trim()
                    );
                }
            }
        });

        // `<style>` blocks arrive as `cdata` (as does `<script>`, hence the tag
        // check). The event's line/col mark where the block's content begins, so
        // we offset PostCSS's in-block location onto the real document position.
        parser.addListener('cdata', event => {
            if(event.tagName?.toLowerCase() !== 'style') {
                return;
            }

            for(const error of validateCss(event.raw, true)) {
                const line = error.line != null ? event.line + error.line - 1 : event.line;
                const col = error.line === 1
                    ? event.col + (error.column ?? 1) - 1
                    : (error.column ?? event.col);

                reporter.error(error.message, line, col, this, event.raw.trim());
            }
        });
    }
};

export default rule;
