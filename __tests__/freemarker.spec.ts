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