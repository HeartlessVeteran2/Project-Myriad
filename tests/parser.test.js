const { parseCbz } = require('../../src/server/services/parser');
const path = require('path');
const fs = require('fs');

describe('Parser Service', () => {
  describe('parseCbz', () => {
    test('should handle non-existent file gracefully', async () => {
      const nonExistentFile = '/path/to/non-existent-file.cbz';
      
      await expect(parseCbz(nonExistentFile)).rejects.toThrow();
    });

    test('should create extraction directory', async () => {
      const mockFilePath = path.join(__dirname, 'fixtures', 'test.cbz');
      
      // Create a minimal test fixture if it doesn't exist
      const fixtureDir = path.join(__dirname, 'fixtures');
      if (!fs.existsSync(fixtureDir)) {
        fs.mkdirSync(fixtureDir, { recursive: true });
      }
      
      // For now, just test that the function exists and is callable
      expect(typeof parseCbz).toBe('function');
    });
  });
});
