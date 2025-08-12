#!/usr/bin/env node
/**
 * 🔥 TRICA API SERVER 🔥
 * RESTful API for the mind-bending programming language
 * Provides endpoints for package management, code execution, and more
 */

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3001;

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: ['http://localhost:3000', 'https://trica.k2lang.org'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  }
});
app.use('/api/', limiter);

// API Routes

/**
 * 🔥 GET /api/status - API Health Check
 */
app.get('/api/status', (req, res) => {
  res.json({
    status: 'LEGENDARY',
    message: '🔥 TRICA API IS ONLINE AND READY TO DESTROY MINDS 🔥',
    version: '1.1.7',
    timestamp: new Date().toISOString(),
    features: [
      'Package Management',
      'Code Execution',
      'Review System',
      'User Authentication',
      'Real-time Updates'
    ]
  });
});

/**
 * 📦 GET /api/packages - List all TPKG packages
 */
app.get('/api/packages', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('trica_packages')
      .select('*')
      .order('downloads', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      packages: data || [],
      count: data?.length || 0,
      message: '📦 TPKG packages fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch packages',
      message: '❌ Database connection failed'
    });
  }
});

/**
 * 📦 GET /api/packages/:name - Get specific package
 */
app.get('/api/packages/:name', async (req, res) => {
  try {
    const { name } = req.params;
    
    const { data, error } = await supabase
      .from('trica_packages')
      .select('*')
      .eq('name', name)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Package not found',
        message: `📦 Package '${name}' does not exist`
      });
    }

    res.json({
      success: true,
      package: data,
      message: `📦 Package '${name}' fetched successfully`
    });
  } catch (error) {
    console.error('Error fetching package:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch package',
      message: '❌ Database connection failed'
    });
  }
});

/**
 * 📦 POST /api/packages - Publish new package
 */
app.post('/api/packages', async (req, res) => {
  try {
    const { name, version, description, author, quantum_level, code } = req.body;

    // Validation
    if (!name || !version || !description || !author || !code) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: '❌ name, version, description, author, and code are required'
      });
    }

    if (quantum_level && (quantum_level < 1 || quantum_level > 11)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid quantum level',
        message: '❌ Quantum level must be between 1 and 11'
      });
    }

    const { data, error } = await supabase
      .from('trica_packages')
      .insert([{
        name,
        version,
        description,
        author,
        quantum_level: quantum_level || 1,
        code,
        downloads: 0
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      package: data,
      message: `🚀 Package '${name}' published successfully!`
    });
  } catch (error) {
    console.error('Error publishing package:', error);
    
    if (error.code === '23505') { // Unique constraint violation
      return res.status(409).json({
        success: false,
        error: 'Package already exists',
        message: '❌ A package with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to publish package',
      message: '❌ Database connection failed'
    });
  }
});

/**
 * 📦 POST /api/packages/:name/install - Increment download count
 */
app.post('/api/packages/:name/install', async (req, res) => {
  try {
    const { name } = req.params;

    const { data, error } = await supabase
      .from('trica_packages')
      .update({ downloads: supabase.raw('downloads + 1') })
      .eq('name', name)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Package not found',
        message: `📦 Package '${name}' does not exist`
      });
    }

    res.json({
      success: true,
      package: data,
      message: `📦 Package '${name}' download count updated`
    });
  } catch (error) {
    console.error('Error updating download count:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update download count',
      message: '❌ Database connection failed'
    });
  }
});

/**
 * ⭐ GET /api/reviews - Get all reviews
 */
app.get('/api/reviews', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      reviews: data || [],
      count: data?.length || 0,
      message: '⭐ Reviews fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reviews',
      message: '❌ Database connection failed'
    });
  }
});

/**
 * ⭐ POST /api/reviews - Submit new review
 */
app.post('/api/reviews', async (req, res) => {
  try {
    const { name, rating, title, comment, mind_destroyed } = req.body;

    // Validation
    if (!name || !rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: '❌ name, rating, title, and comment are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Invalid rating',
        message: '❌ Rating must be between 1 and 5'
      });
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert([{
        name,
        rating,
        title,
        comment,
        mind_destroyed: mind_destroyed || false,
        likes: 0,
        dislikes: 0
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      review: data,
      message: '🎉 Review submitted successfully!'
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit review',
      message: '❌ Database connection failed'
    });
  }
});

/**
 * 🔥 POST /api/execute - Execute Trica code (simulation)
 */
app.post('/api/execute', (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'No code provided',
        message: '❌ Code is required for execution'
      });
    }

    // Simulate Trica execution
    const startTime = process.hrtime.bigint();
    
    // Simulate ultra-fast execution
    const executionTime = Math.random() * 0.001; // <1ms
    
    const endTime = process.hrtime.bigint();
    const actualTime = Number(endTime - startTime) / 1000000; // Convert to ms

    // Generate simulated output based on code content
    let output = '';
    if (code.includes('Print')) {
      const printMatches = code.match(/Print\s+"([^"]+)"/g);
      if (printMatches) {
        output = printMatches.map(match => 
          match.replace(/Print\s+"([^"]+)"/, '$1')
        ).join('\n');
      }
    } else {
      output = '🔥 TRICA BYTECODE EXECUTION COMPLETE 🔥\n✅ Mind destruction successful!';
    }

    res.json({
      success: true,
      output,
      executionTime: `${executionTime.toFixed(3)}ms`,
      actualResponseTime: `${actualTime.toFixed(3)}ms`,
      message: '🔥 Code executed successfully',
      stats: {
        bytecodeInstructions: Math.floor(Math.random() * 100) + 10,
        memoryUsed: `${Math.floor(Math.random() * 512) + 64}KB`,
        quantumStates: Math.floor(Math.random() * 16) + 1
      }
    });
  } catch (error) {
    console.error('Error executing code:', error);
    res.status(500).json({
      success: false,
      error: 'Execution failed',
      message: '❌ Code execution failed'
    });
  }
});

/**
 * 📊 GET /api/stats - Get Trica statistics
 */
app.get('/api/stats', async (req, res) => {
  try {
    // Get package count
    const { count: packageCount } = await supabase
      .from('trica_packages')
      .select('*', { count: 'exact', head: true });

    // Get review count
    const { count: reviewCount } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true });

    // Get total downloads
    const { data: downloadData } = await supabase
      .from('trica_packages')
      .select('downloads');

    const totalDownloads = downloadData?.reduce((sum, pkg) => sum + (pkg.downloads || 0), 0) || 0;

    res.json({
      success: true,
      stats: {
        packages: packageCount || 0,
        reviews: reviewCount || 0,
        totalDownloads,
        version: '1.1.7',
        features: [
          'Bytecode VM',
          'TPKG Package Manager',
          'Quantum Computing',
          'Time Travel',
          'Neural Networks',
          'Mind Destruction'
        ]
      },
      message: '📊 Statistics fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      message: '❌ Database connection failed'
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: '❌ The requested API endpoint does not exist',
    availableEndpoints: [
      'GET /api/status',
      'GET /api/packages',
      'GET /api/packages/:name',
      'POST /api/packages',
      'POST /api/packages/:name/install',
      'GET /api/reviews',
      'POST /api/reviews',
      'POST /api/execute',
      'GET /api/stats'
    ]
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('API Error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: '❌ Something went wrong on the server'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🔥 TRICA API SERVER ONLINE 🔥`);
  console.log(`🌐 Server running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api/`);
  console.log(`🚀 Ready to serve mind-bending requests!`);
});

module.exports = app;