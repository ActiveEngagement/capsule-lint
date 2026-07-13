module.exports = [
    {
        "col": 4,
        "evidence": ".b{background:}",
        "line": 3,
        "message": "Property \"background\" has an empty value.",
        "raw": ".a{color:red}\n.b{background:}",
        "rule": {
            "description": "Style attributes and <style> blocks must contain valid CSS.",
            "id": "valid-style-attrs",
            "link": "https://thecapsule.email/docs/codes/valid-style-attrs",
        },
        "type": "error"
    }
]
