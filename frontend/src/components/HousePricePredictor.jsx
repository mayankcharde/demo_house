import { useState } from "react";
import axios from "axios";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HousePricePredictor({ onPredictionComplete }) {
  const [features, setFeatures] = useState(["", "", ""]);
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [predictedPriceINR, setPredictedPriceINR] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const labels = ["Area (sq ft)", "Bedrooms", "Bathrooms"];

  const handleChange = (index, value) => {
    setError(null);
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const predictPrice = async () => {
    if (features.some(f => f === "")) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post("http://localhost:5000/predict", {
        features: features.map(Number),
      });
      setPredictedPriceINR(response.data.price_inr);
      
      // Call the callback to refresh analytics
      if (onPredictionComplete) {
        onPredictionComplete();
      }

      // Clear input fields after successful prediction
      setFeatures(["", "", ""]);
    } catch (error) {
      setError(error.response?.data?.error || "Error predicting price");
      setPredictedPriceINR(null);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (priceInr, area = null) => {
    const formattedTotal = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(priceInr);

    if (area) {
      const pricePerSqFt = Math.round(priceInr / area);
      const formattedPerSqFt = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(pricePerSqFt);
      return (
        <div>
          <div>{formattedTotal}</div>
          <div className="text-sm text-gray-600">
            {formattedPerSqFt}/sq ft
          </div>
        </div>
      );
    }
    return formattedTotal;
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
        <motion.h2 
          className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent"
          whileHover={{ scale: 1.02 }}
        >
          Get Price Prediction
        </motion.h2>
      </div>
      <div className="p-3 sm:p-4 lg:p-6">
        <motion.div 
          className="space-y-2.5 sm:space-y-3 lg:space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {features.map((value, index) => (
            <motion.div 
              key={index}
              className="space-y-1"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                {labels[index]}
              </label>
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <input
                  type="number"
                  value={value}
                  onChange={(e) => handleChange(index, e.target.value)}
                  placeholder={`Enter ${labels[index].toLowerCase()}`}
                  className="block w-full rounded-lg border-gray-300 dark:border-gray-600 
                           py-1.5 sm:py-2 px-2.5 sm:px-3 lg:px-4
                           text-sm sm:text-base
                           bg-white dark:bg-gray-700 
                           text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                           shadow-sm"
                />
              </motion.div>
            </motion.div>
          ))}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg text-white text-sm sm:text-base font-medium transition-all duration-200 ${
              loading
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600'
            }`}
            onClick={predictPrice}
            disabled={loading}
          >
            {loading ? (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block w-4 h-4 sm:w-5 sm:h-5 border-2 border-white rounded-full border-t-transparent"
              />
            ) : (
              'Predict Price'
            )}
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 rounded-lg"
            >
              <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">{error}</p>
            </motion.div>
          )}

          {predictedPriceINR && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mt-4 sm:mt-6 p-4 sm:p-6 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 border border-primary-200 dark:border-primary-700 rounded-lg"
            >
              <p className="text-xs sm:text-sm font-medium text-primary-600 dark:text-primary-400">Estimated Price</p>
              <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-primary-700 dark:text-primary-300">
                {formatPrice(predictedPriceINR, features[0])}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
