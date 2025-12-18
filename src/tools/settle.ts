
import path from 'path';
import fs from 'fs/promises';
import { readFile, exists } from '../utils/files.js';
import { resolvePath, MEGG_DIR_NAME, INFO_FILE_NAME } from '../utils/paths.js';

const BLOAT_THRESHOLD_CHARS = 8000; // Approx 2000 tokens
const STALE_THRESHOLD_MS = 1000 * 60 * 60 * 24 * 90; // 90 days

interface SettleCandidate {
  path: string;
  reason: string;
  action: string;
}

async function analyzeFile(root: string, filePath: string): Promise<SettleCandidate | null> {
  // Don't settle the map file
  if (path.basename(filePath) === 'map.md') return null;

  try {
    const stat = await fs.stat(filePath);
    const content = await readFile(filePath);
    const now = Date.now();

    // Check 1: Bloat
    if (content.length > BLOAT_THRESHOLD_CHARS) {
       return {
           path: path.relative(root, filePath),
           reason: `File size is ${content.length} chars (~${Math.round(content.length / 4)} tokens).`,
           action: "Consider summarizing and archiving old entries."
       };
    }

    // Check 2: Staleness (only if not info.md, which is static-ish)
    if (path.basename(filePath) !== INFO_FILE_NAME) {
         if (now - stat.mtimeMs > STALE_THRESHOLD_MS) {
            return {
                path: path.relative(root, filePath),
                reason: `File hasn't been modified in > 90 days.`,
                action: "Verify if this memory is still relevant or can be archived."
            };
         }
    }

    return null;
  } catch (e) {
      return null;
  }
}

async function scanForCandidates(dir: string, projectRoot: string): Promise<SettleCandidate[]> {
    const candidates: SettleCandidate[] = [];
    try {
        const list = await fs.readdir(dir);
        
        // If we are IN a .megg dir, scan files
        if (path.basename(dir) === MEGG_DIR_NAME) {
            for (const file of list) {
                const filePath = path.join(dir, file);
                const candidate = await analyzeFile(projectRoot, filePath);
                if (candidate) candidates.push(candidate);
            }
            return candidates; // Don't traverse deeper
        }
    
        // Otherwise traverse subdirs
        for (const file of list) {
          if (file === 'node_modules' || file === '.git') continue;
          
          const filePath = path.join(dir, file);
          try {
            const stat = await fs.stat(filePath);
            if (stat.isDirectory()) {
              candidates.push(...await scanForCandidates(filePath, projectRoot));
            }
          } catch (e) {
            // Ignore
          }
        }
      } catch (err) {
        // Ignore
      }
      return candidates;
}

export async function settle(projectRoot: string, targetPath?: string): Promise<string> {
    const candidates: SettleCandidate[] = [];

    if (targetPath) {
        const absPath = resolvePath(projectRoot, targetPath);
        if (await exists(absPath)) {
            const stat = await fs.stat(absPath);
            if (stat.isDirectory()) {
                // If it's a directory, check if it IS .megg or HAS .megg
                if (path.basename(absPath) === MEGG_DIR_NAME) {
                     // Check files in this .megg
                     const list = await fs.readdir(absPath);
                     for (const file of list) {
                        const candidate = await analyzeFile(projectRoot, path.join(absPath, file));
                        if (candidate) candidates.push(candidate);
                     }
                } else {
                    // Check if there is a child .megg
                     const meggPath = path.join(absPath, MEGG_DIR_NAME);
                     if (await exists(meggPath)) {
                         const list = await fs.readdir(meggPath);
                         for (const file of list) {
                            const candidate = await analyzeFile(projectRoot, path.join(meggPath, file));
                            if (candidate) candidates.push(candidate);
                         }
                     }
                }
            } else {
                // It's a file
                const candidate = await analyzeFile(projectRoot, absPath);
                if (candidate) candidates.push(candidate);
            }
        } else {
            return `Path not found: ${targetPath}`;
        }
    } else {
        // Global scan
        candidates.push(...await scanForCandidates(projectRoot, projectRoot));
    }

    if (candidates.length === 0) {
        return "Memory is healthy. No maintenance required.";
    }

    let report = "# Settle Proposals\n\nThe following files may need attention:\n\n";
    for (const c of candidates) {
        report += `- **${c.path}**\n  - Reason: ${c.reason}\n  - Proposal: ${c.action}\n\n`;
    }
    
    report += "To apply changes, use `read()` to view the file and `remember()` (with overwrite) or `write()` to update it.";

    return report;
}
