export const config = { runtime: 'edge' };

export default async function handler(req) {
  const origin = req.headers.get('origin') || '*';
  const cors = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors });
  }

  const { searchParams } = new URL(req.url);
  const path = searchParams.get('path');
  const qs = searchParams.get('qs') || '';
  const base = searchParams.get('base') || 'https://site.api.espn.com/apis/site/v2/sports';

  if (!path) {
    return new Response(JSON.stringify({ error: 'Missing path param' }), {
      status: 400, headers: { ...cors, 'Content-Type': 'application/json' }
    });
  }

  const espnUrl = `${base}${path}${qs ? '?' + qs : ''}`;

  try {
    const r = await fetch(espnUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const data = await r.text();
    return new Response(data, {
      status: r.status,
      headers: { ...cors, 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...cors, 'Content-Type': 'application/json' }
    });
  }
}
