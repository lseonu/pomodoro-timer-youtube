import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { TimerSettings, Video } from '../types';
import { GuaranteedYouTubePlayer } from './GuaranteedYouTubePlayer';
import { VideoPositionEngine } from '../services/videoPositionEngine';

interface TimerState {
  isRunning: boolean;
  isBreak: boolean;
  currentSession: number;
  timeLeft: number;
}

interface TimerProps {
  settings: TimerSettings;
  videos: Video[];
  timerState: TimerState;
  onTimerStateChange: Dispatch<SetStateAction<TimerState>>;
}

const Timer: React.FC<TimerProps> = ({ settings, videos, timerState, onTimerStateChange }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const positionEngine = VideoPositionEngine.getInstance();

  // Initialize timer with settings
  useEffect(() => {
    onTimerStateChange({
      isRunning: false,
      isBreak: false,
      currentSession: 1,
      timeLeft: settings.workTime * 60
    });
  }, [settings.workTime]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerState.isRunning && timerState.timeLeft > 0) {
      timer = setInterval(() => {
        onTimerStateChange(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (timerState.timeLeft === 0) {
      onTimerStateChange(prev => ({ ...prev, isRunning: false }));
      if (timerState.isBreak) {
        if (videos.length > 0) {
          const currentVideo = videos[currentVideoIndex];
          positionEngine.getPosition(currentVideo.id).then(currentTime => {
            positionEngine.savePosition(currentVideo.id, currentTime);
          });
        }
        onTimerStateChange(prev => ({ 
          ...prev, 
          isBreak: false,
          timeLeft: settings.workTime * 60 
        }));
      } else {
        onTimerStateChange(prev => ({ 
          ...prev, 
          isBreak: true,
          timeLeft: settings.breakTime * 60 
        }));
        setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
      }
    }
    return () => clearInterval(timer);
  }, [timerState.isRunning, timerState.timeLeft, timerState.isBreak, settings.workTime, settings.breakTime, videos.length, currentVideoIndex, videos]);

  const toggleTimer = () => {
    onTimerStateChange(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const resetTimer = () => {
    onTimerStateChange({
      isRunning: false,
      isBreak: false,
      currentSession: 1,
      timeLeft: settings.workTime * 60
    });
    setCurrentVideoIndex(0);
    positionEngine.clearAllPositions();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-6xl font-bold">{formatTime(timerState.timeLeft)}</div>
      <div className="text-2xl">{timerState.isBreak ? 'Break Time' : 'Work Time'}</div>
      
      <div className="flex space-x-4">
        <button
          onClick={toggleTimer}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {timerState.isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetTimer}
          className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>

      {videos.length > 0 && (
        <div className="w-full max-w-4xl aspect-video mt-8">
          <GuaranteedYouTubePlayer
            videoId={videos[currentVideoIndex].id}
            onReady={() => setPlayerReady(true)}
            isBreak={timerState.isBreak}
          />
        </div>
      )}
    </div>
  );
};

export default Timer; 