// Simple database connection test
async function testDatabaseConnection() {
  try {
    console.log('🧪 Testing database connection...');
    
    const response = await fetch('/api/test-db');
    const data = await response.json();
    
    console.log('Database test result:', data);
    
    if (data.status === 'connected') {
      console.log('✅ Database connection working!');
      console.log(`Found ${data.userCount} users in database`);
    } else {
      console.log('❌ Database connection failed:', data.error);
    }
    
  } catch (error) {
    console.log('❌ Test error:', error.message);
  }
}

// Test profile update
async function testProfileUpdate() {
  try {
    console.log('📝 Testing profile update...');
    
    const testData = {
      name: 'Test User ' + Date.now(),
      phone: '0771234567'
    };
    
    const response = await fetch('/api/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    console.log('Profile update status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Profile update successful!');
      console.log('Updated user name:', result.name);
    } else {
      const error = await response.json();
      console.log('❌ Profile update failed:', error);
    }
    
  } catch (error) {
    console.log('❌ Update error:', error.message);
  }
}

// Auto-run tests when loaded
if (typeof window !== 'undefined') {
  console.log('🚀 Starting database and profile tests...');
  
  // Run tests with delays
  setTimeout(testDatabaseConnection, 1000);
  setTimeout(testProfileUpdate, 3000);
  
  // Make functions available globally for manual testing
  window.testDatabaseConnection = testDatabaseConnection;
  window.testProfileUpdate = testProfileUpdate;
}
