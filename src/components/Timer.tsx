import React, { useEffect, useRef, useState } from 'react';
import { TimerSettings, Video } from '../types';
import GuaranteedYouTubePlayer from './GuaranteedYouTubePlayer';

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
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          {timerState.isBreak ? 'Break Time' : 'Work Time'}
        </h2>
        <p className="text-4xl font-mono">{formatTime(timerState.timeLeft)}</p>
        <p className="text-sm text-gray-600">
          Session {timerState.currentSession} of {timerState.totalSessions}
        </p>
      </div>

      <div className="flex justify-center gap-4">
        {!timerState.isRunning ? (
          <button
            onClick={startTimer}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Start
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Pause
          </button>
        )}
        <button
          onClick={resetTimer}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Reset
        </button>
      </div>

      {timerState.isBreak && currentVideo && (
        <div className="mt-4">
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