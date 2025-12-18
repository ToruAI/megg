# megg — The Journey

> How we arrived at the design through conversation.

This document captures the thinking process, rejected ideas, and key realizations that shaped megg. Useful for understanding WHY decisions were made, not just WHAT they are.

---

## Starting Point

**The initial pitch:** Contextual memory that lives where your code lives. `.megg/` folders dropped into project structure. Path-based recall. Simple.

**The initial assumption:** This is a dev tool for code projects.

---

## The Interrogation

Instead of accepting the pitch, we questioned everything.

### Question 1: "Who calls recall()?"

If the agent must remember to call `recall()` before working... you've recreated "remembering to remember." The exact problem megg claims to solve.

**Realization:** The tool can't rely on agent discipline. It needs to be more automatic.

**Solution:** Implicit awake. First touch of megg = full orientation. Agent can't miss it.

---

### Question 2: "How does the agent know WHERE to recall from?"

Real work touches multiple files in multiple directories. Which path do you recall? Do you call it 5 times?

**Initial concern:** Path-based model assumes locality, but work often isn't local.

**Counter-argument from user:** "Of course work has paths. I don't keep everything in one folder. Deeper = more specific. That's how I already organize."

**Realization:** The path model works IF the user already thinks in hierarchies. megg augments existing structure, doesn't impose new one.

**Evidence:** User shared their actual folder structure — clients, projects, documents, all nested logically. The hierarchy was already there.

---

### Question 3: "Is this just for code?"

**The reveal:** No. This is for everything. Emails, offers, client work, ideas, documents. The user works with AI agents for ALL tasks, not just coding.

**Implication:** megg can't be code-centric. Examples can't assume `src/`, `components/`, `api/`. Must work for any folder structure.

**Bigger realization:** This isn't a dev tool. This is infrastructure for persistent AI agents. The user's vision: agents on VPS, always available, remembering everything across sessions.

---

### Question 4: "What triggers memory at session start?"

New session. Fresh agent. No memory loaded. How does it know megg exists?

**Options considered:**
- System prompt injection (user must remember to add it)
- MCP resource auto-loading (depends on client support)
- Tool description hints (unreliable)
- Naming hack like `000_megg_start` (hacky)

**Decision:** Create `awake()` function. Simple, explicit. Document the one-line system prompt snippet users need. Don't fight the MCP limitation — work with it.

---

### Question 5: "Where does the map live?"

The map shows what `.megg/` folders exist. Where should it be?

**Option A:** Separate `map.md` file at root
**Option B:** Section inside root `info.md`

**Decision:** Option A. Separation of concerns.
- `info.md` = human-curated identity and rules
- `map.md` = auto-generated navigation

Agent knows: read `info.md` for context, read `map.md` for structure.

---

### Question 6: "How much should we instruct the agent?"

Should megg return detailed instructions on how to behave?

**User's answer:** "Much lighter. Usually user feels it or agent needs to remember. If awake is called, that's probably enough."

**Decision:** Three lines only:
```
- recall(path) when working somewhere unfamiliar
- remember() decisions that would be painful to forget
- if unsure about context, recall more
```

Trust the agent. If it's good, it figures it out. If not, more rules won't help.

---

## Key Realizations (In Order)

### 1. "This isn't a dev tool"

Started thinking about code projects. Ended understanding this is general-purpose memory infrastructure for AI agents working on anything.

### 2. "The user already thinks in hierarchies"

Path-based recall seemed limiting until we saw real folder structures. People already organize depth = specificity. megg just adds memory to existing structure.

### 3. "Semi-automatic, not full-automatic"

The user was clear: "Being on same page is non-negotiable." 

- Init: agent proposes, human approves
- Settle: agent proposes, human approves
- Rules: human defines

Automation for mechanics. Human judgment for meaning.

### 4. "Lean by default"

Don't dump all memory. Don't over-instruct. Start minimal, drill down when needed. Respect token limits. Trust the agent to ask for more.

### 5. "The good employee metaphor"

This crystallized everything. A good employee:
- Knows the big picture
- Knows where to find details
- Learns from experience
- Doesn't info-dump
- Gets better every day

megg makes agents good employees.

---

## Ideas Considered But Deferred

### Vector search / RAG

For large-scale memory, semantic search would be better than text grep.

**Why deferred:** Adds complexity. Breaks git-native simplicity. The scale problem doesn't exist yet. Add when grep becomes insufficient.

### Conversation extraction

Automatically extract memory-worthy moments from conversations instead of explicit `remember()` calls.

**Why deferred:** Hard to do well. Conversations are huge. What's "memory-worthy"? For now, agent explicitly decides what to remember.

### Cross-project memory

Machine-level knowledge that spans projects. "I always use this pattern" type stuff.

**Why deferred:** Scope creep. Solve single-project memory first. Cross-project is a different problem.

### Auto-settle triggers

Automatically consolidate when files get bloated instead of manual trigger.

**Why deferred:** Hard to get right. Token count is crude. Better to let humans trigger and approve until heuristics are proven.

---

## Ideas Rejected

### "Every folder gets .megg/"

Too noisy. Most folders don't need separate context. Only meaningful boundaries.

**Heuristic:** If context meaningfully changes when entering folder, maybe add `.megg/`. If it's "more of the same," don't.

### "Detailed agent instructions"

Long lists of rules and behaviors. Rejected for being over-engineered.

**Reality:** Three lines is enough. Trust the agent.

### "Separate memory database"

External storage, vector DB, graph DB. Rejected for complexity.

**megg principle:** Live with the work. Git-native. Markdown files. No external dependencies.

### "Auto-apply settle changes"

Let settle automatically rewrite files without approval.

**Rejected because:** Settle compresses information. Lossy operation. Human must approve.

---

## The Final Model

```
awake()     → orientation (identity + map + light rules)
recall()    → context chain (info.md from root → target)
remember()  → store (append with timestamp)
settle()    → consolidate (propose, human approves)
map()       → regenerate navigation
```

Files:
- `info.md` — curated context (always in chain)
- `map.md` — auto-generated structure (root only)
- `decisions.md`, `changelog.md`, custom — append-only logs

Principles:
- Depth = specificity
- Live with the work
- Chain of context
- Lean by default
- Semi-automatic

---

## For Future Development

When continuing work on megg, remember:

1. **Don't over-engineer.** The power is in simplicity.

2. **Test with non-code use cases.** It's not just for developers.

3. **Keep the human in the loop** for anything that changes or compresses memory.

4. **Trust agents** to use tools intelligently. Don't write instruction manuals.

5. **Git-native is sacred.** Don't add external dependencies unless absolutely necessary.

---

## For the LinkedIn Post

Key narrative points:

- AI agents are stateless. Every session starts from zero.
- Existing solutions require "remembering to remember" — manual systems die.
- megg: memory that lives where work lives. `.megg/` folders in your project.
- Depth = specificity. Your folder structure already carries meaning.
- Works with any agent, any model. MCP standard.
- Git-native. Version controlled. No vendor lock-in.
- The goal: agents that remember, learn, get better every day.

The hook: "What if your AI agent was a good employee?"

---

*Document created: End of design session, capturing the journey for future reference.*
