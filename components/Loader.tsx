
import React from 'react';
import { AILoadingIcon } from './Icons';

export const Loader: React.FC = () => {
  return (
    <div className="mt-8 flex flex-col items-center justify-center animate-fade-in text-center">
      <AILoadingIcon className="w-12 h-12 text-brand-primary animate-pulse-fast" />
      <p className="mt-4 text-lg font-semibold text-gray-300">
        AI is analyzing your product...
      </p>
      <p className="text-sm text-gray-500">This may take a few seconds.</p>
    </div>
  );
};
