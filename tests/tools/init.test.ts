import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'path';
import fs from 'fs/promises';
import { initMegg } from '../../src/tools/init.js';
import { exists, readFile } from '../../src/utils/files.js';

const TEST_ROOT = path.resolve(process.cwd(), 'tests', 'temp-init');

describe('init tool', () => {
  beforeEach(async () => {
    await fs.mkdir(TEST_ROOT, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(TEST_ROOT, { recursive: true, force: true });
  });

  it('should return ready status and instructions', async () => {
    const result = await initMegg(TEST_ROOT);
    
    expect(result.status).toBe('ready');
    expect(result.instructions).toContain('megg initialization');
    expect(result.treeFormatted).toBeDefined();
  });

  it('should return already_initialized status if exists', async () => {
    await fs.mkdir(path.join(TEST_ROOT, '.megg'), { recursive: true });
    await fs.writeFile(path.join(TEST_ROOT, '.megg', 'info.md'), 'existing content');
    
    const result = await initMegg(TEST_ROOT);
    
    expect(result.status).toBe('already_initialized');
  });
});
