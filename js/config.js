// ============================================================
// config.js — the only file you need to edit
// ============================================================

const CONFIG = {

  // ----------------------------------------------------------
  // PROFILE
  // ----------------------------------------------------------
  profileName:   "𝔦𝔰𝔞𝔦_𝔱𝔞𝔪𝔦𝔩",
  nameTooltip:   "isai_tamil",
  nameEffect:    "noise",                        // "noise" | "none"
  statusText:    "Bro is just chiling...",
  tabTitle:      "@𝔦𝔰𝔞𝔦",
  entrySymbol:   "✦ ♪ ✦",

  // ----------------------------------------------------------
  // FILES  (all inside assets/)
  // ----------------------------------------------------------
  avatar:          "assets/pfp.png",     // your profile picture
  avatarFallback:  "https://cdn.discordapp.com/avatars/1377967442172579843/a0bae70c8f3582ff93d678f43190a29f.png?size=4096", // used only if pfp.png is missing
  backgroundVideo: "assets/background.mp4",
  customCursor:        "assets/cursor.png",   // any size — auto-resized. "" to disable
  customCursorHotspot: "0 0",
  fallbackCursor: "",   // optional built-in cursor if cursor.png missing ("" = none)

  // ----------------------------------------------------------
  // AVATAR
  // ----------------------------------------------------------
  avatarSize:       "118px",
  avatarDecoration: "assets/decor.gif",   // your gif decoration. "" to disable

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
  // DISCORD (static — no API, edit manually)
  // ----------------------------------------------------------
  discordUsername: "isai_tamil",
  discordStatus:   "Bro is just chiling...",
  discordAvatar:   "assets/pfp.png",      // uses your pfp
  discordAvatarSize:   "74px",
  discordAvatarBorder: "2px solid rgba(172, 200, 255, 0.15)",
  // "online" | "idle" | "dnd" | "offline"
  // icon is loaded from:  assets/status/<status>.png
  // so your file must be: assets/status/dnd.png
  discordPresenceStatus: "dnd",
  statusIconFolder: "assets/status/",

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