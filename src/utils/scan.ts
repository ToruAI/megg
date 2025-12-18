import fs from 'fs/promises';
import path from 'path';

export interface TreeNode {
  path: string;        // relative path from root
  type: 'file' | 'dir';
  size?: number;       // bytes, for files only
  children?: TreeNode[];
}

export interface ScanResult {
  tree: TreeNode[];
  keyFiles: string[];
}

// Files that typically contain project context
const KEY_FILE_PATTERNS = [
  /^readme/i,
  /^package\.json$/,
  /^cargo\.toml$/,
  /^pyproject\.toml$/,
  /^go\.mod$/,
  /^makefile$/i,
  /^dockerfile$/i,
  /^docker-compose/i,
  /\.config\.(js|ts|json)$/,
  /^tsconfig\.json$/,
  /^\.env\.example$/,
  /^requirements\.txt$/,
  /^setup\.py$/,
  /^composer\.json$/,
  /^gemfile$/i,
];

// Directories to skip during scan
const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'out',
  '__pycache__',
  '.next',
  '.nuxt',
  'vendor',
  'target',
  '.venv',
  'venv',
  'env',
  '.idea',
  '.vscode',
]);

// Files to skip
const SKIP_FILES = new Set([
  '.DS_Store',
  'Thumbs.db',
  '.gitignore',
  '.npmignore',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
]);

function isKeyFile(filename: string): boolean {
  return KEY_FILE_PATTERNS.some(pattern => pattern.test(filename));
}

function shouldSkipDir(dirname: string): boolean {
  return SKIP_DIRS.has(dirname) || dirname.startsWith('.');
}

function shouldSkipFile(filename: string): boolean {
  return SKIP_FILES.has(filename);
}

/**
 * Recursively builds a file tree from the given directory.
 * Returns tree nodes and collects key files.
 */
async function buildTree(
  rootPath: string,
  currentPath: string,
  keyFiles: string[],
  maxDepth: number,
  currentDepth: number = 0
): Promise<TreeNode[]> {
  if (currentDepth > maxDepth) {
    return [];
  }

  const entries = await fs.readdir(currentPath, { withFileTypes: true });
  const nodes: TreeNode[] = [];

  for (const entry of entries) {
    const fullPath = path.join(currentPath, entry.name);
    const relativePath = path.relative(rootPath, fullPath);

    if (entry.isDirectory()) {
      if (shouldSkipDir(entry.name)) {
        continue;
      }

      const children = await buildTree(
        rootPath,
        fullPath,
        keyFiles,
        maxDepth,
        currentDepth + 1
      );

      nodes.push({
        path: relativePath,
        type: 'dir',
        children,
      });
    } else if (entry.isFile()) {
      if (shouldSkipFile(entry.name)) {
        continue;
      }

      const stat = await fs.stat(fullPath);
      
      nodes.push({
        path: relativePath,
        type: 'file',
        size: stat.size,
      });

      // Collect key files (only from root or first level)
      if (currentDepth <= 1 && isKeyFile(entry.name)) {
        keyFiles.push(relativePath);
      }
    }
  }

  // Sort: directories first, then files, alphabetically
  nodes.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'dir' ? -1 : 1;
    }
    return a.path.localeCompare(b.path);
  });

  return nodes;
}

/**
 * Scans a project directory and returns the file tree and key files.
 * 
 * @param projectRoot - absolute path to project root
 * @param maxDepth - maximum directory depth to scan (default: 4)
 */
export async function scanProject(
  projectRoot: string,
  maxDepth: number = 4
): Promise<ScanResult> {
  const keyFiles: string[] = [];
  const tree = await buildTree(projectRoot, projectRoot, keyFiles, maxDepth);

  return {
    tree,
    keyFiles,
  };
}

/**
 * Formats the tree as a string for display.
 */
export function formatTree(nodes: TreeNode[], indent: string = ''): string {
  let result = '';
  
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const isLast = i === nodes.length - 1;
    const prefix = isLast ? '└── ' : '├── ';
    const childIndent = isLast ? '    ' : '│   ';
    
    const suffix = node.type === 'dir' ? '/' : '';
    result += `${indent}${prefix}${path.basename(node.path)}${suffix}\n`;
    
    if (node.children && node.children.length > 0) {
      result += formatTree(node.children, indent + childIndent);
    }
  }
  
  return result;
}
