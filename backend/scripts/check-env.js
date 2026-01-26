#!/usr/bin/env node

/**
 * Check if all required environment variables are set
 * Run: node scripts/check-env.js
 */

const requiredVars = [
  'NODE_ENV',
  'PORT',
  'DATABASE_URL',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL',
  'JWT_SECRET',
  'JWT_EXPIRATION',
  'CORS_ORIGIN',
  'FRONTEND_URL'
];

const optionalVars = [
  'MAILERSEND_API_KEY',
  'MAILERSEND_SENDER_EMAIL',
  'MAILERSEND_SENDER_NAME',
  'OPENROUTER_API_KEY'
];

console.log('\n🔍 Checking Environment Variables\n');
console.log('='.repeat(60));

let missingRequired = [];
let missingOptional = [];

console.log('\n✅ Required Variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    // Show first and last 4 characters for security
    const masked = value.length > 8
      ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}`
      : '****';
    console.log(`  ✓ ${varName}: ${masked}`);
  } else {
    console.log(`  ✗ ${varName}: MISSING`);
    missingRequired.push(varName);
  }
});

console.log('\n⚙️  Optional Variables:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✓ ${varName}: Set`);
  } else {
    console.log(`  ○ ${varName}: Not set`);
    missingOptional.push(varName);
  }
});

console.log('\n' + '='.repeat(60));

if (missingRequired.length > 0) {
  console.log('\n❌ Missing Required Variables:');
  missingRequired.forEach(v => console.log(`  - ${v}`));
  console.log('\n⚠️  Application may not work correctly!');
  process.exit(1);
} else {
  console.log('\n✅ All required variables are set!');

  if (missingOptional.length > 0) {
    console.log('\nℹ️  Optional variables not set:');
    missingOptional.forEach(v => console.log(`  - ${v}`));
    console.log('\nSome features may be disabled.');
  }

  process.exit(0);
}
