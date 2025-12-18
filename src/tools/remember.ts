
import path from 'path';
import { ensureDir, exists, readFile, writeFile } from '../utils/files.js';
import { createNewMemory, formatEntry, touchFrontmatter } from '../utils/format.js';
import { MEGG_DIR_NAME, resolvePath } from '../utils/paths.js';
import { mapMegg } from './map.js';

export async function remember(
  projectRoot: string,
  filePath: string,
  content: string,
  isNew: boolean = false
): Promise<string> {
  const absolutePath = resolvePath(projectRoot, filePath);
  
  // Security/Structure check: Must be inside a .megg directory
  // We check if '.megg' is part of the path segments leading to the file
  if (!absolutePath.includes(`${path.sep}${MEGG_DIR_NAME}${path.sep}`)) {
      // Fallback check for direct parent if includes logic fails on edge cases
      const dirName = path.basename(path.dirname(absolutePath));
      if (dirName !== MEGG_DIR_NAME) {
          throw new Error(`Invalid path: Memory files must be stored inside a '${MEGG_DIR_NAME}' directory.`);
      }
  }

  const dirPath = path.dirname(absolutePath);
  const dirExists = await exists(dirPath);

  let finalContent = "";
  let action = "";

  if (isNew || !(await exists(absolutePath))) {
    finalContent = createNewMemory(content);
    action = "Created new memory";
  } else {
    const existingContent = await readFile(absolutePath);
    // Update frontmatter 'updated' field
    const touchedContent = touchFrontmatter(existingContent);
    // Append new entry
    finalContent = touchedContent + formatEntry(content);
    action = "Appended to memory";
  }

  await writeFile(absolutePath, finalContent);

  // If we created a new .megg directory, regenerate the map
  if (!dirExists) {
      await mapMegg(projectRoot);
  }
  
  const relativePath = path.relative(projectRoot, absolutePath);
  return `${action} at ${relativePath}`;
}
