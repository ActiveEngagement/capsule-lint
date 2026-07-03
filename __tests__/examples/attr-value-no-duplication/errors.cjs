module.exports = [
    {
        type: 'error',
        message: 'Duplicate value [ foo ] was found in attribute [ class ].',
        raw: ' class="foo bar foo"',
        evidence: '<div class="foo bar foo"></div>',
        line: 1,
        col: 5,
        rule: {
            id: 'attr-value-no-duplication',
            description: 'Class attributes should not contain duplicate values. Other attributes can be checked via configuration.',
            link: 'https://thecapsule.email/docs/codes/attr-value-no-duplication'
        }
    }
]
