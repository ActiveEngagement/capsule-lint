class Element {
    constructor(view, from, to) {
        this.from = from;
        this.to = to;
        this.tagName = tagName(view, from, to);
        this.closed = false;
    }

    is(tagName) {
        return this.tagName.toLowerCase() === tagName.toLowerCase();
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
                    if(!stack[pos].closed && stack[pos].is(tagName(view, from, to))) {
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

module.exports = [{
    name: 'Close Only First Tag',
    apply(view, from, to) {
        let data = [];

        // The purpose of this loop is if the from/to doen't catch the error,
        // then we should traverse backwards until we find a charge, or reach
        // the beginning of the document.
        do {      
            data = changes(view, from, to);

            from -= 10;
        }
        while(from >= 0 && !data.length);
            
        view.dispatch({
            changes: data.slice(0, 1)
        });
    }
}, {
    name: 'Close All Tags',
    apply(view, from, to) {
        view.dispatch({
            changes: changes(view)
        });
    }
}]