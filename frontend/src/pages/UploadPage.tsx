import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, Zap, RotateCcw, Info, X } from 'lucide-react';
import StarsBackground from '../components/StarsBackground';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { analyzeProduct } from '../services/api';
import { addToScanHistory } from '../services/ScanHistory';

interface UploadPageProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onAnalysisComplete: (result: string, image: string) => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ onNavigate, currentPage, onAnalysisComplete }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
      setAnalysisError('');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClear = () => {
    setUploadedImage(null);
    setAnalysisError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedImage) return;
    
    setAnalyzing(true);
    setAnalysisError('');
    
    try {
      console.log('📤 Sending uploaded image to API for analysis...');
      
      const result = await analyzeProduct(uploadedImage);
      
      if (result.success && result.analysis) {
        console.log('✅ Analysis successful');
        
        // Save to scan history
        addToScanHistory(result.analysis, uploadedImage);
        
        // Pass to results page
        onAnalysisComplete(result.analysis, uploadedImage);
      } else {
        console.error('❌ Analysis failed:', result.error);
        setAnalysisError(result.error || 'Analysis failed. Please try again.');
        alert(`Analysis Failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Error during analysis:', error);
      setAnalysisError('Failed to connect to server. Please ensure the backend is running.');
      alert('Failed to analyze product. Please ensure the backend server is running on http://localhost:5000');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen relative text-white overflow-hidden bg-black">
      <StarsBackground />
      
      <div className="relative z-10 pb-20">
        <Header />
        
        <div className="max-w-md mx-auto px-6 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-extrabold text-center text-white mt-4 mb-0.5 uppercase">Upload Image</h1>
            {/* Line Animation */}
            <div className="flex justify-center items-center gap-2 mb-1">
              <div className="h-0.5 w-20 bg-gradient-to-r from-white/40 to-white/20 rounded-full" />
              <span className="text-lg text-white font-light">✦</span>
              <div className="h-0.5 w-20 bg-gradient-to-r from-white/20 to-white/40 rounded-full" />
            </div>
            <p className="text-gray-400 text-sm capitalize">
              {uploadedImage 
                ? "Ready for analysis" 
                : "Upload a product image to analyze"
              }
            </p>
          </motion.div>

          {/* Upload/Preview Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative mb-8"
          >
            {uploadedImage ? (
              // Image Preview
              <div className="relative bg-gray-900/80 backdrop-blur-lg rounded-3xl border-2 border-gray-700 aspect-[3/4] overflow-hidden shadow-2xl">
                <img 
                  src={uploadedImage} 
                  alt="Uploaded product" 
                  className="w-full h-full object-contain"
                />
                
                {/* Clear button */}
                <button
                  onClick={handleClear}
                  className="absolute top-4 right-4 p-2 bg-red-500/80 hover:bg-red-500 rounded-full backdrop-blur-sm transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                {/* Image info overlay */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
                  <p className="text-white text-sm font-medium">Image Uploaded ✓</p>
                </div>
              </div>
            ) : (
              // Upload Area
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  relative bg-gray-900/80 backdrop-blur-lg rounded-3xl border-2 border-dashed 
                  aspect-[3/4] flex flex-col items-center justify-center cursor-pointer
                  transition-all duration-300 shadow-2xl
                  ${isDragging 
                    ? 'border-white bg-gray-800/80 scale-105' 
                    : 'border-gray-700 hover:border-gray-600 hover:bg-gray-900/90'
                  }
                `}
              >
                <motion.div
                  animate={{ 
                    scale: isDragging ? 1.1 : 1,
                    rotate: isDragging ? 5 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-24 h-24 bg-gray-800/50 rounded-3xl flex items-center justify-center mb-6 border-2 border-gray-700">
                    {isDragging ? (
                      <Upload className="w-12 h-12 text-white animate-bounce" />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  
                  <p className="text-white text-lg font-semibold mb-2">
                    {isDragging ? 'Drop image here' : 'Upload Product Image'}
                  </p>
                  <p className="text-gray-400 text-sm text-center px-8 capitalize">
                    Drag & drop or click to browse
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    Supports: JPG, PNG, WEBP
                  </p>
                </motion.div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />

                {/* Decorative corners */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-gray-600 rounded-tl-xl"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-gray-600 rounded-tr-xl"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-gray-600 rounded-bl-xl"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-gray-600 rounded-br-xl"></div>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {uploadedImage ? (
                <motion.div
                  key="uploaded-buttons"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-3"
                >
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="w-full py-4 bg-white text-black rounded-2xl font-bold text-lg hover:bg-gray-100 active:scale-[0.98] transition-all duration-200 shadow-xl flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {analyzing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-6 h-6" />
                        <span>Analyze Sustainability</span>
                      </>
                    )}
                  </button>
                  
                  {analysisError && (
                    <p className="text-red-400 text-sm text-center">{analysisError}</p>
                  )}

                  <button
                    onClick={handleClear}
                    disabled={analyzing}
                    className="w-full py-3.5 bg-gray-800/80 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-gray-700 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 border border-gray-700"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Upload Different Image</span>
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  key="upload-button"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 bg-white text-black rounded-2xl font-bold text-lg hover:bg-gray-100 active:scale-[0.98] transition-all duration-200 shadow-xl flex items-center justify-center space-x-3"
                >
                  <Upload className="w-6 h-6" />
                  <span>Choose Image</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-gray-900/60 backdrop-blur-lg rounded-2xl border border-gray-800/50 p-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Info className="w-5 h-5 text-gray-400" />
              <h3 className="text-white font-bold">Upload Tips</h3>
            </div>
            <div className="space-y-3 capitalize">
              {[
                "Choose clear, well-lit images",
                "Ensure product labels are visible",
                "Include any certifications or eco-labels",
                "Avoid blurry or low-resolution photos"
              ].map((tip, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-400 text-sm leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 grid grid-cols-3 gap-4"
          >
            {[
              { label: "Max Size", value: "10MB" },
              { label: "Formats", value: "All" },
              { label: "AI Model", value: "Gemini" }
            ].map((stat, i) => (
              <div key={i} className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-800/30">
                <div className="text-white font-bold text-lg">{stat.value}</div>
                <div className="text-gray-500 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>

        </div>
      </div>

      <BottomNav currentPage={currentPage} onNavigate={onNavigate} />
    </div>
  );
};

export default UploadPage;