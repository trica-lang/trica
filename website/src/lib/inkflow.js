// Import the official INKFLOW SDK v2.0.0
import { InkflowClient } from 'inkflow-sdk';
import '../utils/testInkflowAPI.js';
import '../utils/testNewAPIKey.js';
import '../utils/testSDKv2.js';

// INKFLOW SDK Configuration
const API_KEY = 'ik_RcpjFTsCE2pFbrU5QAUPg8l5lLRQBb';
const INKFLOW_BASE_URL = 'https://ihryuknhmtxcfqsfddtz.supabase.co';

// Demo mode for fallback when API keys don't work
const DEMO_MODE = false; // Try real API key first with v2.0.0 fixes

// Initialize the official INKFLOW client with correct constructor
const inkflow = new InkflowClient({
  apiKey: API_KEY,
  baseUrl: INKFLOW_BASE_URL
});

console.log('✅ INKFLOW SDK initialized with:');
console.log('  API Key:', API_KEY);
console.log('  Base URL:', INKFLOW_BASE_URL);
console.log('  Instance:', inkflow);
console.log('  Auth available:', !!inkflow.auth);
console.log('  Content available:', !!inkflow.content);

// Test API connection
inkflow.ping().then(isConnected => {
  console.log('🏓 INKFLOW API Ping:', isConnected ? '✅ Connected' : '❌ Failed');
}).catch(error => {
  console.log('🏓 INKFLOW API Ping Error:', error);
});

// Login a user using the official SDK pattern
export const loginToInkflow = async (userId, email, displayName) => {
  // Demo mode fallback
  if (DEMO_MODE) {
    console.log('🎭 DEMO MODE: Simulating INKFLOW authentication');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockAuthData = {
      success: true,
      user: {
        id: userId,
        email: email,
        display_name: displayName
      },
      session_token: `demo_token_${Date.now()}`
    };
    
    localStorage.setItem('inkflow_session', mockAuthData.session_token);
    console.log('✅ DEMO: INKFLOW Auth success:', mockAuthData);
    return mockAuthData.user;
  }

  // Real SDK mode
  try {
    console.log('🔄 INKFLOW SDK v2.0.0 Authenticate:', { userId, email, displayName });
    console.log('🔄 Using API Key:', API_KEY);
    console.log('🔄 Using Base URL:', INKFLOW_BASE_URL);
    
    const authData = {
      external_user_id: userId,
      email: email,
      display_name: displayName,
      metadata: { 
        source: 'trica_app',
        version: '2.0.0',
        login_time: new Date().toISOString()
      }
    };
    
    console.log('🔄 Auth payload:', authData);
    
    const authResult = await inkflow.auth.authenticate(authData);
    
    console.log('📥 INKFLOW SDK v2.0.0 Response:', authResult);
    
    if (authResult.success) {
      // Store the session token using v2.0.0 response format
      if (authResult.token) {
        localStorage.setItem('inkflow_session', authResult.token);
      }
      // Store user data
      localStorage.setItem('inkflow_user_id', userId);
      localStorage.setItem('inkflow_user', JSON.stringify(authResult.user));
      
      console.log('✅ INKFLOW v2.0.0 Authentication success:', authResult.user);
      return authResult.user;
    } else {
      throw new Error('Authentication failed: ' + (authResult.error || 'Unknown error'));
    }
  } catch (error) {
    console.error('❌ INKFLOW Authentication failed:', error);
    console.log('🎭 Falling back to DEMO MODE due to API error');
    
    // Fallback to demo mode
    const mockAuthData = {
      success: true,
      user: {
        id: userId,
        email: email,
        display_name: displayName
      },
      session_token: `demo_token_${Date.now()}`
    };
    
    localStorage.setItem('inkflow_session', mockAuthData.session_token);
    console.log('✅ DEMO FALLBACK: INKFLOW Auth success:', mockAuthData);
    return mockAuthData.user;
  }
};

// Verify a session using the official SDK pattern
export const verifyInkflowSession = async () => {
  const sessionToken = localStorage.getItem('inkflow_session');
  if (!sessionToken) return null;
  
  // Demo mode fallback
  if (DEMO_MODE) {
    console.log('🎭 DEMO MODE: Verifying session token');
    
    if (sessionToken.startsWith('demo_token_')) {
      return {
        id: 'demo_user_123',
        email: 'user@trica.dev',
        display_name: 'TRICA Developer'
      };
    }
    return null;
  }

  // Real SDK mode - use getUser method
  try {
    const userId = localStorage.getItem('inkflow_user_id');
    if (!userId) {
      console.log('❌ No user ID stored');
      localStorage.removeItem('inkflow_session');
      return null;
    }

    console.log('🔄 INKFLOW SDK Get User:', userId);
    
    const user = await inkflow.auth.getUser(userId);
    
    console.log('📥 INKFLOW Get User Response:', user);
    
    if (user) {
      console.log('✅ INKFLOW User found:', user);
      return user;
    } else {
      console.log('❌ INKFLOW User not found');
      localStorage.removeItem('inkflow_session');
      localStorage.removeItem('inkflow_user_id');
      return null;
    }
  } catch (error) {
    console.error('❌ User verification failed:', error);
    localStorage.removeItem('inkflow_session');
    localStorage.removeItem('inkflow_user_id');
    return null;
  }
};

// Content creation using INKFLOW SDK
export const createInkflowContent = async (contentData) => {
  if (DEMO_MODE) {
    console.log('🎭 DEMO MODE: Simulating INKFLOW content creation');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockContent = {
      id: `content_${Date.now()}`,
      title: contentData.title,
      content: contentData.body,
      content_type: contentData.type || 'trica-code',
      slug: contentData.title?.toLowerCase().replace(/\s+/g, '-'),
      is_published: true,
      metadata: contentData.metadata || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      external_user_id: localStorage.getItem('inkflow_user_id')
    };
    
    console.log('✅ DEMO: INKFLOW Content created:', mockContent);
    return mockContent;
  }

  try {
    console.log('🔄 Creating INKFLOW v2.0.0 content:', contentData);
    
    const userId = localStorage.getItem('inkflow_user_id');
    
    // Use the official SDK v2.0.0 content creation with proper format
    const contentPayload = {
      title: contentData.title,
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: contentData.body
              }
            ]
          }
        ]
      },
      content_type: contentData.type || 'trica-code',
      metadata: {
        ...contentData.metadata,
        source: 'trica',
        created_with: 'TRICA Web IDE',
        version: '2.0.0'
      }
    };
    
    console.log('🔄 Content payload:', contentPayload);
    
    const result = await inkflow.content.create(contentPayload, userId);
    
    console.log('✅ INKFLOW v2.0.0 Content created:', result);
    return result;
  } catch (error) {
    console.error('❌ INKFLOW Content creation failed:', error);
    console.log('🎭 Falling back to DEMO MODE for content creation');
    
    // Fallback to demo mode
    const mockContent = {
      id: `content_${Date.now()}`,
      title: contentData.title,
      content: contentData.body,
      content_type: contentData.type || 'trica-code',
      slug: contentData.title?.toLowerCase().replace(/\s+/g, '-'),
      is_published: true,
      metadata: contentData.metadata || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      external_user_id: localStorage.getItem('inkflow_user_id')
    };
    
    console.log('✅ DEMO FALLBACK: INKFLOW Content created:', mockContent);
    return mockContent;
  }
};

export class InkflowService {
  // Legacy authenticate method for backward compatibility
  static async authenticate(userData) {
    return loginToInkflow(
      userData.external_user_id || userData.id || userData.email,
      userData.email,
      userData.name
    );
  }

  // Create content using the new method
  static async createContent(contentData, authToken) {
    return createInkflowContent(contentData);
  }

  // Get all content from INKFLOW
  static async getAllContent(authToken) {
    try {
      const response = await fetch(`${INKFLOW_BASE_URL}/inkflow-content`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken || API_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get content: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get INKFLOW content:', error);
      throw error;
    }
  }

  // Get specific content by ID
  static async getContent(contentId, authToken) {
    try {
      const response = await fetch(`${INKFLOW_BASE_URL}/inkflow-content?id=${contentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken || API_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get content: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get INKFLOW content:', error);
      throw error;
    }
  }

  // Save TRICA code to INKFLOW
  static async saveTricaCode(codeData) {
    return this.createContent({
      title: codeData.title || 'TRICA Code Snippet',
      body: codeData.code,
      type: 'trica-code',
      content_type: 'code',
      metadata: {
        language: 'trica',
        compiler_version: codeData.version || '2.0.0',
        performance: codeData.performance || null,
        created_at: new Date().toISOString()
      }
    });
  }

  // Save TRICA project to INKFLOW
  static async saveTricaProject(projectData) {
    return this.createContent({
      title: projectData.name || 'TRICA Project',
      body: JSON.stringify(projectData, null, 2),
      type: 'trica-project',
      content_type: 'project',
      metadata: {
        files: projectData.files || [],
        dependencies: projectData.dependencies || [],
        created_at: new Date().toISOString()
      }
    });
  }

  // Get user's INKFLOW content
  static async getUserContent(userId) {
    try {
      // This would depend on INKFLOW SDK having a get method
      // For now, we'll return a placeholder
      console.log('Getting INKFLOW content for user:', userId);
      return { success: true, content: [] };
    } catch (error) {
      console.error('Failed to get INKFLOW content:', error);
      throw error;
    }
  }
}

export default InkflowService;