
import React from 'react';
import { XCircleIcon, ImageIcon, BarcodeIcon, DocumentTextIcon, QRIcon } from './Icons';

interface HowItWorksModalProps {
  onClose: () => void;
}

const InfoStep: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-brand-primary/20 rounded-full text-brand-primary">
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  </div>
);

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-it-works-title"
    >
      <div
        className="relative w-full max-w-lg bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 animate-slide-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 id="how-it-works-title" className="text-2xl font-bold text-white">How Our AI Works</h2>
          <button onClick={onClose} aria-label="Close" className="p-1 text-gray-400 hover:text-white transition-colors">
            <XCircleIcon className="w-8 h-8" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <InfoStep
            icon={<ImageIcon className="w-6 h-6" />}
            title="1. Visual Inspection"
            description="Our AI meticulously examines the product photo, checking for inconsistencies in the logo, print quality, color accuracy, and packaging materials. It's trained on thousands of images to spot the subtle flaws common in counterfeit items."
          />
          <InfoStep
            icon={<div className="flex items-center gap-1"><BarcodeIcon className="w-6 h-6" /><QRIcon className="w-6 h-6" /></div>}
            title="2. Barcode & QR Code Verification"
            description="When you scan or enter a barcode or QR code, we check it against a comprehensive global database. The AI verifies if the code is valid, registered to the correct product, and not a known duplicate used on fakes."
          />
          <InfoStep
            icon={<DocumentTextIcon className="w-6 h-6" />}
            title="3. Text & Font Analysis"
            description="Using Optical Character Recognition (OCR), the AI reads all text on the packaging. It flags any spelling mistakes, grammatical errors, or deviations from the brand's official font, which are common red flags for fakes."
          />
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-800/50 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full bg-brand-primary hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};
