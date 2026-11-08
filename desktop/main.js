// main.js —— Electron 桌面壳:直接加载 web 构建产物 dist/(完全离线)。
// 窗口基准 1440x900,与 macOS 原生版一致;深色底避免启动闪白。
// 全屏:窗口菜单「切换全屏」,快捷键 F11(Windows/Linux) / Cmd+Ctrl+F(macOS),由 Electron
// togglefullscreen 角色自动绑定(菜单栏隐藏时快捷键依然生效)。
const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

const isMac = process.platform === 'darwin';

function createWindow() {
  // 运行时窗口/任务栏图标:macOS 系统自带;win/linux 用打包内 resources/icons
  const iconPath = isMac ? undefined :
    path.join(process.resourcesPath || '', 'icons', 'icon-512.png');
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 640,
    ...(iconPath && require('fs').existsSync(iconPath) ? { icon: iconPath } : {}),
    backgroundColor: '#0d110d',
    title: '三国：天下为注',
    autoHideMenuBar: !isMac,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      // dist/ 的 Service Worker 在 file:// 下无意义,禁用避免控制台噪音
      serviceWorkers: false,
    },
  });
  win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  win.setMenuBarVisibility(isMac);
  return win;
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    ...(isMac ? [{ role: 'appMenu' }] : []),
    { role: 'fileMenu' },
    { role: 'editMenu' },
    { role: 'viewMenu' },
    {
      role: 'windowMenu',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'togglefullscreen' }, // 切换全屏:F11 / Cmd+Ctrl+F
        ...(isMac ? [{ type: 'separator' }, { role: 'bringAllToFront' }] : []),
        { role: 'close' },
      ],
    },
  ]));
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
