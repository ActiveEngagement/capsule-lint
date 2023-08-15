import { HTMLParser, Reporter } from "htmlhint";
import { Attr, Block } from "htmlhint/htmlparser";
declare class EventNode {
    event?: Block;
    parent?: EventNode;
    children: EventNode[];
    closed: boolean;
    root: EventNode;
    tagName?: string;
    attrs: Attr[];
    from?: number;
    to?: number;
    col?: number;
    line?: number;
    raw?: string;
    constructor(event?: Block, parent?: EventNode);
    get depth(): number;
    close(event: any, reporter: any): void;
    push(event: any): number;
    before(index: any): EventNode[];
    after(index: any): EventNode[];
    find(...args: any[]): any;
    findFirst(tagName: any): any;
    index(): number;
    isChildOf(subject: any): boolean;
    isBefore(subject: any): boolean;
    isAfter(subject: any): boolean;
    isFirst(): boolean;
    isLast(): boolean;
    first(): EventNode;
    match(...args: any[]): boolean;
}
declare class EventTree {
    parser: HTMLParser;
    reporter: Reporter;
    constructor(parser: HTMLParser, reporter: Reporter, callack?: (root: EventNode) => void);
}
export { EventNode, EventTree };
