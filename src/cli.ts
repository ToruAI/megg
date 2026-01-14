#!/usr/bin/env node
/**
 * megg CLI
 *
 * Usage:
 *   npx megg context [path] [--topic <topic>] [--json]
 *   npx megg learn <title> <type> <topics> <content> [path]
 *   npx megg init [path]
 *   npx megg maintain [path]
 *   npx megg --help
 */

import { contextCommand } from './commands/context.js';
import { learnCommand } from './commands/learn.js';
import { initCommand } from './commands/init.js';
import { maintainCommand } from './commands/maintain.js';

const VERSION = '2.0.0';

const HELP = `
megg v${VERSION} - Memory for AI Agents

USAGE:
  megg <command> [options]

COMMANDS:
  context [path]           Load context chain and knowledge
    --topic <topic>        Filter knowledge by topic
    --json                 Output JSON for hook integration

  learn <title> <type> <topics> <content> [path]
                           Add a knowledge entry
    <type>                 decision | pattern | gotcha | context
    <topics>               Comma-separated tags

  init [path]              Initialize megg in directory
    --info <content>       Provide info.md content directly

  maintain [path]          Analyze and report on knowledge health

  help                     Show this help message
  version                  Show version

EXAMPLES:
  # Load context for current directory
  megg context

  # Load context filtered by topic
  megg context . --topic auth

  # Add a decision entry
  megg learn "Use JWT for auth" decision "auth,security" "We chose JWT because..."

  # Initialize megg
  megg init

  # Check knowledge health
  megg maintain

HOOK INTEGRATION:
  # For Claude Code SessionStart hook:
  megg context --json

  # Returns JSON with additionalContext for the hook system
`;

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === 'help' || args[0] === '--help' || args[0] === '-h') {
    console.log(HELP);
    process.exit(0);
  }

  if (args[0] === 'version' || args[0] === '--version' || args[0] === '-v') {
    console.log(`megg v${VERSION}`);
    process.exit(0);
  }

  const command = args[0];

  try {
    switch (command) {
      case 'context': {
        const pathArg = args[1] && !args[1].startsWith('--') ? args[1] : undefined;
        const topicIndex = args.indexOf('--topic');
        const topic = topicIndex !== -1 ? args[topicIndex + 1] : undefined;
        const json = args.includes('--json');

        const output = await contextCommand(pathArg, { topic, json });
        console.log(output);
        break;
      }

      case 'learn': {
        if (args.length < 5) {
          console.error('Usage: megg learn <title> <type> <topics> <content> [path]');
          console.error('  <type>: decision | pattern | gotcha | context');
          console.error('  <topics>: comma-separated tags (e.g., "auth,api,security")');
          process.exit(1);
        }

        const [, title, type, topics, content, targetPath] = args;
        const output = await learnCommand(title, type, topics, content, targetPath);
        console.log(output);
        break;
      }

      case 'init': {
        const pathArg = args[1] && !args[1].startsWith('--') ? args[1] : undefined;
        const infoIndex = args.indexOf('--info');
        const info = infoIndex !== -1 ? args[infoIndex + 1] : undefined;

        const output = await initCommand(pathArg, info);
        console.log(output);
        break;
      }

      case 'maintain': {
        const pathArg = args[1];
        const output = await maintainCommand(pathArg);
        console.log(output);
        break;
      }

      default:
        console.error(`Unknown command: ${command}`);
        console.error('Run "megg help" for usage information.');
        process.exit(1);
    }
  } catch (err: any) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
