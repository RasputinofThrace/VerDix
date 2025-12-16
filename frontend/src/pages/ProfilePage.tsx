import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings, 
  History,
  Share2, 
  Download,
  Trash2,
  Edit,
  Camera,
  Leaf,
  Zap,
  Droplet,
  Recycle,
  BarChart3,
  Target,
  Calendar,
  ShoppingBag,
  Trophy,
  Star,
  ChevronRight,
  X
} from 'lucide-react';
import StarsBackground from '../components/StarsBackground';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

interface ScanHistory {
  id: string;
  productName: string;
  brand: string;
  score: number;
  date: string;
  category: string;
  image?: string;
}

interface UserStats {
  totalScans: number;
  carbonSaved: number;
  plasticAvoided: number;
  waterSaved: number;
  streak: number;
  bestScore: number;
  worstScore: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  total?: number;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate, currentPage }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'achievements' | 'settings'>('overview');
  const [userName, setUserName] = useState('Eco Warrior');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<'clear' | 'export' | 'share' | null>(null);

  // Load user data from localStorage
  const [scanHistory, setScanHistory] = useState<ScanHistory[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalScans: 0,
    carbonSaved: 0,
    plasticAvoided: 0,
    waterSaved: 0,
    streak: 0,
    bestScore: 0,
    worstScore: 0
  });
  const [profileImage, setProfileImage] = useState<string>('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Calculate stats function - defined before useEffect
  const calculateStats = React.useCallback((history: ScanHistory[]) => {
    if (history.length === 0) return;

    const total = history.length;
    const scores = history.map(h => h.score);
    const best = Math.max(...scores);
    const worst = Math.min(...scores);
    
    // Calculate environmental savings (mock calculations)
    const carbonSaved = total * 2.5; // ~2.5kg per good choice
    const plasticAvoided = total * 0.5; // ~500g per product
    const waterSaved = total * 50; // ~50L per product

    // Calculate streak (consecutive days)
    // eslint-disable-next-line react-hooks/immutability
    const streak = calculateStreak(history);

    setUserStats({
      totalScans: total,
      carbonSaved,
      plasticAvoided,
      waterSaved,
      streak,
      bestScore: best,
      worstScore: worst
    });
  }, []);

  const calculateStreak = (history: ScanHistory[]): number => {
    if (history.length === 0) return 0;
    
    const sortedDates = history
      .map(h => new Date(h.date).toDateString())
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 1;
    const today = new Date().toDateString();
    
    if (sortedDates[0] !== today && sortedDates[0] !== new Date(Date.now() - 86400000).toDateString()) {
      return 0;
    }

    for (let i = 1; i < sortedDates.length; i++) {
      const diff = (new Date(sortedDates[i - 1]).getTime() - new Date(sortedDates[i]).getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  useEffect(() => {
    // Function to load data
    const loadData = () => {
      const savedName = localStorage.getItem('verdix-userName');
      if (savedName) setUserName(savedName);

      const savedImage = localStorage.getItem('verdix-profileImage');
      if (savedImage) setProfileImage(savedImage);

      const savedHistory = localStorage.getItem('verdix-scanHistory');
      if (savedHistory) {
        const history = JSON.parse(savedHistory);
        setScanHistory(history);
        calculateStats(history);
      }
    };

    // Load data initially
    loadData();

    // Reload data when page becomes visible (user navigates back)
    const handleVisibilityChange = () => {
      if (!document.hidden && currentPage === 'profile') {
        loadData();
      }
    };

    // Listen for storage changes (in case data changes in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'verdix-scanHistory') {
        loadData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [calculateStats, currentPage]);

  const achievements: Achievement[] = [
    {
      id: 'first-scan',
      title: 'First Step',
      description: 'Complete your first scan',
      icon: '🌱',
      unlocked: userStats.totalScans >= 1
    },
    {
      id: 'scan-10',
      title: 'Getting Started',
      description: 'Scan 10 products',
      icon: '🌿',
      unlocked: userStats.totalScans >= 10,
      progress: userStats.totalScans,
      total: 10
    },
    {
      id: 'scan-50',
      title: 'Eco Warrior',
      description: 'Scan 50 products',
      icon: '🌳',
      unlocked: userStats.totalScans >= 50,
      progress: userStats.totalScans,
      total: 50
    },
    {
      id: 'streak-7',
      title: 'Week Streak',
      description: 'Scan for 7 days in a row',
      icon: '🔥',
      unlocked: userStats.streak >= 7,
      progress: userStats.streak,
      total: 7
    },
    {
      id: 'carbon-saver',
      title: 'Carbon Saver',
      description: 'Save 50kg of CO2',
      icon: '💨',
      unlocked: userStats.carbonSaved >= 50,
      progress: Math.round(userStats.carbonSaved),
      total: 50
    },
    {
      id: 'plastic-fighter',
      title: 'Plastic Fighter',
      description: 'Avoid 10kg of plastic',
      icon: '♻️',
      unlocked: userStats.plasticAvoided >= 10,
      progress: Math.round(userStats.plasticAvoided),
      total: 10
    }
  ];

  const handleEditName = () => {
    setTempName(userName);
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      localStorage.setItem('verdix-userName', tempName.trim());
    }
    setIsEditingName(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setProfileImage(result);
        localStorage.setItem('verdix-profileImage', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage('');
    localStorage.removeItem('verdix-profileImage');
  };

  const handleClearHistory = () => {
    localStorage.removeItem('verdix-scanHistory');
    setScanHistory([]);
    setUserStats({
      totalScans: 0,
      carbonSaved: 0,
      plasticAvoided: 0,
      waterSaved: 0,
      streak: 0,
      bestScore: 0,
      worstScore: 0
    });
    setShowModal(false);
  };

  const handleExportData = () => {
    const data = {
      userName,
      stats: userStats,
      history: scanHistory
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `verdix-data-${Date.now()}.json`;
    a.click();
    setShowModal(false);
  };

  const handleShare = () => {
    const text = `I've scanned ${userStats.totalScans} products with Verdix and saved ${userStats.carbonSaved.toFixed(1)}kg of CO2! 🌱 Join me in making sustainable choices!`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Stats copied to clipboard!');
    }
    setShowModal(false);
  };

  const openModal = (type: 'clear' | 'export' | 'share') => {
    setModalContent(type);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen relative text-white overflow-hidden bg-black">
      <StarsBackground />
      
      <div className="relative z-10 pb-24">
        <Header />
        
        <div className="max-w-md mx-auto px-6 py-8">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/60 backdrop-blur-lg rounded-3xl border border-gray-800 p-6 md:p-8 shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                {/* Profile Image and Info */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 flex-1">
                  {/* Profile Picture */}
                  <div className="relative group">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-gray-800 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                      {profileImage ? (
                        <img 
                          src={profileImage} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 sm:w-14 sm:h-14 text-gray-400" />
                      )}
                    </div>
                    
                    {/* Edit overlay */}
                    <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-white"
                      >
                        <Camera className="w-6 h-6" />
                      </button>
                    </div>
                    
                    {profileImage && (
                      <button
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Name and Member Info */}
                  <div className="flex-1 text-center sm:text-left">
                    {isEditingName ? (
                      <div className="flex flex-col sm:flex-row items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
                          className="w-full sm:w-auto bg-gray-800 text-white px-4 py-2 rounded-xl border border-gray-700 focus:outline-none focus:border-white text-center sm:text-left"
                          autoFocus
                          maxLength={30}
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleSaveName}
                            className="p-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
                          >
                            <span className="text-lg">✓</span>
                          </button>
                          <button
                            onClick={() => setIsEditingName(false)}
                            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 mb-2">
                        <h2 className="text-2xl md:text-3xl font-bold text-white">{userName}</h2>
                        <button
                          onClick={handleEditName}
                          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4 text-gray-400 hover:text-white" />
                        </button>
                      </div>
                    )}
                    <p className="text-gray-400 text-sm mb-4">
                      Member since {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                    
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      {userStats.streak >= 7 && (
                        <span className="px-3 py-1 bg-orange-900/30 border border-orange-600/50 text-orange-400 rounded-full text-xs font-semibold">
                          🔥 {userStats.streak} Day Streak
                        </span>
                      )}
                      {userStats.totalScans >= 50 && (
                        <span className="px-3 py-1 bg-green-900/30 border border-green-600/50 text-green-400 rounded-full text-xs font-semibold">
                          🌳 Eco Warrior
                        </span>
                      )}
                      {achievements.filter(a => a.unlocked).length === achievements.length && (
                        <span className="px-3 py-1 bg-yellow-900/30 border border-yellow-600/50 text-yellow-400 rounded-full text-xs font-semibold">
                          ⭐ All Achievements
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Share Button */}
                <button
                  onClick={() => openModal('share')}
                  className="p-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors self-center md:self-start"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-8">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-gray-800/80 to-gray-800/40 rounded-xl p-4 text-center border border-gray-700/50"
                >
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{userStats.totalScans}</div>
                  <div className="text-xs text-gray-400">Total Scans</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-orange-900/20 to-gray-800/40 rounded-xl p-4 text-center border border-orange-900/30"
                >
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{userStats.streak}</div>
                  <div className="text-xs text-gray-400">Day Streak 🔥</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-green-900/20 to-gray-800/40 rounded-xl p-4 text-center border border-green-900/30"
                >
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{userStats.carbonSaved.toFixed(1)}</div>
                  <div className="text-xs text-gray-400">kg CO₂ Saved</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-yellow-900/20 to-gray-800/40 rounded-xl p-4 text-center border border-yellow-900/30"
                >
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{achievements.filter(a => a.unlocked).length}</div>
                  <div className="text-xs text-gray-400">Achievements</div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'history', label: 'History', icon: History },
              { id: 'achievements', label: 'Achievements', icon: Trophy },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center space-x-2 px-4 md:px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-black shadow-lg'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm md:text-base">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Environmental Impact */}
                <div className="bg-gray-900/60 backdrop-blur-lg rounded-2xl border border-gray-800 p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Leaf className="w-5 h-5 text-green-400" />
                    <h3 className="text-xl font-bold text-white">Environmental Impact</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-400">Carbon Saved</span>
                        </div>
                        <span className="text-white font-semibold">{userStats.carbonSaved.toFixed(1)} kg CO₂</span>
                      </div>
                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-600 to-green-400"
                          style={{ width: `${Math.min((userStats.carbonSaved / 100) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Equivalent to {Math.floor(userStats.carbonSaved / 20)} trees planted</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Recycle className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-400">Plastic Avoided</span>
                        </div>
                        <span className="text-white font-semibold">{userStats.plasticAvoided.toFixed(1)} kg</span>
                      </div>
                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                          style={{ width: `${Math.min((userStats.plasticAvoided / 20) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{Math.floor(userStats.plasticAvoided * 2)} plastic bottles avoided</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Droplet className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-400">Water Conserved</span>
                        </div>
                        <span className="text-white font-semibold">{userStats.waterSaved} L</span>
                      </div>
                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400"
                          style={{ width: `${Math.min((userStats.waterSaved / 1000) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Enough for {Math.floor(userStats.waterSaved / 2)} showers</p>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-900/60 backdrop-blur-lg rounded-2xl border border-gray-800 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('history')}
                      className="text-sm text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
                    >
                      <span>View All</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {scanHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">No scans yet</p>
                      <button
                        onClick={() => onNavigate('scan')}
                        className="px-6 py-2 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                      >
                        Start Scanning
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {scanHistory.slice(0, 5).map((scan, index) => (
                        <div
                          key={scan.id || index}
                          className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              scan.score >= 7 ? 'bg-green-500/20' :
                              scan.score >= 4 ? 'bg-yellow-500/20' :
                              'bg-red-500/20'
                            }`}>
                              <span className="text-2xl font-bold">
                                {scan.score >= 7 ? '🌟' : scan.score >= 4 ? '⚖️' : '⚠️'}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-white font-semibold">{scan.productName}</h4>
                              <p className="text-sm text-gray-400">{scan.brand} • Score: {scan.score}/10</p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(scan.date).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gray-900/60 backdrop-blur-lg rounded-2xl border border-gray-800 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Scan History</h3>
                  {scanHistory.length > 0 && (
                    <button
                      onClick={() => openModal('clear')}
                      className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center space-x-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Clear All</span>
                    </button>
                  )}
                </div>

                {scanHistory.length === 0 ? (
                  <div className="text-center py-16">
                    <History className="w-20 h-20 text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg mb-2">No scan history</p>
                    <p className="text-gray-500 text-sm mb-6">Start scanning products to build your history</p>
                    <button
                      onClick={() => onNavigate('scan')}
                      className="px-8 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Scan Your First Product
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {scanHistory.map((scan, index) => (
                      <div
                        key={scan.id || index}
                        className="p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              scan.score >= 7 ? 'bg-green-500/20' :
                              scan.score >= 4 ? 'bg-yellow-500/20' :
                              'bg-red-500/20'
                            }`}>
                              <span className="text-3xl">
                                {scan.score >= 7 ? '🌟' : scan.score >= 4 ? '⚖️' : '⚠️'}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-semibold text-lg mb-1">{scan.productName}</h4>
                              <p className="text-gray-400 text-sm mb-2">{scan.brand}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span className="flex items-center space-x-1">
                                  <Target className="w-3 h-3" />
                                  <span>Score: {scan.score}/10</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <ShoppingBag className="w-3 h-3" />
                                  <span>{scan.category}</span>
                                </span>
                                <span>{new Date(scan.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <motion.div
                key="achievements"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="bg-gray-900/60 backdrop-blur-lg rounded-2xl border border-gray-800 p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-xl font-bold text-white">Achievements</h3>
                    <span className="text-sm text-gray-400">
                      ({achievements.filter(a => a.unlocked).length}/{achievements.length})
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          achievement.unlocked
                            ? 'bg-gradient-to-br from-yellow-900/30 to-gray-900/30 border-yellow-600/50'
                            : 'bg-gray-800/30 border-gray-800'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`text-4xl ${achievement.unlocked ? '' : 'grayscale opacity-40'}`}>
                              {achievement.icon}
                            </div>
                            <div>
                              <h4 className={`font-bold ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`}>
                                {achievement.title}
                              </h4>
                              <p className="text-xs text-gray-400 mt-1">{achievement.description}</p>
                            </div>
                          </div>
                          {achievement.unlocked && (
                            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                          )}
                        </div>

                        {!achievement.unlocked && achievement.progress !== undefined && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-gray-500">Progress</span>
                              <span className="text-xs text-gray-400">
                                {achievement.progress}/{achievement.total}
                              </span>
                            </div>
                            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all"
                                style={{
                                  width: `${Math.min(((achievement.progress || 0) / (achievement.total || 1)) * 100, 100)}%`
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="bg-gray-900/60 backdrop-blur-lg rounded-2xl border border-gray-800 p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Settings</h3>

                  <div className="space-y-4">
                    <button
                      onClick={() => openModal('export')}
                      className="w-full flex items-center justify-between p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <Download className="w-5 h-5 text-gray-400 group-hover:text-white" />
                        <div className="text-left">
                          <h4 className="text-white font-semibold">Export Data</h4>
                          <p className="text-sm text-gray-400">Download your scan history</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>

                    <button
                      onClick={() => openModal('share')}
                      className="w-full flex items-center justify-between p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <Share2 className="w-5 h-5 text-gray-400 group-hover:text-white" />
                        <div className="text-left">
                          <h4 className="text-white font-semibold">Share Progress</h4>
                          <p className="text-sm text-gray-400">Share your impact with others</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>

                    <button
                      onClick={() => openModal('clear')}
                      className="w-full flex items-center justify-between p-4 bg-red-900/20 border border-red-900/30 rounded-xl hover:bg-red-900/30 transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <Trash2 className="w-5 h-5 text-red-400 group-hover:text-red-300" />
                        <div className="text-left">
                          <h4 className="text-red-400 font-semibold">Clear All Data</h4>
                          <p className="text-sm text-gray-400">Delete all scan history</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* About Section */}
                <div className="bg-gray-900/60 backdrop-blur-lg rounded-2xl border border-gray-800 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">About Verdix</h3>
                  <div className="space-y-3 text-sm text-gray-400 capitalize">
                    <p>Version 1.0.0</p>
                    <p>Making sustainable choices easier.</p>
                    <div className="pt-4 border-t border-gray-800">
                      <button
                        onClick={() => onNavigate('about')}
                        className="text-white hover:text-gray-300 transition-colors flex items-center space-x-1"
                      >
                        <span>Learn More</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <BottomNav currentPage={currentPage} onNavigate={onNavigate} />

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-gray-800 rounded-3xl p-8 max-w-md w-full relative"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              {modalContent === 'clear' && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Clear All Data?</h3>
                  <p className="text-gray-400 mb-6">
                    This will permanently delete all your scan history and statistics. This action cannot be undone.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleClearHistory}
                      className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              )}

              {modalContent === 'export' && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Export Your Data</h3>
                  <p className="text-gray-400 mb-6">
                    Download all your scan history and statistics as a JSON file. You can use this to backup your data or import it later.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleExportData}
                      className="flex-1 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Download
                    </button>
                  </div>
                </div>
              )}

              {modalContent === 'share' && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Share2 className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Share Your Impact</h3>
                  <div className="bg-gray-800/50 rounded-xl p-6 mb-6 text-left">
                    <p className="text-white text-sm leading-relaxed">
                      I've scanned <strong>{userStats.totalScans} products</strong> with Verdix and saved <strong>{userStats.carbonSaved.toFixed(1)}kg of CO₂</strong>! 🌱 Join me in making sustainable choices!
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex-1 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Share
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;