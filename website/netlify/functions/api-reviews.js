/**
 * ⭐ TRICA REVIEWS API - Netlify Serverless Function ⭐
 * GET/POST /.netlify/functions/api-reviews
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
      // Get all reviews
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          reviews: data || [],
          count: data?.length || 0,
          message: '⭐ Reviews fetched successfully'
        })
      };

    } else if (event.httpMethod === 'POST') {
      // Submit new review
      const { name, rating, title, comment, mind_destroyed } = JSON.parse(event.body);

      // Validation
      if (!name || !rating || !title || !comment) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Missing required fields',
            message: '❌ name, rating, title, and comment are required'
          })
        };
      }

      if (rating < 1 || rating > 5) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Invalid rating',
            message: '❌ Rating must be between 1 and 5'
          })
        };
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

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          review: data,
          message: '🎉 Review submitted successfully!'
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
    console.error('Error in reviews API:', error);
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