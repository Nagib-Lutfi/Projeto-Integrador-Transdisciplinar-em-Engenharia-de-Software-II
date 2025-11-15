const API = (path, opts = {}) => {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000'; // API URL backend
  const isFormData = opts && opts.body && typeof FormData !== 'undefined' && opts.body instanceof FormData;
  const headers = isFormData ? undefined : { 'Content-Type': 'application/json' };
  return fetch(base + path, { headers, ...opts }).then((r) => r.json());
};

export default API;
