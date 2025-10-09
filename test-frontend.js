#!/usr/bin/env node

/**
 * Frontend Testing Script for Pizzaxperts Application
 * This script performs detailed testing of frontend components and functionality
 */

const http = require('http');

// Test configuration
const BASE_URL = 'http://localhost:3000';

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

// Frontend test cases
async function runFrontendTests() {
    console.log('🎨 Starting Frontend Testing for Pizzaxperts Application\n');

    // 1. Page Structure Tests
    console.log('📄 Page Structure Tests');
    
    await test('HTML Document Structure', async () => {
        const response = await makeRequest(`${BASE_URL}/`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        const content = response.data;
        
        // Check for proper HTML structure (Next.js format)
        if (!content.includes('<!DOCTYPE html>')) {
            throw new Error('DOCTYPE declaration missing');
        }
        if (!content.includes('<html')) {
            throw new Error('HTML tag missing');
        }
        if (!content.includes('<head>')) {
            throw new Error('Head section missing');
        }
        if (!content.includes('<body')) {
            throw new Error('Body section missing');
        }
    });

    await test('Meta Tags Configuration', async () => {
        const response = await makeRequest(`${BASE_URL}/`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        const content = response.data;
        
        // Check for essential meta tags (Next.js format)
        const requiredMetaTags = [
            'charSet="utf-8"',  // Next.js uses camelCase
            'name="viewport"',
            'name="description"',
            'name="keywords"',
            'property="og:title"',
            'property="og:description"',
            'property="og:url"',
            'name="twitter:card"'
        ];
        
        for (const metaTag of requiredMetaTags) {
            if (!content.includes(metaTag)) {
                throw new Error(`Meta tag '${metaTag}' not found`);
            }
        }
    });

    await test('Title Tag', async () => {
        const response = await makeRequest(`${BASE_URL}/`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        const content = response.data;
        
        if (!content.includes('<title>')) {
            throw new Error('Title tag not found');
        }
        if (!content.includes('Pizzaxperts')) {
            throw new Error('Application name not in title');
        }
    });

    // 2. Navigation Tests
    console.log('\n🧭 Navigation Tests');
    
    await test('Navigation Menu Present', async () => {
        const response = await makeRequest(`${BASE_URL}/`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        const content = response.data;
        
        // Check for navigation elements (Next.js may use different structure)
        const hasNav = content.includes('nav') || content.includes('navigation') || content.includes('Navigation');
        const hasLinks = content.includes('href=') || content.includes('Link');
        const hasMenu = content.includes('menu') || content.includes('Menu');
        
        if (!hasNav && !hasMenu) {
            throw new Error('Navigation menu not found');
        }
        if (!hasLinks) {
            throw new Error('Navigation links not found');
        }
    });

    await test('Internal Links Working', async () => {
        const pages = ['/about', '/contact', '/faq', '/careers'];
        
        for (const page of pages) {
            const response = await makeRequest(`${BASE_URL}${page}`);
            if (response.status !== 200) {
                throw new Error(`Page ${page} returned status ${response.status}`);
            }
        }
    });

    // 3. Content Tests
    console.log('\n📝 Content Tests');
    
    await test('Main Page Content', async () => {
        const response = await makeRequest(`${BASE_URL}/`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        const content = response.data;
        
        // Check for key content elements
        const hasHeading = content.includes('<h1') || content.includes('Pizzaxperts');
        const hasMenu = content.includes('menu') || content.includes('Menu');
        const hasDescription = content.includes('Authentic') || content.includes('pizza');
        
        if (!hasHeading) {
            throw new Error('Main heading not found');
        }
        if (!hasMenu) {
            throw new Error('Menu content not found');
        }
        if (!hasDescription) {
            throw new Error('Description content not found');
        }
    });

    await test('Menu Items Display', async () => {
        const response = await makeRequest(`${BASE_URL}/`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        const content = response.data;
        
        // Check for specific menu items
        const menuItems = [
            'Paneer Tikka Pizza',
            'Tandoori Chicken Pizza',
            'Butter Chicken Pizza'
        ];
        
        let foundItems = 0;
        for (const item of menuItems) {
            if (content.includes(item)) {
                foundItems++;
            }
        }
        
        if (foundItems === 0) {
            throw new Error('No menu items found');
        }
        if (foundItems < 2) {
            console.log(`⚠️  Only ${foundItems} menu items found (expected at least 2)`);
        }
    });

    // 4. Form Tests
    console.log('\n📋 Form Tests');
    
    await test('Authentication Forms', async () => {
        const signinResponse = await makeRequest(`${BASE_URL}/auth/signin`);
        if (signinResponse.status !== 200) {
            throw new Error(`Signin page returned status ${signinResponse.status}`);
        }
        
        const signupResponse = await makeRequest(`${BASE_URL}/auth/signup`);
        if (signupResponse.status !== 200) {
            throw new Error(`Signup page returned status ${signupResponse.status}`);
        }
        
        const signinContent = signinResponse.data;
        const signupContent = signupResponse.data;
        
        // Check for form elements
        const hasSigninForm = signinContent.includes('form') && signinContent.includes('email');
        const hasSignupForm = signupContent.includes('form') && signupContent.includes('email');
        
        if (!hasSigninForm) {
            throw new Error('Signin form not found');
        }
        if (!hasSignupForm) {
            throw new Error('Signup form not found');
        }
    });

    await test('Contact Form', async () => {
        const response = await makeRequest(`${BASE_URL}/contact`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        const content = response.data;
        
        // Check for contact form elements
        const hasForm = content.includes('form');
        const hasEmail = content.includes('email') || content.includes('Email');
        const hasMessage = content.includes('message') || content.includes('Message');
        
        if (!hasForm) {
            throw new Error('Contact form not found');
        }
        if (!hasEmail) {
            throw new Error('Email field not found in contact form');
        }
        if (!hasMessage) {
            throw new Error('Message field not found in contact form');
        }
    });

    // 5. Responsive Design Tests
    console.log('\n📱 Responsive Design Tests');
    
    await test('Viewport Meta Tag', async () => {
        const response = await makeRequest(`${BASE_URL}/`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        const content = response.data;
        
        if (!content.includes('viewport')) {
            throw new Error('Viewport meta tag not found');
        }
        if (!content.includes('width=device-width')) {
            throw new Error('Responsive viewport configuration not found');
        }
        if (!content.includes('initial-scale=1')) {
            throw new Error('Initial scale not set in viewport');
        }
    });

    await test('Responsive CSS Classes', async () => {
        const response = await makeRequest(`${BASE_URL}/`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        const content = response.data;
        
        // Check for Tailwind responsive classes
        const responsiveClasses = [
            'sm:', 'md:', 'lg:', 'xl:', '2xl:'
        ];
        
        let foundResponsiveClasses = 0;
        for (const respClass of responsiveClasses) {
            if (content.includes(respClass)) {
                foundResponsiveClasses++;
            }
        }
        
        if (foundResponsiveClasses === 0) {
            throw new Error('No responsive CSS classes found');
        }
        if (foundResponsiveClasses < 3) {
            console.log(`⚠️  Only ${foundResponsiveClasses} responsive breakpoint classes found`);
        }
    });

    // 6. Accessibility Tests
    console.log('\n♿ Accessibility Tests');
    
    await test('Semantic HTML', async () => {
        const response = await makeRequest(`${BASE_URL}/`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        const content = response.data;
        
        // Check for semantic HTML elements
        const semanticElements = [
            '<header', '<nav', '<main', '<footer', '<section', '<article'
        ];
        
        let foundSemanticElements = 0;
        for (const element of semanticElements) {
            if (content.includes(element)) {
                foundSemanticElements++;
            }
        }
        
        if (foundSemanticElements < 3) {
            throw new Error(`Only ${foundSemanticElements} semantic elements found (expected at least 3)`);
        }
    });

    await test('Alt Text for Images', async () => {
        const response = await makeRequest(`${BASE_URL}/`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        const content = response.data;
        
        // Check for images with alt text
        const imgTags = content.match(/<img[^>]*>/g) || [];
        let imagesWithAlt = 0;
        
        for (const imgTag of imgTags) {
            if (imgTag.includes('alt=')) {
                imagesWithAlt++;
            }
        }
        
        if (imgTags.length > 0 && imagesWithAlt === 0) {
            throw new Error('Images found but no alt text detected');
        }
    });

    // 7. Performance Tests
    console.log('\n⚡ Performance Tests');
    
    await test('Page Load Time', async () => {
        const startTime = Date.now();
        const response = await makeRequest(`${BASE_URL}/`);
        const endTime = Date.now();
        const loadTime = endTime - startTime;
        
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        
        if (loadTime > 5000) {
            throw new Error(`Page load time ${loadTime}ms exceeds 5s threshold`);
        }
        
        console.log(`📊 Page load time: ${loadTime}ms`);
    });

    await test('Content Size', async () => {
        const response = await makeRequest(`${BASE_URL}/`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        
        const contentSize = response.data.length;
        const sizeInKB = Math.round(contentSize / 1024);
        
        if (sizeInKB > 2000) {
            console.log(`⚠️  Page size ${sizeInKB}KB is large (>2MB)`);
        }
        
        console.log(`📊 Page size: ${sizeInKB}KB`);
    });

    // 8. SEO Tests
    console.log('\n🔍 SEO Tests');
    
    await test('SEO Meta Tags', async () => {
        const response = await makeRequest(`${BASE_URL}/`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        const content = response.data;
        
        // Check for SEO-specific meta tags
        const seoTags = [
            'name="description"',
            'name="keywords"',
            'property="og:title"',
            'property="og:description"',
            'property="og:type"',
            'name="twitter:card"',
            'name="twitter:title"'
        ];
        
        let foundSeoTags = 0;
        for (const tag of seoTags) {
            if (content.includes(tag)) {
                foundSeoTags++;
            }
        }
        
        if (foundSeoTags < 5) {
            throw new Error(`Only ${foundSeoTags} SEO tags found (expected at least 5)`);
        }
    });

    await test('Structured Data', async () => {
        const response = await makeRequest(`${BASE_URL}/`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        const content = response.data;
        
        // Check for structured data (JSON-LD)
        const hasStructuredData = content.includes('application/ld+json');
        
        if (!hasStructuredData) {
            console.log('⚠️  No structured data found (not critical but recommended for SEO)');
        }
    });

    // Print results
    console.log('\n📊 Frontend Test Results Summary');
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
        console.log('\n🎉 All frontend tests passed!');
    }
}

// Run tests
runFrontendTests().catch(error => {
    console.error('💥 Frontend test execution failed:', error);
    process.exit(1);
});