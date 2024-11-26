const { app, BrowserWindow, autoUpdater } = require('electron');
const path = require('path');

// URL de mise à jour, généralement vers la page de releases GitHub
const feedURL = 'https://github.com/ton_nom_utilisateur/ton_nom_depot/releases/latest/download/';

// Fonction qui vérifie les mises à jour
function checkForUpdates() {
  autoUpdater.setFeedURL({ url: feedURL });
  autoUpdater.checkForUpdatesAndNotify(); // Vérifie les mises à jour et les applique si disponible
}

// Créer la fenêtre principale
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
  checkForUpdates(); // Vérifie les mises à jour lors du démarrage de l'application
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

// Écouter les événements de mise à jour
autoUpdater.on('update-available', () => {
  console.log('Mise à jour disponible');
});

autoUpdater.on('update-downloaded', () => {
  console.log('Mise à jour téléchargée');
  autoUpdater.quitAndInstall(); // Redémarre l'application et installe la mise à jour
});

autoUpdater.on('error', (error) => {
  console.error('Erreur de mise à jour:', error);
});
