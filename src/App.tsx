import React, { useState } from 'react';
import Timer from './components/Timer';
import VideoList from './components/VideoList';
import ExportSection from './components/ExportSection';
import { TimerSettings, Video } from './types';
import { FaClock } from 'react-icons/fa';

function App() {
  const [settings, setSettings] = useState<TimerSettings>({
    workTime: 25,
    breakTime: 5,
    studyDuration: 25,
    breakDuration: 5,
    sessions: 4,
    longBreakAfter: 4,
    longBreakDuration: 15,
  });

  const [videos, setVideos] = useState<Video[]>([]);
  const [showValidation, setShowValidation] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const validateSettings = () => {
    if (settings.studyDuration <= 0) {
      setValidationMessage('Study time must be greater than 0');
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center">Pomodoro Timer</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <Timer settings={settings} videos={videos} />
            <div>
              <h2 className="text-xl font-semibold mb-4">Add Break Time Video</h2>
              <VideoList videos={videos} onVideosChange={setVideos} />
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Timer Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Study Time Duration (minutes)</label>
                  <input
                    type="number"
                    value={settings.studyDuration}
                    onChange={(e) => setSettings({ ...settings, studyDuration: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Break Time (minutes)</label>
                  <input
                    type="number"
                    value={settings.breakTime}
                    onChange={(e) => setSettings({ ...settings, breakTime: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Number of Sessions</label>
                  <input
                    type="number"
                    value={settings.sessions}
                    onChange={(e) => setSettings({ ...settings, sessions: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Long Break After (sessions)</label>
                  <input
                    type="number"
                    value={settings.longBreakAfter}
                    onChange={(e) => setSettings({ ...settings, longBreakAfter: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Long Break Duration (minutes)</label>
                  <input
                    type="number"
                    value={settings.longBreakDuration}
                    onChange={(e) => setSettings({ ...settings, longBreakDuration: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
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
              </div>
            </div>
            
            <ExportSection settings={settings} videos={videos} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
 