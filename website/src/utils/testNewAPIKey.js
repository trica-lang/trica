// Test the new API key directly
const API_KEY = 'ik_RcpjFTsCE2pFbrU5QAUPg8l5lLRQBb';
const BASE_URL = 'https://ihryuknhmtxcfqsfddtz.supabase.co';

export const testNewAPIKey = async () => {
  console.log('🧪 Testing New API Key:', API_KEY);
  console.log('🌐 Base URL:', BASE_URL);
  
  // Test 1: Simple ping with new API key
  console.log('\n🔍 Test 1: Basic auth endpoint test');
  try {
    const response = await fetch(`${BASE_URL}/functions/v1/inkflow-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'apikey': API_KEY
      },
      body: JSON.stringify({
        action: 'ping'
      })
    });
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Response Body:', responseText);
    
    if (response.ok) {
      console.log('✅ API Key works!');
    } else {
      console.log('❌ API Key failed');
    }
  } catch (error) {
    console.log('❌ Request failed:', error.message);
  }
  
  // Test 2: Try authentication
  console.log('\n🔍 Test 2: Authentication test');
  try {
    const response = await fetch(`${BASE_URL}/functions/v1/inkflow-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'apikey': API_KEY
      },
      body: JSON.stringify({
        action: 'authenticate',
        external_user_id: 'test_user_123',
        email: 'test@trica.dev',
        display_name: 'Test User'
      })
    });
    
    console.log('Auth Status:', response.status);
    const authResponse = await response.text();
    console.log('Auth Response:', authResponse);
    
    if (response.ok) {
      console.log('✅ Authentication works!');
    } else {
      console.log('❌ Authentication failed');
    }
  } catch (error) {
    console.log('❌ Auth request failed:', error.message);
  }
  
  // Test 3: Try different header combinations
  console.log('\n🔍 Test 3: Different header combinations');
  
  const headerTests = [
    {
      name: 'Only Authorization Bearer',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    },
    {
      name: 'Only apikey header',
      headers: {
        'Content-Type': 'application/json',
        'apikey': API_KEY
      }
    },
    {
      name: 'Both headers (current)',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'apikey': API_KEY
      }
    },
    {
      name: 'X-API-Key header',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      }
    }
  ];
  
  for (const test of headerTests) {
    console.log(`\n  Testing: ${test.name}`);
    try {
      const response = await fetch(`${BASE_URL}/functions/v1/inkflow-auth`, {
        method: 'POST',
        headers: test.headers,
        body: JSON.stringify({
          action: 'ping'
        })
      });
      
      console.log(`    Status: ${response.status}`);
      const text = await response.text();
      console.log(`    Response: ${text.substring(0, 100)}`);
    } catch (error) {
      console.log(`    Error: ${error.message}`);
    }
  }
  
  console.log('\n🏁 Test complete!');
};

// Auto-run if in browser
if (typeof window !== 'undefined') {
  window.testNewAPIKey = testNewAPIKey;
  console.log('🔧 Test available: window.testNewAPIKey()');
}