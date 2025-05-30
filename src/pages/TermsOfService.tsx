import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const TermsOfService: React.FC = () => {
  const { t } = useTranslation();

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <Link 
            to="/" 
            className="inline-flex items-center text-mystical-600 dark:text-mystical-400 hover:text-mystical-700 dark:hover:text-mystical-300 mb-8"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t('navigation.backToHome')}
          </Link>
          
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('legal.termsOfServiceTitle')}
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                {t('legal.lastUpdated')}: January 1, 2025
              </p>
            </div>
            
            <div className="px-4 py-5 sm:p-6 prose dark:prose-invert max-w-none">
              <h2>{t('legal.termsIntroTitle')}</h2>
              <p>
                {t('legal.termsIntroText')}
              </p>
              
              <h2>{t('legal.useOfServiceTitle')}</h2>
              <p>
                {t('legal.useOfServiceText')}
              </p>
              <ul>
                <li>{t('legal.useOfServiceItem1')}</li>
                <li>{t('legal.useOfServiceItem2')}</li>
                <li>{t('legal.useOfServiceItem3')}</li>
                <li>{t('legal.useOfServiceItem4')}</li>
              </ul>
              
              <h2>{t('legal.accountsTitle')}</h2>
              <p>
                {t('legal.accountsText')}
              </p>
              
              <h2>{t('legal.intellectualPropertyTitle')}</h2>
              <p>
                {t('legal.intellectualPropertyText')}
              </p>
              
              <h2>{t('legal.userContentTitle')}</h2>
              <p>
                {t('legal.userContentText')}
              </p>
              
              <h2>{t('legal.prohibitedUsesTitle')}</h2>
              <p>
                {t('legal.prohibitedUsesText')}
              </p>
              <ul>
                <li>{t('legal.prohibitedUsesItem1')}</li>
                <li>{t('legal.prohibitedUsesItem2')}</li>
                <li>{t('legal.prohibitedUsesItem3')}</li>
                <li>{t('legal.prohibitedUsesItem4')}</li>
                <li>{t('legal.prohibitedUsesItem5')}</li>
              </ul>
              
              <h2>{t('legal.terminationTitle')}</h2>
              <p>
                {t('legal.terminationText')}
              </p>
              
              <h2>{t('legal.disclaimersTitle')}</h2>
              <p>
                {t('legal.disclaimersText')}
              </p>
              
              <h2>{t('legal.limitationOfLiabilityTitle')}</h2>
              <p>
                {t('legal.limitationOfLiabilityText')}
              </p>
              
              <h2>{t('legal.indemnificationTitle')}</h2>
              <p>
                {t('legal.indemnificationText')}
              </p>
              
              <h2>{t('legal.governingLawTitle')}</h2>
              <p>
                {t('legal.governingLawText')}
              </p>
              
              <h2>{t('legal.changesTitle')}</h2>
              <p>
                {t('legal.termsChangesText')}
              </p>
              
              <h2>{t('legal.contactTitle')}</h2>
              <p>
                {t('legal.contactText')}
              </p>
              <p>
                Email: <a href="mailto:legal@astroguidepro.com" className="text-mystical-600 dark:text-mystical-400">legal@astroguidepro.com</a>
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('legal.otherPolicies')}:{' '}
              <Link to="/privacy-policy" className="text-mystical-600 dark:text-mystical-400 hover:underline">
                {t('legal.privacyPolicy')}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
