class VideoSession {
  private static STORAGE_KEY = 'yt_video_positions';
  private static SESSION_KEY = 'current_video_session';
  public static DEBOUNCE_TIME = 2000; // 2 seconds

  // Save to both localStorage and sessionStorage
  static savePosition(videoId: string, time: number) {
    // Persistent storage
    const persistentData = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    persistentData[videoId] = time;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(persistentData));
    
    // Session storage
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify({ videoId, time }));
  }

  // Get position with session priority
  static getPosition(videoId: string): number {
    // Check session storage first
    const sessionData = sessionStorage.getItem(this.SESSION_KEY);
    if (sessionData) {
      const { videoId: sessionVideoId, time } = JSON.parse(sessionData);
      if (sessionVideoId === videoId) return time;
    }
    
    // Fallback to persistent storage
    const persistentData = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    return persistentData[videoId] || 0;
  }

  // Clear all positions
  static clearPositions() {
    localStorage.removeItem(this.STORAGE_KEY);
    sessionStorage.removeItem(this.SESSION_KEY);
  }
}

export default VideoSession; 