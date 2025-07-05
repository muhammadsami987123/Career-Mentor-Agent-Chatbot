'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useAuth, SignIn, SignUp } from '@clerk/nextjs';

interface LoginPopupProps {
  isVisible: boolean;
  onDismiss: () => void;
  interactionCount: number;
}

export default function LoginPopup({ isVisible, onDismiss, interactionCount }: LoginPopupProps) {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const { isSignedIn } = useAuth();

  // Hide popup if user is already signed in
  useEffect(() => {
    if (isSignedIn && isVisible) {
      onDismiss();
    }
  }, [isSignedIn, isVisible, onDismiss]);

  if (!isVisible || isSignedIn) return null;

  const remainingInteractions = 25 - interactionCount;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onDismiss}
      >
        {/* Popup */}
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Unlock Full Access
            </h2>
            <p className="text-gray-600">
              {remainingInteractions > 0 
                ? `You have ${remainingInteractions} more free interaction${remainingInteractions > 1 ? 's' : ''} before signing up.`
                : "Sign up to continue your career journey!"
              }
            </p>
          </div>

          {/* Benefits */}
          <div className="mb-6 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Unlimited conversations with all agents</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Save and review your career insights</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Personalized recommendations</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Track your career progress</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={() => setShowSignUp(true)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Sign Up - Its Free
            </button>
            
            <button
              onClick={() => setShowSignIn(true)}
              className="w-full border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
            >
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In
            </button>
          </div>

          {/* Continue without account */}
          {remainingInteractions > 0 && (
            <div className="mt-4 text-center">
              <button
                onClick={onDismiss}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Continue with {remainingInteractions} free interaction{remainingInteractions > 1 ? 's' : ''}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sign Up Modal */}
      {showSignUp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
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