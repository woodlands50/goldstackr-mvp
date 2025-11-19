export interface Product {
  id: string;
  sku: string;
  name: string;
  weight: number;
  purity: number;
  category: 'gold' | 'silver' | 'platinum' | 'palladium';
  type: 'coin' | 'bar' | 'round';
  images: string[];
  specifications: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface Dealer {
  id: string;
  name: string;
  website: string;
  logo: string;
  rating: number;
  review_count: number;
  shipping_policy: string;
  payment_methods: string[];
  contact_email: string;
  contact_phone: string;
  trust_score: number;
  created_at: string;
  updated_at: string;
}

export interface Price {
  id: string;
  product_id: string;
  dealer_id: string;
  price: number;
  premium_percent: number;
  in_stock: boolean;
  quantity_available: number;
  shipping_cost: number;
  total_cost: number;
  last_updated: string;
  product?: Product;
  dealer?: Dealer;
}

export interface SpotPrice {
  metal: 'gold' | 'silver' | 'platinum' | 'palladium';
  price: number;
  change: number;
  change_percent: number;
  timestamp: string;
}

export interface WatchlistItem {
  id: string;
  user_id: string;
  product_id: string;
  target_price?: number;
  notify_on_drop: boolean;
  notify_on_availability: boolean;
  created_at: string;
  product?: Product;
  current_prices?: Price[];
}

export interface PriceAlert {
  id: string;
  user_id: string;
  product_id: string;
  alert_type: 'price_drop' | 'back_in_stock' | 'exceptional_deal';
  threshold_price?: number;
  triggered_at: string;
  is_read: boolean;
  product?: Product;
}

export interface DealScore {
  product_id: string;
  dealer_id: string;
  overall_score: number;
  price_score: number;
  dealer_score: number;
  availability_score: number;
  deal_quality: 'excellent' | 'good' | 'fair' | 'poor';
  savings_amount: number;
  savings_percent: number;
}

export interface PriceHistory {
  product_id: string;
  dealer_id: string;
  price: number;
  timestamp: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notify_exceptional_deals: boolean;
  notify_watchlist_drops: boolean;
  notify_back_in_stock: boolean;
  notification_threshold_percent: number;
  preferred_dealers: string[];
  auto_detect_products: boolean;
}

export interface ProductDetection {
  product: Product | null;
  confidence: number;
  detected_price: number;
  dealer_info: {
    name: string;
    url: string;
  };
}
