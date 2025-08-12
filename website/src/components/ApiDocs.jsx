import React, { useState } from 'react';
import { 
  Code, 
  Server, 
  Zap, 
  Database, 
  Globe, 
  Copy, 
  CheckCircle,
  ExternalLink,
  Play,
  Package,
  Star,
  BarChart3
} from 'lucide-react';
import './ApiDocs.css';

const ApiDocs = () => {
  const [copiedEndpoint, setCopiedEndpoint] = useState(null);

  const copyToClipboard = (text, endpoint) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const endpoints = [
    {
      method: 'GET',
      path: '/api/status',
      title: 'API Status',
      description: 'Check API health and version information',
      icon: <Server size={20} />,
      example: `curl -X GET https://trica.k2lang.org/api/status`,
      response: {
        status: 'LEGENDARY',
        message: '🔥 TRICA API IS ONLINE AND READY TO DESTROY MINDS 🔥',
        version: '1.1.7',
        platform: 'Netlify Serverless Functions',
        features: ['Package Management', 'Code Execution', 'Review System']
      }
    },
    {
      method: 'GET',
      path: '/api/packages',
      title: 'List Packages',
      description: 'Get all TPKG packages from the registry',
      icon: <Package size={20} />,
      example: `curl -X GET https://trica.k2lang.org/api/packages`,
      response: {
        success: true,
        packages: [
          {
            id: 1,
            name: 'neural_networks',
            version: '2.1.0',
            description: 'Advanced neural networks with quantum neurons',
            author: 'Trica AI Team',
            quantum_level: 8,
            downloads: 1337
          }
        ],
        count: 1
      }
    },
    {
      method: 'POST',
      path: '/api/packages',
      title: 'Publish Package',
      description: 'Publish a new TPKG package to the registry',
      icon: <Package size={20} />,
      example: `curl -X POST https://trica.k2lang.org/api/packages \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "my_package",
    "version": "1.0.0",
    "description": "My awesome Trica package",
    "author": "Your Name",
    "quantum_level": 5,
    "code": "Main { Print \\"Hello, Trica!\\" }"
  }'`,
      response: {
        success: true,
        package: {
          id: 2,
          name: 'my_package',
          version: '1.0.0',
          downloads: 0
        },
        message: "🚀 Package 'my_package' published successfully!"
      }
    },
    {
      method: 'POST',
      path: '/api/packages/install',
      title: 'Install Package',
      description: 'Increment download count for a package',
      icon: <Package size={20} />,
      example: `curl -X POST https://trica.k2lang.org/api/packages/install \\
  -H "Content-Type: application/json" \\
  -d '{"packageName": "neural_networks"}'`,
      response: {
        success: true,
        message: "📦 Package 'neural_networks' download count updated",
        installMessage: '🧠 Neural networks installed! Your consciousness is now quantum-enhanced.'
      }
    },
    {
      method: 'GET',
      path: '/api/reviews',
      title: 'Get Reviews',
      description: 'Fetch all user reviews and ratings',
      icon: <Star size={20} />,
      example: `curl -X GET https://trica.k2lang.org/api/reviews`,
      response: {
        success: true,
        reviews: [
          {
            id: 1,
            name: 'John Doe',
            rating: 5,
            title: 'Mind Destroyed!',
            comment: 'This language literally broke my understanding of programming.',
            mind_destroyed: true,
            likes: 42,
            dislikes: 0
          }
        ],
        count: 1
      }
    },
    {
      method: 'POST',
      path: '/api/reviews',
      title: 'Submit Review',
      description: 'Submit a new review and rating',
      icon: <Star size={20} />,
      example: `curl -X POST https://trica.k2lang.org/api/reviews \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Jane Smith",
    "rating": 5,
    "title": "Absolutely Mind-Bending!",
    "comment": "Trica has completely changed how I think about programming.",
    "mind_destroyed": true
  }'`,
      response: {
        success: true,
        review: {
          id: 2,
          name: 'Jane Smith',
          rating: 5,
          likes: 0,
          dislikes: 0
        },
        message: '🎉 Review submitted successfully!'
      }
    },
    {
      method: 'POST',
      path: '/api/execute',
      title: 'Execute Code',
      description: 'Execute Trica code and get results',
      icon: <Play size={20} />,
      example: `curl -X POST https://trica.k2lang.org/api/execute \\
  -H "Content-Type: application/json" \\
  -d '{"code": "Main { Print \\"Hello, World!\\" }"}'`,
      response: {
        success: true,
        output: 'Hello, World!',
        executionTime: '0.001ms',
        stats: {
          bytecodeInstructions: 42,
          memoryUsed: '128KB',
          quantumStates: 8,
          mindDestructionLevel: 5
        }
      }
    },
    {
      method: 'GET',
      path: '/api/stats',
      title: 'Get Statistics',
      description: 'Get platform statistics and metrics',
      icon: <BarChart3 size={20} />,
      example: `curl -X GET https://trica.k2lang.org/api/stats`,
      response: {
        success: true,
        stats: {
          packages: 5,
          reviews: 12,
          totalDownloads: 3456,
          averageRating: 4.8,
          mindDestructionStats: {
            totalMindsDestroyed: 3283,
            quantumStatesGenerated: 55296,
            realityBendingEvents: 1451
          }
        }
      }
    }
  ];

  return (
    <div className="api-docs">
      <div className="container">
        <div className="api-docs-header">
          <div className="section-badge">
            <Code size={16} />
            <span>API Documentation</span>
          </div>
          
          <h1 className="section-title">
            <span className="text-gradient">Trica API</span> Reference
          </h1>
          
          <p className="section-description">
            RESTful API endpoints for the mind-bending Trica programming language.
            Built with <strong>Netlify Serverless Functions</strong> and <strong>Supabase</strong>.
          </p>

          <div className="api-features">
            <div className="feature-item">
              <Zap className="feature-icon" />
              <span>Ultra-fast serverless execution</span>
            </div>
            <div className="feature-item">
              <Database className="feature-icon" />
              <span>Real-time Supabase integration</span>
            </div>
            <div className="feature-item">
              <Globe className="feature-icon" />
              <span>Global CDN distribution</span>
            </div>
          </div>
        </div>

        <div className="base-url-section">
          <h3>Base URL</h3>
          <div className="code-block">
            <code>https://trica.k2lang.org</code>
            <button 
              className="copy-btn"
              onClick={() => copyToClipboard('https://trica.k2lang.org', 'base-url')}
            >
              {copiedEndpoint === 'base-url' ? <CheckCircle size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <div className="performance-badge">
            <Zap className="perf-icon" />
            <span>⚡ <strong>&lt;600μs</strong> response times guaranteed!</span>
          </div>
        </div>

        <div className="endpoints-section">
          <h3>API Endpoints</h3>
          
          {endpoints.map((endpoint, index) => (
            <div key={index} className="endpoint-card">
              <div className="endpoint-header">
                <div className="endpoint-info">
                  <div className="endpoint-icon">
                    {endpoint.icon}
                  </div>
                  <div className="endpoint-details">
                    <div className="endpoint-title">
                      <span className={`method-badge ${endpoint.method.toLowerCase()}`}>
                        {endpoint.method}
                      </span>
                      <span className="endpoint-path">{endpoint.path}</span>
                    </div>
                    <h4>{endpoint.title}</h4>
                    <p>{endpoint.description}</p>
                  </div>
                </div>
              </div>

              <div className="endpoint-content">
                <div className="example-section">
                  <h5>Example Request</h5>
                  <div className="code-block">
                    <pre><code>{endpoint.example}</code></pre>
                    <button 
                      className="copy-btn"
                      onClick={() => copyToClipboard(endpoint.example, `example-${index}`)}
                    >
                      {copiedEndpoint === `example-${index}` ? <CheckCircle size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                <div className="response-section">
                  <h5>Example Response</h5>
                  <div className="code-block">
                    <pre><code>{JSON.stringify(endpoint.response, null, 2)}</code></pre>
                    <button 
                      className="copy-btn"
                      onClick={() => copyToClipboard(JSON.stringify(endpoint.response, null, 2), `response-${index}`)}
                    >
                      {copiedEndpoint === `response-${index}` ? <CheckCircle size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="deployment-section">
          <h3>🚀 Deployment Information</h3>
          <div className="deployment-info">
            <div className="deployment-item">
              <strong>Platform:</strong> Netlify Serverless Functions
            </div>
            <div className="deployment-item">
              <strong>Database:</strong> Supabase PostgreSQL
            </div>
            <div className="deployment-item">
              <strong>Authentication:</strong> Public API (no auth required)
            </div>
            <div className="deployment-item">
              <strong>Rate Limiting:</strong> Handled by Netlify
            </div>
            <div className="deployment-item">
              <strong>CORS:</strong> Enabled for all origins
            </div>
          </div>
        </div>

        <div className="environment-section">
          <h3>🔧 Environment Variables</h3>
          <p>Set these in your Netlify dashboard:</p>
          <div className="env-vars">
            <div className="env-var">
              <code>SUPABASE_URL</code>
              <span>Your Supabase project URL</span>
            </div>
            <div className="env-var">
              <code>SUPABASE_ANON_KEY</code>
              <span>Your Supabase anonymous key</span>
            </div>
          </div>
        </div>

        <div className="error-handling-section">
          <h3>❌ Error Handling</h3>
          <p>All API responses follow this format:</p>
          
          <div className="error-examples">
            <div className="error-example">
              <h5>Success Response</h5>
              <div className="code-block">
                <pre><code>{JSON.stringify({
                  success: true,
                  data: {},
                  message: "Operation completed successfully"
                }, null, 2)}</code></pre>
              </div>
            </div>

            <div className="error-example">
              <h5>Error Response</h5>
              <div className="code-block">
                <pre><code>{JSON.stringify({
                  success: false,
                  error: "Error type",
                  message: "Human-readable error message"
                }, null, 2)}</code></pre>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-links">
          <a href="https://github.com/trica-lang/trica" className="footer-link">
            <ExternalLink size={16} />
            View Source Code
          </a>
          <a href="#download" className="footer-link">
            <Package size={16} />
            Download Trica
          </a>
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;