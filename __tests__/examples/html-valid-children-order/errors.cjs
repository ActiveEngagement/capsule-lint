module.exports = [
    {
        type: 'error',
        message: 'The [ body ] tag must come after the [ head ] tag on line 3.',
        raw: '<body></body>',
        evidence: '    <body></body>',
        line: 2,
        col: 5,
        rule: {
            id: 'html-valid-children-order',
            description: 'The head and body tags must be in the correct order.',
            link: 'https://thecapsule.email/docs/codes/html-valid-children-order'
        }
    },
    {
        type: 'error',
        message: 'The [ head ] tag must come before the [ body ] tag on line 2.',
        raw: '<head></head>',
        evidence: '    <head></head>',
        line: 3,
        col: 5,
        rule: {
            id: 'html-valid-children-order',
            description: 'The head and body tags must be in the correct order.',
            link: 'https://thecapsule.email/docs/codes/html-valid-children-order'
        }
    }
];