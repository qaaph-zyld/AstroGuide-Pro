import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const PrivacyPolicy: React.FC = () => {
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
                {t('legal.privacyPolicyTitle')}
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                {t('legal.lastUpdated')}: January 1, 2025
              </p>
            </div>
            
            <div className="px-4 py-5 sm:p-6 prose dark:prose-invert max-w-none">
              <h2>{t('legal.privacyIntroTitle')}</h2>
              <p>
                {t('legal.privacyIntroText')}
              </p>
              
              <h2>{t('legal.informationCollectionTitle')}</h2>
              <p>
                {t('legal.informationCollectionText')}
              </p>
              <ul>
                <li>{t('legal.personalInfoItem1')}</li>
                <li>{t('legal.personalInfoItem2')}</li>
                <li>{t('legal.personalInfoItem3')}</li>
                <li>{t('legal.personalInfoItem4')}</li>
              </ul>
              
              <h2>{t('legal.informationUseTitle')}</h2>
              <p>
                {t('legal.informationUseText')}
              </p>
              <ul>
                <li>{t('legal.informationUseItem1')}</li>
                <li>{t('legal.informationUseItem2')}</li>
                <li>{t('legal.informationUseItem3')}</li>
                <li>{t('legal.informationUseItem4')}</li>
                <li>{t('legal.informationUseItem5')}</li>
              </ul>
              
              <h2>{t('legal.dataSharingTitle')}</h2>
              <p>
                {t('legal.dataSharingText')}
              </p>
              
              <h2>{t('legal.dataSecurityTitle')}</h2>
              <p>
                {t('legal.dataSecurityText')}
              </p>
              
              <h2>{t('legal.cookiesTitle')}</h2>
              <p>
                {t('legal.cookiesText')}
              </p>
              
              <h2>{t('legal.thirdPartyLinksTitle')}</h2>
              <p>
                {t('legal.thirdPartyLinksText')}
              </p>
              
              <h2>{t('legal.childrenPrivacyTitle')}</h2>
              <p>
                {t('legal.childrenPrivacyText')}
              </p>
              
              <h2>{t('legal.changesTitle')}</h2>
              <p>
                {t('legal.changesText')}
              </p>
              
              <h2>{t('legal.contactTitle')}</h2>
              <p>
                {t('legal.contactText')}
              </p>
              <p>
                Email: <a href="mailto:privacy@astroguidepro.com" className="text-mystical-600 dark:text-mystical-400">privacy@astroguidepro.com</a>
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('legal.otherPolicies')}:{' '}
              <Link to="/terms-of-service" className="text-mystical-600 dark:text-mystical-400 hover:underline">
                {t('legal.termsOfService')}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
