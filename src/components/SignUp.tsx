import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Cloud, Lock } from 'lucide-react';

function SignUp() {
  const handleGoogleSignIn = () => {
    window.location.href="https://backend-gws-vault.onrender.com/auth/google"
  };

  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1d21] to-[#2d3139] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Shield size={48} className="text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">ZERO TO ONE</h1>
          <p className="text-gray-400">Secure your google workspace data with our advanced backup solution</p>
        </div>

        {/* Main Card */}
        <div className="bg-[#1e2227] rounded-xl p-8 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-6">Secure Backup Service</h2>
          
          {/* Info Banner */}
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6 flex items-center gap-2">
            <Shield size={20} className="text-gray-400" />
            <p className="text-sm text-gray-400">Only admins can access via workspace email</p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-gray-800/30">
              <Cloud className="text-blue-500 mb-2" size={24} />
              <h3 className="text-white text-sm font-medium mb-1">Automated Backups</h3>
              <p className="text-xs text-gray-400">Hassle-free data protection with automatic backups</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-800/30">
              <Lock className="text-blue-500 mb-2" size={24} />
              <h3 className="text-white text-sm font-medium mb-1">End-to-End Encryption</h3>
              <p className="text-xs text-gray-400">Your data is fully protected at every stage</p>
            </div>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-white hover:bg-gray-50 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-3 mb-6"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google Workspace
          </button>

          {/* Terms */}
          <p className="text-center text-xs text-gray-400">
            By continuing, you agree to our{' '}
            <Link to="/terms" className="text-blue-500 hover:text-blue-400">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-blue-500 hover:text-blue-400">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;