/* =========================================================
   Neeraj & Nidhi — Royal Wedding Invitation Scripts
   Enhanced Interactivity & Full Mobile Responsiveness
   ========================================================= */

// Immediately disable browser automatic scroll restoration and pin to top
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
if (window.location.hash) {
  try {
    history.replaceState(null, null, window.location.pathname + window.location.search);
  } catch (e) {}
}

document.addEventListener('DOMContentLoaded', () => {

  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  // =======================================================
  // 1. FLOATING ROSE PETALS & GOLD SPARKLES CANVAS (OPTIMIZED)
  // =======================================================
  const pCanvas = document.getElementById('particlesCanvas');
  if (pCanvas) {
    const isMobile = window.innerWidth < 768;
    const ctx = pCanvas.getContext('2d', { alpha: true });
    let width = (pCanvas.width = window.innerWidth);
    let height = (pCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = pCanvas.width = window.innerWidth;
      height = pCanvas.height = window.innerHeight;
    }, { passive: true });

    // Lightweight particle count: 12 on mobile, 28 on desktop for buttery 60fps
    const totalParticles = isMobile ? 12 : 28;
    const particles = [];

    const petalImg = new Image();
    petalImg.src = 'images/falling-rose-petal.png';
    let petalLoaded = false;
    petalImg.onload = () => { petalLoaded = true; };

    for (let i = 0; i < totalParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isMobile ? (Math.random() * 8 + 6) : (Math.random() * 12 + 8),
        speedY: Math.random() * 0.7 + 0.35,
        speedX: Math.sin(Math.random() * Math.PI) * 0.4 - 0.2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 0.8,
        type: Math.random() > 0.5 ? 'petal' : 'gold',
        opacity: Math.random() * 0.5 + 0.3
      });
    }

    // Scroll throttle: pause drawing during active scrolling on mobile
    let isScrolling = false;
    let scrollTimer = null;
    window.addEventListener('scroll', () => {
      if (!isMobile) return;
      isScrolling = true;
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => { isScrolling = false; }, 120);
    }, { passive: true });

    function animateParticles() {
      if (document.hidden || (isMobile && isScrolling)) {
        requestAnimationFrame(animateParticles);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 20) {
          p.y = -15;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;

        if (p.type === 'petal' && petalLoaded && !isMobile) {
          ctx.drawImage(petalImg, -p.size / 2, -p.size / 2, p.size, p.size * 1.2);
        } else if (p.type === 'petal') {
          ctx.fillStyle = '#C42746';
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.45, p.size * 0.75, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#D8A53E';
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.22, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      requestAnimationFrame(animateParticles);
    }
    requestAnimationFrame(animateParticles);
  }

  // =======================================================
  // 2. AUDIO MUSIC CONTROLLER
  // =======================================================
  const bgMusic = document.getElementById('bgMusic');
  const musicController = document.getElementById('musicController');
  const musicIconWrap = document.getElementById('musicIconWrap');
  let isPlaying = false;

  function toggleMusic(playState) {
    if (!bgMusic) return;
    if (playState === true || (playState === undefined && !isPlaying)) {
      bgMusic.play().then(() => {
        isPlaying = true;
        if (musicController) musicController.classList.add('playing');
        if (musicIconWrap) musicIconWrap.innerHTML = '🔊';
      }).catch(err => {
        console.log('Audio autoplay policy:', err);
      });
    } else {
      bgMusic.pause();
      isPlaying = false;
      if (musicController) musicController.classList.remove('playing');
      if (musicIconWrap) musicIconWrap.innerHTML = '🔈';
    }
  }

  if (musicController) {
    musicController.addEventListener('click', () => {
      toggleMusic(!isPlaying);
    });
  }

  // =======================================================
  // 3. ROYAL ENVELOPE OPENING CEREMONY (PINNED TO TOP)
  // =======================================================
  const envelopeOverlay = document.getElementById('envelopeOverlay');
  const waxSealBtn = document.getElementById('waxSealBtn');
  const envelopeBox = document.getElementById('envelopeBox');
  const envelopeSkip = document.getElementById('envelopeSkip');
  const navReplayBtn = document.getElementById('navReplayBtn');

  // Lock scroll while envelope is displayed
  if (envelopeOverlay && !envelopeOverlay.classList.contains('opened')) {
    document.documentElement.classList.add('envelope-locked');
    document.body.classList.add('envelope-locked');
  }

  function openEnvelope() {
    if (!envelopeOverlay) return;

    // Immediately remove locks and force top scroll
    document.documentElement.classList.remove('envelope-locked');
    document.body.classList.remove('envelope-locked');

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
    toggleMusic(true);

    envelopeOverlay.classList.add('opened');

    // Confirm top scroll after overlay transitions
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 80);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 250);
  }

  if (waxSealBtn) waxSealBtn.addEventListener('click', openEnvelope);
  if (envelopeBox) envelopeBox.addEventListener('click', openEnvelope);
  if (envelopeSkip) envelopeSkip.addEventListener('click', openEnvelope);

  if (navReplayBtn) {
    navReplayBtn.addEventListener('click', () => {
      if (!envelopeOverlay) return;
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.classList.add('envelope-locked');
      document.body.classList.add('envelope-locked');
      envelopeOverlay.classList.remove('opened');
    });
  }

  // =======================================================
  // 4. REAL-TIME COUNTDOWN TIMER (6 DECEMBER 2026, 18:00 IST)
  // =======================================================
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins = document.getElementById('cd-mins');
  const cdSecs = document.getElementById('cd-secs');

  // 6 December 2026, 18:00:00 IST
  const weddingDate = new Date('2026-12-06T18:00:00+05:30').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance > 0) {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((distance % (1000 * 60)) / 1000);

      if (cdDays) cdDays.textContent = String(days).padStart(2, '0');
      if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
      if (cdMins) cdMins.textContent = String(mins).padStart(2, '0');
      if (cdSecs) cdSecs.textContent = String(secs).padStart(2, '0');
    } else {
      if (cdDays) cdDays.textContent = '00';
      if (cdHours) cdHours.textContent = '00';
      if (cdMins) cdMins.textContent = '00';
      if (cdSecs) cdSecs.textContent = '00';
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // =======================================================
  // 5. INTERACTIVE GOLDEN SCRATCH CARD WITH RESET & REVEAL
  // =======================================================
  const scratchCanvas = document.getElementById('scratchCanvas');
  const scratchHint = document.getElementById('scratchHint');
  const scratchResetBtn = document.getElementById('scratchResetBtn');
  const scratchRevealBtn = document.getElementById('scratchRevealBtn');
  let isScratching = false;
  let isRevealed = false;

  // Web Audio scratching sound
  let audioCtx = null;
  function playScratchSound() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320 + Math.random() * 200, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.07);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.07);
    } catch (e) {}
  }

  if (scratchCanvas) {
    const sCtx = scratchCanvas.getContext('2d');
    const parent = scratchCanvas.parentElement;

    function initScratchCanvas() {
      const rect = parent.getBoundingClientRect();
      scratchCanvas.width = rect.width;
      scratchCanvas.height = rect.height;
      scratchCanvas.style.display = 'block';
      scratchCanvas.style.opacity = '1';
      isRevealed = false;

      // Draw rich gold foil background
      const grad = sCtx.createLinearGradient(0, 0, rect.width, rect.height);
      grad.addColorStop(0, '#E8C570');
      grad.addColorStop(0.3, '#BF8C2C');
      grad.addColorStop(0.6, '#966C17');
      grad.addColorStop(1, '#E8C570');

      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, rect.width, rect.height);

      // Gold sparkles
      sCtx.fillStyle = '#FFF2D1';
      for (let i = 0; i < 45; i++) {
        const sx = Math.random() * rect.width;
        const sy = Math.random() * rect.height;
        sCtx.beginPath();
        sCtx.arc(sx, sy, Math.random() * 2.5 + 1, 0, Math.PI * 2);
        sCtx.fill();
      }

      // Border
      sCtx.strokeStyle = '#634407';
      sCtx.lineWidth = 4;
      sCtx.strokeRect(10, 10, rect.width - 20, rect.height - 20);

      // Label text
      sCtx.fillStyle = '#422C03';
      sCtx.font = 'bold 18px "Cinzel", Georgia, serif';
      sCtx.textAlign = 'center';
      sCtx.textBaseline = 'middle';
      sCtx.fillText('✨ SCRATCH TO REVEAL MUHURAT ✨', rect.width / 2, rect.height / 2 - 14);

      sCtx.font = '14px "Poppins", sans-serif';
      sCtx.fillStyle = '#5A3D06';
      sCtx.fillText('(Use finger or mouse to scratch)', rect.width / 2, rect.height / 2 + 18);

      sCtx.globalCompositeOperation = 'destination-out';

      if (scratchHint) {
        scratchHint.textContent = '✦ Gently scratch above to reveal the auspicious surprise ✦';
      }
    }

    initScratchCanvas();
    window.addEventListener('resize', () => {
      if (!isRevealed) initScratchCanvas();
    });

    function getScratchCoords(e) {
      const r = scratchCanvas.getBoundingClientRect();
      if (e.touches && e.touches[0]) {
        return {
          x: e.touches[0].clientX - r.left,
          y: e.touches[0].clientY - r.top
        };
      }
      return {
        x: e.clientX - r.left,
        y: e.clientY - r.top
      };
    }

    function scratch(e) {
      if (!isScratching || isRevealed) return;
      const coords = getScratchCoords(e);
      sCtx.beginPath();
      sCtx.arc(coords.x, coords.y, 30, 0, Math.PI * 2);
      sCtx.fill();
      playScratchSound();
      checkScratchPercentage();
    }

    function checkScratchPercentage() {
      if (isRevealed) return;
      try {
        const imgData = sCtx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
        const data = imgData.data;
        let cleared = 0;
        const total = data.length / 4;

        for (let i = 3; i < data.length; i += 32) {
          if (data[i] === 0) cleared++;
        }

        const pct = (cleared / (total / 8)) * 100;
        if (scratchHint) {
          scratchHint.textContent = `Scratched: ${Math.min(100, Math.round(pct))}% — Keep scratching!`;
        }

        if (pct >= 38) {
          revealScratchCard();
        }
      } catch (err) {}
    }

    function revealScratchCard() {
      if (isRevealed) return;
      isRevealed = true;
      scratchCanvas.style.transition = 'opacity 0.6s ease';
      scratchCanvas.style.opacity = '0';
      setTimeout(() => {
        scratchCanvas.style.display = 'none';
      }, 600);
      if (scratchHint) {
        scratchHint.textContent = '✨ Muhurat Unveiled! Showering Auspicious Blessings ✨';
      }
      const boxRect = scratchCanvas.getBoundingClientRect();
      triggerConfetti(boxRect.left + boxRect.width / 2, boxRect.top + boxRect.height / 2);
    }

    scratchCanvas.addEventListener('mousedown', (e) => { isScratching = true; scratch(e); });
    window.addEventListener('mouseup', () => { isScratching = false; });
    scratchCanvas.addEventListener('mousemove', scratch);

    scratchCanvas.addEventListener('touchstart', (e) => { isScratching = true; scratch(e); }, { passive: true });
    window.addEventListener('touchend', () => { isScratching = false; });
    scratchCanvas.addEventListener('touchmove', scratch, { passive: true });

    if (scratchResetBtn) {
      scratchResetBtn.addEventListener('click', () => {
        initScratchCanvas();
      });
    }

    if (scratchRevealBtn) {
      scratchRevealBtn.addEventListener('click', () => {
        revealScratchCard();
      });
    }
  }

  // =======================================================
  // 6. CONFETTI BURST
  // =======================================================
  function triggerConfetti(originX, originY) {
    const isMobile = window.innerWidth < 768;
    const colors = ['#D8A53E', '#C42746', '#BF8C2C', '#F0CA6E', '#851227', '#FFFFFF'];
    const total = isMobile ? 20 : 45;

    for (let i = 0; i < total; i++) {
      const conf = document.createElement('div');
      conf.style.position = 'fixed';
      conf.style.left = (originX || window.innerWidth / 2) + 'px';
      conf.style.top = (originY || window.innerHeight / 2) + 'px';
      conf.style.width = (isMobile ? (Math.random() * 6 + 5) : (Math.random() * 10 + 6)) + 'px';
      conf.style.height = (isMobile ? (Math.random() * 6 + 5) : (Math.random() * 10 + 6)) + 'px';
      conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      conf.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      conf.style.zIndex = '999999';
      conf.style.pointerEvents = 'none';

      document.body.appendChild(conf);

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 140 + 100;
      const destX = Math.cos(angle) * velocity;
      const destY = Math.sin(angle) * velocity + 120;

      conf.animate([
        { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
        { transform: `translate(${destX}px, ${destY}px) scale(0.3) rotate(${Math.random() * 540}deg)`, opacity: 0 }
      ], {
        duration: Math.random() * 1000 + 700,
        easing: 'cubic-bezier(0.2, 0.8, 0.4, 1)'
      }).onfinish = () => conf.remove();
    }
  }

  // =======================================================
  // 7. CARD TABS & LIGHTBOX MODAL WITH DOWNLOAD
  // =======================================================
  const cardTabs = document.querySelectorAll('.card-tab-btn');
  const cardPanels = document.querySelectorAll('.card-panel');

  cardTabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      cardTabs.forEach(b => b.classList.remove('active'));
      cardPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const activePanel = document.getElementById(target);
      if (activePanel) activePanel.classList.add('active');
    });
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxDownloadBtn = document.getElementById('lightboxDownloadBtn');

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.textContent = alt || 'Official Wedding Card';
    if (lightboxDownloadBtn) lightboxDownloadBtn.href = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.zoomable-card').forEach((img) => {
    img.addEventListener('click', () => {
      openLightbox(img.src, img.alt);
    });
  });

  document.querySelectorAll('.btn-zoom-trigger').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetSrc = btn.getAttribute('data-img');
      const targetAlt = btn.getAttribute('data-title');
      openLightbox(targetSrc, targetAlt);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // =======================================================
  // 8. MOBILE NAVIGATION MENU & OVERLAY
  // =======================================================
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  function toggleMobileNav() {
    if (!navLinks) return;
    const isOpen = navLinks.classList.contains('active');
    if (isOpen) {
      navLinks.classList.remove('active');
      if (navToggle) navToggle.classList.remove('active');
      if (navOverlay) navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    } else {
      navLinks.classList.add('active');
      if (navToggle) navToggle.classList.add('active');
      if (navOverlay) navOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  if (navToggle) {
    navToggle.addEventListener('click', toggleMobileNav);
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', toggleMobileNav);
  }

  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (navToggle) navToggle.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }


  // =======================================================
  // 10. RSVP GUEST COUNTER & WHATSAPP INTEGRATION
  // =======================================================
  const guestCountInput = document.getElementById('guestCount');
  const countMinusBtn = document.getElementById('countMinusBtn');
  const countPlusBtn = document.getElementById('countPlusBtn');

  if (countMinusBtn && guestCountInput) {
    countMinusBtn.addEventListener('click', () => {
      let val = parseInt(guestCountInput.value, 10) || 1;
      if (val > 1) guestCountInput.value = val - 1;
    });
  }

  if (countPlusBtn && guestCountInput) {
    countPlusBtn.addEventListener('click', () => {
      let val = parseInt(guestCountInput.value, 10) || 1;
      if (val < 20) guestCountInput.value = val + 1;
    });
  }

  const rsvpForm = document.getElementById('rsvpForm');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const guestName = document.getElementById('guestName')?.value.trim() || 'Guest';
      const attendance = document.getElementById('attendance')?.value || 'Joyfully Attending';
      const guestCountVal = guestCountInput?.value || '2';
      const guestEvents = document.getElementById('guestEvents')?.value.trim() || 'All Functions';
      const guestNote = document.getElementById('guestNote')?.value.trim() || '';

      const phone = '919436685069';
      let text = `*Wedding RSVP — Neeraj & Nidhi's Vivah*\n\n`;
      text += `• *Guest Name:* ${guestName}\n`;
      text += `• *Attendance:* ${attendance}\n`;
      text += `• *Total Members:* ${guestCountVal}\n`;
      text += `• *Functions:* ${guestEvents}\n`;
      if (guestNote) text += `• *Wishes / Note:* ${guestNote}\n`;
      text += `\nLooking forward to celebrating with the family in Gorakhpur!`;

      const encoded = encodeURIComponent(text);
      const waUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`;

      triggerConfetti();
      window.open(waUrl, '_blank');
    });
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // =======================================================
  // 11. HERO CARD FRAME INTERACTIVE 3D TILT (DESKTOP ONLY)
  // =======================================================
  const heroCardFrame = document.getElementById('heroCardFrame');
  const heroSection = document.getElementById('home');

  if (heroCardFrame && heroSection && window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 769px)').matches) {
    let ticking = false;
    heroSection.addEventListener('mousemove', (e) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = heroCardFrame.getBoundingClientRect();
        const frameCenterX = rect.left + rect.width / 2;
        const frameCenterY = rect.top + rect.height / 2;
        
        const mouseX = e.clientX - frameCenterX;
        const mouseY = e.clientY - frameCenterY;

        // Subtle royal 3D card tilt
        const rotateX = (-mouseY / (rect.height / 2)) * 2.5;
        const rotateY = (mouseX / (rect.width / 2)) * 2.5;

        heroCardFrame.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
        ticking = false;
      });
    }, { passive: true });

    heroSection.addEventListener('mouseleave', () => {
      heroCardFrame.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  }

});
