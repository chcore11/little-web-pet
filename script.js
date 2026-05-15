const petWrap = document.querySelector("#petWrap");
const stage = document.querySelector("#stage");
const speechBubble = document.querySelector("#speechBubble");
const clickCount = document.querySelector("#clickCount");
const particleLayer = document.querySelector("#particleLayer");
const petButton = document.querySelector("#petButton");
const workButton = document.querySelector("#workButton");
const phraseButton = document.querySelector("#phraseButton");

const phrases = [
  "今天也只是普通地待机。",
  "我在这里，基本上没有造成任何生产事故。",
  "刚才那个动作是计划内的。",
  "保持可爱需要一点点 CPU。",
  "请稍等，我正在假装听懂。"
];

const clickPhrases = [
  "哎呀，点到小狗了。",
  "收到一次有效点击。",
  "这里弹了一下，应该很合理。",
  "小狗确认：手感不错。"
];

const petPhrases = [
  "摸摸已接收。",
  "头顶温度略微上升。",
  "小狗决定暂时原谅这个世界。",
  "再摸一下也不是不行。"
];

const workPhrases = [
  "正在努力工作中……但好像只是换了个姿势。",
  "小狗正在加载聪明模块……加载失败。",
  "它看起来很努力，其实只是在发呆。"
];

const attentionPhrases = [
  "我刚刚是不是动了一下？",
  "别看了，我确实在营业。",
  "检测到路过的人类。"
];

const state = {
  mode: "idle",
  clicks: 0,
  attentionTimer: 0,
  actionTimer: 0,
  phraseIndex: -1,
  dragging: false,
  dragStarted: false,
  pointerId: null,
  startX: 0,
  startY: 0,
  dragX: 0,
  dragY: 0,
  settleTimer: 0
};

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function setSpeech(text, fade = false) {
  if (!fade) {
    speechBubble.textContent = text;
    return;
  }

  speechBubble.classList.add("is-changing");
  window.setTimeout(() => {
    speechBubble.textContent = text;
    speechBubble.classList.remove("is-changing");
  }, 180);
}

function setControlsDisabled(disabled) {
  petButton.disabled = disabled;
  workButton.disabled = disabled;
  phraseButton.disabled = disabled;
  petWrap.setAttribute("aria-busy", disabled ? "true" : "false");
}

function setMode(mode, className, duration, after) {
  if (state.mode !== "idle") {
    return false;
  }

  window.clearTimeout(state.actionTimer);
  state.mode = mode;
  petWrap.classList.add(className);
  const shouldLockControls = mode !== "attention";

  if (shouldLockControls) {
    setControlsDisabled(true);
  }

  state.actionTimer = window.setTimeout(() => {
    petWrap.classList.remove(className);
    state.mode = "idle";

    if (shouldLockControls) {
      setControlsDisabled(false);
      scheduleAttention();
    }

    if (after) {
      after();
    }
  }, duration);

  return true;
}

function nextPhrase() {
  state.phraseIndex = (state.phraseIndex + 1) % phrases.length;
  return phrases[state.phraseIndex];
}

function spawnParticles(type, amount) {
  const stageRect = stage.getBoundingClientRect();
  const petRect = petWrap.getBoundingClientRect();
  const baseX = petRect.left + petRect.width / 2 - stageRect.left;
  const baseY = petRect.top + petRect.height * 0.42 - stageRect.top;
  const colors = ["#e87761", "#e7b84c", "#8fc7d5", "#ffffff"];

  for (let index = 0; index < amount; index += 1) {
    const particle = document.createElement("span");
    const shape = type === "pet" ? (index % 2 ? "star" : "dot") : type === "work" ? "bubble" : "dot";
    const size = 8 + Math.random() * 9;
    const spread = type === "click" ? 44 : 64;
    const x = baseX + (Math.random() - 0.5) * spread;
    const y = baseY + (Math.random() - 0.5) * 34;
    const dx = `${(Math.random() - 0.5) * 70}px`;
    const dy = `${-48 - Math.random() * 54}px`;

    particle.className = `particle ${shape}`;
    particle.style.setProperty("--x", `${x}px`);
    particle.style.setProperty("--y", `${y}px`);
    particle.style.setProperty("--dx", dx);
    particle.style.setProperty("--dy", dy);
    particle.style.setProperty("--size", `${size}px`);
    particle.style.setProperty("--spin", `${Math.random() * 180 - 90}deg`);
    particle.style.setProperty("--duration", `${620 + Math.random() * 280}ms`);
    particle.style.setProperty("--color", colors[index % colors.length]);

    particleLayer.appendChild(particle);
    particle.addEventListener("animationend", () => particle.remove(), { once: true });
  }
}

function handleDogClick() {
  if (state.dragStarted || state.mode !== "idle") {
    state.dragStarted = false;
    return;
  }

  state.clicks += 1;
  clickCount.textContent = state.clicks;
  setSpeech(randomItem(clickPhrases), true);
  spawnParticles("click", 5);
  setMode("click", "is-clicking", 540);
}

function handlePet() {
  if (!setMode("pet", "is-petting", 780)) {
    return;
  }

  setSpeech(randomItem(petPhrases), true);
  spawnParticles("pet", 4);
}

function handleWork() {
  if (!setMode("work", "is-working", 1050, () => spawnParticles("work", 4))) {
    return;
  }

  setSpeech(randomItem(workPhrases), true);
}

function handlePhrase() {
  if (!setMode("phrase", "is-nodding", 580)) {
    return;
  }

  setSpeech(nextPhrase(), true);
}

function scheduleAttention() {
  window.clearTimeout(state.attentionTimer);
  const delay = 5000 + Math.random() * 4000;
  state.attentionTimer = window.setTimeout(() => {
    if (state.mode === "idle" && !state.dragging) {
      setSpeech(randomItem(attentionPhrases), true);
      setMode("attention", "is-attention", 760);
    }
    scheduleAttention();
  }, delay);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function updateDrag(x, y) {
  petWrap.style.setProperty("--drag-x", `${x}px`);
  petWrap.style.setProperty("--drag-y", `${y}px`);
}

function startDrag(event) {
  if (state.mode !== "idle") {
    return;
  }

  state.dragging = true;
  state.dragStarted = false;
  state.pointerId = event.pointerId;
  state.startX = event.clientX;
  state.startY = event.clientY;
  petWrap.setPointerCapture(event.pointerId);
}

function moveDrag(event) {
  if (!state.dragging || event.pointerId !== state.pointerId) {
    return;
  }

  const stageRect = stage.getBoundingClientRect();
  const petRect = petWrap.getBoundingClientRect();
  const limitX = Math.max(0, (stageRect.width - petRect.width) / 2 - 8);
  const limitY = Math.max(0, (stageRect.height - petRect.height) / 2 - 28);
  const nextX = clamp(event.clientX - state.startX, -limitX, limitX);
  const nextY = clamp(event.clientY - state.startY, -limitY, limitY);

  if (Math.abs(nextX) + Math.abs(nextY) > 7) {
    state.dragStarted = true;
    petWrap.classList.add("is-dragging");
  }

  state.dragX = nextX;
  state.dragY = nextY;
  updateDrag(nextX, nextY);
}

function endDrag(event) {
  if (!state.dragging || event.pointerId !== state.pointerId) {
    return;
  }

  state.dragging = false;
  state.pointerId = null;
  petWrap.classList.remove("is-dragging");
  petWrap.classList.add("is-settling");
  updateDrag(state.dragX * 0.16, state.dragY * 0.16);

  window.clearTimeout(state.settleTimer);
  state.settleTimer = window.setTimeout(() => {
    petWrap.classList.remove("is-settling");
  }, 470);

  window.setTimeout(() => {
    state.dragX = 0;
    state.dragY = 0;
    updateDrag(0, 0);
  }, 120);
}

petWrap.addEventListener("click", handleDogClick);
petWrap.addEventListener("pointerdown", startDrag);
petWrap.addEventListener("pointermove", moveDrag);
petWrap.addEventListener("pointerup", endDrag);
petWrap.addEventListener("pointercancel", endDrag);
petButton.addEventListener("click", handlePet);
workButton.addEventListener("click", handleWork);
phraseButton.addEventListener("click", handlePhrase);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    window.clearTimeout(state.attentionTimer);
    return;
  }

  if (state.mode === "idle") {
    scheduleAttention();
  }
});

scheduleAttention();
