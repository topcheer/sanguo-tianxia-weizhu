// onboarding.js —— 四短节开卷 + 第一次真实操作时的非阻塞引导
import { getLocale } from './i18n.js';

const $ = id => document.getElementById(id);

const TIPS_I18N = {
  en: {
    page: ['Reading the First Chapter', 'Review the Historical Record first to understand which historical events and romance lore this page draws from; then read the prologue and cold open. Before each battle, you will also receive battle orders specifying your opponent, the cause, and the stakes of victory or defeat.'],
    omen: ['Select an Omen', 'Supplies boost your starting chips, Demoralize weakens enemy morale, Insight reveals false tells, and Night Raid depletes the climax commander\'s chips. Choose the tactic that suits your playstyle.'],
    map: ['March Command', 'Click active glowing nodes to advance. Your war supplies carry forward into the next encounter; plot choices made at story nodes will be remembered by the scroll. The final fortress gate is where fate is rewritten.'],
    action: ['Playing the First Hand', 'Buttons adapt to the game state: check when there is no bet, or call/fold when facing a bet. Raising opens three scaling options. Preserve your war supplies wisely.'],
    tell: ['Reading Tells', 'Seat postures reveal strength or weakness; legendary generals possess their own signature gestures. Be watchful of bluffs; at showdown, the tell journal logs your reads.'],
    taunt: ['Provoke Once per Hand', 'Click Provoke to challenge the selected opponent. Hot-tempered warlords are easily rattled, while others remain composed. In multi-way pots, select a seat first.'],
    settle: ['This Page is Recorded', 'Rewriting history unlocks subsequent lore, while original records grant historical insight. Comrades and future chapters will remember the outcome of this page.']
  },
  ja: {
    page: ['第一回をいかに読むか', 'まず史実草案に目を通し、かの頁が如何なる史実と演義を引くか知るべし。各戦の前には戦書あり、対戦相手・起因・勝敗の代償が記されん。'],
    omen: ['天象を一策選定せよ', '糧草は軍資を増やし、奪気は敵士気を挫き、看破は偽りの隙を見破り、劫営は敵将の軍資を削る。好みの戦法を選べ。'],
    map: ['軍令の至る所', '光る拠点をクリックして進軍せよ。軍資は次なる戦へと引き継がれ、道中の選択は残巻に刻まれん。最後の関門こそ改変の場なり。'],
    action: ['最初の一手の打ち方', '盤況に応じて操作は変化す。注なき時は過牌（チェック）、注ある時は跟注（コール）か棄牌（フォールド）。軍資の温存もまた戦略なり。'],
    tell: ['敵将の隙を読め', '席の姿勢は強弱の気配を表し、名将には固有の癖あり。虚勢に惑わされず、攤牌（ショーダウン）にて看破を検証せよ。'],
    taunt: ['一手ごとに一度の攻心', '攻心を用い敵将の動揺を誘え。短気な者は自制を失い易く、免疫の猛者もあり。狙う相手を定めよ。'],
    settle: ['此の頁は巻に刻まれぬ', '野史は後続を拓き、原巻は史鑑を残す。友との再会も今後の展開も、此の局の果てを読み継がん。']
  },
  'zh-TW': {
    page: ['第一回怎麼讀', '先看史實底稿，知道舊頁借用了哪段史事與演義；再讀前頁餘波和冷開場。每場戰鬥前還會有戰書，寫清對手、緣由與勝負代價。'],
    omen: ['天時只需選一項', '糧草加你的軍資，奪氣壓敵士氣，看破減少假破綻，劫營削弱關底軍資。沒有標準答案，選你想採用的打法。'],
    map: ['軍令所至', '點擊發光節點前進。軍資會隨你進入下一場；劇情節點的選擇會被殘卷記住。最後的「關卡」才是改寫之處。'],
    action: ['第一手怎麼打', '按鈕會隨局面變化：無注可過牌，有注可跟或棄。加注會展開三檔尺度；不必每手都爭，保存軍資也是選擇。'],
    tell: ['他在露破綻', '席位的姿態對應強或弱，名將還有自己的簽名動作。可能是假意示弱；等攤牌，破綻簿會記下哪次判斷命中。'],
    taunt: ['攻心每手一次', '點擊攻心影響當前選中的敵將。易怒者更容易失守，也有人完全免疫；多人局先點席位，再決定攻誰的心。'],
    settle: ['這一頁已經留下', '野史會解鎖後續內容，原卷會留下史鑑。故人重逢與後續劇情，都會讀到這一頁的結果。']
  },
  'zh-CN': {
    page: ['第一回怎么读', '先看史实底稿，知道旧页借用了哪段史事与演义；再读前页余波和冷开场。每场战斗前还会有战书，写清对手、缘由与胜负代价。'],
    omen: ['天时只需选一项', '粮草加你的军资，夺气压敌士气，看破减少假破绽，劫营削弱关底军资。没有标准答案，选你想采用的打法。'],
    map: ['军令所至', '点击发光节点前进。军资会随你进入下一场；剧情节点的选择会被残卷记住。最后的“关卡”才是改写之处。'],
    action: ['第一手怎么打', '按钮会随局面变化：无注可过牌，有注可跟或弃。加注会展开三档尺度；不必每手都争，保存军资也是选择。'],
    tell: ['他在露破绽', '席位的姿态对应强或弱，名将还有自己的签名动作。可能是假意示弱；等摊牌，破绽簿会记下哪次判断命中。'],
    taunt: ['攻心每手一次', '点击攻心影响当前选中的敌将。易怒者更容易失守，也有人完全免疫；多人局先点席位，再决定攻谁的心。'],
    settle: ['这一页已经留下', '野史会解锁后续内容，原卷会留下史鉴。故人重逢与后续剧情，都会读到这一页的结果。']
  }
};

const PROLOGUE_I18N = {
  en: [
    {
      kicker: 'Prologue · The Scroll Chooses',
      title: 'History only recorded battlefields, never the card table.',
      text: 'You are a reader beyond the fragmented scroll. The Chronicler invites you into the "Record of Heroes"—not to replace Liu Bei or Guan Yu under a false name, but to take a seat beside old comrades and fight for an alternative outcome in pivotal duels. Collect thirty cinnabar seals of unofficial chronicle to meet the Chronicler and uncover why this chronicle chose you.',
      points: ['Four scrolls and fifty chapters, grounded in historical records and literary boundaries', 'Comrades remember your victories and choices'],
    },
    {
      kicker: 'Prologue · Every Outcome Leaves a Mark',
      title: 'Win to mend a regret; lose to uncover deeper truth.',
      text: 'Winning the climax battle rewrites the original scroll into an unofficial chronicle. Defeat is never in vain: you will experience the historical sorrow firsthand and earn a "Historical Insight" to guide your strategy when you return.',
      points: ['Victory rewrites destiny, defeat is recorded as lore', 'Major climax breakthroughs unveil the next volume'],
    },
    {
      kicker: 'Prologue · The Felt is the Battlefield',
      title: 'Two hole cards, five community cards; contend for supplies, not petty pride.',
      text: 'Combine your hole cards with the community cards to build the highest-ranking five-card poker hand. Manage your war supplies through checking, betting, calling, or folding; reduce the boss commander’s supplies to zero to rewrite this chapter. In multi-way duels, eliminate all rival commanders.',
      points: ['Check / Call: control the cost of engagement', 'Raise / All-in: force opponents into difficult decisions'],
    },
    {
      kicker: 'Prologue · Three Arts Beyond the Cards',
      title: 'Read the cards and read the soul; seize the initiative and harness heaven’s timing.',
      text: 'Before unrolling a chapter, select an Omen. At the felt, warlord postures reveal strength or deceit; showdowns in the tell journal verify your insight. Once per hand, unleash Provoke to rattle their composure.',
      points: ['Tells: strength may hide weakness, weakness may mask traps', 'Provoke: Zhang Fei is easily stirred, Sima Yi stands unmoved', 'March: supplies carry forward, story choices shape consequences'],
    },
  ],
  ja: [
    {
      kicker: '序 · 残巻の選定',
      title: '史書は戦場のみを記し、卓上を記さず。',
      text: 'そなたは残巻の外なる読巻人なり。記巻人が『英雄記』へと招きしは、劉備や関羽に成り代わらせるためならず、旧き友の傍らに坐し、重大なる一局にて異なる結末を争わんがためなり。野史の朱印を三十集めば、記巻人に相見え、何故に選ばれしかを問うを得ん。',
      points: ['四巻五十回、正史の底稿と演義の輪郭を備う', '故人はそなたの勝敗と選択を記憶す'],
    },
    {
      kicker: '序 · 勝敗皆章を成す',
      title: '勝てば遺憾を改め、敗るれば真相を悟る。',
      text: '関底に勝利せば、原巻は改変され野史とならん。敗北も無駄にはあらず。本来の遺憾を身をもって味わい「史鑑」を得て、再戦への布石とすべし。',
      points: ['勝てば改変、敗るるも残巻に刻まる', '大関を突破せば次なる巻が開かれん'],
    },
    {
      kicker: '序 · 卓上即ち戦場',
      title: '二枚の手牌、五枚の共通牌。軍資を争い、意気を争わず。',
      text: '手牌と共通牌を合わせ、最強の五枚牌型を成せ。下注、跟注、棄牌を駆使して軍資を護り、関底の敵将の軍資を討ち果たせば、此の回を書き換えん。乱戦においては全敵将を淘汰すべし。',
      points: ['過牌／跟注：代償を制御す', '加注／全押：敵に苦渋の決断を迫る'],
    },
    {
      kicker: '序 · 牌外の三道',
      title: '牌を見、人を見よ。先を争い、天時を借りよ。',
      text: '開巻の前に天時を選べ。盤上にて武将の気配は強弱を漏らすも、虚勢あり。攤牌後に看破簿が真偽を明かさん。一手ごとに攻心を用い、敵の心を揺さぶれ。',
      points: ['隙：強きは真に強きにあらず、弱きも偽りあり', '攻心：張飛は激しやすく、司馬懿は動ぜず', '進軍：軍資は引き継がれ、選択は痕跡を残す'],
    },
  ],
  'zh-TW': [
    {
      kicker: '序 · 殘卷擇人',
      title: '史書只寫了沙場，沒寫牌桌。',
      text: '你是殘卷外的讀卷人。寫卷人請你進入《英雄記》，不是讓你無名頂替劉備或關羽，而是讓你坐到故人身旁，在關鍵一局裡替他們爭另一種可能。集齊三十枚野史朱印，就能見到寫卷人，問出這卷書為何選中你。',
      points: ['四卷五十回，都有史籍底稿與演義邊界', '故人記得你的勝負，也記得你的選擇'],
    },
    {
      kicker: '序 · 勝負皆成章',
      title: '贏，改一段遺憾；輸，多懂一層真相。',
      text: '贏下關底，原卷會被改寫成野史。兵敗並非白打：你會親歷原本的遺憾，並得到一條「史鑑」，下次重來便知道該看什麼。',
      points: ['勝則改寫，敗亦入卷', '大關改寫後，下一卷才會展開'],
    },
    {
      kicker: '序 · 牌桌就是戰場',
      title: '兩張手牌，五張公共牌；贏軍資，不爭一手意氣。',
      text: '用手牌與公共牌組成最大的五張牌型。通過下注、跟注或棄牌保住軍資；讓關底敵將的軍資歸零，就能改寫本回。多人局要淘汰所有敵將。',
      points: ['過牌／跟注：控制代價', '加注／全壓：逼對手做難選的決定'],
    },
    {
      kicker: '序 · 牌外三門課',
      title: '看牌，也看人；爭先，也借天時。',
      text: '開卷前選一項天時。牌桌上，武將的神態會洩露強弱，但也會作假；攤牌後破綻簿會驗證你的判斷。每手可用一次攻心，挑動他的心性。',
      points: ['破綻：強未必強，弱未必弱', '攻心：張飛易怒，司馬懿不動如山', '行軍：軍資相隨，途中選擇會留下後果'],
    },
  ],
  'zh-CN': [
    {
      kicker: '序 · 残卷择人',
      title: '史书只写了沙场，没写牌桌。',
      text: '你是残卷外的读卷人。写卷人请你进入《英雄记》，不是让你无名顶替刘备或关羽，而是让你坐到故人身旁，在关键一局里替他们争另一种可能。集齐三十枚野史朱印，就能见到写卷人，问出这卷书为何选中你。',
      points: ['四卷五十回，都有史籍底稿与演义边界', '故人记得你的胜负，也记得你的选择'],
    },
    {
      kicker: '序 · 胜负皆成章',
      title: '赢，改一段遗憾；输，多懂一层真相。',
      text: '赢下关底，原卷会被改写成野史。兵败并非白打：你会亲历原本的遗憾，并得到一条“史鉴”，下次重来便知道该看什么。',
      points: ['胜则改写，败亦入卷', '大关改写后，下一卷才会展开'],
    },
    {
      kicker: '序 · 牌桌就是战场',
      title: '两张手牌，五张公共牌；赢军资，不争一手意气。',
      text: '用手牌与公共牌组成最大的五张牌型。通过下注、跟注或弃牌保住军资；让关底敌将的军资归零，就能改写本回。多人局要淘汰所有敌将。',
      points: ['过牌／跟注：控制代价', '加注／全压：逼对手做难选的决定'],
    },
    {
      kicker: '序 · 牌外三门课',
      title: '看牌，也看人；争先，也借天时。',
      text: '开卷前选一项天时。牌桌上，武将的神态会泄露强弱，但也会作假；摊牌后破绽簿会验证你的判断。每手可用一次攻心，挑动他的心性。',
      points: ['破绽：强未必强，弱未必弱', '攻心：张飞易怒，司马懿不动如山', '行军：军资相随，途中选择会留下后果'],
    },
  ]
};

const PROLOGUE = PROLOGUE_I18N['zh-CN'];
const TIPS = TIPS_I18N['zh-CN'];

export function createOnboarding(P, { save, onFinish, force = '' } = {}) {
  let step = 0;
  let active = false;
  let transitioning = false;
  let transitionVersion = 0;
  const pendingTips = [];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fast = new URLSearchParams(location.search).get('fast') === '1';
  const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
  const prologueElements = () => [$('introStep'), $('introNarrative')];

  function render() {
    const lang = getLocale();
    const prologueList = PROLOGUE_I18N[lang] || PROLOGUE_I18N['zh-CN'];
    const data = prologueList[step] || prologueList[0];
    const isLast = step === prologueList.length - 1;
    $('introStep').textContent = `${data.kicker} · ${step + 1} / ${prologueList.length}`;
    $('introStory').textContent = data.text;
    $('introLesson').textContent = data.title;
    $('introPoints').innerHTML = data.points.map(point => `<span>${point}</span>`).join('');

    const btnLabels = {
      en: {
        last: 'U N R O L L   H E R O E S',
        lastSub: 'Enter Chronicle Index',
        next: 'C O N T I N U E',
        nextSub: 'Click to advance · Can skip anytime',
        hint: 'Prologue lasts ~30s; mechanics will also be guided on first encounter.',
      },
      ja: {
        last: '英 雄 記 を 開 く',
        lastSub: '残巻目録へ進む',
        next: '次 へ',
        nextSub: '進めるにはクリック · いつでもスキップ可',
        hint: '背景序章は約30秒；各機能は初操作時にも案内されます',
      },
      'zh-TW': {
        last: '展 開 英 雄 記',
        lastSub: '進入殘卷目錄',
        next: '繼 續',
        nextSub: '點擊推進 · 可隨時跳過',
        hint: '背景序章約三十秒；機制還會在第一次操作時分別提示',
      },
      'zh-CN': {
        last: '展 开 英 雄 记',
        lastSub: '进入残卷目录',
        next: '继 续',
        nextSub: '点击推进 · 可随时跳过',
        hint: '背景序章约三十秒；机制还会在第一次操作时分别提示',
      },
    };
    const bl = btnLabels[lang] || btnLabels['zh-CN'];
    $('startBtn').innerHTML = `${isLast ? bl.last : bl.next}<span>${isLast ? bl.lastSub : bl.nextSub}</span>`;
    $('prologueSkip').classList.remove('hidden');
    $('introHint').textContent = bl.hint;
  }

  function resetTransition() {
    transitionVersion++;
    transitioning = false;
    for (const el of prologueElements()) el.classList.remove('is-leaving', 'is-entering');
    $('startBtn').disabled = false;
  }

  async function transitionRender() {
    if (transitioning) return;
    const version = ++transitionVersion;
    if (reducedMotion.matches) { render(); return; }
    transitioning = true;
    $('startBtn').disabled = true;
    const enter = fast ? 200 : 620;
    const leave = fast ? 60 : 160;
    const child = fast ? 120 : 420;
    const elements = prologueElements();
    for (const el of elements) {
      el.style.setProperty('--prologue-enter', `${enter}ms`);
      el.style.setProperty('--prologue-leave', `${leave}ms`);
      el.style.setProperty('--prologue-child', `${child}ms`);
      el.classList.remove('is-entering');
      el.classList.add('is-leaving');
    }
    await pause(leave);
    if (version !== transitionVersion) return;
    for (const el of elements) {
      el.classList.remove('is-leaving');
      el.classList.add('is-entering');
    }
    render();
    void $('introNarrative').offsetWidth;
    for (const el of elements) el.classList.remove('is-entering');
    await pause(enter + 100);
    if (version !== transitionVersion) return;
    transitioning = false;
    $('startBtn').disabled = false;
  }

  function finish() {
    resetTransition();
    active = false;
    P.tutorial.introDone = true;
    save(P);
    onFinish();
  }

  function start() {
    if (force === '0' || (P.tutorial.introDone && force !== '1' && !active)) { onFinish(); return; }
    if (transitioning) return;
    if (!active) { active = true; step = 0; transitionRender(); return; }
    if (step >= PROLOGUE.length - 1) { finish(); return; }
    step++;
    transitionRender();
  }

  function replay() {
    resetTransition();
    active = true;
    step = 0;
    transitionRender();
  }

  function skip() {
    if (!active) return;
    finish();
  }

  function tip(key) {
    const lang = getLocale();
    const tipsTable = TIPS_I18N[lang] || TIPS_I18N['zh-CN'];
    const data = tipsTable[key] || TIPS[key];
    if (!data || P.tutorial.skipped || P.tutorial.steps[key] || force === '0') return;
    if (!$('coachmark').classList.contains('hidden')) {
      if (!pendingTips.includes(key)) pendingTips.push(key);
      return;
    }
    P.tutorial.steps[key] = true;
    save(P);
    $('coachTitle').textContent = data[0];
    $('coachText').textContent = data[1];
    $('coachmark').classList.remove('hidden');
  }

  function closeTip() {
    $('coachmark').classList.add('hidden');
    const next = pendingTips.shift();
    if (next) setTimeout(() => tip(next), 80);
  }

  $('coachClose').addEventListener('click', closeTip);
  $('coachNever').addEventListener('click', () => {
    P.tutorial.skipped = true;
    pendingTips.length = 0;
    save(P);
    $('coachmark').classList.add('hidden');
  });

  return { start, replay, skip, tip, hideTip: () => { pendingTips.length = 0; $('coachmark').classList.add('hidden'); } };
}
