export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const API_URL = import.meta.env.VITE_API_URL || "";

  // Asegura que SIEMPRE empiece con /api
  const finalEndpoint = endpoint.startsWith("/api")
    ? endpoint
    : `/api/${endpoint.replace(/^\/+/, "")}`;

  const cleanBase = API_URL.replace(/\/+$/, "");
  const url = `${cleanBase}${finalEndpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Error desconocido");
    throw new Error(errorText);
  }

  return res.json();
}
