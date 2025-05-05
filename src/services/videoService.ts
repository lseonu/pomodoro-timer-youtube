export const VideoService = {
  async getVideoPosition(videoId: string): Promise<number> {
    try {
      const response = await fetch(`http://localhost:3001/api/video-position/${videoId}`);
      const data = await response.json();
      return data.position;
    } catch (error) {
      console.error('Failed to fetch video position:', error);
      return 0;
    }
  },

  async saveVideoPosition(videoId: string, position: number): Promise<void> {
    try {
      await fetch(`http://localhost:3001/api/video-position/${videoId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position })
      });
    } catch (error) {
      console.error('Failed to save video position:', error);
    }
  },

  async verifyVideoEmbeddable(videoId: string): Promise<boolean> {
    try {
      const response = await fetch(`http://localhost:3001/api/verify-video/${videoId}`);
      const data = await response.json();
      return data.embeddable;
    } catch (error) {
      console.error('Failed to verify video:', error);
      return false;
    }
  }
}; 