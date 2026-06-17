module.exports = [
    {
        type: 'error',
        message: 'Tag must be paired, missing: [ </div> ], start tag match failed [ <div> ] on line 1.',
        raw: '<div>',
        evidence: '<div>',
        line: 1,
        col: 1,
        rule: {
            id: 'tag-pair',
            description: 'Tag must be paired.',
            link: 'https://thecapsule.email/docs/codes/tag-pair'
        }
    }
]