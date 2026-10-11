/**
 * Vercel Serverless Function: GET /api
 * Root API overview and endpoint discovery.
 */
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    name: 'TravelWise API',
    status: 'online',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      appConfig: '/api/app-config'
    }
  });
}
