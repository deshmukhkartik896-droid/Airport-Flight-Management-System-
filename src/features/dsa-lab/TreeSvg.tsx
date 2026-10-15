import { layoutBinary, type BinaryTreeNode, type LaidOutNode } from '../../dsa/trees/binary-tree/BinaryTree'
import { layoutAvl } from '../../dsa/trees/avl/AVL'
import type { AvlNode } from '../../dsa/trees/avl/AVL'
import type { BTreeNode } from '../../dsa/trees/b-tree/BTree'
import type { BPlusNode } from '../../dsa/trees/b-plus-tree/BPlusTree'

export function BinaryTreeSvg({ root, highlight = [] }: { root: BinaryTreeNode | null; highlight?: number[] }) {
  const laid = layoutBinary(root)
  if (!laid) return <div className="empty">Empty tree</div>
  const nodes: LaidOutNode[] = []
  walk(laid, nodes)
  const w = Math.max(320, nodes.length * 56)
  const h = (Math.max(...nodes.map((n) => n.y)) + 1) * 70 + 20
  return (
    <div className="svg-wrap">
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h}>
        {nodes.map((n) => (
          <g key={`${n.value}-${n.x}`}>
            {n.left ? line(n, n.left, w) : null}
            {n.right ? line(n, n.right, w) : null}
          </g>
        ))}
        {nodes.map((n) => (
          <g key={`n${n.value}-${n.x}`}>
            <circle
              cx={n.x * 56 + 28}
              cy={n.y * 70 + 28}
              r={16}
              fill={highlight.includes(n.value) ? '#f5b942' : '#172033'}
              stroke="#3ec6ff"
            />
            <text x={n.x * 56 + 28} y={n.y * 70 + 32} textAnchor="middle" fill="#e8edf5" fontSize="11">
              {n.value}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

function walk(n: LaidOutNode, out: LaidOutNode[]) {
  out.push(n)
  if (n.left) walk(n.left, out)
  if (n.right) walk(n.right, out)
}

function line(a: LaidOutNode, b: LaidOutNode, _w: number) {
  return (
    <line
      x1={a.x * 56 + 28}
      y1={a.y * 70 + 28}
      x2={b.x * 56 + 28}
      y2={b.y * 70 + 28}
      stroke="#2d3d55"
    />
  )
}

export function AvlSvg({ root, highlight = [] }: { root: AvlNode | null; highlight?: number[] }) {
  const laid = layoutAvl(root)
  const dummy = laid ? ({ value: laid.value, x: laid.x, y: laid.y, left: asLaid(laid.left), right: asLaid(laid.right) } as LaidOutNode) : null
  return dummy ? <BinaryTreeSvg root={fromLaid(dummy)} highlight={highlight} /> : <div className="empty">Empty AVL</div>
}

function asLaid(n: ReturnType<typeof layoutAvl>): LaidOutNode | null {
  if (!n) return null
  return { value: n.value, x: n.x, y: n.y, left: asLaid(n.left), right: asLaid(n.right) }
}

function fromLaid(n: LaidOutNode): BinaryTreeNode {
  return {
    value: n.value,
    left: n.left ? fromLaid(n.left) : null,
    right: n.right ? fromLaid(n.right) : null,
  }
}

export function BTreeSvg({ root }: { root: BTreeNode }) {
  const rows: { keys: number[]; depth: number; id: string }[] = []
  collectB(root, 0, rows, 'r')
  return (
    <div className="svg-wrap" style={{ padding: 12 }}>
      {rows.map((row) => (
        <div key={row.id} style={{ marginLeft: row.depth * 18, marginBottom: 6, fontSize: 13 }}>
          [{row.keys.join(' | ')}] {row.depth === 0 ? 'root' : ''}
        </div>
      ))}
    </div>
  )
}

function collectB(node: BTreeNode, depth: number, rows: { keys: number[]; depth: number; id: string }[], id: string) {
  rows.push({ keys: node.keys, depth, id })
  node.children.forEach((c, i) => collectB(c, depth + 1, rows, `${id}.${i}`))
}

export function BPlusSvg({ root }: { root: BPlusNode }) {
  const rows: string[] = []
  describeBp(root, 0, rows)
  return (
    <div className="svg-wrap" style={{ padding: 12 }}>
      {rows.map((r) => (
        <div key={r} style={{ fontSize: 13, marginBottom: 4 }}>
          {r}
        </div>
      ))}
    </div>
  )
}

function describeBp(node: BPlusNode, depth: number, rows: string[]) {
  const kind = node.isLeaf ? 'LEAF' : 'INDEX'
  rows.push(`${'  '.repeat(depth)}${kind} [${node.keys.join(', ')}]`)
  if (!node.isLeaf) node.children.forEach((c) => describeBp(c, depth + 1, rows))
}
