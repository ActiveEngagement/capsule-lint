import { EditorView } from '@codemirror/view';

export default [{
    name: 'Remove Attribute',
    apply(view: EditorView, from, to) {
        view.dispatch({
            changes: { from, to, insert: '' }
        });
    }
},{
    name: 'Rename Attribute',
    apply(view, from, to) {
        const [ value, attr ] = view.state.doc.slice(from, to).toString().match(/(?:\s+)?(\w+)=/);
       
        const anchor = from + value.indexOf(attr);

        const tr = view.state.update({
            selection: {
                anchor,
                head: anchor + attr.length
            },
            scrollIntoView: true
        });

        view.dispatch(tr);
        view.focus();
    }
}];