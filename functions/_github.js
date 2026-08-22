
const apiBase = "https://api.github.com";

function config(env) {
  if (!env.GITHUB_TOKEN || !env.GITHUB_OWNER || !env.GITHUB_REPO) {
    throw new Error("GitHub-Konfiguration fehlt");
  }
  return {
    token: env.GITHUB_TOKEN,
    owner: env.GITHUB_OWNER,
    repo: env.GITHUB_REPO,
    branch: env.GITHUB_BRANCH || "main"
  };
}

async function githubRequest(path, env, options = {}) {
  const c = config(env);
  const res = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: {
      "Accept": "application/vnd.github+json",
      "Authorization": `Bearer ${c.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers || {})
    }
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  if (!res.ok) {
    throw new Error(data.message || `GitHub API Fehler ${res.status}`);
  }
  return data;
}

async function getFile(path, env) {
  const c = config(env);
  return githubRequest(`/repos/${c.owner}/${c.repo}/contents/${path}?ref=${encodeURIComponent(c.branch)}`, env);
}

async function putFile(path, contentBase64, message, sha, env) {
  const c = config(env);
  return githubRequest(`/repos/${c.owner}/${c.repo}/contents/${path}`, env, {
    method: "PUT",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      message,
      content: contentBase64,
      branch: c.branch,
      ...(sha ? {sha} : {})
    })
  });
}

export { config, githubRequest, getFile, putFile };
