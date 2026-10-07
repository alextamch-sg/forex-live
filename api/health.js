/**
 * Health check monitor for Monetary Straits APIs
 * Supports Vercel Serverless Functions and local Node/Vite environments
 */

export default async function handler(req, res) {
  // Set CORS and JSON headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  const masApiKey = process.env.MAS_API_KEY || '';
  const isMasKeyConfigured = Boolean(masApiKey && masApiKey.trim().length > 0);

  const healthData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Monetary Straits Treasury API',
    version: '1.0.0',
    uptime: process.uptime ? Math.floor(process.uptime()) : 0,
    checks: {
      health: 'UP',
      mas_api_configured: isMasKeyConfigured,
      mas_api_url:
        'https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610ora/exchange_rates_end_of_period_daily/views/exchange_rates_end_of_period_daily',
      endpoints: {
        health: '/api/health',
        forex: '/api/forex',
      },
    },
  };

  res.statusCode = 200;
  res.end(JSON.stringify(healthData, null, 2));
}
