import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl shadow-lg max-w-md mx-auto">
      <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mb-6" />
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        エラーが発生しました
      </h3>
      <p className="text-gray-600 mb-6 text-lg leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-base font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          再試行
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;