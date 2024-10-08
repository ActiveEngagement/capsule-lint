module.exports = [
    {
        "col": 6,
        "evidence": "<div style=\"eb-garamond, serif; background-color:; :red;color=red;\"></div>",
        "line": 1,
        "message": "The value \"eb-garamond, serif\" does not contain a declaration.",
        "raw": "style=\"eb-garamond, serif; background-color:; :red;color=red;\"",
        "rule": {
            "description": "Style attributes must contain valid CSS.",
            "id": "valid-style-attrs",
            "link": "https://thecapsule.email/docs/codes/valid-style-attrs",
        },
        "type": "error"
    },
    {
        "col": 6,
        "evidence": "<div style=\"eb-garamond, serif; background-color:; :red;color=red;\"></div>",
        "line": 1,
        "message": "Property \"background-color\" has an empty value",
        "raw": "style=\"eb-garamond, serif; background-color:; :red;color=red;\"",
        "rule": {
            "description": "Style attributes must contain valid CSS.",
            "id": "valid-style-attrs",
            "link": "https://thecapsule.email/docs/codes/valid-style-attrs",
        },
        "type": "error"
    },
    {
        "col": 6,
        "evidence": "<div style=\"eb-garamond, serif; background-color:; :red;color=red;\"></div>",
        "line": 1,
        "message": "The value \"red\" does not have a declaration.",
        "raw": "style=\"eb-garamond, serif; background-color:; :red;color=red;\"",
        "rule": {
            "description": "Style attributes must contain valid CSS.",
            "id": "valid-style-attrs",
            "link": "https://thecapsule.email/docs/codes/valid-style-attrs",
        },
        "type": "error"
    },
    {
        "col": 6,
        "evidence": "<div style=\"eb-garamond, serif; background-color:; :red;color=red;\"></div>",
        "line": 1,
        "message": "Declaration \"color=red\" uses '=' instead of ':'",
        "raw": "style=\"eb-garamond, serif; background-color:; :red;color=red;\"",
        "rule": {
            "description": "Style attributes must contain valid CSS.",
            "id": "valid-style-attrs",
            "link": "https://thecapsule.email/docs/codes/valid-style-attrs",
        },
        "type": "error"
    }
]