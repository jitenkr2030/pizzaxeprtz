#!/usr/bin/env node

const http = require('http');

function makeRequest(url) {
    return new Promise((resolve, reject) => {
        const req = http.request(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    data: data
                });
            });
        });
        
        req.on('error', reject);
        req.setTimeout(5000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
        req.end();
    });
}

async function debug() {
    try {
        const response = await makeRequest('http://localhost:3000');
        console.log('Status:', response.status);
        console.log('Content length:', response.data.length);
        
        // Look for auth-related content
        const authKeywords = ['Sign In', 'Sign Up', 'AuthButton', 'LogIn', 'LogOut'];
        const foundKeywords = [];
        
        for (const keyword of authKeywords) {
            if (response.data.includes(keyword)) {
                foundKeywords.push(keyword);
            }
        }
        
        console.log('Found auth keywords:', foundKeywords);
        
        // Look for menu items
        const menuKeywords = ['Paneer Tikka Pizza', 'Tandoori Chicken Pizza', 'pizza'];
        const foundMenuItems = [];
        
        for (const keyword of menuKeywords) {
            if (response.data.includes(keyword)) {
                foundMenuItems.push(keyword);
            }
        }
        
        console.log('Found menu items:', foundMenuItems);
        
        // Look for cart
        const cartKeywords = ['ShoppingCart', 'cart', 'Cart'];
        const foundCart = [];
        
        for (const keyword of cartKeywords) {
            if (response.data.includes(keyword)) {
                foundCart.push(keyword);
            }
        }
        
        console.log('Found cart keywords:', foundCart);
        
        // Show a sample of the HTML
        console.log('\nHTML Sample (first 1000 chars):');
        console.log(response.data.substring(0, 1000));
        
    } catch (error) {
        console.error('Debug failed:', error.message);
    }
}

debug();