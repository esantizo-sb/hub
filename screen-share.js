export class ScreenShare {
  constructor() {
    this.stream = null;
    this.isSharing = false;
    this.isBlocked = false;
    this.initialize();
  }

  initialize() {
    this.shareButton = document.getElementById('shareScreen');
    this.stopButton = document.getElementById('stopSharing');
    this.localVideo = document.getElementById('localVideo');
  }

  async startSharing() {
    try {
      this.stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      this.localVideo.srcObject = this.stream;
      this.isSharing = true;
      
      this.shareButton.disabled = true;
      this.stopButton.disabled = false;

      // Broadcast stream to all connected peers
      window.app.peerConnection.broadcast({
        type: 'screen-share',
        stream: this.stream
      });

      this.stream.getVideoTracks()[0].onended = () => {
        this.stopSharing();
      };
    } catch (err) {
      console.error('Error sharing screen:', err);
    }
  }

  stopSharing() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.localVideo.srcObject = null;
      this.stream = null;
    }

    this.isSharing = false;
    this.shareButton.disabled = false;
    this.stopButton.disabled = true;

    window.app.peerConnection.broadcast({
      type: 'screen-share',
      stream: null
    });
  }

  toggleBlockOthers() {
    this.isBlocked = !this.isBlocked;
    
    window.app.peerConnection.broadcast({
      type: 'block',
      blocked: this.isBlocked
    });

    document.getElementById('blockOthers').textContent = 
      this.isBlocked ? 'Desbloquear Otros' : 'Bloquear Otros';
  }

  handleRemoteStream(stream, peerId) {
    if (this.isBlocked && !this.isSharing) {
      return; // Don't show stream if blocking is enabled
    }

    const remoteScreens = document.getElementById('remoteScreens');
    let remoteVideo = document.getElementById(`video-${peerId}`);

    if (!remoteVideo) {
      const div = document.createElement('div');
      div.className = 'screen';
      div.id = `screen-${peerId}`;
      
      remoteVideo = document.createElement('video');
      remoteVideo.id = `video-${peerId}`;
      remoteVideo.autoplay = true;
      
      const label = document.createElement('div');
      label.className = 'screen-label';
      label.textContent = `Usuario ${peerId}`;

      div.appendChild(remoteVideo);
      div.appendChild(label);
      remoteScreens.appendChild(div);
    }

    remoteVideo.srcObject = stream;
  }
}