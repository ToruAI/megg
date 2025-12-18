#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { initMegg } from "./tools/init.js";
import { initFinalize } from "./tools/init-finalize.js";
import { recall } from "./tools/recall.js";
import { remember } from "./tools/remember.js";
import { mapMegg } from "./tools/map.js";
import { getFile } from "./tools/get.js";
import { modifyRules } from "./tools/modify-rules.js";
import { settle } from "./tools/settle.js";
import { awake } from "./tools/awake.js";

// Create server instance
const server = new McpServer({
  name: "megg",
  version: "1.0.0",
});

const PROJECT_ROOT = process.cwd();

// Register tools

server.tool(
  "awake",
  "Orient agent at session start. Returns identity (info.md) and memory map (map.md).",
  {},
  async () => {
    const result = await awake(PROJECT_ROOT);
    return { content: [{ type: "text", text: result }] };
  }
);

server.tool(
  "init",
  "Initialize megg memory in the current project. Returns file tree, key files to read, and instructions for the AI to follow. The AI should then scan, analyze, interview the user, and call init_finalize.",
  {
    projectRoot: z.string().optional().describe("Root directory (defaults to cwd)"),
  },
  async ({ projectRoot }) => {
    const root = projectRoot || PROJECT_ROOT;
    const result = await initMegg(root);
    
    // Format response for AI consumption
    const response = `## Status
${result.status === 'already_initialized' ? '⚠️ megg is already initialized. Proceeding will help you understand or update the structure.' : '✓ Ready to initialize.'}

## Project Tree
\`\`\`
${result.treeFormatted}
\`\`\`

## Key Files to Read
${result.keyFiles.length > 0 
  ? result.keyFiles.map(f => `- ${f}`).join('\n')
  : '(No standard config files detected. Examine the tree and read files that seem important.)'}

${result.instructions}`;

    return { content: [{ type: "text", text: response }] };
  }
);

server.tool(
  "init_finalize",
  "Finalize megg initialization by writing all proposed .megg files. Call this after scanning, analyzing, and interviewing the user.",
  {
    files: z.array(z.object({
      path: z.string().describe("Path relative to project root (e.g. '.megg/info.md', 'src/.megg/decisions.md')"),
      content: z.string().describe("Markdown content without frontmatter (frontmatter is added automatically)"),
      type: z.string().describe("File type: 'context', 'decisions', 'workflow', or custom"),
    })).describe("Array of files to create"),
  },
  async ({ files }) => {
    try {
      const result = await initFinalize(PROJECT_ROOT, { files });
      
      if (result.success) {
        return { 
          content: [{ 
            type: "text", 
            text: `✓ megg initialized successfully.\n\nCreated files:\n${result.created.map(f => `  - ${f}`).join('\n')}` 
          }] 
        };
      } else {
        return { 
          isError: true,
          content: [{ 
            type: "text", 
            text: `✗ Initialization failed.\n\nErrors:\n${result.errors.map(e => `  - ${e}`).join('\n')}${result.created.length > 0 ? `\n\nPartially created:\n${result.created.map(f => `  - ${f}`).join('\n')}` : ''}` 
          }] 
        };
      }
    } catch (err: any) {
      return { 
        isError: true,
        content: [{ type: "text", text: `Error: ${err.message}` }] 
      };
    }
  }
);

server.tool(
  "recall",
  "Gather context from .megg folders (info.md chain + optional specific files)",
  {
    path: z.string().default(".").describe("Path to recall context for (defaults to project root)"),
    files: z.array(z.string()).optional().describe("Specific files to include from the target .megg directory"),
  },
  async ({ path: targetPath, files }) => {
    const result = await recall(PROJECT_ROOT, targetPath, files);
    return { content: [{ type: "text", text: result }] };
  }
);

server.tool(
  "remember",
  "Store a memory artifact at a specific path",
  {
    path: z.string().describe("Path to file (e.g. api/.megg/decisions.md)"),
    content: z.string().describe("Content to store"),
    isNew: z.boolean().default(false).describe("True to create new file with frontmatter, false to append entry"),
  },
  async ({ path: filePath, content, isNew }) => {
    try {
      const result = await remember(PROJECT_ROOT, filePath, content, isNew);
      return { content: [{ type: "text", text: result }] };
    } catch (err: any) {
       return { 
           isError: true,
           content: [{ type: "text", text: `Error: ${err.message}` }] 
       };
    }
  }
);

server.tool(
  "map",
  "Show the structure of .megg folders",
  {},
  async () => {
    const result = await mapMegg(PROJECT_ROOT);
    return { content: [{ type: "text", text: result }] };
  }
);

server.tool(
  "get",
  "Read a specific memory file",
  {
    path: z.string().describe("Path to the file"),
  },
  async ({ path: filePath }) => {
    try {
      const result = await getFile(PROJECT_ROOT, filePath);
      return { content: [{ type: "text", text: result }] };
    } catch (err: any) {
        return { 
            isError: true,
            content: [{ type: "text", text: `Error: ${err.message}` }] 
        };
     }
  }
);

server.tool(
  "modify_rules",
  "Update the Rules section of the root info.md",
  {
    rules: z.string().describe("New rules content"),
  },
  async ({ rules }) => {
    try {
      const result = await modifyRules(PROJECT_ROOT, rules);
      return { content: [{ type: "text", text: result }] };
    } catch (err: any) {
         return { 
            isError: true,
            content: [{ type: "text", text: `Error: ${err.message}` }] 
        };
    }
  }
);

server.tool(
  "settle",
  "Consolidate or clean up memory files",
  {
    path: z.string().optional().describe("Specific file path to settle"),
  },
  async ({ path: filePath }) => {
    const result = await settle(PROJECT_ROOT, filePath);
    return { content: [{ type: "text", text: result }] };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("megg MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
