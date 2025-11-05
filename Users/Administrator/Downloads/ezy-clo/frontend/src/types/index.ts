export enum OfferType {
  MASTERCARD_FUNDED = "Mastercard-Funded",
  ISSUER_FUNDED = "Issuer-Funded",
  ZAPS_OFFER = "ZAPS Offer",
}

export enum OfferCategory {
  DINING = "Dining",
  TRAVEL = "Travel",
  SHOPPING = "Shopping",
  ENTERTAINMENT = "Entertainment",
  LIFESTYLE = "Lifestyle",
  SERVICES = "Services"
}

export interface Offer {
  id: string;
  title: string;
  merchant: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  type: OfferType;
  category: OfferCategory;
  promoCode?: string;
  websiteUrl?: string;
  qrCodeValue?: string; 
  termsAndConditions: string;
  validUntil: string; 
  applicableToCardTiers?: string[];
  isFeatured?: boolean;
  discountValue?: string;
  location?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  cardTier: string;
  customerId: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: 'en' | 'ar';
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  categories: OfferCategory[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface SpendData {
  currentSpend: number;
  threshold: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  progress: number;
  nextReward?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}