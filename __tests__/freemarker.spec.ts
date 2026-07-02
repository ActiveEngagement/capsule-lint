import { parse } from '../src/parser';

test('that the following freemarker syntax will parse', () => {
    expect(parse('before<#if a></#if>after')).toEqual([
        'before',
        '<#if a>',
        '</#if>',
        'after'
    ]);

    expect(parse('<#if a>b></#if>')).toEqual([
        '<#if a>',
        'b>',
        '</#if>'
    ]);

    expect(parse('<#if (a>b)></#if>')).toEqual([
        '<#if (a>b)>',
        '</#if>'
    ]);

    expect(parse('<#if (a>b)><#if (b>d)>inner</#if></#if>')).toEqual([
        '<#if (a>b)>',
        '<#if (b>d)>',
        'inner',
        '</#if>',
        '</#if>'
    ]);

    expect(parse('before${Recipient.unsubscribe()}after')).toEqual([
        'before',
        '${Recipient.unsubscribe()}',
        'after'
    ]);

    expect(parse('${foo.bar() + Recipient.unsubscribe()}')).toEqual([
        '${foo.bar() + Recipient.unsubscribe()}'
    ]);

    expect(parse('<#if a + b == c < 3 + d()>inner</#if>')).toEqual([
        '<#if a + b == c < 3 + d()>',
        'inner',
        '</#if>'
    ]);

    expect(parse('${"test\'s"?test().a() && b < 2 || true}')).toEqual([
        '${"test\'s"?test().a() && b < 2 || true}'
    ]);

    expect(parse('<#if a() && foo.bar()?trim>')).toEqual([
        '<#if a() && foo.bar()?trim>'
    ]);

    expect(parse('<#if (Recipient.FirstName?has_content) && (Recipient.FirstName?trim?length > 0)>${Recipient.FirstName}<#else>Fellow American</#if>')).toEqual([
        '<#if (Recipient.FirstName?has_content) && (Recipient.FirstName?trim?length > 0)>',
        '${Recipient.FirstName}',
        '<#else>',
        'Fellow American',
        '</#if>',
    ]);

    expect(parse('<#list a.b.c as foo>${foo.test}</#list>')).toEqual([
        '<#list a.b.c as foo>',
        '${foo.test}',
        '</#list>',
    ]);

    expect(parse('<#if (Recipient.showUnsub=\'true\' )>')).toEqual([
        '<#if (Recipient.showUnsub=\'true\' )>'
    ]);

    expect(parse('<#if (Recipient.showUnsub="true" )>')).toEqual([
        '<#if (Recipient.showUnsub="true" )>'
    ]);

    expect(parse('${.now?foo?bar}')).toEqual([
        '${.now?foo?bar}'
    ]);

    expect(parse("${Gears.track('${test[0].foo.bar?test}')}")).toEqual([
        "${Gears.track('${test[0].foo.bar?test}')}"
    ]);
})

test('that parenthesized expressions with modifiers parse correctly', () => {
    // Main reported bug: (expr)?modifier in tag interpolation
    expect(parse('${(hpcAmount?number*0.5)?round}')).toEqual([
        '${(hpcAmount?number*0.5)?round}'
    ]);

    // Multiple chained modifiers after paren group
    expect(parse('${(hpcAmount?number*0.5)?round?string}')).toEqual([
        '${(hpcAmount?number*0.5)?round?string}'
    ]);

    // Paren group with ?c (common FreeMarker built-in)
    expect(parse('${(amount * 100)?c}')).toEqual([
        '${(amount * 100)?c}'
    ]);

    // Paren group without modifier (should still work)
    expect(parse('${(foo?upper_case)}')).toEqual([
        '${(foo?upper_case)}'
    ]);

    // Paren expression in <#if> condition with modifier
    expect(parse('<#if (x + y)?has_content>inner</#if>')).toEqual([
        '<#if (x + y)?has_content>',
        'inner',
        '</#if>'
    ]);

    // Paren expression in elseif with modifier
    expect(parse('<#if a><#elseif (b + c)?has_content>inner</#if>')).toEqual([
        '<#if a>',
        '<#elseif (b + c)?has_content>',
        'inner',
        '</#if>'
    ]);
})

test('that negative number literals parse correctly', () => {
    expect(parse('${-5}')).toEqual([
        '${-5}'
    ]);

    expect(parse('${amount + -1}')).toEqual([
        '${amount + -1}'
    ]);

    expect(parse('<#if score gt -1>content</#if>')).toEqual([
        '<#if score gt -1>',
        'content',
        '</#if>'
    ]);
})

test('that FreeMarker comments parse correctly', () => {
    expect(parse('<#-- this is a comment -->')).toEqual([
        '<#-- this is a comment -->'
    ]);

    expect(parse('before<#-- comment -->after')).toEqual([
        'before',
        '<#-- comment -->',
        'after'
    ]);

    expect(parse('<#-- multi\nline\ncomment -->${foo}')).toEqual([
        '<#-- multi\nline\ncomment -->',
        '${foo}'
    ]);

    expect(parse('<#if a><#-- conditional comment --></#if>')).toEqual([
        '<#if a>',
        '<#-- conditional comment -->',
        '</#if>'
    ]);
})

test('that parenthesized expression as left operand of arithmetic parses', () => {
    expect(parse('${(fee * 0.5 + base) * rate}')).toEqual([
        '${(fee * 0.5 + base) * rate}'
    ]);

    expect(parse('${(a + b) * c}')).toEqual([
        '${(a + b) * c}'
    ]);

    expect(parse('${(hpcAmount?number * 0.5)?round * 100}')).toEqual([
        '${(hpcAmount?number * 0.5)?round * 100}'
    ]);
})

test('that <#list> with trailing whitespace before > parses correctly', () => {
    expect(parse('<#list items as item >${item}</#list>')).toEqual([
        '<#list items as item >',
        '${item}',
        '</#list>'
    ]);

    expect(parse('<#list a.b.c as foo >${foo.test}</#list>')).toEqual([
        '<#list a.b.c as foo >',
        '${foo.test}',
        '</#list>'
    ]);
})

test('that <#local> and <#global> assignment directives parse correctly', () => {
    expect(parse('<#local x = 42>')).toEqual([
        '<#local x = 42>'
    ]);

    expect(parse('<#global greeting = "Hello">')).toEqual([
        '<#global greeting = "Hello">'
    ]);

    expect(parse('<#local total = price * quantity>${total}</#if>')).toEqual([
        '<#local total = price * quantity>',
        '${total}',
        '</#if>'
    ]);
})

test('that modulo operator parses correctly', () => {
    expect(parse('${count % 2}')).toEqual([
        '${count % 2}'
    ]);

    expect(parse('<#if index % 2 == 0>even</#if>')).toEqual([
        '<#if index % 2 == 0>',
        'even',
        '</#if>'
    ]);
})

test('that the default (!) and exists (??) operators parse correctly', () => {
    expect(parse('${user.name!"Friend"}')).toEqual([
        '${user.name!"Friend"}'
    ]);

    expect(parse('${user.name!}')).toEqual([
        '${user.name!}'
    ]);

    expect(parse('${(cart.total)!0}')).toEqual([
        '${(cart.total)!0}'
    ]);

    expect(parse('<#if user.name??>content</#if>')).toEqual([
        '<#if user.name??>',
        'content',
        '</#if>'
    ]);

    // The default operator must not swallow the != comparison operator.
    expect(parse('<#if a != b>x</#if>')).toEqual([
        '<#if a != b>',
        'x',
        '</#if>'
    ]);

    expect(parse('<#if a!=b>x</#if>')).toEqual([
        '<#if a!=b>',
        'x',
        '</#if>'
    ]);
})

test('that sequence and hash literals parse correctly', () => {
    expect(parse('<#assign items = ["one", "two", "three"]>')).toEqual([
        '<#assign items = ["one", "two", "three"]>'
    ]);

    expect(parse('<#assign config = {"color": "red", "size": 10}>')).toEqual([
        '<#assign config = {"color": "red", "size": 10}>'
    ]);

    expect(parse('<#list ["red", "green", "blue"] as color>${color}</#list>')).toEqual([
        '<#list ["red", "green", "blue"] as color>',
        '${color}',
        '</#list>'
    ]);

    expect(parse('${[1, 2, 3]?size}')).toEqual([
        '${[1, 2, 3]?size}'
    ]);
})

test('that multiple assignments on one directive parse correctly', () => {
    expect(parse('<#assign x = 1 y = 2>')).toEqual([
        '<#assign x = 1 y = 2>'
    ]);
})

test('that switch/case/default/break directives parse correctly', () => {
    expect(parse('<#switch plan><#case "pro">Pro<#break><#default>Free</#switch>')).toEqual([
        '<#switch plan>',
        '<#case "pro">',
        'Pro',
        '<#break>',
        '<#default>',
        'Free',
        '</#switch>'
    ]);
})

test('that macro, function, nested and return directives parse correctly', () => {
    expect(parse('<#macro button label href color="blue">${label}</#macro>')).toEqual([
        '<#macro button label href color="blue">',
        '${label}',
        '</#macro>'
    ]);

    expect(parse('<#function square x><#return x * x></#function>')).toEqual([
        '<#function square x>',
        '<#return x * x>',
        '</#function>'
    ]);

    expect(parse('<#macro wrapper><#nested></#macro>')).toEqual([
        '<#macro wrapper>',
        '<#nested>',
        '</#macro>'
    ]);
})

test('that include, import and setting directives parse correctly', () => {
    expect(parse('<#include "header.ftl">')).toEqual([
        '<#include "header.ftl">'
    ]);

    expect(parse('<#import "/lib/utils.ftl" as utils>${utils.foo()}')).toEqual([
        '<#import "/lib/utils.ftl" as utils>',
        '${utils.foo()}'
    ]);

    expect(parse('<#setting number_format = "0.##">')).toEqual([
        '<#setting number_format = "0.##">'
    ]);
})

test('that user-directive (macro call) invocations parse correctly', () => {
    expect(parse('<@button label="Donate" href="${donateUrl}" color="green" />')).toEqual([
        '<@button label="Donate" href="${donateUrl}" color="green" />'
    ]);

    expect(parse('<@my.macro>body</@my.macro>')).toEqual([
        '<@my.macro>',
        'body',
        '</@my.macro>'
    ]);

    expect(parse('<@greet name="World" />')).toEqual([
        '<@greet name="World" />'
    ]);
})

test('that #items and #sep directives parse correctly', () => {
    expect(parse('<#list users><#items as user>${user}</#items></#list>')).toEqual([
        '<#list users>',
        '<#items as user>',
        '${user}',
        '</#items>',
        '</#list>'
    ]);

    expect(parse('<#list items as i>${i}<#sep>, </#list>')).toEqual([
        '<#list items as i>',
        '${i}',
        '<#sep>',
        ', ',
        '</#list>'
    ]);

    expect(parse('<#list map as k, v>${k}=${v}</#list>')).toEqual([
        '<#list map as k, v>',
        '${k}',
        '=',
        '${v}',
        '</#list>'
    ]);
})

test('that #attempt / #recover directives parse correctly', () => {
    expect(parse('<#attempt>${risky}<#recover>fallback</#attempt>')).toEqual([
        '<#attempt>',
        '${risky}',
        '<#recover>',
        'fallback',
        '</#attempt>'
    ]);
})

test('that #escape / #noescape / #autoesc directives parse correctly', () => {
    expect(parse('<#escape x as x?html>${name}</#escape>')).toEqual([
        '<#escape x as x?html>',
        '${name}',
        '</#escape>'
    ]);

    expect(parse('<#noescape>${raw}</#noescape>')).toEqual([
        '<#noescape>',
        '${raw}',
        '</#noescape>'
    ]);

    expect(parse('<#autoesc>${x}</#autoesc>')).toEqual([
        '<#autoesc>',
        '${x}',
        '</#autoesc>'
    ]);

    expect(parse('<#noautoesc>${x}</#noautoesc>')).toEqual([
        '<#noautoesc>',
        '${x}',
        '</#noautoesc>'
    ]);
})

test('that #compress, #noparse and #outputformat directives parse correctly', () => {
    expect(parse('<#compress>${x}</#compress>')).toEqual([
        '<#compress>',
        '${x}',
        '</#compress>'
    ]);

    expect(parse('<#noparse>${x}</#noparse>')).toEqual([
        '<#noparse>',
        '${x}',
        '</#noparse>'
    ]);

    expect(parse('<#outputformat "HTML">${x}</#outputformat>')).toEqual([
        '<#outputformat "HTML">',
        '${x}',
        '</#outputformat>'
    ]);
})

test('that #stop, #flush, #continue, #visit and #recurse directives parse correctly', () => {
    expect(parse('<#stop "fatal error">')).toEqual([
        '<#stop "fatal error">'
    ]);

    expect(parse('<#stop>')).toEqual([
        '<#stop>'
    ]);

    expect(parse('<#flush>')).toEqual([
        '<#flush>'
    ]);

    expect(parse('<#list items as i><#if i.skip><#continue></#if>${i}</#list>')).toEqual([
        '<#list items as i>',
        '<#if i.skip>',
        '<#continue>',
        '</#if>',
        '${i}',
        '</#list>'
    ]);

    expect(parse('<#visit node>')).toEqual([
        '<#visit node>'
    ]);

    expect(parse('<#recurse node>')).toEqual([
        '<#recurse node>'
    ]);

    expect(parse('<#recurse>')).toEqual([
        '<#recurse>'
    ]);
})

test('that whitespace-control directives parse correctly', () => {
    expect(parse('${a}<#t>${b}<#lt>${c}<#rt>${d}<#nt>')).toEqual([
        '${a}',
        '<#t>',
        '${b}',
        '<#lt>',
        '${c}',
        '<#rt>',
        '${d}',
        '<#nt>'
    ]);

    expect(parse('<#macro m><#fallback></#macro>')).toEqual([
        '<#macro m>',
        '<#fallback>',
        '</#macro>'
    ]);
})

test('that self-closing directive syntax parses correctly', () => {
    expect(parse('<#break/>')).toEqual([
        '<#break/>'
    ]);

    expect(parse('<#include "x.ftl" />')).toEqual([
        '<#include "x.ftl" />'
    ]);
})