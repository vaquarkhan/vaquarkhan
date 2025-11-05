import React, { useState, useEffect } from 'react';

interface PortalConfig {
  portalName: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  welcomeMessage: string;
  features: string[];
}

interface CustomizablePortalProps {
  scheme: 'mastercard' | 'visa' | 'default';
  user: any;
}

export const CustomizablePortal: React.FC<CustomizablePortalProps> = ({ scheme, user }) => {
  const [config, setConfig] = useState<PortalConfig | null>(null);

  useEffect(() => {
    fetchPortalConfig();
  }, [scheme]);

  const fetchPortalConfig = async () => {
    const configs = {
      mastercard: {
        portalName: 'Mastercard Benefits',
        primaryColor: '#eb001b',
        secondaryColor: '#f79e1b',
        logoUrl: '/assets/mastercard-logo.png',
        welcomeMessage: 'Welcome to your exclusive Mastercard benefits portal',
        features: ['Priceless Experiences', 'Travel Benefits', 'Dining Rewards', 'Shopping Cashback']
      },
      visa: {
        portalName: 'Visa Rewards',
        primaryColor: '#1a1f71',
        secondaryColor: '#faa61a',
        logoUrl: '/assets/visa-logo.png',
        welcomeMessage: 'Discover amazing Visa rewards and benefits',
        features: ['Visa Offers', 'Travel Insurance', 'Purchase Protection', 'Concierge Service']
      },
      default: {
        portalName: 'Card Benefits',
        primaryColor: '#2563eb',
        secondaryColor: '#3b82f6',
        logoUrl: '/assets/default-logo.png',
        welcomeMessage: 'Welcome to your personalized benefits portal',
        features: ['Exclusive Offers', 'Cashback Rewards', 'Special Discounts', 'Premium Services']
      }
    };
    setConfig(configs[scheme] || configs.default);
  };

  if (!config) return <div>Loading...</div>;

  return (
    <div className="min-h-screen" style={{ backgroundColor: config.primaryColor + '05' }}>
      {/* Custom Header */}
      <header className="shadow-sm" style={{ backgroundColor: config.primaryColor }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <img src={config.logoUrl} alt={config.portalName} className="h-10 w-auto" />
              <h1 className="text-xl font-bold text-white">{config.portalName}</h1>
            </div>
            <div className="text-white">
              Welcome, {user?.name}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="py-12" style={{ 
        background: `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor} 100%)` 
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{config.welcomeMessage}</h2>
          <p className="text-xl text-white opacity-90">
            Unlock exclusive benefits tailored just for you
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Your Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {config.features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: config.primaryColor + '20' }}
                >
                  <span className="text-2xl">🎯</span>
                </div>
                <h4 className="text-lg font-semibold mb-2" style={{ color: config.primaryColor }}>
                  {feature}
                </h4>
                <p className="text-gray-600 text-sm">
                  Exclusive {feature.toLowerCase()} available for {config.portalName} cardholders
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              className="px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: config.primaryColor }}
            >
              View Offers
            </button>
            <button 
              className="px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: config.secondaryColor }}
            >
              Redeem Rewards
            </button>
            <button className="px-6 py-3 border-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              style={{ 
                borderColor: config.primaryColor,
                color: config.primaryColor 
              }}
            >
              Account Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};