// save-transfer.js —— 存档文件导出、校验导入与覆盖确认。
import { normalizeProgress } from './scroll.js';
import { t, getLocale } from './i18n.js';
import { isIos } from './pwa.js';

export const SAVE_FORMAT = 'sanguo-tianxia-weizhu-save';
const MAX_SAVE_BYTES = 1024 * 1024;
const REVOKE_DELAY_MS = 10_000;
const isRecord = value => value && typeof value === 'object' && !Array.isArray(value);

function assertProgress(value) {
  if (!isRecord(value)) throw new Error(t('save.msg.invalid'));
  const known = ['version', 'pages', 'endings', 'annals', 'practice', 'flags', 'apocWins', 'settings', 'story', 'tutorial'];
  if (!known.some(key => Object.hasOwn(value, key))) throw new Error(t('save.msg.invalid'));
  for (const key of ['pages', 'annals', 'practice', 'flags', 'settings', 'story', 'tutorial']) {
    if (value[key] !== undefined && !isRecord(value[key])) throw new Error(t('save.msg.invalid'));
  }
  if (value.endings !== undefined && !Array.isArray(value.endings)) throw new Error(t('save.msg.invalid'));
  if (value.apocWins !== undefined && (!Number.isFinite(value.apocWins) || value.apocWins < 0)) throw new Error(t('save.msg.invalid'));
  return value;
}

export function parseSaveText(text) {
  let parsed;
  try { parsed = JSON.parse(text); }
  catch { throw new Error(t('save.msg.invalid')); }
  let raw = parsed;
  let exportedAt = null;
  if (isRecord(parsed) && parsed.format !== undefined) {
    if (parsed.format !== SAVE_FORMAT || parsed.formatVersion !== 1) throw new Error(t('save.msg.invalid'));
    raw = parsed.data;
    exportedAt = Number.isFinite(Date.parse(parsed.exportedAt)) ? parsed.exportedAt : null;
  }
  const progress = normalizeProgress(assertProgress(raw));
  return { progress, exportedAt };
}

export async function readSaveFile(file) {
  if (file.size > MAX_SAVE_BYTES) throw new Error(t('save.msg.tooLarge'));
  return parseSaveText(await file.text());
}

// iOS 主屏 PWA 里 blob 下载会静默失败(WebKit 167341),改走系统分享面板「存储到文件」。
async function shareSaveFile(file) {
  try {
    await navigator.share({ files: [file] });
    return 'shared';
  } catch (error) {
    if (error?.name === 'AbortError') return 'cancelled';
    return null;
  }
}

export async function exportSave(progress) {
  const exportedAt = new Date().toISOString();
  const text = JSON.stringify({
    format: SAVE_FORMAT, formatVersion: 1, exportedAt, data: progress,
  }, null, 2);
  const name = `sanguo-save-${exportedAt.slice(0, 10)}.json`;
  if (isIos()) {
    const file = new File([text], name, { type: 'application/json' });
    if (navigator.canShare?.({ files: [file] })) {
      const shared = await shareSaveFile(file);
      if (shared) return shared;
    }
  }
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Safari 对过早 revoke 会中断刚发起的下载,留足时间再回收
  setTimeout(() => URL.revokeObjectURL(url), REVOKE_DELAY_MS);
  return 'download';
}

function summaryOf(progress) {
  const pages = Object.values(progress.pages).filter(state => ['yeshi', 'yeshiB', 'yeshiAB'].includes(state)).length;
  const practice = Object.values(progress.practice || {}).reduce((sum, rec) => sum + rec.seen, 0);
  return { pages, generals: Object.keys(progress.annals).length, endings: progress.endings.length, practice };
}

export function createSaveTransfer({ read, onImported }) {
  const $ = id => document.getElementById(id);
  const modal = $('saveModal'), input = $('saveImportInput'), preview = $('saveImportPreview');
  const pasteBox = $('savePasteBox'), pasteArea = $('savePasteArea');
  let pending = null;

  function close() {
    pending = null;
    input.value = '';
    pasteArea.value = '';
    pasteBox.classList.add('hidden');
    preview.classList.add('hidden');
    modal.classList.add('hidden');
  }
  function open() {
    close();
    $('saveMessage').textContent = '';
    modal.classList.remove('hidden');
    $('saveExport').focus({ preventScroll: true });
  }
  $('saveBtn').addEventListener('click', open);
  $('saveClose').addEventListener('click', close);
  $('saveImportChoose').addEventListener('click', () => input.click());
  $('saveExport').addEventListener('click', async () => {
    const result = await exportSave(read());
    // 分享/下载是否真正落盘只有分享路径能感知,按实际结果反馈,不再无条件报「已导出」
    $('saveMessage').textContent = result === 'shared' ? t('save.msg.shared')
      : result === 'cancelled' ? t('save.msg.shareCancelled')
        : isIos() ? t('save.msg.exportedFallback') : t('save.msg.exported');
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !modal.classList.contains('hidden')) close();
  });

  function showImported(imported) {
    pending = imported;
    pasteBox.classList.add('hidden');
    const summary = summaryOf(imported.progress);
    const date = imported.exportedAt
      ? ` · ${new Date(imported.exportedAt).toLocaleString(getLocale(), { hour12: false })}` : '';
    $('saveImportSummary').textContent = t('save.msg.summary', {
      pages: summary.pages, generals: summary.generals, endings: summary.endings, practice: summary.practice, date,
    });
    preview.classList.remove('hidden');
    $('saveMessage').textContent = t('save.msg.review');
  }

  // 文件与粘贴共用同一条校验/预览链路,返回是否解析成功
  function importText(text) {
    pending = null;
    preview.classList.add('hidden');
    $('saveMessage').textContent = t('save.msg.reading');
    try {
      if (text.length > MAX_SAVE_BYTES) throw new Error(t('save.msg.tooLarge'));
      showImported(parseSaveText(text));
      return true;
    } catch (error) {
      $('saveMessage').textContent = error.message || t('save.msg.invalid');
      return false;
    }
  }

  input.addEventListener('change', async () => {
    const file = input.files?.[0];
    if (!file) return;
    importText(await file.text());
    input.value = '';
  });

  // iOS 旧版 WebKit 的文件选择器在 PWA 里可能弹不出来(WebKit 235891),粘贴导入是绕开选择器的兜底
  $('savePaste').addEventListener('click', async () => {
    pasteBox.classList.add('hidden');
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) {
        pasteArea.value = text;
        if (importText(text)) return;
      }
    } catch { /* 无剪贴板权限或不支持,退回手动粘贴 */ }
    pasteBox.classList.remove('hidden');
    pasteArea.focus();
    $('saveMessage').textContent = t('save.msg.pasteHint');
  });
  $('savePasteConfirm').addEventListener('click', () => {
    const text = pasteArea.value;
    if (!text.trim()) { $('saveMessage').textContent = t('save.msg.pasteHint'); return; }
    importText(text);
  });

  $('saveImportConfirm').addEventListener('click', async () => {
    if (!pending) return;
    try {
      await onImported(pending.progress);
      pending = null;
      input.value = '';
      pasteArea.value = '';
      pasteBox.classList.add('hidden');
      preview.classList.add('hidden');
      $('saveMessage').textContent = t('save.msg.imported');
    } catch {
      $('saveMessage').textContent = t('save.msg.writeFailed');
    }
  });
  return { open, close };
}
