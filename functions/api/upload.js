import { getFile, putFile, config } from "../_github.js";
import { isAuthorized } from "../_auth.js";

function encodeJson(obj) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(obj, null, 2))));
}
function decodeJson(content) {
  return JSON.parse(decodeURIComponent(escape(atob(content.replace(/\n/g, "")))));
}
function bytesToBase64(bytes) {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

async function putImage(path, content, message, env) {
  let sha = null;
  try {
    const existing = await getFile(path, env);
    sha = existing.sha;
  } catch (_) {}
  return putFile(path, content, message, sha, env);
}

export async function onRequestPost({ request, env }) {
  if (!(await isAuthorized(request, env))) {
    return Response.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const fileName = String(body.fileName || "")
      .replace(/[^a-zA-Z0-9._-]/g, "_");
    const content = String(body.content || "");
    const title = String(body.title || "");
    const category = String(body.category || "MOMENT");
    const hero = Boolean(body.hero);

    if (!fileName || !content) {
      return Response.json({ error: "Keine Datei erhalten" }, { status: 400 });
    }

    if (content.length > 28_000_000) {
      return Response.json({ error: "Datei ist zu groß. Bitte maximal 20 MB verwenden." }, { status: 400 });
    }

    const allowed = /\.(jpe?g|png|webp|gif|avif)$/i.test(fileName);
    if (!allowed) {
      return Response.json({ error: "Nur JPG, PNG, WEBP, GIF oder AVIF sind erlaubt." }, { status: 400 });
    }

    let meta;
    try {
      meta = await getFile("images.json", env);
    } catch (_) {
      meta = { content: btoa("[]"), sha: null };
    }

    let images = meta.content ? decodeJson(meta.content) : [];

    if (hero) {
      images = images.map(x => ({ ...x, hero: false }));
    }

    images = images.filter(x => x.file !== fileName);
    images.push({
      file: fileName,
      title,
      category,
      hero
    });

    await putImage(
      `images/${fileName}`,
      content,
      `Upload image ${fileName}`,
      env
    );

    const latest = await getFile("images.json", env);
    await putFile(
      "images.json",
      encodeJson(images),
      `Update gallery metadata for ${fileName}`,
      latest.sha,
      env
    );

    return Response.json({ ok: true, file: fileName });
  } catch (e) {
    return Response.json(
      {
        error: e.githubMessage || e.message || "Upload fehlgeschlagen",
        github_status: e.githubStatus || null,
        accepted_permissions: e.acceptedPermissions || "",
        documentation: e.githubDocumentation || ""
      },
      { status: 500 }
    );
  }
}
