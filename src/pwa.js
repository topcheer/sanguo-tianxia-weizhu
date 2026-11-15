// pwa.js —— 安装入口与 Service Worker 注册;安装能力缺失时不影响网页流程。
export const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
export const isIos = () => /iPhone|iPad|iPod/.test(navigator.userAgent);

export function initPwa() {
  const button = document.getElementById('pwaInstallBtn');
  let deferredPrompt = null;

  function notice(text) {
    const el = document.createElement('div');
    el.className = 'pwa-notice';
    el.setAttribute('role', 'status');
    el.textContent = text;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 5000);
  }

  if (isIos() && !isStandalone()) {
    button.textContent = '添加到主屏幕';
    button.classList.remove('hidden');
  }
  window.addEventListener('beforeinstallprompt', event => {
    if (isStandalone()) return;
    event.preventDefault();
    deferredPrompt = event;
    button.textContent = '安装 App';
    button.classList.remove('hidden');
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    button.classList.add('hidden');
    notice('残卷已安装到设备，可从应用图标打开。');
  });
  if (isStandalone()) button.classList.add('hidden');

  button.addEventListener('click', async () => {
    if (isIos()) {
      notice('请在 Safari 中点击“分享”，再选择“添加到主屏幕”。');
      return;
    }
    if (!deferredPrompt) return;
    button.disabled = true;
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      deferredPrompt = null;
      if (choice.outcome === 'accepted') button.classList.add('hidden');
    } finally {
      button.disabled = false;
    }
  });

  const local = ['localhost', '127.0.0.1', '::1'].includes(location.hostname);
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || local)) {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {});
  }
}
