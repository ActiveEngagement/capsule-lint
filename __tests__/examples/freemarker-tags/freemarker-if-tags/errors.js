module.exports = [
  {
    "col": 1,
    "evidence": "<#if a>",
    "line": 1,
    "message": "Tag [<#if a>] is missing a closing tag: [</#if>]",
    "raw": "<#if a>",
    "rule": {
      "description": "Validate Freemarker tags.",
      "id": "freemarker-tags",
      "link": "https://thecapsule.email/docs/codes/freemarker-tags",
    },
    "type": "error",
  }
]