const $ = id => document.getElementById(id);
let items = [];

async function load() {
  const r = await fetch("/api/admin-images", {cache:"no-store"});
  if (r.status === 401) {
    $("login").hidden = false; $("app").hidden = true; return;
  }
  const d = await r.json();
  items = d.images || [];
  $("items").innerHTML = items.map((x,i) => `
    <div class="item">
      <img src="images/${encodeURIComponent(x.file)}" alt="">
      <div class="meta">
        <div class="tag">${x.hero ? "TITELBILD · " : ""}${esc(x.category || "MOMENT")}</div>
        <input data-i="${i}" class="t" value="${esc(x.title || "")}">
        <input data-i="${i}" class="c" value="${esc(x.category || "MOMENT")}">
      </div>
      <div class="actions">
        <button onclick="saveItem(${i})">Speichern</button>
        <button class="danger" onclick="delItem(${JSON.stringify(x.file)})">Löschen</button>
      </div>
    </div>
  `).join("") || "<p class='hint'>Noch keine Bilder.</p>";
}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
$("loginForm").onsubmit = async e => {
  e.preventDefault();
  const r = await fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:$("password").value})});
  if(r.ok){$("login").hidden=true;$("app").hidden=false;load();}
  else $("loginError").textContent=(await r.json()).error||"Anmeldung fehlgeschlagen";
};
$("upload").onclick = async () => {
  const fs = $("files").files;
  if(!fs.length){$("uploadMsg").textContent="Bitte Bilder auswählen.";return;}
  const f = new FormData();
  [...fs].forEach(x=>f.append("files",x));
  f.append("title",$("title").value);
  f.append("category",$("category").value);
  f.append("hero",$("hero").checked?"true":"false");
  $("uploadMsg").textContent="Upload läuft …";
  const r=await fetch("/api/upload",{method:"POST",body:f});
  const d=await r.json();
  $("uploadMsg").textContent=r.ok?"Upload erfolgreich.":"Fehler: "+(d.error||"Upload fehlgeschlagen");
  if(r.ok){$("files").value="";$("title").value="";$("hero").checked=false;load();}
};
window.saveItem=async i=>{
  const x=items[i];
  const t=document.querySelector(`.t[data-i="${i}"]`).value;
  const c=document.querySelector(`.c[data-i="${i}"]`).value;
  const r=await fetch("/api/update",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({key:x.file,title:t,category:c,hero:x.hero})});
  if(r.ok) load(); else $("uploadMsg").textContent="Speichern fehlgeschlagen.";
};
window.delItem=async key=>{
  if(!confirm("Bild wirklich löschen?"))return;
  const r=await fetch("/api/delete",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({key})});
  if(r.ok)load();else $("uploadMsg").textContent="Löschen fehlgeschlagen.";
};
$("refresh").onclick=load;
$("logout").onclick=()=>{document.cookie="tl_admin=; Max-Age=0; Path=/";location.reload();};
load().catch(()=>{});
