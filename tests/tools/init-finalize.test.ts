import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'path';
import fs from 'fs/promises';
import { initFinalize, FileToCreate } from '../../src/tools/init-finalize.js';
import { exists, readFile } from '../../src/utils/files.js';

const TEST_ROOT = path.resolve(process.cwd(), 'tests', 'temp-init-finalize');

describe('init_finalize tool', () => {
  beforeEach(async () => {
    await fs.mkdir(TEST_ROOT, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(TEST_ROOT, { recursive: true, force: true });
  });

  it('should create requested files including root info.md', async () => {
    const files: FileToCreate[] = [
      {
        path: '.megg/info.md',
        content: '# Root Context',
        type: 'context'
      },
      {
        path: 'src/.megg/decisions.md',
        content: '# API Decisions',
        type: 'decisions'
      }
    ];

    const result = await initFinalize(TEST_ROOT, { files });

    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.created).toHaveLength(2);

    expect(await exists(path.join(TEST_ROOT, '.megg', 'info.md'))).toBe(true);
    expect(await exists(path.join(TEST_ROOT, 'src', '.megg', 'decisions.md'))).toBe(true);
  });

  it('should fail if root .megg/info.md is missing', async () => {
    const files: FileToCreate[] = [
      {
        path: 'src/.megg/info.md',
        content: 'Some content',
        type: 'context'
      }
    ];

    const result = await initFinalize(TEST_ROOT, { files });

    expect(result.success).toBe(false);
    expect(result.errors[0]).toContain('Root .megg/info.md is required');
  });

  it('should validate paths are inside .megg directories', async () => {
    const files: FileToCreate[] = [
      {
        path: '.megg/info.md',
        content: 'Root',
        type: 'context'
      },
      {
        path: 'src/bad-location/info.md',
        content: 'Bad',
        type: 'context'
      }
    ];

    const result = await initFinalize(TEST_ROOT, { files });

    expect(result.success).toBe(false);
    expect(result.errors.some(e => e.includes('must be inside a .megg/ directory'))).toBe(true);
  });

  it('should prevent path traversal', async () => {
    const files: FileToCreate[] = [
      {
        path: '.megg/info.md',
        content: 'Root',
        type: 'context'
      },
      {
        path: '.megg/../../evil.md',
        content: 'Evil',
        type: 'context'
      }
    ];

    const result = await initFinalize(TEST_ROOT, { files });

    expect(result.success).toBe(false);
    expect(result.errors.some(e => e.includes('path traversal not allowed'))).toBe(true);
  });
});
