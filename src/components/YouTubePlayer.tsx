import { useEffect, useRef } from 'react';
import { useVideoPlayer } from '../hooks/useVideoPlayer';

interface YouTubePlayerProps {
  videoId: string;
  onPlayerReady?: (player: YT.Player) => void;
  onStateChange?: (event: YT.OnStateChangeEvent) => void;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  onPlayerReady,
  onStateChange
}) => {
  const playerRef = useRef<YT.Player | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { setCurrentVideoId, seekToStoredTime } = useVideoPlayer();

  useEffect(() => {
    setCurrentVideoId(videoId);

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player(iframeRef.current!, {
        videoId,
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          enablejsapi: 1,
          origin: window.location.origin,
          mute: 1,
          controls: 1
        },
        events: {
          onReady: (event) => {
            seekToStoredTime(videoId);
            if (onPlayerReady) onPlayerReady(event.target);
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              // Final seek check when playback actually starts
              setTimeout(() => seekToStoredTime(videoId), 500);
            }
            if (onStateChange) onStateChange(event);
          }
        }
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}; 