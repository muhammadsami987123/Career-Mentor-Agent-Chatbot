'use client';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, ChevronDown, UserCircle, Shield, Bell } from 'lucide-react';
import { useUser, useClerk } from '@clerk/nextjs';

export default function UserProfile() {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!isSignedIn || !user) return null;

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        onMouseEnter={() => setIsDropdownOpen(true)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
      >
        {/* Profile Picture */}
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
            {user.imageUrl ? (
              <Image
                src={user.imageUrl} 
                alt={user.fullName || 'User'} 
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </div>
          {/* Online indicator */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        </div>

        {/* User Info */}
        <div className="hidden lg:block text-left">
          <p className="text-sm font-semibold text-gray-800 truncate max-w-32">
            {user.fullName || user.emailAddresses[0]?.emailAddress}
          </p>
          <p className="text-xs text-gray-500">Signed in</p>
        </div>

        {/* Dropdown Arrow */}
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
          isDropdownOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
          {/* User Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                {user.imageUrl ? (
                  <Image
                    src={user.imageUrl} 
                    alt={user.fullName || 'User'} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user.fullName || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.emailAddresses[0]?.emailAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {/* Profile Option */}
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                // Add profile functionality here
              }}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              <UserCircle className="w-4 h-4" />
              <span>Profile</span>
            </button>

            {/* Settings Option */}
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                // Add settings functionality here
              }}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>

            {/* Notifications Option */}
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                // Add notifications functionality here
              }}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </button>

            {/* Privacy Option */}
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                // Add privacy functionality here
              }}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              <Shield className="w-4 h-4" />
              <span>Privacy</span>
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-1"></div>

          {/* Sign Out Option */}
          <div className="py-1">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 