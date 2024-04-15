module.exports = [
    {
        type: 'error',
        message: 'Tag must be paired, no start tag: [ </div> ]',
        raw: '</div>',
        evidence: '</div>',
        line: 4,
        col: 1,
        rule: {
            id: 'tag-pair',
            description: 'Tag must be paired.',
            link: 'https://thecapsule.email/docs/codes/tag-pair'
        }
    }
]