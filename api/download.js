import axios from 'axios';

export default async function handler(request, response) {
  const { url, server } = request.query;

  if (!url || !server) {
    return response.status(400).json({ error: 'URL and server are required' });
  }

  // Set CORS headers to allow requests from your Vercel deployment
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests for CORS
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  try {
    const apiResponse = await axios.get(`https://${server}-api.vercel.app/download`, {
      params: { url },
    });

    return response.status(200).json(apiResponse.data);
  } catch (error) {
    console.error('API proxy error:', error);
    const statusCode = error.response ? error.response.status : 500;
    const errorMessage = error.response ? error.response.data : 'Internal Server Error';
    return response.status(statusCode).json({ error: errorMessage });
  }
}