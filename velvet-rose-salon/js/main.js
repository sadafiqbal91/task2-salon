/* ==========================================================
   VELVET ROSE SALON - main.js
   10 interactive features, each in its own block:
   1 Dark mode      2 Mobile menu     3 Typing animation
   4 Counters       5 Sliders         6 FAQ accordion
   7 Gallery filter 8 Form validation 9 Scroll-to-top
   10 Scroll reveal
   ========================================================== */
'use strict';

/* 1. DARK / LIGHT MODE --------------------------------------- */
(function darkMode() {
  var btn = document.getElementById('themeToggle');
  try {
    if (localStorage.getItem('vr-theme') === 'dark') document.body.classList.add('dark-mode');
  } catch (e) { /* storage blocked: ignore */ }
  if (!btn) return;
  btn.addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
    var mode = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    try { localStorage.setItem('vr-theme', mode); } catch (e) {}
  });
})();

/* 2. RESPONSIVE NAVIGATION MENU ------------------------------ */
(function mobileMenu() {
  var burger = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');
  if (!burger || !nav) return;

  function setOpen(open) {
    burger.classList.toggle('open', open);
    nav.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  burger.addEventListener('click', function () { setOpen(!nav.classList.contains('open')); });
  nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  window.addEventListener('resize', function () { if (window.innerWidth > 768) setOpen(false); });
})();

/* 3. TYPING ANIMATION ---------------------------------------- */
(function typing() {
  var el = document.getElementById('typed');
  if (!el) return;
  var phrases = ['Feel beautiful.', 'Shine bright.', 'Glow with confidence.', 'Love your look.'];
  var p = 0, c = 0, deleting = false;

  function tick() {
    var word = phrases[p];
    c += deleting ? -1 : 1;
    el.textContent = word.substring(0, c);
    var delay = deleting ? 45 : 95;
    if (!deleting && c === word.length) { deleting = true; delay = 1700; }
    else if (deleting && c === 0) { deleting = false; p = (p + 1) % phrases.length; delay = 450; }
    setTimeout(tick, delay);
  }
  tick();
})();

/* 4. ANIMATED COUNTERS --------------------------------------- */
(function counters() {
  var nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;

  function run(el) {
    var target = parseInt(el.dataset.count, 10);
    var suffix = el.dataset.suffix || '';
    var start = performance.now(), dur = 1900;
    function frame(now) {
      var t = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.floor(target * eased).toLocaleString('en-US') + suffix;
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = target.toLocaleString('en-US') + suffix;
    }
    requestAnimationFrame(frame);
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
    });
  }, { threshold: 0.4 });
  nums.forEach(function (n) { io.observe(n); });
})();

/* 5. SLIDERS (image gallery slider + testimonial slider) ----- */
(function sliders() {
  document.querySelectorAll('[data-slider]').forEach(function (root) {
    var track = root.querySelector('.slider-track');
    var slides = root.querySelectorAll('.slide');
    var dotsBox = root.querySelector('.dots');
    var interval = parseInt(root.dataset.interval || '6000', 10);
    var index = 0, timer = null;

    slides.forEach(function (_, i) {
      var d = document.createElement('button');
      d.className = 'dot';
      d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      d.addEventListener('click', function () { go(i); restart(); });
      dotsBox.appendChild(d);
    });
    var dots = dotsBox.querySelectorAll('.dot');

    function go(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + index * 100 + '%)';
      dots.forEach(function (d, n) { d.classList.toggle('active', n === index); });
      slides.forEach(function (s, n) { s.setAttribute('aria-hidden', String(n !== index)); });
    }
    function start() { timer = setInterval(function () { go(index + 1); }, interval); }
    function stop() { clearInterval(timer); }
    function restart() { stop(); start(); }

    root.querySelector('.prev').addEventListener('click', function () { go(index - 1); restart(); });
    root.querySelector('.next').addEventListener('click', function () { go(index + 1); restart(); });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { go(index - 1); restart(); }
      if (e.key === 'ArrowRight') { go(index + 1); restart(); }
    });
    root.setAttribute('tabindex', '0');
    go(0);
    start();
  });
})();

/* 6. FAQ ACCORDION ------------------------------------------- */
(function faq() {
  var items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  function setOpen(item, open) {
    var panel = item.querySelector('.faq-a');
    item.classList.toggle('open', open);
    item.querySelector('.faq-q').setAttribute('aria-expanded', String(open));
    panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0px';
  }
  items.forEach(function (item) {
    item.querySelector('.faq-q').addEventListener('click', function () {
      var willOpen = !item.classList.contains('open');
      items.forEach(function (i) { setOpen(i, false); });
      if (willOpen) setOpen(item, true);
    });
  });
  setOpen(items[0], true);
})();

/* 7. GALLERY (PORTFOLIO) FILTER ------------------------------ */
(function galleryFilter() {
  var buttons = document.querySelectorAll('.filter-btn');
  var works = document.querySelectorAll('.work');
  var empty = document.getElementById('emptyMsg');
  if (!buttons.length) return;

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      var cat = btn.dataset.filter, shown = 0;
      works.forEach(function (w) {
        var match = cat === 'all' || w.dataset.category === cat;
        w.classList.toggle('hide', !match);
        if (match) shown++;
      });
      if (empty) empty.classList.toggle('show', shown === 0);
    });
  });
})();

/* 8. BOOKING FORM VALIDATION --------------------------------- */
(function formValidation() {
  var form = document.getElementById('bookingForm');
  if (!form) return;
  var success = document.getElementById('formSuccess');

  // set the earliest bookable date to today
  var dateInput = form.elements.date;
  if (dateInput) {
    var now = new Date();
    var iso = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
    dateInput.min = iso;
  }

  var rules = {
    name:    { required: true, test: function (v) { return v.length >= 3; }, msg: 'Please enter your full name (at least 3 characters).' },
    email:   { required: true, test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }, msg: 'Please enter a valid email address.' },
    phone:   { required: true, test: function (v) { return /^[\d\s+\-()]{10,18}$/.test(v); }, msg: 'Please enter a valid phone number (10 digits or more).' },
    service: { required: true, test: function (v) { return v !== ''; }, msg: 'Please choose a service.' },
    date:    { required: true, test: function (v) { return v !== '' && v >= dateInput.min; }, msg: 'Please pick today or a future date.' },
    message: { required: false, test: function (v) { return v.length <= 500; }, msg: 'Message must be 500 characters or less.' }
  };

  function validate(name) {
    var field = form.elements[name], rule = rules[name];
    if (!field || !rule) return true;
    var value = field.value.trim();
    var box = field.closest('.field'), err = box.querySelector('.err');
    var ok = value === '' ? !rule.required : rule.test(value);
    box.classList.toggle('error', !ok);
    box.classList.toggle('ok', ok && value !== '');
    if (err) err.textContent = ok ? '' : rule.msg;
    return ok;
  }

  Object.keys(rules).forEach(function (name) {
    var f = form.elements[name];
    if (!f) return;
    f.addEventListener('blur', function () { validate(name); });
    f.addEventListener('input', function () { if (f.closest('.field').classList.contains('error')) validate(name); });
    f.addEventListener('change', function () { validate(name); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var results = Object.keys(rules).map(validate);
    if (results.every(Boolean)) {
      form.reset();
      form.querySelectorAll('.field').forEach(function (b) { b.classList.remove('ok', 'error'); });
      success.classList.add('show');
      success.focus();
      setTimeout(function () { success.classList.remove('show'); }, 7000);
    } else {
      var bad = form.querySelector('.field.error input, .field.error select, .field.error textarea');
      if (bad) bad.focus();
    }
  });
})();

/* 9. SCROLL-TO-TOP BUTTON ------------------------------------ */
(function scrollTop() {
  var btn = document.getElementById('scrollTop');
  if (!btn) return;
  window.addEventListener('scroll', function () { btn.classList.toggle('show', window.scrollY > 400); }, { passive: true });
  btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
})();

/* 10. SCROLL REVEAL ------------------------------------------ */
(function reveal() {
  var items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  items.forEach(function (el) { io.observe(el); });
})();
