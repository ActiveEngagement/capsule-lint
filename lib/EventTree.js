const EMPTY_TAGS = [
    'area', 'base', 'basefont', 'br', 'col', 'frame', 'hr', 'img', 'input',
    'isindex', 'link', 'meta', 'param', 'embed', 'track', 'command', 'source',
    'keygen', 'wbr'
];

class EventNode {
    constructor(event, parent) {
        event = event || {};

        const tagName = event.tagName && event.tagName.toLowerCase();

        this.children = [];

        if(this.root === parent) {
            this.root = true;
        }
        else {
            this.closed = !!event.close || EMPTY_TAGS.indexOf(tagName) > -1;
            this.parent = parent;
            this.tagName = tagName;
            this.attrs = event.attrs;
            this.from = event.pos;
            this.to = null;
            this.col = event.col;
            this.line = event.line;
            this.raw = event.raw;
        }
    }

    get depth() {
        let depth = 0, el = this.parent;

        while(el.parent) {
            depth++;

            el = el.parent;
        }
        
        return depth;
    }
    
    close(event, reporter) {
        this.to = event.pos + event.raw.length;
        this.raw = reporter.html.slice(this.from, this.to);
    }

    push(event) {
        return this.children.push(event);
    }

    before(index) {
        return this.children.slice(0, index);
    }

    after(index) {
        return this.children.slice(index + 1);
    }

    find(...args) {
        const find = children => {
            return children.reduce((carry, child) => {
                if(child.match(...args)) {
                    carry.push(child);
                }

                if(child.children.length) {
                    carry = carry.concat(find(child.children));
                }

                return carry;
            }, []);
        };

        return find(this.children);
    }

    findFirst(tagName) {
        return this.find(tagName)[0];
    }

    index() {
        return this.parent ? this.parent.children.indexOf(this) : 0;
    }

    isChildOf(subject) {
        return this.parent === subject;
    }

    isBefore(subject) {
        return this.index() < subject.index();
    }

    isAfter(subject) {
        return this.index() > subject.index();
    }

    isFirst() {
        return !this.parent || this.index() === 0;
    }

    isLast() {
        return !this.parent || this.index() === this.parent.children.length - 1;
    }
    
    first() {
        return this.children[0];
    }

    match(...args) {
        return args.indexOf(this.tagName && this.tagName.toLowerCase()) > -1;
    }

};

class EventTree {
    constructor(parser, reporter, finish) {
        this.reporter = reporter;

        const stack = [], root = new EventNode();
        
        let parentNode = root;

        parser.addListener('tagstart', event => {
            const node = new EventNode(event, parentNode);

            parentNode.push(node);

            if(!node.closed) {
                stack.push(parentNode = node);
            }
        });

        parser.addListener('tagend', event => {
            const tagName = event.tagName.toLowerCase();
            
            let pos;

            for(pos = stack.length - 1; pos >= 0; pos--) {
                if(stack[pos].tagName === tagName) {
                    break;
                }
            }

            if(stack[pos]) {
                stack[pos].close(event, this.reporter);

                parentNode = stack[pos].parent;
                
                stack.splice(pos, 1);
            }
        });

        parser.addListener('end', event => {
            root.closed = true;
            
            finish && finish(root);
        });
    }
};

module.exports = {
    EventNode,
    EventTree
}