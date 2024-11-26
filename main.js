const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const path = require('path');

// Configuration du journal pour déboguer les mises à jour
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify(); // Vérifie les mises à jour au démarrage
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Gestionnaire d'événements pour les mises à jour
autoUpdater.on('update-available', () => {
  log.info('Mise à jour disponible, téléchargement en cours...');
});

autoUpdater.on('update-downloaded', () => {
  log.info('Mise à jour téléchargée. Redémarrage requis.');
  autoUpdater.quitAndInstall(); // Redémarre l'application pour appliquer la mise à jour
});
