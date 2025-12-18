# megg API Reference

This document details the tools exposed by the megg MCP server.

## Core Tools

### `awake`
**Orient agent at session start.**

- **Input**: `(none)`
- **Output**:
  - Identity (content of root `.megg/info.md`)
  - Memory Map (content of `.megg/map.md`)
  - Usage hints
- **Use Case**: Call this immediately at the start of a conversation to understand "Where am I?" and "What are the rules?".

### `recall`
**Gather context for a specific location.**

- **Input**:
  - `path` (string, default: `.`): The directory to load context for.
  - `files` (string[], optional): Specific files to read from the target's `.megg/` folder (e.g., `["decisions.md", "workflow.md"]`).
- **Output**:
  - **Implicit Awake**: If `awake` hasn't been called, prepends Identity/Map.
  - **Context Chain**: Concatenates `info.md` content from Root → ... → Target.
  - **File Content**: (If `files` provided) The content of requested files.
  - **Directory Listing**: (If `files` NOT provided) A list of available memory files in the target `.megg/` directory.
- **Use Case**:
  - `recall("src/components")`: "I'm about to work on components, tell me the rules."
  - `recall("src/api", ["decisions.md"])`: "I need to know why we chose this API structure."

### `remember`
**Store a memory artifact.**

- **Input**:
  - `path` (string): Relative path to the file (must be inside a `.megg` directory).
  - `content` (string): The text to store.
  - `isNew` (boolean, default: `false`):
    - `true`: Overwrites/creates new file with Frontmatter.
    - `false`: Appends text to existing file with a timestamp header.
- **Output**: Confirmation message. Triggers `map()` update if a new directory is created.
- **Use Case**:
  - "We decided to use TanStack Query." -> `remember("src/frontend/.megg/decisions.md", "...")`

### `settle`
**Consolidate and clean memory.**

- **Input**:
  - `path` (string, optional): Specific file or directory to analyze. If omitted, scans the whole project.
- **Output**: A report describing "bloated" or "stale" files, with **proposed** actions (e.g., "Summarize this file").
- **Use Case**: "This decisions file is getting too long." -> `settle("src/api/.megg/decisions.md")` -> Agent reads proposal -> User approves -> Agent summarizes.

### `map`
**Show the structure of .megg folders.**

- **Input**: `(none)`
- **Output**: A hierarchical markdown list of all `.megg/` directories in the project.
- **Side Effect**: Updates the root `.megg/map.md` file.

## Setup Tools

### `init`
**Bootstrap megg in a new project.**

- **Input**:
  - `projectRoot` (string, optional): Root path.
- **Output**:
  - Formatted file tree of the project.
  - List of key files to read.
  - Instructions for the Agent to "Scan, Analyze, Interview, Propose".
- **Workflow**: This is the first step of the initialization ceremony.

### `init_finalize`
**Finalize initialization (write files).**

- **Input**:
  - `files` (array): List of file objects to create.
    - `path`: e.g., `.megg/info.md`
    - `content`: Markdown content.
    - `type`: File classification (`context`, `decisions`, etc.).
- **Output**: Success/Failure report.
- **Workflow**: Called after the Agent and User agree on the proposed structure.

### `modify_rules`
**Update global rules.**

- **Input**:
  - `rules` (string): The new content for the `## Rules` section of the root `info.md`.
- **Output**: Confirmation.
- **Use Case**: Quick updates to global project instructions without editing files manually.
