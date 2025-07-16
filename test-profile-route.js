// Test script for profile API
console.log('🧪 Profile API Test Script');

// Test to verify user exists in database
async function testUserExists() {
  try {
    console.log('🔍 Testing if user exists in database...');
    
    const response = await fetch('http://localhost:3001/api/debug-session');
    console.log('Debug Response Status:', response.status);
    
    if (response.status === 401) {
      console.log('✅ Expected 401 - need to be logged in to test');
      console.log('💡 Go to http://localhost:3001/profile and sign in, then try updating your profile');
      return;
    }
    
    const data = await response.json();
    console.log('Debug Response:', data);
    
  } catch (error) {
    console.log('❌ Network Error:', error.message);
  }
}

// Test the user PUT endpoint
async function testProfileUpdate() {
  try {
    console.log('📝 Testing profile update...');
    
    const testData = {
      name: 'Test User Updated',
      phone: '0771234567'
    };
    
    const response = await fetch('http://localhost:3001/api/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    console.log('Response Status:', response.status);
    console.log('Response Headers:', [...response.headers.entries()]);
    
    const text = await response.text();
    console.log('Raw Response:', text);
    
    if (text.trim()) {
      try {
        const data = JSON.parse(text);
        console.log('✅ Parsed JSON:', data);
      } catch (parseError) {
        console.log('❌ JSON Parse Error:', parseError.message);
      }
    } else {
      console.log('❌ Empty response body');
    }
    
  } catch (error) {
    console.log('❌ Network Error:', error.message);
  }
}

// Test the user GET endpoint
async function testProfileGet() {
  try {
    console.log('📖 Testing profile get...');
    
    const response = await fetch('http://localhost:3001/api/user');
    console.log('GET Response Status:', response.status);
    
    const text = await response.text();
    console.log('GET Raw Response Length:', text.length);
    
    if (text.trim()) {
      try {
        const data = JSON.parse(text);
        console.log('✅ GET Parsed JSON keys:', Object.keys(data));
      } catch (parseError) {
        console.log('❌ GET JSON Parse Error:', parseError.message);
      }
    }
    
  } catch (error) {
    console.log('❌ GET Network Error:', error.message);
  }
}

if (typeof window !== 'undefined') {
  // Browser environment
  console.log('Running in browser - ready for testing');
  window.testProfileUpdate = testProfileUpdate;
  window.testProfileGet = testProfileGet;
  window.testUserExists = testUserExists;
} else {
  // Node environment
  console.log('This script should be run in a browser environment');
}
