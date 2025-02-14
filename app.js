import { PeerConnection } from './peer-connection.js';
import { ScreenShare } from './screen-share.js';
import { FileSharing } from './file-sharing.js';

class App {
  constructor() {
    this.peerConnection = new PeerConnection();
    this.screenShare = new ScreenShare();
    this.fileSharing = new FileSharing();
    
    this.initializeUI();
  }

  initializeUI() {
    // Screen sharing controls
    document.getElementById('shareScreen').addEventListener('click', () => this.screenShare.startSharing());
    document.getElementById('stopSharing').addEventListener('click', () => this.screenShare.stopSharing());
    document.getElementById('blockOthers').addEventListener('click', () => this.screenShare.toggleBlockOthers());

    // File and link sharing
    document.getElementById('sendFile').addEventListener('click', () => this.fileSharing.sendFile());
    document.getElementById('sendLink').addEventListener('click', () => this.fileSharing.sendLink());

    // Update connection status
    this.peerConnection.on('connected', () => {
      document.getElementById('connection-status').textContent = 'Conectado';
      document.getElementById('connection-status').style.background = '#4caf50';
    });

    this.peerConnection.on('disconnected', () => {
      document.getElementById('connection-status').textContent = 'Desconectado';
      document.getElementById('connection-status').style.background = '#f44336';
    });
  }
}

// Initialize the application
window.addEventListener('load', () => {
  window.app = new App();
});