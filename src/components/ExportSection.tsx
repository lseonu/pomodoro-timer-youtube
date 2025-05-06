import React, { useState } from 'react';
import { FaFileExport, FaVideo, FaLock, FaTimes } from 'react-icons/fa';
import { exportToHTML } from '../utils/exportToHTML';
import { TimerSettings, Video } from '../types';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/email';

// Initialize EmailJS with your public key
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

interface ExportSectionProps {
  settings: TimerSettings;
  videos: Video[];
}

const ExportSection = ({ settings, videos }: ExportSectionProps) => {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleExport = () => {
    if (videos.length === 0) {
      alert('Please add at least one video before exporting.');
      return;
    }
    exportToHTML(settings, videos);
  };

  const handlePremiumClick = () => {
    if (videos.length === 0) {
      alert('Please add at least one video before exporting.');
      return;
    }
    setShowPopup(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      console.log('Attempting to send email with config:', {
        serviceId: EMAILJS_CONFIG.SERVICE_ID,
        templateId: EMAILJS_CONFIG.TEMPLATE_ID,
        publicKey: EMAILJS_CONFIG.PUBLIC_KEY
      });

      const templateParams = {
        user_email: email,
        user_name: "Pomodoro Timer User",
        message: `New premium feature interest from: ${email}`
      };

      console.log('Sending email with params:', templateParams);

      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );

      console.log('Email sent successfully:', response);
      setSubmitStatus('success');
      setTimeout(() => {
        setShowPopup(false);
        setEmail('');
        setSubmitStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Detailed error sending email:', error);
      setSubmitStatus('error');
      setErrorMessage(`Failed to send email: ${error.message || 'Please try again later.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Export Timer</h2>
      <div className="space-y-4">
        <button
          onClick={handleExport}
          className="w-full flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          <FaFileExport />
          Export and See in New Tab
        </button>
        <button
          onClick={handlePremiumClick}
          className="w-full flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
        >
          <FaLock className="text-yellow-300" />
          <FaVideo />
          Premium - Export as Video
        </button>
      </div>
      <p className="mt-2 text-sm text-gray-600">
        Export your timer with videos as a new tab / HTML file.
      </p>
      <p className="mt-1 text-sm text-purple-600">
        Premium feature: Export as a video file for easy sharing and offline use.
      </p>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Premium Feature - Coming Soon!</h3>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">
              We're currently working on the video export feature. Enter your email below to be given free premium access ($5/per 10 exports) when available!
            </p>

            {submitStatus === 'success' ? (
              <div className="text-green-600 text-center py-4">
                Thank you! We'll notify you when the feature is ready.
              </div>
            ) : submitStatus === 'error' ? (
              <div className="text-red-600 text-center py-4">
                {errorMessage}
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Notify Me'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportSection; 