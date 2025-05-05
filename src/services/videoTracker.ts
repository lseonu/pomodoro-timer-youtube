export class VideoTracker {
  private static STORAGE_KEY = 'videoPositionTracker';
  private static instance: VideoTracker;
  private positions: Record<string, number> = {};
  private activePlayer: YT.Player | null = null;
  private currentVideoId: string = '';
  private saveInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.loadPositions();
    this.setupAutoSave();
  }

  static getInstance(): VideoTracker {
    if (!VideoTracker.instance) {
      VideoTracker.instance = new VideoTracker();
    }
    return VideoTracker.instance;
  }

  private loadPositions() {
    const saved = localStorage.getItem(VideoTracker.STORAGE_KEY);
    this.positions = saved ? JSON.parse(saved) : {};
  }

  private savePositions() {
    localStorage.setItem(VideoTracker.STORAGE_KEY, JSON.stringify(this.positions));
  }

  private setupAutoSave() {
    this.saveInterval = setInterval(() => {
      if (this.activePlayer && this.currentVideoId) {
        const time = this.activePlayer.getCurrentTime();
        this.positions[this.currentVideoId] = time;
        this.savePositions();
      }
    }, 3000); // Save every 3 seconds
  }

  registerPlayer(player: YT.Player, videoId: string) {
    this.activePlayer = player;
    this.currentVideoId = videoId;
    
    // Apply saved position immediately
    const savedTime = this.positions[videoId] || 0;
    player.seekTo(savedTime, true);
    
    // Double-check after 1 second
    setTimeout(() => {
      if (player.getCurrentTime() < savedTime - 2) {
        player.seekTo(savedTime, true);
      }
    }, 1000);
  }

  unregisterPlayer() {
    if (this.activePlayer && this.currentVideoId) {
      const time = this.activePlayer.getCurrentTime();
      this.positions[this.currentVideoId] = time;
      this.savePositions();
    }
    this.activePlayer = null;
    this.currentVideoId = '';
  }

  getPosition(videoId: string): number {
    return this.positions[videoId] || 0;
  }

  debugPositions() {
    console.log('Current positions:', this.positions);
    console.log('Active player:', this.activePlayer);
    console.log('Current video:', this.currentVideoId);
  }
} 