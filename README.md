# AeroFlow ATOS

### Airport Traffic & Operations Simulator

> **IMPORTANT DISCLAIMER:**
> **SIMULATION MODE — NOT LIVE FLIGHT DATA**
> AeroFlow ATOS is an educational computer science simulator designed for coursework demonstration and viva examination. It demonstrates Data Structures and Algorithms (DSA) through practical airport operations workflows. It does **not** connect to real-world aviation telecommunications, certified air traffic control (ATC) feeds, or airline reservation systems, and **must not be used for real-world flight operations, aircraft separation, or airport safety-critical dispatch.**

---

## 1. Project Overview & Problem Statement

Modern airport hubs manage hundreds of concurrent flights, gate constraints, runway reservations, passenger manifests, and route graphs. Teaching Data Structures and Algorithms (DSA) through isolated, abstract textbook examples often leaves students disconnected from how these concepts apply to large-scale distributed operations.

**AeroFlow ATOS (Airport Traffic & Operations Simulator)** bridges theoretical algorithmic principles and real-world systems engineering. It models an integrated airport operations dashboard (centered around the simulated hub **NAG** — Nagpur) powered by manual, ground-up TypeScript implementations of fundamental and advanced data structures. Every workflow—from flight scheduling and baggage/passenger indexing to departure queues and shortest-path routing—directly maps to specific DSA topics.

---

## 2. Objectives

1. **Practical DSA Demonstration:** Ground algorithmic concepts (arrays, linked lists, stacks, queues, trees, heaps, hash tables, and graphs) in tangible aviation operational metaphors.
2. **Deterministic & Manual Implementations:** Avoid third-party DSA libraries or mock animations; all algorithms execute pure algorithmic steps with comparison/edge counting.
3. **Local-First & Resilient Architecture:** Run entirely within the browser using LocalStorage persistence, zero required backend services, and no external API keys.
4. **Interactive SVG Visualizations:** Provide step-by-step interactive visualizers for tree rotations, multi-way indexing, and graph traversals.
5. **Academic Viva Preparedness:** Include an editable syllabus mapping matrix, time and space complexity references, and full test suites.

---

## 3. Technologies Used

- **Frontend Framework:** React 19 (TypeScript)
- **Bundler & Dev Server:** Vite 8
- **Styling:** Custom Modular CSS (Dark Aviation Operations Theme)
- **Icons:** Lucide React
- **Persistence:** Browser LocalStorage with schema validation & recovery
- **Testing:** Vitest (Node environment)
- **Linter:** Oxlint

---

## 4. System Architecture

The application is architected with a strict separation of concerns:

```
src/
├── app/                  # Application state management, Context, and actions
│   ├── AppContext.tsx    # React Context provider, toast notifications, import/export
│   └── store.ts          # State reducers, action handlers, and undo stack integration
├── components/           # Reusable UI components (Modal, StatusBadge)
├── config/               # System constants and central syllabus configuration
│   ├── constants.ts      # Enums, valid status transitions, complexity reference
│   └── syllabus.ts       # Central syllabus mapping matrix (Units I through V)
├── data/                 # Seed data and network topologies
│   ├── airports.ts       # Vertex nodes (airports) and route edge definitions
│   └── seed.ts           # Dynamic timetable generation relative to simulation date
├── dsa/                  # Ground-up algorithmic implementations (pure TypeScript)
│   ├── arrays/           # Array traversal, indexed access, min/max scans
│   ├── graph/            # AirportGraph adjacency list, BFS, DFS, Dijkstra
│   ├── hashing/          # Separate-chaining hash table with djb2 hash function
│   ├── heap/             # Binary Max-Heap (priority queue) & Min-Heap
│   ├── linked-list/      # Singly linked list with pointer manipulations
│   ├── queue/            # Head-pointer FIFO queue (no Array.prototype.shift)
│   ├── searching/        # Iterative binary search & linear search
│   ├── sorting/          # Bubble, Selection, Insertion, Merge, Quick sorts
│   ├── stack/            # LIFO Stack for operations history and undo
│   └── trees/            # Binary Tree, BST, AVL (rotations), B-Tree, B+ Tree
├── features/             # Feature-specific pages and operational interfaces
│   ├── airport-network/  # Interactive SVG graph traversal (BFS/DFS/Dijkstra)
│   ├── dashboard/        # Operations Overview with dynamic KPI aggregation
│   ├── departure-queue/  # FIFO departure processing & emergency-priority heap
│   ├── dsa-lab/          # Dedicated DSA Laboratory with 11 interactive testbeds
│   ├── flights/          # CRUD flight operations with search, filters, and sorting
│   ├── gate-control/     # Gate & runway allocation with interval conflict detection
│   ├── passengers/       # Passenger manifest indexed by hash table
│   ├── settings/         # LocalStorage persistence, JSON export/import, date rebuild
│   └── syllabus/         # Course syllabus coverage matrix for viva examination
├── layouts/              # Main app shell, persistent simulation banner, and navigation
├── services/             # Selectors, conflict checking, validation, storage engine
├── types/                # Strict TypeScript interfaces and domain models
└── utils/                # Date/time arithmetic, ID generators
```

---

## 5. Key Application Features

### 1. Operations Overview
- Dynamic dashboard metrics derived in real-time from application state: Total Flights, Scheduled Departures/Arrivals, Delayed, Cancelled, Available/Occupied Gates, and Simulated On-Time Performance (OTP).
- Upcoming departures and arrivals boards with one-click flight detail inspections.
- Gate occupancy summary and queue snapshots.
- Single-click demonstration data restoration relative to the selected simulation date.

### 2. Flight Operations
- Typed CRUD operations for simulated flight records with validation against known airport codes, realistic capacities (<= 500 pax), non-negative delays, and scheduled departure < arrival.
- Comprehensive search by flight number and airline.
- Multi-dimensional filtering by flow (Departures from NAG, Arrivals to NAG), status (Scheduled, Boarding, Departed, Arrived, Delayed, Cancelled), origin, and destination.
- Sorting by scheduled departure, flight number, and delay minutes.
- Enforced flight state machine (`canTransition`) preventing illegal transitions (e.g., Arrived -> Scheduled).

### 3. Interactive Airport Network
- Directed/undirected graph representation using adjacency lists (`AirportGraph`).
- Demonstration nodes include major Indian aviation hubs (NAG, BOM, DEL, HYD, BLR, MAA, GOI, CCU) and an intentionally disconnected vertex (`TST`).
- Step-by-step animated traversals for:
  - **BFS:** Explores level by level; guarantees fewest hops on unweighted graphs.
  - **DFS:** Explores deep branches using LIFO stack semantics before backtracking.
  - **Dijkstra:** Employs a Min-Heap priority queue to minimize total simulated route kilometres.
- Interactive SVG network map with controls: Play, Pause, Next Step, Previous Step, and Reset/Replay.
- Real-time logging of visited vertices, edges examined, and unreachable node warnings.

### 4. Gate & Runway Resource Control
- Gate and runway assignment, reassignment, and release.
- **Interval Overlap Conflict Detector:** Algorithmically inspects occupancy intervals `[start, end]` using interval overlap logic `(max(start1, start2) < min(end1, end2))` to prevent double-booking.
- Aircraft category compatibility validation (`Regional`, `Narrow`, `Wide`).
- Detection of inverted intervals or assignments on runways under maintenance.

### 5. Departure Queue & Priority Management
- **FIFO Departure Queue:** Implemented via custom generic `Queue` using a head pointer (amortized $O(1)$, strictly avoiding the $O(n)$ `Array.shift()` educational anti-pattern).
- **Emergency Priority Queue:** Implemented via custom binary `MaxHeap` with documented priority levels (1 = Routine, 2 = Time-sensitive, 3 = Urgent, 4 = Simulated Emergency).
- **Deterministic Tie-Breaking:** Preserves FIFO ordering among equal priorities using sequential insertion counter tags.
- Dynamic priority adjustment (`changePriority`) with automatic sift-up/sift-down repositioning.

### 6. Passenger Manifest
- Fictional passenger records indexed in an $O(1)$ separate-chaining Hash Table by booking reference (PNR) and passenger ID.
- Real-time display of bucket index and probe count for searches.
- Validation of booking reference format (5–8 alphanumeric characters), seat format (e.g., 12A), and seat collision detection per flight.

### 7. DSA Laboratory
Dedicated, interactive visual laboratory covering 11 modules:
1. **Arrays:** Traversal, indexed access, insertion, and deletion.
2. **Searching:** Comparison-counted linear search and iterative binary search on sorted inputs.
3. **Stack:** Push, pop, peek, LIFO order inspection.
4. **Queue:** Head-index FIFO operations and queue length.
5. **Min / Max:** Single-pass comparison-based extrema scanning.
6. **Sorting:** Step-by-step visual playback for Bubble, Selection, Insertion, Merge, and Quick Sort with write and comparison counts.
7. **Hash Table:** Separate-chaining collision visualization, insertion, and deletion.
8. **Linked List:** Singly linked list pointer traversal, head/tail insertion, and deletion by value.
9. **Heap:** Max-heap tree visualization, insertion, and max extraction.
10. **Trees:**
    - Reference Binary Tree traversals (Inorder, Preorder, Postorder, Level-order).
    - Binary Search Tree (BST) insertion, duplicate rejection, and 3-case deletion.
    - AVL Tree balancing with LL, RR, LR, and RL rotation demonstrations.
    - B-Tree of degree $t=2$ showing node splitting on median keys.
    - B+ Tree of degree $t=2$ demonstrating leaf splits, copy-up keys, internal push-up keys, and range search over linked leaves.
11. **Weighted Graphs:** Dijkstra execution with step logs.

### 8. Operation History & Reversible Undo
- Array-backed LIFO Stack storing command descriptors and inverted patches for supported state mutations.
- One-click "Undo Last Action" restoring previous states without reloading.

### 9. Settings, Import/Export & LocalStorage
- Automatic persistence to browser `localStorage` under `aeroflow-atos-v1`.
- Graceful recovery: automatically falls back to clean seed data if stored data is corrupted or has an incompatible schema version.
- Validated JSON export and import for transferring flight datasets.
- Simulation date reconfiguration that rebuilds seed timetable timestamps dynamically.

---

## 6. Syllabus Coverage Matrix

| Unit | Topic / Concept | Manual DSA Implementation | Application Feature / Mapping | Demonstration Location | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit I** | Arrays & Traversal | Contiguous array scans, indexed lookup, add/remove | Flight records list, KPI aggregations | DSA Lab → Arrays | Implemented |
| **Unit I** | Stack (LIFO) | Custom generic `Stack` class | Operation history, reversible action undo | Overview History Panel; DSA Lab → Stack | Implemented |
| **Unit I** | Queue (FIFO) | Custom generic `Queue` with head index | Departure sequence processing | Departure Queue; DSA Lab → Queue | Implemented |
| **Unit I** | Searching | Manual linear search & iterative binary search | Flight number lookup, delay search | DSA Lab → Searching | Implemented |
| **Unit I** | Min / Max | Single-pass comparative min/max scan | Delay extrema tracking | DSA Lab → Min / Max | Implemented |
| **Unit II** | Binary Tree | Linked `BinaryTreeNode` structure | Traversal visualizer | DSA Lab → Trees → Binary Tree | Implemented |
| **Unit II** | BST | Binary Search Tree with 3-case deletion | Key indexing and ordered traversals | DSA Lab → Trees → BST | Implemented |
| **Unit II** | AVL Tree | Self-balancing BST with LL, RR, LR, RL rotations | Balanced height index | DSA Lab → Trees → AVL | Implemented |
| **Unit II** | B-Tree | Multi-way search tree ($t=2$) with node splits | Block storage & multi-key indexing | DSA Lab → Trees → B-Tree | Implemented |
| **Unit II** | B+ Tree | Tree with routing internal nodes & linked leaf chain | Range search & sequential leaf traversal | DSA Lab → Trees → B+ Tree | Implemented |
| **Unit III**| Graph Representation| Adjacency list (`Map<string, Neighbor[]>`) | Simulated airport network topology | Airport Network; DSA Lab → Graphs | Implemented |
| **Unit III**| Breadth-First Search| Queue-based BFS traversal | Fewest-hop route calculation | Airport Network → BFS | Implemented |
| **Unit III**| Depth-First Search  | Stack-based iterative DFS traversal | Network exploration order | Airport Network → DFS | Implemented |
| **Unit III**| Dijkstra's Algorithm| Priority Queue / Min-Heap weighted shortest path | Minimum simulated distance routing | Airport Network → Dijkstra | Implemented |
| **Unit IV\***| Sorting Algorithms | Bubble, Selection, Insertion, Merge, Quick Sort | Flight delay sorting testbed | DSA Lab → Sorting | Implemented (Provisional\*) |
| **Unit IV\***| Hash Tables | Separate-chaining hash table with djb2 hashing | PNR & passenger manifest lookup | Passenger Manifest; DSA Lab → Hash | Implemented (Provisional\*) |
| **Unit IV\***| Singly Linked List | Pointer-based linked list (insert/delete/search) | Dynamic passenger sequence lab | DSA Lab → Linked List | Implemented (Provisional\*) |
| **Unit V\*** | Binary Heap | Max-Heap with deterministic tie-break | Emergency prioritization | Departure Queue → Heap; DSA Lab → Heap | Implemented (Provisional\*) |
| **Unit V\*** | Interval Conflicts | Interval overlap testing ($O(n)$) | Gate & runway conflict detector | Gate & Runway Control | Implemented (Provisional\*) |

*\*Note: Units IV and V are marked as provisional pending final confirmation of the college syllabus breakdown. All topic mappings can be updated in `src/config/syllabus.ts` without modifying core logic.*

---

## 7. Algorithmic Complexity Table

| Algorithm / Data Structure | Best Time | Average Time | Worst Time | Space Complexity | Notes / Invariant |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Array Indexed Access** | $O(1)$ | $O(1)$ | $O(1)$ | $O(1)$ | Direct offset lookup |
| **Array Traversal** | $O(n)$ | $O(n)$ | $O(n)$ | $O(1)$ extra | Linear scan |
| **Linear Search** | $O(1)$ | $O(n)$ | $O(n)$ | $O(1)$ extra | Unordered input |
| **Binary Search** | $O(1)$ | $O(\log n)$ | $O(\log n)$ | $O(1)$ extra | Input array must be sorted |
| **Stack Push / Pop / Peek**| $O(1)$ | $O(1)$ | $O(1)$ | $O(n)$ | Array-backed LIFO |
| **Queue Enqueue / Dequeue**| $O(1)$ | $O(1)$ amortized| $O(1)$ amortized| $O(n)$ | Head-index avoids $O(n)$ shifts |
| **Bubble Sort** | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ extra | Optimized with swapped flag |
| **Selection Sort** | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ extra | Minimizes array writes |
| **Insertion Sort** | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ extra | Efficient for nearly-sorted data |
| **Merge Sort** | $O(n \log n)$| $O(n \log n)$| $O(n \log n)$| $O(n)$ extra | Stable divide-and-conquer |
| **Quick Sort** | $O(n \log n)$| $O(n \log n)$| $O(n^2)$ | $O(\log n)$ call stack | Last-element pivot rule |
| **Hash Table Lookup** | $O(1)$ | $O(1)$ | $O(n)$ | $O(n)$ | Separate chaining collision handling |
| **Singly Linked List Insert** | $O(1)$ (head) | $O(n)$ (tail)| $O(n)$ (tail)| $O(n)$ | Pointer reassignment |
| **BST Search / Insert** | $O(1)$ | $O(h) \approx O(\log n)$ | $O(n)$ | $O(n)$ | Degenerates if tree is unbalanced |
| **AVL Tree Search / Insert**| $O(1)$ | $O(\log n)$ | $O(\log n)$ | $O(n)$ | Height-balanced: $|BF| \le 1$ |
| **B-Tree Search / Insert** | $O(1)$ | $O(t \log_t n)$ | $O(t \log_t n)$ | $O(n)$ | Minimum degree $t=2$ |
| **B+ Tree Range Search** | $O(\log n + k)$ | $O(\log n + k)$ | $O(\log n + k)$ | $O(n)$ | $k$ = number of elements in range |
| **Binary Max-Heap Extract** | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ | $O(n)$ | Sift-down restores heap property |
| **BFS Graph Traversal** | $O(V + E)$ | $O(V + E)$ | $O(V + E)$ | $O(V)$ | Queue frontier |
| **DFS Graph Traversal** | $O(V + E)$ | $O(V + E)$ | $O(V + E)$ | $O(V)$ | Stack/Recursion frontier |
| **Dijkstra's Algorithm** | $O(E \log V)$| $O((V+E) \log V)$| $O((V+E) \log V)$| $O(V)$ | Non-negative edge weights |

---

## 8. Installation & Execution Guide

### Prerequisites
- [Node.js](https://nodejs.org/) version 18.0.0 or higher
- [npm](https://www.npmjs.com/) version 9.0.0 or higher

### Step-by-Step Commands

1. **Clone or navigate to the project directory:**
   ```bash
   cd c:/Users/saumy/OneDrive/Desktop/DSA_Project
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   *The development server will launch at `http://localhost:5173/`.*

4. **Run TypeScript type checks and production build:**
   ```bash
   npm run build
   ```
   *Compiles TypeScript without errors and generates production assets in `/dist`.*

5. **Preview the production build locally:**
   ```bash
   npm run preview
   ```

6. **Execute Vitest automated unit tests:**
   ```bash
   npm test
   ```

7. **Run the fast linter:**
   ```bash
   npm run lint
   ```

---

## 9. Verification & Automated Test Suite

AeroFlow ATOS includes an extensive unit test suite with **16 test suites** and **129 passing test cases** verifying all data structures and validation constraints:

```
 RUN  v5.0.3 C:/Users/saumy/OneDrive/Desktop/DSA_Project

 ✓ tests/avl.test.ts (6 tests)
 ✓ tests/sorting.test.ts (35 tests)
 ✓ tests/minmax.test.ts (7 tests)
 ✓ tests/linkedlist.test.ts (4 tests)
 ✓ tests/bplus.test.ts (5 tests)
 ✓ tests/queue.test.ts (4 tests)
 ✓ tests/bst.test.ts (8 tests)
 ✓ tests/validation.test.ts (14 tests)
 ✓ tests/searching.test.ts (10 tests)
 ✓ tests/storage.test.ts (5 tests)
 ✓ tests/graph.test.ts (9 tests)
 ✓ tests/stack.test.ts (3 tests)
 ✓ tests/btree.test.ts (4 tests)
 ✓ tests/heap.test.ts (6 tests)
 ✓ tests/hashtable.test.ts (5 tests)
 ✓ tests/conflicts.test.ts (4 tests)

 Test Files  16 passed (16)
      Tests  129 passed (129)
```

The test coverage specifically checks:
- **Empty inputs, boundary values, and missing keys** across all data structures.
- **Duplicate handling** in BST insertion, Hash Table key overwriting, and search routines.
- **Rotations** for all 4 AVL cases (LL, RR, LR, RL) and tree balance factor verification.
- **B-Tree and B+ Tree split invariants** and linked-leaf traversal order.
- **Disconnected graph vertices** (`TST`) and unreachable path handling.
- **Resource interval overlaps** and aircraft category mismatches.
- **Domain validation rules** (PNR format, seat collisions, flight numbers).
- **LocalStorage corruption fallback and version migrations**.

---

## 10. Screenshots Section

*(Place screenshot images in the `assets/` directory or capture them directly from the running web interface)*

1. **Operations Overview Dashboard:**
   - Real-time statistics, flight board, gate allocations, and queue snapshots.
2. **Interactive Airport Network Visualizer:**
   - Animated SVG network graph demonstrating BFS, DFS, and Dijkstra route highlights.
3. **Gate & Runway Control:**
   - Visual stand schedule and interval conflict detector in action.
4. **Departure Queue & Emergency Heap:**
   - Side-by-side comparison of FIFO queue order and binary max-heap priority ranking.
5. **DSA Laboratory:**
   - Tree rotation controls, B+ Tree range queries, and sorting step-by-step playback.
6. **Syllabus Coverage Matrix:**
   - Instructor-ready mapping of academic units to working software modules.

---

## 11. Limitations

1. **Educational Simulation Scope:** The application is an educational model and does not implement FAA/ICAO certified air navigation service provider (ANSP) separation rules, wake-turbulence categories, or real weather routing.
2. **Simplified Ground Dynamics:** Gate pushback delays, taxiway routing networks, and de-icing intervals are modeled as basic time intervals rather than physical physics simulations.
3. **Local-First Storage:** State is persisted in browser LocalStorage (subject to standard browser storage quotas); multi-user live synchronization across different devices is not supported in the initial version.

---

## 12. Future Scope

1. **Ground Taxiway Graph Routing:** Expand the graph engine from airport-to-airport routes to tarmac taxiways and runway intersections using A* search.
2. **Multi-Hub ATC Simulation:** Enable switching the active hub from NAG to BOM or DEL with distributed multi-airport queues.
3. **Collaborative Multi-Role Mode:** Integrate WebSockets or WebRTC to allow concurrent user roles (Ground Controller, Tower Controller, Airline Dispatcher).
4. **B-Tree Disk I/O Simulation:** Add simulated disk block access counters to visually demonstrate why B-Trees are preferred for database paging.

---

## 13. GitHub Submission Guidance

When submitting this project to GitHub or academic repositories:
1. Ensure `node_modules/` and `dist/` remain in `.gitignore`.
2. Commit all source files in `src/`, automated tests in `tests/`, and configuration files (`package.json`, `vite.config.ts`, `tsconfig.json`).
3. Verify that running `npm install && npm test && npm run build` completes with 0 errors on a fresh clone.
4. Keep the persistent simulation banner visible on all pages to ensure academic integrity.

---

## 14. Project Team Contribution Template

*(Update with actual member details prior to project submission; do not invent credentials)*

| Role | Name | Roll Number / Student ID | Primary Responsibilities |
| :--- | :--- | :--- | :--- |
| **Team Member 1 (Lead & Architect)** | `[Student Name 1]` | `[Roll Number 1]` | System architecture, Graph engine (BFS/DFS/Dijkstra), App Shell |
| **Team Member 2 (DSA Specialist - Trees)** | `[Student Name 2]` | `[Roll Number 2]` | Tree data structures (BST, AVL rotations, B-Tree, B+ Tree) |
| **Team Member 3 (DSA Specialist - Queues & Heaps)**| `[Student Name 3]` | `[Roll Number 3]` | Head-pointer Queue, Binary Max-Heap, Departure Queue workflows |
| **Team Member 4 (Resource & Conflict Systems)** | `[Student Name 4]` | `[Roll Number 4]` | Gate & runway allocation, interval conflict detector, domain validation |
| **Team Member 5 (Full-Stack & Test Engineer)** | `[Student Name 5]` | `[Roll Number 5]` | Hash Table indexing, LocalStorage persistence, Vitest test suites |
