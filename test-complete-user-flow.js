const BASE_URL = 'http://localhost:3000';

async function testCompleteUserFlow() {
  const fetch = (await import('node-fetch')).default;
  console.log('🚀 Testing Complete User Flow...\n');

  // Test data
  const testUser = {
    name: 'Test User Flow',
    email: `testflow_${Date.now()}@example.com`,
    password: 'TestPassword123',
    phone: '0771234567'
  };

  console.log('📝 Testing User Registration...');
  
  try {
    // 1. Test Registration
    const registerResponse = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    const registerResult = await registerResponse.json();
    
    if (registerResponse.ok) {
      console.log('✅ Registration successful:', registerResult.message);
      console.log('   User ID:', registerResult.user.id);
      console.log('   Phone:', registerResult.user.phone);
    } else {
      console.log('❌ Registration failed:', registerResult.error);
      return;
    }

    const userId = registerResult.user.id;

    // 2. Test Profile Update
    console.log('\n📝 Testing Profile Update...');
    
    const updateData = {
      name: 'Updated Test User',
      phone: '0779876543',
      address: '123 Updated Street, Colombo 07'
    };

    const updateResponse = await fetch(`${BASE_URL}/api/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Note: In real scenario, this would include authentication
        'user-id': userId // Mock header for testing
      },
      body: JSON.stringify(updateData),
    });

    const updateResult = await updateResponse.json();
    
    if (updateResponse.ok) {
      console.log('✅ Profile update successful');
      console.log('   Updated name:', updateResult.user.name);
      console.log('   Updated phone:', updateResult.user.phone);
      console.log('   Updated address:', updateResult.user.address);
    } else {
      console.log('❌ Profile update failed:', updateResult.error);
    }

    // 3. Test Profile Retrieval
    console.log('\n📝 Testing Profile Retrieval...');
    
    const getResponse = await fetch(`${BASE_URL}/api/user`, {
      method: 'GET',
      headers: {
        'user-id': userId // Mock header for testing
      }
    });

    const getResult = await getResponse.json();
    
    if (getResponse.ok) {
      console.log('✅ Profile retrieval successful');
      console.log('   Name:', getResult.user.name);
      console.log('   Email:', getResult.user.email);
      console.log('   Phone:', getResult.user.phone || 'Not provided');
      console.log('   Address:', getResult.user.address || 'Not provided');
    } else {
      console.log('❌ Profile retrieval failed:', getResult.error);
    }

    // 4. Test Phone Validation
    console.log('\n📝 Testing Phone Validation...');
    
    const invalidPhoneData = {
      name: 'Test User',
      phone: '123456' // Invalid phone
    };

    const invalidPhoneResponse = await fetch(`${BASE_URL}/api/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'user-id': userId
      },
      body: JSON.stringify(invalidPhoneData),
    });

    const invalidPhoneResult = await invalidPhoneResponse.json();
    
    if (!invalidPhoneResponse.ok && invalidPhoneResult.error.includes('phone')) {
      console.log('✅ Phone validation working correctly');
      console.log('   Error:', invalidPhoneResult.error);
    } else {
      console.log('❌ Phone validation not working as expected');
    }

    console.log('\n🎉 User flow test completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testCompleteUserFlow();
