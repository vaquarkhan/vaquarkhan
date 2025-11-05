
import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-slate-800 text-slate-300 py-8 text-center">
      <div className="container mx-auto px-4">
        <p>&copy; {currentYear} ZAPS Group. All rights reserved.</p>
        <p className="text-sm mt-1">Card Linked Benefits Platform for Issuers.</p>
      </div>
    </footer>
  );
};
