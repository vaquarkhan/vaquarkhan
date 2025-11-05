
import React from 'react';

export const ZapsLogo: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`font-bold text-white ${className}`}>
    <span className="text-3xl tracking-tight">ZAPS</span>
    <span className="block text-xs font-normal tracking-widest opacity-80 -mt-1">GROUP</span>
  </div>
);
