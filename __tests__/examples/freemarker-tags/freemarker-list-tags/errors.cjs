module.exports = [
  {
    "col": 1,
    "evidence": "<#list a as b>",
    "line": 1,
    "message": "Tag [<#list a as b>] is missing a closing tag: [</#list>]",
    "raw": "<#list a as b>",
    "rule": {
      "description": "Validate Freemarker tags.",
      "id": "freemarker-tags",
      "link": "https://thecapsule.email/docs/codes/freemarker-tags",
    },
    "type": "error",
  }
]