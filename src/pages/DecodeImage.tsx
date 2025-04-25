import React, { useState, useRef } from 'react';
import { Upload, X, Search, AlertTriangle, CheckCircle, Copy } from 'lucide-react';
import { decode } from '../utils/steganography';

const DecodeImage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [usePassword, setUsePassword] = useState(false);
  const [decodedMessage, setDecodedMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.match('image.*')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setDecodedMessage(null);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setError(null);
    
    const file = event.dataTransfer.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.match('image.*')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setDecodedMessage(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDecodeMessage = async () => {
    if (!image) {
      setError('Please select an image first');
      return;
    }

    setError(null);
    setLoading(true);
    setCopied(false);

    try {
      // In a real app, this would use a backend API
      const message = await decode(
        image, 
        usePassword ? password : undefined
      );
      
      if (!message) {
        setError('No hidden message found or incorrect password');
        setDecodedMessage(null);
      } else {
        setDecodedMessage(message);
      }
    } catch (err) {
      setError('Failed to decode the message: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = () => {
    if (!decodedMessage) return;
    
    navigator.clipboard.writeText(decodedMessage)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy message:', err);
      });
  };

  const handleReset = () => {
    setImage(null);
    setImagePreview(null);
    setPassword('');
    setUsePassword(false);
    setDecodedMessage(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Decode Hidden Message
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Extract hidden messages from steganographic images.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-400 p-4 rounded-lg flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column - Image Upload */}
        <div className="space-y-6">
          <div 
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 cursor-pointer h-64 transition-colors
              ${error ? 'border-error-300 dark:border-error-700' : 'border-gray-300 dark:border-gray-700'}
              hover:border-secondary-300 dark:hover:border-secondary-700`}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageChange} 
            />
            
            {imagePreview ? (
              <div className="relative w-full h-full">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-full object-contain" 
                />
                <button 
                  className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImage(null);
                    setImagePreview(null);
                    setDecodedMessage(null);
                  }}
                >
                  <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-3" />
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  <span className="font-medium text-secondary-600 dark:text-secondary-400">
                    Click to upload
                  </span>{' '}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Upload an image that contains a hidden message
                </p>
              </>
            )}
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="mb-4">
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-secondary-600 rounded border-gray-300 focus:ring-secondary-500"
                  checked={usePassword}
                  onChange={(e) => setUsePassword(e.target.checked)}
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  This image is password protected
                </span>
              </label>
              
              {usePassword && (
                <input
                  type="password"
                  className="input text-sm"
                  placeholder="Enter password to decode"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="btn-secondary flex items-center justify-center"
                onClick={handleDecodeMessage}
                disabled={!image || loading}
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                ) : (
                  <Search className="h-5 w-5 mr-2" />
                )}
                {loading ? 'Decoding...' : 'Decode Message'}
              </button>
              
              <button
                className="btn-outline flex items-center justify-center"
                onClick={handleReset}
              >
                <X className="h-5 w-5 mr-2" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Decoded Message */}
        <div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 h-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <Search className="h-5 w-5 mr-2 text-secondary-500" />
              Decoded Message
            </h3>

            {decodedMessage ? (
              <div className="space-y-4">
                <div className="relative">
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono">
                      {decodedMessage}
                    </pre>
                  </div>
                  <button
                    onClick={handleCopyMessage}
                    className="absolute top-2 right-2 p-1.5 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-secondary-600 dark:hover:text-secondary-400"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4 text-success-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <div className="bg-secondary-50 dark:bg-secondary-900/20 p-3 rounded-lg">
                  <h4 className="font-medium text-secondary-700 dark:text-secondary-400 text-sm mb-1">
                    Message Successfully Decoded
                  </h4>
                  <p className="text-secondary-600 dark:text-secondary-300 text-xs">
                    {decodedMessage.length} characters were extracted from this image.
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-[calc(100%-2rem)] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h4 className="text-gray-700 dark:text-gray-300 mb-1">
                  No Message Decoded Yet
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Upload an image and click "Decode Message" to extract hidden text
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecodeImage;