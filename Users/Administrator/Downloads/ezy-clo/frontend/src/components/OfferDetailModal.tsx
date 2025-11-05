
import React from 'react';
import { Offer } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { LinkIcon } from './icons/LinkIcon';
import { QrCodeIcon } from './icons/QrCodeIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';

export const OfferDetailModal: React.FC<{ offer: Offer; isOpen: boolean; onClose: () => void }> = ({ offer, isOpen, onClose }) => {
  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Promo code copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="offer-detail-title"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="relative">
          <img src={offer.imageUrl} alt={offer.title} className="w-full h-64 object-cover" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-slate-700 bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-colors"
            aria-label="Close offer details"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto">
          <h2 id="offer-detail-title" className="text-3xl font-bold text-slate-800 mb-3">{offer.title}</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">{offer.category}</span>
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">{offer.type}</span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">Merchant: {offer.merchant}</span>
          </div>

          {offer.discountValue && (
             <p className="text-2xl font-bold text-green-600 mb-4">{offer.discountValue}</p>
          )}

          <p className="text-slate-600 mb-6 leading-relaxed">{offer.longDescription}</p>

          {offer.promoCode && (
            <div className="mb-4 p-3 bg-slate-100 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-sm text-slate-500 block">Promo Code:</span>
                <strong className="text-lg text-indigo-600">{offer.promoCode}</strong>
              </div>
              <button 
                onClick={() => copyToClipboard(offer.promoCode!)}
                className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-md transition-colors text-sm flex items-center"
                aria-label="Copy promo code"
              >
                <ClipboardIcon className="w-4 h-4 mr-1" /> Copy
              </button>
            </div>
          )}

          {offer.websiteUrl && (
            <a
              href={offer.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mb-4 text-center"
            >
              <LinkIcon className="w-5 h-5 mr-2" />
              Visit Offer Website
            </a>
          )}
          
          {offer.qrCodeValue && (
            <div className="mb-4 p-4 bg-slate-100 rounded-lg text-center">
               <p className="text-sm text-slate-500 mb-2">Scan QR Code or show this in-store:</p>
               <div className="flex justify-center items-center text-indigo-600">
                <QrCodeIcon className="w-8 h-8 mr-2" /> 
                <span className="text-lg font-semibold">{offer.qrCodeValue}</span>
               </div>
               <p className="text-xs text-slate-400 mt-1">(Actual QR code would be displayed here)</p>
            </div>
          )}
          
          <div className="mt-6 border-t pt-6">
            <h4 className="text-lg font-semibold text-slate-700 mb-2">Terms & Conditions</h4>
            <p className="text-sm text-slate-500 whitespace-pre-line mb-2">{offer.termsAndConditions}</p>
            <p className="text-sm text-slate-500"><span className="font-medium">Valid Until:</span> {new Date(offer.validUntil).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
        <div className="p-6 bg-slate-50 border-t border-slate-200">
            <button
                onClick={onClose}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};
