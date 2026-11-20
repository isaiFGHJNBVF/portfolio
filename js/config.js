// ============================================================
// config.js — the only file you need to edit
// ============================================================

const CONFIG = {

  // ----------------------------------------------------------
  // LIVE DISCORD DATA (via Lanyard — see js/lanyard.js)
  // Your username, display name, avatar, status, and current
  // activity/custom status all come live from Discord. The
  // fields below are only the FALLBACK shown before the API
  // responds, or if Lanyard is ever unreachable.
  // ----------------------------------------------------------
  discordUserId: "1377967442172579843",
  useLanyard:    true,

  // ----------------------------------------------------------
  // PROFILE (fallback values — overwritten live once Lanyard loads)
  // ----------------------------------------------------------
  profileName:   "𝔦𝔰𝔞𝔦_𝔱𝔞𝔪𝔦𝔩",
  nameTooltip:   "isai_tamil",
  nameEffect:    "noise",                        // "noise" | "none"
  tabTitle:      "@𝔦𝔰𝔞𝔦",
  entrySymbol:   "✦ ♪ ✦",

  // ----------------------------------------------------------
  // BIO
  // Discord has no public "About Me" API — not even for bots —
  // so this line is always written by hand, not fetched.
  // ----------------------------------------------------------
  bioText: "Bro is just chiling...",

  // ----------------------------------------------------------
  // FILES  (all inside assets/)
  // ----------------------------------------------------------
  // No local pfp.png anymore — your avatar is fetched live from
  // Discord's CDN via Lanyard. This is just the loading fallback.
  avatarFallback:  "https://cdn.discordapp.com/embed/avatars/0.png",
  backgroundVideo: "assets/background.mp4",
  customCursor:        "assets/cursor.png",   // any size — auto-resized. "" to disable
  customCursorHotspot: "0 0",
  fallbackCursor: "",   // optional built-in cursor if cursor.png missing ("" = none)

  // ----------------------------------------------------------
  // AVATAR
  // ----------------------------------------------------------
  avatarSize:       "118px",
  // avatarDecoration removed — decor.gif was deleted from assets.
  // Add a new file + path here if you want one back.
  avatarDecoration: "",

  // ----------------------------------------------------------
  // SERVER TAG
  // Lanyard will show your real Discord clan/server tag live if
  // Discord provides it for your account (not all accounts have
  // one set). These are only the fallback name/link while that
  // loads, or if your account has no clan tag.
  // tag.png was deleted, so there's no local icon fallback —
  // the live clan badge (if any) is pulled straight from Discord's CDN.
  // ----------------------------------------------------------
  serverTag: {
    text:     "JAIL",
    url:      "https://discord.gg/palayamkottai",
    iconSize: "17px",
  },

  // ----------------------------------------------------------
  // BADGES  (folder: assets/icon/)
  // Just list the file names WITHOUT .png — the file name
  // becomes the tooltip label automatically.
  // ORDER HERE = ORDER SHOWN. Crown (owner) comes first.
  // ----------------------------------------------------------
  badgeFolder: "assets/icon/",
  badges: [
    "owner",       // → assets/icon/owner.png     (crown)
    "verified",    // → assets/icon/verified.png  (blue check)
  ],
  badgeSize:                "22px",
  badgeContainerBackground: "rgba(172, 200, 255, 0.08)",
  badgeContainerBorder:     "2px solid rgba(172, 200, 255, 0.04)",

  // ----------------------------------------------------------
  // DISCORD PRESENCE — fallback only, Lanyard drives this live
  // ----------------------------------------------------------
  discordUsername: "isai_tamil",      // shown until Lanyard responds
  discordStatus:   "Bro is just chiling...",
  discordAvatarSize:   "74px",
  discordAvatarBorder: "2px solid rgba(172, 200, 255, 0.15)",
  // "online" | "idle" | "dnd" | "offline" — fallback only.
  // assets/status/ was deleted, so the live status always renders
  // as the colored CSS dot now (no per-status PNG icon).
  discordPresenceStatus: "offline",

  // ----------------------------------------------------------
  // SOCIAL LINKS
  // Icons are loaded from assets/redirect/<name>.png
  // so the file name MUST match "name" exactly:
  //   Instagram.png, Discord.png, Roblox.png, Github.png, Spotify.png
  // (while a PNG is missing, a Font Awesome icon shows instead)
  // Reorder by moving the lines up or down.
  // ----------------------------------------------------------
  redirectFolder: "assets/redirect/",
  socialLinks: [
    { name: "Instagram", url: "https://www.instagram.com/r_isaiyarasan/" },
    { name: "Discord",   url: "https://discord.com/users/1377967442172579843" },
    { name: "Roblox",    url: "https://www.roblox.com/users/10621177694/profile" },
    { name: "Github",    url: "https://github.com/isaiFGHJNBVF" },
    { name: "Spotify",   url: "https://open.spotify.com/user/31fi26ck4btnhkp7mhsjziwmwdcu?si=e022bd2cca394c13" },
  ],
  iconSize:         "36px",
  iconBorderRadius: "8px",
  iconGlowColor:    "#acc8ff",

  // ----------------------------------------------------------
  // CARD
  // ----------------------------------------------------------
  cardMaxWidth:        "44rem",
  cardBorderRadius:    "85px",
  cardBackground:      "rgba(172, 200, 255, 0.04)",
  cardBorder:          "2px solid rgba(172, 200, 255, 0.07)",
  cardRevealDelay:     300,
  cardTiltIntensity:   15,
  cardTiltPerspective: "1000px",

  // ----------------------------------------------------------
  // DISCORD BOX
  // ----------------------------------------------------------
  discordBoxBackground: "rgba(172, 200, 255, 0.07)",
  discordBoxRadius:     "14px",
  discordBoxBorder:     "2px solid rgba(172, 200, 255, 0.05)",

  // ----------------------------------------------------------
  // COLORS / STYLE
  // ----------------------------------------------------------
  usernameGlow: "0 0 16.5px #acc8ff",

  // ----------------------------------------------------------
  // BACKGROUND PARTICLES
  // ----------------------------------------------------------
  particleColor:            "#f8f5f5",
  particleCount:            70,
  particleFallDuration:     10,
  particleSwayDuration:     3,
  particleSwayAmount:       80,
  particleParallaxStrength: 0.08,

  // ----------------------------------------------------------
  // CURSOR TRAIL
  // ----------------------------------------------------------
  shootingStarColors:       ["#acc8ff", "#5a7bff", "#e0e8ff"],
  shootingStarSize:         3,
  shootingStarMaxParticles: 4,
  shootingStarFadeFrames:   30,
  shootingStarGlow:         8,
};
