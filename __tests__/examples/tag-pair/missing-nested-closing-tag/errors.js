module.exports = [
    {
        type: 'error',
        message: 'Tag must be paired, missing: [ </span> ], start tag match failed [ <span> ] on line 3.',
        raw: '<span>',
        evidence: '    <span>1',
        line: 3,
        col: 5,
        rule: {
            id: 'tag-pair',
            description: 'Tag must be paired.',
            link: 'https://thecapsule.email/docs/codes/tag-pair'
        }
    }
]