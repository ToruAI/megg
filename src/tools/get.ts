
import { readFile, exists } from '../utils/files.js';
import { resolvePath } from '../utils/paths.js';

export async function getFile(projectRoot: string, filePath: string): Promise<string> {
  const absolutePath = resolvePath(projectRoot, filePath);
  
  if (!await exists(absolutePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  
  return await readFile(absolutePath);
}
