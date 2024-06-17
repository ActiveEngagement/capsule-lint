start = ternary / expression

array
  = value: (
    ("[" (assoc_array_value/array_value)? ("," (assoc_array_value/array_value/array))* "]")
  ) { return value.flat(Infinity).join('') }

array_value = _ expression/array _
assoc_array_value = _ expression _ "=>" _ (expression/array)

ternary "ternary"
  = &(expression "?") value: (expression _ "?" _ expression _ ":" _ expression) {
	return value.flat(1).join('')  
  }

arguments
  = value: ((array/expression) _ ("," _ arguments)*) { return value.flat(Infinity).join('') }

function
  = value: ((member / variable) "(" (arguments)? ")" chain) {
  	return value.flat(Infinity).join('')
  }

expression "expression"
  = value: (
    (("("expression")") / (number / string / variable / function / boolean)) _ (operator _ expression)?
  ){ return value.flat(Infinity).join('') }

boolean = "true" / "false"

chain
  = value: ("->" (function/member))* {
    return value.flat(Infinity).join('')
  }

variable "variable"
  = value: ("$" member chain) {
    return value.flat(Infinity).join('')
  }

member "member"
  = value: ([a-zA-Z_] [a-zA-Z0-9_]*) { return value.flat(1).join('') }

operator "operator"
  = ">="
  / ">"
  / "<="
  / "<"
  / "==="
  / "==" 
  / "!=" 
  / "++"  
  / "+" 
  / "--" 
  / "-" 
  / "/"
  / "*"
  / "&&"
  / "||"

string "string" 
  = &('"'/"'") value: (
      ('"' (!'"' .)* '"') / ("'" ((!"'" .)*) "'")
  ) { return value.flat(2).join('') }

number "number"
  = negative: "-"? number:[0-9]+ decimal: (
  point: "." decimal: [0-9]+ { return "." + decimal.join('') }
)? { return `${negative ?? ''}${number.join('')}${decimal ?? ''}` }

required_whitespace "whitespace"
  = value: [ \t\n\r]+ { return value.join('') }
  
_ "whitespace"
  = value: [ \t\n\r]* { return value.join('') }