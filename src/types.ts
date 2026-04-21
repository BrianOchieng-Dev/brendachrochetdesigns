/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string; // 'Ksh'
  category: 'FASHION' | 'ACCESSORIES' | 'PATTERNS';
  image_urls: string[];
  created_at: string;
  is_featured: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  created_at: string;
}

export interface Inquiry {
  id: string;
  customer_name: string;
  customer_email: string;
  message: string;
  status: 'PENDING' | 'RESOLVED';
  response?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  role: 'GUEST' | 'COLLECTOR' | 'MUSE';
  measurements?: MeasurementProfile;
  created_at: string;
}

export interface MeasurementProfile {
  height: number;
  chest: number;
  arm_length: number;
  unit: 'cm' | 'inch';
}

export interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  customer_name: string;
  customer_email: string;
  progress: number; // 0-100 for "Stitch-by-Stitch"
}

export interface Activity {
  id: string;
  type: 'ORDER' | 'SAVED' | 'VIEWED' | 'AUTH';
  message: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'VIP';
  read: boolean;
  timestamp: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}
