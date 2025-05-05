import React, { useEffect } from 'react';
import { FaCheckCircle, FaInfoCircle, FaExclamationCircle } from 'react-icons/fa';

interface NotificationProps {
  message: string;
  type: 'success' | 'info' | 'error';
  onClose: () => void;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'info':
        return <FaInfoCircle className="text-blue-500" />;
      case 'error':
        return <FaExclamationCircle className="text-red-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100';
      case 'info':
        return 'bg-blue-100';
      case 'error':
        return 'bg-red-100';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`${getBgColor()} rounded-lg shadow-lg p-4 flex items-center gap-2`}>
        {getIcon()}
        <span className="text-gray-800">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Notification; 