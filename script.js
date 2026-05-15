const cloudWrap = document.querySelector("#cloudWrap");
const speechBubble = document.querySelector("#speechBubble");
const particleLayer = document.querySelector("#particleLayer");
const progressText = document.querySelector("#progressText");
const progressFill = document.querySelector("#progressFill");
const controls = document.querySelector("#controls");
const microControls = document.querySelector("#microControls");
const softnessStat = document.querySelector("#softnessStat");
const floatStat = document.querySelector("#floatStat");
const trustStat = document.querySelector("#trustStat");

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
  "没关系，先轻一点点也算赢。",
  "已把一小块烦躁折起来，塞进看不见的抽屉。",
  "今日份精神阻力下降了一点点。",
  "云朵说它正在优化，虽然优化方向不明。",
  "这团东西暂时被命名为：等会再说。",
  "不用马上变好，先别继续变重就行。",
  "刚刚有一点点松动，像拧开瓶盖的第一下。",
  "把它放远一点看，好像也没那么巨大。",
  "已申请减少脑内弹窗，审批结果随缘。",
  "这个按钮没有科学依据，但有一点点安慰依据。",
  "云朵正在把棱角磨圆，进度很慢但有在动。",
  "烦人东西被压缩成临时文件，文件名不重要。",
  "先把这件事从置顶移到普通列表。",
  "已经帮你把紧绷感松开一毫米。",
  "系统提示：今天可以不用表现得很完美。",
  "小小处理一下，大大假装一下。",
  "刚才那一下，主要是把心里那口气顺了顺。",
  "它还在，但它没刚才那么占屏幕了。",
  "已把烦人东西调成低亮度模式。",
  "云朵认真地点了点头，然后继续漂。",
  "让它先待在旁边，不要坐到你头上。",
  "本次处理轻微有效，副作用是想喝水。",
  "一些乱糟糟已被打散成更小的乱糟糟。",
  "现在可以先不用跟它正面硬刚。",
  "已把今日压力切成薄片，方便稍后处理。",
  "别急，这页的专业程度本来就不高。"
];

const cloudTapTexts = [
  "云朵被点了一下，假装自己轻了。",
  "它晃了晃，可能是在卸载烦人缓存。",
  "小云朵表示：收到，但不保证立刻有用。",
  "这一戳主要提供心理上的进度条。",
  "你点到了云朵的软肋，软肋表示还挺软。",
  "它短暂地认真了一秒，然后忘了。",
  "云朵被戳出一个不存在的小坑。",
  "这一下算作精神层面的轻轻提醒。",
  "它没有反驳，说明默认有用。",
  "云朵轻轻回弹，像一句很小声的没事。"
];

const microTexts = {
  breathe: [
    "吸气，呼气。先把浏览器里的自己放慢一点。",
    "深呼吸已执行，空气质量由想象力提供。",
    "先把肩膀从耳朵旁边请下来。",
    "这一口气不用很标准，能喘匀就很好。",
    "云朵跟着吸了一口，差点变成包子。"
  ],
  fold: [
    "已临时打包，标签写着：晚点再说。",
    "这团烦人东西被折成了小小一份。",
    "先收起来，不代表逃避，代表暂停加载。",
    "打包完成，胶带是想象中的。",
    "云朵被叠了一下，居然还挺配合。"
  ],
  rename: [
    "已改名为：没那么急。",
    "已改名为：可以分批处理。",
    "已改名为：先喝水再说。",
    "已改名为：暂时不用怕。",
    "已改名为：普通麻烦，不是终极麻烦。"
  ],
  poke: [
    "泡泡破了一个，声音被静音处理。",
    "戳泡泡成功，获得空气一小份。",
    "这个泡泡负责带走一点点杂音。",
    "泡泡说它只是路过，顺手帮个忙。",
    "已戳，烦人东西掉了一点点粉。"
  ]
};

const idleTexts = [
  "云朵正在低功耗漂浮。",
  "如果你不点它，它也会假装在工作。",
  "今日小提示：先把水杯放近一点。",
  "云朵看起来很淡定，可能是因为它没有日程表。",
  "有些事可以先交给十分钟后的自己。",
  "这里没有大功能，只有一点点缓冲。",
  "云朵正在等你，或者只是发呆。",
  "如果脑子太吵，可以先把音量旋钮想象出来。",
  "小页面保持在线，烦人东西暂时排队。",
  "你可以慢一点，页面不会催你。"
];

const finalTexts = [
  "好了，今天先轻到这里。",
  "已经减到差不多了，剩下的交给睡眠和好吃的。",
  "今日精神重量已临时打包。",
  "云朵已经变成小星星，烦人东西暂时下线。",
  "收工。不是彻底解决，但已经轻了一些。"
];

const expressions = ["expression-calm", "expression-smile", "expression-relief", "expression-dizzy", "expression-light"];

const state = {
  progress: 0,
  busy: false,
  done: false,
  blinkTimer: 0,
  bounceTimer: 0,
  idleTimer: 0,
  lastAction: "lighten",
  milestone: 0,
  taps: 0,
  usedTexts: []
};

function nextFrom(list) {
  const available = list.filter((text) => !state.usedTexts.includes(text));
  const pool = available.length ? available : list;
  const text = pool[Math.floor(Math.random() * pool.length)];
  state.usedTexts.push(text);
  if (state.usedTexts.length > 70) {
    state.usedTexts.splice(0, state.usedTexts.length - 50);
  }
  return text;
}

function setSpeech(text) {
  speechBubble.classList.add("is-changing");
  window.setTimeout(() => {
    speechBubble.textContent = text;
    speechBubble.classList.remove("is-changing");
    speechBubble.classList.add("is-pop");
    window.setTimeout(() => speechBubble.classList.remove("is-pop"), 430);
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
  softnessStat.textContent = `软度 ${ratio > 0.66 ? "高" : ratio > 0.32 ? "中" : "低"}`;
  floatStat.textContent = `漂浮 ${Math.round(lift / 3)}cm`;
  trustStat.textContent = `可信度 ${state.progress > 70 ? "仍不详" : "不详"}`;
}

function setExpression(name) {
  cloudWrap.classList.remove(...expressions);
  cloudWrap.classList.add(name);
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

function spawnNote(text) {
  const stageRect = particleLayer.getBoundingClientRect();
  const cloudRect = cloudWrap.getBoundingClientRect();
  const note = document.createElement("span");
  note.className = "float-note";
  note.textContent = text;
  note.style.setProperty("--x", `${cloudRect.left + cloudRect.width / 2 - stageRect.left}px`);
  note.style.setProperty("--y", `${cloudRect.top + cloudRect.height * 0.2 - stageRect.top}px`);
  particleLayer.appendChild(note);
  note.addEventListener("animationend", () => note.remove(), { once: true });
}

function animateCloud(action) {
  window.clearTimeout(state.bounceTimer);
  cloudWrap.classList.remove("is-bouncing", "is-rubbing", "is-blowing", "is-pretending", "is-squeezing", "is-shining");
  void cloudWrap.offsetWidth;
  const className = {
    rub: "is-rubbing",
    blow: "is-blowing",
    pretend: "is-pretending",
    lighten: "is-shining",
    tap: "is-squeezing",
    breathe: "is-blowing",
    fold: "is-rubbing",
    rename: "is-shining",
    poke: "is-squeezing"
  }[action] || "is-bouncing";
  cloudWrap.classList.add(className);
  state.bounceTimer = window.setTimeout(() => cloudWrap.classList.remove(className), 680);
}

function maybeMilestone() {
  const current = Math.floor(state.progress / 25);
  if (current > state.milestone && state.progress < 100) {
    state.milestone = current;
    spawnNote(["轻了一层", "杂音降低", "暂时打包", "差不多了"][current - 1] || "轻了一点");
    spawnParticles(4);
  }
}

function finish() {
  state.done = true;
  state.progress = 100;
  updateCloud();
  cloudWrap.classList.add("is-done");
  setExpression("expression-light");
  setSpeech(nextFrom(finalTexts));
  controls.innerHTML = '<button class="control-button reset-button" type="button" data-action="reset">再来一次</button>';
  microControls.hidden = true;
  spawnParticles(10);
}

function applyAction(action = "lighten", small = false) {
  if (state.busy) {
    return;
  }

  if (state.done) {
    reset();
    return;
  }

  state.busy = true;
  state.lastAction = action;
  const gain = small ? 2 + Math.random() * 4 : action === "tap" ? 4 + Math.random() * 5 : 7 + Math.random() * 8;
  state.progress = Math.min(100, state.progress + gain);
  animateCloud(action);
  setExpression({
    rub: "expression-relief",
    blow: "expression-dizzy",
    lighten: "expression-light",
    pretend: "expression-smile",
    tap: "expression-smile",
    breathe: "expression-relief",
    fold: "expression-calm",
    rename: "expression-light",
    poke: "expression-dizzy"
  }[action] || "expression-smile");
  updateCloud();

  if (microTexts[action]) {
    setSpeech(nextFrom(microTexts[action]));
  } else {
    setSpeech(action === "tap" ? nextFrom(cloudTapTexts) : nextFrom(actionTexts));
  }

  spawnParticles(small ? 3 : action === "tap" ? 4 : 6);
  const noteMap = {
    rub: "揉松一点",
    blow: "呼——",
    pretend: "没事牌",
    breathe: "吸一口",
    fold: "先收好",
    rename: "改名成功",
    poke: "啵"
  };
  if (noteMap[action]) {
    spawnNote(noteMap[action]);
  }
  maybeMilestone();

  window.setTimeout(() => {
    state.busy = false;
    if (!state.done && state.progress < 100) {
      setExpression("expression-calm");
    }
    if (state.progress >= 100) {
      finish();
    }
  }, 540);
}

function reset() {
  state.progress = 0;
  state.done = false;
  state.busy = false;
  state.milestone = 0;
  state.taps = 0;
  state.usedTexts = [];
  cloudWrap.classList.remove("is-done", "is-bouncing", "is-rubbing", "is-blowing", "is-pretending", "is-squeezing", "is-shining");
  setExpression("expression-calm");
  controls.innerHTML = `
    <button class="control-button" type="button" data-action="rub">揉一下</button>
    <button class="control-button" type="button" data-action="blow">吹走一点</button>
    <button class="control-button" type="button" data-action="lighten">变轻一点</button>
    <button class="control-button" type="button" data-action="pretend">假装没事</button>
  `;
  microControls.hidden = false;
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

function scheduleIdleTalk() {
  window.clearTimeout(state.idleTimer);
  const delay = 9000 + Math.random() * 7000;
  state.idleTimer = window.setTimeout(() => {
    if (!state.done && !state.busy) {
      setSpeech(nextFrom(idleTexts));
      setExpression("expression-smile");
      window.setTimeout(() => setExpression("expression-calm"), 900);
    }
    scheduleIdleTalk();
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

  applyAction(button.dataset.action);
});

microControls.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }
  applyAction(button.dataset.action, true);
});

cloudWrap.addEventListener("click", () => {
  state.taps += 1;
  applyAction("tap");
});

cloudWrap.addEventListener("dblclick", () => {
  if (!state.done) {
    spawnNote("双击加速");
    applyAction("lighten");
  }
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    window.clearTimeout(state.blinkTimer);
    window.clearTimeout(state.idleTimer);
    return;
  }

  scheduleBlink();
  scheduleIdleTalk();
});

updateCloud();
setExpression("expression-calm");
scheduleBlink();
scheduleIdleTalk();
