import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  BarChart2, 
  Star, 
  CreditCard, 
  User, 
  Settings, 
  HelpCircle, 
  ChevronLeft,
  Download
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../../contexts/UserContext';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const { t } = useTranslation();
  const { userProfile } = useUser();
  
  const navItems = [
    { 
      name: t('navigation.dashboard'), 
      path: '/dashboard', 
      icon: <Home size={20} /> 
    },
    { 
      name: t('navigation.birthChart'), 
      path: '/birth-data', 
      icon: <Calendar size={20} /> 
    },
    { 
      name: t('navigation.analysis'), 
      path: '/chart-analysis', 
      icon: <BarChart2 size={20} /> 
    },
    { 
      name: t('navigation.premium'), 
      path: '/premium', 
      icon: <Star size={20} />,
      badge: !userProfile?.isPremium ? t('premium.freeTrial') : undefined
    },
    { 
      name: t('navigation.profile'), 
      path: '/profile', 
      icon: <User size={20} /> 
    }
  ];

  return (
    <div 
      className={`fixed inset-y-0 left-0 z-20 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}
    >
      <div className="h-full flex flex-col w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <span className="h-8 w-8 rounded-full bg-gradient-to-r from-mystical-600 to-cosmic-600 flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </span>
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
              {t('app.name')}
            </span>
          </div>
          <button 
            onClick={closeSidebar}
            className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-mystical-50 text-mystical-700 dark:bg-mystical-900 dark:text-mystical-200' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`
                }
                onClick={() => {
                  if (window.innerWidth < 768) {
                    closeSidebar();
                  }
                }}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
                {item.badge && (
                  <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-mystical-100 text-mystical-800 dark:bg-mystical-800 dark:text-mystical-100">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {userProfile?.isPremium ? (
            <div className="bg-gradient-to-r from-mystical-600 to-cosmic-600 rounded-lg p-3 text-white">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-300" />
                <span className="ml-2 text-sm font-medium">{t('premium.currentPlan')}</span>
              </div>
              <p className="mt-1 text-xs opacity-90">{t('premium.benefits.7')}</p>
              <button className="mt-2 flex items-center text-xs bg-white bg-opacity-20 hover:bg-opacity-30 rounded px-2 py-1">
                <Download size={12} className="mr-1" />
                {t('common.download')}
              </button>
            </div>
          ) : (
            <NavLink
              to="/premium"
              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-mystical-600 to-cosmic-600 hover:from-mystical-700 hover:to-cosmic-700"
            >
              <Star className="mr-2 h-5 w-5" />
              {t('premium.upgrade')}
            </NavLink>
          )}
          
          <div className="mt-4 flex items-center justify-between">
            <NavLink
              to="/settings"
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <Settings size={16} />
            </NavLink>
            <a
              href="https://astroguidepro.com/help"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <HelpCircle size={16} />
            </a>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              v1.0.0
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 md:hidden z-10"
          onClick={closeSidebar}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
