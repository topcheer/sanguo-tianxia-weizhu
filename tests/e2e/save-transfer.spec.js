// save-transfer.spec.js —— 存档文件导出、摘要确认导入、持久化与坏文件保护
import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { newGame } from './helpers.js';

const envelope = data => ({
  format: 'sanguo-tianxia-weizhu-save', formatVersion: 1,
  exportedAt: '2026-10-27T08:00:00.000Z', data,
});
const progress = (pages = {}, annals = {}) => ({
  version: 2, pages, endings: [], annals, flags: {}, apocWins: 0,
  story: { seen: {}, choices: {}, facts: {}, clues: {}, outcomes: {} },
  tutorial: { version: 1, introDone: true, steps: {}, skipped: false },
});

test('导出当前存档为带版本信息的 JSON 文件', async ({ page }) => {
  await page.addInitScript(([value]) => { if (!localStorage.getItem('yxj_v1')) localStorage.setItem('yxj_v1', JSON.stringify(value)); }, [progress({ taoyuan: 'yeshi', hulao: 'history' }, { lvbu: { seen: 2, won: 1, tells: {} } })]);
  await newGame(page);
  await page.click('#saveBtn');
  const downloading = page.waitForEvent('download');
  await page.click('#saveExport');
  const download = await downloading;
  expect(download.suggestedFilename()).toMatch(/^sanguo-save-.*\.json$/);
  const content = JSON.parse(await readFile(await download.path(), 'utf8'));
  expect(content.format).toBe('sanguo-tianxia-weizhu-save');
  expect(content.formatVersion).toBe(1);
  expect(content.data.pages).toEqual({ taoyuan: 'yeshi', hulao: 'history' });
  expect(content.data.annals.lvbu.won).toBe(1);
  expect(content.exportedAt).toBeTruthy();
});

test('导入先看摘要,确认后才覆盖并持久化', async ({ page }) => {
  await page.addInitScript(([value]) => { if (!localStorage.getItem('yxj_v1')) localStorage.setItem('yxj_v1', JSON.stringify(value)); }, [progress({ taoyuan: 'history' })]);
  await newGame(page);
  await page.click('#saveBtn');
  await page.locator('#saveImportInput').setInputFiles({
    name: 'backup.json', mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(envelope(progress({ hulao: 'yeshi' }, { lvbu: { seen: 2, won: 1, tells: {} } })))),
  });
  await expect(page.locator('#saveImportPreview')).toBeVisible();
  await expect(page.locator('#saveImportSummary')).toContainText('1 页');
  await expect(page.locator('#saveImportSummary')).toContainText('1 位');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('yxj_v1')).pages)).toEqual({ taoyuan: 'history' });
  await page.click('#saveImportConfirm');
  await expect(page.locator('#saveMessage')).toContainText('存档已导入');
  await expect(page.locator('#codexProgress')).toContainText('已改写 1 / 50 页');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('yxj_v1')).pages)).toEqual({ hulao: 'yeshi' });
  await page.reload();
  await expect(page.locator('#startBtn')).toBeEnabled();
  await page.click('#startBtn');
  await expect(page.locator('#codexProgress')).toContainText('已改写 1 / 50 页');
  await page.click('#annalsBtn');
  await expect(page.locator('.annalCard[data-gen="lvbu"]')).toBeVisible();
});

test('无效文件只提示错误,不覆盖当前存档', async ({ page }) => {
  await page.addInitScript(([value]) => { if (!localStorage.getItem('yxj_v1')) localStorage.setItem('yxj_v1', JSON.stringify(value)); }, [progress({ taoyuan: 'yeshi' })]);
  await newGame(page);
  await page.click('#saveBtn');
  await page.locator('#saveImportInput').setInputFiles({ name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{"bad":true}') });
  await expect(page.locator('#saveMessage')).toContainText('无法识别');
  await expect(page.locator('#saveImportPreview')).toBeHidden();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('yxj_v1')).pages)).toEqual({ taoyuan: 'yeshi' });
});

test('iOS 环境优先走系统分享导出,而不是静默失败的 blob 下载', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'userAgent', {
      get: () => 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
    });
    navigator.canShare = data => Array.isArray(data?.files) && data.files.length > 0;
    navigator.share = async data => {
      window.__sharedSave = { name: data.files[0].name, text: await data.files[0].text() };
    };
  });
  await page.addInitScript(([value]) => { if (!localStorage.getItem('yxj_v1')) localStorage.setItem('yxj_v1', JSON.stringify(value)); }, [progress({ taoyuan: 'yeshi' })]);
  await newGame(page);
  await page.click('#saveBtn');
  await page.click('#saveExport');
  await expect(page.locator('#saveMessage')).toContainText('分享面板');
  const shared = await page.evaluate(() => window.__sharedSave);
  expect(shared.name).toMatch(/^sanguo-save-.*\.json$/);
  const content = JSON.parse(shared.text);
  expect(content.format).toBe('sanguo-tianxia-weizhu-save');
  expect(content.formatVersion).toBe(1);
  expect(content.data.pages).toEqual({ taoyuan: 'yeshi' });
});

test('文件选择器打不开时,粘贴 JSON 也能导入存档', async ({ page }) => {
  await page.addInitScript(([value]) => { if (!localStorage.getItem('yxj_v1')) localStorage.setItem('yxj_v1', JSON.stringify(value)); }, [progress({ taoyuan: 'history' })]);
  await newGame(page);
  await page.click('#saveBtn');
  await page.click('#savePaste');
  await expect(page.locator('#savePasteBox')).toBeVisible();
  await page.fill('#savePasteArea', JSON.stringify(envelope(progress({ hulao: 'yeshi' }, { lvbu: { seen: 2, won: 1, tells: {} } }))));
  await page.click('#savePasteConfirm');
  await expect(page.locator('#saveImportPreview')).toBeVisible();
  await expect(page.locator('#saveImportSummary')).toContainText('1 页');
  await page.click('#saveImportConfirm');
  await expect(page.locator('#saveMessage')).toContainText('存档已导入');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('yxj_v1')).pages)).toEqual({ hulao: 'yeshi' });
});
