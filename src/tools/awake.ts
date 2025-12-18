
import path from 'path';
import { MEGG_DIR_NAME, INFO_FILE_NAME } from '../utils/paths.js';
import { readFile, exists } from '../utils/files.js';
import { mapMegg, MAP_FILE_NAME } from './map.js';
import { sessionState } from '../state.js';

export async function awake(projectRoot: string): Promise<string> {
    sessionState.hasAwoken = true;

    const rootMegg = path.join(projectRoot, MEGG_DIR_NAME);
    const infoPath = path.join(rootMegg, INFO_FILE_NAME);
    
    // 1. Get Identity (root info.md)
    let identity = "";
    if (await exists(infoPath)) {
        identity = await readFile(infoPath);
    } else {
        identity = "(No root info.md found. Project may not be initialized.)";
    }

    // 2. Get Memory Map
    // We try to read existing map.md, or generate it if missing.
    // Ideally, we regenerate it to be fresh.
    let memoryMap = await mapMegg(projectRoot);
    
    // If mapMegg returns the markdown content directly, we can use it.
    // mapMegg implementation returns the content string.

    return `# megg — Project Memory

## Identity
${identity}

${memoryMap}

## Using megg
- recall(path) when working somewhere unfamiliar
- remember() decisions that would be painful to forget  
- if unsure about context, recall more
`;
}
