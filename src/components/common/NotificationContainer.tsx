import React from 'react';
import { useNotification, Notification } from '../../contexts/NotificationContext';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900 dark:bg-opacity-20';
      case 'error':
        return 'bg-red-50 dark:bg-red-900 dark:bg-opacity-20';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20';
      case 'info':
      default:
        return 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20';
    }
  };

  const getBorderColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-400 dark:border-green-600';
      case 'error':
        return 'border-red-400 dark:border-red-600';
      case 'warning':
        return 'border-yellow-400 dark:border-yellow-600';
      case 'info':
      default:
        return 'border-blue-400 dark:border-blue-600';
    }
  };

  return (
    <div className="fixed bottom-0 right-0 p-4 w-full md:max-w-sm z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`rounded-lg border-l-4 ${getBorderColor(notification.type)} ${getBgColor(notification.type)} p-4 shadow-md`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {getIcon(notification.type)}
              </div>
              <div className="ml-3 w-0 flex-1">
                {notification.title && (
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {notification.title}
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  {notification.message}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="inline-flex text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationContainer;
