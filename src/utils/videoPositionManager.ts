export const VideoPositionManager = {
  savePosition(videoId: string, time: number): void {
    const positions = JSON.parse(localStorage.getItem('videoPositions') || '{}');
    positions[videoId] = time;
    localStorage.setItem('videoPositions', JSON.stringify(positions));
  },

  getPosition(videoId: string): number {
    const positions = JSON.parse(localStorage.getItem('videoPositions') || '{}');
    return positions[videoId] || 0;
  },

  clearPosition(videoId: string): void {
    const positions = JSON.parse(localStorage.getItem('videoPositions') || '{}');
    delete positions[videoId];
    localStorage.setItem('videoPositions', JSON.stringify(positions));
  }
}; 