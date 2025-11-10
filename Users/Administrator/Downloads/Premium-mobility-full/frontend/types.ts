// FIX: Add import for React to resolve namespace error
import React from 'react';

export enum Page {
  Home = 'Home',
  Bookings = 'Bookings',
  Search = 'Search',
  Checklist = 'Checklist',
  Concierge = 'Concierge',
  Profile = 'Profile',
}

export interface FlightDetails {
  flightNumber: string;
  originAirport: string;
  destinationAirport: string;
  status: 'On Time' | 'Delayed' | 'Landed';
  progress: number; // A value from 0 to 100
}

export interface WeatherData {
  locationName?: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  condition: string;
  description?: string;
  iconUrl?: string;
  windSpeed?: number;
}

export interface Booking {
  id: number;
  service: string;
  details: string;
  date: string;
  status: 'Confirmed' | 'Completed' | 'Pending';
  mapUrl?: string;
  origin?: { lat: number; lng: number; };
  destination?: { lat: number; lng: number; };
  originAddress?: string;
  destinationAddress?: string;
  backgroundImage?: string;
  chauffeur?: {
    id: string;
    name: string;
    image: string;
  };
  feedbackGiven?: boolean;
  flightDetails?: FlightDetails;
}

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  sentiment?: 'urgent' | 'stressed' | 'neutral';
}

export type Theme = 'dark' | 'light' | 'wonder';

// Add minimal interfaces for Google Places API to avoid namespace errors.
export interface GooglePlaceResult {
  formatted_address?: string;
  geometry?: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
  name?: string;
}

export interface GoogleAutocomplete {
  getPlace: () => GooglePlaceResult;
  addListener: (eventName: string, handler: () => void) => any;
}

// New type for a cleaner data structure from AddressInput
export interface PlaceDetails {
  address: string;
  lat: number;
  lng: number;
}


// Interfaces for AI Search Results
export interface GroundingChunk {
  uri: string;
  title: string;
}

export interface Recommendation {
  name:string;
  category: string;
  description: string;
  imageUrl: string;
}

export interface SearchResult {
  text: string;
  sources: GroundingChunk[];
  recommendations?: Recommendation[];
}


// FR-605: Digital Identity Vault (SSI)
export interface VerifiableCredential {
  id: string;
  type: 'Passport' | 'VIP Membership' | 'Boarding Pass';
  issuer: string;
  issuedDate: string;
  expiryDate?: string;
  details: Record<string, string>;
}

// FR-602: Payment Token Vault Interface
export interface PaymentMethod {
  id: string;
  type: 'Visa' | 'Mastercard' | 'Amex';
  last4: string;
  expiry: string;
  isDefault: boolean;
}

// Type for the new "Living Itinerary" Home Screen
export type TimelineItemType = 'agenda' | 'ai_insight' | 'travel' | 'opportunity';
export interface TimelineItem {
  id: number;
  time: string;
  type: TimelineItemType;
  title: string;
  description: string;
  icon: React.ElementType;
  cta?: {
    label: string;
    action: () => void;
  };
}

// New Interfaces for AI Trip Planner
export type ItineraryActivityType = 'Dining' | 'Activity' | 'Travel' | 'Accommodation';

export interface ItineraryActivity {
  time: string;
  type: ItineraryActivityType;
  description: string;
  bookingSuggestion?: string; // e.g., "Book a ZAPS Chauffeur"
}

export interface ItineraryDay {
  day: number;
  theme: string;
  activities: ItineraryActivity[];
}

export interface Itinerary {
  destination: string;
  duration: number;
  days: ItineraryDay[];
}

export interface PartnerMerchant {
  id: string;
  name: string;
  category: string;
  offer: string;
  location: {
    lat: number;
    lng: number;
  };
  backgroundImage: string;
}

// Membership Tier System
export type MembershipTier = 'Base' | 'Silver' | 'Gold' | 'Platinum';

export interface MembershipStatus {
  tier: MembershipTier;
  points: number;
  pointsToNextTier: number;
  multiplier: number;
  benefits: string[];
  pointsExpiry?: string;
}

// Subscription
export interface Subscription {
  isActive: boolean;
  plan: 'ZAPSPlus' | null;
  price: number;
  benefits: string[];
  renewalDate?: string;
}

// Fast Track Service
export interface FastTrackBooking {
  id: string;
  airport: string;
  date: string;
  services: ('check-in' | 'security' | 'boarding')[];
  price: number;
  status: 'Confirmed' | 'Pending' | 'Used';
}
