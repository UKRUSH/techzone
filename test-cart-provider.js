// Quick test for CartProvider initialization
const fs = require('fs');
const path = require('path');

function testCartProviderCode() {
  console.log('🧪 Testing CartProvider initialization order...');
  
  try {
    const cartProviderPath = path.join(__dirname, 'components', 'providers', 'CartProvider_clean.jsx');
    const content = fs.readFileSync(cartProviderPath, 'utf8');
    
    // Check if fetchCart is defined before it's used in useEffect
    const fetchCartDefIndex = content.indexOf('const fetchCart = useCallback');
    const useEffectWithFetchCartIndex = content.indexOf('}, [fetchCart]);');
    
    console.log('fetchCart definition at index:', fetchCartDefIndex);
    console.log('useEffect with fetchCart dependency at index:', useEffectWithFetchCartIndex);
    
    if (fetchCartDefIndex === -1) {
      console.log('❌ fetchCart definition not found');
      return false;
    }
    
    if (useEffectWithFetchCartIndex === -1) {
      console.log('✅ No useEffect with fetchCart dependency found (good!)');
      return true;
    }
    
    if (fetchCartDefIndex < useEffectWithFetchCartIndex) {
      console.log('✅ fetchCart is defined before it\'s used in useEffect');
      return true;
    } else {
      console.log('❌ fetchCart is used before it\'s defined');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error reading CartProvider file:', error.message);
    return false;
  }
}

function checkForCommonIssues() {
  console.log('\n🔍 Checking for common React issues...');
  
  try {
    const cartProviderPath = path.join(__dirname, 'components', 'providers', 'CartProvider_clean.jsx');
    const content = fs.readFileSync(cartProviderPath, 'utf8');
    
    // Check for fetchCart references
    const fetchCartRefs = (content.match(/fetchCart/g) || []).length;
    console.log(`📊 Total fetchCart references: ${fetchCartRefs}`);
    
    // Check for useCallback usage
    const useCallbackCount = (content.match(/useCallback/g) || []).length;
    console.log(`📊 Total useCallback usages: ${useCallbackCount}`);
    
    // Check for useEffect usage
    const useEffectCount = (content.match(/useEffect/g) || []).length;
    console.log(`📊 Total useEffect usages: ${useEffectCount}`);
    
    // Check for empty dependency arrays
    const emptyDeps = (content.match(/\}, \[\]/g) || []).length;
    console.log(`📊 Empty dependency arrays: ${emptyDeps}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error analyzing file:', error.message);
    return false;
  }
}

// Run tests
const initTest = testCartProviderCode();
const analysisTest = checkForCommonIssues();

console.log('\n🎯 Test Results:');
console.log(`Cart initialization order: ${initTest ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Code analysis: ${analysisTest ? '✅ PASS' : '❌ FAIL'}`);

if (initTest && analysisTest) {
  console.log('\n🎉 All tests passed! CartProvider should work correctly now.');
} else {
  console.log('\n⚠️  Some issues detected. Check the output above.');
}
