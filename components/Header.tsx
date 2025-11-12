
import React from 'react';
import { ShieldCheckIcon, HistoryIcon } from './Icons';
import { Tooltip } from './Tooltip';

interface HeaderProps {
    onHistoryClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onHistoryClick }) => {
  return (
    <header className="bg-gray-900/60 backdrop-blur-md p-4 border-b border-gray-700 shadow-lg sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1"></div>
        <div className="flex items-center justify-center flex-1">
            <ShieldCheckIcon className="w-8 h-8 text-brand-primary" />
            <h1 className="ml-3 text-xl font-bold text-white tracking-wider text-center">
              Product Authenticity Checker
            </h1>
        </div>
        <div className="flex-1 flex justify-end">
            <Tooltip text="View scan history">
              <button onClick={onHistoryClick} aria-label="View scan history" className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                  <HistoryIcon className="w-6 h-6 text-gray-300" />
              </button>
            </Tooltip>
        </div>
      </div>
    </header>
  );
};
