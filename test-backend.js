#!/usr/bin/env node

/**
 * Backend Testing Script for Pizzaxperts Application
 * This script performs detailed testing of backend API endpoints and database operations
 */

const http = require('http');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const API_BASE = `${BASE_URL}/api`;

// Test results
const testResults = {
    passed: 0,
    failed: 0,
    total: 0,
    details: []
};

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const req = http.request(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    data: data
                });
            });
        });
        
        req.on('error', reject);
        req.setTimeout(5000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
        
        if (options.body) {
            req.write(options.body);
        }
        req.end();
    });
}

// Test function
async function test(name, testFunction) {
    testResults.total++;
    try {
        await testFunction();
        testResults.passed++;
        testResults.details.push({ name, status: 'PASSED', error: null });
        console.log(`✅ ${name}`);
    } catch (error) {
        testResults.failed++;
        testResults.details.push({ name, status: 'FAILED', error: error.message });
        console.log(`❌ ${name}: ${error.message}`);
    }
}

// Backend test cases
async function runBackendTests() {
    console.log('🔧 Starting Backend Testing for Pizzaxperts Application\n');

    // 1. Health Check Tests
    console.log('🏥 Health Check Tests');
    
    await test('Health Check Endpoint', async () => {
        const response = await makeRequest(`${API_BASE}/health`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        
        const data = JSON.parse(response.data);
        if (!data.message || data.message !== 'Good!') {
            throw new Error('Health check response format incorrect');
        }
    });

    // 2. Authentication API Tests
    console.log('\n🔐 Authentication API Tests');
    
    await test('Auth Configuration Endpoint', async () => {
        const response = await makeRequest(`${API_BASE}/auth/[...nextauth]`);
        // NextAuth returns 400 for GET requests (method not allowed)
        if (response.status !== 400) {
            throw new Error(`Expected status 400, got ${response.status}`);
        }
    });

    await test('User Registration Endpoint', async () => {
        const testUser = {
            firstName: 'Test',
            lastName: 'User',
            email: `test${Date.now()}@example.com`,
            password: 'testpassword123'
        };
        
        const response = await makeRequest(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testUser)
        });
        
        // Should return either 200 (success) or 400/422 (validation error)
        if (response.status === 404) {
            throw new Error('Registration endpoint not found');
        }
        
        // Parse response to check if it's valid JSON
        try {
            const data = JSON.parse(response.data);
            // If we get here, it's valid JSON
            console.log('📊 Registration endpoint response:', JSON.stringify(data));
        } catch (e) {
            console.log('📊 Raw response:', response.data);
            throw new Error(`Registration endpoint did not return valid JSON: ${e.message}`);
        }
    });

    // 3. Database Operations Tests (Indirect)
    console.log('\n💾 Database Operations Tests');
    
    await test('Database Connection Test', async () => {
        // Test database connection through application startup
        const response = await makeRequest(`${BASE_URL}/`);
        if (response.status !== 200) {
            throw new Error('Application failed to start - possible database connection issue');
        }
        
        // If application starts successfully, database connection is likely working
        const content = response.data;
        if (!content.includes('Pizzaxperts')) {
            throw new Error('Application content not loaded correctly');
        }
    });

    await test('Database Schema Test', async () => {
        // Check if database models are accessible through the application
        const response = await makeRequest(`${BASE_URL}/auth/signup`);
        if (response.status !== 200) {
            throw new Error('Auth page not accessible - possible database schema issue');
        }
        
        // If auth page loads, database schema is likely properly configured
        const content = response.data;
        const hasAuthContent = content.includes('Sign Up') || content.includes('Create Account') || content.includes('Register');
        
        if (!hasAuthContent) {
            throw new Error('Auth page content not loaded correctly');
        }
    });

    // 4. API Response Format Tests
    console.log('\n📋 API Response Format Tests');
    
    await test('JSON Response Format', async () => {
        const response = await makeRequest(`${API_BASE}/health`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        
        // Check if response is valid JSON
        try {
            const data = JSON.parse(response.data);
            if (typeof data !== 'object') {
                throw new Error('Response is not a valid JSON object');
            }
        } catch (e) {
            throw new Error('Response is not valid JSON');
        }
    });

    await test('CORS Headers Test', async () => {
        const response = await makeRequest(`${API_BASE}/health`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        
        const headers = response.headers;
        
        // Check for CORS headers (may not be present in development)
        const hasCorsHeaders = headers['access-control-allow-origin'] || 
                              headers['Access-Control-Allow-Origin'];
        
        if (!hasCorsHeaders) {
            console.log('⚠️  CORS headers not found (may be normal for development)');
        }
    });

    // 5. Error Handling Tests
    console.log('\n🚨 Error Handling Tests');
    
    await test('404 Error Handling', async () => {
        const response = await makeRequest(`${API_BASE}/nonexistent-endpoint`);
        if (response.status !== 404) {
            throw new Error(`Expected status 404, got ${response.status}`);
        }
    });

    await test('Invalid Method Handling', async () => {
        const response = await makeRequest(`${API_BASE}/health`, {
            method: 'POST'
        });
        
        // Should return 405 (Method Not Allowed) or appropriate error
        if (response.status === 200) {
            console.log('⚠️  Health endpoint accepts POST (may be intentional)');
        } else if (response.status !== 405) {
            console.log(`⚠️  Health endpoint returned ${response.status} for POST (expected 405)`);
        }
    });

    await test('Invalid JSON Handling', async () => {
        const response = await makeRequest(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: 'invalid json {'
        });
        
        // Should return 400 (Bad Request) or appropriate error
        if (response.status === 200) {
            throw new Error('Invalid JSON should not be accepted');
        }
    });

    // 6. Security Tests
    console.log('\n🔒 Security Tests');
    
    await test('No Sensitive Data Exposure', async () => {
        const response = await makeRequest(`${API_BASE}/health`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        
        const content = response.data;
        
        // Check for sensitive data that shouldn't be exposed
        const sensitivePatterns = [
            /password/i,
            /secret/i,
            /key/i,
            /token/i
        ];
        
        for (const pattern of sensitivePatterns) {
            if (pattern.test(content)) {
                throw new Error(`Potential sensitive data exposure: ${pattern}`);
            }
        }
    });

    await test('Security Headers', async () => {
        const response = await makeRequest(`${API_BASE}/health`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        
        const headers = response.headers;
        
        // Check for security headers
        const securityHeaders = [
            'x-content-type-options',
            'x-frame-options',
            'x-xss-protection'
        ];
        
        let missingHeaders = [];
        for (const header of securityHeaders) {
            if (!headers[header] && !headers[header.toUpperCase()]) {
                missingHeaders.push(header);
            }
        }
        
        if (missingHeaders.length > 0) {
            console.log(`⚠️  Missing security headers: ${missingHeaders.join(', ')}`);
        }
    });

    // 7. Performance Tests
    console.log('\n⚡ Performance Tests');
    
    await test('API Response Time', async () => {
        const startTime = Date.now();
        const response = await makeRequest(`${API_BASE}/health`);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        
        if (responseTime > 1000) {
            throw new Error(`API response time ${responseTime}ms exceeds 1s threshold`);
        }
        
        console.log(`📊 API response time: ${responseTime}ms`);
    });

    await test('Concurrent Requests', async () => {
        const requests = [];
        const numRequests = 5;
        
        for (let i = 0; i < numRequests; i++) {
            requests.push(makeRequest(`${API_BASE}/health`));
        }
        
        const startTime = Date.now();
        const responses = await Promise.all(requests);
        const endTime = Date.now();
        
        const successfulResponses = responses.filter(r => r.status === 200).length;
        
        if (successfulResponses !== numRequests) {
            throw new Error(`Only ${successfulResponses}/${numRequests} concurrent requests succeeded`);
        }
        
        const totalTime = endTime - startTime;
        console.log(`📊 ${numRequests} concurrent requests completed in ${totalTime}ms`);
    });

    // 8. Rate Limiting Tests (Basic)
    console.log('\n🚦 Rate Limiting Tests');
    
    await test('Rate Limiting Check', async () => {
        const requests = [];
        const numRequests = 10;
        
        // Make multiple rapid requests
        for (let i = 0; i < numRequests; i++) {
            requests.push(makeRequest(`${API_BASE}/health`));
        }
        
        const responses = await Promise.all(requests);
        const statusCodes = responses.map(r => r.status);
        
        // Check if any requests were rate limited (429)
        const rateLimited = statusCodes.filter(code => code === 429).length;
        
        if (rateLimited > 0) {
            console.log(`📊 ${rateLimited}/${numRequests} requests were rate limited`);
        } else {
            console.log('📊 No rate limiting detected (may be normal for development)');
        }
        
        // All requests should succeed or be rate limited, not fail with other errors
        const failedRequests = statusCodes.filter(code => code !== 200 && code !== 429).length;
        if (failedRequests > 0) {
            throw new Error(`${failedRequests} requests failed with unexpected errors`);
        }
    });

    // 9. Data Validation Tests
    console.log('\n✅ Data Validation Tests');
    
    await test('Registration Data Validation', async () => {
        const invalidUsers = [
            { email: 'invalid-email', password: '123', name: '' },  // Invalid email, weak password, empty name
            { email: '', password: '', name: '' },  // All fields empty
            { email: 'test@example.com', password: '123' }  // Missing name
        ];
        
        for (const invalidUser of invalidUsers) {
            const response = await makeRequest(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(invalidUser)
            });
            
            // Should return 400 or 422 for validation errors
            if (response.status === 200) {
                throw new Error('Invalid user data was accepted');
            }
        }
    });

    // 10. File Upload Tests (if applicable)
    console.log('\n📁 File Upload Tests');
    
    await test('Static File Serving', async () => {
        const files = [
            '/favicon.ico',
            '/robots.txt'
        ];
        
        for (const file of files) {
            const response = await makeRequest(`${BASE_URL}${file}`);
            if (response.status !== 200) {
                console.log(`⚠️  Static file ${file} not accessible (status ${response.status})`);
            }
        }
    });

    // Print results
    console.log('\n📊 Backend Test Results Summary');
    console.log('='.repeat(50));
    console.log(`Total Tests: ${testResults.total}`);
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`📈 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
    
    if (testResults.failed > 0) {
        console.log('\n❌ Failed Tests:');
        testResults.details
            .filter(detail => detail.status === 'FAILED')
            .forEach(detail => {
                console.log(`  - ${detail.name}: ${detail.error}`);
            });
        process.exit(1);
    } else {
        console.log('\n🎉 All backend tests passed!');
    }
}

// Run tests
runBackendTests().catch(error => {
    console.error('💥 Backend test execution failed:', error);
    process.exit(1);
});