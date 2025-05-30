import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound: React.FC = () => {
  const { t } = useTranslation();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div
        className="text-center max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          variants={itemVariants}
          className="h-24 w-24 mx-auto text-mystical-600 dark:text-mystical-400"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </motion.div>
        
        <motion.h1 
          variants={itemVariants}
          className="mt-6 text-4xl font-extrabold text-gray-900 dark:text-white"
        >
          404
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="mt-2 text-2xl font-semibold text-gray-700 dark:text-gray-300"
        >
          {t('errors.pageNotFound')}
        </motion.p>
        
        <motion.p 
          variants={itemVariants}
          className="mt-4 text-base text-gray-600 dark:text-gray-400"
        >
          {t('errors.pageNotFoundMessage')}
        </motion.p>
        
        <motion.div 
          variants={itemVariants}
          className="mt-10 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <Link
            to="/"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-mystical-600 to-cosmic-600 hover:from-mystical-700 hover:to-cosmic-700"
          >
            <Home className="h-5 w-5 mr-2" />
            {t('navigation.backToHome')}
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t('navigation.goBack')}
          </button>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="mt-12"
        >
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-gray-50 dark:bg-gray-900 text-sm text-gray-500 dark:text-gray-400">
                {t('errors.needHelp')}
              </span>
            </div>
          </div>
          
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {t('errors.contactSupport')}{' '}
            <a 
              href="mailto:support@astroguidepro.com" 
              className="text-mystical-600 dark:text-mystical-400 hover:text-mystical-500 dark:hover:text-mystical-300"
            >
              support@astroguidepro.com
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
