module.exports = [
    {
        type: 'error',
        message: '[ < ] character cannot be used for attribute names.',
        raw: '<',
        evidence: '<a <id="test">test</a>',
        line: 1,
        col: 4,
        rule: {
            id: 'invalid-attribute-char',
            description: 'Attribute must contain valid characters.',
            link: 'https://thecapsule.email/docs/codes/invalid-attribute-char'
        }
    }
]