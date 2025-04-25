import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  Moon, Sun, LogOut, User, Image, Code, Settings, 
  Menu, X, Home as HomeIcon, Download, Upload
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import EncodeImage from './EncodeImage';
import DecodeImage from './DecodeImage';
import History from './History';
import Home from './Home';

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900">
      {/* Mobile header */}
      <div className="md:hidden bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="mr-4 text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">SteganoVault</h1>
        </div>
        <div className="flex items-center">
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <div className="ml-2 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
            <span className="text-primary-600 dark:text-primary-300 font-medium">
              {user?.username.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Sidebar (mobile overlay) */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setSidebarOpen(false)}>
          <div className="absolute top-0 left-0 w-64 h-full bg-white dark:bg-gray-800 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu</h2>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-4">
              <nav className="space-y-2">
                <SidebarLink 
                  icon={<HomeIcon className="h-5 w-5" />} 
                  text="Home" 
                  to="/dashboard" 
                  active={isActive('/dashboard')} 
                  onClick={() => setSidebarOpen(false)}
                />
                <SidebarLink 
                  icon={<Upload className="h-5 w-5" />} 
                  text="Encode Image" 
                  to="/dashboard/encode" 
                  active={isActive('/dashboard/encode')} 
                  onClick={() => setSidebarOpen(false)}
                />
                <SidebarLink 
                  icon={<Download className="h-5 w-5" />} 
                  text="Decode Image" 
                  to="/dashboard/decode" 
                  active={isActive('/dashboard/decode')} 
                  onClick={() => setSidebarOpen(false)}
                />
                <SidebarLink 
                  icon={<Code className="h-5 w-5" />} 
                  text="History" 
                  to="/dashboard/history" 
                  active={isActive('/dashboard/history')} 
                  onClick={() => setSidebarOpen(false)}
                />
              </nav>
              <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                  className="flex items-center text-red-500 hover:text-red-700 dark:hover:text-red-400"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar (desktop) */}
      <div className="hidden md:flex md:flex-col md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4 flex items-center border-b border-gray-200 dark:border-gray-700">
          <div className="p-1 bg-primary-100 dark:bg-primary-900 rounded mr-2">
            <Code className="h-6 w-6 text-primary-600 dark:text-primary-300" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">SteganoVault</h1>
        </div>
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-2">
            <SidebarLink 
              icon={<HomeIcon className="h-5 w-5" />} 
              text="Home" 
              to="/dashboard" 
              active={location.pathname === '/dashboard'} 
            />
            <SidebarLink 
              icon={<Upload className="h-5 w-5" />} 
              text="Encode Image" 
              to="/dashboard/encode" 
              active={isActive('/dashboard/encode')} 
            />
            <SidebarLink 
              icon={<Download className="h-5 w-5" />} 
              text="Decode Image" 
              to="/dashboard/decode" 
              active={isActive('/dashboard/decode')} 
            />
            <SidebarLink 
              icon={<Image className="h-5 w-5" />} 
              text="History" 
              to="/dashboard/history" 
              active={isActive('/dashboard/history')} 
            />
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <User className="h-6 w-6 text-primary-600 dark:text-primary-300" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.username}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[160px]">{user?.email}</p>
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center text-red-500 hover:text-red-700 dark:hover:text-red-400"
            >
              <LogOut className="h-5 w-5 mr-1" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/encode" element={<EncodeImage />} />
            <Route path="/decode" element={<DecodeImage />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const SidebarLink: React.FC<{
  icon: React.ReactNode;
  text: string;
  to: string;
  active: boolean;
  onClick?: () => void;
}> = ({ icon, text, to, active, onClick }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(to);
    if (onClick) onClick();
  };
  
  return (
    <button
      onClick={handleClick}
      className={`flex items-center w-full p-2 rounded-lg text-left ${
        active
          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      <span className={`${active ? 'text-primary-600 dark:text-primary-300' : ''} mr-3`}>
        {icon}
      </span>
      <span className="font-medium">{text}</span>
    </button>
  );
};

export default Dashboard;