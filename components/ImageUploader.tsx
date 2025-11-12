
import React, { useRef } from 'react';
import { CameraIcon, UploadIcon, BarcodeIcon, KeyboardIcon, QRIcon } from './Icons';
import { Tooltip } from './Tooltip';

interface ImageUploaderProps {
  onImageChange: (file: File) => void;
  onScanClick: () => void;
  onManualEntryClick: () => void;
  imagePreview?: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, onScanClick, onManualEntryClick, imagePreview }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageChange(event.target.files[0]);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      onImageChange(event.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div
        className={`relative w-full p-4 border-2 border-dashed border-gray-600 rounded-xl text-center cursor-pointer transition-colors duration-300 hover:border-brand-primary hover:bg-gray-800/50 ${
          imagePreview ? 'h-64 sm:h-80' : 'h-48'
        }`}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        {imagePreview ? (
          <img src={imagePreview} alt="Product preview" className="w-full h-full object-contain rounded-lg" />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <CameraIcon className="w-12 h-12 mb-2" />
            <p className="font-semibold">Drag & drop an image here</p>
            <p className="text-sm">or click to browse</p>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Tooltip text="Upload, drop, or paste an image">
            <div className="p-2 bg-gray-900/70 rounded-full">
              <UploadIcon className="w-5 h-5 text-gray-300"/>
            </div>
          </Tooltip>
        </div>
      </div>

      {!imagePreview && (
        <>
          <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-600"></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
                onClick={onScanClick}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
                <BarcodeIcon className="w-6 h-6" />
                <QRIcon className="w-6 h-6" />
                <span>Scan Barcode / QR Code</span>
            </button>
            <button
                onClick={onManualEntryClick}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
                <KeyboardIcon className="w-6 h-6" />
                <span>Enter Manually</span>
            </button>
          </div>
        </>
      )}
    </>
  );
};
