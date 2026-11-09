// general-card.js —— 三国志式武将卡:入场与观阵录共用立绘、六维组件
import { TRAITS, describeTraits } from './persona.js';
import { portraitImage } from './portrait.js';
import { t } from './i18n.js';

const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[ch]));

export function traitGrid(traits = {}, { id = '', className = '', compact = false } = {}) {
  const bands = describeTraits(traits);
  const traitKeys = ['martial', 'strategy', 'deceit', 'courage', 'patience', 'composure'];
  const cells = bands.map((b, i) => {
    const locTrait = t(`traits.${traitKeys[i]}`) || TRAITS[i];
    return `<div class="trait-cell" data-trait="${TRAITS[i]}" title="${esc(b.label)}">
      <div class="trait-line"><span>${locTrait}</span><b>${b.value}</b></div>
      <div class="trait-track"><i style="width:${b.value}%"></i></div>
      ${compact ? '' : `<small>${esc(b.label)}</small>`}
    </div>`;
  }).join('');
  return `<div${id ? ` id="${id}"` : ''} class="trait-grid ${className}">${cells}</div>`;
}

export function renderGeneralCard(mount, {
  name, bio = '', quote = '', traits = {}, rule = '', skin = 'default',
  eyebrow = '', year = '', gate = false, skirmish = false,
}) {
  const currentLang = document.documentElement.getAttribute('lang') || 'zh-CN';
  const defaultEyebrow = gate ? (currentLang === 'en' ? 'MAJOR GATE' : '关 卡') : (skirmish ? (currentLang === 'en' ? 'SKIRMISH' : '遭 遇') : (currentLang === 'en' ? 'COMMANDER' : '敌 将'));
  const seal = gate ? (currentLang === 'en' ? 'GATE' : '关') : (skirmish ? (currentLang === 'en' ? 'SKIR' : '遇') : (currentLang === 'en' ? 'GEN' : '将'));
  const caption = currentLang === 'en' ? 'Scroll Silhouette' : (currentLang === 'ja' ? '残巻の面影' : '残卷留影');
  const faction = currentLang === 'en' ? 'Han Dynasty' : (currentLang === 'ja' ? '漢末' : (currentLang === 'zh-TW' ? '漢末' : '汉末'));
  const ruleLabel = currentLang === 'en' ? 'Battle Rule' : (currentLang === 'ja' ? '本回戦法' : (currentLang === 'zh-TW' ? '本回戰法' : '本回战法'));
  const defaultQuote = currentLang === 'en' ? 'No retreat in a fractured world; meet me at the felt.' : (currentLang === 'ja' ? '乱世に逃げ道なし、牌上に決せん。' : '乱世无路，牌上见。');
  const actionLabel = skirmish ? (currentLang === 'en' ? 'CLASH' : (currentLang === 'ja' ? '交 鋒' : (currentLang === 'zh-TW' ? '交 鋒' : '交 锋'))) : (currentLang === 'en' ? 'DUEL' : (currentLang === 'ja' ? '応 戦' : (currentLang === 'zh-TW' ? '應 戰' : '应 战')));
  const actionSub = currentLang === 'en' ? 'Click to continue' : (currentLang === 'ja' ? 'クリックして進む' : (currentLang === 'zh-TW' ? '點擊繼續' : '点击继续'));

  mount.innerHTML = `
    <div class="general-art">
      <div class="art-sun"></div>
      <div class="art-ink art-ink-a"></div><div class="art-ink art-ink-b"></div>
      ${portraitImage(skin)}
      <span class="art-seal">${seal}</span>
      <span class="art-caption">${caption}</span>
    </div>
    <section class="general-info">
      <div class="general-kicker"><span class="bi-label">${esc(eyebrow || defaultEyebrow)}</span><span>${esc(year)}</span></div>
      <div class="general-title-row"><h2 id="bossIntroName">${esc(name)}</h2><span class="general-faction">${faction}</span></div>
      <p id="bossIntroBio">${esc(bio)}</p>
      <div class="general-rule"><span>${ruleLabel}</span><p id="bossIntroRule">${esc(rule)}</p></div>
      ${traitGrid(traits, { id: 'bossIntroTraits' })}
      <div class="general-footer">
        <p id="bossIntroQuote">${quote ? `「${esc(quote)}」` : defaultQuote}</p>
        <button id="introSkip" type="button">${actionLabel}<small>${actionSub}</small></button>
      </div>
    </section>`;
}
