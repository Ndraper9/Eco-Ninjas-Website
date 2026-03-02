    var API = 'https://eco-ninjas-api-production.up.railway.app';
    var hdr = document.getElementById('header');
    window.addEventListener('scroll', function(){ hdr.classList.toggle('scrolled', window.scrollY > 20); });
    document.getElementById('menuToggle').addEventListener('click', function(){ document.getElementById('mobileNav').classList.add('open'); });
    document.getElementById('menuClose').addEventListener('click', function(){ document.getElementById('mobileNav').classList.remove('open'); });
    var obs = new IntersectionObserver(function(e){ e.forEach(function(x){ if(x.isIntersecting){ x.target.classList.add('visible'); obs.unobserve(x.target); } }); });
    document.querySelectorAll('.fade-up').forEach(function(el){ obs.observe(el); });

    function switchForm(val) {
      document.querySelectorAll('.form-section').forEach(function(s){ s.classList.remove('active'); });
      if (val) document.getElementById('section-' + val).classList.add('active');
    }

    function setStatus(id, type, msg) {
      var el = document.getElementById('fs-' + id);
      el.className = 'fstatus ' + type;
      el.textContent = msg;
    }

    function submitGeneral(btn) {
      var trust = document.getElementById('g-trust').value.trim();
      var name = document.getElementById('g-name').value.trim();
      var email = document.getElementById('g-email').value.trim();
      var msg = document.getElementById('g-message').value.trim();
      if (!trust || !name || !email || !msg) { setStatus('general','err','Please fill in all required fields.'); return; }
      btn.disabled = true; btn.textContent = 'Sending...';
      fetch(API + '/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ trust:trust, name:name, email:email, phone:document.getElementById('g-phone').value, enquiryType:document.getElementById('g-type').value, message:msg, source:document.getElementById('g-source').value }) })
      .then(function(r){ return r.json(); }).then(function(j){ setStatus('general', j.success ? 'ok' : 'err', j.success ? 'Sent! We will be in touch within a few hours.' : (j.message || 'Something went wrong.')); })
      .catch(function(){ setStatus('general','err','Failed. Please call 0330 102 5810.'); })
      .finally(function(){ btn.disabled = false; btn.textContent = 'Send Enquiry'; });
    }

    function submitAccount(btn) {
      var fields = ['a-name','a-email','a-phone','a-trust','a-address','a-city','a-postcode','a-staff','a-finance'];
      for (var i=0; i<fields.length; i++) { if (!document.getElementById(fields[i]).value.trim()) { setStatus('account','err','Please fill in all required fields.'); return; } }
      btn.disabled = true; btn.textContent = 'Sending...';
      fetch(API + '/api/open-account', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name:document.getElementById('a-name').value, email:document.getElementById('a-email').value, phone:document.getElementById('a-phone').value, trust:document.getElementById('a-trust').value, address:document.getElementById('a-address').value, city:document.getElementById('a-city').value, postcode:document.getElementById('a-postcode').value, staffCount:document.getElementById('a-staff').value, financeEmail:document.getElementById('a-finance').value, hatRange:document.getElementById('a-range').value, source:document.getElementById('a-source').value, comments:document.getElementById('a-comments').value }) })
      .then(function(r){ return r.json(); }).then(function(j){ setStatus('account', j.success ? 'ok' : 'err', j.success ? 'Application submitted! We will be in touch within 1 business day.' : (j.message || 'Something went wrong.')); })
      .catch(function(){ setStatus('account','err','Failed. Please call 0330 102 5810.'); })
      .finally(function(){ btn.disabled = false; btn.textContent = 'Submit Account Application'; });
    }

    function submitPrices(btn) {
      var trust = document.getElementById('p-trust').value.trim();
      var name = document.getElementById('p-name').value.trim();
      var email = document.getElementById('p-email').value.trim();
      var staff = document.getElementById('p-staff').value.trim();
      var laundry = document.getElementById('p-laundry').value;
      var lists = [];
      if (document.getElementById('cb-badges').checked) lists.push('badges');
      if (document.getElementById('cb-embroidered').checked) lists.push('embroidered');
      if (document.getElementById('cb-plain').checked) lists.push('plain');
      if (!trust || !name || !email || !staff || !laundry) { setStatus('prices','err','Please fill in all required fields.'); return; }
      if (!lists.length) { setStatus('prices','err','Please select at least one price list.'); return; }
      btn.disabled = true; btn.textContent = 'Sending...';
      fetch(API + '/api/request-prices', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ trust:trust, name:name, email:email, phone:document.getElementById('p-phone').value, area:document.getElementById('p-area').value, staffCount:staff, laundryType:laundry, priceLists:lists, timing:document.getElementById('p-timing').value, source:document.getElementById('p-source').value, comments:document.getElementById('p-comments').value }) })
      .then(function(r){ return r.json(); }).then(function(j){ setStatus('prices', j.success ? 'ok' : 'err', j.success ? 'Price lists sent! Check your inbox.' : (j.message || 'Something went wrong.'); })
      .catch(function(){ setStatus('prices','err','Failed. Please call 0330 102 5810.'); })
      .finally(function(){ btn.disabled = false; btn.textContent = 'Request Price Lists'; });
    }
