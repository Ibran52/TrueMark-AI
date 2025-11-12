
import React, { useState } from 'react';
import { VerificationResult, AnalysisDetails } from '../types';
import { CheckCircleIcon, XCircleIcon, InfoIcon, ShareIcon } from './Icons';
import { Tooltip } from './Tooltip';

interface ResultDisplayProps {
  result: VerificationResult;
}

const DetailCard: React.FC<{ detail: AnalysisDetails; icon: React.ReactNode }> = ({ detail, icon }) => (
    <div className={`flex items-start p-4 rounded-lg bg-gray-800 border ${detail.isPositive ? 'border-green-700/50' : 'border-red-700/50'}`}>
        <div className={`mr-4 mt-1 ${detail.isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-white">{detail.title}</h4>
            <p className="text-sm text-gray-300">{detail.description}</p>
        </div>
    </div>
);


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const { isGenuine, confidenceScore, imageAnalysis, barcodeAnalysis, textAnalysis } = result;
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');

  const resultColor = isGenuine ? 'text-green-400' : 'text-red-400';
  const bgColor = isGenuine ? 'bg-green-900/50' : 'bg-red-900/50';
  const borderColor = isGenuine ? 'border-green-700' : 'border-red-700';

  const handleShare = async () => {
    const shareText = `I just checked a product with the Authenticity Checker and it was found to be ${isGenuine ? 'Genuine' : 'Counterfeit'} with ${confidenceScore}% confidence!`;

    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Product Authenticity Result',
                text: shareText,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    } else {
        try {
            await navigator.clipboard.writeText(shareText);
            setShareStatus('copied');
            setTimeout(() => setShareStatus('idle'), 2500);
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            alert('Failed to copy result to clipboard.');
        }
    }
  };


  return (
    <div className="mt-8 animate-slide-up">
      <div className={`p-6 rounded-xl border ${borderColor} ${bgColor}`}>
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center">
            {isGenuine ? (
              <CheckCircleIcon className={`w-12 h-12 ${resultColor}`} />
            ) : (
              <XCircleIcon className={`w-12 h-12 ${resultColor}`} />
            )}
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-white">
                Product is {isGenuine ? 'Genuine' : 'Counterfeit'}
              </h3>
              <p className={`${resultColor} font-semibold`}>
                AI Confidence: {confidenceScore}%
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-300">Analysis Breakdown:</h3>
          {(navigator.share || navigator.clipboard) && (
            <Tooltip text="Share via social media or copy link">
              <button
                  onClick={handleShare}
                  disabled={shareStatus === 'copied'}
                  className="flex items-center gap-2 text-sm bg-gray-700 hover:bg-gray-600 disabled:bg-brand-secondary disabled:text-white font-semibold py-2 px-3 rounded-lg transition-all duration-300"
              >
                  <ShareIcon className="w-4 h-4" />
                  <span>{shareStatus === 'copied' ? 'Copied!' : 'Share Result'}</span>
              </button>
            </Tooltip>
          )}
        </div>
        <div className="space-y-4">
            <DetailCard detail={imageAnalysis} icon={<InfoIcon className="w-6 h-6" />} />
            <DetailCard detail={barcodeAnalysis} icon={<InfoIcon className="w-6 h-6" />} />
            <DetailCard detail={textAnalysis} icon={<InfoIcon className="w-6 h-6" />} />
        </div>
      </div>
    </div>
  );
};
