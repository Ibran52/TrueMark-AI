
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { Loader } from './components/Loader';
import { Footer } from './components/Footer';
import { BarcodeScanner } from './components/BarcodeScanner';
import { Chatbot } from './components/Chatbot';
import { HowItWorksModal } from './components/HowItWorksModal';
import { HistoryModal } from './components/HistoryModal';
import { Tooltip } from './components/Tooltip';
import { verifyProductImage } from './services/geminiService';
import { AnalysisStatus, VerificationResult, HistoryItem } from './types';
import { sampleResults } from './constants';
import { ChatBubbleIcon, XCircleIcon } from './components/Icons';

const SCANNED_CODE_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+CiAgPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IndoaXRlIi8+CiAgPHBhdGggZmlsbD0iYmxhY2siIGQ9Ik0xMCAxMGgzMHYzMGgtMzB6IE0xNSAxNWgyMHYyMGgtMjB6IE02MCAxMGgzMHYzMGgtMzB6IE02NSAxNWgyMHYyMGgtMjB6IE0xMCA2MGgzMHYzMGgtMzB6IE0xNSA2NWgyMHYyMGgtMjB6IE01MCA1MGgxMHYxMGgtMTB6IE02MCA1MGgxMHYxMGgtMTB6IE03MCA1MGgxMHYxMGgtMTB6IE04MCA1MGgxMHYxMGgtMTB6IE01MCA2MGgxMHYxMGgtMTB6IE02MCA2MGgxMHYxMGgtMTB6IE03MCA2MGgxMHYxMGgtMTB6IE04MCA2MGgxMHYxMGgtMTB6IE01MCA3MGgxMHYxMGgtMTB6IE02MCA3MGgxMHYxMGgtMTB6IE03MCA3MGgxMHYxMGgtMTB6IE04MCA3MGgxMHYxMGgtMTB6IE01MCA4MGgxMHYxMGgtMTB6IE02MCA4MGgxMHYxMGgtMTB6IE03MCA4MGgxMHYxMGgtMTB6IE04MCA4MGgxMHYxMGgtMTB6IE00MCA0MGgxMHYxMGgtMTB6IE00MCA1MGgxMHYxMGgtMTB6IE00MCA2MGgxMHYxMGgtMTB6IE00MCA3MGgxMHYxMGgtMTB6IE00MCA4MGgxMHYxMGgtMTB6IE0xMCA0MGgxMHYxMGgtMTB6IE0yMCA0MGgxMHYxMGgtMTB6IE0zMCA0MGgxMHYxMGgtMTB6Ii8+Cjwvc3ZnPg==';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scannerInitialMode, setScannerInitialMode] = useState<'scan' | 'manual'>('scan');
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);
  const [isHowItWorksModalOpen, setIsHowItWorksModalOpen] = useState<boolean>(false);
  const [scanHistory, setScanHistory] = useState<HistoryItem[]>([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
        const storedHistory = localStorage.getItem('scanHistory');
        if (storedHistory) {
            setScanHistory(JSON.parse(storedHistory));
        }
    } catch (err) {
        console.error("Failed to load scan history:", err);
        localStorage.removeItem('scanHistory');
    }
  }, []);

  useEffect(() => {
    try {
        if (scanHistory.length > 0) {
            localStorage.setItem('scanHistory', JSON.stringify(scanHistory));
        } else {
             localStorage.removeItem('scanHistory');
        }
    } catch (err) {
        console.error("Failed to save scan history:", err);
    }
  }, [scanHistory]);

  const runVerification = useCallback(async (type: 'image' | 'code', preview: string | null) => {
    setStatus(AnalysisStatus.ANALYZING);
    setError(null);
    setResult(null);

    if (type === 'image' && preview) {
      try {
        const verificationResult = await verifyProductImage(preview);
        const newHistoryItem: HistoryItem = {
          ...verificationResult,
          id: Date.now(),
          type: type,
          imagePreview: preview,
        };
        setScanHistory(prev => [newHistoryItem, ...prev.slice(0, 49)]);
        setResult(verificationResult);
        setStatus(AnalysisStatus.SUCCESS);
      } catch (err: any) {
        console.error("Verification failed:", err);
        let userMessage = 'An unexpected error occurred. Please try again later.';
        switch (err.message) {
            case 'API_KEY_INVALID':
                userMessage = "There's an issue with the application's configuration. Please contact support.";
                break;
            case 'NETWORK_ERROR':
                userMessage = 'Failed to connect to the AI service. Please check your internet connection and try again.';
                break;
            case 'INVALID_IMAGE_DATA':
                userMessage = 'The uploaded image could not be processed. It might be corrupted or in an unsupported format. Please try a different photo.';
                break;
            case 'AI_SERVICE_UNAVAILABLE':
                userMessage = 'The AI verification service is temporarily unavailable. Please try again in a few moments.';
                break;
            case 'AI_RESPONSE_INVALID':
                userMessage = 'The AI returned an unexpected response. Please try again.';
                break;
            default:
                userMessage = 'Failed to analyze the product. The AI model might be unavailable. Please try again later.';
                break;
        }
        setError(userMessage);
        setStatus(AnalysisStatus.ERROR);
      }
    } else { // Handle barcode/QR code scan (simulated)
      try {
        await new Promise(resolve => setTimeout(resolve, 3000));
        const isFake = Math.random() > 0.5;
        const resultsPool = isFake ? sampleResults.fake : sampleResults.real;
        const verificationResult = resultsPool[Math.floor(Math.random() * resultsPool.length)];

        const newHistoryItem: HistoryItem = {
          ...verificationResult,
          id: Date.now(),
          type: type,
          imagePreview: preview,
        };

        setScanHistory(prev => [newHistoryItem, ...prev.slice(0, 49)]);
        setResult(verificationResult);
        setStatus(AnalysisStatus.SUCCESS);
      } catch (err) {
        console.error(err);
        setError('Failed to analyze the product. The AI model might be unavailable. Please try again later.');
        setStatus(AnalysisStatus.ERROR);
      }
    }
  }, []);

  const handleImageChange = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setResult(null);
    setStatus(AnalysisStatus.IDLE);
    setError(null);
  };

  const handleImageVerification = useCallback(() => {
    if (imagePreview) {
      runVerification('image', imagePreview);
    }
  }, [imagePreview, runVerification]);
  
  const handleScanClick = () => {
    setIsScanning(true);
    setScannerInitialMode('scan');
    setResult(null);
    setStatus(AnalysisStatus.IDLE);
    setError(null);
  };

  const handleManualEntryClick = () => {
    setIsScanning(true);
    setScannerInitialMode('manual');
    setResult(null);
    setStatus(AnalysisStatus.IDLE);
    setError(null);
  };
  
  const handleCancelScan = () => {
    setIsScanning(false);
  };
  
  const handleScanComplete = useCallback(() => {
    setIsScanning(false);
    setImageFile(null);
    setImagePreview(SCANNED_CODE_PLACEHOLDER);
    runVerification('code', SCANNED_CODE_PLACEHOLDER);
  }, [runVerification]);

  const handleReset = () => {
    setImageFile(null);
    setImagePreview(null);
    setResult(null);
    setStatus(AnalysisStatus.IDLE);
    setError(null);
  };

  const handleClearHistory = () => {
    setScanHistory([]);
  };

  return (
    <div className="min-h-screen bg-brand-dark text-white flex flex-col font-sans">
      {isScanning && <BarcodeScanner onScanComplete={handleScanComplete} onCancel={handleCancelScan} initialMode={scannerInitialMode} />}
      {isHowItWorksModalOpen && <HowItWorksModal onClose={() => setIsHowItWorksModalOpen(false)} />}
      {isHistoryModalOpen && <HistoryModal history={scanHistory} onClearHistory={handleClearHistory} onClose={() => setIsHistoryModalOpen(false)} />}
      <Header onHistoryClick={() => setIsHistoryModalOpen(true)} />
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700">
            {!imagePreview && (
              <div className="animate-fade-in">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-brand-light mb-2">Verify Product Authenticity</h2>
                <p className="text-center text-gray-400 mb-6">
                  Upload a photo or scan the barcode to let our AI determine if your product is genuine.
                  <Tooltip text="Learn about our AI verification process." className="inline-block ml-1">
                    <button 
                      onClick={() => setIsHowItWorksModalOpen(true)} 
                      className="text-brand-primary font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-brand-primary rounded"
                    >
                      How does it work?
                    </button>
                  </Tooltip>
                </p>
                <ImageUploader onImageChange={handleImageChange} onScanClick={handleScanClick} onManualEntryClick={handleManualEntryClick} />
              </div>
            )}
            
            {imagePreview && (
              <div className="animate-fade-in">
                <ImageUploader onImageChange={handleImageChange} onScanClick={handleScanClick} onManualEntryClick={handleManualEntryClick} imagePreview={imagePreview} />
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleImageVerification}
                    disabled={status === AnalysisStatus.ANALYZING}
                    className="w-full bg-brand-primary hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    {status === AnalysisStatus.ANALYZING ? 'Analyzing...' : 'Verify Again'}
                  </button>
                  <button
                    onClick={handleReset}
                    className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            )}

            {status === AnalysisStatus.ANALYZING && <Loader />}
            
            {error && (
              <div className="mt-6 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-center animate-fade-in">
                {error}
              </div>
            )}
            
            {status === AnalysisStatus.SUCCESS && result && <ResultDisplay result={result} />}
          </div>
        </div>
      </main>
      <Footer />
      
      {/* Chatbot */}
      {isChatbotOpen && <Chatbot onClose={() => setIsChatbotOpen(false)} />}
      
      {/* FAB to toggle chatbot */}
      <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-40">
        <Tooltip text="Chat with Luci, our AI assistant.">
          <button
            onClick={() => setIsChatbotOpen(!isChatbotOpen)}
            aria-label={isChatbotOpen ? 'Close chat' : 'Open chat'}
            className="bg-brand-accent hover:bg-pink-500 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-accent"
          >
            <div className="relative w-8 h-8 flex items-center justify-center">
                <ChatBubbleIcon className={`absolute transition-opacity duration-300 ${isChatbotOpen ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} />
                <XCircleIcon className={`absolute transition-opacity duration-300 ${isChatbotOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`} />
            </div>
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default App;
