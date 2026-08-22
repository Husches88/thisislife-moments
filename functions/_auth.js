
const COOKIE = "tl_admin";
const encoder = new TextEncoder();

async function digest(value) {
  const data = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return [...new Uint8Array(data)].map(b => b.toString(16).padStart(2,"0")).join("");
}

async function makeSession(env) {
  return digest(env.ADMIN_PASSWORD + "::THIS-IS-LIFE");
}

async function isAuthorized(request, env) {
  if (!env.ADMIN_PASSWORD) return false;
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(new RegExp(COOKIE + "=([^;]+)"));
  if (!match) return false;
  return (await digest(env.ADMIN_PASSWORD + "::THIS-IS-LIFE")) === match[1];
}

export { makeSession, isAuthorized };
