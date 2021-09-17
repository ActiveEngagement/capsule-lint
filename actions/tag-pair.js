class Element {
    constructor(view, from, to) {
        this.from = from;
        this.to = to;
        this.tagName = tagName(view, from, to);
        this.closed = false;
    }

    is(tagName) {
        return this.tagName === tagName;
    }
}

function tagName(view, from, to) {
    return view.state.doc.sliceString(from, to)
        .toLowerCase()
        .match(/^<\/?(?:\s+)?(\w+)/)[1];
}

function changes(view, from, to) {
    let lastElement, pos, stack = [];

    view.state.tree.iterate({
        from, to,
        enter(type, from, to, get) {
            if(type.name === 'Element') {
                stack.push(lastElement = new Element(view, from, to));
            }
            else if(type.name === 'SelfClosingTag') {
                stack.splice(stack.indexOf(lastElement), 1);
            }
        },
        leave(type, from, to) {
            if(type.name === 'CloseTag') {
                for(pos = stack.length - 1; pos >= 0; pos--) {
                    if(stack[pos].is(tagName(view, from, to))) {
                        stack[pos].closed = true;

                        break;
                    }
                }
            }
        }
    });

    return stack.filter(element => !element.closed)
        .reverse()
        .map(({ to, tagName }) => ({
            from: to,
            to: to,
            insert: `</${tagName}>`
        }));
}

export default [{
    name: 'Close First Tag',
    apply(view, from, to) {

        view.dispatch({
            changes: changes(view, from, to).slice(0, 1)
        });
    }
}, {
    name: 'Close All Tags',
    validate(view, from, to) {
        return changes(view, from, to).length > 0;
    },
    apply(view, from, to) {
        view.dispatch({
            changes: changes(view, from, to)
        });
    }
}]