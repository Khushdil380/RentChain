export function getApiBase() {
  let api = (process.env.REACT_APP_API_BASE || '').replace(/\/$/, '');
  if (!api) {
    try {
      const { protocol, hostname, port } = window.location;
      const isHttp = protocol === 'http:' || protocol === 'https:';
      const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
      if (isHttp) {
        if (isLocal && port !== '5001') return `${protocol}//localhost:5001`;
        return `${protocol}//${hostname}${port ? ':' + port : ''}`;
      }
    } catch {}
  }
  return api || 'http://localhost:5001';
}
