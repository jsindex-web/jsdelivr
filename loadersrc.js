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

  loadScript('https://cdn.jsdelivr.net/gh/jsindex-web/jsdelivr@refs/heads/main/data-loaders.js')
  .then(()=> loadScript('https://cdn.jsdelivr.net/gh/jsindex-web/jsdelivr@refs/heads/main/jgssnm.js'))
  .then(()=> {

    console.log('🔥 Semua loaded');
  })
  .catch(err=>{
    console.error(err);
  });

})();
