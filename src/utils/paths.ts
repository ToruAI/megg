
import path from 'path';
import { exists, listFiles } from './files.js';

export const MEGG_DIR_NAME = '.megg';
export const INFO_FILE_NAME = 'info.md';

/**
 * Resolves an absolute path from the project root.
 */
export function resolvePath(projectRoot: string, relativePath: string): string {
  return path.resolve(projectRoot, relativePath);
}

/**
 * Finds all .megg directories from project root down to the target path.
 * Returns absolute paths to the .megg directories.
 */
export async function findMeggDirs(projectRoot: string, targetPath: string): Promise<string[]> {
  const absoluteRoot = path.resolve(projectRoot);
  const absoluteTarget = path.resolve(projectRoot, targetPath);
  
  if (!absoluteTarget.startsWith(absoluteRoot)) {
    throw new Error('Target path must be within project root');
  }

  const relativeTarget = path.relative(absoluteRoot, absoluteTarget);
  const segments = relativeTarget.split(path.sep);
  
  const meggDirs: string[] = [];
  let currentPath = absoluteRoot;

  // Check root .megg
  if (await exists(path.join(currentPath, MEGG_DIR_NAME))) {
    meggDirs.push(path.join(currentPath, MEGG_DIR_NAME));
  }

  // Check each segment
  if (segments[0] !== '') { // handle case where target is root
    for (const segment of segments) {
      currentPath = path.join(currentPath, segment);
      const meggPath = path.join(currentPath, MEGG_DIR_NAME);
      if (await exists(meggPath)) {
        meggDirs.push(meggPath);
      }
    }
  }

  return meggDirs;
}

/**
 * Finds specific files within a .megg directory.
 */
export async function findMeggFiles(meggDir: string, patterns?: string[]): Promise<string[]> {
    const allFiles = await listFiles(meggDir);
    if (!patterns) return allFiles.map(f => path.join(meggDir, f));

    // Simple strict matching for now, could add glob support later if needed
    return patterns
        .filter(p => allFiles.includes(p))
        .map(p => path.join(meggDir, p));
}
