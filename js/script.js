// ============================================================
// script.js — page logic. All customization lives in config.js
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  checkCustomFont();

  // -- Entry screen symbol --
  document.getElementById("entry-symbol").textContent = CONFIG.entrySymbol;

  // -- Name + interference effect --
  initNameEffect();

  // -- Badges (assets/icon/<name>.png — filename becomes the tooltip) --
  document.documentElement.style.setProperty("--badge-size",             CONFIG.badgeSize);
  document.documentElement.style.setProperty("--badge-container-bg",     CONFIG.badgeContainerBackground);
  document.documentElement.style.setProperty("--badge-container-border", CONFIG.badgeContainerBorder);

  const badgesContainer = document.getElementById("badges");
  (CONFIG.badges || []).forEach((name) => {
    const item = document.createElement("div");
    item.className = "badge-item";

    const tooltip = document.createElement("span");
    tooltip.className   = "badge-tooltip";
    tooltip.textContent = name;               // file name = label
    item.appendChild(tooltip);

    const img = document.createElement("img");
    img.src = `${CONFIG.badgeFolder}${name}.png`;
    img.alt = name;
    img.onerror = () => {
      item.remove();
      console.warn(`[isai] badge missing: ${CONFIG.badgeFolder}${name}.png`);
    };
    item.appendChild(img);
    badgesContainer.appendChild(item);
  });

  // -- Avatar (with CDN fallback if pfp.png missing) --
  const avatarEl = document.getElementById("avatar");
  avatarEl.onerror = () => {
    if (CONFIG.avatarFallback && avatarEl.src !== CONFIG.avatarFallback) {
      avatarEl.src = CONFIG.avatarFallback;
    }
  };
  avatarEl.src = CONFIG.avatar;
  document.documentElement.style.setProperty("--avatar-size", CONFIG.avatarSize);

  // -- Avatar decoration --
  const decorationEl = document.getElementById("avatar-decoration");
  decorationEl.onerror = () => {
    decorationEl.style.display = "none";
    console.warn("[isai] decoration missing: assets/decor.gif");
  };
  if (CONFIG.avatarDecoration) {
    decorationEl.style.display = "";
    decorationEl.src = CONFIG.avatarDecoration;
  } else {
    decorationEl.style.display = "none";
  }

  // -- Background video (graceful fallback if missing) --
  const bgVideo = document.getElementById("bg-video");
  const videoFail = () => {
    bgVideo.style.display = "none";
    document.body.classList.add("no-video");
  };
  bgVideo.addEventListener("error", videoFail);
  document.getElementById("bg-video-source").addEventListener("error", videoFail);
  document.getElementById("bg-video-source").src = CONFIG.backgroundVideo;
  bgVideo.load();

  // -- Favicon fallback: uses pfp.png if assets/favicon.png is missing --
  const favTest = new Image();
  favTest.onerror = () => {
    const fav = document.querySelector('link[rel="icon"]');
    if (fav) fav.href = CONFIG.avatar;
  };
  favTest.src = "assets/favicon.png";

  // -- Card appearance --
  document.documentElement.style.setProperty("--card-max-width",        CONFIG.cardMaxWidth);
  document.documentElement.style.setProperty("--card-border-radius",    CONFIG.cardBorderRadius);
  document.documentElement.style.setProperty("--card-background",       CONFIG.cardBackground);
  document.documentElement.style.setProperty("--card-border",           CONFIG.cardBorder);
  document.documentElement.style.setProperty("--card-tilt-perspective", CONFIG.cardTiltPerspective);
  document.documentElement.style.setProperty("--username-glow",         CONFIG.usernameGlow);

  // -- Discord box --
  document.documentElement.style.setProperty("--discord-box-background", CONFIG.discordBoxBackground);
  document.documentElement.style.setProperty("--discord-box-radius",     CONFIG.discordBoxRadius);
  document.documentElement.style.setProperty("--discord-box-border",     CONFIG.discordBoxBorder);
  document.documentElement.style.setProperty("--discord-avatar-size",    CONFIG.discordAvatarSize);
  document.documentElement.style.setProperty("--discord-avatar-border",  CONFIG.discordAvatarBorder);

  // -- Social icons (assets/redirect/<name>.png, FA fallback while missing) --
  document.documentElement.style.setProperty("--icon-size",          CONFIG.iconSize);
  document.documentElement.style.setProperty("--icon-border-radius", CONFIG.iconBorderRadius);
  document.documentElement.style.setProperty("--icon-glow-color",    CONFIG.iconGlowColor);

  const FA_FALLBACK = {
    instagram: ["fa-brands fa-instagram", "#e1306c"],
    discord:   ["fa-brands fa-discord",   "#8b95ff"],
    roblox:    ["fa-brands fa-roblox",    "#e8eaed"],
    github:    ["fa-brands fa-github",    "#e6edf3"],
    spotify:   ["fa-brands fa-spotify",   "#1db954"],
  };

  const socialContainer = document.getElementById("social-links");
  (CONFIG.socialLinks || []).forEach((link) => {
    const a = document.createElement("a");
    a.href   = link.url;
    a.target = "_blank";
    a.rel    = "noopener noreferrer";
    a.title  = link.name;

    const img = document.createElement("img");
    img.className = "social-icon";
    img.src = `${CONFIG.redirectFolder}${link.name}.png`;
    img.alt = link.name;
    img.onerror = () => {
      const fb = FA_FALLBACK[link.name.toLowerCase()];
      if (fb) {
        const i = document.createElement("i");
        i.className = "social-fa " + fb[0];
        i.style.color = fb[1];
        a.replaceChild(i, img);
      } else {
        img.remove();
      }
      console.warn(`[isai] redirect icon missing: ${CONFIG.redirectFolder}${link.name}.png — using fallback`);
    };
    a.appendChild(img);
    socialContainer.appendChild(a);
  });

  // -- Discord presence --
  document.getElementById("discord-username").textContent = CONFIG.discordUsername;
  document.getElementById("discord-activity").textContent = CONFIG.discordStatus;
  document.getElementById("discord-avatar").src           = CONFIG.discordAvatar;

  // -- Status icon: assets/status/<status>.png, CSS dot fallback --
  const statusIcon = document.getElementById("discord-status-icon");
  const statusDot  = document.getElementById("discord-status-dot");
  const valid = ["online", "idle", "dnd", "offline"].includes(CONFIG.discordPresenceStatus)
    ? CONFIG.discordPresenceStatus : "offline";

  statusIcon.onerror = () => {
    statusIcon.hidden = true;
    statusDot.hidden  = false;
    statusDot.className = "status-" + valid;
  };
  statusIcon.src = `${CONFIG.statusIconFolder}${valid}.png`;

  // -- Custom cursor (auto-resizes any PNG, optional fallback) --
  initCustomCursor();

  // -- Tab title typewriter --
  initTabTitle(CONFIG.tabTitle);

  // -- Cursor sparkle trail --
  initCursorTrail();

  // --------------------------------------------------------
  // Entry screen click — starts everything
  // --------------------------------------------------------
  const profileCard = document.getElementById("profile-card");
  const bgMusic     = document.getElementById("bgMusic");
  const volumeBtn   = document.getElementById("volume-btn");

  document.getElementById("entry-screen").addEventListener("click", (e) => {
    e.currentTarget.classList.add("hidden");

    bgVideo.muted = false;
    bgVideo.play().catch(() => {});

    bgMusic.volume = 0.5;
    bgMusic.play().catch(() => {});

    initParticles();

    setTimeout(() => {
      profileCard.classList.add("revealed");
      initTypewriter(document.getElementById("profile-status"), CONFIG.statusText, 60);
    }, CONFIG.cardRevealDelay);
  });

  // -- Volume toggle --
  volumeBtn.addEventListener("click", () => {
    bgMusic.muted = !bgMusic.muted;
    volumeBtn.innerHTML = bgMusic.muted
      ? '<i class="fa-solid fa-volume-xmark"></i>'
      : '<i class="fa-solid fa-volume-high"></i>';
  });

  // --------------------------------------------------------
  // 3D card tilt on mouse move
  // --------------------------------------------------------
  if (CONFIG.cardTiltIntensity > 0) {
    const tiltTransform = (x, y) =>
      `translate(-50%, -50%) perspective(${CONFIG.cardTiltPerspective}) rotateX(${x}deg) rotateY(${y}deg)`;

    const resetTransform = () => { profileCard.style.transform = tiltTransform(0, 0); };

    const applyTilt = (clientX, clientY) => {
      const rect    = profileCard.getBoundingClientRect();
      const offsetX = (clientX - rect.left) / rect.width  - 0.5;
      const offsetY = (clientY - rect.top)  / rect.height - 0.5;
      profileCard.style.transform = tiltTransform(
        -offsetY * 2 * CONFIG.cardTiltIntensity,
         offsetX * 2 * CONFIG.cardTiltIntensity
      );
    };

    profileCard.addEventListener("mousemove",  (e) => applyTilt(e.clientX, e.clientY));
    profileCard.addEventListener("mouseleave", resetTransform);
    profileCard.addEventListener("touchmove",  (e) => applyTilt(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    profileCard.addEventListener("touchend",   resetTransform);
  }
});

// ============================================================
// CUSTOM CURSOR
// Browsers ignore cursor images larger than ~128px, so the PNG
// is redrawn onto a 32x32 canvas first — any size works.
// ============================================================
function initCustomCursor() {
  const applyCursor = (url, hotspot) => {
    const style = document.createElement("style");
    style.textContent = `* { cursor: url("${url}") ${hotspot}, auto !important; }`;
    document.head.appendChild(style);
  };

  if (!CONFIG.customCursor) {
    if (CONFIG.fallbackCursor) applyCursor(CONFIG.fallbackCursor, "0 0");
    return;
  }

  const img = new Image();
  img.onload = () => {
    const SIZE = 32;
    const c   = document.createElement("canvas");
    c.width   = SIZE;
    c.height  = SIZE;
    c.getContext("2d").drawImage(img, 0, 0, SIZE, SIZE);
    applyCursor(c.toDataURL("image/png"), CONFIG.customCursorHotspot || "0 0");
  };
  img.onerror = () => {
    console.warn("[isai] assets/cursor.png not found");
    if (CONFIG.fallbackCursor) applyCursor(CONFIG.fallbackCursor, "0 0");
  };
  img.src = CONFIG.customCursor;
}

// ============================================================
// FONT CHECK — reports in console (F12) whether the font loaded
// ============================================================
function checkCustomFont() {
  document.fonts.ready.then(() => {
    if (document.fonts.check('16px "CustomFont"')) {
      console.info("%c[isai]%c custom font loaded ✓", "color:#acc8ff;font-weight:bold", "");
    } else {
      console.warn(
        "%c[isai]%c custom font NOT found. Save it as assets/fonts/fuente.otf (or .ttf/.woff2).",
        "color:#f0b232;font-weight:bold", ""
      );
    }
  });
}

// ============================================================
// NAME INTERFERENCE EFFECT
// ============================================================
function initNameEffect() {
  const nameEl  = document.getElementById("name-text");
  const tooltip = document.getElementById("name-tooltip");

  nameEl.textContent  = CONFIG.profileName;
  tooltip.textContent = CONFIG.nameTooltip || "";

  if (CONFIG.nameEffect !== "noise") {
    nameEl.style.filter = "none";
    return;
  }

  const turb = document.getElementById("name-turb");
  const disp = document.getElementById("name-disp");

  setInterval(() => {
    turb.setAttribute("seed", Math.floor(Math.random() * 9999));
    const scale = Math.random() < 0.8
      ? 4 + Math.random() * 8
      : 0.5 + Math.random() * 2;
    disp.setAttribute("scale", scale.toFixed(1));
  }, 40);
}

// ============================================================
// TAB TITLE TYPEWRITER
// ============================================================
function initTabTitle(text) {
  let index = 0, isTyping = true;

  function tick() {
    if (isTyping) {
      document.title = text.substring(0, index + 1);
      index++;
      if (index === text.length) { isTyping = false; setTimeout(tick, 1500); return; }
    } else {
      document.title = text.substring(0, index - 1);
      index--;
      if (index === 0) isTyping = true;
    }
    setTimeout(tick, 100);
  }
  tick();
}

// ============================================================
// STATUS TYPEWRITER
// ============================================================
function initTypewriter(el, text, speed = 80) {
  let i = 0, isDeleting = false;

  function tick() {
    if (!isDeleting) {
      el.textContent = text.substring(0, i);
      i++;
      if (i > text.length) { setTimeout(() => { isDeleting = true; tick(); }, 1800); return; }
    } else {
      el.textContent = text.substring(0, i);
      i--;
      if (i < 0) { i = 0; isDeleting = false; setTimeout(tick, 500); return; }
    }
    setTimeout(tick, isDeleting ? speed * 0.5 : speed);
  }
  tick();
}

// ============================================================
// BACKGROUND PARTICLES
// ============================================================
function initParticles() {
  const canvas = document.getElementById("bg-canvas");
  const ctx    = canvas.getContext("2d");

  const { particleColor, particleCount, particleFallDuration,
          particleSwayDuration, particleSwayAmount, particleParallaxStrength } = CONFIG;

  let particles = [];
  let mouseX = window.innerWidth / 2;

  document.addEventListener("mousemove", (e) => { mouseX = e.clientX; });

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        baseX:     Math.random() * canvas.width,
        y:         Math.random() * canvas.height * 1.5 - canvas.height * 0.5,
        r:         1 + Math.random() * 1.8,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: (Math.random() * 0.6 + 0.7) / particleSwayDuration,
        fallSpeed: (canvas.height * 1.1) / (particleFallDuration * 60) * (0.7 + Math.random() * 0.6),
        opacity:   0.4 + Math.random() * 0.6,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = particleColor;

    const parallaxOffset = -(mouseX - canvas.width / 2) * particleParallaxStrength;

    particles.forEach((p) => {
      p.y += p.fallSpeed;
      if (p.y > canvas.height + 10) {
        p.y = -10;
        p.baseX = Math.random() * canvas.width;
      }
      const sway = Math.sin(performance.now() * 0.001 * p.swaySpeed + p.swayPhase) * particleSwayAmount;
      let x = p.baseX + sway + parallaxOffset;
      x = ((x % canvas.width) + canvas.width) % canvas.width;

      ctx.globalAlpha = p.opacity;
      ctx.beginPath();
      ctx.arc(x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  window.addEventListener("resize", () => { resize(); createParticles(); });
  requestAnimationFrame(draw);
}

// ============================================================
// CURSOR SPARKLE TRAIL
// ============================================================
function initCursorTrail() {
  const canvas = document.getElementById("cursor-canvas");
  const ctx    = canvas.getContext("2d");

  const { shootingStarColors, shootingStarSize,
          shootingStarMaxParticles, shootingStarFadeFrames, shootingStarGlow } = CONFIG;

  let particles = [];
  let mouseX = -999, mouseY = -999, lastX = -999, lastY = -999;

  document.addEventListener("mousemove", (e) => { mouseX = e.clientX; mouseY = e.clientY; });

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function drawStar(x, y, size, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.quadraticCurveTo( size * 0.2, -size * 0.2,  size, 0);
    ctx.quadraticCurveTo( size * 0.2,  size * 0.2,  0,    size);
    ctx.quadraticCurveTo(-size * 0.2,  size * 0.2, -size, 0);
    ctx.quadraticCurveTo(-size * 0.2, -size * 0.2,  0,   -size);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (mouseX !== lastX || mouseY !== lastY) {
      for (let i = 0; i < shootingStarMaxParticles; i++) {
        particles.push({
          x:             mouseX,
          y:             mouseY,
          vx:            (Math.random() - 0.5) * 1.2,
          vy:            (Math.random() - 0.5) * 1.2,
          life:          1,
          size:          shootingStarSize * (0.5 + Math.random() * 0.7),
          rotation:      Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.12,
          twinklePhase:  Math.random() * Math.PI * 2,
          color:         shootingStarColors[Math.floor(Math.random() * shootingStarColors.length)],
        });
      }
      lastX = mouseX; lastY = mouseY;
    }

    particles.forEach((p) => {
      p.x        += p.vx;
      p.y        += p.vy;
      p.vx       *= 0.97;
      p.vy       *= 0.97;
      p.rotation += p.rotationSpeed;
      p.life     -= 1 / shootingStarFadeFrames;

      const life    = Math.max(p.life, 0);
      const twinkle = 0.75 + 0.25 * Math.sin(performance.now() * 0.015 + p.twinklePhase);

      ctx.globalAlpha = life;
      ctx.fillStyle   = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur  = shootingStarGlow;
      drawStar(p.x, p.y, p.size * life * twinkle, p.rotation);
    });

    particles = particles.filter((p) => p.life > 0);
    ctx.globalAlpha = 1;
    ctx.shadowBlur  = 0;
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);
  requestAnimationFrame(draw);
}