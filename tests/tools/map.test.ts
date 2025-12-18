import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'path';
import fs from 'fs/promises';
import { mapMegg } from '../../src/tools/map.js';

const TEST_ROOT = path.resolve(process.cwd(), 'tests', 'temp-map');

describe('map tool', () => {
    beforeEach(async () => {
        await fs.mkdir(TEST_ROOT, { recursive: true });
    });

    afterEach(async () => {
        await fs.rm(TEST_ROOT, { recursive: true, force: true });
    });

    it('should generate a map of .megg directories', async () => {
        // Create structure
        // .megg/
        // src/.megg/
        // src/api/.megg/
        // docs/.megg/
        
        await fs.mkdir(path.join(TEST_ROOT, '.megg'), { recursive: true });
        await fs.mkdir(path.join(TEST_ROOT, 'src', '.megg'), { recursive: true });
        await fs.mkdir(path.join(TEST_ROOT, 'src', 'api', '.megg'), { recursive: true });
        await fs.mkdir(path.join(TEST_ROOT, 'docs', '.megg'), { recursive: true });

        const result = await mapMegg(TEST_ROOT);

        // Check content
        expect(result).toContain('# Memory Map');
        expect(result).toContain('## Structure');
        
        // Exact formatting checks
        // We expect sorted order
        // - `.megg/`
        // - `docs/.megg/`
        // - `src/.megg/`
        //   - `src/api/.megg/`
        
        // Note: my simple implementation in map.ts puts indentation based on depth.
        // let's verifying the presence and roughly the indentation
        expect(result).toMatch(/- `.megg\/`/);
        expect(result).toMatch(/- `docs\/.megg\/`/);
        expect(result).toMatch(/- `src\/.megg\/`/);
        // src/api should be indented
        expect(result).toMatch(/  - `src\/api\/.megg\/`/);
    });

    it('should return message if no .megg found', async () => {
        const result = await mapMegg(TEST_ROOT);
        expect(result).toBe('No .megg found.');
    });
});
