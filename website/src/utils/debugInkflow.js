// Comprehensive INKFLOW API debugging tool
const API_KEY = 'ik_7GFVP42ElBnMlQDwk62oeWVEwgCCJZc';
const BASE_URL = 'https://ihryuknhmtxcfqsfddtz.supabase.co';

export const debugInkflowAPI = async () => {
  console.log('🔍 INKFLOW API Debug Tool');
  console.log('========================');
  console.log('API Key:', API_KEY);
  console.log('Base URL:', BASE_URL);
  console.log('');

  // Test 1: Basic connectivity
  console.log('🧪 Test 1: Basic connectivity');
  try {
    const response = await fetch(`${BASE_URL}/functions/v1/inkflow-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'ping'
      })
    });
    console.log('  Status:', response.status);
    console.log('  Headers:', Object.fromEntries(response.headers.entries()));
    const text = await response.text();
    console.log('  Response:', text);
  } catch (error) {
    console.log('  Error:', error.message);
  }
  console.log('');

  // Test 2: With API key in Authorization header only
  console.log('🧪 Test 2: Authorization header only');
  try {
    const response = await fetch(`${BASE_URL}/functions/v1/inkflow-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        action: 'authenticate',
        external_user_id: 'test_user',
        email: 'test@example.com'
      })
    });
    console.log('  Status:', response.status);
    const text = await response.text();
    console.log('  Response:', text);
  } catch (error) {
    console.log('  Error:', error.message);
  }
  console.log('');

  // Test 3: With API key in apikey header only
  console.log('🧪 Test 3: apikey header only');
  try {
    const response = await fetch(`${BASE_URL}/functions/v1/inkflow-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': API_KEY
      },
      body: JSON.stringify({
        action: 'authenticate',
        external_user_id: 'test_user',
        email: 'test@example.com'
      })
    });
    console.log('  Status:', response.status);
    const text = await response.text();
    console.log('  Response:', text);
  } catch (error) {
    console.log('  Error:', error.message);
  }
  console.log('');

  // Test 4: With both headers (current implementation)
  console.log('🧪 Test 4: Both headers (current implementation)');
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
        external_user_id: 'test_user',
        email: 'test@example.com'
      })
    });
    console.log('  Status:', response.status);
    const text = await response.text();
    console.log('  Response:', text);
  } catch (error) {
    console.log('  Error:', error.message);
  }
  console.log('');

  // Test 5: Different action types
  console.log('🧪 Test 5: Different actions');
  const actions = ['ping', 'authenticate', 'get_user'];
  
  for (const action of actions) {
    console.log(`  Testing action: ${action}`);
    try {
      const body = action === 'get_user' 
        ? { action, external_user_id: 'test_user' }
        : action === 'authenticate'
        ? { action, external_user_id: 'test_user', email: 'test@example.com' }
        : { action };

      const response = await fetch(`${BASE_URL}/functions/v1/inkflow-auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'apikey': API_KEY
        },
        body: JSON.stringify(body)
      });
      console.log(`    Status: ${response.status}`);
      const text = await response.text();
      console.log(`    Response: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`);
    } catch (error) {
      console.log(`    Error: ${error.message}`);
    }
  }
  console.log('');

  console.log('🔍 Debug complete. Check results above.');
};

// Make it available globally for browser testing
if (typeof window !== 'undefined') {
  window.debugInkflowAPI = debugInkflowAPI;
  console.log('🔧 Debug tool available: window.debugInkflowAPI()');
}