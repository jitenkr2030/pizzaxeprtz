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
        
        const content = response.data;
        
        // Check for HTML structure
        const hasDoctype = content.includes('<!DOCTYPE html>');
        const hasHtmlTag = content.includes('<html');
        const hasHeadTag = content.includes('<head>');
        const hasBodyTag = content.includes('<body>');
        const hasNavTag = content.includes('<nav');
        const hasCharset = content.includes('charset=');
        
        console.log('HTML Structure Check:');
        console.log('  DOCTYPE:', hasDoctype ? '✅' : '❌');
        console.log('  HTML tag:', hasHtmlTag ? '✅' : '❌');
        console.log('  Head tag:', hasHeadTag ? '✅' : '❌');
        console.log('  Body tag:', hasBodyTag ? '✅' : '❌');
        console.log('  Nav tag:', hasNavTag ? '✅' : '❌');
        console.log('  Charset:', hasCharset ? '✅' : '❌');
        
        // Show first 2000 characters to see the structure
        console.log('\nFirst 2000 characters:');
        console.log(content.substring(0, 2000));
        
    } catch (error) {
        console.error('Debug failed:', error.message);
    }
}

debug();