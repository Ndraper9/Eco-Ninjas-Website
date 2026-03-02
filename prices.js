var currentToken = '';
var currentEmail = '';

async function generateToken(email) {
  var dateStr = new Date().toISOString().slice(0, 10);
  var raw = email.toLowerCase().trim() + '|EN-PRICES-2025|' + dateStr;
  var msgBuffer = new TextEncoder().encode(raw);
  var hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  var hashArray = Array.from(new Uint8Array(hashBuffer));
  var num = hashArray.slice(0, 4).reduce(function(acc, b) { return acc * 256 + b; }, 0);
  return String(num % 1000000).padStart(6, '0');
}

async function requestCode() {
  var email = document.getElementById('email-input').value.trim();
  var msg = document.getElementById('email-msg');

  if (!email || !email.includes('@') || !email.includes('.')) {
    msg.textContent = 'Please enter a valid email address.';
    msg.className = 'gate-msg error';
    return;
  }

  var btn = document.querySelector('#email-step .gate-btn');
  btn.disabled = true;
  btn.textContent = 'Sending...';
  msg.textContent = '';

  currentToken = await generateToken(email);
  currentEmail = email;

  try {
    var response = await fetch('https://eco-ninjas-api-production.up.railway.app/send-price-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, code: currentToken })
    });

    if (response.ok) {
      document.getElementById('sent-to').textContent = email;
      document.getElementById('email-step').style.display = 'none';
      document.getElementById('token-step').classList.add('visible');
      document.getElementById('d0').focus();
    } else {
      throw new Error('API error');
    }
  } catch (e) {
    msg.textContent = 'Could not send code. Please try again or contact us directly.';
    msg.className = 'gate-msg error';
    btn.disabled = false;
    btn.textContent = 'Send Access Code \u2192';
  }
}

function digitInput(index) {
  var val = document.getElementById('d' + index).value;
  if (val && index < 5) document.getElementById('d' + (index + 1)).focus();
  var code = [0,1,2,3,4,5].map(function(i) { return document.getElementById('d'+i).value; }).join('');
  if (code.length === 6) verifyCode();
}

async function verifyCode() {
  var entered = [0,1,2,3,4,5].map(function(i) { return document.getElementById('d'+i).value; }).join('');
  var msg = document.getElementById('token-msg');

  if (entered.length < 6) {
    msg.textContent = 'Please enter all 6 digits.';
    msg.className = 'gate-msg error';
    return;
  }

  if (entered === currentToken) {
    try {
      await fetch('https://eco-ninjas-api-production.up.railway.app/log-price-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentEmail, timestamp: new Date().toISOString() })
      });
    } catch(e) {}

    document.getElementById('gate').style.display = 'none';
    document.getElementById('prices-content').classList.add('visible');
  } else {
    msg.textContent = 'Incorrect code. Please check your email and try again.';
    msg.className = 'gate-msg error';
    [0,1,2,3,4,5].forEach(function(i) { document.getElementById('d'+i).value = ''; });
    document.getElementById('d0').focus();
  }
}

function resetGate() {
  document.getElementById('email-step').style.display = 'block';
  document.getElementById('token-step').classList.remove('visible');
  document.getElementById('email-input').value = '';
  document.getElementById('email-msg').textContent = '';
  var btn = document.querySelector('#email-step .gate-btn');
  btn.disabled = false;
  btn.textContent = 'Send Access Code \u2192';
  currentToken = '';
  currentEmail = '';
}

function showTab(id, btn) {
  document.querySelectorAll('.tab-content').forEach(function(el) { el.classList.remove('active'); });
  document.querySelectorAll('.tab').forEach(function(el) { el.classList.remove('active'); });
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Backspace') {
    var id = e.target.id;
    if (id && id.startsWith('d')) {
      var i = parseInt(id[1]);
      if (!e.target.value && i > 0) document.getElementById('d' + (i-1)).focus();
    }
  }
});
