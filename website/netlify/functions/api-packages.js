/**
 * 📦 TRICA PACKAGES API - Netlify Serverless Function 📦
 * GET/POST /.netlify/functions/api-packages
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    if (event.httpMethod === 'GET') {
      // List all packages
      const { data, error } = await supabase
        .from('trica_packages')
        .select('*')
        .order('downloads', { ascending: false });

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          packages: data || [],
          count: data?.length || 0,
          message: '📦 TPKG packages fetched successfully'
        })
      };

    } else if (event.httpMethod === 'POST') {
      // Publish new package
      const { name, version, description, author, quantum_level, code } = JSON.parse(event.body);

      // Validation
      if (!name || !version || !description || !author || !code) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Missing required fields',
            message: '❌ name, version, description, author, and code are required'
          })
        };
      }

      if (quantum_level && (quantum_level < 1 || quantum_level > 11)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Invalid quantum level',
            message: '❌ Quantum level must be between 1 and 11'
          })
        };
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

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          return {
            statusCode: 409,
            headers,
            body: JSON.stringify({
              success: false,
              error: 'Package already exists',
              message: '❌ A package with this name already exists'
            })
          };
        }
        throw error;
      }

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          package: data,
          message: `🚀 Package '${name}' published successfully!`
        })
      };

    } else {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Method not allowed',
          message: '❌ Only GET and POST requests are allowed'
        })
      };
    }

  } catch (error) {
    console.error('Error in packages API:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: '❌ Database connection failed'
      })
    };
  }
};