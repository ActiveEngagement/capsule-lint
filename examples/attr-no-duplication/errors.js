module.exports = [
    {
        type: 'error',
        message: 'Duplicate of attribute name [ id ] was found.',
        raw: ' id="test"',
        evidence: '<div id="test" id="test"></div>',
        line: 1,
        col: 15,
        rule: {
            id: 'attr-no-duplication',
            description: 'Elements cannot have duplicate attributes.',
            link: 'https://thecapsule.email/docs/codes/attr-no-duplication'
        }
    }
]