module.exports = [
  {
    type: 'error',
    message: 'The [ body ] tag must be a direct child descendent of an [ html ] tag.',
    raw: '<body>\n    <div>test</div>\n</body>',
    evidence: '<body>',
    line: 1,
    col: 1,
    rule: {
      id: 'head-body-descendents-html',
      description: 'The head and body tags must be a direct child descendents of the html tag.',
      link: 'https://thecapsule.email/docs/codes/head-body-descendents-html'
    }
  }
]