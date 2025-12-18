
import { getTimestamp } from './files.js';

interface Frontmatter {
  created?: string;
  updated?: string;
  type?: string;
  [key: string]: any;
}

/**
 * Creates content for a new memory file with frontmatter.
 */
export function createNewMemory(content: string, type: string = 'memory'): string {
  const now = getTimestamp();
  const frontmatter = [
    '---',
    `created: ${now}`,
    `updated: ${now}`,
    `type: ${type}`,
    '---',
    ''
  ].join('\n');

  return frontmatter + content;
}

/**
 * Formats a new entry to be appended to an existing file.
 */
export function formatEntry(content: string): string {
  const now = getTimestamp();
  return `\n\n## ${now}\n${content}`;
}

/**
 * Updates the 'updated' field in frontmatter if it exists.
 * (Simple regex implementation)
 */
export function touchFrontmatter(fileContent: string): string {
  const now = getTimestamp();
  const updatedRegex = /^updated: .*$/m;
  
  if (updatedRegex.test(fileContent)) {
    return fileContent.replace(updatedRegex, `updated: ${now}`);
  }
  
  // If no updated field but has frontmatter, add it
  if (fileContent.startsWith('---\n')) {
      return fileContent.replace('---\n', `---\nupdated: ${now}\n`);
  }
  
  return fileContent;
}
