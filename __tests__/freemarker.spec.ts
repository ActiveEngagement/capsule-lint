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
})