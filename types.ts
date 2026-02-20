
export enum ServiceCategory {
  HAIR = 'Cabelo',
  NAILS = 'Unhas',
  BODY = 'Corpo',
  FACE = 'Rosto',
}

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  duration: string;
  price: number;
  description: string;
  imageUrl?: string; 
  gallery?: string[]; 
}

export interface BusinessHours {
  days: string[];
  start: string;
  end: string;
  breakStart: string;
  breakEnd: string;
}

export interface SalonConfig {
  pointsPerService: number;
  pointsTarget: number;
  pixPrepayment: boolean;
  pixName: string;
  pixKey: string;
  businessHours: BusinessHours;
  dynamicText: {
    heroTitle: string;
    heroSubtitle: string;
    studioDescription: string;
    protocolSectionTitle: string;
  };
}

export interface ChatMessage {
  id: string;
  userId: string;
  sender: 'client' | 'admin';
  text: string;
  timestamp: Date;
  read: boolean;
}

export interface Voucher {
  id: string;
  name: string;
  description: string;
  limit: number;
  redeemed: number;
  serviceId?: string; // Added for direct scheduling
  price?: number; // Added to show the special price
  expiryDate?: string; // Added for expiration indicator
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: Date;
  read: boolean;
  type: 'promo' | 'schedule' | 'news';
}

export interface Appointment {
  id: string;
  serviceId: string;
  clientName: string;
  clientPhone: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'request_cancellation' | 'completed';
  paymentStatus: 'unpaid' | 'waiting_verification' | 'paid';
  createdAt: string;
  // Added rating property for feedback system
  rating?: number;
}

export interface AccessibilityConfig {
  darkMode: boolean;
  highContrast: boolean;
  fontSize: number;
  readAloud: boolean;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  birthDate: string;
  createdAt: string;
  points: {
    escovas: number;
    manicurePedicure: number;
    ciliosManutencao: number;
  };
  // Added rewards property for loyalty program
  rewards: string[];
}
