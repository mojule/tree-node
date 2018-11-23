"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_1 = require("@mojule/is");
const SymbolTree = require("symbol-tree");
exports.valueSymbol = Symbol('Mojule node value');
exports.apiSymbol = Symbol('Mojule node API');
const tree = new SymbolTree('Mojule node');
const toApi = nodeValue => nodeValue[exports.apiSymbol];
exports.isTreeNode = (value) => value && value[exports.valueSymbol];
exports.createNode = (value, options = {}) => {
    const { extend } = options;
    const nodeValue = { value };
    tree.initialize(nodeValue);
    const ensureParent = child => {
        const parent = tree.parent(child[exports.valueSymbol]);
        if (parent !== nodeValue)
            throw Error('Not a child of this node');
    };
    const node = {
        get value() {
            return nodeValue.value;
        },
        set value(newValue) {
            nodeValue.value = newValue;
        },
        get firstChild() {
            if (!tree.hasChildren(nodeValue))
                return null;
            return tree.firstChild(nodeValue)[exports.apiSymbol];
        },
        get lastChild() {
            if (!tree.hasChildren(nodeValue))
                return null;
            return tree.lastChild(nodeValue)[exports.apiSymbol];
        },
        get previousSibling() {
            const previous = tree.previousSibling(nodeValue);
            if (!previous)
                return null;
            return previous[exports.apiSymbol];
        },
        get nextSibling() {
            const next = tree.nextSibling(nodeValue);
            if (!next)
                return null;
            return next[exports.apiSymbol];
        },
        get parentNode() {
            const parent = tree.parent(nodeValue);
            if (!parent)
                return null;
            return parent[exports.apiSymbol];
        },
        get childNodes() {
            return tree.childrenToArray(nodeValue).map(toApi);
        },
        get ancestorNodes() {
            return tree.ancestorsToArray(nodeValue).map(toApi);
        },
        get index() {
            return tree.index(nodeValue);
        },
        hasChildNodes: () => tree.hasChildren(nodeValue),
        remove: () => toApi(tree.remove(nodeValue)),
        removeChild: child => {
            ensureParent(child);
            return toApi(tree.remove(child[exports.valueSymbol]));
        },
        insertBefore: (newNode, referenceNode) => {
            ensureParent(referenceNode);
            tree.remove(newNode[exports.valueSymbol]);
            return toApi(tree.insertBefore(referenceNode[exports.valueSymbol], newNode[exports.valueSymbol]));
        },
        insertAfter: (newNode, referenceNode) => {
            ensureParent(referenceNode);
            tree.remove(newNode[exports.valueSymbol]);
            return toApi(tree.insertAfter(referenceNode[exports.valueSymbol], newNode[exports.valueSymbol]));
        },
        prependChild: newNode => {
            tree.remove(newNode[exports.valueSymbol]);
            return toApi(tree.prependChild(nodeValue, newNode[exports.valueSymbol]));
        },
        appendChild: newNode => {
            tree.remove(newNode[exports.valueSymbol]);
            return toApi(tree.appendChild(nodeValue, newNode[exports.valueSymbol]));
        }
    };
    node[exports.valueSymbol] = nodeValue;
    nodeValue[exports.apiSymbol] = node;
    if (is_1.is.function(extend))
        extend(node, nodeValue, tree, exports.valueSymbol, exports.apiSymbol);
    return node;
};
//# sourceMappingURL=index.js.map