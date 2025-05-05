import { useEffect, useRef, useState } from 'react';
import { VideoService } from '../services/videoService';

interface ReliableYouTubePlayerProps {
  videoId: string;
  onReady?: () => void;
}

export const ReliableYouTubePlayer: React.FC<ReliableYouTubePlayerProps> = ({ 
  videoId,
  onReady
}) => {
  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [initialized, setInitialized] = useState(false);
  const saveIntervalRef = useRef<NodeJS.Timeout>();

  // 1. Initialize Player
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);

      window.onYouTubeIframeAPIReady = initializePlayer;
    } else {
      initializePlayer();
    }

    async function initializePlayer() {
      const isEmbeddable = await VideoService.verifyVideoEmbeddable(videoId);
      if (!isEmbeddable) return;

      if (!containerRef.current) return;

      const savedPosition = await VideoService.getVideoPosition(videoId);

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          enablejsapi: 1,
          origin: window.location.origin,
          mute: 0,
          controls: 1
        },
        events: {
          onReady: () => {
            playerRef.current?.seekTo(savedPosition, true);
            playerRef.current?.playVideo();
            setInitialized(true);
            if (onReady) onReady();
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              // Double-check position after 500ms
              setTimeout(async () => {
                const currentTime = playerRef.current?.getCurrentTime() || 0;
                if (currentTime < savedPosition - 2) {
                  playerRef.current?.seekTo(savedPosition, true);
                }
              }, 500);
            }
          }
        }
      });
    }

    // Save position every 3 seconds
    saveIntervalRef.current = setInterval(async () => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        await VideoService.saveVideoPosition(videoId, currentTime);
      }
    }, 3000);

    return () => {
      clearInterval(saveIntervalRef.current);
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        VideoService.saveVideoPosition(videoId, currentTime);
        playerRef.current.destroy();
      }
    };
  }, [videoId, onReady]);

  return <div ref={containerRef} className="w-full h-full" />;
}; 