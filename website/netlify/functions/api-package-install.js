/**
 * 📦 TRICA PACKAGE INSTALL API - Netlify Serverless Function 📦
 * POST /.netlify/functions/api-package-install
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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Method not allowed',
        message: '❌ Only POST requests are allowed'
      })
    };
  }

  try {
    const { packageName } = JSON.parse(event.body);

    if (!packageName) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Missing package name',
          message: '❌ Package name is required'
        })
      };
    }

    // Increment download count
    const { data, error } = await supabase
      .rpc('increment_downloads', { package_name: packageName });

    if (error) throw error;

    // Get updated package info
    const { data: packageData, error: fetchError } = await supabase
      .from('trica_packages')
      .select('*')
      .eq('name', packageName)
      .single();

    if (fetchError) throw fetchError;

    if (!packageData) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Package not found',
          message: `📦 Package '${packageName}' does not exist`
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        package: packageData,
        message: `📦 Package '${packageName}' download count updated`,
        installMessage: getInstallMessage(packageName, packageData.quantum_level)
      })
    };

  } catch (error) {
    console.error('Error updating download count:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to update download count',
        message: '❌ Database connection failed'
      })
    };
  }
};

function getInstallMessage(packageName, quantumLevel) {
  const messages = {
    'neural_networks': '🧠 Neural networks installed! Your consciousness is now quantum-enhanced.',
    'time_travel': '⏰ Time travel package installed! Temporal paradoxes are now your playground.',
    'quantum_computing': '⚛️ Quantum computing installed! Reality bending capabilities unlocked.',
    'mind_destruction': '🧠💥 ULTIMATE MIND DESTRUCTION INSTALLED! Welcome to the void.',
    'reality_bending': '🌀 Reality bending installed! Physics laws are now optional.'
  };

  const defaultMessage = `🔥 Package '${packageName}' installed successfully! Quantum level ${quantumLevel} capabilities unlocked.`;
  
  return messages[packageName] || defaultMessage;
}