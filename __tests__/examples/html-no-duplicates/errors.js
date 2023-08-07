module.exports = [
  {
    type: 'error',
    message: 'The [ html ] tag already exists on line 1.',
    raw: '<html></html>',
    evidence: '<html></html>',
    line: 2,
    col: 1,
    rule: {
      id: 'html-no-duplicates',
      description: 'The html tag must be a unique root element.',
      link: 'https://thecapsule.email/docs/codes/html-no-duplicates'
    }
  }
]