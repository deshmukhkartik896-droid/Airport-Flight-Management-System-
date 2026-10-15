export interface HashEntry<K, V> {
  key: K
  value: V
}

/**
 * Separate-chaining hash table.
 * Collisions: multiple keys that hash to the same bucket share a chain (array list).
 */
export class HashTable<K extends string | number, V> {
  readonly bucketCount: number
  readonly buckets: HashEntry<K, V>[][]
  size = 0

  constructor(bucketCount = 8) {
    this.bucketCount = bucketCount
    this.buckets = Array.from({ length: bucketCount }, () => [])
  }

  /** djb2 string hash, then modulo bucket count. */
  hash(key: K): number {
    const s = String(key)
    let h = 5381
    for (let i = 0; i < s.length; i++) {
      h = (h * 33) ^ s.charCodeAt(i)
    }
    return Math.abs(h) % this.bucketCount
  }

  insert(key: K, value: V): { bucket: number; collision: boolean } {
    const bucket = this.hash(key)
    const chain = this.buckets[bucket]
    const collision = chain.length > 0
    for (let i = 0; i < chain.length; i++) {
      if (chain[i].key === key) {
        chain[i].value = value
        return { bucket, collision }
      }
    }
    chain.push({ key, value })
    this.size++
    return { bucket, collision }
  }

  search(key: K): { found: boolean; value: V | undefined; bucket: number; probes: number } {
    const bucket = this.hash(key)
    const chain = this.buckets[bucket]
    for (let i = 0; i < chain.length; i++) {
      if (chain[i].key === key) {
        return { found: true, value: chain[i].value, bucket, probes: i + 1 }
      }
    }
    return { found: false, value: undefined, bucket, probes: chain.length }
  }

  delete(key: K): boolean {
    const bucket = this.hash(key)
    const chain = this.buckets[bucket]
    for (let i = 0; i < chain.length; i++) {
      if (chain[i].key === key) {
        chain.splice(i, 1)
        this.size--
        return true
      }
    }
    return false
  }
}
