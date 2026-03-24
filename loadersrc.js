(function(){
  function loadScript(src){
  return new Promise((resolve, reject)=>{
    var s = document.createElement('script');
    s.src = src + '?v=' + Date.now();

    const timeout = setTimeout(()=>{
      reject("Timeout loading: " + src);
    }, 10000);

    s.onload = () => {
      clearTimeout(timeout);
      resolve();
    };
    s.onerror = () => {
      clearTimeout(timeout);
      reject("Failed loading: " + src);
    };
    document.head.appendChild(s);
  });
}
  Promise.all([
    loadScript('https://cdn.jsdelivr.net/gh/jsindex-web/jsdelivr@main/data-loader.js'),
    loadScript('https://cdn.jsdelivr.net/gh/jsindex-web/jsdelivr@main/jssgnm.js')
  ]).then(()=>{
    console.log("🔥 loaded");
  }).catch(err=>{
    console.error("Script load error:", err);
  });

})();
