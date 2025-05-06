import React, { useEffect, useRef, useState } from 'react';
import { TimerSettings, Video } from '../types';
import GuaranteedYouTubePlayer from './GuaranteedYouTubePlayer';
import { FaPlay, FaPause, FaRedo } from 'react-icons/fa';

interface TimerProps {
  settings: TimerSettings;
  videos: Video[];
}

const Timer = ({ settings, videos }: TimerProps) => {
  const [timerState, setTimerState] = useState({
    isRunning: false,
    isBreak: false,
    currentSession: 1,
    timeLeft: settings.workTime * 60,
    totalSessions: settings.sessions,
  });

  const intervalRef = useRef<number>();

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      setTimerState((prev) => {
        if (prev.timeLeft <= 0) {
          if (prev.currentSession >= prev.totalSessions) {
            clearInterval(intervalRef.current);
            return { ...prev, isRunning: false };
          }

          const isLongBreak = prev.currentSession % settings.longBreakAfter === 0;
          const breakDuration = isLongBreak ? settings.longBreakDuration : settings.breakTime;

          return {
            ...prev,
            isBreak: true,
            timeLeft: breakDuration * 60,
            currentSession: prev.currentSession + 1,
          };
        }

        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    setTimerState((prev) => ({ ...prev, isRunning: true }));
  };

  const pauseTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTimerState((prev) => ({ ...prev, isRunning: false }));
  };

  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTimerState({
      isRunning: false,
      isBreak: false,
      currentSession: 1,
      timeLeft: settings.workTime * 60,
      totalSessions: settings.sessions,
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const currentVideo = videos[timerState.currentSession % videos.length];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="text-center">
        <p className="text-6xl font-bold font-mono text-gray-800">
          {formatTime(timerState.timeLeft)}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Session {timerState.currentSession} of {timerState.totalSessions}
        </p>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        {!timerState.isRunning ? (
          <button
            onClick={startTimer}
            className="p-4 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
          >
            <FaPlay className="w-6 h-6" />
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="p-4 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
          >
            <FaPause className="w-6 h-6" />
          </button>
        )}
        <button
          onClick={resetTimer}
          className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
        >
          <FaRedo className="w-6 h-6" />
        </button>
      </div>

      {timerState.isBreak && currentVideo && (
        <div className="mt-6">
          <GuaranteedYouTubePlayer
            video={currentVideo}
            isBreak={timerState.isBreak}
            onVideoEnd={() => {
              if (timerState.isBreak) {
                setTimerState((prev) => ({
                  ...prev,
                  isBreak: false,
                  timeLeft: settings.workTime * 60,
                }));
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Timer; 