import React, { useState } from 'react';
import { TimerSettings, Video } from '../types';
import { FaDownload, FaVideo, FaClock } from 'react-icons/fa';
import { exportToHTML } from '../utils/exportToHTML';

interface ExportSectionProps {
  settings: TimerSettings;
  videos: Video[];
}

const ExportSection: React.FC<ExportSectionProps> = ({ settings, videos }) => {
  const [isGenerating, setIsGenerating] = useState(false);
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

  const handleExport = () => {
    if (videos.length === 0) {
      alert('Please add at least one video before exporting.');
      return;
    }
    if (!validateSettings()) {
      alert('Please fix the timer settings before exporting.');
      return;
    }
    exportToHTML(settings, videos);
  };

  const generateVideo = async () => {
    setIsGenerating(true);
    try {
      // Create a canvas to record the timer
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Set canvas size
      canvas.width = 1280;
      canvas.height = 720;

      // Create a MediaRecorder
      const stream = canvas.captureStream(30);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pomodoro-timer.webm';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsGenerating(false);
      };

      // Start recording
      mediaRecorder.start();

      // Simulate timer for 5 seconds (for demo)
      let timeLeft = 5;
      const interval = setInterval(() => {
        if (timeLeft <= 0) {
          clearInterval(interval);
          mediaRecorder.stop();
          return;
        }

        // Clear canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw timer
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 72px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(formatTime(timeLeft), canvas.width / 2, canvas.height / 2);

        timeLeft--;
      }, 1000);
    } catch (error) {
      console.error('Error generating video:', error);
      setIsGenerating(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mt-8 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Export Timer</h2>
      
      <div className="space-y-4">
        {showValidation && (
          <div className={`p-4 rounded-md ${validationMessage.includes('valid') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {validationMessage}
          </div>
        )}

        <button
          onClick={handleExport}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <FaDownload /> Export as HTML
        </button>

        <button
          onClick={generateVideo}
          disabled={isGenerating}
          className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <FaVideo /> {isGenerating ? 'Generating...' : 'Generate Video'}
        </button>
      </div>
    </div>
  );
};

export default ExportSection; 