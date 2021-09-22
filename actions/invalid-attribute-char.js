const rules = require('../capsule.config.json');

module.exports = [{
    name: 'Fix Error',
    apply(view, from, to) {
        view.dispatch({
            changes: { from, to, insert: '' }
        });
    }
}]