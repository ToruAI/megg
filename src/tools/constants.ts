export const MEGG_INIT_INSTRUCTIONS = `## megg initialization

You have received a file tree of the project.

### Step 1: Scan
Read the key files listed above to understand the project.
If the list is empty or insufficient, identify and read other files that seem important based on the tree structure.

### Step 2: Analyze
From the files you read, identify:
- **Project type**: code, content, documentation, mixed, or other
- **Primary purpose**: what does this project do or produce
- **Workflow**: how do files move or change over time (e.g., draft → review → published)
- **Structure patterns**: naming conventions, folder organization logic
- **Boundaries**: distinct areas that may need separate .megg/ context

### Step 3: Interview
Present your analysis to the user. Then ask:
1. Is your understanding correct? What needs correction?
2. What rules should AI follow when working in this project?
3. What mistakes should AI avoid?
4. Any context not visible in the files?

Listen for:
- Implicit workflows not obvious from structure
- Quality standards or conventions
- Domain-specific terminology
- Boundaries between different parts of the project

### Step 4: Propose
Based on analysis and interview, propose:
- Which folders should have .megg/ directories
- What files to create in each .megg/ (info.md is required at root)
- Draft content for each file

Show the full proposal to the user. Format:

\`\`\`
Proposed .megg structure:

.megg/
  info.md        <- [required] project context, goals, rules
  
{other_folder}/.megg/
  info.md        <- context specific to this area
  {other_file}.md <- if needed
\`\`\`

Then show draft content for each file. Use this standard structure for info.md:

\`\`\`markdown
# [Name of Area/Project]

## Context
[What is this. Why it exists. Key facts. Keep it brief.]

## Rules
[How to behave here. What to avoid. Specific, actionable, not generic.]

## Memory Files
- decisions.md: architectural choices and reasoning
- changelog.md: delivery history
- [custom].md: [description]

## Related
- See: path/to/related for [reason]
\`\`\`

### Step 5: Finalize
After user approval (or requested changes), call \`init_finalize\` with:

\`\`\`json
{
  "files": [
    {
      "path": ".megg/info.md",
      "content": "# Project Context\\n\\n## Goals\\n...",
      "type": "context"
    },
    {
      "path": "src/.megg/info.md", 
      "content": "...",
      "type": "context"
    }
  ]
}
\`\`\`

Rules:
- Root .megg/info.md is required
- Nested .megg/ folders are optional
- File names are flexible (info.md, decisions.md, workflow.md, etc.)
- Content should be specific and actionable, not generic
- Do not include frontmatter in content (it will be added automatically)
`;
