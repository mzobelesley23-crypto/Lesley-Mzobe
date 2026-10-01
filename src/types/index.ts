export type ProductCategory = 
  | 'all'
  | 'fashion'
  | 'sneakers'
  | 'electronics'
  | 'beauty'
  | 'home'
  | 'leather'
  | 'accessories';

export type SouthAfricanProvince = 
  | 'Gauteng'
  | 'Western Cape'
  | 'KwaZulu-Natal'
  | 'Eastern Cape'
  | 'Free State'
  | 'Mpumalanga'
  | 'Limpopo'
  | 'North West'
  | 'Northern Cape';

export type DeliveryType = 'local_runner' | 'interprovincial_linehaul';

export interface Seller {
  id: string;
  name: string;
  hub: string; // e.g. "Maboneng, Johannesburg", "Kloof Street, Cape Town", "Florida Rd, Durban"
  city?: string;
  province?: SouthAfricanProvince;
  rating: number;
  ordersFulfilled: number;
  verified: boolean;
  joinedYear: number;
}

export interface ProductVariant {
  name: string; // e.g. "Size", "Color"
  options: string[]; // e.g. ["UK 7", "UK 8", "UK 9", "UK 10"]
}

export interface Product {
  id: string;
  title: string;
  category: ProductCategory;
  price: number; // in ZAR
  originalPrice?: number; // for discount
  discountPercent?: number;
  description: string;
  highlights: string[];
  specs: Record<string, string>;
  images: string[];
  seller: Seller;
  inStock: boolean;
  stockCount: number;
  variants?: ProductVariant[];
  badge?: string; // e.g. "Next-Day Delivery", "Local Artisan", "Selling Fast"
  isDemo?: boolean;
  tags: string[];
  estimatedDeliveryDays: number; // e.g. 1 for next day, 2 for 48h
  sourcedByRunner?: {
    runnerId: string;
    runnerName: string;
    hub: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: Record<string, string>; // e.g. { "Size": "UK 8" }
}

export type OrderStatus = 
  | 'new'
  | 'payment_confirmed'
  | 'confirmed'
  | 'waiting_seller'
  | 'packing'
  | 'ready_for_pickup'
  | 'waiting_runner'
  | 'runner_assigned'
  | 'in_transit'
  | 'delivered'
  | 'failed'
  | 'cancelled'
  | 'disputed';

export interface TrackingStep {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface Runner {
  id: string;
  name: string;
  phone: string;
  vehicle: 'Motorbike' | 'Bicycle' | 'Vehicle';
  currentHub: string;
  province?: SouthAfricanProvince;
  runnerType?: 'metro_runner' | 'linehaul_liaison';
  rating: number;
  deliveriesCompleted: number;
  status?: 'available' | 'on_delivery' | 'offline';
  joinedDate?: string;
  payoutPending?: number;
}

export interface CustomerAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  suburb: string;
  city: string; // e.g. "Johannesburg", "Cape Town", "Durban", "Pretoria", "Gqeberha"
  province?: SouthAfricanProvince;
  postalCode: string;
  deliveryNotes?: string;
}

export interface Order {
  id: string; // e.g. "JC-78241"
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  platformFee?: number; // 8% commission
  sellerPayout?: number; // Net owed to seller
  runnerFee?: number; // R55 per delivery
  deliveryType?: DeliveryType; // 'local_runner' or 'interprovincial_linehaul'
  route?: {
    originProvince: SouthAfricanProvince;
    originCity: string;
    destinationProvince: SouthAfricanProvince;
    destinationCity: string;
    isInterprovincial: boolean;
    transitHub?: string;
  };
  customer: CustomerAddress;
  deliveryMethod: 'express' | 'standard';
  paymentMethod: 'card' | 'instant_eft' | 'cod';
  status: OrderStatus;
  runner?: Runner;
  trackingUpdates: TrackingStep[];
  otpCode: string; // 4-digit code customer gives to runner upon handover
  createdAt: string;
  updatedAt?: string;
  estimatedDeliveryDate: string;
  isDemo?: boolean;
  payoutStatus?: 'pending' | 'cleared' | 'held';
  disputeReason?: string;
  internalNotes?: string[];
}

export type StaffRole = 
  | 'SUPER_ADMIN'
  | 'OPERATIONS'
  | 'FINANCE'
  | 'SUPPORT'
  | 'SELLER'
  | 'RUNNER';

export interface MarketplaceEvent {
  id: string;
  type: 
    | 'user_registered'
    | 'seller_registered'
    | 'seller_approved'
    | 'runner_applied'
    | 'runner_approved'
    | 'product_created'
    | 'product_viewed'
    | 'search_performed'
    | 'product_added_to_cart'
    | 'checkout_started'
    | 'order_created'
    | 'payment_confirmed'
    | 'seller_processing'
    | 'order_ready_for_pickup'
    | 'runner_assigned'
    | 'runner_accepted'
    | 'pickup_completed'
    | 'delivery_started'
    | 'delivery_completed'
    | 'delivery_failed'
    | 'order_cancelled'
    | 'refund_created'
    | 'payout_created';
  timestamp: string;
  actor: string;
  role: StaffRole | 'BUYER';
  resourceId?: string;
  details: Record<string, any>;
}

export interface OperationalAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'dispatch' | 'seller_sla' | 'payment' | 'runner_capacity' | 'dispute';
  title: string;
  description: string;
  createdAt: string;
  status: 'new' | 'acknowledged' | 'assigned' | 'resolved';
  assignedTo?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: StaffRole;
  action: string;
  resourceType: 'order' | 'product' | 'seller' | 'runner' | 'payout' | 'alert' | 'system';
  resourceId: string;
  previousState?: string;
  newState?: string;
  notes?: string;
}

export type TimeRangeFilter = 'today' | '7days' | '30days' | 'all';

export type AppView = 
  | 'shop'
  | 'cart'
  | 'checkout'
  | 'order-tracking'
  | 'seller-portal'
  | 'runner-portal'
  | 'admin-portal'
  | 'runner-info';

export interface FilterState {
  category: ProductCategory;
  searchQuery: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'fastest';
  onSaleOnly: boolean;
  inStockOnly: boolean;
  hubFilter: string;
  provinceFilter?: SouthAfricanProvince | 'all';
  fulfillmentScope?: 'all' | 'local_runner' | 'interprovincial';
}

export interface InterprovincialCorridor {
  id: string;
  name: string; // e.g. "Gauteng ↔ Western Cape"
  originProvince: SouthAfricanProvince;
  destinationProvince: SouthAfricanProvince;
  originGateway: string; // e.g. "O.R. Tambo Logistics Gateway (JHB)"
  destinationGateway: string; // e.g. "Cape Town Airport Cargo Hub (CPT)"
  transitMode: 'Domestic Airfreight Cargo' | 'Express Highway Linehaul' | 'Regional Feeder Route';
  dailyFlightsOrDepartures: number;
  transitHours: number;
  activeParcelsCount: number;
  onTimeRate: number;
  status: 'optimal' | 'congested' | 'delayed';
}

export interface BrowsingEvent {
  productId: string;
  category: ProductCategory;
  tags: string[];
  sellerId: string;
  viewedAt: number; // timestamp
}

export interface RecommendationReason {
  type: 'browsing_history' | 'frequently_paired' | 'seller_affinity' | 'trending' | 'category_match';
  label: string;
}

export interface RecommendedProduct {
  product: Product;
  score: number;
  reason: RecommendationReason;
}

export interface RunnerSubmission {
  id: string; // e.g. "RS-401"
  runnerId: string;
  runnerName: string;
  runnerHub: string;
  title: string;
  category: ProductCategory;
  suggestedPrice: number;
  description: string;
  images: string[];
  condition: 'Brand New' | 'Like New' | 'Handcrafted' | 'Deadstock Vintage';
  stockCount: number;
  variants?: ProductVariant[];
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  adminNotes?: string;
  submittedAt: string;
}

