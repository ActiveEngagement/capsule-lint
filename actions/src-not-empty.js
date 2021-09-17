export default [{
    name: 'Remove Img',
    apply(view, from, to) {
        const cursor = view.state.tree.cursor(from);

        view.dispatch({
            changes: { from: cursor.from , to: cursor.to, insert: '' }
        });
    }
}]