module.exports = [
    {
        type: 'error',
        message: 'The [ br ] tag is a void element and cannot have a closing tag.',
        raw: '</br>',
        evidence: '</br>',
        line: 1,
        col: 1,
        rule: {
            id: 'no-closing-void-tags',
            description: 'Void elements cannot have closing tags.',
        }
    }
];
