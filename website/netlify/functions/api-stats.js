/**
 * 📊 TRICA STATS API - Netlify Serverless Function 📊
 * GET /.netlify/functions/api-stats
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
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Method not allowed',
        message: '❌ Only GET requests are allowed'
      })
    };
  }

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

    // Get average rating
    const { data: ratingData } = await supabase
      .from('reviews')
      .select('rating');

    const averageRating = ratingData?.length > 0 
      ? ratingData.reduce((sum, review) => sum + review.rating, 0) / ratingData.length 
      : 0;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        stats: {
          packages: packageCount || 0,
          reviews: reviewCount || 0,
          totalDownloads,
          averageRating: Math.round(averageRating * 10) / 10,
          version: '1.1.7',
          platform: 'Netlify Serverless Functions',
          features: [
            'Bytecode VM',
            'TPKG Package Manager',
            'Quantum Computing',
            'Time Travel',
            'Neural Networks',
            'Mind Destruction'
          ],
          mindDestructionStats: {
            totalMindsDestroyed: Math.floor(totalDownloads * 0.95), // 95% mind destruction rate
            quantumStatesGenerated: Math.floor(totalDownloads * 16),
            realityBendingEvents: Math.floor(totalDownloads * 0.42),
            temporalParadoxesResolved: Math.floor(totalDownloads * 0.13)
          }
        },
        message: '📊 Statistics fetched successfully'
      })
    };

  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to fetch statistics',
        message: '❌ Database connection failed'
      })
    };
  }
};