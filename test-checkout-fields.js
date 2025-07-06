// Test script to verify checkout field mappings
const testShippingData = {
  customerInfo: {
    name: "John Doe",
    email: "john@example.com",
    phone: "077 123 4567"
  },
  shippingAddress: {
    address: "123 Galle Road",
    city: "Colombo",
    district: "Colombo",
    postalCode: "10100",
    country: "Sri Lanka"
  },
  orderSummary: {
    items: [],
    subtotal: "1000.00",
    tax: "180.00",
    total: "1180.00",
    shipping: "0.00"
  }
};

console.log("Test shipping data structure:");
console.log(JSON.stringify(testShippingData, null, 2));

// Simulate what the API expects
const apiData = {
  customerInfo: testShippingData.customerInfo,
  shippingAddress: {
    address: testShippingData.shippingAddress.address,
    city: testShippingData.shippingAddress.city,
    // API expects these field names
    shippingState: testShippingData.shippingAddress.district,
    shippingZipCode: testShippingData.shippingAddress.postalCode,
    country: testShippingData.shippingAddress.country
  }
};

console.log("\nAPI expected format:");
console.log(JSON.stringify(apiData, null, 2));
