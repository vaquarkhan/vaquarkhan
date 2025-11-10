import React, { useState, useRef, useCallback, useEffect } from 'react';
import Header from '../components/Header';
import { fetchAiSearch } from '../services/geminiService';
import { SearchResult, Recommendation, PartnerMerchant } from '../types';
import { MicrophoneIcon, SearchIcon, LinkIcon, CarIcon, SparklesIcon, ClockIcon, TrashIcon, GlobeAltIcon } from '../components/icons/Icons';
import { useLanguage } from '../contexts/LanguageContext';
import useLocation from '../hooks/useLocation';
import AiLoadingIndicator from '../components/AiLoadingIndicator';
import { partnerMerchants } from '../data/merchants';
import PartnerOffersMap from '../components/PartnerOffersMap';

interface SearchScreenProps {
  onOpenOptionChain: () => void;
}

// Check for SpeechRecognition API
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const isSpeechRecognitionSupported = !!SpeechRecognition;

const RecommendationCard: React.FC<{ recommendation: Recommendation }> = ({ recommendation }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-surface rounded-xl overflow-hidden shadow-lg border border-border/50">
      <img src={recommendation.imageUrl} alt={recommendation.name} className="w-full h-40 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-start">
            <div>
                <h4 className="font-bold text-lg text-text-primary">{recommendation.name}</h4>
                <p className="text-xs text-accent font-semibold">{recommendation.category}</p>
            </div>
            <div className="text-xs bg-accent/20 text-accent font-semibold px-2 py-1 rounded-full flex items-center space-x-1">
                <SparklesIcon className="w-3 h-3"/>
                <span>{t('zaps_recommends')}</span>
            </div>
        </div>
        <p className="text-sm text-text-secondary mt-2 mb-4">{recommendation.description}</p>
        <button className="w-full bg-accent text-accent-foreground font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2">
            <CarIcon className="w-5 h-5" />
            <span>{t('book_chauffeur_to_location')}</span>
        </button>
      </div>
    </div>
  );
};


const SearchScreen: React.FC<SearchScreenProps> = ({ onOpenOptionChain }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const [customLocation, setCustomLocation] = useState('');
  const recognitionRef = useRef<any | null>(null);
  const { language, t } = useLanguage();
  const { location } = useLocation();

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('zapsSearchHistory');
      if (storedHistory) {
        setSearchHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to parse search history from localStorage", e);
    }
  }, []);

  useEffect(() => {
    if (!isSpeechRecognitionSupported) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;
    recognition.onstart = () => { setIsListening(true); setRecognitionError(null); };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setRecognitionError(event.error === 'no-speech' ? t('recognition_error_no_speech_search') : t('recognition_error_other_search'));
      setIsListening(false);
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      handleSearch(transcript);
    };
    recognitionRef.current = recognition;
  }, [t, language]);

  const updateSearchHistory = (newQuery: string) => {
    const updatedHistory = [newQuery, ...searchHistory.filter(h => h !== newQuery)].slice(0, 5);
    setSearchHistory(updatedHistory);
    localStorage.setItem('zapsSearchHistory', JSON.stringify(updatedHistory));
  };
  
  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('zapsSearchHistory');
  };

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError(null);
    setRecognitionError(null);
    setSearchResult(null);
    updateSearchHistory(searchQuery);

    const targetLocation = useCurrentLocation && location ? `near latitude ${location.latitude} and longitude ${location.longitude}` : (customLocation || searchQuery);
    try {
        const response = await fetchAiSearch({
          query: searchQuery,
          locationHint: targetLocation,
          language,
        });
        setSearchResult({
          text: response.summary,
          recommendations: response.recommendations,
          sources: response.sources,
        });
    } catch (err) {
      console.error('Gemini API error:', err);
      setError('An error occurred during the search. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); handleSearch(query); };
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => { setQuery(e.target.value); if (recognitionError) { setRecognitionError(null); } };
  const handleVoiceSearch = () => { recognitionRef.current?.[isListening ? 'stop' : 'start'](); };
  const handleHistoryClick = (histQuery: string) => { setQuery(histQuery); handleSearch(histQuery); };

  return (
    <div className="animate-fade-in h-full flex flex-col">
      <Header title={t('ai_search')} />
      <div className="px-6 pb-4">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <div className="flex items-center justify-between bg-surface-secondary rounded-lg p-2">
            <button
              type="button"
              onClick={() => setUseCurrentLocation(true)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${useCurrentLocation ? 'bg-accent text-accent-foreground' : 'text-text-secondary'}`}
            >
              Current Location
            </button>
            <button
              type="button"
              onClick={() => setUseCurrentLocation(false)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${!useCurrentLocation ? 'bg-accent text-accent-foreground' : 'text-text-secondary'}`}
            >
              Custom Location
            </button>
          </div>
          {!useCurrentLocation && (
            <input
              type="text"
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              placeholder="Enter city or location (e.g., Delhi, Dubai)"
              className="w-full bg-surface-secondary text-text-primary px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent"
            />
          )}
          <div className="relative flex items-center">
            <input type="text" value={query} onChange={handleQueryChange} placeholder={isListening ? t('listening') : t('ask_anything')} className="w-full bg-surface-secondary text-text-primary pl-4 pr-20 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent" />
            <div className="absolute right-2 flex items-center space-x-1">
               {isSpeechRecognitionSupported && (<button type="button" onClick={handleVoiceSearch} className={`p-2 rounded-full transition-colors ${isListening ? 'bg-accent/30 text-accent animate-pulse' : 'text-text-secondary hover:text-accent'}`}><MicrophoneIcon className="w-5 h-5"/></button>)}
              <button type="submit" className="p-2 rounded-full text-text-secondary hover:text-accent transition-colors"><SearchIcon className="w-5 h-5"/></button>
            </div>
          </div>
          {recognitionError && (<p className="text-red-400 text-sm mt-2 text-center animate-fade-in">{recognitionError}</p>)}
        </form>
      </div>

      <div className="flex-1 overflow-y-auto px-6 space-y-6 flex flex-col">
        {isMapVisible ? (
          <PartnerOffersMap merchants={partnerMerchants} onClose={() => setIsMapVisible(false)} />
        ) : (
          <>
            <div className="relative overflow-hidden rounded-2xl cursor-pointer group" onClick={() => setIsMapVisible(true)}>
              <img 
                src="https://images.unsplash.com/photo-1565042852909-5b4733454560?w=800&h=400&fit=crop"
                alt="Partner Offers Map"
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <GlobeAltIcon className="w-16 h-16 text-white mb-3 drop-shadow-2xl" />
                <h3 className="text-white text-2xl font-bold drop-shadow-lg">Partner Offers Map</h3>
                <p className="text-white/90 text-sm mt-1">Discover exclusive deals near you</p>
              </div>
            </div>

            <div
              className="relative overflow-hidden rounded-2xl cursor-pointer group border border-purple-500/40 bg-gradient-to-r from-purple-900/70 via-black/40 to-purple-800/40"
              onClick={onOpenOptionChain}
            >
              <div className="absolute inset-0 opacity-40">
                <img
                  src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=900&h=500&fit=crop"
                  alt="Option Chain"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="relative p-6 space-y-3">
                <div className="inline-flex items-center space-x-2 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-400/60">
                  <SparklesIcon className="w-4 h-4 text-purple-200" />
                  <span className="text-xs font-semibold text-purple-100 tracking-wide uppercase">New</span>
                </div>
                <h3 className="text-white text-2xl font-bold drop-shadow-sm">Zaps Option Chain</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Track real-time call & put greeks, get ATM highlights, and monitor liquidity across NSE & BSE contracts.
                </p>
                <div className="flex items-center justify-between text-purple-200 text-xs uppercase tracking-widest">
                  <span>Live Market Data</span>
                  <span>Tap to launch</span>
                </div>
              </div>
            </div>

            {isSearching && <div className="py-10"><AiLoadingIndicator /></div>}
            {error && <p className="text-red-400 text-center py-4">{error}</p>}
            
            {searchResult && (
              <div className="animate-fade-in space-y-6">
                <article className="prose prose-invert prose-p:text-text-primary/90 prose-headings:text-text-primary"><p>{searchResult.text}</p></article>
                <div className="space-y-4">{searchResult.recommendations?.map((rec, index) => (<RecommendationCard key={index} recommendation={rec} />))}</div>
                {searchResult.sources.length > 0 && (
                  <div>
                    <h3 className="text-md font-semibold text-accent mb-3">{t('sources')}</h3>
                    <ul className="space-y-2">{searchResult.sources.map((source, index) => (<li key={index} className="bg-surface p-3 rounded-lg"><a href={source.uri} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-sm text-text-primary hover:text-accent transition-colors"><LinkIcon className="w-4 h-4 flex-shrink-0" /><span className="truncate">{source.title}</span></a></li>))}</ul>
                  </div>
                )}
              </div>
            )}
            {!isSearching && !searchResult && !error && (
                searchHistory.length > 0 ? (
                  <div className="animate-fade-in">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-md font-semibold text-accent">{t('recent_searches')}</h3>
                      <button onClick={clearSearchHistory} className="text-xs text-text-secondary hover:text-red-400 flex items-center space-x-1"><TrashIcon className="w-4 h-4" /><span>{t('clear')}</span></button>
                    </div>
                    <ul className="space-y-2">
                      {searchHistory.map((hist, index) => (
                        <li key={index}>
                          <button onClick={() => handleHistoryClick(hist)} className="w-full text-left bg-surface p-3 rounded-lg flex items-center space-x-3 hover:bg-surface-secondary transition-colors"><ClockIcon className="w-4 h-4 text-text-secondary flex-shrink-0" /><span className="text-text-primary truncate">{hist}</span></button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                <div className="text-center pt-16"><SearchIcon className="w-16 h-16 mx-auto text-surface-secondary"/><h2 className="mt-4 text-xl font-semibold text-text-primary">Your AI Assistant</h2><p className="mt-2 text-text-secondary">Find information, get recommendations, or ask complex questions.</p></div>
                )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchScreen;