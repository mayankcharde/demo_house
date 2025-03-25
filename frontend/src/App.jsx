import React, { useState } from 'react'
import { motion } from 'framer-motion'
import './App.css'
import HousePricePredictor from './components/HousePricePredictor'
import Home from './pages/Home'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import Feedback from './components/Feedback'
import Contact from './components/Contact'
import PredictionAnalytics from './components/PredictionAnalytics';

function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleDarkMode}
      className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-lg hover:shadow-xl transition-shadow"
    >
      <motion.span
        initial={{ rotate: 0 }}
        animate={{ rotate: darkMode ? 180 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {darkMode ? '🌞' : '🌙'}
      </motion.span>
    </motion.button>
  );
}

function NavigationLink({ isActive, onClick, children }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive 
          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 shadow-sm' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/20'
      }`}
    >
      {children}
    </motion.button>
  );
}

function AppContent() {
  const { darkMode } = useTheme();
  const [activePage, setActivePage] = useState('home');
  const [analyticsRefreshCounter, setAnalyticsRefreshCounter] = useState(0);

  const handlePredictionComplete = () => {
    setAnalyticsRefreshCounter(prev => prev + 1);
  };

  const renderContent = () => {
    switch(activePage) {
      case 'feedback':
        return <Feedback />;
      case 'contact':
        return <Contact />;
      default:
        return (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <HousePricePredictor onPredictionComplete={handlePredictionComplete} />
              <Home />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <PredictionAnalytics shouldRefresh={analyticsRefreshCounter} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/80 dark:bg-gray-800/80 shadow-lg backdrop-blur-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <motion.button
                onClick={() => setActivePage('home')}
                className="flex-shrink-0 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent group-hover:to-primary-500">
                  House Price Predictor
                </h1>
              </motion.button>
              <div className="hidden md:flex items-center space-x-1">
                <NavigationLink isActive={activePage === 'home'} onClick={() => setActivePage('home')}>
                  Home
                </NavigationLink>
                <NavigationLink isActive={activePage === 'feedback'} onClick={() => setActivePage('feedback')}>
                  Feedback
                </NavigationLink>
                <NavigationLink isActive={activePage === 'contact'} onClick={() => setActivePage('contact')}>
                  Contact Us
                </NavigationLink>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="md:hidden">
                <motion.select
                  value={activePage}
                  onChange={(e) => setActivePage(e.target.value)}
                  className="block w-28 sm:w-32 py-1.5 sm:py-2 px-2 sm:px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg shadow-sm text-xs sm:text-sm focus:ring-primary-500 focus:border-primary-500 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <option value="home">Home</option>
                  <option value="feedback">Feedback</option>
                  <option value="contact">Contact Us</option>
                </motion.select>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </motion.nav>

      {activePage === 'home' && (
        <motion.div 
          className="bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-8 sm:py-12 lg:py-16">
            <div className="text-center">
              <motion.h1 
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Predict House Prices
                <span className="block text-primary-600 dark:text-primary-400">
                  with Precision
                </span>
              </motion.h1>
              <motion.p 
                className="mt-3 sm:mt-4 text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2 sm:px-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Get accurate house price predictions using our advanced machine learning model.
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}

      <main className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-2 sm:px-4 lg:px-8">
        <motion.div 
          key={activePage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`${
            activePage === 'home' 
              ? 'grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-2' 
              : 'max-w-2xl mx-auto w-full px-2 sm:px-4'
          }`}
        >
          {renderContent()}
        </motion.div>
      </main>

      <footer className="mt-auto py-4 sm:py-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} House Price Predictor. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
