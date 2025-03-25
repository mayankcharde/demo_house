import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState(null);

  const formFields = [
    { label: 'Full Name', type: 'text', key: 'name', icon: '👤' },
    { label: 'Email Address', type: 'email', key: 'email', icon: '📧' },
    { label: 'Message', type: 'textarea', key: 'message', icon: '✍️' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/submit_contact', formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('error');
    }
  };

  const developerInfo = {
    name: "Mayank Charde",
    email: "mayankcharde2@gmail.com",
    phone: "+91 9699561658",
    github: "https://github.com/mayankcharde"
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              Get in Touch
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              We'd love to hear from you
            </p>
          </div>
          <motion.div
            className="text-3xl sm:text-4xl"
            animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
          >
            👋
          </motion.div>
        </div>
        <div className="p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 lg:space-y-6">
              {formFields.map((field, index) => (
                <motion.div
                  key={field.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2 flex items-center space-x-1.5 sm:space-x-2">
                    <span className="opacity-70 group-hover:opacity-100 transition-opacity">{field.icon}</span>
                    <span>{field.label}</span>
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      required
                      rows={3}
                      className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm 
                               focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white 
                               text-xs sm:text-sm transition-all duration-200 resize-none
                               hover:border-primary-300 dark:hover:border-primary-500
                               py-1.5 sm:py-2 px-2.5 sm:px-3"
                      value={formData[field.key]}
                      onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                      placeholder={`Enter your ${field.label.toLowerCase()}`}
                    />
                  ) : (
                    <input
                      type={field.type}
                      required
                      className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm 
                               focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white 
                               text-xs sm:text-sm transition-all duration-200
                               hover:border-primary-300 dark:hover:border-primary-500
                               py-1.5 sm:py-2 px-2.5 sm:px-3"
                      value={formData[field.key]}
                      onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                      placeholder={`Enter your ${field.label.toLowerCase()}`}
                    />
                  )}
                </motion.div>
              ))}
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
                Send Message
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
                  <span className="text-lg sm:text-xl">{status === 'success' ? '✅' : '❌'}</span>
                  <span className="text-xs sm:text-sm">{status === 'success' ? 'Message sent successfully!' : 'Failed to send message. Please try again.'}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Developer Contact Information */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            Developer Contact
          </h2>
        </div>
        <div className="p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {Object.entries(developerInfo).map(([key, value]) => (
              <motion.div
                key={key}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: key === 'name' ? 0.3 : key === 'email' ? 0.4 : 0.5 }}
                className="flex items-center space-x-2 sm:space-x-3 group"
              >
                <span className="text-lg sm:text-xl opacity-70 group-hover:opacity-100 transition-opacity">
                  {key === 'name' ? '👨‍💻' : key === 'email' ? '📧' : key === 'phone' ? '📱' : '👨‍💻'}
                </span>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
                    {key}
                  </p>
                  {key === 'email' || key === 'github' ? (
                    <a
                      href={key === 'email' ? `mailto:${value}` : value}
                      className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 hover:underline"
                      target={key === 'github' ? "_blank" : undefined}
                      rel={key === 'github' ? "noopener noreferrer" : undefined}
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-xs sm:text-sm text-gray-900 dark:text-white">
                      {value}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
