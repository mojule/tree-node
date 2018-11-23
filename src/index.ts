import { is } from '@mojule/is'
import * as SymbolTree from 'symbol-tree'

export const valueSymbol = Symbol( 'Mojule node value' )
export const apiSymbol = Symbol( 'Mojule node API' )

const tree = new SymbolTree( 'Mojule node' )
const toApi = nodeValue => nodeValue[ apiSymbol ]

export interface TreeNodeOptions<T> {
  extend?: (
    node: TreeNode<T>,
    nodeValue: T,
    tree,
    valueSymbol: Symbol,
    apiSymbol: Symbol
  ) => void
}

export type NullableTreeNode<T> = TreeNode<T> | null

export interface TreeNode<T> {
  value: T
  readonly firstChild: NullableTreeNode<T>
  readonly lastChild: NullableTreeNode<T>
  readonly previousSibling: NullableTreeNode<T>
  readonly nextSibling: NullableTreeNode<T>
  readonly parentNode: NullableTreeNode<T>
  readonly childNodes: TreeNode<T>[]
  readonly ancestorNodes: TreeNode<T>[]
  readonly index: number
  hasChildNodes: () => boolean
  remove: () => TreeNode<T>
  removeChild: ( child: TreeNode<T> ) => TreeNode<T>
  insertBefore: ( newNode: TreeNode<T>, referenceNode: TreeNode<T> ) =>
    TreeNode<T>
  insertAfter: ( newNode: TreeNode<T>, referenceNode: TreeNode<T> ) =>
    TreeNode<T>
  prependChild: ( child: TreeNode<T> ) => TreeNode<T>
  appendChild: ( child: TreeNode<T> ) => TreeNode<T>
}

export const isTreeNode = <T>( value ): value is TreeNode<T> =>
  value && value[ valueSymbol ]

export const createNode = <T>( value: T, options: TreeNodeOptions<T> = {} ) => {
  const { extend } = options

  const nodeValue = { value }

  tree.initialize( nodeValue )

  const ensureParent = child => {
    const parent = tree.parent( child[ valueSymbol ] )

    if ( parent !== nodeValue )
      throw Error( 'Not a child of this node' )
  }

  const node: TreeNode<T> = {
    get value() {
      return nodeValue.value
    },
    set value( newValue ) {
      nodeValue.value = newValue
    },
    get firstChild() {
      if ( !tree.hasChildren( nodeValue ) ) return null

      return tree.firstChild( nodeValue )[ apiSymbol ]
    },
    get lastChild() {
      if ( !tree.hasChildren( nodeValue ) ) return null

      return tree.lastChild( nodeValue )[ apiSymbol ]
    },
    get previousSibling() {
      const previous = tree.previousSibling( nodeValue )

      if ( !previous ) return null

      return previous[ apiSymbol ]
    },
    get nextSibling() {
      const next = tree.nextSibling( nodeValue )

      if ( !next ) return null

      return next[ apiSymbol ]
    },
    get parentNode() {
      const parent = tree.parent( nodeValue )

      if ( !parent ) return null

      return parent[ apiSymbol ]
    },
    get childNodes() {
      return tree.childrenToArray( nodeValue ).map( toApi )
    },
    get ancestorNodes() {
      return tree.ancestorsToArray( nodeValue ).map( toApi )
    },
    get index() {
      return tree.index( nodeValue )
    },
    hasChildNodes: () => tree.hasChildren( nodeValue ),
    remove: () => toApi( tree.remove( nodeValue ) ),
    removeChild: child => {
      ensureParent( child )

      return toApi( tree.remove( child[ valueSymbol ] ) )
    },
    insertBefore: ( newNode, referenceNode ) => {
      ensureParent( referenceNode )

      tree.remove( newNode[ valueSymbol ] )

      return toApi( tree.insertBefore(
        referenceNode[ valueSymbol ], newNode[ valueSymbol ]
      ) )
    },
    insertAfter: ( newNode, referenceNode ) => {
      ensureParent( referenceNode )

      tree.remove( newNode[ valueSymbol ] )

      return toApi( tree.insertAfter(
        referenceNode[ valueSymbol ], newNode[ valueSymbol ]
      ) )
    },
    prependChild: newNode => {
      tree.remove( newNode[ valueSymbol ] )

      return toApi( tree.prependChild( nodeValue, newNode[ valueSymbol ] ) )
    },
    appendChild: newNode => {
      tree.remove( newNode[ valueSymbol ] )

      return toApi( tree.appendChild( nodeValue, newNode[ valueSymbol ] ) )
    }
  }

  node[ valueSymbol ] = nodeValue
  nodeValue[ apiSymbol ] = node

  if ( is.function( extend ) )
    extend( node, nodeValue, tree, valueSymbol, apiSymbol )

  return node
}
