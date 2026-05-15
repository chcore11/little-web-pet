const dogButton = document.querySelector("#dogButton");
const stage = document.querySelector("#stage");
const speechBubble = document.querySelector("#speechBubble");
const clickCount = document.querySelector("#clickCount");
const particleLayer = document.querySelector("#particleLayer");
const petButton = document.querySelector("#petButton");
const workButton = document.querySelector("#workButton");
const phraseButton = document.querySelector("#phraseButton");

const phraseTexts = [
  "你戳我一下，我就假装很有用。",
  "今日建议：少内耗，多吃饭。",
  "烦人的事情先放旁边，我帮你盯着。",
  "检测到有人路过，自动发送一点点好运。",
  "电子糖已发放，热量为 0。",
  "我没有什么功能，但我情绪价值还行。",
  "如果今天有点累，那就先休息一下。",
  "我只是一只网页生物，不负责解决问题，但负责装可爱。"
];

const clickTexts = [
  "检测到你点了它，它决定假装很忙。",
  "你戳我一下，我就假装很有用。",
  "电子糖已发放，热量为 0。",
  "我没有什么功能，但我情绪价值还行。"
];

const petTexts = [
  "收到摸摸，开心值 +1。",
  "如果今天有点累，那就先休息一下。",
  "烦人的事情先放旁边，我帮你盯着。",
  "小狗收到一点点鼓励，尾巴开始加班。"
];

const workTexts = [
  "正在努力工作中……但好像只是换了个姿势。",
  "小狗正在加载聪明模块……加载失败。",
  "它看起来很努力，其实只是在发呆。",
  "检测到你点了它，它决定假装很忙。"
];

const attentionTexts = [
  "检测到有人路过，自动发送一点点好运。",
  "我刚刚歪头了，说明我在思考。",
  "路过也算相遇，先给你点个头。",
  "小狗正在低功耗待机。"
];

const expressions = ["expression-normal", "expression-happy", "expression-comfy", "expression-work", "expression-daze"];

const state = {
  mode: "idle",
  clicks: 0,
  phraseIndex: 0,
  actionTimer: 0,
  attentionTimer: 0,
  blinkTimer: 0,
  settleTimer: 0,
  expressionTimer: 0,
  dragging: false,
  dragStarted: false,
  pointerId: null,
  startX: 0,
  startY: 0,
  dragX: 0,
  dragY: 0
};

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function setSpeech(text, fade = true) {
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

function setExpression(name) {
  dogButton.classList.remove(...expressions);
  dogButton.classList.add(name);
}

function flashExpression(name, duration = 700) {
  window.clearTimeout(state.expressionTimer);
  setExpression(name);
  state.expressionTimer = window.setTimeout(() => setExpression("expression-normal"), duration);
}

function setControlsDisabled(disabled) {
  petButton.disabled = disabled;
  workButton.disabled = disabled;
  phraseButton.disabled = disabled;
  dogButton.setAttribute("aria-busy", disabled ? "true" : "false");
}

function setMode(mode, className, duration, expression, after) {
  if (state.mode !== "idle") {
    return false;
  }

  window.clearTimeout(state.actionTimer);
  state.mode = mode;
  dogButton.classList.add(className);
  setExpression(expression);

  const lockControls = mode !== "attention";
  if (lockControls) {
    setControlsDisabled(true);
  }

  state.actionTimer = window.setTimeout(() => {
    dogButton.classList.remove(className);
    setExpression("expression-normal");
    state.mode = "idle";

    if (lockControls) {
      setControlsDisabled(false);
      scheduleAttention();
    }

    if (after) {
      after();
    }
  }, duration);

  return true;
}

function spawnParticles(type, amount) {
  const stageRect = stage.getBoundingClientRect();
  const dogRect = dogButton.getBoundingClientRect();
  const baseX = dogRect.left + dogRect.width / 2 - stageRect.left;
  const baseY = dogRect.top + dogRect.height * 0.45 - stageRect.top;
  const colors = ["#ef9c7e", "#e5b64a", "#8fc7d5", "#ffffff"];

  for (let index = 0; index < amount; index += 1) {
    const particle = document.createElement("span");
    const shape = type === "pet" ? (index % 2 ? "star" : "dot") : type === "work" ? "bubble" : index % 2 ? "star" : "dot";
    const size = 8 + Math.random() * 9;
    const x = baseX + (Math.random() - 0.5) * 80;
    const y = baseY + (Math.random() - 0.5) * 40;
    const dx = `${(Math.random() - 0.5) * 76}px`;
    const dy = `${-54 - Math.random() * 58}px`;

    particle.className = `particle ${shape}`;
    particle.style.setProperty("--x", `${x}px`);
    particle.style.setProperty("--y", `${y}px`);
    particle.style.setProperty("--dx", dx);
    particle.style.setProperty("--dy", dy);
    particle.style.setProperty("--size", `${size}px`);
    particle.style.setProperty("--spin", `${Math.random() * 180 - 90}deg`);
    particle.style.setProperty("--duration", `${620 + Math.random() * 300}ms`);
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
  setSpeech(randomItem(clickTexts));
  spawnParticles("click", 4);
  setMode("click", "is-clicking", 580, "expression-happy");
}

function handlePet() {
  if (!setMode("pet", "is-petting", 820, "expression-comfy")) {
    return;
  }

  setSpeech(randomItem(petTexts));
  spawnParticles("pet", 5);
}

function handleWork() {
  if (!setMode("work", "is-working", 1050, "expression-work", () => spawnParticles("work", 4))) {
    return;
  }

  setSpeech(randomItem(workTexts));
}

function handlePhrase() {
  const expression = randomItem(["expression-happy", "expression-daze", "expression-comfy"]);
  if (!setMode("phrase", "is-nodding", 650, expression)) {
    return;
  }

  state.phraseIndex = (state.phraseIndex + 1) % phraseTexts.length;
  setSpeech(phraseTexts[state.phraseIndex]);
}

function scheduleBlink() {
  window.clearTimeout(state.blinkTimer);
  const delay = 3000 + Math.random() * 3000;
  state.blinkTimer = window.setTimeout(() => {
    if (state.mode === "idle" && !state.dragging) {
      dogButton.classList.add("is-blinking");
      window.setTimeout(() => dogButton.classList.remove("is-blinking"), 160);
    }
    scheduleBlink();
  }, delay);
}

function scheduleAttention() {
  window.clearTimeout(state.attentionTimer);
  const delay = 6000 + Math.random() * 6000;
  state.attentionTimer = window.setTimeout(() => {
    if (state.mode === "idle" && !state.dragging) {
      setSpeech(randomItem(attentionTexts));
      setMode("attention", "is-attention", 780, randomItem(["expression-normal", "expression-daze", "expression-happy"]));
    }
    scheduleAttention();
  }, delay);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function updateDrag(x, y) {
  dogButton.style.setProperty("--drag-x", `${x}px`);
  dogButton.style.setProperty("--drag-y", `${y}px`);
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
  dogButton.setPointerCapture(event.pointerId);
}

function moveDrag(event) {
  if (!state.dragging || event.pointerId !== state.pointerId) {
    return;
  }

  const stageRect = stage.getBoundingClientRect();
  const dogRect = dogButton.getBoundingClientRect();
  const limitX = Math.max(0, (stageRect.width - dogRect.width) / 2 - 8);
  const limitY = Math.max(0, (stageRect.height - dogRect.height) / 2 - 28);
  const nextX = clamp(event.clientX - state.startX, -limitX, limitX);
  const nextY = clamp(event.clientY - state.startY, -limitY, limitY);

  if (Math.abs(nextX) + Math.abs(nextY) > 7) {
    state.dragStarted = true;
    dogButton.classList.add("is-dragging");
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
  dogButton.classList.remove("is-dragging");
  dogButton.classList.add("is-settling");
  updateDrag(state.dragX * 0.16, state.dragY * 0.16);

  window.clearTimeout(state.settleTimer);
  state.settleTimer = window.setTimeout(() => {
    dogButton.classList.remove("is-settling");
  }, 470);

  window.setTimeout(() => {
    state.dragX = 0;
    state.dragY = 0;
    updateDrag(0, 0);
  }, 120);
}

dogButton.addEventListener("click", handleDogClick);
dogButton.addEventListener("pointerdown", startDrag);
dogButton.addEventListener("pointermove", moveDrag);
dogButton.addEventListener("pointerup", endDrag);
dogButton.addEventListener("pointercancel", endDrag);
petButton.addEventListener("click", handlePet);
workButton.addEventListener("click", handleWork);
phraseButton.addEventListener("click", handlePhrase);

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    window.clearTimeout(state.attentionTimer);
    window.clearTimeout(state.blinkTimer);
    return;
  }

  if (state.mode === "idle") {
    scheduleAttention();
    scheduleBlink();
  }
});

scheduleAttention();
scheduleBlink();
