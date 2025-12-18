import path from 'path';
import { exists } from '../utils/files.js';
import { MEGG_DIR_NAME, INFO_FILE_NAME } from '../utils/paths.js';
import { scanProject, formatTree, TreeNode } from '../utils/scan.js';

export interface InitResponse {
  status: 'ready' | 'already_initialized';
  tree: TreeNode[];
  treeFormatted: string;
  keyFiles: string[];
  instructions: string;
}

import { MEGG_INIT_INSTRUCTIONS } from './constants.js';

export async function initMegg(projectRoot: string): Promise<InitResponse> {
  const rootMeggDir = path.join(projectRoot, MEGG_DIR_NAME);
  const infoFilePath = path.join(rootMeggDir, INFO_FILE_NAME);

  // Check if already initialized
  const alreadyExists = await exists(infoFilePath);

  // Scan project structure
  const { tree, keyFiles } = await scanProject(projectRoot);
  const treeFormatted = formatTree(tree);

  return {
    status: alreadyExists ? 'already_initialized' : 'ready',
    tree,
    treeFormatted,
    keyFiles,
    instructions: MEGG_INIT_INSTRUCTIONS,
  };
}
