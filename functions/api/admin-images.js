
import { getFile } from "../_github.js";
import { isAuthorized } from "../_auth.js";

export async function onRequestGet({ request, env }) {
  if (!(await isAuthorized(request, env))) return Response.json({error:"Nicht angemeldet"}, {status:401});
  try {
    const file = await getFile("images.json", env);
    const decoded = decodeURIComponent(escape(atob(file.content.replace(/\n/g, ""))));
    return Response.json({images:JSON.parse(decoded)});
  } catch(e) {
    return Response.json({error:e.message},{status:500});
  }
}
