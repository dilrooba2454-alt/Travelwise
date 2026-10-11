/**
 * Vercel Serverless Function: GET /api/app-config
 * Returns application configuration, branding, and status in production.
 */
export default function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  res.status(200).json({
    appName: 'TravelWise',
    tagline: 'Plan · Book · Explore',
    heading: 'Your Next Adventure Starts Here',
    description: 'Find the best hotels, transport options and plan your perfect trip — all in one place.',
    version: '1.0.0',
    status: 'online',
    environment: 'vercel-serverless'
  });
}
