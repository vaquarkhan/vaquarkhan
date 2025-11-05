
import React from 'react';

export const MastercardLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 50 30" className={className} xmlns="http://www.w3.org/2000/svg" aria-label="Mastercard Logo">
    <circle cx="15" cy="15" r="12" fill="#EB001B" />
    <circle cx="35" cy="15" r="12" fill="#FF5F00" />
    <path d="M25,15a12,12 0 0,1-5.22,-20.14a12,12 0 0,0 0,20.28Z" fill="#F79E1B" />
  </svg>
);
