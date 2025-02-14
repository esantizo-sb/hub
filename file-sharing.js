export class FileSharing {
  constructor() {
    this.initialize();
  }

  initialize() {
    this.fileInput = document.getElementById('fileInput');
    this.linkInput = document.getElementById('linkInput');
    this.sharedLinks = document.getElementById('sharedLinks');
    this.sharedFiles = document.getElementById('sharedFiles');
  }

  sendFile() {
    const file = this.fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = {
        type: 'file',
        file: {
          name: file.name,
          type: file.type,
          size: file.size,
          data: e.target.result
        }
      };

      window.app.peerConnection.broadcast(data);
      this.displayFile(data.file, 'Tú');
    };

    reader.readAsDataURL(file);
  }

  sendLink() {
    const link = this.linkInput.value.trim();
    if (!link) return;

    const data = {
      type: 'link',
      link: link
    };

    window.app.peerConnection.broadcast(data);
    this.displayLink(link, 'Tú');
    this.linkInput.value = '';
  }

  displayFile(file, sender) {
    const div = document.createElement('div');
    div.className = 'shared-item';
    
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    link.textContent = `${file.name} (${this.formatFileSize(file.size)})`;
    
    const info = document.createElement('span');
    info.textContent = `Compartido por ${sender}`;

    div.appendChild(link);
    div.appendChild(info);
    this.sharedFiles.appendChild(div);
  }

  displayLink(link, sender) {
    const div = document.createElement('div');
    div.className = 'shared-item';
    
    const a = document.createElement('a');
    a.href = link;
    a.target = '_blank';
    a.textContent = link;
    
    const info = document.createElement('span');
    info.textContent = `Compartido por ${sender}`;

    div.appendChild(a);
    div.appendChild(info);
    this.sharedLinks.appendChild(div);
  }

  formatFileSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  }
}