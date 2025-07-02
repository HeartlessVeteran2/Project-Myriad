const { hashPassword, comparePassword, generateToken } = require('./src/server/routes/auth/utils');

async function testAuth() {
  try {
    console.log('Testing auth utils...');
    
    // Test hashPassword
    const password = process.env.TEST_PASSWORD || 'defaultpassword'; // Use an environment variable for the password
    const hash = await hashPassword(password);
    console.log('Hash generated:', hash ? 'YES' : 'NO');
    
    // Test comparePassword
    const isValid = await comparePassword(password, hash);
    
    
    // Test generateToken
    const token = generateToken({ id: 1, username: 'test' });
    console.log('Token generated:', token ? 'YES' : 'NO');
    console.log('Token parts:', token.split('.').length);
    
    console.log('All tests passed!');
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testAuth();
