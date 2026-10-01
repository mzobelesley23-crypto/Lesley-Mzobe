import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  OrderStatus, 
  AppView, 
  FilterState, 
  CustomerAddress,
  ProductCategory,
  BrowsingEvent,
  RecommendedProduct,
  RunnerSubmission,
  ProductVariant,
  StaffRole,
  MarketplaceEvent,
  AuditLogEntry,
  OperationalAlert,
  TimeRangeFilter
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_SELLERS, 
  INITIAL_RUNNERS,
  INITIAL_RUNNER_SUBMISSIONS,
  INITIAL_EVENTS,
  INITIAL_AUDIT_LOGS,
  SA_HUBS 
} from '../data/catalogue';
import { 
  calculatePersonalizedRecommendations, 
  calculateCustomersAlsoViewed 
} from '../utils/recommendations';
import {
  evaluateOperationalAlerts,
  generateOrdersCSV,
  generateFinancialsCSV,
  downloadCSV
} from '../utils/analyticsEngine';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface MarketplaceContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  activeOrder: Order | null;
  activeProduct: Product | null;
  currentView: AppView;
  selectedHub: string;
  selectedProvince: SouthAfricanProvince | 'All';
  demoMode?: boolean; // legacy compatibility
  filters: FilterState;
  toasts: Toast[];
  cartCount: number;
  cartSubtotal: number;
  browsingHistory: BrowsingEvent[];
  recentlyViewedProducts: Product[];
  personalizedRecommendations: RecommendedProduct[];
  runnerSubmissions: RunnerSubmission[];
  // Analytics & Operational State
  events: MarketplaceEvent[];
  auditLogs: AuditLogEntry[];
  alerts: OperationalAlert[];
  currentStaffRole: StaffRole;
  timeRange: TimeRangeFilter;
  // Actions
  setView: (view: AppView) => void;
  setActiveProduct: (product: Product | null) => void;
  setActiveOrder: (order: Order | null) => void;
  setSelectedHub: (hub: string) => void;
  setSelectedProvince: (province: SouthAfricanProvince | 'All') => void;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  setStaffRole: (role: StaffRole) => void;
  setTimeRange: (range: TimeRangeFilter) => void;
  addToCart: (product: Product, quantity?: number, selectedVariant?: Record<string, string>) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  createOrder: (
    customer: CustomerAddress, 
    deliveryMethod: 'express' | 'standard', 
    paymentMethod: 'card' | 'instant_eft' | 'cod',
    discountAmount?: number
  ) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, notes?: string) => void;
  advanceOrderStatus: (orderId: string) => void;
  addProduct: (product: Partial<Product>) => Product;
  submitRunnerProduct: (data: Omit<RunnerSubmission, 'id' | 'status' | 'submittedAt'>) => RunnerSubmission;
  approveRunnerSubmission: (submissionId: string, customPrice?: number, customStock?: number) => Product | null;
  rejectRunnerSubmission: (submissionId: string, reason: string) => void;
  adminAddProduct: (data: {
    title: string;
    category: ProductCategory;
    price: number;
    originalPrice?: number;
    stockCount: number;
    description: string;
    images?: string[];
    variants?: ProductVariant[];
    runnerId?: string;
    hub?: string;
    condition?: string;
  }) => Product;
  recordEvent: (type: MarketplaceEvent['type'], details: Record<string, any>, resourceId?: string) => void;
  recordAuditLog: (action: string, resourceType: AuditLogEntry['resourceType'], resourceId: string, prev?: string, next?: string, notes?: string) => void;
  acknowledgeAlert: (alertId: string, assignedTo?: string) => void;
  resolveAlert: (alertId: string, notes: string) => void;
  exportReportCSV: (reportType: 'orders' | 'financials' | 'runners' | 'sellers') => void;
  toggleDemoMode?: () => void;
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  resetCatalogueToDemo: () => void;
  recordProductView: (product: Product) => void;
  getPersonalizedRecommendations: (limit?: number, preferredCategory?: ProductCategory) => RecommendedProduct[];
  getCustomersAlsoViewed: (product: Product, limit?: number) => RecommendedProduct[];
  clearBrowsingHistory: () => void;
}

const defaultFilters: FilterState = {
  category: 'all',
  searchQuery: '',
  minPrice: undefined,
  maxPrice: undefined,
  sortBy: 'featured',
  onSaleOnly: false,
  inStockOnly: false,
  hubFilter: 'All Gauteng Delivery Hubs',
};

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load products from storage or fallback to initial
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('jozicart_products');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('jozicart_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('jozicart_wishlist');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('jozicart_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_ORDERS;
  });

  // User browsing history for recommendation engine
  const [browsingHistory, setBrowsingHistory] = useState<BrowsingEvent[]>(() => {
    try {
      const saved = localStorage.getItem('jozicart_browsing_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Seed with initial realistic exploration if demo mode
    return [
      {
        productId: INITIAL_PRODUCTS[0].id,
        category: INITIAL_PRODUCTS[0].category,
        tags: INITIAL_PRODUCTS[0].tags,
        sellerId: INITIAL_PRODUCTS[0].seller.id,
        viewedAt: Date.now() - 3600000 * 2, // 2 hrs ago
      }
    ];
  });

  // Runner submitted products & clothes awaiting admin review
  const [runnerSubmissions, setRunnerSubmissions] = useState<RunnerSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('jozicart_runner_submissions');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_RUNNER_SUBMISSIONS;
  });

  // Operational Role and Filter Controls
  const [currentStaffRole, setStaffRole] = useState<StaffRole>('SUPER_ADMIN');
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('today');

  // Real-Time Event Stream
  const [events, setEvents] = useState<MarketplaceEvent[]>(() => {
    try {
      const saved = localStorage.getItem('jozicart_events');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_EVENTS;
  });

  // Append-Only Administrative Audit Ledger
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('jozicart_audit_logs');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_AUDIT_LOGS;
  });

  const [activeOrder, setActiveOrder] = useState<Order | null>(orders[0] || null);
  const [activeProduct, setActiveProductState] = useState<Product | null>(null);
  const [currentView, setView] = useState<AppView>('shop');
  const [selectedHub, setSelectedHub] = useState<string>(SA_HUBS[0]);
  const [demoMode, setDemoMode] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Operational Alerts state
  const [alerts, setAlerts] = useState<OperationalAlert[]>(() => {
    return evaluateOperationalAlerts(orders, INITIAL_RUNNERS);
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('jozicart_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('jozicart_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('jozicart_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('jozicart_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('jozicart_browsing_history', JSON.stringify(browsingHistory));
  }, [browsingHistory]);

  useEffect(() => {
    localStorage.setItem('jozicart_runner_submissions', JSON.stringify(runnerSubmissions));
  }, [runnerSubmissions]);

  useEffect(() => {
    localStorage.setItem('jozicart_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('jozicart_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const recordProductView = (product: Product) => {
    const event: BrowsingEvent = {
      productId: product.id,
      category: product.category,
      tags: product.tags,
      sellerId: product.seller.id,
      viewedAt: Date.now(),
    };

    setBrowsingHistory(prev => {
      // Remove any prior duplicate of this exact product so the most recent is at the top
      const filtered = prev.filter(e => e.productId !== product.id);
      return [event, ...filtered].slice(0, 30);
    });
  };

  const setActiveProduct = (product: Product | null) => {
    setActiveProductState(product);
    if (product) {
      recordProductView(product);
    }
  };

  const clearBrowsingHistory = () => {
    setBrowsingHistory([]);
    localStorage.removeItem('jozicart_browsing_history');
    addToast('Browsing history cleared. Recommendations reset.', 'info');
  };

  // Derive recently viewed products in order
  const recentlyViewedProducts = useMemo(() => {
    const list: Product[] = [];
    const seen = new Set<string>();

    for (const event of browsingHistory) {
      if (!seen.has(event.productId)) {
        seen.add(event.productId);
        const prod = products.find(p => p.id === event.productId);
        if (prod) {
          list.push(prod);
        }
      }
    }
    return list;
  }, [browsingHistory, products]);

  // Derived personalized recommendations for homepage
  const personalizedRecommendations = useMemo(() => {
    return calculatePersonalizedRecommendations(
      products,
      browsingHistory,
      orders,
      { limit: 4 }
    );
  }, [products, browsingHistory, orders]);

  const getPersonalizedRecommendations = (limit = 4, preferredCategory?: ProductCategory): RecommendedProduct[] => {
    return calculatePersonalizedRecommendations(
      products,
      browsingHistory,
      orders,
      { limit, preferredCategory }
    );
  };

  const getCustomersAlsoViewed = (currentProduct: Product, limit = 4): RecommendedProduct[] => {
    return calculateCustomersAlsoViewed(
      currentProduct,
      products,
      browsingHistory,
      limit
    );
  };

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addToCart = (product: Product, quantity = 1, selectedVariant?: Record<string, string>) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => 
        item.product.id === product.id && 
        JSON.stringify(item.selectedVariant || {}) === JSON.stringify(selectedVariant || {})
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity, selectedVariant }];
    });

    addToast(`Added "${product.title}" to cart`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    addToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast('Removed from saved items', 'info');
        return prev.filter(id => id !== productId);
      } else {
        addToast('Added to your wishlist', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  const createOrder = (
    customer: CustomerAddress, 
    deliveryMethod: 'express' | 'standard', 
    paymentMethod: 'card' | 'instant_eft' | 'cod',
    discountAmount = 0
  ): Order => {
    const originProvince: SouthAfricanProvince = cart[0]?.product.seller.province || 'Gauteng';
    const destProvince: SouthAfricanProvince = customer.province || 'Gauteng';
    const isInterprovincial = originProvince !== destProvince;

    const deliveryFee = isInterprovincial
      ? (cartSubtotal >= 800 ? 0 : (deliveryMethod === 'express' ? 160 : 110))
      : (cartSubtotal >= 500 ? 0 : (deliveryMethod === 'express' ? 95 : 60));

    const total = Math.max(0, cartSubtotal + deliveryFee - discountAmount);
    const orderNumber = `JC-${Math.floor(10000 + Math.random() * 90000)}`;
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // Assign appropriate regional courier
    const candidateRunners = INITIAL_RUNNERS.filter(r => r.currentHub.includes(destProvince));
    const assignedRunner = candidateRunners.length > 0 
      ? candidateRunners[Math.floor(Math.random() * candidateRunners.length)]
      : INITIAL_RUNNERS[0];

    const now = new Date();
    const estTime = isInterprovincial
      ? (deliveryMethod === 'express' ? 'Next business day by airfreight cargo' : 'In 2-3 business days (National line-haul)')
      : (deliveryMethod === 'express' ? 'Today / Tomorrow between 10:00 AM – 2:00 PM' : 'In 1-2 business days');

    const trackingUpdates: TrackingStep[] = isInterprovincial ? [
      {
        status: 'payment_confirmed',
        title: 'Order Placed & Payment Cleared',
        description: `Payment of R ${total.toLocaleString()} processed via ${paymentMethod === 'instant_eft' ? 'Instant EFT' : paymentMethod === 'card' ? 'Card' : 'Pay on Delivery'}`,
        timestamp: 'Just now',
        completed: true,
      },
      {
        status: 'packing',
        title: 'Merchant Packing at Origin Hub',
        description: `Prepared by ${cart[0]?.product.seller.name || 'Merchant'} in ${originProvince}`,
        timestamp: 'Pending',
        completed: false,
      },
      {
        status: 'ready_for_pickup',
        title: 'Transferred to Provincial Logistics Hub',
        description: `Consolidated at ${originProvince} Airport Cargo Gateway for interprovincial departure`,
        timestamp: 'Pending',
        completed: false,
      },
      {
        status: 'in_transit',
        title: 'Interprovincial Transit',
        description: `Domestic airfreight / line-haul en route: ${originProvince} → ${destProvince} Sorting Terminal`,
        timestamp: 'Pending',
        completed: false,
      },
      {
        status: 'runner_assigned',
        title: 'Destination Courier Dispatched',
        description: `${assignedRunner.name} allocated for final doorstep delivery in ${customer.city}`,
        timestamp: 'Pending',
        completed: false,
      },
      {
        status: 'delivered',
        title: 'Handover & Delivery Confirmation',
        description: `Handed over via 4-digit security PIN (${randomOtp})`,
        timestamp: 'Pending',
        completed: false,
      }
    ] : [
      {
        status: 'payment_confirmed',
        title: 'Order Placed & Payment Cleared',
        description: `Payment of R ${total.toLocaleString()} processed via ${paymentMethod === 'instant_eft' ? 'Instant EFT' : paymentMethod === 'card' ? 'Card' : 'Pay on Delivery'}`,
        timestamp: 'Just now',
        completed: true,
      },
      {
        status: 'packing',
        title: 'Local Merchant Packaging',
        description: 'Seller verifying items and packaging in protective tamper-proof bag',
        timestamp: 'Pending',
        completed: false,
      },
      {
        status: 'runner_assigned',
        title: 'JoziCart Local Runner Assigned',
        description: `${assignedRunner.name} allocated for local city collection & express dispatch`,
        timestamp: 'Pending',
        completed: false,
      },
      {
        status: 'in_transit',
        title: 'Out for Local Delivery',
        description: `Courier on route to ${customer.suburb}, ${customer.city}`,
        timestamp: 'Pending',
        completed: false,
      },
      {
        status: 'delivered',
        title: 'Handover & Security PIN Confirmation',
        description: `Delivery completed via security OTP (${randomOtp})`,
        timestamp: 'Pending',
        completed: false,
      }
    ];

    const newOrder: Order = {
      id: orderNumber,
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee,
      discount: discountAmount,
      total,
      platformFee: Math.round(cartSubtotal * 0.08),
      sellerPayout: Math.round(cartSubtotal * 0.92),
      runnerFee: 55,
      deliveryType: isInterprovincial ? 'interprovincial_linehaul' : 'local_runner',
      route: {
        originProvince,
        originCity: cart[0]?.product.seller.hub.split(',')[1]?.trim() || 'Johannesburg',
        destinationProvince: destProvince,
        destinationCity: customer.city,
        isInterprovincial,
        transitHub: isInterprovincial ? `${originProvince} Gateway → ${destProvince} Hub` : undefined
      },
      customer,
      deliveryMethod,
      paymentMethod,
      status: 'confirmed',
      runner: assignedRunner,
      trackingUpdates,
      otpCode: randomOtp,
      createdAt: now.toISOString(),
      estimatedDeliveryDate: estTime,
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    clearCart();
    setView('order-tracking');
    addToast(`Order ${newOrder.id} successfully placed!`, 'success');
    return newOrder;
  };

  const recordEvent = (type: MarketplaceEvent['type'], details: Record<string, any>, resourceId?: string) => {
    const newEvt: MarketplaceEvent = {
      id: `evt-${Date.now().toString().slice(-6)}`,
      type,
      timestamp: new Date().toISOString(),
      actor: currentStaffRole === 'SUPER_ADMIN' ? 'Admin Sipho' : `${currentStaffRole} Staff`,
      role: currentStaffRole,
      resourceId,
      details
    };
    setEvents(prev => [newEvt, ...prev].slice(0, 100)); // maintain recent 100 events
  };

  const recordAuditLog = (
    action: string, 
    resourceType: AuditLogEntry['resourceType'], 
    resourceId: string, 
    prev?: string, 
    next?: string, 
    notes?: string
  ) => {
    const newLog: AuditLogEntry = {
      id: `audit-${Date.now().toString().slice(-6)}`,
      timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actorName: currentStaffRole === 'SUPER_ADMIN' ? 'Sipho Khumalo' : `${currentStaffRole} Operator`,
      actorRole: currentStaffRole,
      action,
      resourceType,
      resourceId,
      previousState: prev,
      newState: next,
      notes
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, notes?: string) => {
    let prevStatus = '';

    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      prevStatus = order.status;

      const statusHierarchy: OrderStatus[] = [
        'new',
        'payment_confirmed',
        'confirmed',
        'waiting_seller',
        'packing',
        'ready_for_pickup',
        'waiting_runner',
        'runner_assigned',
        'in_transit',
        'delivered'
      ];
      const targetIndex = statusHierarchy.indexOf(newStatus);

      const updatedUpdates = order.trackingUpdates.map((step) => {
        const stepStatusIndex = statusHierarchy.indexOf(step.status);
        const isDone = stepStatusIndex <= targetIndex;
        return {
          ...step,
          completed: isDone,
          timestamp: isDone ? (step.timestamp === 'Pending' ? 'Completed' : step.timestamp) : 'Pending'
        };
      });

      return {
        ...order,
        status: newStatus,
        trackingUpdates: updatedUpdates,
        updatedAt: new Date().toISOString(),
        payoutStatus: newStatus === 'delivered' ? 'cleared' : (newStatus === 'disputed' ? 'held' : order.payoutStatus)
      };
    }));

    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }

    // Record operational event and audit log
    recordEvent('order_created', { orderId, newStatus }, orderId);
    recordAuditLog('ORDER_STATUS_CHANGED', 'order', orderId, prevStatus, newStatus, notes || `Status transitioned to ${newStatus}`);

    // Re-evaluate operational alerts
    setAlerts(evaluateOperationalAlerts(orders, INITIAL_RUNNERS));

    addToast(`Order ${orderId} transitioned to: ${newStatus.replace('_', ' ')}`, 'info');
  };

  const advanceOrderStatus = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const sequence: OrderStatus[] = ['confirmed', 'packing', 'runner_assigned', 'in_transit', 'delivered'];
    const currentIndex = sequence.indexOf(order.status);
    if (currentIndex < sequence.length - 1) {
      updateOrderStatus(orderId, sequence[currentIndex + 1]);
    }
  };

  const acknowledgeAlert = (alertId: string, assignedTo?: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'acknowledged', assignedTo: assignedTo || 'Operations Team' } : a));
    recordAuditLog('ALERT_ACKNOWLEDGED', 'alert', alertId, 'new', 'acknowledged', `Assigned to ${assignedTo || 'Operations'}`);
    addToast(`Alert ${alertId} acknowledged`, 'info');
  };

  const resolveAlert = (alertId: string, notes: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'resolved', resolutionNotes: notes, resolvedAt: 'Just now' } : a));
    recordAuditLog('ALERT_RESOLVED', 'alert', alertId, 'acknowledged', 'resolved', notes);
    addToast(`Alert ${alertId} resolved`, 'success');
  };

  const exportReportCSV = (reportType: 'orders' | 'financials' | 'runners' | 'sellers') => {
    const timestamp = new Date().toISOString().split('T')[0];
    if (reportType === 'orders') {
      const csv = generateOrdersCSV(orders);
      downloadCSV(`jozicart-orders-${timestamp}.csv`, csv);
      recordAuditLog('REPORT_EXPORTED', 'system', 'orders', undefined, undefined, 'Exported Orders Ledger CSV');
      addToast('Orders report downloaded as CSV', 'success');
    } else if (reportType === 'financials') {
      const csv = generateFinancialsCSV(orders);
      downloadCSV(`jozicart-financials-${timestamp}.csv`, csv);
      recordAuditLog('REPORT_EXPORTED', 'system', 'financials', undefined, undefined, 'Exported Financial Reconciliation CSV');
      addToast('Financial reconciliation report downloaded as CSV', 'success');
    } else if (reportType === 'runners') {
      const headers = ['Runner_ID', 'Name', 'Phone', 'Vehicle', 'Hub', 'Deliveries_Completed', 'Deliveries_Active', 'Total_Earnings_ZAR', 'Status'];
      const rows = INITIAL_RUNNERS.map(r => {
        const completed = r.deliveriesCompleted + orders.filter(o => o.runner?.id === r.id && o.status === 'delivered').length;
        const active = orders.filter(o => o.runner?.id === r.id && o.status === 'in_transit').length;
        return [r.id, `"${r.name}"`, r.phone, r.vehicle, `"${r.currentHub}"`, completed, active, completed * 55, active > 0 ? 'on_delivery' : 'available'].join(',');
      });
      downloadCSV(`jozicart-runners-${timestamp}.csv`, [headers.join(','), ...rows].join('\n'));
      recordAuditLog('REPORT_EXPORTED', 'system', 'runners', undefined, undefined, 'Exported Runner Operations CSV');
      addToast('Runner operations report downloaded as CSV', 'success');
    } else if (reportType === 'sellers') {
      const headers = ['Seller_ID', 'Merchant_Name', 'Hub', 'Rating', 'Orders_Fulfilled', 'Status'];
      const rows = INITIAL_SELLERS.map(s => [s.id, `"${s.name}"`, `"${s.hub}"`, s.rating, s.ordersFulfilled, s.verified ? 'Verified' : 'Pending'].join(','));
      downloadCSV(`jozicart-sellers-${timestamp}.csv`, [headers.join(','), ...rows].join('\n'));
      recordAuditLog('REPORT_EXPORTED', 'system', 'sellers', undefined, undefined, 'Exported Seller Performance CSV');
      addToast('Seller performance report downloaded as CSV', 'success');
    }
  };

  const addProduct = (productData: Partial<Product>): Product => {
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      title: productData.title || 'Untitled Product',
      category: productData.category || 'fashion',
      price: productData.price || 199,
      originalPrice: productData.originalPrice,
      discountPercent: productData.originalPrice ? Math.round(((productData.originalPrice - (productData.price || 199)) / productData.originalPrice) * 100) : undefined,
      description: productData.description || 'Quality merchandise curated on JoziCart.',
      highlights: productData.highlights || ['Verified local merchant', 'Next-day packaging dispatch'],
      specs: productData.specs || { 'Origin': 'Johannesburg, South Africa' },
      images: productData.images && productData.images.length > 0 ? productData.images : [INITIAL_PRODUCTS[0].images[0]],
      seller: productData.seller || INITIAL_SELLERS[0],
      inStock: true,
      stockCount: productData.stockCount || 10,
      variants: productData.variants,
      badge: productData.badge || 'New Arrival',
      isDemo: false, // newly added by seller is production/custom
      tags: productData.tags || ['marketplace', 'jozicart'],
      estimatedDeliveryDays: 1,
    };

    setProducts(prev => [newProduct, ...prev]);
    addToast(`Product "${newProduct.title}" published!`, 'success');
    return newProduct;
  };

  const submitRunnerProduct = (data: Omit<RunnerSubmission, 'id' | 'status' | 'submittedAt'>): RunnerSubmission => {
    const newSub: RunnerSubmission = {
      ...data,
      id: `RS-${Date.now().toString().slice(-4)}`,
      status: 'pending',
      submittedAt: 'Just now',
    };
    setRunnerSubmissions(prev => [newSub, ...prev]);
    addToast(`"${data.title}" submitted to JoziCart admin for review!`, 'success');
    return newSub;
  };

  const approveRunnerSubmission = (submissionId: string, customPrice?: number, customStock?: number): Product | null => {
    const sub = runnerSubmissions.find(s => s.id === submissionId);
    if (!sub) return null;

    // Update submission status to approved
    setRunnerSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, status: 'approved' } : s));

    const price = customPrice !== undefined && customPrice > 0 ? customPrice : sub.suggestedPrice;
    const stock = customStock !== undefined && customStock > 0 ? customStock : sub.stockCount;

    const newProduct: Product = {
      id: `prod-runner-${Date.now()}`,
      title: sub.title,
      category: sub.category,
      price,
      description: sub.description,
      highlights: [
        `Authentic item sourced in ${sub.runnerHub}`,
        `Condition: ${sub.condition}`,
        `Approved by JoziCart Admin · Scouted by Runner ${sub.runnerName}`
      ],
      specs: {
        'Condition': sub.condition,
        'Source Hub': sub.runnerHub,
        'Sourced By': `Runner ${sub.runnerName}`,
        'Fulfillment': 'JoziCart Runner Express Delivery'
      },
      images: sub.images && sub.images.length > 0 ? sub.images : [INITIAL_PRODUCTS[0].images[0]],
      seller: {
        id: `seller-${sub.runnerId}`,
        name: `${sub.runnerName} Sourced`,
        hub: sub.runnerHub,
        rating: 4.9,
        ordersFulfilled: 38,
        verified: true,
        joinedYear: 2024,
      },
      inStock: true,
      stockCount: stock,
      variants: sub.variants || (sub.category === 'fashion' ? [{ name: 'Size', options: ['S', 'M', 'L', 'XL'] }] : undefined),
      badge: `Runner Sourced · ${sub.runnerName.split(' ')[0]}`,
      isDemo: false,
      tags: [sub.category, 'clothes', 'runner-sourced', sub.runnerHub.toLowerCase().split(' ')[0], 'streetwear'],
      estimatedDeliveryDays: 1,
      sourcedByRunner: {
        runnerId: sub.runnerId,
        runnerName: sub.runnerName,
        hub: sub.runnerHub,
      }
    };

    setProducts(prev => [newProduct, ...prev]);
    addToast(`Approved "${sub.title}"! It is now live in the marketplace.`, 'success');
    return newProduct;
  };

  const rejectRunnerSubmission = (submissionId: string, reason: string) => {
    setRunnerSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, status: 'rejected', rejectionReason: reason } : s));
    addToast(`Submission rejected: ${reason}`, 'info');
  };

  const adminAddProduct = (data: {
    title: string;
    category: ProductCategory;
    price: number;
    originalPrice?: number;
    stockCount: number;
    description: string;
    images?: string[];
    variants?: ProductVariant[];
    runnerId?: string;
    hub?: string;
    condition?: string;
  }): Product => {
    const runner = INITIAL_RUNNERS.find(r => r.id === data.runnerId);
    const hub = data.hub || (runner ? runner.currentHub : 'Maboneng & JHB CBD');

    const newProd: Product = {
      id: `admin-prod-${Date.now()}`,
      title: data.title,
      category: data.category,
      price: data.price,
      originalPrice: data.originalPrice,
      discountPercent: data.originalPrice && data.originalPrice > data.price 
        ? Math.round(((data.originalPrice - data.price) / data.originalPrice) * 100) 
        : undefined,
      description: data.description,
      highlights: [
        'Curated directly by JoziCart Admin',
        data.condition ? `Condition: ${data.condition}` : 'Authentic Johannesburg stock',
        runner ? `Attributed to Runner ${runner.name}` : 'Local Gauteng fulfillment'
      ],
      specs: {
        'Curated By': 'JoziCart Admin',
        'Hub Location': hub,
        ...(data.condition ? { 'Condition': data.condition } : {})
      },
      images: data.images && data.images.length > 0 ? data.images : [INITIAL_PRODUCTS[0].images[0]],
      seller: runner ? {
        id: `seller-${runner.id}`,
        name: `${runner.name} Curated`,
        hub: runner.currentHub,
        rating: 4.9,
        ordersFulfilled: 55,
        verified: true,
        joinedYear: 2024,
      } : INITIAL_SELLERS[0],
      inStock: true,
      stockCount: data.stockCount || 10,
      variants: data.variants || (data.category === 'fashion' ? [{ name: 'Size', options: ['S', 'M', 'L', 'XL'] }] : undefined),
      badge: runner ? `Runner Sourced · ${runner.name.split(' ')[0]}` : 'Admin Verified',
      isDemo: false,
      tags: [data.category, 'clothes', 'fashion', 'curated'],
      estimatedDeliveryDays: 1,
      sourcedByRunner: runner ? {
        runnerId: runner.id,
        runnerName: runner.name,
        hub: runner.currentHub,
      } : undefined
    };

    setProducts(prev => [newProd, ...prev]);
    addToast(`"${newProd.title}" successfully added and published to JoziCart!`, 'success');
    return newProd;
  };

  const toggleDemoMode = () => {
    setDemoMode(prev => {
      const next = !prev;
      addToast(next ? 'Demo Mode enabled (Showing demo catalogue & orders)' : 'Production Mode enabled (Live data filter active)', 'info');
      return next;
    });
  };

  const resetCatalogueToDemo = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setRunnerSubmissions(INITIAL_RUNNER_SUBMISSIONS);
    setCart([]);
    setWishlist([]);
    localStorage.removeItem('jozicart_products');
    localStorage.removeItem('jozicart_orders');
    localStorage.removeItem('jozicart_runner_submissions');
    localStorage.removeItem('jozicart_cart');
    localStorage.removeItem('jozicart_wishlist');
    addToast('Catalogue, submissions and orders reset to pristine state', 'info');
  };

  return (
    <MarketplaceContext.Provider value={{
      products,
      cart,
      wishlist,
      orders,
      activeOrder,
      activeProduct,
      currentView,
      selectedHub,
      demoMode,
      filters,
      toasts,
      cartCount,
      cartSubtotal,
      browsingHistory,
      recentlyViewedProducts,
      personalizedRecommendations,
      runnerSubmissions,
      events,
      auditLogs,
      alerts,
      currentStaffRole,
      timeRange,
      setView,
      setActiveProduct,
      setActiveOrder,
      setSelectedHub,
      setFilters,
      resetFilters,
      setStaffRole,
      setTimeRange,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      toggleWishlist,
      isInWishlist,
      createOrder,
      updateOrderStatus,
      advanceOrderStatus,
      addProduct,
      submitRunnerProduct,
      approveRunnerSubmission,
      rejectRunnerSubmission,
      adminAddProduct,
      recordEvent,
      recordAuditLog,
      acknowledgeAlert,
      resolveAlert,
      exportReportCSV,
      toggleDemoMode,
      addToast,
      removeToast,
      resetCatalogueToDemo,
      recordProductView,
      getPersonalizedRecommendations,
      getCustomersAlsoViewed,
      clearBrowsingHistory,
    }}>
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
