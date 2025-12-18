import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'path';
import fs from 'fs/promises';
import { remember } from '../../src/tools/remember.js';
import { readFile, exists } from '../../src/utils/files.js';

const TEST_ROOT = path.resolve(process.cwd(), 'tests', 'temp-remember');

describe('remember tool', () => {
  beforeEach(async () => {
    await fs.mkdir(TEST_ROOT, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(TEST_ROOT, { recursive: true, force: true });
  });

  it('should create new file with frontmatter when isNew=true', async () => {
    const filePath = '.megg/decisions.md';
    const result = await remember(TEST_ROOT, filePath, 'First decision', true);
    
    expect(result).toContain('Created new memory');
    
    const content = await readFile(path.join(TEST_ROOT, filePath));
    expect(content).toContain('---');
    expect(content).toContain('created:');
    expect(content).toContain('First decision');
  });

  it('should create new file when file does not exist (isNew=false)', async () => {
    const filePath = '.megg/new-file.md';
    const result = await remember(TEST_ROOT, filePath, 'Auto-created');
    
    expect(result).toContain('Created new memory');
    expect(await exists(path.join(TEST_ROOT, filePath))).toBe(true);
  });

  it('should append to existing file', async () => {
    const filePath = '.megg/log.md';
    const fullPath = path.join(TEST_ROOT, filePath);
    
    // Create initial file
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, '---\ncreated: 2024-01-01\nupdated: 2024-01-01\n---\n\nInitial content');
    
    const result = await remember(TEST_ROOT, filePath, 'Appended entry');
    
    expect(result).toContain('Appended to memory');
    
    const content = await readFile(fullPath);
    expect(content).toContain('Initial content');
    expect(content).toContain('Appended entry');
    expect(content).toMatch(/## \d{4}-\d{2}-\d{2}/); // Timestamp header
  });

  it('should update frontmatter updated field on append', async () => {
    const filePath = '.megg/tracked.md';
    const fullPath = path.join(TEST_ROOT, filePath);
    
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, '---\ncreated: 2024-01-01T00:00:00Z\nupdated: 2024-01-01T00:00:00Z\n---\n\nOld');
    
    await remember(TEST_ROOT, filePath, 'New stuff');
    
    const content = await readFile(fullPath);
    // Should have a newer updated timestamp (not 2024-01-01)
    expect(content).not.toMatch(/updated: 2024-01-01T00:00:00Z/);
  });

  it('should reject paths outside .megg directory', async () => {
    await expect(
      remember(TEST_ROOT, 'src/index.ts', 'bad content')
    ).rejects.toThrow('must be stored inside');
  });

  it('should handle nested .megg directories', async () => {
    const filePath = 'api/auth/.megg/notes.md';
    const result = await remember(TEST_ROOT, filePath, 'Auth note', true);
    
    expect(result).toContain('Created new memory');
    expect(await exists(path.join(TEST_ROOT, filePath))).toBe(true);
  });
});
