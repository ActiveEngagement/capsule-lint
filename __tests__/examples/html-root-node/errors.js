module.exports = [
  {
    type: 'error',
    message: 'The [ div ] cannot come after the [ html ] tag on line 2.',
    raw: '<div>\n    <html></html>\n</div>',
    evidence: '<div>',
    line: 1,
    col: 1,
    rule: {
      id: 'html-root-node',
      description: 'The html tag must be the only root node in the document.',
      link: 'https://thecapsule.email/docs/codes/html-root-node'
    }
  }
]