import { Offer, OfferCategory, OfferType } from '../types';

export const ALL_CARD_TIERS: string[] = ["All", "World Premier", "Platinum", "Gold", "Standard"];
export const DEFAULT_CARD_TIER: string = "World Premier";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  OFFERS: '/offers',
  PROFILE: '/profile',
  ADMIN: '/admin',
  LOGIN: '/login',
} as const;

export const MOCK_OFFERS: Offer[] = [
  {
    id: '1',
    title: '25% Off at Gourmet Burger Kitchen',
    merchant: 'Gourmet Burger Kitchen',
    description: 'Enjoy a delicious 25% discount on your total bill. Valid for dine-in and takeaway.',
    longDescription: 'Indulge in premium burgers, fries, and shakes at Gourmet Burger Kitchen. This offer gives you a 25% discount on your entire order. Perfect for a meal with family or friends. Show your eligible card to redeem.',
    imageUrl: 'https://picsum.photos/seed/burger/400/300',
    type: OfferType.ISSUER_FUNDED,
    category: OfferCategory.DINING,
    promoCode: 'GBKMASTERCARD25',
    termsAndConditions: 'Offer valid until end of year. Not valid with other promotions. Minimum spend SAR 100.',
    validUntil: '2025-12-31',
    applicableToCardTiers: ['World Premier', 'Platinum'],
    isFeatured: true,
    discountValue: "25% OFF",
    location: "All KSA Branches"
  },
  {
    id: '2',
    title: 'Free Coffee at The Coffee Bean',
    merchant: 'The Coffee Bean & Tea Leaf',
    description: 'Get a free regular-sized coffee with any purchase over SAR 50.',
    longDescription: 'Start your day right or take a refreshing break with a complimentary regular-sized coffee from The Coffee Bean & Tea Leaf when you spend SAR 50 or more. Choose from a variety of their signature blends.',
    imageUrl: 'https://picsum.photos/seed/coffee/400/300',
    type: OfferType.MASTERCARD_FUNDED,
    category: OfferCategory.DINING,
    websiteUrl: 'https://www.coffeebean.com/ksa',
    termsAndConditions: 'Valid for one free regular coffee per transaction. Cannot be combined with other offers.',
    validUntil: '2025-06-30',
    applicableToCardTiers: ['Platinum', 'Gold', 'Standard'],
    discountValue: "Free Coffee",
    location: "Selected KSA Branches"
  },
  {
    id: '3',
    title: '15% Off Booking.com Stays',
    merchant: 'Booking.com',
    description: 'Save 15% on hotel stays worldwide when booked through the dedicated Mastercard link.',
    longDescription: 'Plan your next getaway and save 15% on accommodations when you book through the special Mastercard portal on Booking.com. Explore thousands of hotels, resorts, and apartments globally.',
    imageUrl: 'https://picsum.photos/seed/travel/400/300',
    type: OfferType.MASTERCARD_FUNDED,
    category: OfferCategory.TRAVEL,
    websiteUrl: 'https://www.booking.com/mastercarddeals',
    termsAndConditions: 'Discount applies to selected properties. Booking must be made via the specified link. Subject to availability.',
    validUntil: '2025-12-31',
    applicableToCardTiers: ['World Premier', 'Platinum', 'Gold'],
    isFeatured: true,
    discountValue: "15% OFF",
    location: "Online Worldwide"
  },
  {
    id: '4',
    title: 'Airport Transfer Service by ZAPS',
    merchant: 'ZAPS Premium Services',
    description: 'Complimentary one-way airport transfer in Riyadh or Jeddah.',
    longDescription: 'Travel in comfort with a complimentary one-way airport transfer service provided by ZAPS. Available for rides to or from King Khalid International Airport (Riyadh) or King Abdulaziz International Airport (Jeddah). Booking required.',
    imageUrl: 'https://picsum.photos/seed/airport/400/300',
    type: OfferType.ZAPS_OFFER,
    category: OfferCategory.SERVICES,
    qrCodeValue: 'ZAPS-AIRPORT-TRANSFER-WP',
    termsAndConditions: 'Advance booking of 48 hours required. Subject to vehicle availability. Valid for World Premier cardholders only.',
    validUntil: '2025-09-30',
    applicableToCardTiers: ['World Premier'],
    discountValue: "Free Transfer",
    location: "Riyadh & Jeddah Airports"
  },
  {
    id: '5',
    title: 'SAR 50 Off Noon Express',
    merchant: 'Noon',
    description: 'Get SAR 50 off your next order of SAR 250 or more on Noon Express items.',
    longDescription: 'Shop for electronics, fashion, home goods, and more on Noon. Use this offer to get SAR 50 off when you spend SAR 250 or more on items fulfilled by Noon Express. Fast delivery to your doorstep.',
    imageUrl: 'https://picsum.photos/seed/noon/400/300',
    type: OfferType.ISSUER_FUNDED,
    category: OfferCategory.SHOPPING,
    promoCode: 'NOONBANK50',
    termsAndConditions: 'Valid for Noon Express items only. One-time use per customer. Minimum spend SAR 250.',
    validUntil: '2025-07-31',
    applicableToCardTiers: ['Gold', 'Standard'],
    discountValue: "SAR 50 OFF",
    location: "Online KSA"
  },
  {
    id: '6',
    title: 'Buy 1 Get 1 Free - VOX Cinemas',
    merchant: 'VOX Cinemas',
    description: 'Enjoy a movie with a friend! Buy one standard ticket and get another one free.',
    longDescription: 'Experience the latest blockbusters at VOX Cinemas. With this offer, purchase one standard movie ticket and receive a second one absolutely free. Perfect for a movie night out. Offer redeemable at the counter.',
    imageUrl: 'https://picsum.photos/seed/cinema/400/300',
    type: OfferType.MASTERCARD_FUNDED,
    category: OfferCategory.ENTERTAINMENT,
    qrCodeValue: 'VOX-BOGO-MC',
    termsAndConditions: 'Valid for standard 2D movie screenings. Not valid on VIP, IMAX, or 3D. Subject to seat availability. Valid on weekdays.',
    validUntil: '2025-11-30',
    applicableToCardTiers: ['World Premier', 'Platinum', 'Gold', 'Standard'],
    isFeatured: true,
    discountValue: "BOGO Tickets",
    location: "All KSA VOX Cinemas"
  },
  {
    id: '7',
    title: 'Valet Parking by ZAPS - Mall of Arabia',
    merchant: 'ZAPS Valet Services',
    description: 'Two complimentary valet parking services per month at Mall of Arabia.',
    longDescription: 'Enjoy convenient parking with two free valet services each month at Mall of Arabia. Simply present your eligible ZAPS card to the valet attendant. Hassle-free shopping experience.',
    imageUrl: 'https://picsum.photos/seed/valet/400/300',
    type: OfferType.ZAPS_OFFER,
    category: OfferCategory.SERVICES,
    termsAndConditions: 'Valid for eligible cardholders. Max two services per calendar month. Subject to valet availability.',
    validUntil: '2025-12-31',
    applicableToCardTiers: ['World Premier'],
    discountValue: "Free Valet",
    location: "Mall of Arabia"
  },
   {
    id: '8',
    title: '20% off Fitness First Membership',
    merchant: 'Fitness First',
    description: 'Get 20% off on annual Platinum memberships.',
    longDescription: 'Kickstart your fitness journey with a 20% discount on annual Platinum memberships at Fitness First. Access state-of-the-art equipment, group classes, and expert trainers.',
    imageUrl: 'https://picsum.photos/seed/fitness/400/300',
    type: OfferType.ISSUER_FUNDED,
    category: OfferCategory.LIFESTYLE,
    websiteUrl: 'https://ksa.fitnessfirstme.com/',
    termsAndConditions: 'Offer valid for new memberships only. Cannot be combined with other promotions.',
    validUntil: '2025-10-31',
    applicableToCardTiers: ['World Premier', 'Platinum'],
    discountValue: "20% OFF Membership",
    location: "All KSA Fitness First"
  }
];