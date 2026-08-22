
import { getFile } from "../_github.js";

export async function onRequestGet({ env }) {
  try {
    const file = await getFile("images.json", env);
    const decoded = decodeURIComponent(escape(atob(file.content.replace(/\n/g, ""))));
    const images = JSON.parse(decoded);
    return new Response(JSON.stringify({ images }), {
      headers: {"Content-Type":"application/json", "Cache-Control":"no-store"}
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: {"Content-Type":"application/json"}
    });
  }
}
