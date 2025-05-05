import React, { useEffect, useRef, useState } from 'react';
import { Video } from '../types';
import { VideoPositionEngine } from '../services/videoPositionEngine';

interface GuaranteedYouTubePlayerProps {
  video: Video;
  isBreak: boolean;
  onVideoEnd: () => void;
}

const GuaranteedYouTubePlayer = ({ video, isBreak, onVideoEnd }: GuaranteedYouTubePlayerProps) => {
  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [apiLoaded, setApiLoaded] = useState(false);
  const positionEngine = useRef(VideoPositionEngine.getInstance());

  useEffect(() => {
    // Load YouTube API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      setApiLoaded(true);
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (!apiLoaded || !containerRef.current) return;

    const savedPosition = positionEngine.current.getPosition(video.id);
    
    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId: video.id,
      playerVars: {
        autoplay: 0,
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
        enablejsapi: 1,
        origin: window.location.origin,
      },
      events: {
        onReady: (event) => {
          if (savedPosition) {
            event.target.seekTo(savedPosition, true);
          }
        },
        onStateChange: (event) => {
          if (event.data === window.YT.PlayerState.ENDED) {
            onVideoEnd();
          }
        },
      },
    });

    return () => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        positionEngine.current.savePosition(video.id, currentTime);
        playerRef.current.destroy();
      }
    };
  }, [apiLoaded, video.id, onVideoEnd]);

  useEffect(() => {
    if (!playerRef.current) return;

    if (isBreak) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }, [isBreak]);

  return <div ref={containerRef} className="w-full aspect-video" />;
};

export default GuaranteedYouTubePlayer; 