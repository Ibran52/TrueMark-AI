import React, { useEffect, useRef, useState } from 'react';
import { XCircleIcon, CameraIcon, KeyboardIcon, CheckCircleIcon } from './Icons';

interface BarcodeScannerProps {
  onScanComplete: () => void;
  onCancel: () => void;
  initialMode?: 'scan' | 'manual';
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScanComplete, onCancel, initialMode = 'scan' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isManualInput, setIsManualInput] = useState(initialMode === 'manual');
  const [barcodeValue, setBarcodeValue] = useState('');
  const [isScanSuccessful, setIsScanSuccessful] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let scanTimeout: number | null = null;
    
    const startCamera = async () => {
      setCameraError(null);
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        // Simulate scanning for 4 seconds
        scanTimeout = window.setTimeout(() => {
            setIsScanSuccessful(true);
            setTimeout(() => onScanComplete(), 1500); // Show success for 1.5s
        }, 4000);
      } catch (err: any) {
        console.error("Error accessing camera: ", err);
        let errorMessage = "Could not access the camera. Please try again.";
        if (err.name === 'NotAllowedError' || err.message.includes('Permission denied') || err.message.includes('Permission dismissed')) {
            errorMessage = "Camera permission was denied. Please enable it in your browser settings to use the scanner.";
        } else if (err.name === 'NotFoundError') {
            errorMessage = "No camera found on this device. Please ensure a camera is connected and enabled.";
        }
        setCameraError(errorMessage);
      }
    };

    if (!isManualInput && !isScanSuccessful) {
      startCamera();
    }

    return () => {
      if (scanTimeout) {
        clearTimeout(scanTimeout);
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isManualInput, onScanComplete, isScanSuccessful]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (barcodeValue.trim() && !isScanSuccessful) {
        setIsScanSuccessful(true);
        setTimeout(() => onScanComplete(), 1500); // Show success for 1.5s
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50 animate-fade-in p-4">
      <div className="relative w-full max-w-md bg-brand-dark p-4 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
        <button onClick={onCancel} className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/80 transition-colors z-30">
          <XCircleIcon className="w-8 h-8 text-white" />
        </button>

        {isScanSuccessful && (
            <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm flex flex-col items-center justify-center animate-fade-in z-20">
                <div className="scale-in-animation">
                    <CheckCircleIcon className="w-24 h-24 text-green-400" />
                </div>
                <p className="mt-4 text-lg font-semibold text-white">Scan Complete!</p>
            </div>
        )}

        <div className={isScanSuccessful ? 'opacity-0' : 'opacity-100 transition-opacity'}>
            {isManualInput ? (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold text-center text-white mb-4">Enter Barcode / QR Code Manually</h3>
                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <input 
                    type="text" 
                    value={barcodeValue}
                    onChange={(e) => setBarcodeValue(e.target.value)}
                    placeholder="Enter barcode or QR data"
                    aria-label="Barcode or QR data"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    autoFocus
                  />
                  <button 
                    type="submit" 
                    className="w-full bg-brand-primary hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300"
                    disabled={!barcodeValue.trim()}
                  >
                    Verify Code
                  </button>
                </form>
                <div className="flex items-center my-4">
                  <div className="flex-grow border-t border-gray-600"></div>
                  <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
                  <div className="flex-grow border-t border-gray-600"></div>
                </div>
                <button
                    onClick={() => setIsManualInput(false)}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                    <CameraIcon className="w-6 h-6" />
                    <span>Scan with Camera</span>
                </button>
              </div>
            ) : (
              <div className="animate-fade-in">
                <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
                    {cameraError ? (
                        <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                            <XCircleIcon className="w-12 h-12 text-red-500 mb-4" />
                            <h4 className="text-lg font-bold text-white">Camera Error</h4>
                            <p className="text-red-300">{cameraError}</p>
                        </div>
                    ) : (
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    )}
                    
                    {!cameraError && (
                        <div className="absolute inset-4 flex items-center justify-center pointer-events-none">
                          <div className="w-full h-full border-4 border-white/30 rounded-lg relative overflow-hidden">
                            <div className="absolute top-0 left-1/2 w-[calc(100%-2rem)] h-full -translate-x-1/2">
                                <div className="w-full h-1 bg-red-500 shadow-[0_0_10px_red] animate-scan-line"></div>
                            </div>
                          </div>
                        </div>
                    )}
                </div>
                
                <p className="text-center text-white my-4">
                  {cameraError 
                    ? 'You can switch to manual entry instead.'
                    : 'Position barcode or QR code inside the frame...'
                  }
                </p>
                
                <div className="flex items-center">
                  <div className="flex-grow border-t border-gray-600"></div>
                  <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
                  <div className="flex-grow border-t border-gray-600"></div>
                </div>

                <button
                    onClick={() => setIsManualInput(true)}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mt-4"
                >
                    <KeyboardIcon className="w-6 h-6" />
                    <span>Enter Manually</span>
                </button>
              </div>
            )}
        </div>
      </div>

      <style>{`
        @keyframes scan-line {
          0% { transform: translateY(-0.25rem); }
          100% { transform: translateY(100%); }
        }
        .animate-scan-line {
          animation: scan-line 2s ease-in-out infinite alternate;
        }
        @keyframes scale-in {
            0% { transform: scale(0.5); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
        .scale-in-animation {
            animation: scale-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
};
