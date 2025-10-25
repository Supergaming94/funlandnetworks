// main.js — FunLand Network (neon theme)
// Server IP used in buttons:
const SERVER_IP = 'play.funlandnetwork.net';
const DISCORD_INVITE = 'https://discord.gg/v5aHss2GRv';

// announcements (replace later by fetching a JSON/API)
const announcements = [
  "New Survival Map coming soon 🚀",
  "Double XP weekend is live!",
  "Halloween event coming October 31 🎃",
  "Follow Discord for launch updates!"
];

// populate announcements
const announcementList = document.getElementById('announcement-list');
if (announcementList) {
  announcements.forEach(text => {
    const li = document.createElement('li');
    li.textContent = text;
    announcementList.appendChild(li);
  });
}

// year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Toast helper
const toast = document.getElementById('toast');
function showToast(msg, time = 2200) {
  if (!toast) return;
  toast.textContent = msg;
  toast.style.display = 'block';
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, time - 300);
  setTimeout(() => { toast.style.display = 'none'; }, time);
}

// copy to clipboard (GRACEFUL fallback)
async function copyText(text) {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copied: ' + text);
  } catch (err) {
    // fallback: create a temporary input
    const tmp = document.createElement('input');
    tmp.value = text;
    document.body.appendChild(tmp);
    tmp.select();
    try {
      document.execCommand('copy');
      showToast('Copied: ' + text);
    } catch {
      showToast('Copy failed — manual copy: ' + text, 4200);
    }
    tmp.remove();
  }
}

// IP copy button
const ipBtn = document.getElementById('ip-copy');
if (ipBtn) {
  ipBtn.addEventListener('click', () => copyText(SERVER_IP));
}

// Play now button (copy IP + friendly message)
const playNow = document.getElementById('play-now');
if (playNow) {
  playNow.addEventListener('click', async () => {
    await copyText(SERVER_IP);
    showToast('IP copied — paste in Minecraft (Ctrl+V)'); 
  });
}

// copy IP CTA in join section
const copyIpCta = document.getElementById('copy-ip-cta');
if (copyIpCta) {
  copyIpCta.addEventListener('click', () => copyText(SERVER_IP));
}

// small nicety: clicking the logo scrolls home
const logo = document.querySelector('.logo');
if (logo) logo.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

// Accessibility: open discord on keyboard ENTER when focused
const discordBtns = document.querySelectorAll('.discord-btn, a[href^="https://discord.gg"]');
discordBtns.forEach(b => {
  b.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') window.open(DISCORD_INVITE, '_blank', 'noopener');
  });
});

/* ===== rules page script (append) ===== */
(function(){
  // Tabs
  const tabs = document.querySelectorAll('.tab-list .tab');
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    // if you want to filter table by tab later, add logic here.
  }));

  // Rule row modal: clicking rule shows modal with explanation (sample)
  const ruleModal = document.getElementById('ruleModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');

  const ruleExplanations = {
    "Account/real money/third-party trading": "Trading, buying or selling accounts or in-game items for real currency or third-party sites is forbidden. This includes promises to transfer items, accounts or payments outside official store systems.",
    "Advertising": "Advertising other servers or services without staff permission is prohibited. Advertising includes messages, links, invites, or promotions in chat/Discord/forums.",
    "Ban evasion": "Attempting to rejoin after being banned using a different account or IP is ban evasion and will be punished permanently.",
    "Blackmailing": "Threatening players or staff and demanding items, ranks, or actions is forbidden and results in severe punishment.",
    "Boosting": "Cooperating to unfairly pump stats or circumvent matchmaking is prohibited. Boosting may lead to bans.",
    "Causing drama purposely": "Deliberately causing arguments or upset to disrupt the community is not allowed; repeated offences escalate punishments.",
    "Chargebacking": "Filing a chargeback after real purchases causes permanent action and account penalties.",
    "Cheating": "Using illegal modifications, ghost/hacked clients, auto-clickers, macros and any other clients/mods that give you an advantage over other players. Using the Minecraft 1.12+ keybind auto-clicking option and putting an item on your mouse while playing are covered by this rule.",
    "Cyber/DDoS/death threats/wishes":"Threatening to negatively impact someone's internet connection, kill/severely harm them or perform any other negative cyber/DDoS/death threats/wishes against a player or the server. Swatting threats and any sort of encouraging suicide (even as a joke and/or via abbreviations) falls under this rule.",
    "Discrimination":"Being homophobic, racist or offensive towards religions, nations or races.",
    "Doxxing (threats)":"Sharing very personal or private information of other players or threatening to do so.",
    "Duping":"Using some sort of exploit in order to duplicate items/money or any similar behaviour.",
    "Encouraging breaking the rules":"Encouraging other players to do something against the rules.",
    "Exploiting/illegal items":"Abusing bugs and glitches that give you an advantage over other players or having items that are not obtainable in a legitimate way (e.g. command blocks and overpowered potions).Breaking this rule may result in a stat reset depending on the case.",
    "Falsifying evidence":"Using forged evidence in order to obtain something which you are not entitled to, getting someone punished for something they have not done or anything related.",
    "Forbidden files/links":"Sending files/links to hacked clients or websites that could be an IP logger or download malware. Unknown, unclear and suspicious links are covered by this rule.",
    "Foreign language":"Speaking in a non-English language in the public chat.This rule only applies to the public chat in-game.",
    "Illegal trapping/killing methods":"Locking up other players in portals or using teleport commands to teleport other players to you in order to kill or trap them. Killing or attempting to kill a player while not being in a PvP zone on Survival or (OP) SkyBlock falls under this rule.This rule does not apply to (OP) Lifesteal.",
    "Inappropriate capes/skins":"Capes and skins that contain discriminatory, sexual, swearing or any other type of inappropriate content.",
    "Inappropriate usernames":"Usernames that contain anything related to diseases, discrimination, sexual content and swearing content. Also includes extremely inappropriate different variants.",
    "Lag machines":"Machines which intentionally cause server lag.",
    "Media advertising":"Advertising social media accounts or sending links to YouTube videos or channels that are not related to FunLandNetwork.",
    "Mute evasion":"Using the chat to communicate with other players while another account of you is IP-muted.This rule does not apply if the account in question is IP-muted for mute evasion.",
    "Negative behaviour":"Being rude towards other players. Inappropriate behaviour not covered by the other rules may fall under this rule.This rule does not apply to group (e.g. party and guild) chats and friend messages (/fmsg), but it does apply to private messages (/msg) and all other chats.",
    "Negative use of disabilities/diseases":"Using disabilities and diseases in a negative way or context.",
    "Scamming":"Purposely deceiving other players in trades and other dishonest transactions.Scamming is not punishable on OP Lifesteal unless the trade involves FunLandNetwork gold or donator ranks.",
    "Seizure triggering content":"Sharing content which can damage people's hearing or eyesight.This rule cannot be broken in-game.",
    "Sexual content":"Sharing sexual content and describing sexual actions. Mentioning genitals and other sexual words is covered by this rule.",
    "Spamming commands":"Constantly executing the same or similar command with the intention to inconvenience other players.",
    "Spamming/flooding":"Sending messages such as 'helloooooooooooooooooooooooooooooooooo' that flood the chat and constantly sending the same or similar message with the intention to flood the chat.This rule does not apply to group (e.g. party and guild) chats and friend messages (/fmsg), but it does apply to private messages (/msg) and all other chats.",
    "Staff impersonating":"Pretending to be a staff member or claiming to have staff permissions.",
    "Swearing":"Using profanity or swear words, even when they are not directed towards anyone.This rule does not apply to group (e.g. party and guild) chats and friend messages (/fmsg), but it does apply to private messages (/msg) and all other chats.",
    "Teaming with cheaters":"Intentionally teaming with cheaters.",
  };

  document.querySelectorAll('.rule-name').forEach(el => {
    el.addEventListener('click', () => {
      const title = el.textContent.trim();
      modalTitle.textContent = title;
      modalBody.textContent = ruleExplanations[title] || "Detailed explanation coming soon.";
      ruleModal.classList.add('show');
      ruleModal.setAttribute('aria-hidden', 'false');
    });
  });

  modalClose?.addEventListener('click', () => {
    ruleModal.classList.remove('show');
    ruleModal.setAttribute('aria-hidden', 'true');
  });

  ruleModal?.addEventListener('click', (e) => {
    if (e.target === ruleModal) {
      ruleModal.classList.remove('show');
      ruleModal.setAttribute('aria-hidden', 'true');
    }
  });

  // Search: filter table rows by text
  const rulesSearch = document.getElementById('rulesSearch');
  rulesSearch?.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    const rows = document.querySelectorAll('#rulesTable tbody tr');
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(q) ? '' : 'none';
    });
  });

  // Report / Appeal buttons — these can open specific pages or Discord tickets
  document.getElementById('btn-report')?.addEventListener('click', () => {
    // opens Discord report channel in new tab (example). Replace link if you have a web ticket system.
    window.open('https://discord.gg/v5aHss2GRv', '_blank', 'noopener');
    // or show a modal/instructions
  });
  document.getElementById('btn-appeal')?.addEventListener('click', () => {
    // open support page or show instructions
    window.location.href = 'support.html';
  });

})();

