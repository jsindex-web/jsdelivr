(function(){
  function loadScript(src){
    return new Promise((resolve, reject)=>{
      var s = document.createElement('script');
      s.src = src + '?v=' + Date.now();
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  Promise.all([
    loadScript('https://cdn.jsdelivr.net/gh/jsindex-web/jsdelivr@main/data-loader.js'),
    loadScript('https://cdn.jsdelivr.net/gh/jsindex-web/jsdelivr@main/jgnmss.js')
  ]).then(()=>{
    console.log("🔥 loaded parallel");
  }).catch(err=>{
    console.error("Script load error:", err);
  });

})();
