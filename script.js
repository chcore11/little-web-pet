const cloudWrap = document.querySelector("#cloudWrap");
const speechBubble = document.querySelector("#speechBubble");
const particleLayer = document.querySelector("#particleLayer");
const progressText = document.querySelector("#progressText");
const progressFill = document.querySelector("#progressFill");
const controls = document.querySelector("#controls");

const actionTexts = [
  "已处理 3% 的烦人东西。",
  "这一步主要靠玄学，但看起来有点用。",
  "烦人值 -1，虽然不知道有没有到账。",
  "先把脑子里的杂音音量调低一点。",
  "今天不用赢过所有人，能稳定一点就不错。",
  "好，刚刚已经帮你把烦人的东西打包了一点点。",
  "先别急着解决全世界，喝口水。",
  "今日建议：把不重要的人从后台关掉。",
  "有些事不是你不行，是它本来就烦。",
  "云朵正在努力变轻，虽然它也不知道自己在干嘛。",
  "已吹走一点点，但不要问吹到哪里去了。",
  "检测到烦人东西，正在假装处理。",
  "处理完成度增加了，可信度不详。",
  "这不是魔法，但可以假装一下。",
  "没关系，先轻一点点也算赢。"
];

const finalTexts = [
  "好了，今天先轻到这里。",
  "已经减到差不多了，剩下的交给睡眠和好吃的。",
  "今日精神重量已临时打包。"
];

const state = {
  progress: 0,
  busy: false,
  done: false,
  blinkTimer: 0,
  bounceTimer: 0
};

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function setSpeech(text) {
  speechBubble.classList.add("is-changing");
  window.setTimeout(() => {
    speechBubble.textContent = text;
    speechBubble.classList.remove("is-changing");
  }, 180);
}

function updateCloud() {
  const ratio = state.progress / 100;
  const scale = 1 - ratio * 0.34;
  const opacity = 1 - ratio * 0.32;
  const lift = ratio * 72;
  const brightness = 1 + ratio * 0.18;

  cloudWrap.style.setProperty("--cloud-scale", scale.toFixed(3));
  cloudWrap.style.setProperty("--cloud-opacity", opacity.toFixed(3));
  cloudWrap.style.setProperty("--lift", lift.toFixed(1));
  cloudWrap.style.setProperty("--cloud-brightness", brightness.toFixed(3));
  progressText.textContent = `已减轻 ${Math.round(state.progress)}%`;
  progressFill.style.width = `${state.progress}%`;
}

function spawnParticles(amount = 6) {
  const stageRect = particleLayer.getBoundingClientRect();
  const cloudRect = cloudWrap.getBoundingClientRect();
  const baseX = cloudRect.left + cloudRect.width / 2 - stageRect.left;
  const baseY = cloudRect.top + cloudRect.height * 0.45 - stageRect.top;
  const colors = ["#b9e5f1", "#d9d2ff", "#e7bb55", "#ffffff", "#f4aa93"];

  for (let index = 0; index < amount; index += 1) {
    const particle = document.createElement("span");
    const size = 7 + Math.random() * 8;
    const x = baseX + (Math.random() - 0.5) * 130;
    const y = baseY + (Math.random() - 0.5) * 70;
    const dx = `${(Math.random() - 0.5) * 76}px`;
    const dy = `${-54 - Math.random() * 68}px`;

    particle.className = `particle ${index % 2 ? "star" : "dot"}`;
    particle.style.setProperty("--x", `${x}px`);
    particle.style.setProperty("--y", `${y}px`);
    particle.style.setProperty("--dx", dx);
    particle.style.setProperty("--dy", dy);
    particle.style.setProperty("--size", `${size}px`);
    particle.style.setProperty("--spin", `${Math.random() * 180 - 90}deg`);
    particle.style.setProperty("--duration", `${680 + Math.random() * 320}ms`);
    particle.style.setProperty("--color", colors[index % colors.length]);

    particleLayer.appendChild(particle);
    particle.addEventListener("animationend", () => particle.remove(), { once: true });
  }
}

function bounceCloud() {
  window.clearTimeout(state.bounceTimer);
  cloudWrap.classList.remove("is-bouncing");
  void cloudWrap.offsetWidth;
  cloudWrap.classList.add("is-bouncing");
  state.bounceTimer = window.setTimeout(() => cloudWrap.classList.remove("is-bouncing"), 640);
}

function finish() {
  state.done = true;
  state.progress = 100;
  updateCloud();
  cloudWrap.classList.add("is-done");
  setSpeech(randomItem(finalTexts));
  controls.innerHTML = '<button class="control-button reset-button" type="button" data-action="reset">再来一次</button>';
  spawnParticles(10);
}

function lighten() {
  if (state.busy) {
    return;
  }

  if (state.done) {
    reset();
    return;
  }

  state.busy = true;
  const gain = 7 + Math.random() * 8;
  state.progress = Math.min(100, state.progress + gain);
  bounceCloud();
  updateCloud();
  setSpeech(randomItem(actionTexts));
  spawnParticles(6);

  window.setTimeout(() => {
    state.busy = false;
    if (state.progress >= 100) {
      finish();
    }
  }, 540);
}

function reset() {
  state.progress = 0;
  state.done = false;
  state.busy = false;
  cloudWrap.classList.remove("is-done", "is-bouncing");
  controls.innerHTML = `
    <button class="control-button" type="button" data-action="rub">揉一下</button>
    <button class="control-button" type="button" data-action="blow">吹走一点</button>
    <button class="control-button" type="button" data-action="lighten">变轻一点</button>
    <button class="control-button" type="button" data-action="pretend">假装没事</button>
  `;
  updateCloud();
  setSpeech("检测到烦人东西，正在假装处理。");
}

function scheduleBlink() {
  window.clearTimeout(state.blinkTimer);
  const delay = 3000 + Math.random() * 3000;
  state.blinkTimer = window.setTimeout(() => {
    if (!state.done) {
      cloudWrap.classList.add("is-blinking");
      window.setTimeout(() => cloudWrap.classList.remove("is-blinking"), 160);
    }
    scheduleBlink();
  }, delay);
}

controls.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  if (button.dataset.action === "reset") {
    reset();
    return;
  }

  lighten();
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    window.clearTimeout(state.blinkTimer);
    return;
  }

  scheduleBlink();
});

updateCloud();
scheduleBlink();
