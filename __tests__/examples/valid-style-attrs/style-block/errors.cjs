module.exports = [
    {
        "col": 32,
        "evidence": ".b{font-family:Arial sans-serif background:blue}",
        "line": 3,
        "message": "Missed semicolon",
        "raw": ".a{color:red}\n.b{font-family:Arial sans-serif background:blue}",
        "rule": {
            "description": "Style attributes and <style> blocks must contain valid CSS.",
            "id": "valid-style-attrs",
            "link": "https://thecapsule.email/docs/codes/valid-style-attrs",
        },
        "type": "error"
    }
]
