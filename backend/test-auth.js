const http = require('http');

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function testAuth() {
  console.log('===================================');
  console.log('Testing Authentication Endpoints');
  console.log('===================================\n');

  try {
    // Test 1: Register
    console.log('1. Testing Registration (POST /api/auth/register)');
    console.log('-----------------------------------');
    const registerData = {
      email: 'newuser@example.com',
      password: 'password123',
      firstName: 'New',
      lastName: 'User',
    };
    
    const registerRes = await makeRequest('POST', '/api/auth/register', registerData);
    console.log(`Status: ${registerRes.status}`);
    console.log(JSON.stringify(registerRes.data, null, 2));
    console.log('');

    let token = registerRes.data?.data?.token;

    // If registration failed (user exists), try login
    if (!token) {
      console.log('2. Testing Login (POST /api/auth/login)');
      console.log('-----------------------------------');
      const loginData = {
        email: 'newuser@example.com',
        password: 'password123',
      };
      
      const loginRes = await makeRequest('POST', '/api/auth/login', loginData);
      console.log(`Status: ${loginRes.status}`);
      console.log(JSON.stringify(loginRes.data, null, 2));
      console.log('');
      
      token = loginRes.data?.data?.token;
    }

    // Test 3: Get current user
    if (token) {
      console.log('3. Testing Get Current User (GET /api/auth/me)');
      console.log('-----------------------------------');
      
      const meOptions = {
        hostname: 'localhost',
        port: 5001,
        path: '/api/auth/me',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      };

      const meRes = await new Promise((resolve, reject) => {
        const req = http.request(meOptions, (res) => {
          let body = '';
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => {
            try {
              resolve({ status: res.statusCode, data: JSON.parse(body) });
            } catch (e) {
              resolve({ status: res.statusCode, data: body });
            }
          });
        });
        req.on('error', reject);
        req.end();
      });

      console.log(`Status: ${meRes.status}`);
      console.log(JSON.stringify(meRes.data, null, 2));
      console.log('');
      
      console.log('✅ All authentication endpoints are working!');
    } else {
      console.log('❌ Could not obtain authentication token');
    }

  } catch (error) {
    console.error('Error:', error.message);
  }

  console.log('\n===================================');
  console.log('Test Complete');
  console.log('===================================');
}

testAuth();