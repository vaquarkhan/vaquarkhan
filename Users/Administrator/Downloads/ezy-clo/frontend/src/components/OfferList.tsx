
import React from 'react';
import { Offer } from '../types';
import { OfferCard } from './OfferCard';

interface OfferListProps {
  offers: Offer[];
  onSelectOffer: (offer: Offer) => void;
}

export const OfferList: React.FC<OfferListProps> = ({ offers, onSelectOffer }) => {
  if (offers.length === 0) {
    return <div className="text-center py-10 text-slate-600 text-lg bg-white rounded-lg shadow p-8">No offers match your current criteria. Try adjusting your filters!</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {offers.map(offer => (
        <OfferCard key={offer.id} offer={offer} onSelectOffer={onSelectOffer} />
      ))}
    </div>
  );
};
