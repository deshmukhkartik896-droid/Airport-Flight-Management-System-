import { useMemo, useState } from 'react'
import { useApp } from '../../app/AppContext'
import { indexedAccess, minMax, traverseArray } from '../../dsa/arrays/arrayOps'
import { runBfs } from '../../dsa/graph/bfs'
import { runDijkstra } from '../../dsa/graph/dijkstra'
import { AirportGraph } from '../../dsa/graph/AirportGraph'
import { HashTable } from '../../dsa/hashing/HashTable'
import { MaxHeap } from '../../dsa/heap/MaxHeap'
import { SinglyLinkedList } from '../../dsa/linked-list/SinglyLinkedList'
import { Queue } from '../../dsa/queue/Queue'
import { binarySearch, isNonDecreasing } from '../../dsa/searching/binarySearch'
import { linearSearch } from '../../dsa/searching/linearSearch'
import { bubbleSort, insertionSort, mergeSort, quickSort, selectionSort } from '../../dsa/sorting/sorts'
import { Stack } from '../../dsa/stack/Stack'
import { AVL } from '../../dsa/trees/avl/AVL'
import { BPlusTree } from '../../dsa/trees/b-plus-tree/BPlusTree'
import { BTree } from '../../dsa/trees/b-tree/BTree'
import { demoBinaryTree, inorder, levelOrder, postorder, preorder } from '../../dsa/trees/binary-tree/BinaryTree'
import { BST } from '../../dsa/trees/bst/BST'
import { AvlSvg, BinaryTreeSvg, BPlusSvg, BTreeSvg } from './TreeSvg'

const TABS = [
  'Arrays',
  'Searching',
  'Stack',
  'Queue',
  'Min / Max',
  'Sorting',
  'Hash Table',
  'Linked List',
  'Heap',
  'Trees',
  'Weighted Graphs',
] as const

type Tab = (typeof TABS)[number]

export function LabPage() {
  const [tab, setTab] = useState<Tab>('Arrays')
  return (
    <div>
      <div className="page-header">
        <h2>DSA Laboratory</h2>
        <p>Working implementations — not slides. Complexities are shown beside each demo.</p>
      </div>
      <div className="tabs">
        {TABS.map((t) => (
          <button key={t} className={`btn ${tab === t ? 'active' : ''}`} type="button" onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>
      {tab === 'Arrays' && <ArraysLab />}
      {tab === 'Searching' && <SearchLab />}
      {tab === 'Stack' && <StackLab />}
      {tab === 'Queue' && <QueueLab />}
      {tab === 'Min / Max' && <MinMaxLab />}
      {tab === 'Sorting' && <SortLab />}
      {tab === 'Hash Table' && <HashLab />}
      {tab === 'Linked List' && <ListLab />}
      {tab === 'Heap' && <HeapLab />}
      {tab === 'Trees' && <TreesLab />}
      {tab === 'Weighted Graphs' && <GraphLab />}
    </div>
  )
}

function ArraysLab() {
  const { state } = useApp()
  const [items, setItems] = useState(() => state.flights.slice(0, 6).map((f) => f.flightNumber))
  const [idx, setIdx] = useState(0)
  const [val, setVal] = useState('XX 100')
  const steps = traverseArray(items)
  return (
    <Demo title="Arrays" time="O(n) traverse / O(1) index" space="O(1) extra">
      <div className="toolbar">
        <input value={val} onChange={(e) => setVal(e.target.value)} />
        <button className="btn" type="button" onClick={() => setItems((a) => [...a, val])}>
          Add
        </button>
        <button className="btn" type="button" onClick={() => setItems((a) => a.map((x, i) => (i === idx ? val : x)))}>
          Update at index
        </button>
        <button className="btn" type="button" onClick={() => setItems((a) => a.filter((_, i) => i !== idx))}>
          Remove at index
        </button>
        <input type="number" value={idx} onChange={(e) => setIdx(Number(e.target.value))} style={{ width: 80 }} />
      </div>
      <p>Indexed access [{idx}] = {String(indexedAccess(items, idx) ?? 'out of range')}</p>
      <div className="log">{steps.map((s) => `[${s.index}] ${s.value}`).join('\n')}</div>
    </Demo>
  )
}

function SearchLab() {
  const { state } = useApp()
  const delays = state.flights.map((f) => f.delayMinutes)
  const sorted = [...delays].sort((a, b) => a - b)
  const [key, setKey] = useState(0)
  const lin = linearSearch(delays, key)
  const bin = binarySearch(sorted, key)
  return (
    <Demo title="Searching" time="Linear O(n); Binary O(log n)" space="O(1)">
      <p>Binary search requires sorted input. The implementation sorts a copy first, then searches that copy — it never calls Array.find.</p>
      <p>Sorted? {isNonDecreasing(sorted) ? 'yes' : 'no'}</p>
      <input type="number" value={key} onChange={(e) => setKey(Number(e.target.value))} />
      <p>
        Linear on original delays: found={String(lin.found)} index={lin.index} comparisons={lin.comparisons}
      </p>
      <p>
        Binary on sorted delays [{sorted.join(', ')}]: found={String(bin.found)} index={bin.index} comparisons={bin.comparisons}
      </p>
    </Demo>
  )
}

function StackLab() {
  const [stack] = useState(() => new Stack<string>(['load demo', 'assign gate']))
  const [, bump] = useState(0)
  const [val, setVal] = useState('edit flight')
  const redraw = () => bump((n) => n + 1)
  return (
    <Demo title="Stack (LIFO)" time="O(1) push/pop/peek" space="O(n)">
      <p>Last in, first out. The application undo stack uses this same class.</p>
      <div className="toolbar">
        <input value={val} onChange={(e) => setVal(e.target.value)} />
        <button className="btn" type="button" onClick={() => { stack.push(val); redraw() }}>
          Push
        </button>
        <button className="btn" type="button" onClick={() => { stack.pop(); redraw() }}>
          Pop
        </button>
      </div>
      <p>
        Peek: {stack.peek() ?? 'empty'} · size {stack.size} · empty {String(stack.isEmpty())}
      </p>
      <div className="log">bottom → {stack.toArray().join(' → ')} ← top</div>
    </Demo>
  )
}

function QueueLab() {
  const [q] = useState(() => new Queue<string>(['SF 210', 'DS 441']))
  const [, bump] = useState(0)
  const [val, setVal] = useState('IP 118')
  const redraw = () => bump((n) => n + 1)
  return (
    <Demo title="Queue (FIFO)" time="O(1) amortized enqueue/dequeue" space="O(n)">
      <p>Head-index queue used by BFS and the departure module. Array.shift is not used.</p>
      <div className="toolbar">
        <input value={val} onChange={(e) => setVal(e.target.value)} />
        <button className="btn" type="button" onClick={() => { q.enqueue(val); redraw() }}>
          Enqueue
        </button>
        <button className="btn" type="button" onClick={() => { q.dequeue(); redraw() }}>
          Dequeue
        </button>
      </div>
      <p>
        Peek {q.peek() ?? 'empty'} · size {q.size}
      </p>
      <div className="log">{q.toArray().join(' → ') || 'empty'}</div>
    </Demo>
  )
}

function MinMaxLab() {
  const { state } = useApp()
  const values = state.flights.map((f) => f.delayMinutes)
  const res = minMax(values)
  return (
    <Demo title="Minimum and maximum" time="O(n)" space="O(1)">
      <p>Input delays (minutes): [{values.join(', ')}]</p>
      <p>
        min={res.min} @ {res.minIndex} · max={res.max} @ {res.maxIndex} · comparisons={res.comparisons}
      </p>
    </Demo>
  )
}

function SortLab() {
  const [raw, setRaw] = useState('34,12,9,45,12,3,27')
  const [algo, setAlgo] = useState<'bubble' | 'selection' | 'insertion' | 'merge' | 'quick'>('bubble')
  const input = useMemo(
    () =>
      raw
        .split(',')
        .map((s) => Number(s.trim()))
        .filter((n) => !Number.isNaN(n)),
    [raw],
  )
  const result = useMemo(() => {
    if (algo === 'bubble') return bubbleSort(input)
    if (algo === 'selection') return selectionSort(input)
    if (algo === 'insertion') return insertionSort(input)
    if (algo === 'merge') return mergeSort(input)
    return quickSort(input)
  }, [input, algo])
  const [si, setSi] = useState(0)
  const step = result.steps[Math.min(si, result.steps.length - 1)]
  return (
    <Demo title="Sorting laboratory" time={result.average} space="Merge O(n); others O(1) extra">
      <p>
        Best {result.best} · Average {result.average} · Worst {result.worst}
      </p>
      <div className="toolbar">
        <input value={raw} onChange={(e) => { setRaw(e.target.value); setSi(0) }} />
        <select value={algo} onChange={(e) => { setAlgo(e.target.value as typeof algo); setSi(0) }}>
          <option value="bubble">Bubble</option>
          <option value="selection">Selection</option>
          <option value="insertion">Insertion</option>
          <option value="merge">Merge</option>
          <option value="quick">Quick</option>
        </select>
        <button className="btn" type="button" onClick={() => setSi((s) => Math.max(0, s - 1))}>
          Prev
        </button>
        <button className="btn" type="button" onClick={() => setSi((s) => Math.min(result.steps.length - 1, s + 1))}>
          Next
        </button>
      </div>
      <p>
        Original [{result.original.join(', ')}] → [{result.sorted.join(', ')}] · comparisons {result.comparisons} · writes{' '}
        {result.writes}
      </p>
      <p>
        Step {si + 1}/{result.steps.length}: {step?.message}
      </p>
      <div className="row">
        {step?.array.map((n, i) => (
          <span key={`${i}-${n}`} className="badge" style={{ background: step.highlight.includes(i) ? '#145a78' : '#1e2b40' }}>
            {n}
          </span>
        ))}
      </div>
    </Demo>
  )
}

function HashLab() {
  const [table] = useState(() => new HashTable<string, string>(8))
  const [, bump] = useState(0)
  const [k, setK] = useState('SF21A4')
  const [v, setV] = useState('Aarav')
  const last = table.search(k)
  return (
    <Demo title="Hash table (separate chaining)" time="O(1) average, O(n) worst" space="O(n)">
      <p>djb2 hash modulo 8 buckets. A collision occurs when a non-empty chain receives another key.</p>
      <div className="toolbar">
        <input value={k} onChange={(e) => setK(e.target.value)} />
        <input value={v} onChange={(e) => setV(e.target.value)} />
        <button className="btn" type="button" onClick={() => { table.insert(k, v); bump((n) => n + 1) }}>
          Insert
        </button>
        <button className="btn" type="button" onClick={() => { table.delete(k); bump((n) => n + 1) }}>
          Delete
        </button>
      </div>
      <p>
        Search {k}: {last.found ? last.value : 'miss'} · bucket {last.bucket} · probes {last.probes}
      </p>
      <div className="log">
        {table.buckets.map((b, i) => `${i}: ${b.map((e) => `${e.key}→${e.value}`).join(' → ') || '∅'}`).join('\n')}
      </div>
    </Demo>
  )
}

function ListLab() {
  const [list] = useState(() => {
    const l = new SinglyLinkedList<number>()
    l.insertTail(10)
    l.insertTail(20)
    l.insertTail(30)
    return l
  })
  const [, bump] = useState(0)
  const [n, setN] = useState(10)
  return (
    <Demo title="Singly linked list" time="O(1) head insert; O(n) tail/search" space="O(n)">
      <div className="toolbar">
        <input type="number" value={n} onChange={(e) => setN(Number(e.target.value))} />
        <button className="btn" type="button" onClick={() => { list.insertHead(n); bump((x) => x + 1) }}>
          Insert head
        </button>
        <button className="btn" type="button" onClick={() => { list.insertTail(n); bump((x) => x + 1) }}>
          Insert tail
        </button>
        <button className="btn" type="button" onClick={() => { list.deleteValue(n); bump((x) => x + 1) }}>
          Delete value
        </button>
      </div>
      <p>Search {n}: {JSON.stringify(list.search(n))}</p>
      <p>Head: {list.head?.value ?? 'null'}</p>
      <div className="log">{list.toPairs().map((p) => `${p.value} → ${p.next ?? 'null'}`).join('\n')}</div>
    </Demo>
  )
}

function HeapLab() {
  const [heap] = useState(() => new MaxHeap<number>())
  const [, bump] = useState(0)
  const [n, setN] = useState(7)
  return (
    <Demo title="Binary max-heap" time="O(log n) insert/extract" space="O(n)">
      <p>Heap property: parent ≥ children. Tie-break uses insertion sequence.</p>
      <div className="toolbar">
        <input type="number" value={n} onChange={(e) => setN(Number(e.target.value))} />
        <button className="btn" type="button" onClick={() => { heap.insert(n, n); bump((x) => x + 1) }}>
          Insert
        </button>
        <button className="btn" type="button" onClick={() => { heap.extractMax(); bump((x) => x + 1) }}>
          Extract max
        </button>
      </div>
      <div className="log">{heap.toArray().map((e, i) => `${i}: ${e.value}`).join('\n') || 'empty'}</div>
    </Demo>
  )
}

function TreesLab() {
  const [sub, setSub] = useState<'bin' | 'bst' | 'avl' | 'bt' | 'bp'>('bst')
  const [bst] = useState(() => new BST())
  const [avl] = useState(() => new AVL())
  const [btree] = useState(() => new BTree(2))
  const [bplus] = useState(() => new BPlusTree(2))
  const [, bump] = useState(0)
  const [key, setKey] = useState(40)
  const bin = demoBinaryTree()
  return (
    <div>
      <div className="tabs">
        {(['bin', 'bst', 'avl', 'bt', 'bp'] as const).map((s) => (
          <button key={s} className={`btn ${sub === s ? 'active' : ''}`} type="button" onClick={() => setSub(s)}>
            {s === 'bin' ? 'Binary Tree' : s === 'bst' ? 'BST' : s === 'avl' ? 'AVL' : s === 'bt' ? 'B-Tree' : 'B+ Tree'}
          </button>
        ))}
      </div>
      {sub === 'bin' && (
        <Demo title="Binary tree" time="Traversals O(n)" space="O(h)">
          <BinaryTreeSvg root={bin} />
          <p>Inorder {inorder(bin).join(', ')}</p>
          <p>Preorder {preorder(bin).join(', ')}</p>
          <p>Postorder {postorder(bin).join(', ')}</p>
          <p>Level {levelOrder(bin).join(', ')}</p>
        </Demo>
      )}
      {sub === 'bst' && (
        <Demo title="Binary Search Tree" time="O(h) search; worst O(n) if skewed" space="O(n)">
          <div className="toolbar">
            <input type="number" value={key} onChange={(e) => setKey(Number(e.target.value))} />
            <button className="btn" type="button" onClick={() => { bst.insert(key); bump((x) => x + 1) }}>
              Insert
            </button>
            <button className="btn" type="button" onClick={() => { bst.delete(key); bump((x) => x + 1) }}>
              Delete
            </button>
          </div>
          <p>Search {JSON.stringify(bst.search(key))} · height {bst.height()} · n {bst.count()}</p>
          <p>Inorder {bst.inorder().join(', ')} (sorted)</p>
          <p>Pre {bst.preorder().join(', ')} · Post {bst.postorder().join(', ')} · Level {bst.levelOrder().join(', ')}</p>
          <BinaryTreeSvg root={bst.root} highlight={[key]} />
        </Demo>
      )}
      {sub === 'avl' && (
        <Demo title="AVL tree" time="O(log n) guaranteed" space="O(n)">
          <p>Balancing keeps height logarithmic. Last rotation: {avl.lastInsert.log}</p>
          <div className="toolbar">
            <input type="number" value={key} onChange={(e) => setKey(Number(e.target.value))} />
            <button className="btn" type="button" onClick={() => { avl.insert(key); bump((x) => x + 1) }}>
              Insert
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => {
                ;[10, 20, 30].forEach((k) => avl.insert(k))
                bump((x) => x + 1)
              }}
            >
              Demo RR (10,20,30)
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => {
                avl.clear()
                ;[30, 20, 10].forEach((k) => avl.insert(k))
                bump((x) => x + 1)
              }}
            >
              Demo LL
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => {
                avl.clear()
                ;[30, 10, 20].forEach((k) => avl.insert(k))
                bump((x) => x + 1)
              }}
            >
              Demo LR
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => {
                avl.clear()
                ;[10, 30, 20].forEach((k) => avl.insert(k))
                bump((x) => x + 1)
              }}
            >
              Demo RL
            </button>
          </div>
          <AvlSvg root={avl.root} highlight={avl.lastInsert.involved} />
          <p>Inorder {avl.inorder().join(', ')} · balanced {String(avl.isBalanced())}</p>
        </Demo>
      )}
      {sub === 'bt' && (
        <Demo title="B-Tree (t = 2)" time="O(t log_t n)" space="O(n)">
          <p>Max 3 keys per node. Splits promote the median. Invariant valid: {String(btree.validate())}</p>
          <div className="toolbar">
            <input type="number" value={key} onChange={(e) => setKey(Number(e.target.value))} />
            <button className="btn" type="button" onClick={() => { btree.insert(key); bump((x) => x + 1) }}>
              Insert
            </button>
          </div>
          <p>Search {JSON.stringify(btree.search(key).found)} · inorder {btree.inorder().join(', ')}</p>
          <p>Splits: {btree.splits.join(' | ') || 'none yet'}</p>
          <BTreeSvg root={btree.root} />
        </Demo>
      )}
      {sub === 'bp' && (
        <Demo title="B+ Tree (t = 2)" time="O(t log_t n) + O(k) range" space="O(n)">
          <p>All keys in linked leaves. Internal nodes are indexes only. Valid: {String(bplus.validate())}</p>
          <div className="toolbar">
            <input type="number" value={key} onChange={(e) => setKey(Number(e.target.value))} />
            <button className="btn" type="button" onClick={() => { bplus.insert(key); bump((x) => x + 1) }}>
              Insert
            </button>
          </div>
          <p>
            Search {String(bplus.search(key))} · range 10–50 [{bplus.rangeSearch(10, 50).join(', ')}]
          </p>
          <p>Leaf chain: {bplus.leafChain().join(' → ') || 'empty'}</p>
          <p>{bplus.splits.join(' | ') || 'no splits yet'}</p>
          <BPlusSvg root={bplus.root} />
        </Demo>
      )}
    </div>
  )
}

function GraphLab() {
  const { state } = useApp()
  const g = new AirportGraph(state.airports, state.routes)
  const bfs = runBfs(g, 'NAG', 'MAA')
  const dij = runDijkstra(g, 'NAG', 'MAA')
  return (
    <Demo title="Weighted graphs" time="Dijkstra O((V+E) log V)" space="O(V)">
      <p>Same engine as Airport Network. BFS hops NAG→MAA: {bfs.path.join(' → ') || 'none'} ({bfs.path.length ? bfs.path.length - 1 : 0} edges)</p>
      <p>
        Dijkstra simulated km: {dij.totalDistance ?? 'unreachable'} via {dij.path.join(' → ')}
      </p>
      <p>{dij.explanation}</p>
    </Demo>
  )
}

function Demo({
  title,
  time,
  space,
  children,
}: {
  title: string
  time: string
  space: string
  children: React.ReactNode
}) {
  return (
    <div className="card">
      <div className="card-h">
        <h3>{title}</h3>
        <span style={{ color: 'var(--muted)', fontSize: 12 }}>
          Time {time} · Space {space}
        </span>
      </div>
      <div className="card-b">{children}</div>
    </div>
  )
}
