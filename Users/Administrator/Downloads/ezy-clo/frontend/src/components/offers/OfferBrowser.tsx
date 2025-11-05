import React, { useState, useEffect } from 'react';
import { OfferCard } from '../OfferCard';
import { FilterPanel } from '../FilterPanel';
import { LoadingSpinner } from '../LoadingSpinner';
import { SearchIcon } from '../icons/SearchIcon';

interface Offer {
  id: string;
  title: string;
  description: string;
  discountType: string;
  discountValue: number;
  validFrom: string;
  validTo: string;
  redemptionType: string;
  merchantName: string;
  category: string;
  imageUrl?: string;
}

interface OfferBrowserProps {
  userId: string;
}

export const OfferBrowser: React.FC<OfferBrowserProps> = ({ userId }) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDiscountType, setSelectedDiscountType] = useState('all');

  useEffect(() => {
    fetchOffers();
  }, [userId]);

  useEffect(() => {
    filterOffers();
  }, [offers, searchTerm, selectedCategory, selectedDiscountType]);

  const fetchOffers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/offers/eligible/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOffers(data);
      }
    } catch (error) {
      console.error('Failed to fetch offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOffers = () => {
    let filtered = offers;

    if (searchTerm) {
      filtered = filtered.filter(offer =>
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.merchantName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(offer => offer.category === selectedCategory);
    }

    if (selectedDiscountType !== 'all') {
      filtered = filtered.filter(offer => offer.discountType === selectedDiscountType);
    }

    setFilteredOffers(filtered);
  };

  const handleOfferRedeem = async (offerId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/offers/${offerId}/redeem`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      
      if (response.ok) {
        // Refresh offers after redemption
        fetchOffers();
      }
    } catch (error) {
      console.error('Failed to redeem offer:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Available Offers</h1>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search offers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filter Panel */}
        <FilterPanel
          selectedCategory={selectedCategory}
          selectedDiscountType={selectedDiscountType}
          onCategoryChange={setSelectedCategory}
          onDiscountTypeChange={setSelectedDiscountType}
        />
      </div>

      {/* Offers Grid */}
      {filteredOffers.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            {searchTerm || selectedCategory !== 'all' || selectedDiscountType !== 'all'
              ? 'No offers match your current filters.'
              : 'No offers available at the moment.'}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onRedeem={() => handleOfferRedeem(offer.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};