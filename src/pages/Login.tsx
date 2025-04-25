import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, KeyRound, CheckCircle, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [isRegistering, setIsRegistering] = useState(false);
  
  const { login, register, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (step === 1) {
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid email address');
        return;
      }
      if (isRegistering) {
        setStep(2);
      } else {
        setStep(3);
      }
      return;
    }

    if (step === 2 && isRegistering) {
      if (!username.trim()) {
        setError('Please enter a username');
        return;
      }
      setStep(3);
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    setIsLoggingIn(true);
    try {
      let success;
      if (isRegistering) {
        success = await register(email, username, password);
        if (!success) {
          setError('Email already registered. Please try logging in instead.');
        }
      } else {
        success = await login(email, password);
        if (!success) {
          setError('Invalid credentials. Try demo@example.com / password');
        }
      }
      
      if (success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const backgroundImages = [
    'https://images.pexels.com/photos/3699274/pexels-photo-3699274.jpeg',
    'https://images.pexels.com/photos/2911572/pexels-photo-2911572.jpeg'
  ];

  const resetForm = () => {
    setStep(1);
    setEmail('');
    setPassword('');
    setUsername('');
    setError('');
    setIsRegistering(!isRegistering);
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left side - Form */}
      <motion.div 
        className="flex items-center justify-center p-6 md:p-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="w-full max-w-md">
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center mb-6">
              <KeyRound className="h-8 w-8 text-primary-500 mr-2" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                SteganoVault
              </h1>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {isRegistering 
                ? (step === 1 ? 'Create an account' : step === 2 ? 'Choose a username' : 'Set your password')
                : (step === 1 ? 'Welcome back' : 'Enter your password')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {isRegistering
                ? 'Join SteganoVault to start securing your messages'
                : 'Sign in to access your secure steganography tools'}
            </p>
          </motion.div>

          {error && (
            <motion.div 
              variants={itemVariants}
              className="bg-error-50 text-error-700 px-4 py-3 rounded-lg mb-6"
            >
              {error}
            </motion.div>
          )}

          <motion.form onSubmit={handleSubmit} variants={itemVariants}>
            {step === 1 && (
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-10"
                    placeholder="you@example.com"
                  />
                </div>
                {!isRegistering && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    For demo, use: demo@example.com
                  </p>
                )}
              </div>
            )}

            {step === 2 && isRegistering && (
              <div className="mb-6">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input pl-10"
                    placeholder="Choose a username"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={isRegistering ? "new-password" : "current-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pl-10 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {!isRegistering && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    For demo, use: password
                  </p>
                )}
              </div>
            )}

            <motion.div variants={itemVariants} className="flex flex-col gap-4">
              <button
                type="submit"
                disabled={isLoggingIn}
                className="btn-primary w-full flex justify-center items-center"
              >
                {isLoggingIn ? (
                  <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                ) : step === 3 ? (
                  isRegistering ? "Create Account" : "Sign in"
                ) : (
                  "Continue"
                )}
              </button>

              {step > 1 && (
                <button
                  type="button"
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  onClick={() => setStep(step - 1)}
                >
                  Back
                </button>
              )}
            </motion.div>
          </motion.form>

          <motion.div 
            variants={itemVariants}
            className="mt-8 flex justify-between items-center"
          >
            <button
              onClick={toggleTheme}
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center"
            >
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
            <button
              onClick={resetForm}
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              {isRegistering ? 'Already have an account?' : 'Need an account?'}
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Right side - Image/Animation */}
      <div className="hidden md:block relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/70 to-secondary-600/70 z-10"></div>
        <motion.img
          src={theme === 'dark' ? backgroundImages[1] : backgroundImages[0]}
          alt="Encryption background"
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <motion.div
            className="p-8 max-w-lg text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.h2 
              className="text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {isRegistering ? 'Join SteganoVault Today' : 'Welcome Back'}
            </motion.h2>
            <motion.p 
              className="text-lg mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              Hide your confidential messages inside innocent-looking images with 
              our advanced steganography technology.
            </motion.p>
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-accent-300 mr-2 flex-shrink-0" />
                <p>Military-grade encryption to protect your secrets</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-accent-300 mr-2 flex-shrink-0" />
                <p>Undetectable to the naked eye and basic analysis tools</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-accent-300 mr-2 flex-shrink-0" />
                <p>Compatible with all common image formats</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;