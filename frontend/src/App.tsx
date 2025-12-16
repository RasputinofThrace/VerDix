import { useState } from 'react';
import HomePage from './pages/HomePage';
import ScanPage from './pages/ScanPage';
import UploadPage from './pages/UploadPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import ResultsPage from './pages/ResultsPage';
import RecyclePage from './pages/RecyclingPage';
import CarbonCalculator from './pages/CarbonCalculatorPage';
import AlternativeFinder from './pages/AlternativeFinderPage';

interface AnalysisData {
  result: string;
  image: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'scan' | 'upload' | 'about' | 'profile' | 'results' | 'recycle' | 'carbon' | 'alternative' >(() => {
    // Initialize State From LocalStorage
    if (typeof window !== 'undefined') {
      const savedPage = localStorage.getItem('verdix-currentPage');
      if (savedPage && ['home', 'scan', 'upload', 'about', 'profile', 'results' , 'recycle' , 'carbon' , 'alternative'].includes(savedPage)) {
        return savedPage as 'home' | 'scan' | 'upload' | 'about' | 'profile' | 'results' | 'recycle' | 'carbon' | 'alternative';
      }
    }
    return 'home';
  });

  // Store analysis data for the results page
  const [analysisData, setAnalysisData] = useState<AnalysisData>(() => {
    // Try to load from sessionStorage (doesn't persist across browser closes)
    if (typeof window !== 'undefined') {
      const savedData = sessionStorage.getItem('verdix-analysisData');
      if (savedData) {
        try {
          return JSON.parse(savedData);
        } catch (e) {
          console.error('Failed to parse saved analysis data:', e);
        }
      }
    }
    return { result: '', image: '' };
  });

  const handleNavigate = (page: string) => {
    const newPage = page as 'home' | 'scan' | 'upload' | 'about' | 'profile' | 'results' | 'recycle' | 'carbon' | 'alternative';
    setCurrentPage(newPage);
    localStorage.setItem('verdix-currentPage', newPage);
    
    // Clear analysis data when leaving results page
    if (page !== 'results') {
      sessionStorage.removeItem('verdix-analysisData');
    }
  };

  // Handle analysis completion from ScanPage or UploadPage
  const handleAnalysisComplete = (result: string, image: string) => {
    const data: AnalysisData = { result, image };
    setAnalysisData(data);
    
    // Save to sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('verdix-analysisData', JSON.stringify(data));
    }
    
    // Navigate to results page
    handleNavigate('results');
  };

  const pageProps = {
    onNavigate: handleNavigate,
    currentPage
  };

  switch (currentPage) {
    case 'scan':
      return <ScanPage {...pageProps} onAnalysisComplete={handleAnalysisComplete} />;
    case 'upload':
      return <UploadPage {...pageProps} onAnalysisComplete={handleAnalysisComplete} />;
    case 'results':
      return (
        <ResultsPage 
          {...pageProps} 
          analysisResult={analysisData.result}
          capturedImage={analysisData.image}
        />
      );
    case 'about':
      return <AboutPage {...pageProps} />;
    case 'profile':
      return <ProfilePage {...pageProps} />;
    case 'recycle':
      return <RecyclePage {...pageProps} />;
    case 'carbon':
      return <CarbonCalculator {...pageProps} />;
    case 'alternative':
      return <AlternativeFinder {...pageProps} />;
    default:
      return <HomePage {...pageProps} />;
  }
}

export default App;