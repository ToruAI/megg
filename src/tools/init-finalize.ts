import path from 'path';
import { ensureDir, writeFile } from '../utils/files.js';
import { createNewMemory } from '../utils/format.js';
import { MEGG_DIR_NAME, INFO_FILE_NAME } from '../utils/paths.js';

export interface FileToCreate {
  path: string;    // e.g. ".megg/info.md", "src/.megg/info.md"
  content: string; // markdown content without frontmatter
  type: string;    // "context" | "decisions" | "workflow" | custom
}

export interface FinalizeInput {
  files: FileToCreate[];
}

export interface FinalizeResult {
  success: boolean;
  created: string[];
  errors: string[];
}

/**
 * Validates that root .megg/info.md is included in the files array.
 */
function validateRootInfoExists(files: FileToCreate[]): boolean {
  const rootInfoPath = path.join(MEGG_DIR_NAME, INFO_FILE_NAME);
  return files.some(f => f.path === rootInfoPath || f.path === `.megg/${INFO_FILE_NAME}`);
}

/**
 * Validates that all paths are within .megg directories.
 */
function validatePaths(files: FileToCreate[]): string[] {
  const errors: string[] = [];
  
  for (const file of files) {
    const normalized = path.normalize(file.path);
    
    // Must contain .megg in path
    if (!normalized.includes(MEGG_DIR_NAME)) {
      errors.push(`Invalid path "${file.path}": must be inside a .megg/ directory`);
    }
    
    // No path traversal
    if (normalized.includes('..')) {
      errors.push(`Invalid path "${file.path}": path traversal not allowed`);
    }
    
    // Must end with .md
    if (!normalized.endsWith('.md')) {
      errors.push(`Invalid path "${file.path}": must be a markdown file (.md)`);
    }
  }
  
  return errors;
}

/**
 * Finalizes megg initialization by writing all proposed files.
 * 
 * @param projectRoot - absolute path to project root
 * @param input - files to create
 */
export async function initFinalize(
  projectRoot: string,
  input: FinalizeInput
): Promise<FinalizeResult> {
  const { files } = input;
  const created: string[] = [];
  const errors: string[] = [];

  // Validate root info.md exists
  if (!validateRootInfoExists(files)) {
    return {
      success: false,
      created: [],
      errors: ['Root .megg/info.md is required but not included in files array'],
    };
  }

  // Validate all paths
  const pathErrors = validatePaths(files);
  if (pathErrors.length > 0) {
    return {
      success: false,
      created: [],
      errors: pathErrors,
    };
  }

  // Create all files
  for (const file of files) {
    try {
      const fullPath = path.join(projectRoot, file.path);
      const dirPath = path.dirname(fullPath);
      
      // Ensure .megg directory exists
      await ensureDir(dirPath);
      
      // Create file with frontmatter
      const contentWithFrontmatter = createNewMemory(file.content, file.type);
      await writeFile(fullPath, contentWithFrontmatter);
      
      created.push(file.path);
    } catch (err: any) {
      errors.push(`Failed to create "${file.path}": ${err.message}`);
    }
  }

  return {
    success: errors.length === 0,
    created,
    errors,
  };
}
