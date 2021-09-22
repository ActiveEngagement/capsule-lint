module.exports = [
    {
        type: 'error',
        message: 'The [ <id ] attribute contains an invalid character [ < ]',
        raw: ' <id="test"',
        evidence: '<a <id="test">test</a>',
        line: 1,
        col: 3,
        rule: {
        id: 'invalid-attribute-char',
        description: 'Invalid attribute character.',
        link: 'https://thecapsule.email/docs/codes/invalid-attribute-char'
        }
    }
]