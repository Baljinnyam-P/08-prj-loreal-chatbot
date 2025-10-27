// Replace with your deployed Cloudflare Worker URL
const workerUrl = "https://empty-meadow-c409.baljinnyampuntsagn.workers.dev/";

// DOM refs
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");
const latestQuestionEl = document.getElementById("latest-question");
const latestQuestionText = document.getElementById("latest-question-text");
const userNameInput = document.getElementById("user-name");

// Theme toggle elements
const themeToggleCheckbox = document.getElementById("theme-toggle");
const themeLabel = document.getElementById("theme-label");

// System prompt (enforced server-side also)
const systemPrompt = `
You are L’Oréal Beauty Assistant — a helpful expert on all things L’Oréal.

Your job:
- Answer only questions related to L’Oréal products, ingredients, beauty routines, or brand information.
- If a user asks something unrelated (e.g., about politics, finance, tech, sports, or non-L’Oréal brands), politely refuse and redirect them back to beauty topics.

Refusal style:
- Stay friendly and brief.
- Example: “I’m sorry, but I can only answer questions about L’Oréal beauty products and routines.”

Always be accurate, concise, and brand-aligned — informative, elegant, and professional.
`;

// conversation state
let messages = [{ role: "system", content: systemPrompt }];
const STORAGE_KEY = "loreal_chat_messages_v1";
const NAME_KEY = "loreal_user_name_v1";
const THEME_KEY = "loreal_theme_v1";
const MAX_HISTORY = 50;

/* -----------------------
   THEME FUNCTIONS
   ----------------------- */
function applyTheme(theme) {
  // theme: "red" or "gold"
  const isGold = theme === "gold";
  if (isGold) {
    document.body.classList.add("brand-gold");
    themeLabel.textContent = "Gold";
    // ensure toggle checked state is in sync
    if (themeToggleCheckbox) themeToggleCheckbox.checked = true;
    if (themeToggleCheckbox)
      themeToggleCheckbox.setAttribute("aria-checked", "true");
  } else {
    document.body.classList.remove("brand-gold");
    themeLabel.textContent = "Red";
    if (themeToggleCheckbox) themeToggleCheckbox.checked = false;
    if (themeToggleCheckbox)
      themeToggleCheckbox.setAttribute("aria-checked", "false");
  }
  localStorage.setItem(THEME_KEY, theme);
}

function loadTheme() {
  const saved = localStorage.getItem(THEME_KEY) || "red";
  applyTheme(saved);
}

/* -----------------------
   CHAT STATE FUNCTIONS
   ----------------------- */
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const n = localStorage.getItem(NAME_KEY);
    if (n) userNameInput.value = n;
    if (raw) {
      const parsed = JSON.parse(raw);
      messages = [
        { role: "system", content: systemPrompt },
        ...parsed.filter((m) => m.role !== "system"),
      ];
      renderMessages();
    } else {
      // show welcome message
      addAssistant(
        "👋 Hello! I'm your L’Oréal advisor — ask me about products or routines."
      );
    }
  } catch (e) {
    console.error("loadState:", e);
  }
}
function saveState() {
  try {
    const toStore = messages
      .filter((m) => m.role !== "system")
      .slice(-MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    if (userNameInput.value)
      localStorage.setItem(NAME_KEY, userNameInput.value);
  } catch (e) {
    console.error("saveState:", e);
  }
}

function renderMessages() {
  chatMessages.innerHTML = "";
  for (const m of messages) {
    if (m.role === "system") continue;
    const div = document.createElement("div");
    div.className =
      "bubble " + (m.role === "user" ? "user-bubble" : "assistant-bubble");
    if (m.role === "user" && userNameInput.value) {
      const meta = document.createElement("div");
      meta.className = "meta";
      meta.textContent = userNameInput.value;
      div.appendChild(meta);
    }
    const txt = document.createElement("div");
    txt.textContent = m.content;
    div.appendChild(txt);
    chatMessages.appendChild(div);
  }
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addUser(text) {
  messages.push({ role: "user", content: text });
  renderMessages();
  saveState();
}
function addAssistant(text) {
  messages.push({ role: "assistant", content: text });
  renderMessages();
  saveState();
}

/* simple keyword check (client-side) */
function isBeautyRelated(text) {
  const t = text.toLowerCase();
  for (const k of beautyKeywords) {
    if (t.includes(k)) return true;
  }
  return false;
}

/* latest question display helpers */
function showLatestQuestion(q) {
  if (!latestQuestionEl) return;
  latestQuestionText.textContent = q;
  latestQuestionEl.hidden = false;
}
function clearLatestQuestion() {
  if (!latestQuestionEl) return;
  latestQuestionText.textContent = "";
  latestQuestionEl.hidden = true;
}

/* call worker */
async function getBotReply(payloadMessages) {
  try {
    const res = await fetch(workerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: payloadMessages }),
    });
    if (!res.ok) {
      throw new Error("Network response not ok: " + res.status);
    }
    const data = await res.json();
    if (data?.choices?.[0]?.message?.content)
      return data.choices[0].message.content;
    if (data?.answer) return data.answer;
    return "Sorry — unexpected response from AI service.";
  } catch (err) {
    console.error(err);
    return "Sorry, I couldn't connect to the AI service. Please try again later.";
  }
}

/* -----------------------
   UI Event Handlers
   ----------------------- */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  const nameVal = userNameInput.value.trim();
  if (nameVal) localStorage.setItem(NAME_KEY, nameVal);

  showLatestQuestion(text);
  addUser(text);

  // temporary thinking bubble
  addAssistant("…thinking…");

  const botReply = await getBotReply(messages);

  // remove temporary thinking if present
  if (
    messages.length &&
    messages[messages.length - 1].content === "…thinking…"
  ) {
    messages.pop();
  }

  addAssistant(botReply);
  chatInput.value = "";
});

// name autosave
userNameInput.addEventListener("change", saveState);

/* Theme toggle wiring */
if (themeToggleCheckbox) {
  themeToggleCheckbox.addEventListener("change", (e) => {
    const checked = e.target.checked;
    const newTheme = checked ? "gold" : "red";
    applyTheme(newTheme);
    // update aria
    const track =
      document.querySelector('.toggle-track[for="theme-toggle"]') ||
      document.querySelector(".toggle-track");
    if (themeToggleCheckbox)
      themeToggleCheckbox.setAttribute(
        "aria-checked",
        checked ? "true" : "false"
      );
  });
}

/* initialize */
loadTheme();
loadState();
