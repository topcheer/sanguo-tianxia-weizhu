// practice.js —— 野战练习场全屏选关页:残卷目录之外,与正史并列的沙场
// 只负责陈列与导航;战书与牌局由 main.js 接线。
import { PRACTICE_ARENAS, PRACTICE_TIERS, arenaRoster } from './practice-data.js';
import { portraitImage } from './portrait.js';
import { t, localizePracticeArena } from './i18n.js';

const $ = id => document.getElementById(id);

function rosterLabel(arena) {
  const names = arenaRoster(arena).map(member => member.name.split(' · ')[0]);
  const currentLang = document.documentElement.getAttribute('lang') || 'zh-CN';
  if (names.length <= 3) return names.join(' · ');
  if (currentLang === 'en') return `${names.slice(0, 3).join(' · ')} and ${names.length} warlords`;
  if (currentLang === 'ja') return `${names.slice(0, 3).join(' · ')} ら${names.length}将`;
  return `${names.slice(0, 3).join(' · ')} 等${names.length}将`;
}

function renderStats(P) {
  const currentLang = document.documentElement.getAttribute('lang') || 'zh-CN';
  const seen = Object.values(P.practice || {}).reduce((sum, rec) => sum + rec.seen, 0);
  const won = Object.values(P.practice || {}).reduce((sum, rec) => sum + rec.won, 0);
  const cleared = PRACTICE_ARENAS.filter(arena => P.practice?.[arena.id]?.won > 0).length;
  if (currentLang === 'en') {
    $('practiceStats').innerHTML = seen
      ? `<b>${seen}</b> duels · <b>${won}</b> won · <b>${cleared}</b> / ${PRACTICE_ARENAS.length} conquered`
      : `No battle logs yet · ${PRACTICE_ARENAS.length} arenas awaiting your command`;
  } else if (currentLang === 'ja') {
    $('practiceStats').innerHTML = seen
      ? `合戦 <b>${seen}</b> 回 · 勝利 <b>${won}</b> · 破陣 <b>${cleared}</b> / ${PRACTICE_ARENAS.length}`
      : `未だ戦録なし · ${PRACTICE_ARENAS.length} 箇所の戦場が点兵を待つ`;
  } else if (currentLang === 'zh-TW') {
    $('practiceStats').innerHTML = seen
      ? `已戰 <b>${seen}</b> 場 · 勝 <b>${won}</b> · 破陣 <b>${cleared}</b> / ${PRACTICE_ARENAS.length}`
      : `尚無戰錄 · ${PRACTICE_ARENAS.length} 處戰場靜候點兵`;
  } else {
    $('practiceStats').innerHTML = seen
      ? `已战 <b>${seen}</b> 场 · 胜 <b>${won}</b> · 破阵 <b>${cleared}</b> / ${PRACTICE_ARENAS.length}`
      : `尚无战录 · ${PRACTICE_ARENAS.length} 处战场静候点兵`;
  }
}

function renderArenaCard(rawArena, P, onPick) {
  const arena = localizePracticeArena(rawArena);
  const rec = P.practice?.[arena.id];
  const won = !!rec?.won;
  const gen = arenaRoster(arena)[0];
  const depth = Math.round(arena.stack / arena.blinds[1]);
  const currentLang = document.documentElement.getAttribute('lang') || 'zh-CN';
  const wonTag = currentLang === 'en' ? 'WIN' : (currentLang === 'zh-CN' ? '胜' : '勝');
  const oppCount = currentLang === 'en' ? `${arena.opponents.length} Opps` : (currentLang === 'ja' ? `敵${arena.opponents.length}将` : `敌${arena.opponents.length}将`);
  const metaLabel = currentLang === 'en'
    ? `${arena.year} · ${arena.place} · ${arena.stack} chips · ${depth}BB`
    : `${arena.year} · ${arena.place} · 军资各 ${arena.stack} · ${depth}BB`;
  const winWord = currentLang === 'en' ? 'W' : (currentLang === 'zh-CN' ? '胜' : '勝');
  const lossWord = currentLang === 'en' ? 'L' : (currentLang === 'zh-CN' ? '负' : (currentLang === 'ja' ? '敗' : '負'));
  const unplayed = currentLang === 'en' ? 'NEW' : (currentLang === 'zh-CN' ? '未 战' : (currentLang === 'ja' ? '未 戦' : '未 戰'));

  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'practice-arena' + (won ? ' is-won' : '');
  b.dataset.arena = arena.id;
  b.title = arena.lead;
  b.innerHTML = `
    <span class="pa-art">${portraitImage(gen.skin, 'pa-portrait')}
      <i class="pa-count">${oppCount}</i>${won ? `<i class="pa-seal">${wonTag}</i>` : ''}</span>
    <span class="pa-main">
      <b class="pa-name">${arena.name}</b>
      <span class="pa-meta">${metaLabel}</span>
      <span class="pa-opp">${rosterLabel(arena)}</span>
    </span>
    <span class="pa-side">${rec
      ? `<b>${rec.won}</b><small>${winWord} / ${rec.seen - rec.won} ${lossWord}</small>`
      : `<b>○</b><small>${unplayed}</small>`}</span>`;
  b.addEventListener('click', () => onPick(arena));
  return b;
}

export function renderPractice(P, onPick) {
  renderStats(P);
  const box = $('practiceList');
  box.innerHTML = '';
  const currentLang = document.documentElement.getAttribute('lang') || 'zh-CN';
  for (const tier of PRACTICE_TIERS) {
    const arenas = PRACTICE_ARENAS.filter(arena => arena.size === tier.size);
    if (!arenas.length) continue;
    const group = document.createElement('section');
    group.className = 'practice-tier';
    group.dataset.size = String(tier.size);
    const tableLabel = currentLang === 'en' ? `${tier.size}-Handed Table` : (currentLang === 'ja' ? `${tier.size} 人卓` : `${tier.size} 人桌`);
    group.innerHTML = `<header class="practice-tier-head">
      <h3>${tier.label}<small>${tableLabel}</small></h3>
      <p>${tier.desc}</p>
    </header>`;
    const row = document.createElement('div');
    row.className = 'practice-tier-row';
    for (const arena of arenas) row.appendChild(renderArenaCard(arena, P, onPick));
    group.appendChild(row);
    box.appendChild(group);
  }
  $('practiceBack').focus({ preventScroll: true });
}

// 残卷目录的并列入口:野卷旗帜,四位名将压阵
export function renderPracticeGate(mount, onEnter) {
  const currentLang = document.documentElement.getAttribute('lang') || 'zh-CN';
  const gateSeal = currentLang === 'en' ? 'WAR' : '野';
  const gateHead = currentLang === 'en' ? 'Arenas · Skirmish Front' : (currentLang === 'ja' ? '野巻 · 沙場点兵' : (currentLang === 'zh-TW' ? '野卷 · 沙場點兵' : '野卷 · 沙场点兵'));
  const gateTitle = currentLang === 'en' ? '33 Historical Arenas · Fight on Demand' : (currentLang === 'ja' ? '三十三の典故 · 点兵即座に戦わん' : (currentLang === 'zh-TW' ? '三十三處典故 · 點兵即戰' : '三十三处典故 · 点兵即战'));
  const gateSub = currentLang === 'en' ? '2 to 8 players · Equal chips · Zero chronicle impact' : (currentLang === 'ja' ? '二〜八人卓 · 軍資等額 · 史冊を改めず' : (currentLang === 'zh-TW' ? '二至八人桌 · 軍資等額 · 不改史冊' : '二至八人桌 · 军资等额 · 不改史册'));
  const gateGo = currentLang === 'en' ? 'ENTER' : (currentLang === 'ja' ? '出 陣' : (currentLang === 'zh-TW' ? '入 陣' : '入 阵'));
  const gateGoSub = currentLang === 'en' ? 'Command Desk' : (currentLang === 'ja' ? '点兵台' : (currentLang === 'zh-TW' ? '點兵台' : '点兵台'));

  const gate = document.createElement('div');
  gate.className = 'practiceGate';
  gate.innerHTML = `
    <h3 class="practiceGate-head"><span class="title-seal">${gateSeal}</span>${gateHead}</h3>
    <button type="button" class="practiceGate-btn" data-practice-gate>
      <span class="pg-art">${['guanyu', 'caocao', 'zhouyu', 'lvbu'].map(s => portraitImage(s)).join('')}</span>
      <span class="pg-main">
        <b>${gateTitle}</b>
        <small>${gateSub}</small>
      </span>
      <span class="pg-go">${gateGo}<small>${gateGoSub}</small></span>
    </button>`;
  gate.querySelector('[data-practice-gate]').addEventListener('click', onEnter);
  mount.appendChild(gate);
}

// 返回目录与键盘收起(与既有屏幕同一套约定)
export function initPracticeScreen(onBack) {
  $('practiceBack').addEventListener('click', onBack);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !$('practice').classList.contains('hidden')) onBack();
  });
}
