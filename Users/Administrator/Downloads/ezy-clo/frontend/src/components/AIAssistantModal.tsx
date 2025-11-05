
import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Offer } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { LoadingSpinner } from './LoadingSpinner';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableOffers: Offer[];
}

const API_KEY = process.env.API_KEY;

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose, availableOffers }) => {
  const [query, setQuery] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAIResponse = useCallback(async () => {
    if (!query.trim()) {
      setError("Please enter your query.");
      return;
    }
    if (!API_KEY) {
        setError("API Key is not configured. AI Assistant is unavailable.");
        setIsLoading(false);
        return;
    }

    setIsLoading(true);
    setError(null);
    setResponse('');

    const offersString = availableOffers
      .map(offer => `Title: ${offer.title}, Description: ${offer.description}, Category: ${offer.category}, Merchant: ${offer.merchant}`)
      .join('\n');

    const prompt = `You are a helpful assistant for finding card offers. Based on the user's query and the following list of available offers, please suggest up to 3 relevant offers. For each suggestion, provide the offer title and a brief explanation (1-2 sentences) of why it's a good match.

User Query: "${query}"

Available Offers:
${offersString}

If no offers are a good match, you can provide general advice related to the user's query or suggest what kind of offers they might look for. Respond in a friendly and concise manner. Format your response clearly, perhaps using bullet points for each suggested offer.`;

    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17', // Use appropriate model
        contents: prompt,
      });
      
      setResponse(result.text);
    } catch (e: any) {
      console.error("Error calling Gemini API:", e);
      setError(`Failed to get suggestions. ${e.message || 'Please try again later.'}`);
      setResponse('');
    } finally {
      setIsLoading(false);
    }
  }, [query, availableOffers]);

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-[60] transition-opacity duration-300"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-assistant-title"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-slate-200">
          <h2 id="ai-assistant-title" className="text-xl font-semibold text-slate-800 flex items-center">
            <SparklesIcon className="w-6 h-6 mr-2 text-indigo-500" />
            AI Offer Helper
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700" aria-label="Close AI assistant">
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          <p className="text-sm text-slate-600">
            Tell me what you're looking for (e.g., "romantic dinner spots", "family weekend activities", "discounts on electronics"). I'll try to find relevant offers for you!
          </p>
          <div>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Find travel deals for a summer vacation..."
              rows={3}
              className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={getAIResponse}
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : 'Get Suggestions'}
          </button>

          {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
          
          {response && !isLoading && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 max-h-60 overflow-y-auto">
              <h3 className="text-md font-semibold text-slate-700 mb-2">Here are some suggestions:</h3>
              <div className="text-sm text-slate-600 whitespace-pre-wrap prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: response.replace(/\n/g, '<br />') }} />
            </div>
          )}
        </div>
         <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
            <button
                onClick={onClose}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};
