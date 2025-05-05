import React, { useEffect, useRef } from 'react';
import { Video } from '../types';

interface YouTubePlayerProps {
  video: Video;
  onStateChange?: (event: { data: number }) => void;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ video, onStateChange }) => {
  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(tag, firstScript);
      } else {
        document.body.appendChild(tag);
      }

      window.onYouTubeIframeAPIReady = () => {
        if (containerRef.current) {
          playerRef.current = new window.YT.Player(containerRef.current, {
            videoId: video.id,
            playerVars: {
              autoplay: 1,
              rel: 0,
              modestbranding: 1,
              playsinline: 1,
              enablejsapi: 1,
              origin: window.location.origin
            },
            events: {
              onStateChange: (event) => {
                if (onStateChange) {
                  onStateChange(event);
                }
              }
            }
          });
        }
      };
    } else if (containerRef.current) {
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: video.id,
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          enablejsapi: 1,
          origin: window.location.origin
        },
        events: {
          onStateChange: (event) => {
            if (onStateChange) {
              onStateChange(event);
            }
          }
        }
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [video.id, onStateChange]);

  return <div ref={containerRef} />;
};

export default YouTubePlayer; 