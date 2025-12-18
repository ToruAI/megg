
import path from 'path';
import { findMeggDirs, findMeggFiles, INFO_FILE_NAME, resolvePath, MEGG_DIR_NAME } from '../utils/paths.js';
import { readFile, exists, listFiles } from '../utils/files.js';
import { sessionState } from '../state.js';
import { awake } from './awake.js';

export async function recall(
  projectRoot: string, 
  targetPath: string = '.', 
  specificFiles?: string[]
): Promise<string> {
  let output = "";

  // 0. Implicit Awake
  if (!sessionState.hasAwoken) {
      output += await awake(projectRoot);
      output += "\n\n--- (Implicit Awake active) ---\n";
      // awake() sets hasAwoken = true
  }

  // 1. Resolve path and find all .megg directories from root -> target
  const meggDirs = await findMeggDirs(projectRoot, targetPath);
  
  if (meggDirs.length === 0) {
    if (output) return output + "\nNo specific megg memory found in this path.";
    return "No megg memory found in this path.";
  }

  let fullContext = "";

  // 2. Gather info.md from all levels (Chain of Context)
  for (const dir of meggDirs) {
    const infoPath = path.join(dir, INFO_FILE_NAME);
    if (await exists(infoPath)) {
      const content = await readFile(infoPath);
      // Make path relative to project root for clarity
      const dirParent = path.dirname(dir);
      const relativeDir = path.relative(projectRoot, dirParent);
      const label = relativeDir === '' ? 'ROOT' : relativeDir;
      fullContext += `\n\n=== Context: ${label} (${INFO_FILE_NAME}) ===\n\n${content}`;
    }
  }

  // 3. Handle specific files OR list available files
  const absoluteTargetMegg = path.join(resolvePath(projectRoot, targetPath), MEGG_DIR_NAME);
  // Check if the last found megg dir is actually the target's megg dir
  const targetHasMegg = await exists(absoluteTargetMegg);

  if (specificFiles && specificFiles.length > 0) {
    if (targetHasMegg) {
      for (const fileName of specificFiles) {
        const filePath = path.join(absoluteTargetMegg, fileName);
        if (await exists(filePath)) {
          const content = await readFile(filePath);
          fullContext += `\n\n=== Detail: ${fileName} ===\n\n${content}`;
        } else {
          fullContext += `\n\n=== Detail: ${fileName} ===\n\n(File not found)`;
        }
      }
    } else {
         fullContext += `\n\n(Warning: No .megg directory found at ${targetPath}, cannot retrieve specific files)`;
    }
  } else if (targetHasMegg) {
    // No specific files requested, so LIST other files in the target .megg
    const allFiles = await listFiles(absoluteTargetMegg);
    const otherFiles = allFiles.filter(f => f !== INFO_FILE_NAME && !f.startsWith('.'));
    
    if (otherFiles.length > 0) {
        fullContext += `\n\n=== Available Memory in ${targetPath} ===\n`;
        otherFiles.forEach(f => {
            fullContext += `- ${f}\n`;
        });
    }
  }

  return output + fullContext || "Memory empty.";
}
