# megg Hooks for Claude Code

This directory contains hook scripts for Claude Code integration.

## Installation

Add to your `.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume",
        "hooks": [
          {
            "type": "command",
            "command": "npx megg context --json 2>/dev/null || echo '{}'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Review the session. If significant architectural decisions, new patterns, or gotchas were discovered, suggest capturing them with megg learn(). If only routine work, allow stopping. Context: $ARGUMENTS"
          }
        ]
      }
    ]
  }
}
```

## What the hooks do

### SessionStart Hook

Automatically loads megg context when you start a Claude Code session:
- Discovers .megg directories by walking up the tree
- Loads info.md chain (domain hierarchy)
- Includes knowledge.md (full, summary, or blocked based on size)
- Lists sibling and child domains

The context is injected into Claude's context automatically.

### Stop Hook (Prompt-based)

When Claude is about to stop, this hook:
- Reviews what was done in the session
- If significant work was done (decisions, patterns, gotchas)
- Suggests capturing them with `megg learn()`
- If routine work, allows stopping normally

## Manual hooks

You can also use the CLI directly in hooks:

```bash
# Load context
npx megg context

# Load context filtered by topic
npx megg context --topic auth

# Add a learning
npx megg learn "Title" decision "topic1,topic2" "Content here"
```
