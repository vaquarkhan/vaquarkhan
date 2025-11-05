
import React from 'react';
import { ZapsLogo } from './icons/ZapsLogo';
import { MastercardLogo } from './icons/MastercardLogo';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <ZapsLogo className="h-10" />
        <div className="flex items-center space-x-2">
          <span className="text-sm hidden sm:block">Powered by</span>
          <MastercardLogo className="h-8" />
        </div>
      </div>
    </header>
  );
};
