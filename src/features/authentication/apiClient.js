const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function authFetch(getAccessToken, path, options = {}) {
  const token = await getAccessToken();

  const resp = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    const err = new Error(`API error ${resp.status}: ${text}`);
    err.status = resp.status;
    throw err;
  }

  // 你也可以按需处理非 json
  return resp.json();
}
