module.exports = [
  {
    "col": 1,
    "evidence": "<#assgn x = 1>",
    "line": 1,
    "message": "Unrecognized FreeMarker directive \"<#assgn>\". Check for a typo or an unsupported directive.",
    "raw": "<#assgn x = 1>",
    "rule": {
      "description": "Validate Freemarker tags.",
      "id": "freemarker-tags",
      "link": "https://thecapsule.email/docs/codes/freemarker-tags",
    },
    "type": "error",
  }
]
