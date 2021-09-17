export default [{
    name: 'Fix Path',
    apply(view, from, to) {
        const matches = view.state.doc.slice(from, to).toString().match(/(=(?:\s+)?['"])(.+)?['"]/);
        
        const [ expression, eq, value] = matches;

        const anchor = from + eq.length + matches.index;

        const tr = view.state.update({
            selection: {
                anchor,
                head: anchor + (value ? value.length : 0)
            },
            scrollIntoView: true
        });

        view.dispatch(tr);
        view.focus();
    }
}, {
    name: 'Remove Attribute',
    apply(view, from, to) {
        view.dispatch({
            changes: { from, to, insert: '' }
        });
    }
}]