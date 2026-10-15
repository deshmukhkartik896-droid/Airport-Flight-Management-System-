import { describe, expect, it } from 'vitest'
import { Stack } from '../src/dsa/stack/Stack'

describe('Stack (LIFO)', () => {
  it('initialises empty or with initial array', () => {
    const s1 = new Stack<number>()
    expect(s1.isEmpty()).toBe(true)
    expect(s1.size).toBe(0)
    expect(s1.peek()).toBeUndefined()
    expect(s1.pop()).toBeUndefined()

    const s2 = new Stack<string>(['a', 'b'])
    expect(s2.size).toBe(2)
    expect(s2.peek()).toBe('b')
  })

  it('pushes and pops in LIFO order', () => {
    const stack = new Stack<number>()
    stack.push(10)
    stack.push(20)
    stack.push(30)

    expect(stack.size).toBe(3)
    expect(stack.peek()).toBe(30)
    expect(stack.pop()).toBe(30)
    expect(stack.pop()).toBe(20)
    expect(stack.pop()).toBe(10)
    expect(stack.pop()).toBeUndefined()
    expect(stack.isEmpty()).toBe(true)
  })

  it('converts to array copy and clears cleanly', () => {
    const stack = new Stack<string>()
    stack.push('X')
    stack.push('Y')
    const arr = stack.toArray()
    expect(arr).toEqual(['X', 'Y'])

    // Mutating returned array does not affect the internal stack
    arr.push('Z')
    expect(stack.size).toBe(2)

    stack.clear()
    expect(stack.size).toBe(0)
    expect(stack.isEmpty()).toBe(true)
  })
})
