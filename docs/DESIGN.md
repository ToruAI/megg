# megg — Design Document

> Memory layer for the agentic future.

This document captures the complete vision, decisions, and implementation guidance for megg. Written to enable any agent or human to continue development with full context.

---

## Vision

**megg is infrastructure for persistent AI agents.**

- Model agnostic (Claude, GPT, Gemini, anything)
- Agent agnostic (Claude Code, Cursor, Gemini CLI, custom agents)
- Use-case agnostic (code, emails, offers, ideas, documents, anything)
- MCP is the interface (standard protocol, any client can use it)

Every session is fresh. Memory must load. The agent should feel continuous even though it's stateless underneath.

**Core metaphor: A good employee.**

A good employee:
- Remembers the big picture (always available)
- Knows where details live (can drill down)
- Learns from past decisions (history matters)
- Doesn't dump everything at once (respects limits)
- Gets better every day

megg makes AI agents good employees.

---

## Core Principles

### 1. Depth = Specificity

Folder structure carries meaning. Deeper = more specific context.

```
projects/                         <- general project rules
projects/active/                  <- active project conventions  
projects/active/website/          <- website-specific context
projects/active/website/api/      <- API conventions for website
```

`.megg/` folders drop into this existing structure. They don't replace it — they augment it.

### 2. Live with the work

Memory is not a separate system. It lives where the work happens.

```
projects/active/website/
├── .megg/
│   ├── info.md        <- context about this project
│   └── decisions.md   <- key decisions made
├── api/
├── frontend/
└── docs/
```

Git-native. Version controlled. Diffable. Portable.

### 3. Chain of context

When recalling memory for a path, megg walks from root to target, gathering `info.md` at each level.

```
recall("projects/active/website")
```

Returns (in order):
1. `.megg/info.md` (root — identity, global rules)
2. `projects/.megg/info.md` (project handling rules)
3. `projects/active/.megg/info.md` (active project conventions)
4. `projects/active/website/.megg/info.md` (website-specific context)

Automatic context inheritance. No manual assembly.

### 4. Lean by default

Don't dump everything. Start minimal, drill down when needed.

- `awake()` → identity + map (orientation)
- `recall(path)` → info.md chain (working context)
- `recall(path, files)` → chain + specific files (deep context)

Agent pulls what it needs. Nothing more.

### 5. Semi-automatic

Human stays in the loop for important decisions:
- Bootstrap structure: agent proposes, human approves
- Settle/consolidate: agent proposes changes, human approves
- Rules: human defines, agent follows

Automation for mechanics. Human judgment for meaning.

---

## File Structure

### Standard files

| File | Purpose | Generation |
|------|---------|------------|
| `info.md` | Curated context — identity, rules, relationships | Human + agent curated |
| `map.md` | Memory structure navigation (root only) | Auto-generated |
| `decisions.md` | Log of choices and reasoning | Append-only |
| `changelog.md` | What happened when | Append-only |
| `[custom].md` | Whatever fits the context | Flexible |

### info.md shape

```markdown
# [Name]

## Context
What is this. Why it exists. Key facts.
Keep it brief — this is always loaded.

## Rules
How to behave here. What to avoid.
Specific, actionable, not generic.

## Memory Files
- decisions.md: architectural choices and reasoning
- changelog.md: delivery history

## Related
- See: path/to/related for [reason]
- See: other/path for [reason]
```

### map.md shape (root only)

```markdown
# Memory Map

Auto-generated. Last updated: [timestamp]

## Structure

- `.megg/` — project identity and rules
- `src/.megg/` — source code conventions
  - `src/api/.megg/` — API-specific context
  - `src/frontend/.megg/` — frontend-specific context
- `docs/.megg/` — documentation rules
```

Updated automatically when:
- `remember()` creates new `.megg/` directory
- `settle()` runs
- `map()` explicitly called

---

## Tools

### awake()

**Purpose:** Orient agent at session start.

**Returns:**
```markdown
# megg — Project Memory

## Identity
[root info.md content]

## Memory Map  
[map.md content]

## Using megg
- recall(path) when working somewhere unfamiliar
- remember() decisions that would be painful to forget  
- if unsure about context, recall more
```

**Behavior:**
- Explicit call for orientation
- Light rules — trust the agent, don't over-instruct

---

### recall(path?, files?)

**Purpose:** Gather context for a location.

**Modes:**

```typescript
recall()
// Returns: root info.md + map.md
// Use: general orientation (same as awake)

recall("src/api")  
// Returns: info.md chain from root → target
// Plus: list of other files in target .megg/ (so agent knows what's available)

recall("src/api", ["decisions.md"])
// Returns: info.md chain + content of specified files
```

**Implicit awake:**
If `recall()` is called without prior `awake()` in session, prepend awake content automatically. Agent can't miss orientation.

---

### remember(path, content, isNew?)

**Purpose:** Store memory.

**Behavior:**
- `isNew: false` (default) → append entry with timestamp
- `isNew: true` → create new file with frontmatter
- Path must be inside `.megg/` directory
- Creates `.megg/` directory if needed
- Triggers map.md update if new directory created

**Example:**
```typescript
remember(
  "src/api/.megg/decisions.md",
  "Chose REST over GraphQL. Reason: simpler client integration, team familiarity.",
  false
)
```

---

### settle(path?)

**Purpose:** Consolidate and clean memory.

**Modes:**

```typescript
settle("src/api/.megg/decisions.md")
// Specific file: summarize if bloated, remove duplicates

settle("src/api")
// Directory: settle all files in that .megg/

settle()
// Global: scan all .megg/, report bloat/staleness, propose actions
```

**Key principle:** Settle PROPOSES, does not auto-apply.

Returns proposed changes. Agent presents to user. User approves.

**Bloat detection:**
- Token count threshold (code-measurable)
- Staleness: entries older than X months without update
- Contradictions: agent reasoning flags inconsistencies

---

### map()

**Purpose:** Regenerate map.md

**Behavior:**
- Scans project for all `.megg/` directories
- Builds hierarchical structure
- Writes to root `.megg/map.md`
- Returns the map content

---

### get(path)

**Purpose:** Read specific memory file.

**Use case:** When agent knows exactly what file it needs.

---

### modify_rules(rules)

**Purpose:** Update Rules section of root info.md.

**Use case:** When global rules need to change.

---

### init()

**Purpose:** Bootstrap megg in a project.

**Flow:**
1. Scan project structure
2. Identify key files and patterns
3. Propose `.megg/` locations and content
4. Interview user for corrections/additions
5. User approves
6. Create files via init_finalize()

**Principle:** Semi-automatic. Agent proposes, human approves. Being on same page is non-negotiable.

---

## Behavioral Rules for Agent

Keep it light. Three lines:

```
- recall(path) when working somewhere unfamiliar
- remember() decisions that would be painful to forget
- if unsure about context, recall more
```

Don't over-instruct. Trust the agent. If it's a good agent, it will figure it out. If it's not, more rules won't help.

---

## Session Flow

### New session (typical)

```
1. Agent calls awake() or recall()
   → Gets identity, rules, map
   
2. User asks for work in specific area
   → Agent calls recall("path/to/area")
   → Gets context chain
   
3. Agent does work
   
4. Agent learns something important
   → Calls remember() to store it
   
5. Session ends
   → Memory persists in .megg/ files
   → Git commit captures state
```

### New project setup

```
1. User: "initialize megg"
   
2. Agent calls init()
   → Gets project tree, key files
   
3. Agent reads files, analyzes structure
   
4. Agent interviews user:
   - What is this project?
   - What rules should I follow?
   - What should I avoid?
   
5. Agent proposes .megg/ structure
   
6. User approves/adjusts
   
7. Agent calls init_finalize()
   → Creates .megg/ directories and files
```

### Maintenance

```
1. User notices context feels stale
   → Or agent flags it
   
2. User: "settle the project memory"
   
3. Agent calls settle("path/to/area")
   → Analyzes files
   → Proposes consolidation
   
4. User approves
   
5. Agent applies changes
```

---

## Where .megg/ Should Exist

**At meaningful boundaries, not every folder.**

Good locations:
- Project root (required)
- Major domains (`src/`, `docs/`, `tests/`)
- Active workstreams or subprojects
- Areas with distinct rules or context

Bad locations:
- Every single folder
- Leaf folders with just files
- Temporary or generated directories

**Heuristic:** If the context meaningfully changes when entering this folder, it might need `.megg/`. If it's just "more of the same," it doesn't.

---

## Technical Notes

### Git integration

megg is git-native by design:
- All memory is markdown files
- All files live in `.megg/` directories (can be gitignored or committed)
- Version history comes free
- Collaboration works (merge conflicts are visible)

**Recommendation:** Commit `.megg/` files. They are project context, not secrets.

### Token budget awareness

Agents have context limits. megg helps by:
- Keeping `info.md` lean (~500 tokens max recommended)
- Only loading what's requested
- Settle compresses bloated files

**The agent should never dump all memory at once.**

### MCP implementation

megg is an MCP server. Key points:
- Tools are the primary interface
- Resources could expose map.md for auto-loading (future)
- Works with any MCP-compatible client

---

## Open Questions (Future)

1. **Cross-project memory** — machine-level knowledge that spans projects?

2. **Vector search** — for large-scale memory, RAG-style retrieval. Add when grep-based search becomes insufficient.

3. **Conversation extraction** — automatically extract memory-worthy moments from conversations. For now: agent explicitly calls remember().

4. **Settle heuristics** — better automatic detection of when to consolidate. Token count is crude but works.

---

## Summary

megg is simple:
- `.megg/` folders live with your work
- `info.md` = curated context (always loaded in chain)
- `map.md` = what memory exists (navigation)
- `recall()` = get context
- `remember()` = store context
- `settle()` = clean up

The goal: AI agents that remember, learn, and get better every day.

---

*Document created: Session discussing megg design philosophy and implementation direction.*
*For implementation details, see source code in `src/`.*
