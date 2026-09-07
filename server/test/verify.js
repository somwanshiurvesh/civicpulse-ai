const http = require('http');
const app = require('../src/app');
const { generateToken } = require('../src/middleware/auth');
const { query, pool } = require('../src/config/db');

// Helper to make HTTP requests against the express app
function makeRequest(server, { method, path, headers = {}, body = null }) {
  return new Promise((resolve, reject) => {
    const port = server.address().port;
    const reqOptions = {
      hostname: '127.0.0.1',
      port,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    throw new Error(message);
  }
  console.log(`  ✓ ${message}`);
}

async function runTests() {
  console.log('====================================================');
  console.log('🚀 Running CivicPulse AI Days 2-4 Verification Suite');
  console.log('====================================================\n');

  // Start test server on random available port
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  console.log(`[Test Runner] Test server listening on port ${port}`);

  try {
    // ---------------------------------------------------------------
    // 1. Health Endpoint Test
    // ---------------------------------------------------------------
    console.log('\n[Test 1] Health Endpoint (GET /health):');
    const healthRes = await makeRequest(server, { method: 'GET', path: '/health' });
    assert(healthRes.status === 200, `Health status code is 200 (got ${healthRes.status})`);
    assert(healthRes.body.success === true, 'Health response success is true');
    assert(typeof healthRes.body.message === 'string', 'Health response has a message');
    assert(healthRes.body.data.status === 'UP', 'Health data.status is "UP"');
    assert(healthRes.body.data.database === 'CONNECTED', 'Health data.database is "CONNECTED"');
    assert(healthRes.body.data.postgis !== null, 'Health data.postgis reports active PostGIS');

    // ---------------------------------------------------------------
    // 2. Unauthenticated POST /api/issues Test
    // ---------------------------------------------------------------
    console.log('\n[Test 2] Unauthorized Issue Creation (missing token):');
    const unauthRes = await makeRequest(server, {
      method: 'POST',
      path: '/api/issues',
      body: {
        description: 'Test issue without token',
        category: 'ROAD',
        latitude: 18.5204,
        longitude: 73.8567,
      },
    });
    assert(unauthRes.status === 401, `Unauth status code is 401 (got ${unauthRes.status})`);
    assert(unauthRes.body.success === false, 'Unauth response success is false');
    assert(unauthRes.body.error_code === 'ERR_UNAUTHORIZED', 'Unauth error_code is ERR_UNAUTHORIZED');

    // ---------------------------------------------------------------
    // 3. Invalid Token POST /api/issues Test
    // ---------------------------------------------------------------
    console.log('\n[Test 3] Unauthorized Issue Creation (invalid token):');
    const invalidTokenRes = await makeRequest(server, {
      method: 'POST',
      path: '/api/issues',
      headers: { Authorization: 'Bearer invalid.token.value' },
      body: {
        description: 'Test issue with bad token',
        category: 'ROAD',
        latitude: 18.5204,
        longitude: 73.8567,
      },
    });
    assert(invalidTokenRes.status === 401, `Invalid token status code is 401 (got ${invalidTokenRes.status})`);
    assert(invalidTokenRes.body.success === false, 'Invalid token success is false');
    assert(invalidTokenRes.body.error_code === 'ERR_INVALID_TOKEN', 'error_code is ERR_INVALID_TOKEN');

    // ---------------------------------------------------------------
    // 4. Input Validation Tests
    // ---------------------------------------------------------------
    console.log('\n[Test 4] Validation Failures:');
    const validToken = generateToken({ id: 'USR-001', email: 'citizen@civicpulse.org', role: 'CITIZEN' });

    // 4a. Missing / short description
    const shortDescRes = await makeRequest(server, {
      method: 'POST',
      path: '/api/issues',
      headers: { Authorization: `Bearer ${validToken}` },
      body: {
        description: 'short',
        category: 'ROAD',
        latitude: 18.5204,
        longitude: 73.8567,
      },
    });
    assert(shortDescRes.status === 400, `Short description status is 400 (got ${shortDescRes.status})`);
    assert(shortDescRes.body.error_code === 'ERR_VALIDATION', 'error_code is ERR_VALIDATION');

    // 4b. Invalid category
    const badCatRes = await makeRequest(server, {
      method: 'POST',
      path: '/api/issues',
      headers: { Authorization: `Bearer ${validToken}` },
      body: {
        description: 'Massive crater on Main street causing damage.',
        category: 'INVALID_CATEGORY',
        latitude: 18.5204,
        longitude: 73.8567,
      },
    });
    assert(badCatRes.status === 400, `Bad category status is 400 (got ${badCatRes.status})`);
    assert(badCatRes.body.error_code === 'ERR_VALIDATION', 'error_code is ERR_VALIDATION');

    // 4c. Out of bounds coordinates
    const badCoordRes = await makeRequest(server, {
      method: 'POST',
      path: '/api/issues',
      headers: { Authorization: `Bearer ${validToken}` },
      body: {
        description: 'Massive crater on Main street causing damage.',
        category: 'ROAD',
        latitude: 195.0, // invalid latitude
        longitude: 73.8567,
      },
    });
    assert(badCoordRes.status === 400, `Bad coordinate status is 400 (got ${badCoordRes.status})`);
    assert(badCoordRes.body.error_code === 'ERR_VALIDATION', 'error_code is ERR_VALIDATION');

    // ---------------------------------------------------------------
    // 5. Successful Authenticated Issue Creation
    // ---------------------------------------------------------------
    console.log('\n[Test 5] Valid Issue Creation Flow:');
    const issuePayload = {
      description: 'Massive pothole causing major vehicle damage and slowdowns near city square.',
      category: 'ROAD',
      subcategory: 'POTHOLE',
      latitude: 18.520432,
      longitude: 73.856743,
      media_urls: [
        'https://storage.civicpulse.org/evidence/pothole1.jpg',
        'https://storage.civicpulse.org/evidence/pothole2.jpg',
      ],
    };

    const createRes = await makeRequest(server, {
      method: 'POST',
      path: '/api/issues',
      headers: { Authorization: `Bearer ${validToken}` },
      body: issuePayload,
    });

    assert(createRes.status === 201, `Issue created with status 201 (got ${createRes.status})`);
    assert(createRes.body.success === true, 'createRes.body.success is true');
    assert(typeof createRes.body.message === 'string', 'createRes.body.message is string');
    assert(createRes.body.data !== undefined, 'createRes has data object');
    assert(typeof createRes.body.data.issue_id === 'string', 'data.issue_id is string');
    assert(/^CP-\d{4}-\d{6}$/.test(createRes.body.data.issue_id), `data.issue_id matches CP-YYYY-XXXXXX format: ${createRes.body.data.issue_id}`);
    assert(createRes.body.data.status === 'SUBMITTED', 'data.status is SUBMITTED');

    const createdIssueId = createRes.body.data.issue_id;

    // ---------------------------------------------------------------
    // 6. Verify Database Persistence, PostGIS geometry, Media, & Status History
    // ---------------------------------------------------------------
    console.log('\n[Test 6] Database Integrity Verification:');
    const dbIssue = await query(
      `SELECT 
        issue_id, 
        user_id, 
        description, 
        category, 
        subcategory, 
        lat, 
        lng, 
        status, 
        ST_AsText(location) AS location_wkt,
        ST_SRID(location) AS srid
       FROM issues WHERE issue_id = $1;`,
      [createdIssueId]
    );

    assert(dbIssue.rows.length === 1, `Found created issue in issues table (${createdIssueId})`);
    const row = dbIssue.rows[0];
    assert(row.user_id === 'USR-001', 'user_id matches authenticated citizen USR-001');
    assert(row.category === 'ROAD', 'category matches ROAD');
    assert(row.subcategory === 'POTHOLE', 'subcategory matches POTHOLE');
    assert(row.status === 'SUBMITTED', 'status is SUBMITTED');
    assert(Number(row.lat).toFixed(4) === Number(18.520432).toFixed(4), 'lat is properly stored');
    assert(Number(row.lng).toFixed(4) === Number(73.856743).toFixed(4), 'lng is properly stored');
    assert(row.srid === 4326, 'PostGIS location SRID is 4326');
    assert(row.location_wkt.startsWith('POINT'), `PostGIS location is POINT geometry: ${row.location_wkt}`);

    // Verify media records
    const dbMedia = await query(
      `SELECT id, issue_id, media_url FROM issue_media WHERE issue_id = $1 ORDER BY id ASC;`,
      [createdIssueId]
    );
    assert(dbMedia.rows.length === 2, `2 media records found in issue_media (got ${dbMedia.rows.length})`);
    assert(dbMedia.rows[0].media_url === issuePayload.media_urls[0], 'First media URL matches');
    assert(dbMedia.rows[1].media_url === issuePayload.media_urls[1], 'Second media URL matches');

    // Verify status history record
    const dbHistory = await query(
      `SELECT id, issue_id, status, changed_by, comments FROM issue_status_history WHERE issue_id = $1;`,
      [createdIssueId]
    );
    assert(dbHistory.rows.length === 1, `1 audit record found in issue_status_history`);
    assert(dbHistory.rows[0].status === 'SUBMITTED', 'History status is SUBMITTED');
    assert(dbHistory.rows[0].changed_by === 'USR-001', 'History changed_by is USR-001');

    // ---------------------------------------------------------------
    // 7. Test Second Issue Creation for Sequential Unique ID Generation
    // ---------------------------------------------------------------
    console.log('\n[Test 7] Sequential Issue ID Uniqueness Test:');
    const secondRes = await makeRequest(server, {
      method: 'POST',
      path: '/api/issues',
      headers: { Authorization: `Bearer ${validToken}` },
      body: {
        description: 'Overflowing garbage bin on 5th avenue generating bad odor.',
        category: 'WASTE',
        latitude: 18.5300,
        longitude: 73.8600,
      },
    });
    assert(secondRes.status === 201, 'Second issue created with 201');
    assert(secondRes.body.data.issue_id !== createdIssueId, `Issue IDs are unique (${createdIssueId} vs ${secondRes.body.data.issue_id})`);
    assert(secondRes.body.data.status === 'SUBMITTED', 'Second issue initial status is SUBMITTED');

    // ---------------------------------------------------------------
    // 8. Test Support for lat/lng request keys
    // ---------------------------------------------------------------
    console.log('\n[Test 8] Support for lat/lng shorthand keys:');
    const thirdRes = await makeRequest(server, {
      method: 'POST',
      path: '/api/issues',
      headers: { Authorization: `Bearer ${validToken}` },
      body: {
        description: 'Water pipe leakage flooding pedestrian walkway.',
        category: 'WATER',
        lat: 18.5400,
        lng: 73.8700,
      },
    });
    assert(thirdRes.status === 201, 'Third issue created with 201 using lat/lng keys');

    console.log('\n====================================================');
    console.log('🎉 ALL TESTS PASSED SUCCESSFULLY!');
    console.log('====================================================\n');
  } finally {
    server.close();
    await pool.end();
  }
}

runTests().catch((err) => {
  console.error('\n❌ Tests failed with error:', err);
  process.exit(1);
});
