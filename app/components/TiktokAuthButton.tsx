'use client';

import { useState } from 'react';

export default function TiktokAuthButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async () => {
    setIsLoading(true);
    try {
      window.location.href = '/api/auth/tiktok-shop';
    } catch (error) {
      console.error('Auth error:', error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleAuth}
      disabled={isLoading}
      className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <span className="animate-spin">⏳</span>
          Yönlendiriliyor...
        </>
      ) : (
        <>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.89 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 014.52-2.38V9.85a6.33 6.33 0 00-1.63-.22 6.34 6.34 0 00-6.34 6.34A6.34 6.34 0 009.49 22a6.34 6.34 0 006.34-6.34v-5.3a8.16 8.16 0 004.77 1.52v-3.45a4.85 4.85 0 01-1-1.74z"/>
          </svg>
          TikTok Shop ile Bağlan
        </>
      )}
    </button>
  );
} 