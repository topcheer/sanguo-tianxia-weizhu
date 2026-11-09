// tests/e2e/helpers.js —— E2E 公共动作(全部从用户视角驱动 DOM)
import { expect } from '@playwright/test';

// 动态引导完成:开卷按钮可用且首屏加载提示已消失
export async function waitAppReady(page) {
  await expect(page.locator('#startBtn')).toBeVisible();
  await expect(page.locator('#startBtn')).toBeEnabled();
  await expect(page.locator('#bootStatus')).toBeHidden();
}

// 开卷:带参数进入,点「开卷」。默认落到残卷目录;?chapter= 时落到题记页
export async function newGame(page, params = '') {
  if (!params.includes('lang=') && !params.includes('locale=')) {
    await page.addInitScript(() => {
      try { localStorage.removeItem('sanguo_poker_language'); } catch {}
    });
  }
  const withTutorialDefault = params.includes('tutorial=') ? params : `${params}${params ? '&' : ''}tutorial=0`;
  await page.goto('/?' + withTutorialDefault);
  await waitAppReady(page);
  await page.click('#startBtn');
  await expect(page.locator('#scroll:not(.hidden), #page:not(.hidden)').first()).toBeVisible();
}

// 从目录开某一页:题记 → 开卷 → (天时若弹则选第一个) → 行军图
export async function openChapter(page, id) {
  await page.click(`[data-ch="${id}"]`);
  await expect(page.locator('#page')).toBeVisible();
  await page.click('#openPage');
  await page.evaluate(() => {
    const m = document.getElementById('omenModal');
    if (!m.classList.contains('hidden')) m.querySelector('#omenBox button')?.click();
  });
  await expect(page.locator('#map')).toBeVisible();
}

// 安装自动玩家(用户视角:只点真实按钮)
// strategy: 'station' 跟注站 | 'maniac' 全压流 | 'cautious' 稳健(大注弃牌)
// 同时自动处理:事件/天时弹窗选第一项、兵败翻页重开、改写后回目录(抉择页先选第一项)
// autoSettle=false 时保留结算弹窗,供需要亲手验收兵败/改写的用例点击
export async function installDriver(page, strategy = 'station', { autoSettle = true, autoBriefing = true } = {}) {
  await page.evaluate(([s, auto, brief]) => { window.__drive = s; window.__autoSettle = auto; window.__autoBriefing = brief; }, [strategy, autoSettle, autoBriefing]);
  await page.evaluate(() => {
    if (window.__autoTimer) return;
    window.__autoTimer = setInterval(() => {
      const acts = document.getElementById('actions');
      if (acts && !acts.classList.contains('hidden')) {
        const vis = [...acts.querySelectorAll('button')].filter(b => b.style.display !== 'none');
        const pick = names => names.map(a => vis.find(b => b.dataset.act === a)).find(Boolean);
        const s = window.__drive || 'station';
        let b = null;
        if (s === 'station') b = pick(['call', 'check', 'fold']);
        else if (s === 'maniac') b = pick(['allin', 'check', 'fold']);
        else if (s === 'cautious') {
          const call = vis.find(x => x.dataset.act === 'call');
          const amt = call ? parseInt(call.textContent.replace(/\D/g, '') || '0', 10) : 0;
          b = (call && amt <= 90) ? call : pick(['check', 'fold']);
        }
        if (b) b.click();
      }
      const bf = document.getElementById('battleBriefing');
      if (window.__autoBriefing !== false && bf && !bf.classList.contains('hidden')) {
        document.getElementById('briefingEnter')?.click();
      }
      const ev = document.getElementById('eventModal');
      if (ev && !ev.classList.contains('hidden')) {
        document.querySelector('#eventBox button')?.click();
      }
      const om = document.getElementById('omenModal');
      if (om && !om.classList.contains('hidden')) {
        document.querySelector('#omenBox button')?.click();
      }
      const st = document.getElementById('settle');
      if (window.__autoSettle !== false && st && !st.classList.contains('hidden')) {
        const choice = document.querySelector('#settleChoices button');
        if (choice) { choice.click(); return; }
        const retry = document.getElementById('settleRetry');
        if (retry && retry.style.display !== 'none') retry.click();
        else document.getElementById('settleHome')?.click();
      }
    }, 600);
  });
}

export async function stopDriver(page) {
  await page.evaluate(() => { clearInterval(window.__autoTimer); window.__autoTimer = null; });
}

// 在行军图上点击某个类型的可用节点
export async function clickAvailNode(page, type = null) {
  await page.evaluate(t => {
    const nodes = [...document.querySelectorAll('#mapSvg .node.avail')];
    if (!nodes.length) throw new Error('没有可用节点');
    const target = (t && nodes.find(n => n.classList.contains('t-' + t))) || nodes[0];
    target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  }, type);
}

// 战书只在显式调用时确认;剧情验收用例不得让自动司机替玩家略过
export async function confirmBriefing(page) {
  await expect(page.locator('#battleBriefing')).toBeVisible();
  await expect(page.locator('#briefingReason')).not.toBeEmpty();
  await page.click('#briefingEnter');
}

// 进入战斗并等待 HUD 就位
export async function enterBattle(page, type = 'battle') {
  await clickAvailNode(page, type);
  await confirmBriefing(page);
  await expect(page.locator('#battle')).toBeVisible();
  await expect(page.locator('#oppName')).not.toBeEmpty();
  await expect(page.locator('#blindLabel')).toContainText('小盲');
}

// 连点行军图直到战斗出现(中间可能隔着事件节点,driver 会自动处理弹窗)
export async function reachBattle(page, type = 'battle') {
  for (let i = 0; i < 5; i++) {
    if (await page.locator('#battle').isVisible()) return;
    await clickAvailNode(page, type);
    await page.waitForTimeout(300);
    if (await page.locator('#battleBriefing').isVisible()) await confirmBriefing(page);
    await page.waitForTimeout(600);
    if (await page.locator('#battle').isVisible()) {
      await expect(page.locator('#oppName')).not.toBeEmpty();
      await expect(page.locator('#blindLabel')).toContainText('小盲');
      return;
    }
  }
  await expect(page.locator('#battle')).toBeVisible({ timeout: 15_000 });
}

// 等到出现玩家行动按钮,并返回可见的按钮类型
export async function waitButtons(page) {
  await expect(page.locator('#actions')).toBeVisible({ timeout: 30_000 });
  return page.evaluate(() =>
    [...document.querySelectorAll('#actions button')]
      .filter(b => b.style.display !== 'none')
      .map(b => b.dataset.act));
}

// 点一个行动(优先 order 中靠前且存在的)
export async function act(page, order = ['call', 'check', 'fold']) {
  await waitButtons(page);
  await page.evaluate(names => {
    const vis = [...document.querySelectorAll('#actions button')].filter(b => b.style.display !== 'none');
    const b = names.map(a => vis.find(x => x.dataset.act === a)).find(Boolean);
    if (!b) throw new Error('没有可点行动:' + names);
    b.click();
  }, order);
}

// 等到摊牌横幅出现(或一手因弃牌结束)
export async function waitHandEnd(page, timeout = 60_000) {
  await page.waitForFunction(() => {
    const bannerShown = document.getElementById('banner').classList.contains('show');
    const cleared = document.querySelectorAll('#cardLayer .card').length === 0
      && document.getElementById('actions').classList.contains('hidden');
    return bannerShown || cleared;
  }, { timeout });
}

// 等到战斗结束(回行军图或出结算)
export async function waitBattleEnd(page, timeout = 180_000) {
  await page.waitForFunction(() =>
    !document.getElementById('map').classList.contains('hidden')
    || !document.getElementById('settle').classList.contains('hidden'),
    { timeout });
}

// 自主打完一整页(司机全压流速胜,兵败自动翻页重开,事件/天时自动处理)
export async function winChapter(page, id, { maxMs = 300_000 } = {}) {
  await installDriver(page, 'maniac');
  const t0 = Date.now();
  try {
    while (Date.now() - t0 < maxMs) {
      const st = await page.evaluate(() => ({
        codex: !document.getElementById('scroll').classList.contains('hidden'),
        map: !document.getElementById('map').classList.contains('hidden'),
        finale: !document.getElementById('finale').classList.contains('hidden'),
        pages: (JSON.parse(localStorage.getItem('yxj_v1') || '{}').pages) || {},
      }));
      const st2 = st.pages[id];
      if ((st.codex || st.finale) && ['yeshi', 'yeshiB', 'yeshiAB'].includes(st2)) return true;
      if (st.map) { try { await clickAvailNode(page); } catch { /* 节点间隙 */ } }
      await page.waitForTimeout(450);
    }
    return false;
  } finally {
    await stopDriver(page);
  }
}

export const loc = {
  // 公共牌 = 已翻开且非玩家手牌(摊牌前);摊牌后对方底牌也会翻开
  community: page => page.locator('#cardLayer .card.flipped:not(.big)'),
  playerCards: page => page.locator('#cardLayer .card.big'),
  oppFaceDown: page => page.locator('#cardLayer .card:not(.big):not(.flipped)'),
  oppFaceUp: page => page.locator('#cardLayer .card.flipped:not(.big)'),
  codexItems: page => page.locator('#codexList li:not(.empty)'),
  tiltDotsOn: page => page.locator('#tiltDots i.on'),
};
