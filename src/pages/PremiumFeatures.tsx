import React, { useState } from 'react';
import { Star, Check, X, CreditCard, Shield, Clock, Download, Users, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../contexts/UserContext';
import { useNotification } from '../contexts/NotificationContext';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { motion } from 'framer-motion';

const PremiumFeatures: React.FC = () => {
  const { t } = useTranslation();
  const { userProfile, subscribeToPremium, cancelSubscription } = useUser();
  const { addNotification } = useNotification();
  
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'lifetime'>('monthly');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  const plans = {
    monthly: {
      id: 'monthly',
      name: t('premium.monthly'),
      price: '$9.99',
      pricePerMonth: '$9.99',
      billingCycle: t('premium.billedMonthly'),
      discount: '',
      popular: false
    },
    yearly: {
      id: 'yearly',
      name: t('premium.yearly'),
      price: '$99.99',
      pricePerMonth: '$8.33',
      billingCycle: t('premium.billedYearly'),
      discount: t('premium.savePercent', { percent: '17%' }),
      popular: true
    },
    lifetime: {
      id: 'lifetime',
      name: t('premium.lifetime'),
      price: '$299.99',
      pricePerMonth: '',
      billingCycle: t('premium.oneTimePayment'),
      discount: t('premium.bestValue'),
      popular: false
    }
  };

  const premiumFeatures = [
    {
      title: t('premium.benefits.1'),
      description: t('premium.dashaDetails'),
      icon: <Clock className="h-5 w-5 text-mystical-600 dark:text-mystical-400" />
    },
    {
      title: t('premium.benefits.2'),
      description: t('premium.compatibilityDetails'),
      icon: <Users className="h-5 w-5 text-mystical-600 dark:text-mystical-400" />
    },
    {
      title: t('premium.benefits.3'),
      description: t('premium.careerDetails'),
      icon: <Star className="h-5 w-5 text-mystical-600 dark:text-mystical-400" />
    },
    {
      title: t('premium.benefits.4'),
      description: t('premium.healthDetails'),
      icon: <Shield className="h-5 w-5 text-mystical-600 dark:text-mystical-400" />
    },
    {
      title: t('premium.benefits.5'),
      description: t('premium.remedyDetails'),
      icon: <HelpCircle className="h-5 w-5 text-mystical-600 dark:text-mystical-400" />
    },
    {
      title: t('premium.benefits.6'),
      description: t('premium.transitDetails'),
      icon: <Clock className="h-5 w-5 text-mystical-600 dark:text-mystical-400" />
    },
    {
      title: t('premium.benefits.7'),
      description: t('premium.pdfDetails'),
      icon: <Download className="h-5 w-5 text-mystical-600 dark:text-mystical-400" />
    },
    {
      title: t('premium.benefits.8'),
      description: t('premium.supportDetails'),
      icon: <Users className="h-5 w-5 text-mystical-600 dark:text-mystical-400" />
    }
  ];

  const handleCreateSubscription = async (data: any, actions: any) => {
    try {
      setProcessingPayment(true);
      
      // For monthly and yearly plans, create a subscription
      if (selectedPlan === 'monthly' || selectedPlan === 'yearly') {
        return actions.subscription.create({
          plan_id: selectedPlan === 'monthly' ? 'P-1AB23456CD789012E' : 'P-5GH67890IJ123456K',
          application_context: {
            shipping_preference: 'NO_SHIPPING'
          }
        });
      } 
      // For lifetime, process a one-time payment
      else {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: '299.99',
              currency_code: 'USD'
            },
            description: 'AstroGuide Pro Lifetime Subscription'
          }],
          application_context: {
            shipping_preference: 'NO_SHIPPING'
          }
        });
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      addNotification({
        type: 'error',
        message: t('premium.paymentError')
      });
      setProcessingPayment(false);
      return null;
    }
  };

  const handleApprove = async (data: any, actions: any) => {
    try {
      let paymentDetails;
      
      // Handle subscription approval
      if (selectedPlan === 'monthly' || selectedPlan === 'yearly') {
        const subscription = await actions.subscription.get();
        
        paymentDetails = {
          subscriptionId: subscription.id,
          amount: selectedPlan === 'monthly' ? '9.99' : '99.99',
          currency: 'USD',
          method: 'PayPal',
          transactionId: data.orderID || data.subscriptionID
        };
      } 
      // Handle one-time payment approval
      else {
        const order = await actions.order.capture();
        
        paymentDetails = {
          orderId: order.id,
          amount: '299.99',
          currency: 'USD',
          method: 'PayPal',
          transactionId: data.orderID
        };
      }
      
      // Update user subscription in our system
      await subscribeToPremium(selectedPlan, paymentDetails);
      
      addNotification({
        type: 'success',
        message: t('premium.subscriptionSuccess')
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      addNotification({
        type: 'error',
        message: t('premium.paymentProcessError')
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await cancelSubscription();
      
      addNotification({
        type: 'success',
        message: t('premium.cancellationSuccess')
      });
      
      setShowCancelModal(false);
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      addNotification({
        type: 'error',
        message: t('premium.cancellationError')
      });
    }
  };

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
      opacity: 1
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto"
    >
      {/* Header */}
      <motion.div 
        variants={itemVariants}
        className="text-center mb-12"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {userProfile?.isPremium ? t('premium.managePremium') : t('premium.title')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {userProfile?.isPremium 
            ? t('premium.currentMemberText') 
            : t('premium.unlockText')}
        </p>
      </motion.div>

      {/* Current Subscription (if premium) */}
      {userProfile?.isPremium && (
        <motion.div 
          variants={itemVariants}
          className="bg-gradient-to-br from-mystical-600 to-cosmic-700 rounded-xl shadow-lg p-6 text-white mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-300 mr-4" />
              <div>
                <h2 className="text-xl font-bold">
                  {t('premium.currentPlan')}
                </h2>
                <p className="text-mystical-100">
                  {userProfile.premiumExpiry 
                    ? `${t('premium.validUntil')} ${new Date(userProfile.premiumExpiry).toLocaleDateString()}`
                    : t('premium.lifetimeMember')}
                </p>
              </div>
            </div>
            
            {userProfile.premiumExpiry && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-white border-opacity-30 rounded-md text-sm font-medium text-white bg-white bg-opacity-10 hover:bg-opacity-20"
              >
                {t('premium.cancelSubscription')}
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Pricing Plans (if not premium or has expiry date) */}
      {(!userProfile?.isPremium || userProfile?.premiumExpiry) && (
        <motion.div variants={itemVariants} className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.values(plans).map((plan) => (
              <div 
                key={plan.id}
                className={`relative rounded-xl shadow-sm overflow-hidden transition-all duration-300 ${
                  selectedPlan === plan.id 
                    ? 'ring-2 ring-mystical-600 dark:ring-mystical-400 transform scale-105 z-10' 
                    : 'bg-white dark:bg-gray-800 hover:shadow-md'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-mystical-600 text-white text-xs font-bold px-3 py-1 transform rotate-45 translate-x-7 translate-y-3">
                      {t('premium.popular')}
                    </div>
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    {plan.pricePerMonth && (
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                        / {t('premium.perMonth')}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {plan.billingCycle}
                  </p>
                  
                  {plan.discount && (
                    <p className="text-sm font-medium text-mystical-600 dark:text-mystical-400 mb-4">
                      {plan.discount}
                    </p>
                  )}
                  
                  <button
                    onClick={() => setSelectedPlan(plan.id as any)}
                    className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      selectedPlan === plan.id
                        ? 'bg-mystical-600 text-white hover:bg-mystical-700'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-650'
                    }`}
                  >
                    {selectedPlan === plan.id ? t('premium.selected') : t('premium.select')}
                  </button>
                </div>
                
                <div className="px-6 pb-6">
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <ul className="space-y-2">
                      {premiumFeatures.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {feature.title}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Payment Section */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {t('premium.paymentMethod')}
            </h3>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    PayPal
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {t('premium.securePayment')}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-750 rounded-md p-4">
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-300">
                      {plans[selectedPlan].name}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {plans[selectedPlan].price}
                    </span>
                  </div>
                  
                  {plans[selectedPlan].discount && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        {t('premium.discount')}
                      </span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {plans[selectedPlan].discount}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {t('premium.total')}
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {plans[selectedPlan].price}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              {processingPayment && (
                <div className="absolute inset-0 bg-white bg-opacity-75 dark:bg-gray-800 dark:bg-opacity-75 flex items-center justify-center z-10 rounded-md">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-mystical-600"></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {t('premium.processing')}
                    </span>
                  </div>
                </div>
              )}
              
              <PayPalButtons
                style={{ 
                  layout: 'vertical',
                  color: 'blue',
                  shape: 'rect',
                  label: 'subscribe'
                }}
                createSubscription={handleCreateSubscription}
                onApprove={handleApprove}
                onError={(err) => {
                  console.error('PayPal Error:', err);
                  addNotification({
                    type: 'error',
                    message: t('premium.paypalError')
                  });
                  setProcessingPayment(false);
                }}
                onCancel={() => {
                  addNotification({
                    type: 'info',
                    message: t('premium.paymentCancelled')
                  });
                  setProcessingPayment(false);
                }}
              />
            </div>
            
            <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
              <p>{t('premium.termsNotice')}</p>
              <p className="mt-1">{t('premium.cancelAnytime')}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Premium Features */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {t('premium.featuresIncluded')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {premiumFeatures.map((feature, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex"
            >
              <div className="flex-shrink-0 mr-4">
                <div className="h-10 w-10 rounded-full bg-mystical-100 dark:bg-mystical-900 flex items-center justify-center">
                  {feature.icon}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Testimonials */}
      <motion.div variants={itemVariants} className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {t('premium.testimonials')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-mystical-500 to-cosmic-600 flex items-center justify-center text-white font-bold">
                    {['S', 'A', 'R'][i-1]}
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">
                    {t(`premium.testimonial${i}Name`)}
                  </h3>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                "{t(`premium.testimonial${i}Text`)}"
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* FAQ */}
      <motion.div variants={itemVariants} className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {t('premium.faq')}
        </h2>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <dl>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <dt className="text-lg font-medium text-gray-900 dark:text-white">
                  {t(`premium.faq${i}Question`)}
                </dt>
                <dd className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {t(`premium.faq${i}Answer`)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </motion.div>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {t('premium.confirmCancel')}
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              {t('premium.cancelWarning')}
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650"
              >
                {t('common.keepSubscription')}
              </button>
              
              <button
                onClick={handleCancelSubscription}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                {t('premium.confirmCancellation')}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PremiumFeatures;
