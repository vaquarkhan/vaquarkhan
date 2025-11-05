
import React from 'react';
import { Offer, OfferType, OfferCategory } from '../types';
import { TagIcon } from './icons/TagIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { CalendarIcon } from './icons/CalendarIcon';


const getOfferTypeColor = (type: OfferType): string => {
  switch (type) {
    case OfferType.MASTERCARD_FUNDED:
      return 'bg-red-500 text-white';
    case OfferType.ISSUER_FUNDED:
      return 'bg-blue-500 text-white';
    case OfferType.ZAPS_OFFER:
      return 'bg-green-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const getCategoryIcon = (category: OfferCategory): React.ReactNode => {
  // In a real app, you'd use specific icons
  // For now, we use a generic tag icon
  return <TagIcon className="w-4 h-4 mr-1" />;
};


export const OfferCard: React.FC<{ offer: Offer; onSelectOffer: (offer: Offer) => void }> = ({ offer, onSelectOffer }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer flex flex-col h-full"
      onClick={() => onSelectOffer(offer)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onSelectOffer(offer)}
      aria-label={`View details for ${offer.title}`}
    >
      <div className="relative">
        <img src={offer.imageUrl} alt={offer.title} className="w-full h-48 object-cover" />
        {offer.isFeatured && (
          <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded">
            Featured
          </span>
        )}
         <div className={`absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded-full ${getOfferTypeColor(offer.type)}`}>
          {offer.type}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-slate-800 mb-2 truncate" title={offer.title}>{offer.title}</h3>
        <p className="text-sm text-slate-600 mb-1">
          <span className="font-medium">Merchant:</span> {offer.merchant}
        </p>
        {offer.discountValue && (
            <p className="text-lg font-bold text-green-600 mb-2">{offer.discountValue}</p>
        )}
        <p className="text-sm text-slate-600 mb-3 flex-grow leading-relaxed">{offer.description}</p>

        <div className="mt-auto space-y-2 text-xs text-slate-500">
           <div className="flex items-center">
             {getCategoryIcon(offer.category)}
             <span>{offer.category}</span>
           </div>
           {offer.location && (
            <div className="flex items-center">
              <MapPinIcon className="w-4 h-4 mr-1" />
              <span>{offer.location}</span>
            </div>
           )}
           <div className="flex items-center">
             <CalendarIcon className="w-4 h-4 mr-1" />
             <span>Valid until: {new Date(offer.validUntil).toLocaleDateString()}</span>
           </div>
        </div>
      </div>
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-200">
        <button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
          onClick={(e) => { e.stopPropagation(); onSelectOffer(offer); }}
        >
          View Details
        </button>
      </div>
    </div>
  );
};
