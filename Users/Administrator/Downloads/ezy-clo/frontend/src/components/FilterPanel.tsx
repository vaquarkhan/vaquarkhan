
import React from 'react';
import { OfferCategory, OfferType } from '../types';
import { SearchIcon } from './icons/SearchIcon';

interface FilterPanelProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: OfferCategory | 'All';
  setSelectedCategory: (category: OfferCategory | 'All') => void;
  selectedOfferType: OfferType | 'All';
  setSelectedOfferType: (type: OfferType | 'All') => void;
  selectedCardTier: string;
  setSelectedCardTier: (tier: string) => void;
  cardTiers: string[];
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedOfferType,
  setSelectedOfferType,
  selectedCardTier,
  setSelectedCardTier,
  cardTiers
}) => {
  const categoryOptions = ['All', ...Object.values(OfferCategory)];
  const offerTypeOptions = ['All', ...Object.values(OfferType)];

  return (
    <div className="mb-8 p-6 bg-white rounded-xl shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Search Input */}
        <div className="lg:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-1">
            Search Offers
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, merchant, or keyword..."
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
            />
          </div>
        </div>

        {/* Card Tier Select */}
        <div>
          <label htmlFor="cardTier" className="block text-sm font-medium text-slate-700 mb-1">
            Card Type
          </label>
          <select
            id="cardTier"
            value={selectedCardTier}
            onChange={(e) => setSelectedCardTier(e.target.value)}
            className="block w-full py-2.5 px-3 border border-slate-300 bg-white rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
          >
            {cardTiers.map(tier => (
              <option key={tier} value={tier}>{tier === 'All' ? 'All Card Types' : tier}</option>
            ))}
          </select>
        </div>
        
        {/* Spacer for alignment on smaller screens or more filters can go here */}
        <div> {/* This div is for layout consistency with other filters */}
            {/* Future filters can be added here or this acts as a spacer */}
        </div>


        {/* Category Select */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as OfferCategory | 'All')}
            className="block w-full py-2.5 px-3 border border-slate-300 bg-white rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
          >
            {categoryOptions.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Offer Type Select */}
        <div>
          <label htmlFor="offerType" className="block text-sm font-medium text-slate-700 mb-1">
            Offer Type
          </label>
          <select
            id="offerType"
            value={selectedOfferType}
            onChange={(e) => setSelectedOfferType(e.target.value as OfferType | 'All')}
            className="block w-full py-2.5 px-3 border border-slate-300 bg-white rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
          >
            {offerTypeOptions.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
