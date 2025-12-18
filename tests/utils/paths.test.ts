
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'path';
import fs from 'fs/promises';
import { findMeggDirs, resolvePath, MEGG_DIR_NAME } from '../../src/utils/paths.js';

const TEST_ROOT = path.resolve(process.cwd(), 'tests', 'temp-paths');

describe('Paths Utils', () => {
  beforeEach(async () => {
    await fs.mkdir(TEST_ROOT, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(TEST_ROOT, { recursive: true, force: true });
  });

  it('should find nested .megg directories', async () => {
    // Setup structure:
    // root/.megg
    // root/api/.megg
    // root/api/auth
    
    await fs.mkdir(path.join(TEST_ROOT, MEGG_DIR_NAME));
    await fs.mkdir(path.join(TEST_ROOT, 'api', MEGG_DIR_NAME), { recursive: true });
    await fs.mkdir(path.join(TEST_ROOT, 'api', 'auth'), { recursive: true });

    const meggs = await findMeggDirs(TEST_ROOT, 'api/auth/handler.ts');
    
    expect(meggs).toHaveLength(2);
    expect(meggs[0]).toBe(path.join(TEST_ROOT, MEGG_DIR_NAME));
    expect(meggs[1]).toBe(path.join(TEST_ROOT, 'api', MEGG_DIR_NAME));
  });

  it('should handle missing .megg dirs gracefully', async () => {
    // Setup structure:
    // root/ (no .megg)
    // root/api/ (no .megg)
    await fs.mkdir(path.join(TEST_ROOT, 'api'), { recursive: true });

    const meggs = await findMeggDirs(TEST_ROOT, 'api');
    expect(meggs).toHaveLength(0);
  });
});
