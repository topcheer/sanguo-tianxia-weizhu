// tests/e2e/i18n.spec.js —— 多语言切换与本地化完整性 E2E 测试
import { test, expect } from '@playwright/test';

test.describe('多语言 (i18n) 系统验证', () => {
  test.use({ locale: 'zh-CN' });

  test('支持四种语言即时热切换与 UI 响应', async ({ page }) => {
    await page.goto('/');

    // 1. 验证语言选择栏存在
    const langBar = page.locator('#langBar');
    await expect(langBar).toBeVisible();

    // 默认简体中文
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'zh-CN');
    await expect(page.locator('#startBtn')).toContainText('开 卷');

    // 2. 切换至繁体中文 (zh-TW)
    await page.locator('.lang-btn[data-locale="zh-TW"]').click();
    await expect(html).toHaveAttribute('lang', 'zh-TW');
    await expect(page.locator('#startBtn')).toContainText('開 卷');

    // 3. 切换至日本語 (ja)
    await page.locator('.lang-btn[data-locale="ja"]').click();
    await expect(html).toHaveAttribute('lang', 'ja');
    await expect(page.locator('#startBtn')).toContainText('開 巻');

    // 4. 切换至 English (en)
    await page.locator('.lang-btn[data-locale="en"]').click();
    await expect(html).toHaveAttribute('lang', 'en');
    await expect(page.locator('#startBtn')).toContainText('Open Scroll');

    // 5. 刷新页面后应持久化记忆选定语言 (en)
    await page.reload();
    await expect(html).toHaveAttribute('lang', 'en');
    await expect(page.locator('#startBtn')).toContainText('Open Scroll');

    // 6. 切换回简体中文
    await page.locator('.lang-btn[data-locale="zh-CN"]').click();
    await expect(html).toHaveAttribute('lang', 'zh-CN');
    await expect(page.locator('#startBtn')).toContainText('开 卷');
  });

  test('英文模式下翻页题记 (The Peach Garden) 完整无中文残留且排版端正', async ({ page }) => {
    await page.goto('/?fast=1');
    // 切换至 English
    await page.locator('.lang-btn[data-locale="en"]').click();

    // 点击进入目录并跳过序章动画
    await page.locator('#startBtn').click();
    await page.locator('#prologueSkip').click();
    await expect(page.locator('#scroll')).toBeVisible();

    // 点击第一回 (桃园 / The Peach Garden)
    const firstChapterChip = page.locator('.chip[data-ch="taoyuan"]');
    await expect(firstChapterChip).toContainText('The Peach Garden');
    await firstChapterChip.click();

    // 翻页题记界面应出现
    await expect(page.locator('#page')).toBeVisible();

    // 验证标题与排版
    await expect(page.locator('#pageName')).toHaveText('The Peach Garden');
    await expect(page.locator('#pageYear')).toHaveText('184 AD');
    await expect(page.locator('#pageFolio')).toContainText('Scroll I · Chapter 1');
    await expect(page.locator('#pageDividerSeal')).toHaveText('IF');
    await expect(page.locator('#pagePremise')).toContainText('What if the age of turmoil began over a cup of wine?');

    // 史实底稿与演义改写
    await expect(page.locator('#pageHistoryLabel')).toHaveText('Historical Record');
    await expect(page.locator('#pageAdaptationLabel')).toHaveText('Folklore & Adaptation');
    await expect(page.locator('#pageRecord')).toContainText('In 184 AD, the Yellow Turban Rebellion erupted');
    await expect(page.locator('#pageAdaptation')).toContainText('The Peach Garden oath follows the narrative lore');
    await expect(page.locator('#pageLead')).toContainText('The first page of the remnant scroll features no emperors');

    // 故人名单与冷开场台词
    await expect(page.locator('#pageCast')).toContainText('Liu Bei');
    await expect(page.locator('#pageCast')).toContainText('Guan Yu');
    await expect(page.locator('#pageCast')).toContainText('Zhang Fei');
    await expect(page.locator('#pageColdOpen')).toContainText('Peach blossoms of Zhuo Commandery drifted upon the recruitment notice');

    // 目标、笔记、印章、操作按钮、地图
    await expect(page.locator('#pageObjective')).toContainText('Protect the volunteer militia amidst the chaos');
    await expect(page.locator('#pageNote')).toContainText("Chronicler's Note: This page is easily read, depart now.");
    await expect(page.locator('#openPage')).toHaveText('Depart');
    await expect(page.locator('#pageBack')).toHaveText('Index');
    await expect(page.locator('#pageStamp')).toHaveText('FATE');
    await expect(page.locator('#pageRoute')).toContainText('Zhuo Commandery');
    await expect(page.locator('#pageRoute')).toContainText('Guangzong');

    // 保存截屏用于外观复核
    await page.screenshot({ path: 'test-results/en-peach-garden.png' });
    await page.evaluate(() => localStorage.removeItem('sanguo_poker_language'));
  });

  test('日本語模式下目录与桃园题记无乱码或遗漏', async ({ page }) => {
    await page.goto('/?fast=1');
    await page.locator('.lang-btn[data-locale="ja"]').click();
    await page.locator('#startBtn').click();
    await page.locator('#prologueSkip').click();
    await expect(page.locator('#scroll')).toBeVisible();

    const firstChapterChip = page.locator('.chip[data-ch="taoyuan"]');
    await expect(firstChapterChip).toContainText('桃園の契り');
    await firstChapterChip.click();

    await expect(page.locator('#page')).toBeVisible();
    await expect(page.locator('#pageName')).toHaveText('桃園の契り');
    await expect(page.locator('#pageYear')).toHaveText('中平元年 (184年)');
    await expect(page.locator('#pageFolio')).toContainText('巻一 · 第 1 回');
    await expect(page.locator('#openPage')).toHaveText('出 陣');
    await expect(page.locator('#pageBack')).toHaveText('目録へ');
    await page.evaluate(() => localStorage.removeItem('sanguo_poker_language'));
  });
});
