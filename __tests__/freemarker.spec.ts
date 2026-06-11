import { parse } from '../src/parser';

test('that the following freemarker syntax will parse', () => {
    expect(parse('before<#if a></#if>after')).toEqual([
        'before',
        '<#if a>',
        '</#if>',
        'after'
    ]);

    expect(parse('<#if a>b></#if>')).toEqual([
        '<#if a>',
        'b>',
        '</#if>'
    ]);

    expect(parse('<#if (a>b)></#if>')).toEqual([
        '<#if (a>b)>',
        '</#if>'
    ]);

    expect(parse('<#if (a>b)><#if (b>d)>inner</#if></#if>')).toEqual([
        '<#if (a>b)>',
        '<#if (b>d)>',
        'inner',
        '</#if>',
        '</#if>'
    ]);

    expect(parse('before${Recipient.unsubscribe()}after')).toEqual([
        'before',
        '${Recipient.unsubscribe()}',
        'after'
    ]);

    expect(parse('${foo.bar() + Recipient.unsubscribe()}')).toEqual([
        '${foo.bar() + Recipient.unsubscribe()}'
    ]);

    expect(parse('<#if a + b == c < 3 + d()>inner</#if>')).toEqual([
        '<#if a + b == c < 3 + d()>',
        'inner',
        '</#if>'
    ]);

    expect(parse('${"test\'s"?test().a() && b < 2 || true}')).toEqual([
        '${"test\'s"?test().a() && b < 2 || true}'
    ]);

    expect(parse('<#if a() && foo.bar()?trim>')).toEqual([
        '<#if a() && foo.bar()?trim>'
    ]);

    expect(parse('<#if (Recipient.FirstName?has_content) && (Recipient.FirstName?trim?length > 0)>${Recipient.FirstName}<#else>Fellow American</#if>')).toEqual([
        '<#if (Recipient.FirstName?has_content) && (Recipient.FirstName?trim?length > 0)>',
        '${Recipient.FirstName}',
        '<#else>',
        'Fellow American',
        '</#if>',
    ]);

    expect(parse('<#list a.b.c as foo>${foo.test}</#list>')).toEqual([
        '<#list a.b.c as foo>',
        '${foo.test}',
        '</#list>',
    ]);

    expect(parse('<#if (Recipient.showUnsub=\'true\' )>')).toEqual([
        '<#if (Recipient.showUnsub=\'true\' )>'
    ]);

    expect(parse('<#if (Recipient.showUnsub="true" )>')).toEqual([
        '<#if (Recipient.showUnsub="true" )>'
    ]);

    expect(parse('${.now?foo?bar}')).toEqual([
        '${.now?foo?bar}'
    ]);

    expect(parse("${Gears.track('${test[0].foo.bar?test}')}")).toEqual([
        "${Gears.track('${test[0].foo.bar?test}')}"
    ]);
})

test('that parenthesized expressions with modifiers parse correctly', () => {
    // Main reported bug: (expr)?modifier in tag interpolation
    expect(parse('${(hpcAmount?number*0.5)?round}')).toEqual([
        '${(hpcAmount?number*0.5)?round}'
    ]);

    // Multiple chained modifiers after paren group
    expect(parse('${(hpcAmount?number*0.5)?round?string}')).toEqual([
        '${(hpcAmount?number*0.5)?round?string}'
    ]);

    // Paren group with ?c (common FreeMarker built-in)
    expect(parse('${(amount * 100)?c}')).toEqual([
        '${(amount * 100)?c}'
    ]);

    // Paren group without modifier (should still work)
    expect(parse('${(foo?upper_case)}')).toEqual([
        '${(foo?upper_case)}'
    ]);

    // Paren expression in <#if> condition with modifier
    expect(parse('<#if (x + y)?has_content>inner</#if>')).toEqual([
        '<#if (x + y)?has_content>',
        'inner',
        '</#if>'
    ]);

    // Paren expression in elseif with modifier
    expect(parse('<#if a><#elseif (b + c)?has_content>inner</#if>')).toEqual([
        '<#if a>',
        '<#elseif (b + c)?has_content>',
        'inner',
        '</#if>'
    ]);
})

test('that negative number literals parse correctly', () => {
    expect(parse('${-5}')).toEqual([
        '${-5}'
    ]);

    expect(parse('${amount + -1}')).toEqual([
        '${amount + -1}'
    ]);

    expect(parse('<#if score gt -1>content</#if>')).toEqual([
        '<#if score gt -1>',
        'content',
        '</#if>'
    ]);
})

test('that FreeMarker comments parse correctly', () => {
    expect(parse('<#-- this is a comment -->')).toEqual([
        '<#-- this is a comment -->'
    ]);

    expect(parse('before<#-- comment -->after')).toEqual([
        'before',
        '<#-- comment -->',
        'after'
    ]);

    expect(parse('<#-- multi\nline\ncomment -->${foo}')).toEqual([
        '<#-- multi\nline\ncomment -->',
        '${foo}'
    ]);

    expect(parse('<#if a><#-- conditional comment --></#if>')).toEqual([
        '<#if a>',
        '<#-- conditional comment -->',
        '</#if>'
    ]);
})

test('that parenthesized expression as left operand of arithmetic parses', () => {
    expect(parse('${(fee * 0.5 + base) * rate}')).toEqual([
        '${(fee * 0.5 + base) * rate}'
    ]);

    expect(parse('${(a + b) * c}')).toEqual([
        '${(a + b) * c}'
    ]);

    expect(parse('${(hpcAmount?number * 0.5)?round * 100}')).toEqual([
        '${(hpcAmount?number * 0.5)?round * 100}'
    ]);
})

test('that <#list> with trailing whitespace before > parses correctly', () => {
    expect(parse('<#list items as item >${item}</#list>')).toEqual([
        '<#list items as item >',
        '${item}',
        '</#list>'
    ]);

    expect(parse('<#list a.b.c as foo >${foo.test}</#list>')).toEqual([
        '<#list a.b.c as foo >',
        '${foo.test}',
        '</#list>'
    ]);
})

test('that <#local> and <#global> assignment directives parse correctly', () => {
    expect(parse('<#local x = 42>')).toEqual([
        '<#local x = 42>'
    ]);

    expect(parse('<#global greeting = "Hello">')).toEqual([
        '<#global greeting = "Hello">'
    ]);

    expect(parse('<#local total = price * quantity>${total}</#if>')).toEqual([
        '<#local total = price * quantity>',
        '${total}',
        '</#if>'
    ]);
})

test('that modulo operator parses correctly', () => {
    expect(parse('${count % 2}')).toEqual([
        '${count % 2}'
    ]);

    expect(parse('<#if index % 2 == 0>even</#if>')).toEqual([
        '<#if index % 2 == 0>',
        'even',
        '</#if>'
    ]);
})