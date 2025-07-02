const { parseCbz } = require('./src/server/services/parser');

async function testParser() {
  try {
    console.log('Testing parser...');
    
    // Test with non-existent file
    try {
      await parseCbz('/path/to/non-existent-file.cbz');
      console.log('Parser did not throw error for non-existent file - FAIL');
    } catch (error) {
      console.log('Parser threw error for non-existent file - PASS');
      console.log('Error message:', error.message);
    }
    
    console.log('Parser test completed!');
  } catch (error) {
    console.error('Parser test failed:', error.message);
  }
}

testParser();
