import { useState, useEffect, useRef } from 'react';
import { VideoTimeMap } from '../types';

export const useVideoPlayer = () => {
  const playerRef = useRef<YT.Player | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState<string>('');
  const videoTimesRef = useRef<VideoTimeMap>({});

  const storeCurrentTime = () => {
    if (playerRef.current && currentVideoId) {
      const currentTime = playerRef.current.getCurrentTime();
      videoTimesRef.current[currentVideoId] = currentTime;
    }
  };

  const seekToStoredTime = (videoId: string) => {
    const storedTime = videoTimesRef.current[videoId] || 0;
    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(storedTime, true);
    }
    return storedTime;
  };

  return {
    playerRef,
    currentVideoId,
    setCurrentVideoId,
    storeCurrentTime,
    seekToStoredTime,
    videoTimes: videoTimesRef.current
  };
}; 