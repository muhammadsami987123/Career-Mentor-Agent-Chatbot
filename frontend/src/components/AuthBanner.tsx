'use client';

import { useState } from 'react';
import { X, Sparkles, Lock } from 'lucide-react';
import { useAuth, SignIn, SignUp } from '@clerk/nextjs';

interface AuthBannerProps {
  isVisible: boolean;
  onDismiss?: () => void;
  interactionCount: number;
}

export default function AuthBanner({ isVisible, onDismiss, interactionCount }: AuthBannerProps) {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const { isSignedIn } = useAuth();

  if (!isVisible || isSignedIn) return null;

  const remainingInteractions = 25 - interactionCount;
  const hasExhaustedFreeInteractions = remainingInteractions <= 0;

  return (
    <>
      {/* Persistent Auth Banner */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              {/* Left side - Message */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {hasExhaustedFreeInteractions 
                      ? "Unlock Unlimited Access" 
                      : `Only ${remainingInteractions} free interaction${remainingInteractions > 1 ? 's' : ''} left!`
                    }
                  </h3>
                  <p className="text-blue-100 text-sm">
                    {hasExhaustedFreeInteractions
                      ? "Sign up to continue your career journey with unlimited access"
                      : "Sign up now to unlock unlimited conversations with all agents"
                    }
                  </p>
                </div>
              </div>

              {/* Right side - Action buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowSignUp(true)}
                  className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Sign Up Free
                </button>
                
                <button
                  onClick={() => setShowSignIn(true)}
                  className="border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200"
                >
                  Sign In
                </button>

                {/* Dismiss button - only show if not exhausted */}
                {!hasExhaustedFreeInteractions && onDismiss && (
                  <button
                    onClick={onDismiss}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sign Up Modal */}
      {showSignUp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Create Your Account</h3>
              <p className="text-gray-600">Join thousands of users advancing their careers</p>
            </div>
            <SignUp 
              routing="hash"
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700',
                  card: 'shadow-none',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                }
              }}
            />
            <button
              onClick={() => setShowSignUp(false)}
              className="w-full mt-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Sign In Modal */}
      {showSignIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Welcome Back</h3>
              <p className="text-gray-600">Sign in to continue your career journey</p>
            </div>
            <SignIn 
              routing="hash"
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700',
                  card: 'shadow-none',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                }
              }}
            />
            <button
              onClick={() => setShowSignIn(false)}
              className="w-full mt-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
} 