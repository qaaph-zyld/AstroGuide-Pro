import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar, BarChart2, Users, Check, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
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

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-mystical-600/20 to-cosmic-600/20 dark:from-mystical-900/30 dark:to-cosmic-900/30"></div>
        
        {/* Navigation */}
        <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-mystical-600 to-cosmic-600 flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
                AstroGuide Pro
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-base font-medium text-gray-700 dark:text-gray-300 hover:text-mystical-600 dark:hover:text-mystical-400"
              >
                {t('navigation.login')}
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-mystical-600 to-cosmic-600 hover:from-mystical-700 hover:to-cosmic-700"
              >
                {t('navigation.register')}
              </Link>
            </div>
          </div>
        </nav>
        
        {/* Hero Content */}
        <div className="relative pt-10 pb-20 sm:pt-16 sm:pb-24 lg:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="lg:grid lg:grid-cols-12 lg:gap-8"
            >
              <motion.div 
                variants={fadeIn}
                className="lg:col-span-6 text-center lg:text-left"
              >
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                  <span className="block">{t('landing.heroTitle1')}</span>
                  <span className="block text-mystical-600 dark:text-mystical-400">
                    {t('landing.heroTitle2')}
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-600 dark:text-gray-300 sm:mt-5 sm:text-xl">
                  {t('landing.heroSubtitle')}
                </p>
                <div className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-mystical-600 to-cosmic-600 hover:from-mystical-700 hover:to-cosmic-700 md:py-4 md:text-lg md:px-10"
                    >
                      {t('landing.getStarted')}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-mystical-700 dark:text-mystical-300 bg-mystical-100 dark:bg-mystical-900 hover:bg-mystical-200 dark:hover:bg-mystical-800 md:py-4 md:text-lg md:px-10"
                    >
                      {t('landing.learnMore')}
                    </Link>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                variants={fadeIn}
                className="mt-12 lg:mt-0 lg:col-span-6"
              >
                <div className="relative mx-auto w-full rounded-lg shadow-lg overflow-hidden">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src="https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
                      alt="Vedic astrology chart"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.h2 
              variants={fadeIn}
              className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl"
            >
              {t('landing.featuresTitle')}
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300 mx-auto"
            >
              {t('landing.featuresSubtitle')}
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mt-12"
          >
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: <Calendar className="h-8 w-8 text-mystical-600 dark:text-mystical-400" />,
                  title: t('landing.feature1Title'),
                  description: t('landing.feature1Description')
                },
                {
                  icon: <BarChart2 className="h-8 w-8 text-cosmic-600 dark:text-cosmic-400" />,
                  title: t('landing.feature2Title'),
                  description: t('landing.feature2Description')
                },
                {
                  icon: <Star className="h-8 w-8 text-yellow-500" />,
                  title: t('landing.feature3Title'),
                  description: t('landing.feature3Description')
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="pt-6"
                >
                  <div className="flow-root bg-gray-50 dark:bg-gray-700 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-mystical-600 to-cosmic-600 rounded-md shadow-lg">
                          {feature.icon}
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 dark:text-white tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="mt-5 text-base text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.h2 
              variants={fadeIn}
              className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl"
            >
              {t('landing.pricingTitle')}
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300 mx-auto"
            >
              {t('landing.pricingSubtitle')}
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mt-12 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8"
          >
            <motion.div 
              variants={fadeIn}
              className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  {t('landing.freePlan')}
                </h3>
                <p className="mt-4 text-gray-600 dark:text-gray-300">
                  {t('landing.freePlanDescription')}
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                    $0
                  </span>
                  <span className="text-base font-medium text-gray-500 dark:text-gray-400">
                    /mo
                  </span>
                </p>
                <Link
                  to="/register"
                  className="mt-8 block w-full bg-mystical-50 dark:bg-mystical-900 border border-mystical-200 dark:border-mystical-700 rounded-md py-2 text-sm font-semibold text-mystical-700 dark:text-mystical-300 text-center hover:bg-mystical-100 dark:hover:bg-mystical-800"
                >
                  {t('landing.startFree')}
                </Link>
              </div>
              <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {t('landing.included')}
                </h4>
                <ul className="mt-6 space-y-4">
                  {[
                    t('landing.freeFeature1'),
                    t('landing.freeFeature2'),
                    t('landing.freeFeature3')
                  ].map((feature, index) => (
                    <li key={index} className="flex">
                      <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                      <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div 
              variants={fadeIn}
              className="p-8 bg-gradient-to-br from-mystical-600 to-cosmic-600 rounded-lg shadow-xl transform scale-105 z-10"
            >
              <div>
                <h3 className="text-xl font-medium text-white">
                  {t('landing.premiumPlan')}
                </h3>
                <p className="absolute top-0 right-0 -mr-1 -mt-4 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-xs font-bold uppercase transform rotate-3">
                  {t('landing.popular')}
                </p>
                <p className="mt-4 text-mystical-100">
                  {t('landing.premiumPlanDescription')}
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-white">
                    $9.99
                  </span>
                  <span className="text-base font-medium text-mystical-200">
                    /mo
                  </span>
                </p>
                <Link
                  to="/register"
                  className="mt-8 block w-full bg-white rounded-md py-2 text-sm font-semibold text-mystical-700 text-center hover:bg-gray-100"
                >
                  {t('landing.startPremium')}
                </Link>
              </div>
              <div className="mt-8 border-t border-mystical-500 pt-8">
                <h4 className="text-sm font-medium text-white">
                  {t('landing.included')}
                </h4>
                <ul className="mt-6 space-y-4">
                  {[
                    t('landing.premiumFeature1'),
                    t('landing.premiumFeature2'),
                    t('landing.premiumFeature3'),
                    t('landing.premiumFeature4'),
                    t('landing.premiumFeature5')
                  ].map((feature, index) => (
                    <li key={index} className="flex">
                      <Check className="flex-shrink-0 h-5 w-5 text-mystical-200" />
                      <span className="ml-3 text-sm text-white">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div 
              variants={fadeIn}
              className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  {t('landing.lifetimePlan')}
                </h3>
                <p className="mt-4 text-gray-600 dark:text-gray-300">
                  {t('landing.lifetimePlanDescription')}
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                    $299
                  </span>
                  <span className="text-base font-medium text-gray-500 dark:text-gray-400">
                    {t('landing.oneTime')}
                  </span>
                </p>
                <Link
                  to="/register"
                  className="mt-8 block w-full bg-mystical-50 dark:bg-mystical-900 border border-mystical-200 dark:border-mystical-700 rounded-md py-2 text-sm font-semibold text-mystical-700 dark:text-mystical-300 text-center hover:bg-mystical-100 dark:hover:bg-mystical-800"
                >
                  {t('landing.contactUs')}
                </Link>
              </div>
              <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {t('landing.included')}
                </h4>
                <ul className="mt-6 space-y-4">
                  {[
                    t('landing.lifetimeFeature1'),
                    t('landing.lifetimeFeature2'),
                    t('landing.lifetimeFeature3')
                  ].map((feature, index) => (
                    <li key={index} className="flex">
                      <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                      <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 sm:py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.h2 
              variants={fadeIn}
              className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl"
            >
              {t('landing.testimonialsTitle')}
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300 mx-auto"
            >
              {t('landing.testimonialsSubtitle')}
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mt-12 grid gap-8 lg:grid-cols-3"
          >
            {[1, 2, 3].map((i) => (
              <motion.div 
                key={i}
                variants={fadeIn}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow-md"
              >
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-mystical-500 to-cosmic-600 flex items-center justify-center text-white font-bold">
                    {['S', 'A', 'R'][i-1]}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {t(`landing.testimonial${i}Name`)}
                    </h4>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  "{t(`landing.testimonial${i}Text`)}"
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-mystical-600 to-cosmic-600 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="lg:grid lg:grid-cols-2 lg:gap-8 items-center"
          >
            <motion.div variants={fadeIn}>
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                {t('landing.ctaTitle')}
              </h2>
              <p className="mt-4 text-lg text-mystical-100">
                {t('landing.ctaSubtitle')}
              </p>
              <div className="mt-8">
                <Link
                  to="/register"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-mystical-700 bg-white hover:bg-gray-50"
                >
                  {t('landing.getStartedNow')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </motion.div>
            <motion.div variants={fadeIn} className="mt-12 lg:mt-0">
              <div className="flex items-center justify-center">
                <Users className="h-24 w-24 text-white opacity-75" />
                <div className="ml-8">
                  <p className="text-4xl font-bold text-white">1,000+</p>
                  <p className="text-lg text-mystical-100">{t('landing.activeUsers')}</p>
                </div>
              </div>
              <div className="mt-8 flex items-center justify-center">
                <Calendar className="h-24 w-24 text-white opacity-75" />
                <div className="ml-8">
                  <p className="text-4xl font-bold text-white">10,000+</p>
                  <p className="text-lg text-mystical-100">{t('landing.chartsGenerated')}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                {t('landing.footerCompany')}
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white">
                    {t('landing.footerAbout')}
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-gray-400 hover:text-white">
                    {t('landing.footerBlog')}
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-gray-400 hover:text-white">
                    {t('landing.footerCareers')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                {t('landing.footerSupport')}
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/help" className="text-gray-400 hover:text-white">
                    {t('landing.footerHelp')}
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-gray-400 hover:text-white">
                    {t('landing.footerFAQ')}
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-white">
                    {t('landing.footerContact')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                {t('landing.footerLegal')}
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/privacy-policy" className="text-gray-400 hover:text-white">
                    {t('landing.footerPrivacy')}
                  </Link>
                </li>
                <li>
                  <Link to="/terms-of-service" className="text-gray-400 hover:text-white">
                    {t('landing.footerTerms')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                {t('landing.footerConnect')}
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="https://twitter.com" className="text-gray-400 hover:text-white">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="https://facebook.com" className="text-gray-400 hover:text-white">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com" className="text-gray-400 hover:text-white">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between">
            <p className="text-base text-gray-400">
              &copy; 2025 AstroGuide Pro. {t('landing.footerRights')}
            </p>
            <div className="mt-4 md:mt-0 flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-mystical-600 to-cosmic-600 flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="ml-2 text-gray-400">
                AstroGuide Pro
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
