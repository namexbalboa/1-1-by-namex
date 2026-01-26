#!/usr/bin/env node

/**
 * Generate secure secrets for production deployment
 * Run: node scripts/generate-secrets.js
 */

const crypto = require('crypto');

console.log('\n🔐 Generating Secure Secrets for Production\n');
console.log('='.repeat(60));

// Generate JWT Secret
const jwtSecret = crypto.randomBytes(64).toString('base64');
console.log('\n📝 JWT_SECRET:');
console.log(jwtSecret);

// Generate Session Secret
const sessionSecret = crypto.randomBytes(32).toString('hex');
console.log('\n📝 SESSION_SECRET:');
console.log(sessionSecret);

// Generate API Key
const apiKey = crypto.randomBytes(32).toString('hex');
console.log('\n📝 API_KEY (if needed):');
console.log(apiKey);

console.log('\n' + '='.repeat(60));
console.log('\n⚠️  IMPORTANT:');
console.log('1. Copy these secrets to your hosting platform (Railway, Render, etc.)');
console.log('2. NEVER commit these secrets to Git');
console.log('3. Use different secrets for each environment (dev, staging, prod)');
console.log('4. Store secrets securely (password manager recommended)');
console.log('\n✅ Add these to your Railway/Render environment variables:\n');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`SESSION_SECRET=${sessionSecret}`);
console.log('\n');
