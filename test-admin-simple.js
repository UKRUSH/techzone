// Simple test to check if admin dashboard loads
async function testAdmin() {
  console.log('🧪 Testing Admin Dashboard...\n');
  
  try {
    const response = await fetch('http://localhost:3000/admin');
    console.log(`Admin Dashboard Status: ${response.status}`);
    
    if (response.ok) {
      const content = await response.text();
      console.log('✅ Admin dashboard is working!');
      console.log(`Content length: ${content.length} characters`);
      
      if (content.includes('Dashboard') || content.includes('Products')) {
        console.log('✅ Content looks good - contains dashboard elements');
      } else {
        console.log('⚠️  Content might be incomplete');
      }
    } else {
      console.log(`❌ Admin dashboard failed with status: ${response.status}`);
    }
    
  } catch (error) {
    console.error('❌ Error testing admin dashboard:', error.message);
  }
}

testAdmin();
