# megg User Manual

**megg** is designed to make your AI (Agent) behave like a **Good Employee**.

## The Good Employee Philosophy

When you hire a senior engineer, they:
1.  **Orient themselves**: "What is this project? What are the standards?"
2.  **Look for local context**: "I'm working on the API, how do we handle auth here?"
3.  **Remember key decisions**: "Oh right, we don't use GraphQL here."
4.  **Don't overwrite everything**: They respect existing work.

megg provides the files and tools to let an AI do exactly this.

---

## 1. Setup (`init`)

The first time you use megg in a project:

1.  **User**: "Please initialize megg for this project."
2.  **Agent**: Calls `init()`. It scans your files to understand if this is a React app, a Rust CLI, or a book.
3.  **Agent**: "I see this is a Next.js app. I propose placing memory here..."
    *   `.megg/info.md` (Root rules)
    *   `src/components/.megg/info.md` (UI rules)
4.  **User**: "Looks good."
5.  **Agent**: Calls `init_finalize()`.

**The Result**: You now have `.megg/` folders. These are just markdown files. You can edit them manually given they are committed to git!

---

## 2. Daily Workflow

### Orientation (`awake`)
When you start a new chat, the agent is blank. You should instruct it to call `awake()`.
It reads:
- **Root `info.md`**: The project mission and "Golden Rules".
- **`map.md`**: A map of where other memories are stored.

### Working (`recall`)
When you ask the agent: *"Fix the bug in the login form"*, it should look at the map and see `src/auth/.megg/`.
It calls `recall("src/auth")`.
It gets:
1.  **Root Context**: "We use TypeScript."
2.  **Auth Context**: "We use Clerk for auth. Never roll your own crypto."

Now it knows **how** to work before it even reads the code.

### Remembering (`remember`)
You discuss a change: *"Let's switch to server actions for this form."*
The agent should call:
`remember("src/auth/.megg/decisions.md", "Switched Login format to Server Actions to reduce client bundle.")`

This is appended to the file with a timestamp. Next time, the agent reads this and knows *why* the code looks that way.

---

## 3. The Files

### `info.md` (The Context)
*Lives in every `.megg/` folder.*
This is the "Read Me First" for the agent.
- **Context**: Brief description of this directory's purpose.
- **Rules**: Hard constraints (e.g., "Files must be kebab-case", "No class components").
- **Related**: Links to other parts of the project.

### `decisions.md` (The Log)
*Optional, created as needed.*
An append-only log of architectural choices.
- format: `## [Timestamp]` followed by the decision and reasoning.

### `changelog.md` / `workflow.md` / `gotchas.md`
*Custom files.*
Create whatever files help the agent work better. The agent sees them when it calls `recall()`.

---

## 4. Maintenance (`settle`)

Over time, `decisions.md` grows large.
1.  **User**: "Cleanup the memory."
2.  **Agent**: Calls `settle()`.
3.  **megg**: Detects `decisions.md` is > 2000 tokens.
4.  **Agent**: Reads the file, summarizes older decisions into a tight bulleted list, and proposes overwriting the file.
5.  **User**: "Approved."

This keeps the memory "Lossy" but efficient—just like human long-term memory.

---

## 5. Best Practices

- **Commit `.megg` to Git**: This is project documentation. Your team needs it too.
- **Keep `info.md` Short**: It is loaded heavily. Keep it to high-level rules.
- **Use Depth**: Don't put everything in root. Put UI rules in `src/ui/.megg`.
- **Trust the Agent**: Don't micromanage. If the context is there, a good agent will find it.
