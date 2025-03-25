import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState(null);

  const emojis = ['😞', '😕', '😊', '😃', '🤩'];
  const ratingTexts = ['Poor', 'Fair', 'Good', 'Great', 'Excellent'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://demo-house.onrender.com/submit_feedback', { rating, comment });
      setStatus('success');
      setRating(0);
      setComment('');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
          Share Your Experience
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Your feedback helps us improve
        </p>
      </div>
      <div className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
              How would you rate your experience?
            </label>
            <div className="flex justify-between items-center max-w-md mx-auto px-2 sm:px-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setRating(star)}
                  className="flex flex-col items-center space-y-1 sm:space-y-2 group"
                >
                  <span className="text-2xl sm:text-3xl transition-transform duration-200 group-hover:scale-110">
                    {emojis[star - 1]}
                  </span>
                  <span className={`text-[10px] sm:text-xs font-medium transition-colors duration-200 ${
                    star <= rating 
                      ? 'text-primary-600 dark:text-primary-400' 
                      : 'text-gray-400 dark:text-gray-600'
                  }`}>
                    {ratingTexts[star - 1]}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2 flex items-center space-x-1.5 sm:space-x-2">
              <span>✍️</span>
              <span>Share your thoughts</span>
            </label>
            <textarea
              required
              rows={3}
              className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm 
                       focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white 
                       text-xs sm:text-sm transition-all duration-200 resize-none
                       hover:border-primary-300 dark:hover:border-primary-500
                       py-1.5 sm:py-2 px-2.5 sm:px-3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you think..."
            />
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg text-white text-xs sm:text-sm font-medium 
                     bg-gradient-to-r from-primary-600 to-primary-500 
                     hover:from-primary-700 hover:to-primary-600
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                     dark:focus:ring-offset-gray-800 transform transition-all duration-200"
          >
            Submit Feedback
          </motion.button>
        </form>

        <AnimatePresence>
          {status && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-3 sm:mt-4 p-3 sm:p-4 rounded-lg flex items-center space-x-2 ${
                status === 'success'
                  ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
              }`}
            >
              <span className="text-lg sm:text-xl">{status === 'success' ? '🎉' : '❌'}</span>
              <span className="text-xs sm:text-sm">{status === 'success' ? 'Thank you for your feedback!' : 'Failed to submit feedback. Please try again.'}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
