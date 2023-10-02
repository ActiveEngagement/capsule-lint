start
  = (conditional / tag / text)*
  
text
  = value: char+ { return value.join('') }

char "string"
  = (!("<#"/"<#"/"</#"/"${")) value:. { return value } 

tag
  = &"${" value: ("${" _ tag_expression _ "}") { return value.flat(Infinity).join('') }

conditional
  = value: (if / elseif / else / endif)
  
if
  = &"<#if" value:("<#if" required_whitespace expression ">") { return value.flat(Infinity).filter(Boolean).join('') }

elseif
  = &"<#elseif" value: ("<#elseif" required_whitespace expression ">") { return value.flat(Infinity).filter(Boolean).join('') }

else
  = &"<#else" value: "<#else>" { return value }
  
endif
  = &"</#if" value: "</#if>" { return value }

tag_expression "expression"
  = ("(" _ unsafe_expression _ ")" / unsafe_expression) _ (unsafe_operator tag_expression)* modifier_expression*

expression "expression"
  = value: ("(" _ unsafe_expression _ ")" / safe_expression) _ {
  return value.flat(Infinity).join('')
}

unsafe_expression "equation"
  = variable (_ unsafe_operator _ (variable/expression))*
    
safe_expression "equation"
  = variable (_ safe_operator _ (variable/expression))*

variable
  = value: (string ("." string)* ((args? "."? variable)/(modifier_expression*))) {
    return value.flat(Infinity).join('')
  }

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