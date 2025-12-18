# megg - Memory Egg

> Contextual memory that lives where your code lives.

---

## The Problem

Every AI agent session starts from zero. You explain the same context, the same decisions, the same rules - over and over. 

You've tried changelogs, docs, even graph databases. They work, but they require you to *remember to remember*. Manual systems die.

What you need is memory that:
- Captures automatically
- Lives with the code (not in some external system)
- Grows smarter over time
- Is instantly available to any agent, any session

---

## The Idea

**megg** drops `.megg/` folders directly into your project structure.

Not a separate memory system. The actual folders. `api/`, `components/`, `infra/` - wherever work happens, memory lives there too.

```
your-project/
├── api/
│   ├── auth/
│   │   ├── handler.ts
│   │   └── .megg/
│   │       ├── info.md         <- always recalled (auth context)
│   │       ├── decisions.md    <- recalled on demand
│   │       └── gotchas.md
│   └── .megg/
│       ├── info.md             <- always recalled (api context)
│       └── conventions.md
├── frontend/
│   └── .megg/
│       └── info.md
└── .megg/
    ├── info.md                 <- always recalled (project goals, rules)
    ├── changelog.md
    └── architecture.md
```

**Depth = Specificity**

- Root `.megg/` → project vision, global rules, changelog
- `api/.megg/` → API conventions, patterns
- `api/auth/.megg/` → auth-specific decisions, gotchas

---

## How It Works

### Recall (two modes)

**Default: `recall(path)`** - lightweight context

Walks tree top → bottom, gathers only `info.md` files:

```
.megg/info.md            → "Fintech app, security-first..."
api/.megg/info.md        → "REST conventions, error format..."  
api/auth/.megg/info.md   → "JWT, refresh tokens in httpOnly..."
```

Fast, lean, always-relevant context. Enough for most tasks.

**Specific: `recall(path, files[])`** - deep context

When you need more, request specific files:

```typescript
recall("api/auth", ["decisions.md", "gotchas.md"])
```

Returns `info.md` chain PLUS the specified files from target location.

This keeps daily work light, but full history accessible when needed.

### Remember (explicit storage)

```typescript
remember(
  path: string,     // "api/auth/.megg/decisions.md"
  content: string,  // The memory content
  isNew?: boolean   // Create new file? Default: append
)
```

Timestamp added automatically. Agent decides location, megg handles the rest.

### Init (guided setup)

First run: conversational setup.
- What's this project about?
- What rules should agents follow?
- Any existing conventions?

Creates root `.megg/info.md` with goals, rules, structure guidance.

### Settle (consolidation)

Like sleep for your project's memory.
- Summarize verbose entries
- Remove outdated info  
- Restructure as project evolves
- Keep it lean

Run periodically or when context gets heavy.

---

## MCP Interface

```typescript
// Core tools
init()                              // Guided setup → .megg/info.md
recall(path?, files?[])             // Gather info.md chain, optionally + specific files
remember(path, content, isNew?)     // Store memory, auto-timestamp
settle(path?)                       // Consolidate, clean, restructure
map()                               // Show .megg structure across project

// Helpers  
modify_rules()                      // Update root .megg/info.md
get(path)                           // Read specific file
```

**Recall examples:**
```typescript
recall()                            // All info.md from root
recall("api/auth")                  // info.md chain: root → api → api/auth
recall("api/auth", ["decisions.md"]) // info.md chain + api/auth/.megg/decisions.md
```

Why MCP? 
- Programmatic retrieval logic
- Rules can evolve without code changes
- Works with any MCP-compatible agent
- Structured tool interface

---

## File Format

```markdown
---
created: 2024-01-15T10:30:00Z
updated: 2024-01-15T14:22:00Z
---

# Auth Decisions

## 2024-01-15T10:30:00Z
Chose JWT with 15min expiry, refresh tokens in httpOnly cookies.
Reason: stateless scaling, mobile app compatibility.

## 2024-01-15T14:22:00Z
Added refresh token rotation on every use.
Reason: security audit recommendation.
```

Human-readable. Version controlled. Parseable. Timestamps automatic.

---

## Principles

1. **Live with the code** - not a separate system, part of the project
2. **Automatic retrieval** - agent doesn't search, context comes to it
3. **Depth = specificity** - structure carries meaning
4. **Stay lean** - settle regularly, don't hoard
5. **Git-native** - version controlled, diffable, portable

---

## What This Enables

- Switch agents mid-project → no context loss
- Return after months → instant catch-up  
- Onboard new team members → they read what agents read
- Audit decisions → history lives where it happened
- Multiple memory files → organize as you need (decisions, todos, changelog, etc.)

---

## Open Questions

- Settle heuristics: when is memory "too heavy"? Token count? Age?
- Cross-project memory (machine-level knowledge base)?

---

**megg** - because good memory shouldn't be hard.
