// Test INKFLOW endpoints directly
export const testInkflowEndpoints = async () => {
  const possibleUrls = [
    'https://inkflow.lovable.app',
    'https://api.inkflow.lovable.app', 
    'https://inkflow.lovable.app/api',
    'https://inkflow.lovable.app/v1',
    'https://inkflow.lovable.app/api/v1'
  ];
  const apiKey = 'ik_RcpjFTsCE2pFbrU5QAUPg8l5lLRQBb';
  
  console.log('🧪 Testing INKFLOW endpoints with multiple base URLs...');
  
  // Test different base URLs
  for (const baseUrl of possibleUrls) {
    console.log(`\n🔍 Testing base URL: ${baseUrl}`);
    await testSingleBaseUrl(baseUrl, apiKey);
  }
};

const testSingleBaseUrl = async (baseUrl, apiKey) => {
  
  // Test 1: Basic connectivity
  try {
    console.log('  🔍 Basic connectivity test');
    const response = await fetch(baseUrl, { method: 'GET' });
    console.log('  ✅ Basic connectivity:', response.status, response.statusText);
    
    // Check if response is JSON vs HTML
    const contentType = response.headers.get('content-type');
    console.log('  📄 Content-Type:', contentType);
    
    if (contentType?.includes('application/json')) {
      const json = await response.json();
      console.log('  📦 JSON Response:', json);
    }
  } catch (error) {
    console.error('  ❌ Basic connectivity failed:', error.message);
  }
  
  // Test 2: Auth endpoint variations
  const authEndpoints = ['/inkflow-auth', '/auth', '/api/auth', '/v1/auth'];
  for (const endpoint of authEndpoints) {
    try {
      console.log(`  🔍 Testing auth endpoint: ${endpoint}`);
      const response = await fetch(`${baseUrl}${endpoint}`, { method: 'GET' });
      console.log(`  📥 ${endpoint} response:`, response.status, response.statusText);
      
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const json = await response.json();
        console.log(`  📦 ${endpoint} JSON:`, json);
      } else if (response.status === 404) {
        console.log(`  ❌ ${endpoint} not found`);
      } else {
        const text = await response.text();
        const isHtml = text.includes('<!DOCTYPE html>');
        console.log(`  📄 ${endpoint} returns:`, isHtml ? 'HTML page' : 'Other content');
      }
    } catch (error) {
      console.error(`  ❌ ${endpoint} failed:`, error.message);
    }
  }
};

// Add to window for easy testing
if (typeof window !== 'undefined') {
  window.testInkflowEndpoints = testInkflowEndpoints;
}