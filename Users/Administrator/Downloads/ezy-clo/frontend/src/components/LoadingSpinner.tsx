
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string; // Tailwind color class e.g., 'text-blue-500'
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', color = 'text-white' }) => {
  let sizeClasses = 'h-8 w-8';
  if (size === 'sm') sizeClasses = 'h-5 w-5';
  if (size === 'lg') sizeClasses = 'h-12 w-12';

  return (
    <div className={`animate-spin rounded-full border-t-2 border-b-2 border-transparent ${sizeClasses} ${color}`} style={{ borderTopColor: 'currentColor', borderBottomColor: 'currentColor' }}></div>
  );
};
