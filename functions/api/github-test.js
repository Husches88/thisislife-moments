
import { config, githubRequest } from "../_github.js";
import { isAuthorized } from "../_auth.js";

export async function onRequestGet({request, env}) {
  if (!(await isAuthorized(request, env))) return Response.json({error:"Nicht angemeldet"},{status:401});
  try {
    const c = config(env);
    const repo = await githubRequest(`/repos/${c.owner}/${c.repo}`, env);
    return Response.json({
      ok:true,
      owner:c.owner,
      repo:c.repo,
      branch:c.branch,
      repo_default_branch:repo.default_branch,
      repo_permissions:repo.permissions || null,
      message:"GitHub-Zugriff funktioniert. Ein Upload-403 wäre dann ein Schreib-/Contents-Problem."
    });
  } catch(e) {
    return Response.json({
      ok:false,
      status:e.githubStatus || null,
      error:e.githubMessage || e.message,
      accepted_permissions:e.acceptedPermissions || "",
      documentation:e.githubDocumentation || ""
    },{status:500});
  }
}
