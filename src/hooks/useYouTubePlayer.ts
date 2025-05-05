import { useEffect, useRef, useState } from 'react';
import { VideoPositionManager } from '../utils/videoPositionManager';

export const useYouTubePlayer = (videoId: string) => {
  const playerRef = useRef<YT.Player | null>(null);
  const [isReady, setIsReady] = useState(false);
  const lastSaveTimeRef = useRef(0);

  const initializePlayer = (element: HTMLDivElement) => {
    if (playerRef.current) return;

    playerRef.current = new window.YT.Player(element, {
      videoId,
      playerVars: {
        autoplay: 1,
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
        enablejsapi: 1,
        origin: window.location.origin,
        mute: 0,
        controls: 1,
        fs: 1,
        iv_load_policy: 3
      },
      events: {
        onReady: (event) => {
          const savedTime = VideoPositionManager.getPosition(videoId);
          event.target.seekTo(savedTime, true);
          setIsReady(true);
        },
        onStateChange: (event) => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            const now = Date.now();
            if (now - lastSaveTimeRef.current > 1000) {
              lastSaveTimeRef.current = now;
              VideoPositionManager.savePosition(
                videoId, 
                event.target.getCurrentTime()
              );
            }
          }
        }
      }
    });
  };

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        VideoPositionManager.savePosition(videoId, currentTime);
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  return { initializePlayer, isReady, playerRef };
}; 