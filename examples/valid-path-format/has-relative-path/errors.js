[
  {
    "type": "error",
    "message": "The value of the href attribute [ ./styles.css ] must one of the following formats: \"MessageGears unsubscribe\", \"absolute\".",
    "raw": " href=\"./styles.css\"",
    "evidence": "<link rel=\"stylesheet\" href=\"./styles.css\">",
    "line": 1,
    "col": 23,
    "rule": {
      "id": "valid-path-format",
      "description": "The href attribute must be a valid format.",
      "link": "https://thecapsule.email/docs/codes/valid-path-format"
    }
  },
  {
    "type": "error",
    "message": "The value of the href attribute [ ./some-path-here ] must one of the following formats: \"MessageGears unsubscribe\", \"absolute\".",
    "raw": " href=\"./some-path-here\"",
    "evidence": "<a href=\"./some-path-here\">Test</a>",
    "line": 2,
    "col": 3,
    "rule": {
      "id": "valid-path-format",
      "description": "The href attribute must be a valid format.",
      "link": "https://thecapsule.email/docs/codes/valid-path-format"
    }
  },
  {
    "type": "error",
    "message": "The value of the href attribute [ ./some-path-here ] must follow the absolute format.",
    "raw": " src=\"./some-path-here\"",
    "evidence": "<img src=\"./some-path-here\" />",
    "line": 3,
    "col": 5,
    "rule": {
      "id": "valid-path-format",
      "description": "The href attribute must be a valid format.",
      "link": "https://thecapsule.email/docs/codes/valid-path-format"
    }
  }
]