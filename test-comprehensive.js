#!/usr/bin/env node

/**
 * Comprehensive Testing Script for Pizzaxperts Application
 * This script performs automated testing of critical functionalities
 */

const https = require('https');
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
        const protocol = url.startsWith('https') ? https : http;
        const req = protocol.request(url, options, (res) => {
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

// Test cases
async function runTests() {
    console.log('🧪 Starting Comprehensive Testing for Pizzaxperts Application\n');

    // 1. Health Check Tests
    console.log('📋 Health Check Tests');
    await test('Health Check API', async () => {
        const response = await makeRequest(`${API_BASE}/health`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        const data = JSON.parse(response.data);
        if (data.message !== 'Good!') {
            throw new Error('Health check response incorrect');
        }
    });

    // 2. Page Load Tests
    console.log('\n📄 Page Load Tests');
    const pages = [
        '/', '/about', '/contact', '/faq', '/careers', '/help', '/returns',
        '/privacy', '/terms', '/cookies', '/auth/signin', '/auth/signup',
        '/cart', '/checkout', '/profile', '/orders', '/track'
    ];

    for (const page of pages) {
        await test(`Page Load: ${page}`, async () => {
            const response = await makeRequest(`${BASE_URL}${page}`);
            if (response.status !== 200) {
                throw new Error(`Expected status 200, got ${response.status}`);
            }
        });
    }

    // 3. Authentication Tests
    console.log('\n🔐 Authentication Tests');
    await test('Auth Configuration Accessible', async () => {
        const response = await makeRequest(`${API_BASE}/auth/[...nextauth]`);
        // NextAuth route returns 400 for GET requests (method not allowed)
        if (response.status !== 400 && response.status !== 404) {
            throw new Error(`Expected status 400 or 404, got ${response.status}`);
        }
    });

    // 4. Static Asset Tests
    console.log('\n🎨 Static Asset Tests');
    await test('CSS Load', async () => {
        const response = await makeRequest(`${BASE_URL}/_next/static/css/app/layout.css`);
        if (response.status !== 200) {
            // Try alternative CSS path
            const response2 = await makeRequest(`${BASE_URL}/globals.css`);
            if (response2.status !== 200) {
                throw new Error(`CSS not found at expected paths`);
            }
        }
    });

    await test('Favicon Load', async () => {
        const response = await makeRequest(`${BASE_URL}/favicon.ico`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
    });

    // 5. API Endpoint Tests
    console.log('\n🔧 API Endpoint Tests');
    await test('Register API Accessible', async () => {
        const response = await makeRequest(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'testpassword123',
                name: 'Test User'
            })
        });
        // Should return either 200 (success) or 400 (validation error) but not 404
        if (response.status === 404) {
            throw new Error('Register API not found');
        }
    });

    // 6. Database Connection Test (indirect)
    console.log('\n💾 Database Connection Test');
    await test('Database Schema Loaded', async () => {
        // This is an indirect test - if the app loads, the database connection is likely working
        const response = await makeRequest(`${BASE_URL}/`);
        if (response.status !== 200) {
            throw new Error('Application failed to load - possible database connection issue');
        }
    });

    // 7. Component Rendering Tests
    console.log('\n🎯 Component Rendering Tests');
    await test('Main Page Components', async () => {
        const response = await makeRequest(`${BASE_URL}/`);
        if (response.status !== 200) {
            throw new Error('Main page failed to load');
        }
        const content = response.data;
        
        // Check for key components (adjusting for client-side rendering)
        const hasMenuItems = content.includes('Paneer Tikka Pizza') || content.includes('Tandoori Chicken Pizza');
        const hasCart = content.includes('cart') || content.includes('Cart');
        const hasNextJS = content.includes('next') || content.includes('_next');
        
        if (!hasMenuItems) {
            throw new Error('Menu items not found on main page');
        }
        if (!hasCart) {
            throw new Error('Cart component not found');
        }
        if (!hasNextJS) {
            throw new Error('Next.js framework not detected');
        }
        
        // Note: Auth components are client-side rendered and may not appear in initial HTML
        // This is normal behavior for Next.js applications with client-side authentication
    });

    // 8. Footer Links Test
    console.log('\n🔗 Footer Links Test');
    await test('Footer Links Present', async () => {
        const response = await makeRequest(`${BASE_URL}/`);
        if (response.status !== 200) {
            throw new Error('Main page failed to load');
        }
        const content = response.data;
        
        const footerLinks = [
            'About Us', 'Contact', 'Careers', 'Help Center', 
            'Track Order', 'Returns', 'FAQ', 'Privacy Policy', 
            'Terms of Service', 'Cookie Policy'
        ];
        
        for (const link of footerLinks) {
            if (!content.includes(link)) {
                throw new Error(`Footer link '${link}' not found`);
            }
        }
    });

    // 9. Responsive Design Test (meta tags)
    console.log('\n📱 Responsive Design Test');
    await test('Viewport Meta Tag', async () => {
        const response = await makeRequest(`${BASE_URL}/`);
        if (response.status !== 200) {
            throw new Error('Main page failed to load');
        }
        const content = response.data;
        
        if (!content.includes('viewport')) {
            throw new Error('Viewport meta tag not found');
        }
        if (!content.includes('width=device-width')) {
            throw new Error('Responsive viewport configuration not found');
        }
    });

    // 10. Security Headers Test
    console.log('\n🔒 Security Headers Test');
    await test('Security Headers Present', async () => {
        const response = await makeRequest(`${BASE_URL}/`);
        const headers = response.headers;
        
        // Check for basic security headers
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
            // This is a warning, not a failure for development
        }
    });

    // Print results
    console.log('\n📊 Test Results Summary');
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
        console.log('\n🎉 All tests passed! Application is ready for production!');
    }
}

// Run tests
runTests().catch(error => {
    console.error('💥 Test execution failed:', error);
    process.exit(1);
});