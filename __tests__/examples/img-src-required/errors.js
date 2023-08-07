module.exports = [
    {
        type: 'error',
        message: 'The [ img ] tag must have a [ src ] attribute',
        raw: '<img alt="some image" />',
        evidence: '<img alt="some image" />',
        line: 1,
        col: 1,
        rule: {
            id: 'img-src-required',
            description: 'The img tag must have a src attribute.',
            link: 'https://thecapsule.email/docs/codes/img-src-required'
        }
    }
];