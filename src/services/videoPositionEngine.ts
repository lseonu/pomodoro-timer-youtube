interface VideoPosition {
  lastSaved: number;
  lastVerified: number;
  sessionCount: number;
}

export class VideoPositionEngine {
  private static instance: VideoPositionEngine;
  private positions: Map<string, number>;
  private static STORAGE_KEY = 'videoPositions';
  private activeSessions: Set<string> = new Set();
  private verificationQueue: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {
    this.positions = new Map();
    this.loadPositions();
    window.addEventListener('beforeunload', () => this.saveAllPositions());
  }

  public static getInstance(): VideoPositionEngine {
    if (!VideoPositionEngine.instance) {
      VideoPositionEngine.instance = new VideoPositionEngine();
    }
    return VideoPositionEngine.instance;
  }

  private loadPositions(): void {
    const saved = localStorage.getItem(VideoPositionEngine.STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.positions = new Map(Object.entries(parsed));
      } catch (e) {
        console.error('Failed to load video positions:', e);
        this.positions = new Map();
      }
    }
  }

  private savePositions(): void {
    const serialized = JSON.stringify(Object.fromEntries(this.positions));
    localStorage.setItem(VideoPositionEngine.STORAGE_KEY, serialized);
  }

  public registerSession(videoId: string) {
    this.activeSessions.add(videoId);
    if (!this.positions.has(videoId)) {
      this.positions.set(videoId, 0);
    }
    this.positions.set(videoId, this.positions.get(videoId) + 1);
    this.savePositions();
  }

  public unregisterSession(videoId: string) {
    this.activeSessions.delete(videoId);
    this.savePosition(videoId);
  }

  public getPosition(videoId: string): number {
    return this.positions.get(videoId) || 0;
  }

  public incrementPosition(videoId: string): void {
    const currentPosition = this.getPosition(videoId);
    this.positions.set(videoId, currentPosition + 1);
    this.savePositions();
  }

  public savePosition(videoId: string, position: number): void {
    this.positions.set(videoId, position);
    this.savePositions();
  }

  public scheduleVerification(videoId: string, player: YT.Player) {
    this.clearVerification(videoId);
    
    const timer = setTimeout(() => {
      const currentTime = player.getCurrentTime();
      const savedTime = this.positions.get(videoId) || 0;
      
      if (Math.abs(currentTime - savedTime) > 2) {
        player.seekTo(savedTime, true);
      }
      
      this.positions.set(videoId, currentTime);
    }, 1500);
    
    this.verificationQueue.set(videoId, timer);
  }

  public clearVerification(videoId: string) {
    const timer = this.verificationQueue.get(videoId);
    if (timer) clearTimeout(timer);
    this.verificationQueue.delete(videoId);
  }

  private saveAllPositions() {
    this.savePositions();
  }

  public clearAllPositions(): void {
    this.positions.clear();
    this.activeSessions.clear();
    this.verificationQueue.clear();
    localStorage.removeItem(VideoPositionEngine.STORAGE_KEY);
  }

  // Debug method
  public debug() {
    console.log('Current positions:', this.positions);
    console.log('Active sessions:', Array.from(this.activeSessions));
  }

  public clearPosition(videoId: string): void {
    this.positions.delete(videoId);
    this.savePositions();
  }
}

export default VideoPositionEngine; 