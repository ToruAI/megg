# megg — Implementation Todo List

This todo list tracks the work required to implement the full vision of megg, as defined in `DESIGN.md`.

---

## 1. Core Structure & Files
- [x] **Standardize file types**
  - Define explicit interfaces for `info.md`, `map.md`, `decisions.md`, `changelog.md`
  - Ensure all file operations respect these standards

- [x] **Implement `info.md` structure**
  - Update `init` and `init_finalize` to generate the new standard `info.md` template (Context, Rules, Memory Files, Related)

- [x] **Implement `map.md` logic**
  - Create the `map()` tool logic to scan for `.megg/` directories
  - Format output as a hierarchical markdown list
  - Ensure `map.md` is only created/updated at the project root

## 2. Tool Implementation Updates

### `awake()`
- [x] **Create `awake` tool**
  - Implement function to gather root `info.md` + root `map.md`
  - Add light usage hint text
  - Ensure it handles missing files gracefully (e.g., if project not initialized)

### `recall()`
- [x] **Update `recall` logic**
  - Add "Implicit awake" behavior: check if awake was called this session; if not, prepend awake content
  - Implement context chaining: Root → [Intermediate] → Target
  - Support list of other files in target `.megg/` when path is specified
  - Optimize for lean output (don't dump everything)

### `remember()`
- [x] **Update `remember` logic**
  - Update to trigger `map()` regeneration if a new `.megg/` directory is created
  - Ensure it respects the append vs. create (`isNew`) flag
  - Validate path is within a `.megg` directory

### `settle()`
- [x] **Implement Propose-Approve workflow**
  - Instead of applying changes, return a diff or proposal text
  - Implement "Specific file" mode (summarize/dedupe)
  - Implement "Directory" mode (settle all files in `.megg/`)
  - Implement "Global" mode (scan and report bloat/staleness)
  - **Heuristics:**
    - Token count threshold check
    - Staleness check (file modification time)

### `map()`
- [x] **Create `map` tool**
  - Expose the internal map generation logic as a standalone tool
  - Write result to `.megg/map.md` at root

### `init()`
- [x] **Refine `init` flow**
  - Ensure the "scan → analyze → interview → propose" flow is robust
  - Update proposal format to include the standard file structures
  - Ensure `init_finalize` creates the exact structure user approved

## 3. Behavioral & Logic Improvements
- [x] **Path handling**
  - Ensure robust handling of various path formats (absolute, relative, with/without trailing slash)
  - Implement logic to find "nearest" `.megg/` if target doesn't have one (files in leaf folders)

- [x] **Bloat detection**
  - Implement basic token counting utility (can be approximate)
  - Add threshold constants (e.g., warning at 1000 tokens)

## 4. Documentation & Examples
- [x] **Update README.md**
  - Reflect the new "Good Employee" vision
  - Update installation and usage instructions
  - Remove code-centric assumptions (use generic examples)

- [x] **Create System Prompt Snippet**
  - Write a clear, copy-pasteable snippet for users to add to their agent configuration (e.g., "At session start, call megg.awake()...")

- [ ] **Test with non-code scenarios**
  - (Partially covered by generic tests, but explicit non-code testing is a manual validation step)

## 5. Future / Optional (Backlog)
- [ ] **MCP Resource for map**
  - Expose `map.md` as an auto-loading MCP resource (for clients that support it)

- [ ] **Cross-project memory**
  - Investigate machine-level shared memory

- [ ] **Vector Search**
  - Design RAG integration for large-scale memory (when grep hits limits)

---
*Created based on decisions in `DESIGN.md` and `JOURNEY.md`.*
