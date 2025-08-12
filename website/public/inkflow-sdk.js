/**
 * INKFLOW SDK - Bundled Version
 * A JavaScript SDK for integrating with INKFLOW content management
 * 
 * Usage:
 * <script src="https://yourdomain.com/inkflow-sdk.js"></script>
 * <script>
 *   const inkflow = new InkflowClient({
 *     apiKey: 'your-api-key',
 *     baseUrl: 'https://your-inkflow-instance.supabase.co'
 *   });
 * </script>
 */

(function(global) {
  'use strict';

  // Types and interfaces (for documentation)
  const INKFLOW_TYPES = {
    InkflowConfig: {
      apiKey: 'string',
      baseUrl: 'string (optional)'
    },
    AuthResponse: {
      success: 'boolean',
      user: 'ExternalUser (optional)',
      token: 'string (optional)',
      error: 'string (optional)'
    },
    ExternalUser: {
      id: 'string',
      external_user_id: 'string',
      email: 'string (optional)',
      display_name: 'string (optional)',
      avatar_url: 'string (optional)',
      metadata: 'object (optional)',
      created_at: 'string',
      updated_at: 'string'
    },
    ContentItem: {
      id: 'string',
      title: 'string (optional)',
      content: 'object',
      content_type: 'string',
      slug: 'string (optional)',
      is_published: 'boolean',
      metadata: 'object (optional)',
      created_at: 'string',
      updated_at: 'string',
      external_user_id: 'string (optional)'
    }
  };

  // InkflowAuth class
  class InkflowAuth {
    constructor(apiKey, baseUrl) {
      this.apiKey = apiKey;
      this.baseUrl = baseUrl;
    }

    /**
     * Authenticate a user with your external system
     */
    async authenticate(userData) {
      try {
        const response = await fetch(`${this.baseUrl}/functions/v1/inkflow-auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'apikey': this.apiKey
          },
          body: JSON.stringify({
            action: 'authenticate',
            ...userData
          })
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Authentication failed: ${error}`);
        }

        return await response.json();
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Authentication failed'
        };
      }
    }

    /**
     * Get user information
     */
    async getUser(external_user_id) {
      try {
        const response = await fetch(`${this.baseUrl}/functions/v1/inkflow-auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'apikey': this.apiKey
          },
          body: JSON.stringify({
            action: 'get_user',
            external_user_id
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to get user: ${response.statusText}`);
        }

        const result = await response.json();
        return result.user || null;
      } catch (error) {
        console.error('Error getting user:', error);
        return null;
      }
    }

    /**
     * Update user information
     */
    async updateUser(external_user_id, updates) {
      try {
        const response = await fetch(`${this.baseUrl}/functions/v1/inkflow-auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'apikey': this.apiKey
          },
          body: JSON.stringify({
            action: 'update_user',
            external_user_id,
            ...updates
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to update user: ${response.statusText}`);
        }

        const result = await response.json();
        return result.user || null;
      } catch (error) {
        console.error('Error updating user:', error);
        return null;
      }
    }
  }

  // InkflowContent class
  class InkflowContent {
    constructor(apiKey, baseUrl) {
      this.apiKey = apiKey;
      this.baseUrl = baseUrl;
    }

    /**
     * Create new content
     */
    async create(content, external_user_id) {
      try {
        const response = await fetch(`${this.baseUrl}/functions/v1/inkflow-content`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'apikey': this.apiKey
          },
          body: JSON.stringify({
            action: 'create',
            external_user_id,
            ...content
          })
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Failed to create content: ${error}`);
        }

        const result = await response.json();
        return result.content;
      } catch (error) {
        throw new Error(`Content creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    /**
     * Get content by ID
     */
    async get(id) {
      try {
        const response = await fetch(`${this.baseUrl}/functions/v1/inkflow-content`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'apikey': this.apiKey
          },
          body: JSON.stringify({
            action: 'get',
            id
          })
        });

        if (!response.ok) {
          if (response.status === 404) {
            return null;
          }
          throw new Error(`Failed to get content: ${response.statusText}`);
        }

        const result = await response.json();
        return result.content || null;
      } catch (error) {
        console.error('Error getting content:', error);
        return null;
      }
    }

    /**
     * List content with pagination
     */
    async list(options = {}) {
      try {
        const response = await fetch(`${this.baseUrl}/functions/v1/inkflow-content`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'apikey': this.apiKey
          },
          body: JSON.stringify({
            action: 'list',
            ...options
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to list content: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        throw new Error(`Content listing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    /**
     * Update content
     */
    async update(id, updates, external_user_id) {
      try {
        const response = await fetch(`${this.baseUrl}/functions/v1/inkflow-content`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'apikey': this.apiKey
          },
          body: JSON.stringify({
            action: 'update',
            id,
            external_user_id,
            ...updates
          })
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Failed to update content: ${error}`);
        }

        const result = await response.json();
        return result.content;
      } catch (error) {
        throw new Error(`Content update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    /**
     * Delete content
     */
    async delete(id, external_user_id) {
      try {
        const response = await fetch(`${this.baseUrl}/functions/v1/inkflow-content`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'apikey': this.apiKey
          },
          body: JSON.stringify({
            action: 'delete',
            id,
            external_user_id
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to delete content: ${response.statusText}`);
        }

        return true;
      } catch (error) {
        console.error('Error deleting content:', error);
        return false;
      }
    }
  }

  // Main InkflowClient class
  class InkflowClient {
    constructor(config) {
      if (!config || !config.apiKey) {
        throw new Error('INKFLOW API key is required');
      }

      this.apiKey = config.apiKey;
      this.baseUrl = config.baseUrl || 'https://api.inkflow.dev';
      
      // Initialize auth and content modules
      this.auth = new InkflowAuth(this.apiKey, this.baseUrl);
      this.content = new InkflowContent(this.apiKey, this.baseUrl);
    }

    /**
     * Test API connectivity
     */
    async ping() {
      try {
        const response = await fetch(`${this.baseUrl}/functions/v1/inkflow-auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'apikey': this.apiKey
          },
          body: JSON.stringify({
            action: 'ping'
          })
        });

        return response.ok;
      } catch (error) {
        console.error('INKFLOW ping failed:', error);
        return false;
      }
    }

    /**
     * Get SDK version
     */
    getVersion() {
      return '1.0.0';
    }

    /**
     * Get configuration
     */
    getConfig() {
      return {
        apiKey: this.apiKey.substring(0, 8) + '...',
        baseUrl: this.baseUrl
      };
    }
  }

  // Export for different module systems
  if (typeof module !== 'undefined' && module.exports) {
    // CommonJS
    module.exports = {
      InkflowClient,
      InkflowAuth,
      InkflowContent,
      INKFLOW_TYPES
    };
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(function() {
      return {
        InkflowClient,
        InkflowAuth,
        InkflowContent,
        INKFLOW_TYPES
      };
    });
  } else {
    // Browser globals
    global.InkflowClient = InkflowClient;
    global.InkflowAuth = InkflowAuth;
    global.InkflowContent = InkflowContent;
    global.INKFLOW_TYPES = INKFLOW_TYPES;
  }

  // Log successful load
  console.log('✅ INKFLOW SDK loaded successfully');
  console.log('📚 Usage: const inkflow = new InkflowClient({ apiKey: "your-key", baseUrl: "your-url" });');

})(typeof window !== 'undefined' ? window : this);