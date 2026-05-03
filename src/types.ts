/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum TastePreference {
  SPICY = 'spicy',
  MILD = 'mild',
  CRUNCHY = 'crunchy',
  SOFT = 'soft',
  UMAMI = 'umami',
  SWEET = 'sweet',
  SAVORY = 'savory',
}

export enum UserRole {
  CUSTOMER = 'customer',
  MERCHANT = 'merchant',
}

export type MoodFilter = 'Date Night' | 'Quick Bite' | 'Post-Gym' | 'Hangover Cure' | 'Cheat Day';

export enum OrderStatus {
  PENDING_ACCEPTANCE = 'PENDING_ACCEPTANCE',
  PREPARING = 'PREPARING',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface OrderOptions {
  spiceLevel: 'Mild' | 'Medium' | 'Hot' | 'Insane';
  addons: string[];
  instructions: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  dishName: string;
  price: number;
  status: OrderStatus;
  timestamp: number;
  options?: OrderOptions;
}

export interface UserAccount {
  id: string;
  role: UserRole;
  profile?: PalateProfile;
  merchantData?: MerchantData;
}

export interface MerchantData {
  businessName: string;
  status: 'Open' | 'Closed';
  activeOrders: number;
  dailyEarnings: number;
}

export interface PalateProfile {
  preferences: TastePreference[];
  persona: string;
  matchScore: number;
}

export interface Dish {
  id: string;
  name: string;
  restaurant: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  price: number;
  tags: TastePreference[];
  moods: MoodFilter[];
  calories?: number;
  distance: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

export interface FlashSale {
  id: string;
  dishId: string;
  discount: number;
  expiresAt: number;
}

export interface SocialTable {
  id: string;
  restaurantId: string;
  restaurantName: string;
  time: string;
  membersCount: number;
  membersMax: number;
  interests: string[];
}
