module.exports = [
  {
    type: 'error',
    message: 'The [ head ] tag is a duplicate of the tag on line 1.',
    raw: '<head></head>',
    evidence: '<head></head>',
    line: 2,
    col: 1,
    rule: {
      id: 'head-no-duplicates',
      description: 'The head tag must not be a duplicate.',
      link: 'https://thecapsule.email/docs/codes/head-no-duplicates'
    }
  }
]