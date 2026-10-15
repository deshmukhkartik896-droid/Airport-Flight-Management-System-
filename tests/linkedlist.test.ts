import { describe, expect, it } from 'vitest'
import { SinglyLinkedList } from '../src/dsa/linked-list/SinglyLinkedList'

describe('Singly Linked List', () => {
  it('creates an empty list', () => {
    const list = new SinglyLinkedList<number>()
    expect(list.head).toBeNull()
    expect(list.traverse()).toEqual([])
    expect(list.toPairs()).toEqual([])
  })

  it('inserts at head and tail', () => {
    const list = new SinglyLinkedList<string>()
    list.insertHead('B')
    list.insertHead('A')
    list.insertTail('C')

    expect(list.traverse()).toEqual(['A', 'B', 'C'])
    expect(list.head?.value).toBe('A')
  })

  it('searches for elements with 0-based index', () => {
    const list = new SinglyLinkedList<number>()
    ;[10, 20, 30].forEach((v) => list.insertTail(v))

    expect(list.search(10)).toEqual({ found: true, index: 0 })
    expect(list.search(30)).toEqual({ found: true, index: 2 })
    expect(list.search(99)).toEqual({ found: false, index: -1 })
  })

  it('deletes from head, middle, and tail', () => {
    const list = new SinglyLinkedList<number>()
    ;[10, 20, 30, 40].forEach((v) => list.insertTail(v))

    // Delete head
    expect(list.deleteValue(10)).toBe(true)
    expect(list.traverse()).toEqual([20, 30, 40])

    // Delete middle
    expect(list.deleteValue(30)).toBe(true)
    expect(list.traverse()).toEqual([20, 40])

    // Delete tail
    expect(list.deleteValue(40)).toBe(true)
    expect(list.traverse()).toEqual([20])

    // Delete missing
    expect(list.deleteValue(99)).toBe(false)
    expect(list.traverse()).toEqual([20])
  })
})
