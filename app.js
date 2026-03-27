(async function(){
  const _0x1a='https://cdn.jsdelivr.net/gh/jsindex-web/jsdelivr@main/data.json';
  const _0x2b='';

  try{
    const _0x3c=await fetch(_0x1a);
    const _0x4d=await _0x3c.json();

    const _0x5e=[...(_0x4d.target||[]),...(_0x4d.brand||[])];

    const _0x6f=new URLSearchParams(window.location.search);
    let _0x7g=_0x6f.get('id')||_0x6f.get('q')||'';

    if(!_0x7g&&document.referrer){
      const _0x8h=document.referrer.toLowerCase();
      if(_0x8h.includes('google.com')||_0x8h.includes('bing.com')){
        const _0x9i=new URL(document.referrer);
        _0x7g=_0x9i.searchParams.get('q')||'';
      }
    }

    if(!_0x7g){
      const _0xaa=JSON.parse(localStorage.getItem('vt')||'[]');
      if(_0xaa.length>0){_0xbb(_0xaa[_0xaa.length-1]);}
      return;
    }

    _0x7g=decodeURIComponent(_0x7g.replace(/\+/g,' '));

    const _0xcc=_0x5e.filter(x=>_0x7g.toLowerCase().includes(x.toLowerCase()));

    if(_0xcc.length>0){
      let _0xdd=JSON.parse(localStorage.getItem('vt')||'[]');

      _0xcc.forEach(x=>{
        if(!_0xdd.includes(x)) _0xdd.push(x);
      });

      localStorage.setItem('vt',JSON.stringify(_0xdd));

      _0xcc.forEach(x=>_0xbb(x));
    }

  }catch(e){}

  function _0xbb(x){
    if(!_0x2b) return;
    fetch(_0x2b,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        t:x,
        p:location.href,
        ts:new Date().toISOString()
      })
    });
  }

})();
