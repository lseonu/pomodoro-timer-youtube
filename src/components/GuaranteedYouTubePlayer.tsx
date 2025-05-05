import { useEffect, useRef, useState } from 'react';
import { VideoPositionEngine } from '../services/videoPositionEngine';

interface GuaranteedYouTubePlayerProps {
  videoId: string;
  onReady?: () => void;
  isBreak?: boolean;
}

export const GuaranteedYouTubePlayer: React.FC<GuaranteedYouTubePlayerProps> = ({ 
  videoId,
  onReady,
  isBreak = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const positionEngine = VideoPositionEngine.getInstance();
  const saveIntervalRef = useRef<NodeJS.Timeout>();
  const lastBreakStateRef = useRef(isBreak);
  const [playerInitialized, setPlayerInitialized] = useState(false);
  const [apiLoaded, setApiLoaded] = useState(false);

  // Load YouTube API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      // Create a global callback for when the API is ready
      window.onYouTubeIframeAPIReady = () => {
        setApiLoaded(true);
      };
    } else {
      setApiLoaded(true);
    }
  }, []);

  // Initialize player when API is loaded
  useEffect(() => {
    if (!apiLoaded || !containerRef.current) return;

    const initializePlayer = async () => {
      try {
        const savedPosition = await positionEngine.getPosition(videoId);
        
        playerRef.current = new window.YT.Player(containerRef.current, {
          videoId,
          playerVars: {
            autoplay: 0,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            enablejsapi: 1,
            origin: window.location.origin,
            mute: 0,
            controls: 1,
            fs: 1
          },
          events: {
            onReady: (event) => {
              if (event.target) {
                event.target.seekTo(savedPosition, true);
                if (isBreak) {
                  event.target.playVideo();
                }
                startPositionTracking(event.target);
                setPlayerInitialized(true);
                if (onReady) onReady();
              }
            },
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                positionEngine.scheduleVerification(videoId, event.target);
              }
            }
          }
        });
      } catch (error) {
        console.error('Error creating YouTube player:', error);
      }
    };

    initializePlayer();

    return () => {
      cleanupPlayer();
    };
  }, [apiLoaded, videoId, isBreak]);

  const startPositionTracking = (player: YT.Player) => {
    if (saveIntervalRef.current) {
      clearInterval(saveIntervalRef.current);
    }
    
    saveIntervalRef.current = setInterval(async () => {
      try {
        const currentTime = player.getCurrentTime();
        await positionEngine.savePosition(videoId, currentTime);
      } catch (error) {
        console.error('Error saving position:', error);
      }
    }, 1000);
  };

  const cleanupPlayer = () => {
    if (saveIntervalRef.current) {
      clearInterval(saveIntervalRef.current);
    }
    positionEngine.clearVerification(videoId);
    positionEngine.unregisterSession(videoId);
    if (playerRef.current && playerInitialized) {
      try {
        const currentTime = playerRef.current.getCurrentTime();
        positionEngine.savePosition(videoId, currentTime);
        playerRef.current.destroy();
      } catch (error) {
        console.error('Error during cleanup:', error);
      }
    }
  };

  // Handle break state changes
  useEffect(() => {
    if (!playerRef.current || !playerInitialized) return;

    const handleBreakStateChange = async () => {
      try {
        if (isBreak) {
          const savedPosition = await positionEngine.getPosition(videoId);
          if (playerRef.current) {
            playerRef.current.seekTo(savedPosition, true);
            playerRef.current.playVideo();
          }
        } else {
          if (playerRef.current) {
            playerRef.current.pauseVideo();
            const currentTime = playerRef.current.getCurrentTime();
            await positionEngine.savePosition(videoId, currentTime);
          }
        }
        lastBreakStateRef.current = isBreak;
      } catch (error) {
        console.error('Error handling break state change:', error);
      }
    };

    handleBreakStateChange();
  }, [isBreak, videoId, playerInitialized]);

  return <div ref={containerRef} className="w-full h-full" />;
}; 