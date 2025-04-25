import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Download, Settings, CheckCircle, AlertTriangle } from 'lucide-react';
import { encode } from '../utils/steganography';

const EncodeImage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [encodedImage, setEncodedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState({
    quality: 0.8,
    password: '',
    usePassword: false
  });
  const [showSettings, setShowSettings] = useState(false);
  
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
      setEncodedImage(null);
      setSuccess(false);
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
      setEncodedImage(null);
      setSuccess(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleEncodeMessage = async () => {
    if (!image) {
      setError('Please select an image first');
      return;
    }

    if (!message.trim()) {
      setError('Please enter a message to encode');
      return;
    }

    setError(null);
    setLoading(true);
    setSuccess(false);

    try {
      // In a real app, this would use a backend API
      const result = await encode(
        image, 
        message, 
        settings.usePassword ? settings.password : undefined,
        settings.quality
      );
      
      setEncodedImage(result);
      setSuccess(true);
    } catch (err) {
      setError('Failed to encode the message: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!encodedImage) return;
    
    const link = document.createElement('a');
    link.href = encodedImage;
    link.download = `steganography_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setImage(null);
    setImagePreview(null);
    setMessage('');
    setEncodedImage(null);
    setError(null);
    setSuccess(false);
    setSettings({
      quality: 0.8,
      password: '',
      usePassword: false
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Encode Message in Image
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Hide your secret message inside an innocent-looking image using steganography.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-400 p-4 rounded-lg flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400 p-4 rounded-lg flex items-start">
          <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>Message successfully encoded! You can now download the image.</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column - Image Upload */}
        <div className="space-y-6">
          <div 
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 cursor-pointer h-64 transition-colors
              ${error ? 'border-error-300 dark:border-error-700' : 'border-gray-300 dark:border-gray-700'}
              hover:border-primary-300 dark:hover:border-primary-700`}
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
                    setEncodedImage(null);
                  }}
                >
                  <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-3" />
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  <span className="font-medium text-primary-600 dark:text-primary-400">
                    Click to upload
                  </span>{' '}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  PNG, JPG, GIF up to 5MB
                </p>
              </>
            )}
          </div>

          <div>
            <button
              type="button"
              className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4 mr-1" />
              <span>{showSettings ? 'Hide Settings' : 'Show Advanced Settings'}</span>
            </button>
            
            {showSettings && (
              <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4">
                <div>
                  <label className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                      checked={settings.usePassword}
                      onChange={(e) => setSettings({...settings, usePassword: e.target.checked})}
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Use password protection
                    </span>
                  </label>
                  
                  {settings.usePassword && (
                    <input
                      type="password"
                      className="input text-sm"
                      placeholder="Enter password"
                      value={settings.password}
                      onChange={(e) => setSettings({...settings, password: e.target.value})}
                    />
                  )}
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Image Quality: {Math.round(settings.quality * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={settings.quality}
                    onChange={(e) => setSettings({...settings, quality: parseFloat(e.target.value)})}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Message Input & Result */}
        <div className="space-y-6">
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Secret Message
            </label>
            <textarea
              id="message"
              rows={6}
              className="input"
              placeholder="Enter the message you want to hide..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {message.length} characters
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="btn-primary flex items-center justify-center"
              onClick={handleEncodeMessage}
              disabled={!image || !message.trim() || loading}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              ) : (
                <ImageIcon className="h-5 w-5 mr-2" />
              )}
              {loading ? 'Encoding...' : 'Encode Message'}
            </button>
            
            <button
              className="btn-outline flex items-center justify-center"
              onClick={handleReset}
            >
              <X className="h-5 w-5 mr-2" />
              Reset
            </button>
          </div>

          {encodedImage && (
            <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Encoded Result:
              </h3>
              <div className="mb-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                <img 
                  src={encodedImage} 
                  alt="Encoded" 
                  className="max-h-48 max-w-full mx-auto object-contain rounded" 
                />
              </div>
              <button
                className="btn-secondary w-full flex items-center justify-center"
                onClick={handleDownload}
              >
                <Download className="h-5 w-5 mr-2" />
                Download Encoded Image
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EncodeImage;