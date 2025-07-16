import { spawn } from 'child_process';
import path from 'path';

const projectPath = 'c:\\Users\\ASUS\\Desktop\\TechZone\\techzone';

console.log('🚀 Starting Next.js development server...');
console.log('📁 Project path:', projectPath);

const devProcess = spawn('npm', ['run', 'dev'], {
  cwd: projectPath,
  stdio: 'inherit',
  shell: true
});

devProcess.on('error', (error) => {
  console.error('❌ Failed to start development server:', error);
});

devProcess.on('close', (code) => {
  console.log(`📈 Development server process exited with code ${code}`);
});

// Give it some time to start, then test our endpoints
setTimeout(async () => {
  console.log('\n🧪 Testing our database endpoints...');
  
  try {
    // Test the direct database connection endpoint
    console.log('🔍 Testing /api/test-direct-db...');
    const directTestResponse = await fetch('http://localhost:3000/api/test-direct-db');
    const directTestResult = await directTestResponse.text();
    console.log('📊 Direct test result:', directTestResult);
    
    // Test the direct user update endpoint
    console.log('\n🔍 Testing /api/user-direct...');
    const userDirectResponse = await fetch('http://localhost:3000/api/user-direct', {
      method: 'GET'
    });
    const userDirectResult = await userDirectResponse.text();
    console.log('👤 User direct result:', userDirectResult);
    
  } catch (testError) {
    console.error('❌ Test error:', testError.message);
  }
}, 10000); // Wait 10 seconds for server to start
