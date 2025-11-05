import React from 'react';
import { SpendProgressBar } from './SpendProgressBar';
import { OfferCard } from '../offers/OfferCard';
import { OfferBrowser } from '../offers/OfferBrowser';
import { CustomizablePortal } from '../customer/CustomizablePortal';

interface DashboardProps {
  user?: {
    id: string;
    name: string;
    role: string;
    scheme?: 'mastercard' | 'visa' | 'default';
    cards: Array<{
      id: string;
      type: string;
      lastFour: string;
      currentSpend: number;
      threshold: number;
    }>;
  };
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  // If user has a specific scheme, show customizable portal
  if (user?.scheme && user.scheme !== 'default') {
    return <CustomizablePortal scheme={user.scheme} user={user} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'Valued Customer'}
          </h1>
          <p className="mt-2 text-gray-600">
            Track your spending and discover personalized offers
          </p>
        </div>

        {/* Spend Progress Section */}
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user?.cards?.map((card) => (
              <SpendProgressBar
                key={card.id}
                cardType={card.type}
                lastFour={card.lastFour}
                currentSpend={card.currentSpend}
                threshold={card.threshold}
              />
            ))}
          </div>
        </div>

        {/* Personalized Offers Section */}
        <div className="px-4 py-6 sm:px-0">
          <OfferBrowser userId={user?.id || 'guest'} />
        </div>
      </div>
    </div>
  );
};