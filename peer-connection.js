export class PeerConnection {
  constructor() {
    this.peer = new Peer(this.generatePeerId(), {
      host: 'localhost',
      port: 9000,
      path: '/myapp'
    });
    
    this.connections = new Map();
    this.events = {};
    
    this.initialize();
  }

  generatePeerId() {
    return 'user-' + Math.random().toString(36).substr(2, 9);
  }

  initialize() {
    this.peer.on('open', (id) => {
      console.log('My peer ID is: ' + id);
      this.emit('connected');
    });

    this.peer.on('connection', (conn) => {
      this.handleConnection(conn);
    });

    this.peer.on('error', (err) => {
      console.error('PeerJS error:', err);
      this.emit('disconnected');
    });
  }

  connect(peerId) {
    const conn = this.peer.connect(peerId);
    this.handleConnection(conn);
  }

  handleConnection(conn) {
    this.connections.set(conn.peer, conn);

    conn.on('data', (data) => {
      this.handleData(data, conn.peer);
    });

    conn.on('close', () => {
      this.connections.delete(conn.peer);
    });
  }

  handleData(data, peerId) {
    switch(data.type) {
      case 'screen-share':
        this.emit('screen-share', { peerId, stream: data.stream });
        break;
      case 'file':
        this.emit('file-received', { peerId, file: data.file });
        break;
      case 'link':
        this.emit('link-received', { peerId, link: data.link });
        break;
      case 'block':
        this.emit('block-received', { peerId, blocked: data.blocked });
        break;
    }
  }

  broadcast(data) {
    this.connections.forEach(conn => {
      conn.send(data);
    });
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }
}