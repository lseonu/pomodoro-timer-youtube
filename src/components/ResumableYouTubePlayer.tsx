import { useEffect, useRef } from 'react';
import { useYouTubePlayer } from '../hooks/useYouTubePlayer';

interface ResumableYouTubePlayerProps {
  videoId: string;
  onReady?: () => void;
  onTimeUpdate?: (time: number) => void;
}

export const ResumableYouTubePlayer: React.FC<ResumableYouTubePlayerProps> = ({ 
  videoId,
  onReady,
  onTimeUpdate
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { initializePlayer, isReady, playerRef } = useYouTubePlayer(videoId);
  const timeUpdateIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      
      window.onYouTubeIframeAPIReady = () => {
        if (containerRef.current) {
          initializePlayer(containerRef.current);
        }
      };
    } else if (containerRef.current) {
      initializePlayer(containerRef.current);
    }

    return () => {
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
      }
    };
  }, [videoId]);

  useEffect(() => {
    if (isReady && onReady) {
      onReady();
      
      // Regular time updates
      timeUpdateIntervalRef.current = setInterval(() => {
        if (playerRef.current) {
          const currentTime = playerRef.current.getCurrentTime();
          if (onTimeUpdate) onTimeUpdate(currentTime);
        }
      }, 1000);
    }
  }, [isReady]);

  return <div ref={containerRef} className="w-full h-full" />;
}; 