import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/get_houses");
        setHouses(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching houses:", error);
      }
    };
    fetchHouses();
  }, []);

  const formatPrice = (price, area) => {
    const inrPrice = price * 83;
    const formattedTotal = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(inrPrice);

    const pricePerSqFt = Math.round(inrPrice / area);
    const formattedPerSqFt = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(pricePerSqFt);

    return (
      <div>
        <div>{formattedTotal}</div>
        <div className="text-sm text-gray-500">
          {formattedPerSqFt}/sq ft
        </div>
      </div>
    );
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <motion.h2 
          className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent"
          whileHover={{ scale: 1.02 }}
        >
          Available Houses
        </motion.h2>
      </div>
      <div className="p-6">
        <AnimatePresence>
          <motion.div 
            className="space-y-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {loading ? (
              // Loading skeletons
              [...Array(3)].map((_, index) => (
                <motion.div
                  key={`skeleton-${index}`}
                  className="animate-pulse bg-gray-100 dark:bg-gray-700 rounded-xl p-6"
                  variants={item}
                >
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                  </div>
                </motion.div>
              ))
            ) : (
              houses.map((house, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  whileHover={{ scale: 1.01 }}
                  className="group relative bg-gray-50 dark:bg-gray-700 rounded-xl p-4 sm:p-6 hover:bg-primary-50 dark:hover:bg-gray-600 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-400/0 to-primary-400/0 group-hover:from-primary-400/5 group-hover:to-primary-400/10 rounded-xl transition-all duration-300"></div>
                  <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Area</p>
                        <p className="mt-0.5 sm:mt-1 text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{house.area} sq ft</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Bedrooms</p>
                        <p className="mt-0.5 sm:mt-1 text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{house.bedrooms}</p>
                      </div>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Bathrooms</p>
                        <p className="mt-0.5 sm:mt-1 text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{house.bathrooms}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</p>
                        <div className="mt-1 font-semibold text-primary-600 dark:text-primary-400">
                          {formatPrice(house.price, house.area)}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}