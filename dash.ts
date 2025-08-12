import InkflowClient from 'inkflow-sdk';

async function run() {
  const client = new InkflowClient({ apiKey: 'ik_RcpjFTsCE2pFbrU5QAUPg8l5lLRQBb' });

  try {
    // Authenticate user
    const authResponse = await client.auth.authenticate({
      external_user_id: 'user123',
      email: 'user@example.com',
    });
    console.log('Auth success:', authResponse);

    // Create content
    const contentResponse = await client.content.create({
      title: 'My Article',
      content: { body: 'Article content...' },
      content_type: 'article',
    });
    console.log('Content created:', contentResponse);

  } catch (error) {
    console.error('API call failed:', error);
  }
}

run();
