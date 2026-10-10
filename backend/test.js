/**
 * Beginner-Friendly API Verification Script
 * Run with: node backend/test.js
 */

const http = require('http');

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:5000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('🧪 Starting TravelWise API Verification...\n');

  try {
    // 1. Test /api/health
    const health = await get('/api/health');
    if (health.status === 200 && health.body.status === 'ok') {
      console.log('✅ GET /api/health — PASSED (Status 200 OK)');
      console.log(`   Message: "${health.body.message}"\n`);
    } else {
      console.error('❌ GET /api/health — FAILED', health);
    }

    // 2. Test /api/app-config
    const config = await get('/api/app-config');
    if (
      config.status === 200 &&
      config.body.appName === 'TravelWise' &&
      config.body.tagline === 'Plan · Book · Explore'
    ) {
      console.log('✅ GET /api/app-config — PASSED (Status 200 OK)');
      console.log(`   App Name: ${config.body.appName}`);
      console.log(`   Tagline: ${config.body.tagline}`);
      console.log(`   Heading: ${config.body.heading}`);
      console.log(`   Description: ${config.body.description}\n`);
    } else {
      console.error('❌ GET /api/app-config — FAILED', config);
    }

    // 3. Test 404 handler
    const notFound = await get('/api/unknown-endpoint');
    if (notFound.status === 404 && notFound.body.error === 'Route not found') {
      console.log('✅ 404 Not Found Handler — PASSED (Returned JSON 404)\n');
    } else {
      console.error('❌ 404 Handler — FAILED', notFound);
    }

    console.log('🎉 All API verification checks completed successfully!');
  } catch (err) {
    console.error('❌ Error during test execution:', err.message);
    console.log('👉 Make sure the backend server is running on http://localhost:5000 first.');
    process.exit(1);
  }
}

runTests();
