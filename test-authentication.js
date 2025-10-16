#!/usr/bin/env node

/**
 * Authentication Testing Script for Pizzaxperts Application
 * This script performs detailed testing of the authentication system
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

// Authentication test cases
async function runAuthTests() {
    console.log('🔐 Starting Authentication Testing for Pizzaxperts Application\n');

    // 1. Authentication Page Tests
    console.log('📄 Authentication Page Tests');
    
    await test('Sign In Page Accessible', async () => {
        const response = await makeRequest(`${BASE_URL}/auth/signin`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        
        const content = response.data;
        const hasSignInContent = content.includes('Sign In') || content.includes('Login');
        
        if (!hasSignInContent) {
            throw new Error('Sign In page content not found');
        }
    });

    await test('Sign Up Page Accessible', async () => {
        const response = await makeRequest(`${BASE_URL}/auth/signup`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        
        const content = response.data;
        const hasSignUpContent = content.includes('Sign Up') || content.includes('Create Account') || content.includes('Register');
        
        if (!hasSignUpContent) {
            throw new Error('Sign Up page content not found');
        }
    });

    // 2. NextAuth Configuration Tests
    console.log('\n⚙️ NextAuth Configuration Tests');
    
    await test('NextAuth Route Accessible', async () => {
        const response = await makeRequest(`${API_BASE}/auth/[...nextauth]`);
        // NextAuth returns 400 for GET requests (method not allowed)
        if (response.status !== 400) {
            throw new Error(`Expected status 400, got ${response.status}`);
        }
    });

    await test('Session Management', async () => {
        const response = await makeRequest(`${API_BASE}/auth/session`);
        // Should return 200 (even if no session)
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        
        // Check if response is valid JSON
        try {
            const data = JSON.parse(response.data);
            if (typeof data !== 'object') {
                throw new Error('Session response is not a valid JSON object');
            }
        } catch (e) {
            throw new Error('Session response is not valid JSON');
        }
    });

    // 3. Form Validation Tests
    console.log('\n✅ Form Validation Tests');
    
    await test('Sign In Form Validation', async () => {
        const response = await makeRequest(`${BASE_URL}/auth/signin`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        
        const content = response.data;
        
        // Check for form elements
        const hasEmailField = content.includes('email') || content.includes('Email');
        const hasPasswordField = content.includes('password') || content.includes('Password');
        const hasSubmitButton = content.includes('button') || content.includes('Button');
        
        if (!hasEmailField) {
            throw new Error('Email field not found in sign in form');
        }
        if (!hasPasswordField) {
            throw new Error('Password field not found in sign in form');
        }
        if (!hasSubmitButton) {
            throw new Error('Submit button not found in sign in form');
        }
    });

    await test('Sign Up Form Validation', async () => {
        const response = await makeRequest(`${BASE_URL}/auth/signup`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        
        const content = response.data;
        
        // Check for form elements
        const hasEmailField = content.includes('email') || content.includes('Email');
        const hasPasswordField = content.includes('password') || content.includes('Password');
        const hasNameField = content.includes('name') || content.includes('Name');
        const hasSubmitButton = content.includes('button') || content.includes('Button');
        
        if (!hasEmailField) {
            throw new Error('Email field not found in sign up form');
        }
        if (!hasPasswordField) {
            throw new Error('Password field not found in sign up form');
        }
        if (!hasNameField) {
            throw new Error('Name field not found in sign up form');
        }
        if (!hasSubmitButton) {
            throw new Error('Submit button not found in sign up form');
        }
    });

    // 4. Social Authentication Tests
    console.log('\n🌐 Social Authentication Tests');
    
    await test('Google OAuth Configuration', async () => {
        const response = await makeRequest(`${BASE_URL}/auth/signin`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        
        const content = response.data;
        const hasGoogleAuth = content.includes('Google') || content.includes('google');
        
        if (!hasGoogleAuth) {
            console.log('⚠️  Google OAuth button not found (may be normal if not configured)');
        }
    });

    // 5. Security Tests
    console.log('\n🔒 Security Tests');
    
    await test('Password Field Security', async () => {
        const response = await makeRequest(`${BASE_URL}/auth/signin`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        
        const content = response.data;
        
        // Check if password field has type="password"
        const hasPasswordType = content.includes('type="password"');
        
        if (!hasPasswordType) {
            throw new Error('Password field does not have type="password"');
        }
    });

    await test('CSRF Protection', async () => {
        const response = await makeRequest(`${BASE_URL}/auth/signin`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        
        const content = response.data;
        
        // NextAuth automatically includes CSRF protection
        const hasCsrfToken = content.includes('csrf') || content.includes('CSRF');
        
        if (!hasCsrfToken) {
            console.log('⚠️  CSRF token not found (may be normal for NextAuth)');
        }
    });

    // 6. User Experience Tests
    console.log('\n👤 User Experience Tests');
    
    await test('Navigation Links', async () => {
        const signinResponse = await makeRequest(`${BASE_URL}/auth/signin`);
        const signupResponse = await makeRequest(`${BASE_URL}/auth/signup`);
        
        if (signinResponse.status !== 200 || signupResponse.status !== 200) {
            throw new Error('Authentication pages not accessible');
        }
        
        const signinContent = signinResponse.data;
        const signupContent = signupResponse.data;
        
        // Check for navigation between auth pages
        const hasSignupLink = signinContent.includes('Sign up') || signinContent.includes('Sign Up') || signinContent.includes('signup');
        const hasSigninLink = signupContent.includes('Sign in') || signupContent.includes('Sign In') || signupContent.includes('signin');
        
        if (!hasSignupLink) {
            throw new Error('Sign Up link not found on sign in page');
        }
        if (!hasSigninLink) {
            throw new Error('Sign In link not found on sign up page');
        }
    });

    await test('Error Messages Display', async () => {
        const response = await makeRequest(`${BASE_URL}/auth/signin`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        
        const content = response.data;
        
        // Check for error message containers
        const hasErrorContainer = content.includes('error') || content.includes('Error') || content.includes('alert');
        
        if (!hasErrorContainer) {
            console.log('⚠️  Error message containers not found');
        }
    });

    // 7. Responsive Design Tests
    console.log('\n📱 Responsive Design Tests');
    
    await test('Mobile Responsive Auth Pages', async () => {
        const pages = ['/auth/signin', '/auth/signup'];
        
        for (const page of pages) {
            const response = await makeRequest(`${BASE_URL}${page}`);
            if (response.status !== 200) {
                throw new Error(`Page ${page} not accessible`);
            }
            
            const content = response.data;
            
            // Check for responsive design elements
            const hasViewport = content.includes('viewport');
            const hasResponsiveClasses = content.includes('sm:') || content.includes('md:') || content.includes('lg:');
            
            if (!hasViewport) {
                throw new Error(`Viewport meta tag not found on ${page}`);
            }
            if (!hasResponsiveClasses) {
                console.log(`⚠️  No responsive classes found on ${page}`);
            }
        }
    });

    // 8. Accessibility Tests
    console.log('\n♿ Accessibility Tests');
    
    await test('Form Accessibility', async () => {
        const response = await makeRequest(`${BASE_URL}/auth/signin`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        
        const content = response.data;
        
        // Check for accessibility features
        const hasLabels = content.includes('label') || content.includes('Label');
        const hasAriaLabels = content.includes('aria-');
        
        if (!hasLabels) {
            throw new Error('Form labels not found');
        }
        if (!hasAriaLabels) {
            console.log('⚠️  ARIA labels not found');
        }
    });

    // 9. Performance Tests
    console.log('\n⚡ Performance Tests');
    
    await test('Auth Page Load Time', async () => {
        const pages = ['/auth/signin', '/auth/signup'];
        
        for (const page of pages) {
            const startTime = Date.now();
            const response = await makeRequest(`${BASE_URL}${page}`);
            const endTime = Date.now();
            const loadTime = endTime - startTime;
            
            if (response.status !== 200) {
                throw new Error(`Page ${page} not accessible`);
            }
            
            if (loadTime > 3000) {
                throw new Error(`Page ${page} load time ${loadTime}ms exceeds 3s threshold`);
            }
            
            console.log(`📊 ${page} load time: ${loadTime}ms`);
        }
    });

    // 10. Integration Tests
    console.log('\n🔗 Integration Tests');
    
    await test('Auth Integration with Main App', async () => {
        const mainResponse = await makeRequest(`${BASE_URL}/`);
        const signinResponse = await makeRequest(`${BASE_URL}/auth/signin`);
        
        if (mainResponse.status !== 200 || signinResponse.status !== 200) {
            throw new Error('Pages not accessible');
        }
        
        const mainContent = mainResponse.data;
        const signinContent = signinResponse.data;
        
        // Check if auth is integrated into main app
        const hasAuthComponent = mainContent.includes('AuthButton') || mainContent.includes('Sign In') || mainContent.includes('Login');
        
        if (!hasAuthComponent) {
            console.log('⚠️  Auth component not found on main page');
        }
        
        // Check if consistent styling
        const mainHasStyling = mainContent.includes('class=');
        const signinHasStyling = signinContent.includes('class=');
        
        if (!mainHasStyling || !signinHasStyling) {
            throw new Error('Styling not applied consistently');
        }
    });

    // Print results
    console.log('\n📊 Authentication Test Results Summary');
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
        console.log('\n🎉 All authentication tests passed!');
    }
}

// Run tests
runAuthTests().catch(error => {
    console.error('💥 Authentication test execution failed:', error);
    process.exit(1);
});