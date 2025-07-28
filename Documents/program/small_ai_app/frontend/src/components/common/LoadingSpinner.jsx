import React from 'react';

const LoadingSpinner = ({ size = 'medium', message = '読み込み中...' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div
        className={`animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 ${sizeClasses[size]}`}
      ></div>
      {message && (
        <p className="mt-6 text-lg text-gray-600 font-medium">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;