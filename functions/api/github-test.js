export async function onRequestGet({ env }) {
  const result = {
    config: {
      owner: env.GITHUB_OWNER || null,
      repo: env.GITHUB_REPO || null,
      branch: env.GITHUB_BRANCH || "main",
      tokenPresent: !!env.GITHUB_TOKEN,
      tokenLength: env.GITHUB_TOKEN ? env.GITHUB_TOKEN.length : 0
    },
    tests: {}
  };

  if (!env.GITHUB_TOKEN || !env.GITHUB_OWNER || !env.GITHUB_REPO) {
    return Response.json({
      ok: false,
      ...result,
      error: "Cloudflare-Variablen fehlen"
    }, { status: 500 });
  }

  const headers = {
    "Accept": "application/vnd.github+json",
    "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
    "X-GitHub-Api-Version": "2022-11-28"
  };

  // TEST 1: Token / Benutzer
  try {
    const r = await fetch("https://api.github.com/user", {
      headers
    });

    const text = await r.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = {};
    }

    result.tests.user = {
      status: r.status,
      ok: r.ok,
      login: data.login || null,
      message: data.message || null,
      documentation: data.documentation_url || null
    };
  } catch (e) {
    result.tests.user = {
      status: null,
      ok: false,
      error: e.message
    };
  }

  // TEST 2: Repository
  try {
    const repoUrl =
      `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}`;

    const r = await fetch(repoUrl, {
      headers
    });

    const text = await r.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = {};
    }

    result.tests.repository = {
      status: r.status,
      ok: r.ok,
      full_name: data.full_name || null,
      private: data.private ?? null,
      permissions: data.permissions || null,
      message: data.message || null,
      documentation: data.documentation_url || null,
      accepted_permissions:
        r.headers.get("X-Accepted-GitHub-Permissions") || ""
    };
  } catch (e) {
    result.tests.repository = {
      status: null,
      ok: false,
      error: e.message
    };
  }

  // TEST 3: images.json
  try {
    const fileUrl =
      `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/images.json?ref=${encodeURIComponent(env.GITHUB_BRANCH || "main")}`;

    const r = await fetch(fileUrl, {
      headers
    });

    const text = await r.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = {};
    }

    result.tests.imagesJson = {
      status: r.status,
      ok: r.ok,
      name: data.name || null,
      shaPresent: !!data.sha,
      message: data.message || null,
      documentation: data.documentation_url || null,
      accepted_permissions:
        r.headers.get("X-Accepted-GitHub-Permissions") || ""
    };
  } catch (e) {
    result.tests.imagesJson = {
      status: null,
      ok: false,
      error: e.message
    };
  }

  const allOk =
    result.tests.user?.ok &&
    result.tests.repository?.ok &&
    result.tests.imagesJson?.ok;

  return Response.json({
    ok: !!allOk,
    ...result
  });
}
