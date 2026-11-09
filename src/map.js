// map.js —— 行军图:地名节点路径、通用事件与章节剧情场景
import { linesFor, speakerName } from './story-engine.js';
import { t } from './i18n.js';

const $ = id => document.getElementById(id);

const TYPES = {
  battle: { glyph: '♠', label: '遭遇战', cls: 't-battle' },
  rest: { glyph: '♨', label: '营帐', cls: 't-rest' },
  shop: { glyph: '✦', label: '军市', cls: 't-shop' },
  chest: { glyph: '◆', label: '辎重', cls: 't-chest' },
  boss: { glyph: '♛', label: '关卡', cls: 't-boss' },
};

// 行军图:章节地名排成一条行军线;首=遭遇战,尾=关卡,中间自动配事件
const MID_TYPES = ['chest', 'battle', 'rest', 'shop', 'battle'];
export function buildMarch(chapter) {
  const names = chapter.map;
  const n = names.length;
  return names.map((nm, i) => ({
    id: `m${i}`, col: i,
    type: n === 1 ? 'boss' : (i === n - 1 ? 'boss' : (i === 0 ? 'battle' : MID_TYPES[(i - 1) % MID_TYPES.length])),
    name: nm,
    x: n === 1 ? 500 : 90 + i * (820 / (n - 1)),
    y: 210 + Math.sin(i * 1.7) * 60,
    next: i < n - 1 ? [`m${i + 1}`] : [],
    done: false,
  }));
}

// 旧版随机旅程图(留作后期「残卷无终稿」随机外传的生成器)
export function genRun() {
  const cols = [
    ['battle'],
    ['shop', 'rest'],
    ['battle', 'chest'],
    ['battle'],
    ['rest', 'shop'],
    ['battle', 'chest'],
    ['battle'],
    ['boss'],
  ];
  const nodes = [];
  cols.forEach((col, ci) => {
    col.forEach((type, ri) => {
      const x = 60 + ci * 125 + (Math.random() - 0.5) * 22;
      const y = col.length === 1
        ? 210 + (Math.random() - 0.5) * 40
        : 130 + ri * 160 + (Math.random() - 0.5) * 30;
      nodes.push({ id: `${ci}-${ri}`, col: ci, type, x, y, next: [], done: false });
    });
  });
  for (let ci = 0; ci < cols.length - 1; ci++) {
    const cur = nodes.filter(n => n.col === ci);
    const nxt = nodes.filter(n => n.col === ci + 1);
    for (const a of cur) for (const b of nxt) a.next.push(b.id);
  }
  return nodes;
}

function terrainMarkup() {
  const mountains = [
    [80, 102, .8], [260, 82, 1.05], [495, 115, .75], [735, 78, 1.1], [925, 115, .8],
    [175, 350, .65], [620, 356, .7], [855, 345, .6],
  ].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})">
    <path class="terrain-mountain" d="M-76 35L-38-13L-20 4L10-48L37-12L54-25L84 35Z"/>
    <path class="terrain-mountain snow" d="M-38-13L-20 4L10-48L22-26L10-31L1-17L-9-25L-20-2"/>
  </g>`).join('');
  return `<rect class="map-paper" width="1000" height="420"/>
    <path class="map-paper-grain" d="M0 52H1000M0 187H1000M0 331H1000M120 0V420M422 0V420M760 0V420"/>
    <text class="map-region" x="85" y="62">中 原</text><text class="map-region" x="782" y="386">江 东</text>
    <path class="map-river" d="M-30 292Q130 219 278 292T570 276T1030 235"/>
    <path class="map-river-line" d="M-30 288Q130 215 278 288T570 272T1030 231"/>
    ${mountains}`;
}

export function createMap({ onPick, getRun }) {
  const svgNS = 'http://www.w3.org/2000/svg';

  function render() {
    const R = getRun();
    const svg = $('mapSvg');
    svg.innerHTML = terrainMarkup();
    $('runChips').textContent = R.chips;
    $('marchInfo').textContent = R.marchInfo || '';

    const avail = available(R);

    // 边
    for (const n of R.nodes) {
      for (const nid of n.next) {
        const m = R.nodes.find(x => x.id === nid);
        const path = document.createElementNS(svgNS, 'path');
        const mx = (n.x + m.x) / 2;
        path.setAttribute('d', `M${n.x},${n.y} Q${mx},${(n.y + m.y) / 2 - 26} ${m.x},${m.y}`);
        path.setAttribute('class', 'edge' + (n.done ? ' done' : ''));
        svg.appendChild(path);
      }
    }
    // 节点
    for (const n of R.nodes) {
      const typeConfig = TYPES[n.type];
      const g = document.createElementNS(svgNS, 'g');
      g.setAttribute('class', `node ${typeConfig.cls}` +
        (n.done ? ' done' : '') + (avail.includes(n.id) ? ' avail' : ''));
      g.dataset.node = n.id;
      const nodeLabel = t(`map.${n.type}`) || typeConfig.label;
      g.setAttribute('aria-label', `${nodeLabel} · ${n.name || ''}`);
      const ring = document.createElementNS(svgNS, 'path');
      const r = n.type === 'boss' ? 38 : 31;
      ring.setAttribute('d', `M${n.x},${n.y - r}L${n.x + r},${n.y}L${n.x},${n.y + r}L${n.x - r},${n.y}Z`);
      ring.setAttribute('class', 'node-ring');
      g.appendChild(ring);
      const c = document.createElementNS(svgNS, 'circle');
      c.setAttribute('cx', n.x); c.setAttribute('cy', n.y);
      c.setAttribute('r', n.type === 'boss' ? 30 : 24);
      g.appendChild(c);
      const txt = document.createElementNS(svgNS, 'text');
      txt.setAttribute('x', n.x); txt.setAttribute('y', n.y + 1);
      txt.setAttribute('class', 'nglyph');
      txt.textContent = typeConfig.glyph;
      g.appendChild(txt);
      const lb = document.createElementNS(svgNS, 'text');
      lb.setAttribute('x', n.x); lb.setAttribute('y', n.y + (n.type === 'boss' ? 48 : 40));
      lb.setAttribute('class', 'nlabel');
      lb.textContent = n.name ? `${nodeLabel} · ${n.name}` : nodeLabel;
      g.appendChild(lb);
      if (avail.includes(n.id) && !n.done) {
        g.style.cursor = 'pointer';
        g.setAttribute('role', 'button');
        g.setAttribute('tabindex', '0');
        g.addEventListener('click', () => onPick(n));
        g.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(n); }
        });
      }
      svg.appendChild(g);
    }
    // 当前位置标记
    if (R.current) {
      const cur = R.nodes.find(x => x.id === R.current);
      if (cur) {
        const mk = document.createElementNS(svgNS, 'text');
        mk.setAttribute('x', cur.x); mk.setAttribute('y', cur.y - 34);
        mk.setAttribute('class', 'youhere');
        mk.textContent = t('map.youHere') || '▼ 你在这里';
        svg.appendChild(mk);
      }
    }
  }

  function available(R) {
    if (!R.current) return R.nodes.filter(n => n.col === 0).map(n => n.id);
    const cur = R.nodes.find(n => n.id === R.current);
    return cur ? cur.next : [];
  }

  return { render };
}

// ---------------- 事件弹窗 ----------------
export function eventModal(type, applyFn) {
  const modal = $('eventModal');
  const box = $('eventBox');
  const R = applyFn; // 传入 run 操作集
  let html = '';
  if (type === 'rest') {
    html = `
      <h3>营 帐</h3>
      <p class="ev-story">夜入营帐,更鼓三声。你把今日的牌局又复盘了一遍,<br>然后枕着刀睡了。</p>
      <div class="ev-opts">
        <button data-k="heal">歇息片刻 <b>+80 筹码</b></button>
        <button data-k="calm">凝神静气 <b>下一场破绽假动作更少</b></button>
      </div>`;
  } else if (type === 'shop') {
    html = `
      <h3>军 市</h3>
      <p class="ev-story">随军的商贾掀开布帘:「军爷,前线的东西便宜。<br>挑一样,就当交个朋友。」</p>
      <div class="ev-opts">
        <button data-k="money">一袋军资 <b>+150 筹码</b></button>
        <button data-k="bribe">打点守将 <b>下一场对方起手 -250</b></button>
        <button data-k="eye">军中密报 <b>破绽假动作大幅减少</b></button>
      </div>`;
  } else if (type === 'chest') {
    html = `
      <h3>辎 重</h3>
      <p class="ev-story">缴获的辎重车里,整整齐齐码着前主人的军资。</p>
      <div class="ev-opts">
        <button data-k="loot">收下 <b>+150 筹码</b></button>
      </div>`;
  }
  box.innerHTML = html;
  modal.classList.remove('hidden');
  return new Promise(resolve => {
    box.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => {
        modal.classList.add('hidden');
        resolve(b.dataset.k);
      });
    });
  });
}

// 章节场景与通用事件共用弹窗;选择返回完整定义,由主流程统一应用效果。
export function storyModal(scene, { P, chapter, previousChoice = null } = {}) {
  const modal = $('eventModal');
  const box = $('eventBox');
  const lines = linesFor(scene.lines, { P, chapter });
  const currentLang = document.documentElement.getAttribute('lang') || 'zh-CN';
  const kickerLabel = currentLang === 'en' ? 'Story Encounter' : (currentLang === 'ja' ? '残巻の物語' : (currentLang === 'zh-TW' ? '殘 卷 見 聞' : '残 卷 见 闻'));
  const oldPrefix = currentLang === 'en' ? 'Prior Choice · ' : (currentLang === 'ja' ? '前策 · ' : (currentLang === 'zh-TW' ? '舊策 · ' : '旧策 · '));
  const memoryNote = currentLang === 'en'
    ? 'The scroll remembers your prior decision; you may choose differently, affecting only this march.'
    : (currentLang === 'ja'
      ? '残巻はそなたの前策を記憶す。今回も選び直すを得ん。効果は今回の行軍のみに及ぶ。'
      : (currentLang === 'zh-TW'
        ? '殘卷記得你的舊策；這次仍可改選，效果只計入本次行程。'
        : '残卷记得你的旧策；这次仍可改选，效果只计入本次行程。'));
  const skipLabel = currentLang === 'en' ? 'Skip Scene' : (currentLang === 'ja' ? 'この見聞を略す' : (currentLang === 'zh-TW' ? '略過這段見聞' : '略过这段见闻'));
  box.innerHTML = `
    <p class="modal-kicker">${kickerLabel}</p><h3>${scene.title}</h3>
    <div class="scene-lines">${lines.map(line =>
      `<div class="story-line"><span class="story-speaker">${speakerName(line.speaker)}</span><p class="story-text">${line.text}</p></div>`).join('')}</div>
    ${previousChoice ? `<p class="scene-memory">${memoryNote}</p>` : ''}
    <div class="ev-opts">${(scene.choices || []).map(choice =>
      `<button data-choice="${choice.id}">${previousChoice === choice.id ? oldPrefix : ''}${choice.text}<b>${choice.detail || ''}</b></button>`).join('')}</div>
    <button class="scene-skip" data-skip="1">${skipLabel}</button>`;
  modal.classList.remove('hidden');
  return new Promise(resolve => {
    box.querySelectorAll('[data-choice]').forEach(button => {
      button.addEventListener('click', () => {
        const choice = scene.choices.find(item => item.id === button.dataset.choice);
        modal.classList.add('hidden');
        resolve({ choice, skipped: false });
      });
    });
    box.querySelector('[data-skip]').addEventListener('click', () => {
      modal.classList.add('hidden');
      resolve({ choice: null, skipped: true });
    });
  });
}
