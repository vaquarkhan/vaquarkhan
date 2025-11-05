import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from '../LoadingSpinner';

interface Offer {
  id: string;
  title: string;
  description: string;
  discountType: string;
  discountValue: number;
  validFrom: string;
  validTo: string;
  status: string;
  merchantName: string;
  category: string;
}

export const OfferManagement: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admin/offers', {
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

  const handleCreateOffer = async (offerData: Partial<Offer>) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admin/offers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(offerData)
      });
      
      if (response.ok) {
        fetchOffers();
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Failed to create offer:', error);
    }
  };

  const handleUpdateOffer = async (offerId: string, offerData: Partial<Offer>) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/admin/offers/${offerId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(offerData)
      });
      
      if (response.ok) {
        fetchOffers();
        setEditingOffer(null);
      }
    } catch (error) {
      console.error('Failed to update offer:', error);
    }
  };

  const handleDeleteOffer = async (offerId: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/admin/offers/${offerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        fetchOffers();
      }
    } catch (error) {
      console.error('Failed to delete offer:', error);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Offer Management</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create New Offer
        </button>
      </div>

      {/* Offers Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {offers.map((offer) => (
            <li key={offer.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{offer.title}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      offer.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      offer.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {offer.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{offer.description}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span className="mr-4">
                      {offer.discountType}: {offer.discountValue}
                      {offer.discountType === 'PERCENTAGE' ? '%' : ' AED'}
                    </span>
                    <span className="mr-4">Category: {offer.category}</span>
                    <span>Valid: {new Date(offer.validFrom).toLocaleDateString()} - {new Date(offer.validTo).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => setEditingOffer(offer)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteOffer(offer.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Create/Edit Form Modal */}
      {(showCreateForm || editingOffer) && (
        <OfferForm
          offer={editingOffer}
          onSave={editingOffer ? 
            (data) => handleUpdateOffer(editingOffer.id, data) : 
            handleCreateOffer
          }
          onCancel={() => {
            setShowCreateForm(false);
            setEditingOffer(null);
          }}
        />
      )}
    </div>
  );
};

interface OfferFormProps {
  offer?: Offer | null;
  onSave: (data: Partial<Offer>) => void;
  onCancel: () => void;
}

const OfferForm: React.FC<OfferFormProps> = ({ offer, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: offer?.title || '',
    description: offer?.description || '',
    discountType: offer?.discountType || 'PERCENTAGE',
    discountValue: offer?.discountValue || 0,
    validFrom: offer?.validFrom || '',
    validTo: offer?.validTo || '',
    merchantName: offer?.merchantName || '',
    category: offer?.category || 'DINING'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {offer ? 'Edit Offer' : 'Create New Offer'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Discount Type</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED_AMOUNT">Fixed Amount</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Discount Value</label>
              <input
                type="number"
                value={formData.discountValue}
                onChange={(e) => setFormData({...formData, discountValue: Number(e.target.value)})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {offer ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};