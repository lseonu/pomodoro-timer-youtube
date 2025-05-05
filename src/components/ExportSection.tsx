import React from 'react';
import { FaFileExport } from 'react-icons/fa';
import { exportToHTML } from '../utils/exportToHTML';
import { TimerSettings, Video } from '../types';

interface ExportSectionProps {
  settings: TimerSettings;
  videos: Video[];
}

const ExportSection = ({ settings, videos }: ExportSectionProps) => {
  const handleExport = () => {
    if (videos.length === 0) {
      alert('Please add at least one video before exporting.');
      return;
    }
    exportToHTML(settings, videos);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Export Timer</h2>
      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        <FaFileExport />
        Export as HTML
      </button>
      <p className="mt-2 text-sm text-gray-600">
        Export your timer with videos as a standalone HTML file.
      </p>
    </div>
  );
};

export default ExportSection; 