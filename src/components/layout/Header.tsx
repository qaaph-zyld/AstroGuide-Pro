import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, Sun, Moon, User, Settings } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { theme, setTheme } = useTheme();
  const { currentUser, userProfile, logout } = useUser();
  const { t, i18n } = useTranslation();
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'cosmic' : 'light');
  };
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
            >
              <Menu size={24} />
            </button>
            
            <Link to="/dashboard" className="ml-4 flex items-center">
              <div className="flex items-center">
                <span className="h-8 w-8 rounded-full bg-gradient-to-r from-mystical-600 to-cosmic-600 flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </span>
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                  {t('app.name')}
                </span>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1">
              <button
                onClick={() => changeLanguage('en')}
                className={`px-2 py-1 text-xs rounded ${i18n.language === 'en' ? 'bg-mystical-100 text-mystical-700' : 'text-gray-500'}`}
              >
                EN
              </button>
              <button
                onClick={() => changeLanguage('hi')}
                className={`px-2 py-1 text-xs rounded ${i18n.language === 'hi' ? 'bg-mystical-100 text-mystical-700' : 'text-gray-500'}`}
              >
                HI
              </button>
              <button
                onClick={() => changeLanguage('sa')}
                className={`px-2 py-1 text-xs rounded ${i18n.language === 'sa' ? 'bg-mystical-100 text-mystical-700' : 'text-gray-500'}`}
              >
                SA
              </button>
            </div>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
            >
              {theme === 'light' ? <Moon size={20} /> : theme === 'dark' ? <Sun size={20} /> : <Sun size={20} className="text-yellow-400" />}
            </button>
            
            <button className="p-2 rounded-full text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none relative">
              <Bell size={20} />
              {userProfile && (
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
              )}
            </button>
            
            {currentUser ? (
              <div className="relative group">
                <button className="flex items-center focus:outline-none">
                  <div className="h-8 w-8 rounded-full bg-mystical-100 flex items-center justify-center text-mystical-700">
                    {userProfile?.displayName?.charAt(0) || <User size={16} />}
                  </div>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                    <p className="font-medium">{userProfile?.displayName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userProfile?.email}</p>
                  </div>
                  
                  <hr className="border-gray-200 dark:border-gray-700" />
                  
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {t('navigation.profile')}
                  </Link>
                  
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {t('navigation.settings')}
                  </Link>
                  
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {t('navigation.logout')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-mystical-600 hover:text-mystical-500"
                >
                  {t('navigation.login')}
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium px-3 py-1.5 bg-mystical-600 text-white rounded-md hover:bg-mystical-700"
                >
                  {t('navigation.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
