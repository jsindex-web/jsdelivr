// Load saved data
document.getElementById("anchors").value =
  localStorage.getItem("anchors") || "";
document.getElementById("template").value =
  localStorage.getItem("template") || "";

// Save anchors
function saveAnchors() {
  localStorage.setItem("anchors", anchors.value);
  alert("Anchors saved");
}

// Spin & Preview
function previewSpin() {
  const anchors = document.getElementById("anchors").value
    .split("\n")
    .filter(x => x.includes("|"));

  if (!anchors.length) return alert("Anchor kosong");

  const pick = anchors[Math.floor(Math.random() * anchors.length)];
  const [text, url] = pick.split("|").map(x => x.trim());

  const tpl = document.getElementById("template").value;
  const html = tpl.replace(/{ANCHOR}/g,
    `<a href="${url}" target="_blank">${text}</a>`
  );

  document.getElementById("result").innerHTML = html;

  generateInjectJS();
}

// Generate Inject JS
function generateInjectJS() {
  const payload = btoa(document.getElementById("result").innerHTML);
  document.getElementById("inject").value =
`<script>
(function(){
 if(document.getElementById('bunker-payload'))return;
 var d=document.createElement('div');
 d.id='bunker-payload';
 d.style.display='none';
 d.innerHTML=atob('${payload}');
 document.body.appendChild(d);
})();
</script>`;
}
