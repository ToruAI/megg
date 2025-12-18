
import path from 'path';
import fs from 'fs/promises';
import { MEGG_DIR_NAME } from '../utils/paths.js';
import { writeFile, getTimestamp } from '../utils/files.js';

// Define the name for the map file
export const MAP_FILE_NAME = 'map.md';

/**
 * Recursively scans for .megg directories and builds a tree structure.
 */
async function scanForMeggDirs(dir: string, projectRoot: string): Promise<string[]> {
  const results: string[] = [];
  try {
    const list = await fs.readdir(dir);
    
    // Check if this dir HAS a .megg subdir
    // Note: We are looking for parent directories that CONTAIN .megg
    const hasMegg = list.includes(MEGG_DIR_NAME);
    
    if (hasMegg) {
      results.push(path.relative(projectRoot, dir) || '.');
    }

    // Traverse subdirectories
    for (const file of list) {
      if (file === 'node_modules' || file === '.git' || file === MEGG_DIR_NAME) continue;
      
      const filePath = path.join(dir, file);
      // We need to check if it's a directory before recursing
      try {
        const stat = await fs.stat(filePath);
        if (stat.isDirectory()) {
          results.push(...await scanForMeggDirs(filePath, projectRoot));
        }
      } catch (e) {
        // Ignore errors (symlinks, permission denied, etc)
      }
    }
  } catch (err) {
    // Ignore access errors
  }
  return results;
}

/**
 * Formats a list of paths into a hierarchical markdown list.
 * e.g.
 * - `.megg/`
 * - `src/.megg/`
 *   - `src/api/.megg/`
 */
function formatMapMarkdown(paths: string[]): string {
    const sortedPaths = paths.sort();
    let output = '';

    for (const p of sortedPaths) {
        // Calculate indentation depth based on path depth
        // But the requirement example shows keys as full paths or somewhat hierarchical
        // The design doc example:
        // - `.megg/` — project identity and rules
        // - `src/.megg/` — source code conventions
        //   - `src/api/.megg/` — API-specific context
        
        // Let's keep it simple: List the paths relative to root, appending .megg/
        // Use indentation for visual hierarchy.
        
        const isRoot = p === '.';
        const displayPath = isRoot ? MEGG_DIR_NAME + '/' : path.join(p, MEGG_DIR_NAME + '/');
        
        // Simple indentation based on '/' count, excluding root
        const depth = isRoot ? 0 : p.split(path.sep).length;
        const indent = '  '.repeat(depth);
        
        output += `${indent}- \`${displayPath}\`\n`;
    }
    return output;
}

export async function mapMegg(projectRoot: string): Promise<string> {
  const meggDirs = await scanForMeggDirs(projectRoot, projectRoot);
  
  if (meggDirs.length === 0) return "No .megg found.";

  const structure = formatMapMarkdown(meggDirs);
  
  const content = `# Memory Map

Auto-generated. Last updated: ${getTimestamp()}

## Structure

${structure}
`;

  // Write to root .megg/map.md
  // We need to ensure root .megg exists. It should if we found any, but let's be safe.
  try {
      const mapPath = path.join(projectRoot, MEGG_DIR_NAME, MAP_FILE_NAME);
      await writeFile(mapPath, content);
  } catch (e) {
      console.warn("Failed to write map.md:", e);
  }

  return content;
}
