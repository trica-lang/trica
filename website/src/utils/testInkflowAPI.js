// Manual test of INKFLOW API to debug the issue
const API_KEY = 'ik_RcpjFTsCE2pFbrU5QAUPg8l5lLRQBb';
const BASE_URL = 'https://ihryuknhmtxcfqsfddtz.supabase.co';

export const testInkflowAPI = async () => {
  console.log('🧪 Manual INKFLOW API Test');
  console.log('API Key:', API_KEY);
  console.log('Base URL:', BASE_URL);
  
  const testPayload = {
    action: 'authenticate',
    external_user_id: 'test_user_123',
    email: 'test@trica.dev',
    display_name: 'Test User'
  };
  
  console.log('Test payload:', testPayload);
  
  try {
    const response = await fetch(`${BASE_URL}/functions/v1/inkflow-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'apikey': API_KEY
      },
      body: JSON.stringify(testPayload)
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Response text:', responseText);
    
    if (response.ok) {
      try {
        const jsonResponse = JSON.parse(responseText);
        console.log('✅ Success:', jsonResponse);
        return jsonResponse;
      } catch (e) {
        console.log('✅ Success (non-JSON):', responseText);
        return { success: true, data: responseText };
      }
    } else {
      console.log('❌ Error:', response.status, responseText);
      return { success: false, error: responseText };
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return { success: false, error: error.message };
  }
};

// Auto-run the test
testInkflowAPI();