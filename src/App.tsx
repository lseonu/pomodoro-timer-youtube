import React, { useState } from 'react';
import Timer from './components/Timer';
import Settings from './components/Settings';
import { VideoList } from './components/VideoList';
import ExportSection from './components/ExportSection';
import Notification from './components/Notification';
import { TimerSettings, Video, TimerState } from './types';
import { FaClock } from 'react-icons/fa';

type NotificationType = 'success' | 'info' | 'error';

const defaultSettings: TimerSettings = {
  workTime: 25,
  breakTime: 5,
  studyDuration: 25,
  breakDuration: 5,
  sessions: 4,
  longBreakAfter: 4,
  longBreakDuration: 15
};

const defaultTimerState: TimerState = {
  isRunning: false,
  isBreak: false,
  timeLeft: defaultSettings.workTime * 60,
  currentSession: 1
};

function App() {
  const [settings, setSettings] = useState<TimerSettings>(defaultSettings);
  const [videos, setVideos] = useState<Video[]>([]);
  const [timerState, setTimerState] = useState<TimerState>(defaultTimerState);
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
  } | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const validateSettings = () => {
    if (settings.workTime <= 0) {
      setValidationMessage('Work time must be greater than 0');
      return false;
    }
    if (settings.breakTime <= 0) {
      setValidationMessage('Break time must be greater than 0');
      return false;
    }
    if (settings.longBreakDuration <= 0) {
      setValidationMessage('Long break duration must be greater than 0');
      return false;
    }
    if (settings.sessions <= 0) {
      setValidationMessage('Number of sessions must be greater than 0');
      return false;
    }
    if (settings.longBreakAfter <= 0) {
      setValidationMessage('Long break frequency must be greater than 0');
      return false;
    }
    if (settings.longBreakAfter > settings.sessions) {
      setValidationMessage('Long break frequency cannot be greater than total sessions');
      return false;
    }
    setValidationMessage('Timer settings are valid!');
    return true;
  };

  const handleSetTime = () => {
    setShowValidation(true);
    validateSettings();
  };

  const showNotification = (message: string, type: NotificationType) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center">Pomodoro Timer</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <Settings
              settings={settings}
              onSettingsChange={setSettings}
            />
            <button
              onClick={handleSetTime}
              className="w-full px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
            >
              <FaClock /> Set Timer
            </button>
            {showValidation && (
              <div className={`p-4 rounded-md ${validationMessage.includes('valid') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {validationMessage}
              </div>
            )}
            <h2 className="text-xl font-semibold">Add Break Time Video</h2>
            <VideoList
              videos={videos}
              onVideosChange={setVideos}
            />
          </div>
          
          <div className="space-y-8">
            <Timer
              settings={settings}
              videos={videos}
              timerState={timerState}
              onTimerStateChange={setTimerState}
            />
            <ExportSection
              settings={settings}
              videos={videos}
            />
          </div>
        </div>
      </div>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

export default App;
 