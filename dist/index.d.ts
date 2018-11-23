export declare const valueSymbol: unique symbol;
export declare const apiSymbol: unique symbol;
export interface TreeNodeOptions<T> {
    extend?: (node: TreeNode<T>, nodeValue?: T, tree?: any, valueSymbol?: Symbol, apiSymbol?: Symbol) => void;
}
export declare type NullableTreeNode<T> = TreeNode<T> | null;
export interface TreeNode<T> {
    value: T;
    readonly firstChild: NullableTreeNode<T>;
    readonly lastChild: NullableTreeNode<T>;
    readonly previousSibling: NullableTreeNode<T>;
    readonly nextSibling: NullableTreeNode<T>;
    readonly parentNode: NullableTreeNode<T>;
    readonly childNodes: TreeNode<T>[];
    readonly ancestorNodes: TreeNode<T>[];
    readonly index: number;
    hasChildNodes: () => boolean;
    remove: () => TreeNode<T>;
    removeChild: (child: TreeNode<T>) => TreeNode<T>;
    insertBefore: (newNode: TreeNode<T>, referenceNode: TreeNode<T>) => TreeNode<T>;
    insertAfter: (newNode: TreeNode<T>, referenceNode: TreeNode<T>) => TreeNode<T>;
    prependChild: (child: TreeNode<T>) => TreeNode<T>;
    appendChild: (child: TreeNode<T>) => TreeNode<T>;
}
export declare const isTreeNode: <T>(value: any) => value is TreeNode<T>;
export declare const createNode: <T>(value: T, options?: TreeNodeOptions<T>) => TreeNode<T>;
