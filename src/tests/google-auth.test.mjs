import assert from 'assert';

const BASE_URL = 'http://localhost:3000';

async function runGoogleAuthTest() {
  console.log('Running Google-only authentication test...');

  try {
    // Test 1: Accessing dashboard while logged out
    console.log('Test 1: Attempting to access /dashboard while logged out...');
    const response = await fetch(`${BASE_URL}/dashboard`, {
      redirect: 'manual', // Prevent fetch from following the redirect
    });

    // We expect to be redirected to the login page
    assert.strictEqual(response.status, 307, `Expected a 307 redirect, but got ${response.status}`);
    const location = response.headers.get('location');
    assert.ok(location?.includes('/login'), `Expected redirect to /login, but got ${location}`);
    console.log('✅ Redirect test passed.');

    console.log('\nGoogle authentication flow test passed successfully! 🎉');

  } catch (error) {
    console.error('🚨 Google authentication test failed:', error.message);
    process.exit(1);
  }
}

runGoogleAuthTest();