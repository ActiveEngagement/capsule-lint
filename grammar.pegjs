start
  = value: (text / tag / value: (conditional) { return value })* { return value.filter(Boolean) }
  
text
  = value: char+ { return }

char
  = (!("<#if"/"${")) value:. { return value } 

tag
  = value: ("${" _ tag_expression _ "}") { return value.flat(100).join('') }

conditional
  = value: ("<#if" required_whitespace expression ">") { return value.flat(100).filter(Boolean).join('') }

tag_expression "expression"
  = ("(" _ unsafe_expression _ ")" / unsafe_expression) _ (unsafe_operator tag_expression)* modifier_expression*

expression "expression"
  = ("(" _ unsafe_expression _ ")" / safe_expression) _ (safe_operator expression)* modifier_expression*

unsafe_expression "equation"
  = variable (_ unsafe_operator _ (variable/expression))*
    
safe_expression "equation"
  = variable (_ safe_operator _ (variable/expression))*

variable
  = string ("." string)* args?/(modifier_expression*)

modifier_expression
  = "?" modifier args?
    
modifier "modifier"
  = string
  
args = "(" arg? (comma arg)* ")"

arg "expression"
  = _ expression _
  
safe_operator "operator"
  = "<" 
  / "==" 
  / "<="
  / "!=" 
  / "+" 
  / "-" 
  / "/"
  / "*"

unsafe_operator "operator"
  = safe_operator
  / ">"
  / ">="

number "number"
  = negative: "-"? number:[0-9]+ decimal: (
  point: "." decimal: [0-9]+ { return "." + decimal.join('') }
)? { return `${negative ?? ''}${number.join('')}${decimal ?? ''}` }

string "string"
  = value: ["a-zA-Z0-9_]+ { return value.join('') }

comma ","
  = _ "," _

required_whitespace "whitespace"
  = value: [ \t\n\r]+ { return value.join('') }
  
_ "whitespace"
  = value: [ \t\n\r]* { return value.join('') }