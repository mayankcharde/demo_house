import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function PredictionAnalytics({ shouldRefresh }) {
  const [analytics, setAnalytics] = useState({
    history: [],
    averagePrice: 0,
    totalPredictions: 0,
    priceRanges: []
  });

  const [deletingId, setDeletingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('https://demo-house.onrender.com/get_analytics');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics, shouldRefresh]); // Refetch when shouldRefresh changes

  const handleDelete = async (id) => {
    if (!id) {
      console.error('No id provided for deletion');
      return;
    }
    
    try {
      setDeletingId(id);
      const response = await axios.delete(`http://localhost:5000/delete_prediction/${id}`);
      if (response.status === 200) {
        await fetchAnalytics();
      }
    } catch (error) {
      console.error('Error deleting prediction:', error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 sm:p-4 animate-pulse"
                >
                  <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-600 rounded w-16 sm:w-20 mb-2"></div>
                  <div className="h-5 sm:h-6 bg-gray-200 dark:bg-gray-600 rounded w-24 sm:w-32"></div>
                </motion.div>
              ))}
            </>
          ) : (
            <>
              <StatsCard
                title="Total Predictions"
                value={analytics.totalPredictions}
                icon="🎯"
              />
              <StatsCard
                title="Average Price"
                value={`₹${Math.round(analytics.averagePrice).toLocaleString()}`}
                icon="💰"
              />
              <StatsCard
                title="Last 24 Hours"
                value={analytics.history.filter(h => 
                  new Date(h.timestamp) > new Date(Date.now() - 86400000)
                ).length}
                icon="⏰"
              />
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        {/* Price Trend Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 dark:text-white mb-3 sm:mb-4">
            Price Trends
          </h3>
          <div className="h-[180px] xs:h-[220px] sm:h-[280px] lg:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.history.slice().reverse()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="timestamp" 
                  tick={{ fill: 'currentColor', fontSize: 12 }}
                  tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
                  stroke="#374151"
                />
                <YAxis 
                  tick={{ fill: 'currentColor', fontSize: 12 }}
                  tickFormatter={(value) => `₹${(value/100000).toFixed(1)}L`}
                  stroke="#374151"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    fontSize: '12px'
                  }}
                  labelFormatter={(label) => new Date(label).toLocaleString()}
                  formatter={(value) => [`₹${value.toLocaleString()}`, "Price"]}
                />
                <Line 
                  type="monotone" 
                  dataKey="price_inr" 
                  stroke="#0ea5e9" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Price Distribution Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 dark:text-white mb-3 sm:mb-4">
            Price Distribution
          </h3>
          <div className="h-[180px] xs:h-[220px] sm:h-[280px] lg:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.priceRanges}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="range" 
                  tick={{ fill: 'currentColor', fontSize: 12 }}
                  stroke="#374151"
                />
                <YAxis 
                  tick={{ fill: 'currentColor', fontSize: 12 }}
                  stroke="#374151"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    fontSize: '12px'
                  }}
                  labelFormatter={(label) => new Date(label).toLocaleString()}
                  formatter={(value) => [`₹${value.toLocaleString()}`, "Price"]}
                />
                <Bar 
                  dataKey="count" 
                  fill="#0ea5e9"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Predictions Table */}
      <div className="overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="max-h-[300px] xs:max-h-[350px] sm:max-h-[400px] lg:max-h-[500px] overflow-y-auto">
          <div className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <table className="min-w-full table-fixed">
              <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                <tr>
                  <th className="w-1/4 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-left text-[10px] xs:text-xs sm:text-sm font-medium text-gray-500">Time</th>
                  <th className="w-1/4 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-left text-[10px] xs:text-xs sm:text-sm font-medium text-gray-500">Area</th>
                  <th className="w-1/4 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-left text-[10px] xs:text-xs sm:text-sm font-medium text-gray-500">Price</th>
                  <th className="w-1/4 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-right text-[10px] xs:text-xs sm:text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {analytics.history.map((prediction) => (
                  <tr key={prediction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 whitespace-nowrap text-[10px] xs:text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {new Date(prediction.timestamp).toLocaleString()}
                    </td>
                    <td className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 whitespace-nowrap text-[10px] xs:text-xs sm:text-sm text-gray-900 dark:text-white">
                      {prediction.area} sq ft
                    </td>
                    <td className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 whitespace-nowrap text-[10px] xs:text-xs sm:text-sm text-gray-900 dark:text-white">
                      ₹{prediction.price_inr.toLocaleString()}
                    </td>
                    <td className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 whitespace-nowrap text-right text-[10px] xs:text-xs sm:text-sm">
                      <button
                        onClick={() => handleDelete(prediction.id)}
                        disabled={deletingId === prediction.id}
                        className={`text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors ${
                          deletingId === prediction.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {deletingId === prediction.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center space-x-2 sm:space-x-3">
        <span className="text-xl sm:text-2xl">{icon}</span>
        <div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-0.5 sm:mt-1 text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}
