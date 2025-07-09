#!/usr/bin/env node

console.log('🔧 MongoDB Atlas Connection & Database Setup Guide');
console.log('=' .repeat(60));

console.log('\n📋 STEP 1: Fix MongoDB Atlas Connection');
console.log('-'.repeat(40));
console.log('1. Go to: https://cloud.mongodb.com/');
console.log('2. Sign in with your account');
console.log('3. Select your project and cluster');
console.log('4. Check cluster status:');
console.log('   ✅ Cluster should show "Connected" (not paused)');
console.log('   ❌ If paused, click "Resume" and wait 2-3 minutes');

console.log('\n🌐 STEP 2: Fix Network Access');
console.log('-'.repeat(40));
console.log('1. In Atlas dashboard, click "Network Access" (left sidebar)');
console.log('2. Click "Add IP Address"');
console.log('3. Choose one option:');
console.log('   Option A: Click "Add Current IP Address" (recommended)');
console.log('   Option B: Add 0.0.0.0/0 for testing (not for production)');
console.log('4. Click "Confirm"');
console.log('5. Wait 2-3 minutes for changes to take effect');

console.log('\n👤 STEP 3: Check Database User');
console.log('-'.repeat(40));
console.log('1. Click "Database Access" (left sidebar)');
console.log('2. Find user "ukrush12"');
console.log('3. Ensure privileges: "Read and write to any database"');
console.log('4. If needed, click "Edit" → change to "Atlas admin"');

console.log('\n🔗 STEP 4: Update Connection String (if needed)');
console.log('-'.repeat(40));
console.log('1. Click "Database" → "Connect" → "Drivers"');
console.log('2. Copy the new connection string');
console.log('3. Update .env.local file if string has changed');

console.log('\n⚡ STEP 5: Test & Populate Database');
console.log('-'.repeat(40));
console.log('After completing steps 1-4, run these commands:');
console.log('');
console.log('   node test-db-connection.js        # Test connection');
console.log('   node populate-database.js         # Add real products');
console.log('   npm run dev                       # Start website');
console.log('');

console.log('\n🎯 EXPECTED RESULT');
console.log('-'.repeat(40));
console.log('✅ Products page will show real database products');
console.log('✅ No more "Database Connection Required" message');
console.log('✅ Categories and filters will work');
console.log('✅ Cart functionality will work with real products');

console.log('\n📞 If Still Having Issues:');
console.log('-'.repeat(40));
console.log('1. Check firewall/antivirus blocking MongoDB ports');
console.log('2. Try different network (mobile hotspot)');
console.log('3. Verify MongoDB Atlas cluster region');
console.log('4. Contact MongoDB Atlas support');

console.log('\n🔧 Current Connection String:');
console.log('mongodb+srv://ukrush12:***@cluster0.m6oq7cm.mongodb.net/techzone');
