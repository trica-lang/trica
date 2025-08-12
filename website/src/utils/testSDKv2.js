// Test INKFLOW SDK v2.0.0 integration
import { InkflowClient } from 'inkflow-sdk';

const API_KEY = 'ik_RcpjFTsCE2pFbrU5QAUPg8l5lLRQBb';
const BASE_URL = 'https://ihryuknhmtxcfqsfddtz.supabase.co';

export const testSDKv2 = async () => {
  console.log('🧪 Testing INKFLOW SDK v2.0.0');
  console.log('🔑 API Key:', API_KEY);
  console.log('🌐 Base URL:', BASE_URL);
  
  try {
    // Initialize client
    const client = new InkflowClient({
      apiKey: API_KEY,
      baseUrl: BASE_URL
    });
    
    console.log('✅ Client initialized');
    console.log('📊 Client config:', client.getConfig());
    console.log('📦 SDK version:', client.getVersion());
    
    // Test 1: Ping API
    console.log('\n🔍 Test 1: API Ping');
    const pingResult = await client.ping();
    console.log('🏓 Ping result:', pingResult);
    
    // Test 2: Authentication
    console.log('\n🔍 Test 2: Authentication');
    const authResult = await client.auth.authenticate({
      external_user_id: 'test_user_v2',
      email: 'test@trica.dev',
      display_name: 'Test User v2.0.0',
      metadata: {
        source: 'trica',
        test_version: '2.0.0',
        timestamp: new Date().toISOString()
      }
    });
    
    console.log('🔐 Auth result:', authResult);
    
    if (authResult.success) {
      console.log('✅ Authentication successful!');
      console.log('👤 User:', authResult.user);
      console.log('🎫 Token:', authResult.token);
      
      // Test 3: Session verification
      console.log('\n🔍 Test 3: Session Verification');
      const user = await client.auth.verifySession(authResult.token);
      console.log('👤 Verified user:', user);
      
      // Test 4: Content creation
      console.log('\n🔍 Test 4: Content Creation');
      const content = await client.content.create({
        title: 'TRICA Test Content v2.0.0',
        content: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'This is a test content created with INKFLOW SDK v2.0.0 from TRICA!'
                }
              ]
            }
          ]
        },
        content_type: 'trica-test',
        metadata: {
          source: 'trica',
          test: true,
          version: '2.0.0',
          performance: 'sub-400ns'
        }
      }, authResult.user.external_user_id);
      
      console.log('📝 Content created:', content);
      
      if (content && content.id) {
        // Test 5: Get content
        console.log('\n🔍 Test 5: Get Content');
        const retrievedContent = await client.content.get(content.id);
        console.log('📖 Retrieved content:', retrievedContent);
        
        // Test 6: Update content
        console.log('\n🔍 Test 6: Update Content');
        const updatedContent = await client.content.update(content.id, {
          title: 'TRICA Test Content v2.0.0 - UPDATED',
          metadata: {
            source: 'trica',
            test: true,
            version: '2.0.0',
            updated: true,
            updated_at: new Date().toISOString()
          }
        });
        console.log('✏️ Updated content:', updatedContent);
        
        // Test 7: List content
        console.log('\n🔍 Test 7: List Content');
        const contentList = await client.content.list({
          page: 1,
          limit: 5
        });
        console.log('📚 Content list:', contentList);
      }
      
      console.log('\n🎉 All tests completed successfully!');
      return {
        success: true,
        client,
        authResult,
        content
      };
      
    } else {
      console.log('❌ Authentication failed:', authResult.error);
      return {
        success: false,
        error: authResult.error
      };
    }
    
  } catch (error) {
    console.error('❌ SDK v2.0.0 test failed:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return {
      success: false,
      error: error.message
    };
  }
};

// Blog app example using v2.0.0
export class TricaBlogApp {
  constructor(apiKey) {
    this.client = new InkflowClient({ 
      apiKey,
      baseUrl: BASE_URL
    });
    this.currentUser = null;
    this.sessionToken = null;
  }

  // Login user
  async login(userId, email, displayName) {
    try {
      console.log('🔄 TricaBlogApp: Logging in user');
      
      const result = await this.client.auth.authenticate({
        external_user_id: userId,
        email,
        display_name: displayName,
        metadata: {
          source: 'trica',
          login_time: new Date().toISOString()
        }
      });

      if (result.success) {
        this.currentUser = result.user;
        this.sessionToken = result.token;
        console.log('✅ TricaBlogApp: Login successful');
        return true;
      } else {
        console.error('❌ TricaBlogApp: Login failed:', result.error);
        return false;
      }
    } catch (error) {
      console.error('❌ TricaBlogApp: Login error:', error);
      return false;
    }
  }

  // Create a TRICA code post
  async createTricaPost(title, code, tags = []) {
    if (!this.currentUser) {
      throw new Error('User must be logged in to create posts');
    }

    try {
      const post = await this.client.content.create({
        title,
        content: {
          type: 'doc',
          content: [
            {
              type: 'code_block',
              attrs: { language: 'trica' },
              content: [{ type: 'text', text: code }]
            }
          ]
        },
        content_type: 'trica_code',
        metadata: {
          tags,
          language: 'trica',
          author: this.currentUser.display_name,
          created_by: this.currentUser.external_user_id,
          performance: 'sub-400ns'
        }
      }, this.currentUser.external_user_id);

      console.log('✅ TRICA post created:', post.title);
      return post;
    } catch (error) {
      console.error('❌ Failed to create TRICA post:', error);
      throw error;
    }
  }

  // Get all TRICA posts
  async getAllTricaPosts() {
    try {
      const result = await this.client.content.list({
        page: 1,
        limit: 50
      });

      const tricaPosts = result.data.filter(post => 
        post.content_type === 'trica_code' || 
        post.metadata?.language === 'trica'
      );

      console.log(`📚 Found ${tricaPosts.length} TRICA posts`);
      return tricaPosts;
    } catch (error) {
      console.error('❌ Failed to get TRICA posts:', error);
      return [];
    }
  }

  // Test API connection
  async testConnection() {
    const isConnected = await this.client.ping();
    console.log(isConnected ? '✅ API connection successful' : '❌ API connection failed');
    return isConnected;
  }
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  window.testSDKv2 = testSDKv2;
  window.TricaBlogApp = TricaBlogApp;
  console.log('🔧 SDK v2.0.0 tests available:');
  console.log('  - window.testSDKv2()');
  console.log('  - new window.TricaBlogApp("your-api-key")');
}