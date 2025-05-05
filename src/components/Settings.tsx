import React, { useState } from 'react';
import { TimerSettings } from '../types';

interface SettingsProps {
  settings: TimerSettings;
  onSettingsChange: (settings: TimerSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSettingsChange }) => {
  const [localSettings, setLocalSettings] = useState<TimerSettings>(settings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({
      ...prev,
      [name]: value === '' ? '' : parseInt(value, 10)
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    if (value === '' || isNaN(numValue) || numValue <= 0) {
      // Reset to previous valid value
      setLocalSettings(prev => ({
        ...prev,
        [name]: settings[name as keyof TimerSettings]
      }));
    } else {
      // Update parent with new value
      onSettingsChange({
        ...settings,
        [name]: numValue
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Timer Settings</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Work Time (minutes)
          </label>
          <input
            type="number"
            name="workTime"
            value={localSettings.workTime}
            onChange={handleChange}
            onBlur={handleBlur}
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Break Time (minutes)
          </label>
          <input
            type="number"
            name="breakTime"
            value={localSettings.breakTime}
            onChange={handleChange}
            onBlur={handleBlur}
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Number of Sessions
          </label>
          <input
            type="number"
            name="sessions"
            value={localSettings.sessions}
            onChange={handleChange}
            onBlur={handleBlur}
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Long Break Duration (minutes)
          </label>
          <input
            type="number"
            name="longBreakDuration"
            value={localSettings.longBreakDuration}
            onChange={handleChange}
            onBlur={handleBlur}
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Long Break After (sessions)
          </label>
          <input
            type="number"
            name="longBreakAfter"
            value={localSettings.longBreakAfter}
            onChange={handleChange}
            onBlur={handleBlur}
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default Settings; 