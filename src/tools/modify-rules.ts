
import path from 'path';
import { readFile, writeFile, exists } from '../utils/files.js';
import { MEGG_DIR_NAME, INFO_FILE_NAME } from '../utils/paths.js';

export async function modifyRules(projectRoot: string, newRules: string): Promise<string> {
  const infoPath = path.join(projectRoot, MEGG_DIR_NAME, INFO_FILE_NAME);
  
  if (!await exists(infoPath)) {
    throw new Error(`Root ${INFO_FILE_NAME} not found. Run 'init' first.`);
  }

  let content = await readFile(infoPath);
  const rulesHeader = '## Rules';
  const nextHeaderRegex = /\n## (?!Rules).*/; // Find next h2 header
  
  const startIndex = content.indexOf(rulesHeader);
  
  if (startIndex === -1) {
    // Append if not found
    content += `\n\n${rulesHeader}\n${newRules}`;
  } else {
    // Find where rules section ends (start of next section or EOF)
    const afterRules = content.substring(startIndex + rulesHeader.length);
    const nextMatch = afterRules.match(nextHeaderRegex);
    
    if (nextMatch && nextMatch.index !== undefined) {
      const endIndex = startIndex + rulesHeader.length + nextMatch.index;
      content = content.substring(0, startIndex) + 
                `${rulesHeader}\n${newRules}` + 
                content.substring(endIndex);
    } else {
        // Rules is the last section
        content = content.substring(0, startIndex) + `${rulesHeader}\n${newRules}`;
    }
  }

  await writeFile(infoPath, content);
  return `Updated rules in ${path.join(MEGG_DIR_NAME, INFO_FILE_NAME)}`;
}
