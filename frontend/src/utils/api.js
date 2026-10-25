const API_BASE = '/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('hos_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

export const api = {
  get(path) {
    return request(path, { method: 'GET' });
  },
  post(path, body) {
    return request(path, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
  put(path, body) {
    return request(path, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },
  delete(path) {
    return request(path, { method: 'DELETE' });
  },
};

export default api;
