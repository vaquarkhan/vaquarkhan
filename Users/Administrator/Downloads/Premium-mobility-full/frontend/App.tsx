
import React, { useState, useCallback, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import BookingsScreen from './screens/BookingsScreen';
import ConciergeScreen from './screens/ConciergeScreen';
import ProfileScreen from './screens/ProfileScreen';
import TravelChecklistScreen from './screens/TravelChecklistScreen';
import SearchScreen from './screens/SearchScreen';
import LoginScreen from './screens/LoginScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import AdminLogin from './screens/AdminLogin';
import AdminDashboard from './screens/AdminDashboard';
import LocationOfferModal from './components/LocationOfferModal';
import BookingForm from './components/BookingForm';
import useLocation from './hooks/useLocation';
import { Page, Booking, PartnerMerchant } from './types';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { partnerMerchants } from './data/merchants';
import QuickActions from './components/QuickActions';
import EmergencyPanel from './components/EmergencyPanel';
import analytics from './utils/analytics';
import { parseDeepLink } from './utils/deepLinking';
import OptionChainScreen from './screens/OptionChainScreen';

const AppContent: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activePage, setActivePage] = useState<Page>(Page.Home);
  const [isOfferModalVisible, setIsOfferModalVisible] = useState(false);
  const [offerShown, setOfferShown] = useState(false);
  const [nearbyMerchant, setNearbyMerchant] = useState<PartnerMerchant | null>(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showOptionChain, setShowOptionChain] = useState(false);
  const { location } = useLocation();

  // Track page views
  useEffect(() => {
    analytics.trackPageView(Page[activePage]);
  }, [activePage]);

  // Handle deep links
  useEffect(() => {
    const deepLink = parseDeepLink(window.location.href);
    if (deepLink?.type === 'booking' && deepLink.id) {
      analytics.trackFeatureUsage('deep_link_booking');
    } else if (deepLink?.type === 'referral' && deepLink.id) {
      analytics.trackFeatureUsage('deep_link_referral');
    }
  }, []);

  // --- Centralized Booking Form State ---
  const [isFormVisible, setIsFormVisible] = useState(false);
  // FIX: Changed state to allow partial booking data for new booking requests.
  const [bookingToEdit, setBookingToEdit] = useState<Partial<Booking> | null>(null);

  const handleRequestBooking = (initialData?: Partial<Booking>) => {
    analytics.trackBooking(initialData?.service || 'New Booking');
    setBookingToEdit(initialData || null);
    setIsFormVisible(true);
  };
  
  const handleCloseForm = () => {
    setIsFormVisible(false);
    setBookingToEdit(null);
  };
  // --- End of Centralized State ---

  const handleOpenOptionChain = useCallback(() => {
    analytics.trackFeatureUsage('option_chain_opened');
    setShowOptionChain(true);
  }, []);

  useEffect(() => {
    // Proactive merchant offer logic
    if (location && !offerShown) {
      const foundMerchant = partnerMerchants.find(merchant => {
        const latDistance = Math.abs(location.latitude - merchant.location.lat);
        const lngDistance = Math.abs(location.longitude - merchant.location.lng);
        // If user is within a small radius of the location (approx 500m)
        return latDistance < 0.005 && lngDistance < 0.005;
      });

      if (foundMerchant) {
        setNearbyMerchant(foundMerchant);
        setOfferShown(true); // Mark that an offer has been found this session
      }
    }
  }, [location, offerShown]);

  const renderPage = useCallback(() => {
    const homeScreenProps = {
      onRequestBooking: handleRequestBooking,
      onViewOffer: () => setIsOfferModalVisible(true),
      nearbyMerchant: nearbyMerchant,
    };
    switch (activePage) {
      case Page.Home:
        return <HomeScreen {...homeScreenProps} />;
      case Page.Bookings:
        return <BookingsScreen onRequestBooking={handleRequestBooking} />;
      case Page.Search:
        return <SearchScreen onOpenOptionChain={handleOpenOptionChain} />;
      case Page.Checklist:
        return <TravelChecklistScreen />;
      case Page.Concierge:
        return <ConciergeScreen onRequestBooking={handleRequestBooking} />;
      case Page.Profile:
        return <ProfileScreen onLogout={onLogout} />;
      default:
        return <HomeScreen {...homeScreenProps} />;
    }
  }, [activePage, onLogout, nearbyMerchant]);

  return (
    <>
      <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white font-sans flex flex-col max-w-md mx-auto shadow-2xl">
        <main className="flex-1 overflow-y-auto pb-20">
          {renderPage()}
        </main>
        <BottomNav activePage={activePage} setActivePage={setActivePage} />
      </div>

      <LocationOfferModal
        isOpen={isOfferModalVisible}
        onClose={() => setIsOfferModalVisible(false)}
        merchant={nearbyMerchant}
      />
      
      {/* Render BookingForm centrally */}
      <BookingForm
        isOpen={isFormVisible}
        onClose={handleCloseForm}
        bookingToEdit={bookingToEdit}
      />
      
      <QuickActions 
        onBookNow={() => handleRequestBooking()}
        onCallChauffeur={() => window.open('tel:+971501234567')}
        onEmergency={() => setShowEmergency(true)}
      />
      
      <EmergencyPanel isOpen={showEmergency} onClose={() => setShowEmergency(false)} />
      <OptionChainScreen isOpen={showOptionChain} onClose={() => setShowOptionChain(false)} />
    </>
  );
};

const App: React.FC = () => {
  // If user navigates to /admin or /admin/* render admin UI
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  if (path.startsWith('/admin')) {
    // simple routing: /admin -> login, /admin/dashboard -> dashboard
    if (path === '/admin' || path === '/admin/login') return <AdminLogin />;
    if (path === '/admin/dashboard') return <AdminDashboard />;
    return <AdminLogin />;
  }
  const [showWelcome, setShowWelcome] = useState(!localStorage.getItem('welcomeShown'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleWelcomeComplete = () => {
    localStorage.setItem('welcomeShown', 'true');
    setShowWelcome(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        {isAuthenticated ? <AppContent onLogout={handleLogout} /> : <LoginScreen onLogin={handleLogin} />}
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
