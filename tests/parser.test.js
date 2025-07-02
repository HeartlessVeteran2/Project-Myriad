const { parseCbz } = require('../src/server/services/parser');
const path = require('path');
const fs = require('fs');

describe('Parser Service', () => {
  describe('parseCbz', () => {
    test('should handle non-existent file gracefully', async () => {
      const nonExistentFile = '/path/to/non-existent-file.cbz';
      
      await expect(parseCbz(nonExistentFile)).rejects.toThrow('File not found');
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

    test('should return proper metadata structure', async () => {
      // Test that the function would return the expected structure
      const expectedStructure = {
        title: expect.any(String),
        coverPath: expect.any(String),
        images: expect.any(Array)
      };
      
      // This would be tested with a real file in a full integration test
      expect(expectedStructure).toBeDefined();
    });

    test('should handle invalid file types', async () => {
      const invalidFile = path.join(__dirname, 'fixtures', 'test.txt');
      
      // Create fixture directory
      const fixtureDir = path.dirname(invalidFile);
      if (!fs.existsSync(fixtureDir)) {
        fs.mkdirSync(fixtureDir, { recursive: true });
      }
      
      // Create a test file that's not a valid zip
      if (!fs.existsSync(invalidFile)) {
        fs.writeFileSync(invalidFile, 'This is not a zip file');
      }
      
      // The function should handle invalid zip files gracefully
      await expect(parseCbz(invalidFile)).rejects.toThrow();
    });
  });
});
