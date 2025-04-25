import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Download, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Icons
const Shield = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const Lock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const RefreshCw = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 4v6h-6"></path>
    <path d="M1 20v-6h6"></path>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
);

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center mb-4">
        <div className="text-primary-600 dark:text-primary-300">
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </div>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:flex-1 p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              SteganoVault allows you to securely hide messages in images using 
              advanced steganography techniques. Your data stays private and secure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate('/dashboard/encode')}
                className="btn-primary"
              >
                <Upload className="h-5 w-5 mr-2" />
                Encode Message
              </button>
              <button 
                onClick={() => navigate('/dashboard/decode')}
                className="btn-secondary"
              >
                <Download className="h-5 w-5 mr-2" />
                Decode Image
              </button>
            </div>
          </div>
          <div className="md:w-1/3 bg-gradient-to-br from-primary-500 to-secondary-600 p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                <Settings className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Steganography Tools</h3>
              <p className="text-white/80 text-sm">
                Hide information in plain sight
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <FeatureCard 
          icon={<Shield />} 
          title="Secure Encryption" 
          description="Your messages are secured with advanced encryption before being hidden in images."
        />
        <FeatureCard 
          icon={<Lock />} 
          title="Invisible to Detection" 
          description="Our techniques ensure your hidden data won't be detected by casual observation."
        />
        <FeatureCard 
          icon={<RefreshCw />} 
          title="Easy to Use" 
          description="Simple interface makes encoding and decoding a breeze."
        />
      </div>
    </div>
  );
};

export default Home;