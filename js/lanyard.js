// ============================================================
// lanyard.js — live Discord presence via Lanyard
// (https://github.com/Phineas/lanyard)
//
// Fetches your real username, display name, avatar, status and
// current activity/custom status, then keeps them updated in
// real time over a WebSocket. No API key needed, but Lanyard is
// a third-party free service with no uptime guarantee — if it's
// ever down, the page just keeps showing the config.js fallback
// values that js/script.js already painted.
//
// NOTE: Discord has no public "About Me" bio field in ANY API
// (bot or otherwise), so bio is never fetched here — it's the
// manually-written CONFIG.bioText, handled entirely in script.js.
// ============================================================

(function () {
  const USER_ID = CONFIG.discordUserId;
  if (!CONFIG.useLanyard || !USER_ID) return;

  const REST_URL   = `https://api.lanyard.rest/v1/users/${USER_ID}`;
  const SOCKET_URL = "wss://api.lanyard.rest/socket";

  let socket;
  let heartbeatTimer;
  let reconnectDelay = 2000;

  // -- Build a real Discord CDN avatar URL from the user object --
  function avatarUrl(user) {
    if (!user.avatar) {
      // No custom avatar set — Discord's default avatar, picked the
      // same way Discord itself picks it.
      let idx;
      try {
        idx = user.discriminator && user.discriminator !== "0"
          ? Number(user.discriminator) % 5
          : Number((BigInt(user.id) >> 22n) % 6n);
      } catch {
        idx = 0;
      }
      return `https://cdn.discordapp.com/embed/avatars/${idx}.png`;
    }
    const ext = user.avatar.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=256`;
  }

  const STATUS_LABEL = { online: "Online", idle: "Idle", dnd: "Do Not Disturb", offline: "Offline" };

  // -- The small line under the username --
  // Only ever a custom status (the emoji + text you set yourself) or,
  // if you haven't set one, your plain online/idle/dnd label. Game,
  // Spotify, streaming, etc. never appear here any more — those get
  // the full rich-presence card instead (see renderRichPresence).
  function statusLine(data) {
    const custom = (data.activities || []).find((a) => a.type === 4);
    if (custom && (custom.state || custom.emoji)) {
      const emoji = custom.emoji ? custom.emoji.name : "";
      return [emoji, custom.state || ""].filter(Boolean).join(" ").trim();
    }
    const valid = ["online", "idle", "dnd", "offline"].includes(data.discord_status)
      ? data.discord_status
      : "offline";
    return STATUS_LABEL[valid];
  }

  // -- Resolve a Discord activity's image fields to a real URL --
  // Handles the three formats Discord actually sends: a raw app-asset
  // id, an external image proxied through "mp:external/...", or (for
  // Spotify specifically) a "spotify:<id>" cover-art reference.
  function resolveActivityImage(activity, key) {
    if (!activity.assets) return null;
    const img = activity.assets[key];
    if (!img) return null;
    if (img.startsWith("mp:external/")) {
      return "https://media.discordapp.net/external/" + img.slice("mp:external/".length);
    }
    if (img.startsWith("spotify:")) {
      return "https://i.scdn.co/image/" + img.slice("spotify:".length);
    }
    return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${img}.png`;
  }

  function fmtTime(ms) {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  // -- The big expanding card: image + full details of whatever
  // activity (game, Spotify, streaming...) is actually running --
  function renderRichPresence(data) {
    const card = document.getElementById("rich-presence");
    if (!card) return;

    const activity = (data.activities || []).find((a) => a.type !== 4); // skip Custom Status
    const isSpotify = data.listening_to_spotify && data.spotify;

    if (!activity && !isSpotify) {
      card.hidden = true;
      return;
    }

    const nameEl    = document.getElementById("rp-name");
    const detailsEl = document.getElementById("rp-details");
    const stateEl   = document.getElementById("rp-state");
    const largeImg  = document.getElementById("rp-large-image");
    const smallImg  = document.getElementById("rp-small-image");
    const progressWrap = document.getElementById("rp-progress-wrap");
    const progressFill = document.getElementById("rp-progress-fill");
    const elapsedEl = document.getElementById("rp-time-elapsed");
    const totalEl   = document.getElementById("rp-time-total");
    const plainTimeEl = document.getElementById("rp-time-plain");

    progressWrap.hidden = true;
    plainTimeEl.hidden = true;
    smallImg.style.display = "none";

    if (isSpotify) {
      const sp = data.spotify;
      nameEl.textContent    = sp.song || "";
      detailsEl.textContent = sp.artist ? `by ${sp.artist}` : "";
      stateEl.textContent   = sp.album ? `on ${sp.album}` : "";
      largeImg.src = sp.album_art_url || "";
      largeImg.alt = sp.song || "Spotify";

      const start = sp.timestamps?.start;
      const end   = sp.timestamps?.end;
      if (start && end && end > start) {
        const now = Date.now();
        const pct = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
        progressFill.style.width = pct + "%";
        elapsedEl.textContent = fmtTime(now - start);
        totalEl.textContent   = fmtTime(end - start);
        progressWrap.hidden = false;
      }
    } else {
      const verbs = { 0: "Playing", 1: "Streaming", 2: "Listening to", 3: "Watching", 5: "Competing in" };
      nameEl.textContent    = [verbs[activity.type], activity.name].filter(Boolean).join(" ");
      detailsEl.textContent = activity.details || "";
      stateEl.textContent   = activity.state || "";

      const largeUrl = resolveActivityImage(activity, "large_image");
      const smallUrl = resolveActivityImage(activity, "small_image");
      largeImg.src = largeUrl || CONFIG.avatarFallback;
      largeImg.alt = activity.assets?.large_text || activity.name || "";
      if (smallUrl) {
        smallImg.src = smallUrl;
        smallImg.alt = activity.assets?.small_text || "";
        smallImg.style.display = "block";
      }

      const start = activity.timestamps?.start;
      if (start) {
        plainTimeEl.textContent = `Elapsed ${fmtTime(Date.now() - start)}`;
        plainTimeEl.hidden = false;
      }
    }

    card.hidden = false;
  }

  // Keep the latest payload around so the ticker (below) can re-render
  // elapsed time / progress bars every second without waiting for a
  // fresh WebSocket event.
  let lastData = null;

  // -- Apply one Lanyard payload to the DOM --
  function applyData(data) {
    const user = data.discord_user;
    if (!user) return;
    lastData = data;

    const displayName = user.global_name || user.username;

    // Big name at the top of the card
    const nameTextEl = document.getElementById("name-text");
    const nameTooltipEl = document.getElementById("name-tooltip");
    if (nameTextEl) nameTextEl.textContent = displayName;
    if (nameTooltipEl) nameTooltipEl.textContent = `@${user.username}`;

    // Main avatar + presence-box avatar — both are the same live image
    const url = avatarUrl(user);
    const avatarEl = document.getElementById("avatar");
    const discordAvatarEl = document.getElementById("discord-avatar");
    if (avatarEl) avatarEl.src = url;
    if (discordAvatarEl) discordAvatarEl.src = url;

    // Browser tab icon — same live avatar, swapped in once (not every
    // update) since the tab icon doesn't need to track second-by-second.
    const faviconEl = document.getElementById("favicon");
    if (faviconEl && faviconEl.href !== url) faviconEl.href = url;

    // Username + small status line (custom status or plain "Online" etc.)
    const usernameEl = document.getElementById("discord-username");
    const activityEl = document.getElementById("discord-activity");
    if (usernameEl) usernameEl.textContent = user.username;
    if (activityEl) activityEl.textContent = statusLine(data);

    // The big expanding card — only visible while something is running
    renderRichPresence(data);

    // Status dot
    const statusDot = document.getElementById("discord-status-dot");
    if (statusDot) {
      const valid = ["online", "idle", "dnd", "offline"].includes(data.discord_status)
        ? data.discord_status
        : "offline";
      statusDot.hidden = false;
      statusDot.className = "status-" + valid;
    }

    // Server/clan tag — only some accounts have this set on Discord's
    // side, and Lanyard's field for it has changed names over time
    // (clan -> primary_guild), so we check both and fall back to the
    // manual config tag if neither is present.
    const clan = user.primary_guild || user.clan;
    const tagEls = [document.getElementById("server-tag"), document.getElementById("server-tag-2")];
    if (clan && clan.tag) {
      tagEls.forEach((el) => {
        if (!el) return;
        const text = el.querySelector(".server-tag-text");
        const img  = el.querySelector(".server-tag-icon");
        if (text) { text.textContent = clan.tag; text.style.display = ""; }
        if (img && clan.badge && clan.identity_guild_id) {
          img.src = `https://cdn.discordapp.com/clan-badges/${clan.identity_guild_id}/${clan.badge}.png?size=16`;
          img.style.display = "";
        }
        el.hidden = false;
      });
    }
    // If Discord reports no clan tag, leave whatever script.js already
    // painted from CONFIG.serverTag (text-only, manual) alone.
  }

  // -- Initial paint: plain REST call --
  fetch(REST_URL)
    .then((r) => r.json())
    .then((res) => {
      if (res.success) applyData(res.data);
    })
    .catch((err) => console.warn("[lanyard] initial fetch failed:", err));

  // -- Live updates: WebSocket subscription --
  function connect() {
    socket = new WebSocket(SOCKET_URL);

    socket.onopen = () => {
      reconnectDelay = 2000; // reset backoff on a successful connect
      socket.send(JSON.stringify({ op: 2, d: { subscribe_to_id: USER_ID } }));
    };

    socket.onmessage = (event) => {
      let msg;
      try {
        msg = JSON.parse(event.data);
      } catch {
        return;
      }

      switch (msg.op) {
        case 1: // Hello — start heartbeating at the server's requested interval
          clearInterval(heartbeatTimer);
          heartbeatTimer = setInterval(() => {
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({ op: 3 }));
            }
          }, msg.d.heartbeat_interval);
          break;

        case 0: // Event — INIT_STATE on first connect, PRESENCE_UPDATE after
          if (msg.t === "INIT_STATE" || msg.t === "PRESENCE_UPDATE") {
            applyData(msg.d);
          }
          break;
      }
    };

    socket.onclose = () => {
      clearInterval(heartbeatTimer);
      setTimeout(connect, reconnectDelay);
      reconnectDelay = Math.min(reconnectDelay * 2, 30000); // back off up to 30s
    };

    socket.onerror = () => socket.close();
  }

  connect();

  // Re-render every second so elapsed time and the Spotify progress
  // bar move smoothly instead of jumping only on each presence event.
  setInterval(() => {
    if (lastData) renderRichPresence(lastData);
  }, 1000);
})();
