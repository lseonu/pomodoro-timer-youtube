interface VideoPosition {
  lastSaved: number;
  lastVerified: number;
  sessionCount: number;
}

export class VideoPositionEngine {
  private static instance: VideoPositionEngine;
  private positions: Record<string, VideoPosition> = {};
  private activeSessions: Set<string> = new Set();
  private verificationQueue: Map<string, NodeJS.Timeout> = new Map();
  private static STORAGE_KEY = 'videoPositions';

  private constructor() {
    this.loadFromStorage();
    window.addEventListener('beforeunload', () => this.saveAllPositions());
  }

  static getInstance(): VideoPositionEngine {
    if (!VideoPositionEngine.instance) {
      VideoPositionEngine.instance = new VideoPositionEngine();
    }
    return VideoPositionEngine.instance;
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem(VideoPositionEngine.STORAGE_KEY);
      if (saved) {
        this.positions = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load positions from storage:', error);
      this.positions = {};
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(VideoPositionEngine.STORAGE_KEY, JSON.stringify(this.positions));
    } catch (error) {
      console.error('Failed to save positions to storage:', error);
    }
  }

  public registerSession(videoId: string) {
    this.activeSessions.add(videoId);
    if (!this.positions[videoId]) {
      this.positions[videoId] = { lastSaved: 0, lastVerified: 0, sessionCount: 0 };
    }
    this.positions[videoId].sessionCount++;
    this.saveToStorage();
  }

  public unregisterSession(videoId: string) {
    this.activeSessions.delete(videoId);
    this.savePosition(videoId);
  }

  public async getPosition(videoId: string): Promise<number> {
    return this.positions[videoId]?.lastSaved || 0;
  }

  public async savePosition(videoId: string, time?: number) {
    if (!this.positions[videoId]) {
      this.positions[videoId] = { lastSaved: 0, lastVerified: 0, sessionCount: 0 };
    }
    
    if (time !== undefined) {
      this.positions[videoId].lastSaved = time;
      this.positions[videoId].lastVerified = time;
    }
    this.saveToStorage();
  }

  public scheduleVerification(videoId: string, player: YT.Player) {
    this.clearVerification(videoId);
    
    const timer = setTimeout(() => {
      const currentTime = player.getCurrentTime();
      const savedTime = this.positions[videoId]?.lastSaved || 0;
      
      if (Math.abs(currentTime - savedTime) > 2) {
        player.seekTo(savedTime, true);
      }
      
      this.positions[videoId].lastVerified = currentTime;
      this.savePosition(videoId, currentTime);
    }, 1500);
    
    this.verificationQueue.set(videoId, timer);
  }

  public clearVerification(videoId: string) {
    const timer = this.verificationQueue.get(videoId);
    if (timer) clearTimeout(timer);
    this.verificationQueue.delete(videoId);
  }

  private saveAllPositions() {
    this.saveToStorage();
  }

  public clearAllPositions() {
    this.positions = {};
    this.activeSessions.clear();
    this.verificationQueue.clear();
    localStorage.removeItem(VideoPositionEngine.STORAGE_KEY);
  }

  // Debug method
  public debug() {
    console.log('Current positions:', this.positions);
    console.log('Active sessions:', Array.from(this.activeSessions));
  }
} 