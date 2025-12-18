import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'path';
import fs from 'fs/promises';
import { recall } from '../../src/tools/recall.js';

const TEST_ROOT = path.resolve(process.cwd(), 'tests', 'temp-recall');

describe('recall tool', () => {
  beforeEach(async () => {
    await fs.mkdir(TEST_ROOT, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(TEST_ROOT, { recursive: true, force: true });
  });

  it('should return message when no megg found', async () => {
    const result = await recall(TEST_ROOT, '.');
    // It should contain implicit awake content AND the not found message
    expect(result).toContain('megg — Project Memory'); 
    expect(result).toContain('No specific megg memory found in this path');
  });

  it('should gather info.md chain from root to target', async () => {
    // Setup:
    // root/.megg/info.md
    // root/api/.megg/info.md
    // root/api/auth/.megg/info.md
    await fs.mkdir(path.join(TEST_ROOT, '.megg'), { recursive: true });
    await fs.writeFile(path.join(TEST_ROOT, '.megg', 'info.md'), 'ROOT CONTEXT');
    
    await fs.mkdir(path.join(TEST_ROOT, 'api', '.megg'), { recursive: true });
    await fs.writeFile(path.join(TEST_ROOT, 'api', '.megg', 'info.md'), 'API CONTEXT');
    
    await fs.mkdir(path.join(TEST_ROOT, 'api', 'auth', '.megg'), { recursive: true });
    await fs.writeFile(path.join(TEST_ROOT, 'api', 'auth', '.megg', 'info.md'), 'AUTH CONTEXT');

    const result = await recall(TEST_ROOT, 'api/auth');
    
    expect(result).toContain('ROOT CONTEXT');
    expect(result).toContain('API CONTEXT');
    expect(result).toContain('AUTH CONTEXT');
    
    // Verify order (root first)
    const rootIdx = result.indexOf('ROOT CONTEXT');
    const apiIdx = result.indexOf('API CONTEXT');
    const authIdx = result.indexOf('AUTH CONTEXT');
    expect(rootIdx).toBeLessThan(apiIdx);
    expect(apiIdx).toBeLessThan(authIdx);
  });

  it('should include specific files when requested', async () => {
    await fs.mkdir(path.join(TEST_ROOT, '.megg'), { recursive: true });
    await fs.writeFile(path.join(TEST_ROOT, '.megg', 'info.md'), 'ROOT');
    
    await fs.mkdir(path.join(TEST_ROOT, 'api', '.megg'), { recursive: true });
    await fs.writeFile(path.join(TEST_ROOT, 'api', '.megg', 'info.md'), 'API INFO');
    await fs.writeFile(path.join(TEST_ROOT, 'api', '.megg', 'decisions.md'), 'DECISION: Use REST');
    await fs.writeFile(path.join(TEST_ROOT, 'api', '.megg', 'gotchas.md'), 'GOTCHA: Rate limits');

    const result = await recall(TEST_ROOT, 'api', ['decisions.md', 'gotchas.md']);
    
    expect(result).toContain('ROOT');
    expect(result).toContain('API INFO');
    expect(result).toContain('DECISION: Use REST');
    expect(result).toContain('GOTCHA: Rate limits');
  });

  it('should handle missing specific files gracefully', async () => {
    await fs.mkdir(path.join(TEST_ROOT, '.megg'), { recursive: true });
    await fs.writeFile(path.join(TEST_ROOT, '.megg', 'info.md'), 'ROOT');

    const result = await recall(TEST_ROOT, '.', ['nonexistent.md']);
    
    expect(result).toContain('ROOT');
    expect(result).toContain('(File not found)');
  });

  it('should work with partial .megg coverage', async () => {
    // Only root has .megg, api/auth does not
    await fs.mkdir(path.join(TEST_ROOT, '.megg'), { recursive: true });
    await fs.writeFile(path.join(TEST_ROOT, '.megg', 'info.md'), 'ROOT ONLY');
    await fs.mkdir(path.join(TEST_ROOT, 'api', 'auth'), { recursive: true });

    const result = await recall(TEST_ROOT, 'api/auth');
    
    expect(result).toContain('ROOT ONLY');
    expect(result).not.toContain('API');
  });
});
