import { useEffect, useRef } from 'react';
import { VideoTracker } from '../services/videoTracker';

interface AtomicYouTubePlayerProps {
  videoId: string;
  onReady?: () => void;
}

export const AtomicYouTubePlayer: React.FC<AtomicYouTubePlayerProps> = ({ 
  videoId,
  onReady
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const tracker = VideoTracker.getInstance();

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);

      window.onYouTubeIframeAPIReady = initializePlayer;
    } else {
      initializePlayer();
    }

    function initializePlayer() {
      if (!containerRef.current) return;

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
          onReady: (event) => {
            tracker.registerPlayer(event.target, videoId);
            if (onReady) onReady();
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              // Final position verification
              setTimeout(() => {
                const currentTime = event.target.getCurrentTime();
                const savedTime = tracker.getPosition(videoId);
                if (currentTime < savedTime - 2) {
                  event.target.seekTo(savedTime, true);
                }
              }, 500);
            }
          }
        }
      });
    }

    // Debug command
    (window as any).debugPlayer = () => {
      console.log('Player instance:', playerRef.current);
      tracker.debugPositions();
    };

    return () => {
      tracker.unregisterPlayer();
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, onReady]);

  return <div ref={containerRef} className="w-full h-full" />;
}; 