import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'path';
import fs from 'fs/promises';
import { ensureDir, exists, readFile, writeFile, listFiles, getTimestamp } from '../../src/utils/files.js';

const TEST_ROOT = path.resolve(process.cwd(), 'tests', 'temp-files');

describe('Files Utils', () => {
  beforeEach(async () => {
    await fs.mkdir(TEST_ROOT, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(TEST_ROOT, { recursive: true, force: true });
  });

  describe('ensureDir', () => {
    it('should create nested directories', async () => {
      const deepPath = path.join(TEST_ROOT, 'a', 'b', 'c');
      await ensureDir(deepPath);
      expect(await exists(deepPath)).toBe(true);
    });

    it('should not fail if directory exists', async () => {
      await ensureDir(TEST_ROOT);
      expect(await exists(TEST_ROOT)).toBe(true);
    });
  });

  describe('exists', () => {
    it('should return true for existing file', async () => {
      const filePath = path.join(TEST_ROOT, 'test.txt');
      await fs.writeFile(filePath, 'hello');
      expect(await exists(filePath)).toBe(true);
    });

    it('should return false for non-existing file', async () => {
      expect(await exists(path.join(TEST_ROOT, 'nope.txt'))).toBe(false);
    });
  });

  describe('readFile / writeFile', () => {
    it('should write and read file content', async () => {
      const filePath = path.join(TEST_ROOT, 'data.txt');
      await writeFile(filePath, 'test content');
      const content = await readFile(filePath);
      expect(content).toBe('test content');
    });

    it('should create parent directories when writing', async () => {
      const filePath = path.join(TEST_ROOT, 'deep', 'nested', 'file.txt');
      await writeFile(filePath, 'nested content');
      expect(await exists(filePath)).toBe(true);
    });
  });

  describe('listFiles', () => {
    it('should list files in directory', async () => {
      await fs.writeFile(path.join(TEST_ROOT, 'a.txt'), '');
      await fs.writeFile(path.join(TEST_ROOT, 'b.txt'), '');
      const files = await listFiles(TEST_ROOT);
      expect(files).toContain('a.txt');
      expect(files).toContain('b.txt');
    });

    it('should return empty array for non-existing directory', async () => {
      const files = await listFiles(path.join(TEST_ROOT, 'nope'));
      expect(files).toEqual([]);
    });
  });

  describe('getTimestamp', () => {
    it('should return ISO 8601 format', () => {
      const ts = getTimestamp();
      expect(ts).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });
});
