module.exports = [
    {
        type: 'error',
        message: '[ p ] tags cannot be nested inside the [ p ] tag on line 1.',
        raw: '<p></p>',
        evidence: '<p><p></p></p>',
        line: 1,
        col: 4,
        rule: {
            id: 'nested-paragraphs',
            description: 'Nested paragraphs are prohibited.',
            link: 'https://thecapsule.email/docs/codes/nested-paragraphs'
        }
    }
]