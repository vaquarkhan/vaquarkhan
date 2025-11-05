import React from 'react';
import { CalendarIcon, ClipboardIcon } from '../icons';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  merchant: string;
  category: string;
  expiryDate: string;
  redemptionType: 'online' | 'offline';
  isEligible: boolean;
  imageUrl?: string;
}

interface OfferCardProps {
  offer: Offer;
  onRedeem: (offerId: string) => void;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer, onRedeem }) => {
  const handleRedeem = () => {
    if (offer.isEligible) {
      onRedeem(offer.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Offer Image */}
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        {offer.imageUrl ? (
          <img
            src={offer.imageUrl}
            alt={offer.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-white text-2xl font-bold">{offer.discount}</span>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-white bg-opacity-90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
            {offer.category}
          </span>
        </div>

        {/* Eligibility Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            offer.isEligible 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {offer.isEligible ? 'Eligible' : 'Locked'}
          </span>
        </div>
      </div>

      {/* Offer Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{offer.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{offer.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span className="font-medium">{offer.merchant}</span>
        </div>

        {/* Expiry Date */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <CalendarIcon className="w-4 h-4 mr-2" />
          <span>Expires: {new Date(offer.expiryDate).toLocaleDateString()}</span>
        </div>

        {/* Redeem Button */}
        <button
          onClick={handleRedeem}
          disabled={!offer.isEligible}
          className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
            offer.isEligible
              ? 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {offer.isEligible ? (
            <div className="flex items-center justify-center">
              <ClipboardIcon className="w-4 h-4 mr-2" />
              Redeem Offer
            </div>
          ) : (
            'Complete spending requirement'
          )}
        </button>
      </div>
    </div>
  );
};