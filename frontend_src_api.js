// frontend/src/api.js
// Simple wrapper around fetch to include JWT and JSON handling.

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api';

function getAuthHeaders(token) {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

async function post(path, body, token) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: token ? getAuthHeaders(token) : { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, body: json };
  return json;
}

async function get(path, token) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'GET',
    headers: token ? getAuthHeaders(token) : { 'Content-Type': 'application/json' }
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, body: json };
  return json;
}

export default { post, get };