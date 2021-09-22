module.exports = [
  {
    type: 'error',
    message: 'The [ body ] tag already exists on line 1.',
    raw: '<body></body>',
    evidence: '<body></body>',
    line: 2,
    col: 1,
    rule: {
      id: 'body-no-duplicates',
      description: 'The body tag must not be a duplicate.',
      link: 'https://thecapsule.email/docs/codes/body-no-duplicates'
    }
  }
]