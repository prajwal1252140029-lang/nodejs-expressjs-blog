(function () {
  'use strict';

  // Mobile navigation toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav-links');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  // "Copy" button on article code blocks
  document.querySelectorAll('.prose pre').forEach(function (pre) {
    var code = pre.querySelector('code');
    if (!code) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.addEventListener('click', function () {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(code.innerText).then(function () {
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
      });
    });
    pre.appendChild(btn);
  });

  // Live API demo on the article page
  var form = document.getElementById('demo-form');
  if (form) {
    var select = document.getElementById('sensor-select');
    var output = document.getElementById('demo-output');
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var type = select.value;
      var url = type === 'all' ? '/api/sensors' : '/api/sensors/' + encodeURIComponent(type);
      output.textContent = 'Loading...';
      fetch(url)
        .then(function (res) {
          return res.json().then(function (data) {
            output.textContent = 'GET ' + url + '\nStatus: ' + res.status + '\n\n' + JSON.stringify(data, null, 2);
          });
        })
        .catch(function (err) {
          output.textContent = 'Request failed: ' + err.message;
        });
    });
  }
})();
