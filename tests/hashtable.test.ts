import { describe, expect, it } from 'vitest'
import { HashTable } from '../src/dsa/hashing/HashTable'

describe('Hash Table (Separate Chaining)', () => {
  it('creates empty buckets and hashes deterministically', () => {
    const table = new HashTable<string, number>(8)
    expect(table.bucketCount).toBe(8)
    expect(table.size).toBe(0)
    expect(table.hash('SF21A4')).toBe(table.hash('SF21A4'))
  })

  it('inserts and searches entries correctly', () => {
    const table = new HashTable<string, { name: string; seat: string }>(4)
    table.insert('PNR001', { name: 'Aarav Mehta', seat: '12A' })
    table.insert('PNR002', { name: 'Diya Kulkarni', seat: '12B' })

    const res1 = table.search('PNR001')
    expect(res1.found).toBe(true)
    expect(res1.value?.name).toBe('Aarav Mehta')
    expect(res1.probes).toBeGreaterThan(0)

    const missing = table.search('NONEXISTENT')
    expect(missing.found).toBe(false)
    expect(missing.value).toBeUndefined()
  })

  it('handles collisions in the same bucket via chaining', () => {
    // 2 buckets ensure collisions happen rapidly
    const table = new HashTable<string, string>(2)
    table.insert('Alpha', 'Val-A')
    table.insert('Beta', 'Val-B')
    table.insert('Gamma', 'Val-G')
    table.insert('Delta', 'Val-D')

    expect(table.size).toBe(4)
    expect(table.search('Alpha').found).toBe(true)
    expect(table.search('Beta').found).toBe(true)
    expect(table.search('Gamma').found).toBe(true)
    expect(table.search('Delta').found).toBe(true)
  })

  it('updates existing key with new value without increasing size', () => {
    const table = new HashTable<string, string>(8)
    table.insert('KEY1', 'OldVal')
    expect(table.size).toBe(1)

    table.insert('KEY1', 'NewVal')
    expect(table.size).toBe(1)
    expect(table.search('KEY1').value).toBe('NewVal')
  })

  it('deletes keys correctly', () => {
    const table = new HashTable<string, number>(4)
    table.insert('A', 1)
    table.insert('B', 2)

    expect(table.delete('A')).toBe(true)
    expect(table.size).toBe(1)
    expect(table.search('A').found).toBe(false)

    expect(table.delete('MISSING')).toBe(false)
    expect(table.size).toBe(1)
  })
})
