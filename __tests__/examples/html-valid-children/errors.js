module.exports = [
  {
    type: 'error',
    message: 'The [ div ] tag cannot be a direct descendent of the [ html ] tag on line 1.',
    raw: '<div>invalid element</div>',
    evidence: '    <div>invalid element</div>',
    line: 2,
    col: 5,
    rule: {
      id: 'html-valid-children',
      description: 'The html tag must only contain a head and body tag.',
      link: 'https://thecapsule.email/docs/codes/html-valid-children'
    }
  }
]