import { describe, expect, it } from 'vitest'
import {
  demoBinaryTree,
  inorder,
  levelOrder,
  nodeCount,
  postorder,
  preorder,
  treeHeight,
} from '../src/dsa/trees/binary-tree/BinaryTree'
import { BST } from '../src/dsa/trees/bst/BST'

describe('Tree Fundamentals & Binary Search Tree (BST)', () => {
  describe('Binary Tree Fundamentals', () => {
    it('traverses a reference binary tree with four standard orders', () => {
      const root = demoBinaryTree()
      expect(inorder(root)).toEqual([10, 20, 30, 40, 50, 60, 70])
      expect(preorder(root)).toEqual([40, 20, 10, 30, 60, 50, 70])
      expect(postorder(root)).toEqual([10, 30, 20, 50, 70, 60, 40])
      expect(levelOrder(root)).toEqual([40, 20, 60, 10, 30, 50, 70])
      expect(treeHeight(root)).toBe(2)
      expect(nodeCount(root)).toBe(7)
    })

    it('handles null binary tree safely', () => {
      expect(inorder(null)).toEqual([])
      expect(preorder(null)).toEqual([])
      expect(postorder(null)).toEqual([])
      expect(levelOrder(null)).toEqual([])
      expect(treeHeight(null)).toBe(-1)
      expect(nodeCount(null)).toBe(0)
    })
  })

  describe('BST Operations', () => {
    it('inserts nodes and rejects duplicates', () => {
      const bst = new BST()
      expect(bst.insert(50)).toBe(true)
      expect(bst.insert(30)).toBe(true)
      expect(bst.insert(70)).toBe(true)
      expect(bst.insert(20)).toBe(true)
      expect(bst.insert(40)).toBe(true)
      // Duplicate insertion returns false
      expect(bst.insert(30)).toBe(false)
      expect(bst.count()).toBe(5)
      expect(bst.inorder()).toEqual([20, 30, 40, 50, 70])
    })

    it('searches for present and absent keys with comparison counts', () => {
      const bst = new BST()
      ;[50, 25, 75, 10, 30].forEach((v) => bst.insert(v))

      const foundRoot = bst.search(50)
      expect(foundRoot.found).toBe(true)
      expect(foundRoot.comparisons).toBe(1)

      const foundLeaf = bst.search(10)
      expect(foundLeaf.found).toBe(true)
      expect(foundLeaf.comparisons).toBe(3)

      const missing = bst.search(999)
      expect(missing.found).toBe(false)
      expect(missing.comparisons).toBe(2) // 50 -> 75 -> null
    })

    it('deletes a leaf node', () => {
      const bst = new BST()
      ;[50, 30, 70, 20].forEach((v) => bst.insert(v))
      expect(bst.delete(20)).toBe(true)
      expect(bst.inorder()).toEqual([30, 50, 70])
      expect(bst.search(20).found).toBe(false)
    })

    it('deletes a node with one child', () => {
      const bst = new BST()
      ;[50, 30, 70, 20].forEach((v) => bst.insert(v))
      // 30 has only one child: 20
      expect(bst.delete(30)).toBe(true)
      expect(bst.inorder()).toEqual([20, 50, 70])
      expect(bst.search(30).found).toBe(false)
    })

    it('deletes a node with two children (replaces with in-order successor)', () => {
      const bst = new BST()
      ;[50, 30, 70, 20, 40, 60, 80].forEach((v) => bst.insert(v))
      // 50 is the root with two children (30 and 70); successor is 60
      expect(bst.delete(50)).toBe(true)
      expect(bst.inorder()).toEqual([20, 30, 40, 60, 70, 80])
      expect(bst.search(50).found).toBe(false)
    })

    it('handles deleting a non-existent key', () => {
      const bst = new BST()
      bst.insert(10)
      expect(bst.delete(99)).toBe(false)
      expect(bst.count()).toBe(1)
    })
  })
})
