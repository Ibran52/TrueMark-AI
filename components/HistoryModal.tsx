
import React, { useState } from 'react';
import { HistoryItem } from '../types';
import { XCircleIcon, TrashIcon, CheckCircleIcon, BarcodeIcon, ChevronLeftIcon } from './Icons';
import { ResultDisplay } from './ResultDisplay';
import { Tooltip } from './Tooltip';

interface HistoryModalProps {
  history: HistoryItem[];
  onClose: () => void;
  onClearHistory: () => void;
}

const HistoryListItem: React.FC<{ item: HistoryItem; onView: () => void }> = ({ item, onView }) => {
    return (
        <button onClick={onView} className="w-full flex items-center p-3 rounded-lg hover:bg-gray-700/50 transition-colors text-left">
            <div className="flex-shrink-0 w-16 h-16 bg-gray-700 rounded-md flex items-center justify-center">
                {item.imagePreview && (
                    <img
                        src={item.imagePreview}
                        alt="Scan preview"
                        className={`w-full h-full rounded-md ${item.type === 'image' ? 'object-cover' : 'object-contain p-1'}`}
                    />
                )}
            </div>
            <div className="ml-4 flex-grow">
                <p className={`font-bold ${item.isGenuine ? 'text-green-400' : 'text-red-400'}`}>
                    {item.isGenuine ? 'Genuine' : 'Counterfeit'}
                </p>
                <p className="text-sm text-gray-300">Confidence: {item.confidenceScore}%</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(item.id).toLocaleString()}</p>
            </div>
            <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${item.isGenuine ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {item.isGenuine ? <CheckCircleIcon className="w-5 h-5" /> : <XCircleIcon className="w-5 h-5" />}
            </div>
        </button>
    );
};


export const HistoryModal: React.FC<HistoryModalProps> = ({ history, onClose, onClearHistory }) => {
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your entire scan history? This action cannot be undone.')) {
        onClearHistory();
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-title"
    >
      <div
        className="relative w-full max-w-lg bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 animate-slide-up overflow-hidden flex flex-col"
        style={{ height: 'min(80vh, 700px)'}}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
          {selectedItem ? (
              <button onClick={() => setSelectedItem(null)} className="flex items-center p-1 text-gray-300 hover:text-white transition-colors">
                  <ChevronLeftIcon className="w-6 h-6" />
                  <span className="ml-1 font-semibold">Back to History</span>
              </button>
          ) : (
            <h2 id="history-title" className="text-xl font-bold text-white">Scan History</h2>
          )}
          <button onClick={onClose} aria-label="Close" className="p-1 text-gray-400 hover:text-white transition-colors">
            <XCircleIcon className="w-8 h-8" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-grow overflow-y-auto">
          {selectedItem ? (
            <ResultDisplay result={selectedItem} />
          ) : (
            history.length > 0 ? (
                <div className="space-y-2">
                    {history.map(item => (
                        <HistoryListItem key={item.id} item={item} onView={() => setSelectedItem(item)} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <BarcodeIcon className="w-16 h-16" />
                    <p className="mt-4 text-lg">No Scans Yet</p>
                    <p>Your past verification results will appear here.</p>
                </div>
            )
          )}
        </div>

        {/* Footer */}
        {!selectedItem && history.length > 0 && (
             <div className="p-4 bg-gray-800/50 border-t border-gray-700 flex-shrink-0">
                <Tooltip text="Permanently delete all scan records" className="block w-full">
                  <button
                      onClick={handleClear}
                      className="w-full bg-red-800/50 hover:bg-red-700/50 text-red-300 font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                      <TrashIcon className="w-5 h-5" />
                      Clear History
                  </button>
                </Tooltip>
            </div>
        )}
      </div>
    </div>
  );
};
