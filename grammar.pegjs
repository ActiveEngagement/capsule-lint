{{
  // Flatten a nested match result into the raw source string it covers.
  function join(value) {
    return value.flat(Infinity).filter(Boolean).join('');
  }
}}

start
  = (comment / if / list / switch / attempt / userblock / macro / function / items / assign / directive / macrocall / tag / text)*

comment
  = &"<#--" value:("<#--" (!"-->" .)* "-->") { return value.flat(Infinity).join('') }

text "text"
  = value: char+ { return value.join('') }

char "string"
  = (!("</#" / "<#" / "</@" / "<@" / "${")) value:. { return value }

tag
  = &"${" value: ("${" _ tag_expression _ "}") { return value.flat(Infinity).join('') }

if
  = (openif / elseif / else / endif)

openif
  = &"<#if" value:("<#if" required_whitespace expression ">") { return value.flat(Infinity).filter(Boolean).join('') }

elseif
  = &"<#elseif" value: ("<#elseif" required_whitespace expression ">") { return value.flat(Infinity).filter(Boolean).join('') }

else
  = &"<#else" value: "<#else>" { return value }

endif
  = &"</#if" value: "</#if>" { return value }

list
  = openlist / endlist / sep

// The `as` clause is optional to allow the <#list xs><#items as x>...</#items>
// form introduced in FreeMarker 2.3.23.
openlist
  = &"<#list" value:("<#list" required_whitespace variable (required_whitespace "as" required_whitespace variable (comma variable)?)? _ ">") { return value.flat(Infinity).filter(Boolean).join('') }

endlist
  = &"</#list" value: "</#list>" { return value }

// Separator directive used between <#list> iterations.
sep
  = &"<#sep" value:("<#sep" _ "/"? ">") { return join(value) }
  / &"</#sep" value:"</#sep>" { return value }

// Loop grouping directive used inside <#list ...></#list> blocks.
items
  = openitems / enditems

openitems
  = &"<#items" value:("<#items" required_whitespace "as" required_whitespace variable (comma variable)? _ ">") { return join(value) }

enditems
  = &"</#items" value:"</#items>" { return value }

assign
  = &"<#assign" value:("<#assign" required_whitespace assignment (_ assignment)* _ ">") { return join(value) }
  / &"<#local" value:("<#local" required_whitespace assignment (_ assignment)* _ ">") { return join(value) }
  / &"<#global" value:("<#global" required_whitespace assignment (_ assignment)* _ ">") { return join(value) }

// A single `name = expression` pair. Multiple pairs may appear on one directive;
// the trailing `_` of `expression` absorbs the whitespace between them, so the
// separator between assignments is optional whitespace rather than required.
assignment
  = variable _ "=" _ expression

// #switch / #case / #default / #break blocks.
switch
  = openswitch / case / defaultcase / endswitch / break

openswitch
  = &"<#switch" value:("<#switch" required_whitespace expression _ ">") { return join(value) }

case
  = &"<#case" value:("<#case" required_whitespace expression _ ">") { return join(value) }

defaultcase
  = &"<#default" value:"<#default>" { return value }

endswitch
  = &"</#switch" value:"</#switch>" { return value }

break
  = &"<#break" value:("<#break" _ "/"? ">") { return join(value) }

// #macro / #nested / #return.
macro
  = openmacro / endmacro / nested / return

openmacro
  = &"<#macro" value:("<#macro" required_whitespace varname macro_params _ ">") { return join(value) }

endmacro
  = &"</#macro" value:"</#macro>" { return value }

// #function / </#function>.
function
  = openfunction / endfunction

openfunction
  = &"<#function" value:("<#function" required_whitespace varname macro_params _ ">") { return join(value) }

endfunction
  = &"</#function" value:"</#function>" { return value }

macro_params
  = (_ macro_param)*

macro_param
  = varname "..."? (_ "=" _ expression)?

nested
  = &"<#nested" value:("<#nested" (required_whitespace expression (comma expression)*)? _ ">") { return join(value) }

return
  = &"<#return" value:("<#return" (required_whitespace expression)? _ ">") { return join(value) }

// #attempt / #recover.
attempt
  = value:("<#attempt>" / "</#attempt>" / "<#recover>") { return value }

// Block directives whose bodies we treat opaquely: escape/noescape,
// autoesc/noautoesc, compress, noparse and outputformat.
userblock
  = openescape / openoutputformat
  / value:(
      "<#noescape>" / "</#noescape>"
      / "<#noautoesc>" / "</#noautoesc>"
      / "<#autoesc>" / "</#autoesc>"
      / "<#compress>" / "</#compress>"
      / "<#noparse>" / "</#noparse>"
      / "</#escape>" / "</#outputformat>"
    ) { return value }

openescape
  = &"<#escape" value:("<#escape" required_whitespace variable required_whitespace "as" required_whitespace expression ">") { return join(value) }

openoutputformat
  = &"<#outputformat" value:("<#outputformat" required_whitespace expression _ ">") { return join(value) }

// Remaining single directives that carry (optional) expressions or options.
directive
  = include / import / setting / stop / flush / continue / visit / recurse / whitespace_directive

include
  = &"<#include" value:("<#include" required_whitespace expression (_ varname _ "=" _ expression)* _ "/"? ">") { return join(value) }

import
  = &"<#import" value:("<#import" required_whitespace variable required_whitespace "as" required_whitespace varname _ ">") { return join(value) }

setting
  = &"<#setting" value:("<#setting" required_whitespace varname _ "=" _ expression ">") { return join(value) }

stop
  = &"<#stop" value:("<#stop" (required_whitespace expression)? _ ">") { return join(value) }

flush
  = &"<#flush" value:("<#flush" _ "/"? ">") { return join(value) }

continue
  = &"<#continue" value:("<#continue" _ "/"? ">") { return join(value) }

visit
  = &"<#visit" value:("<#visit" required_whitespace expression _ ">") { return join(value) }

recurse
  = &"<#recurse" value:("<#recurse" (required_whitespace expression)? _ ">") { return join(value) }

whitespace_directive
  = value:("<#nt>" / "<#lt>" / "<#rt>" / "<#t>" / "<#fallback>") { return value }

// User-defined directive / macro invocation, e.g. <@button label="x" /> or
// <@my.macro>...</@my.macro>. The argument list is consumed permissively (up to
// the closing `>`), honoring quoted strings and ${...} interpolations so a `>`
// inside them does not close the tag.
macrocall
  = openmacrocall / closemacrocall

openmacrocall
  = &"<@" value:("<@" macro_name macrocall_body "/"? ">") { return join(value) }

closemacrocall
  = &"</@" value:("</@" macro_name? _ ">") { return join(value) }

macro_name
  = varname (("." / ":") varname)*

macrocall_body
  = (encapsulated_string / tag / (!">" .))*

tag_expression "expression"
  = value: ("!"? "(" _ unsafe_expression _ ")" variable_notation default_operator? (_ unsafe_operator _ expression)* / unsafe_expression) _ {
  return value.flat(Infinity).join('')
}

expression "expression"
  = value: (("!"? "(" _ unsafe_expression _ ")" variable_notation default_operator? / safe_expression) _ (safe_operator _ expression)?) _ {
  return value.flat(Infinity).join('')
}

unsafe_expression "equation"
  = "!"? variable default_operator? (_ unsafe_operator _ (expression))*

safe_expression "equation"
  = "!"? variable default_operator? (_ safe_operator _ (expression))*

// FreeMarker default (`!`) and exists (`??`) operators. The `!"="` guard keeps
// the default operator from swallowing the `!=` comparison operator.
default_operator
  = _ "??"
  / _ "!" !"=" (_ default_value)?

default_value
  = "(" _ expression _ ")"
  / variable

variable
  = value: (
  	("." / number / encapsulated_string / sequence_literal / hash_literal / varname / html_entity) variable_notation
  )* {
    return Array.isArray(value) ? value.flat(Infinity).join('') : value;
  }

variable_notation = (("." varname) / array_expression / modifier_expression / args)*

array_expression
  = "[" expression "]"

// Sequence literal, e.g. ["a", "b", 1].
sequence_literal
  = "[" _ (expression (comma expression)*)? _ "]"

// Hash literal, e.g. {"color": "red", "size": 10}.
hash_literal
  = "{" _ (hash_entry (comma hash_entry)*)? _ "}"

hash_entry
  = _ (encapsulated_string / varname) _ ":" _ expression _

modifier_expression
  = "?" modifier args?

modifier "modifier"
  = varname

args = "(" arg? (comma arg)* ")"

arg "expression"
  = _ expression _

safe_operator "operator"
  = "=="
  / "!="
  / "<="
  / "<"
  / "gt"
  / "&gt;"
  / "gte"
  / "&gte;"
  / "lt"
  / "&lt;"
  / "lte"
  / "&lte;"
  / "&&"
  / "||"
  / "+"
  / "-"
  / "*"
  / "/"
  / "%"
  / "="

unsafe_operator "operator"
  = safe_operator
  / ">="
  / ">"

number "number"
  = negative: "-"? number:[0-9]+ decimal: (
  point: "." decimal: [0-9]+ { return "." + decimal.join('') }
)? { return `${negative ?? ''}${number.join('')}${decimal ?? ''}` }

encapsulated_string
  =  &('"'/"'") value: (
      ('"' (!'"' .)* '"') / ("'" ((!"'" .)*) "'")
  ) { return value.flat(2).join('') }

varname
  = value: [a-zA-Z0-9_]+ { return value.join('') }

html_entity
  = a: "&" b: [a-zA-Z0-9_]+ c:";" { return [a, ...b, c].join('') }

comma ","
  = _ "," _

required_whitespace "whitespace"
  = value: [ \t\n\r]+ { return value.join('') }

_ "whitespace"
  = value: [ \t\n\r]* { return value.join('') }
