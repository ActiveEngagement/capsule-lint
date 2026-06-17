module.exports = [
  {
    type: 'error',
    message: 'The [ head ] tag must be a direct child descendent of an [ html ] tag.',
    raw: '<head>\n    <title>Valid Element</title>\n    <div>test</div>\n</head>',
    evidence: '<head>',
    line: 1,
    col: 1,
    rule: {
      id: 'head-body-descendents-html',
      description: 'The head and body tags must be a direct child descendents of the html tag.',
      link: 'https://thecapsule.email/docs/codes/head-body-descendents-html'
    }
  }
]