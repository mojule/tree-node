import * as assert from 'assert'
import { createNode, TreeNode, NullableTreeNode, isTreeNode } from '..'

describe( 'Node', () => {
  it( 'creates a node', () => {
    const node = createNode( 'foo' )

    assert( isTreeNode( node ) )
  })

  it( 'gets value', () => {
    const node = createNode( 'foo' )

    assert.strictEqual( node.value, 'foo' )
  })

  it( 'sets value', () => {
    const node = createNode( 'foo' )

    node.value = 'bar'

    assert.strictEqual( node.value, 'bar' )
  })

  it( 'appends child', () => {
    const parent = createNode( 'parent' )
    const child = createNode( 'child' )

    parent.appendChild( child )

    assert.strictEqual( child.parentNode, parent )
    assert.strictEqual( parent.firstChild, child )
  })

  it( 'append moves child', () => {
    const grandparent = createNode( 'grandparent' )
    const parent1 = createNode( 'parent 1' )
    const parent2 = createNode( 'parent 2' )

    grandparent.appendChild( parent1 )
    parent1.appendChild( parent2 )
    grandparent.appendChild( parent2 )

    assert.strictEqual( grandparent.childNodes.length, 2 )
    assert.strictEqual( parent1.parentNode, grandparent )
    assert.strictEqual( parent2.parentNode, grandparent )
    assert.strictEqual( grandparent.firstChild, parent1 )
    assert.strictEqual( grandparent.lastChild, parent2 )
  })

  it( 'prepends child', () => {
    const parent = createNode( 'parent' )

    assert( !parent.hasChildNodes() )

    const child1 = createNode( 'child 1' )
    const child2 = createNode( 'child 2' )

    parent.appendChild( child2 )
    parent.prependChild( child1 )

    assert( parent.hasChildNodes() )
    assert.strictEqual( child1.parentNode, parent )
    assert.strictEqual( parent.firstChild, child1 )
    assert.strictEqual( parent.lastChild, child2 )
    assert.strictEqual( child1.nextSibling, child2 )
    assert.strictEqual( child2.previousSibling, child1 )
    assert.deepEqual( parent.childNodes, [ child1, child2 ] )
    assert.strictEqual( child1.index, 0 )
    assert.strictEqual( child2.index, 1 )
  })

  it( 'prepend moves child', () => {
    const grandparent = createNode( 'grandparent' )
    const parent1 = createNode( 'parent 1' )
    const parent2 = createNode( 'parent 2' )

    grandparent.appendChild( parent2 )
    parent2.appendChild( parent1 )
    grandparent.prependChild( parent1 )

    assert.strictEqual( grandparent.childNodes.length, 2 )
    assert.strictEqual( grandparent.firstChild, parent1 )
    assert.strictEqual( grandparent.lastChild, parent2 )
  })

  it( 'ancestor nodes', () => {
    const grandparent = createNode( 'grandparent' )
    const parent = createNode( 'parent' )
    const child = createNode( 'child' )

    grandparent.appendChild( parent )
    parent.appendChild( child )

    assert.deepEqual( child.ancestorNodes, [ child, parent, grandparent ] )
  })

  it( 'remove', () => {
    const parent = createNode( 'parent' )
    const child = createNode( 'child' )

    parent.appendChild( child )
    const removed = child.remove()

    assert( !parent.hasChildNodes() )
    assert.strictEqual( child, removed )
  })

  it( 'removeChild', () => {
    const parent = createNode( 'parent' )
    const child = createNode( 'child' )

    parent.appendChild( child )
    parent.removeChild( child )

    assert( !parent.hasChildNodes() )
  })

  it( 'insertBefore', () => {
    const parent = createNode( 'parent' )
    const child1 = createNode( 'child 1' )
    const child2 = createNode( 'child 2' )

    parent.appendChild( child2 )
    parent.insertBefore( child1, child2 )

    assert.deepEqual( parent.childNodes, [ child1, child2 ] )
  })

  it( 'insertAfter', () => {
    const parent = createNode( 'parent' )
    const child1 = createNode( 'child 1' )
    const child2 = createNode( 'child 2' )

    parent.appendChild( child1 )
    parent.insertAfter( child2, child1 )

    assert.deepEqual( parent.childNodes, [ child1, child2 ] )
  })

  it( 'ensures parent', () => {
    const parent = createNode( 'parent' )
    const child1 = createNode( 'child 1' )

    assert.throws( () => parent.removeChild( child1 ) )
  })

  it( 'extends', () => {
    interface ExtendedNodeApi<T> extends TreeNode<T> {
      secondChild: () => NullableTreeNode<T>
    }

    const extend = ( node: TreeNode<string> ) => {
      node[ 'secondChild' ] = () => {
        if ( node.firstChild ) return node.firstChild.nextSibling

        return null
      }
    }

    const Node2 = ( value: string ) => <ExtendedNodeApi<string>>createNode( value, { extend } )

    const parent = Node2( 'parent' )
    const child1 = Node2( 'child 1' )
    const child2 = Node2( 'child 2' )

    parent.appendChild( child1 )
    parent.appendChild( child2 )

    assert.strictEqual( parent.secondChild(), child2 )
  })

  it( 'missing parentNode is null', () => {
    const node = createNode( 'node' )

    assert.strictEqual( node.parentNode, null )
  })

  it( 'missing firstChild is null', () => {
    const node = createNode( 'node' )

    assert.strictEqual( node.firstChild, null )
  })

  it( 'missing lastChild is null', () => {
    const node = createNode( 'node' )

    assert.strictEqual( node.lastChild, null )
  })

  it( 'missing previousSibling is null', () => {
    const node = createNode( 'node' )

    assert.strictEqual( node.previousSibling, null )
  })

  it( 'missing nextSibling is null', () => {
    const node = createNode( 'node' )

    assert.strictEqual( node.nextSibling, null )
  })
})
