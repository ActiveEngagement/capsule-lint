export default [{
    name: 'Fix Error',
    apply(view, from, to) {
        const map = {
            '<': '&lt;',
            '>': '&rt;',
            '&': '&amp;'
        };

        const [ value, char ] = view.state.doc.slice(from, to)
            .toString()
            .match(/(?:\s+)?([<&>]|\&\s)/);

        const index = value.indexOf(char);
        
        view.dispatch({
            changes: { from: from + index, to: from + index + 1, insert: map[char] }
        });
    }
}];