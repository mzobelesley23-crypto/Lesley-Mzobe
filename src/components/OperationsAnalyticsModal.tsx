import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Store, 
  Bike, 
  ArrowLeft, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  CheckCircle2,
  AlertTriangle,
  Check,
  X,
  Plus,
  Sparkles,
  Tag,
  Filter,
  Eye,
  Shirt,
  MapPin,
  Download,
  Activity,
  Calendar,
  Layers,
  FileSpreadsheet,
  AlertCircle,
  ChevronRight,
  UserCheck,
  FileText,
  RotateCcw,
  Search
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { INITIAL_SELLERS, INITIAL_RUNNERS, SA_HUBS } from '../data/catalogue';
import { 
  ProductCategory, 
  RunnerSubmission, 
  OrderStatus, 
  StaffRole, 
  TimeRangeFilter, 
  Order 
} from '../types';
import { 
  calculateExecutiveMetrics, 
  calculateProductPerformance, 
  calculateSellerPerformance, 
  calculateRunnerPerformance, 
  calculateGautengHubMetrics,
  filterOrdersByTimeRange,
  filterEventsByTimeRange
} from '../utils/analyticsEngine';

// Commercial product photography assets
import heroImg from '../assets/images/jozi_hero_fashion_1790857952409.jpg';
import hoodieImg from '../assets/images/product_hoodie_1790858004350.jpg';
import sneakerImg from '../assets/images/product_sneakers_1790857966199.jpg';
import walletImg from '../assets/images/product_wallet_1790858047317.jpg';
import watchImg from '../assets/images/product_watch_1790858034295.jpg';
import sunglassesImg from '../assets/images/product_sunglasses_1790858086226.jpg';

export const OperationsAnalyticsModal: React.FC = () => {
  const { 
    orders, 
    products, 
    runnerSubmissions,
    events,
    auditLogs,
    alerts,
    currentStaffRole,
    timeRange,
    setStaffRole,
    setTimeRange,
    updateOrderStatus,
    acknowledgeAlert,
    resolveAlert,
    exportReportCSV,
    approveRunnerSubmission,
    rejectRunnerSubmission,
    adminAddProduct,
    setActiveProduct,
    setView 
  } = useMarketplace();

  // Primary navigation tabs
  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders-monitor' | 'marketplace' | 'runners' | 'hubs' | 'alerts' | 'finance' | 'audit' | 'approvals' | 'add-product'
  >('overview');

  // Sub-filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>('');
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(null);

  // Alert resolution modal
  const [resolvingAlertId, setResolvingAlertId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState<string>('Resolved per standard operating procedure.');

  // Runner submission filter
  const [submissionFilter, setSubmissionFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Price needs adjustment for Gauteng retail');
  const [editingSubmission, setEditingSubmission] = useState<{ id: string; price: number; stock: number } | null>(null);

  // Quick Add Clothes & Products Form State
  const [newTitle, setNewTitle] = useState('Braamfontein Vintage Windbreaker');
  const [newCategory, setNewCategory] = useState<ProductCategory>('fashion');
  const [newPrice, setNewPrice] = useState('550');
  const [newOriginalPrice, setNewOriginalPrice] = useState('750');
  const [newStock, setNewStock] = useState('10');
  const [newCondition, setNewCondition] = useState('Deadstock Vintage');
  const [newRunnerId, setNewRunnerId] = useState(INITIAL_RUNNERS[0].id);
  const [newHub, setNewHub] = useState('Braamfontein, JHB');
  const [newSizes, setNewSizes] = useState('S, M, L, XL');
  const [selectedImage, setSelectedImage] = useState(hoodieImg);
  const [newDescription, setNewDescription] = useState('Sourced from an independent designer studio in Braamfontein. Lightweight weather-resistant ripstop nylon with retro Jozi colour-blocking.');

  // Time-filtered data computations
  const filteredOrders = useMemo(() => filterOrdersByTimeRange(orders, timeRange), [orders, timeRange]);
  const filteredEvents = useMemo(() => filterEventsByTimeRange(events, timeRange), [events, timeRange]);

  // Executive Metrics
  const metrics = useMemo(() => {
    return calculateExecutiveMetrics(filteredOrders, INITIAL_RUNNERS, INITIAL_SELLERS, filteredEvents);
  }, [filteredOrders, filteredEvents]);

  // Sub-performance metrics
  const productPerformance = useMemo(() => {
    return calculateProductPerformance(products, filteredOrders, filteredEvents);
  }, [products, filteredOrders, filteredEvents]);

  const sellerPerformance = useMemo(() => {
    return calculateSellerPerformance(INITIAL_SELLERS, filteredOrders);
  }, [filteredOrders]);

  const runnerPerformance = useMemo(() => {
    return calculateRunnerPerformance(INITIAL_RUNNERS, filteredOrders);
  }, [filteredOrders]);

  const hubMetrics = useMemo(() => {
    return calculateGautengHubMetrics(filteredOrders, INITIAL_RUNNERS, SA_HUBS);
  }, [filteredOrders]);

  // Filtered orders for order monitor
  const monitoredOrders = useMemo(() => {
    return orders.filter(order => {
      // Status filter
      if (orderStatusFilter !== 'all') {
        if (orderStatusFilter === 'pending') {
          const isPending = ['new', 'payment_confirmed', 'confirmed', 'waiting_seller', 'packing', 'ready_for_pickup', 'waiting_runner'].includes(order.status);
          if (!isPending) return false;
        } else if (orderStatusFilter === 'in_transit') {
          const isInTransit = ['in_transit', 'runner_assigned'].includes(order.status);
          if (!isInTransit) return false;
        } else if (orderStatusFilter === 'issues') {
          const isIssue = ['failed', 'disputed', 'cancelled'].includes(order.status);
          if (!isIssue) return false;
        } else if (order.status !== orderStatusFilter) {
          return false;
        }
      }

      // Search query
      if (orderSearchQuery.trim()) {
        const q = orderSearchQuery.toLowerCase();
        const matchesId = order.id.toLowerCase().includes(q);
        const matchesCustomer = order.customer.fullName.toLowerCase().includes(q);
        const matchesSuburb = order.customer.suburb.toLowerCase().includes(q);
        const matchesItem = order.items.some(i => i.product.title.toLowerCase().includes(q));
        if (!matchesId && !matchesCustomer && !matchesSuburb && !matchesItem) return false;
      }

      return true;
    });
  }, [orders, orderStatusFilter, orderSearchQuery]);

  // Pending runner submissions count
  const pendingApprovalsCount = runnerSubmissions.filter(s => s.status === 'pending').length;
  const activeAlertsCount = alerts.filter(a => a.status === 'new' || a.status === 'acknowledged').length;

  // Role permissions check
  const canModifyFinancials = currentStaffRole === 'SUPER_ADMIN' || currentStaffRole === 'FINANCE';
  const canModifyOperations = currentStaffRole === 'SUPER_ADMIN' || currentStaffRole === 'OPERATIONS';
  const canViewFinancials = currentStaffRole === 'SUPER_ADMIN' || currentStaffRole === 'FINANCE' || currentStaffRole === 'OPERATIONS';

  // Submission actions
  const handleApproveSubmission = (submission: RunnerSubmission) => {
    const customPrice = editingSubmission?.id === submission.id ? editingSubmission.price : submission.suggestedPrice;
    const customStock = editingSubmission?.id === submission.id ? editingSubmission.stock : submission.stockCount;
    approveRunnerSubmission(submission.id, customPrice, customStock);
    setEditingSubmission(null);
  };

  const handleRejectConfirm = (submissionId: string) => {
    rejectRunnerSubmission(submissionId, rejectionReason);
    setRejectingId(null);
  };

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const variants = newSizes.trim() 
      ? [{ name: 'Size', options: newSizes.split(',').map(s => s.trim()).filter(Boolean) }] 
      : undefined;

    adminAddProduct({
      title: newTitle.trim(),
      category: newCategory,
      price: parseFloat(newPrice) || 399,
      originalPrice: newOriginalPrice ? parseFloat(newOriginalPrice) : undefined,
      stockCount: parseInt(newStock) || 5,
      description: newDescription,
      images: [selectedImage],
      variants,
      runnerId: newRunnerId,
      hub: newHub,
      condition: newCondition
    });

    setNewTitle('');
    setNewDescription('');
    setActiveTab('approvals');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* 1. TOP HEADER & OPERATIONAL CONTROL STRIP */}
      <div className="pb-6 border-b border-neutral-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('shop')}
              className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
              title="Return to marketplace"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-neutral-950 font-display">
                  JoziCart Operations & Analytics Center
                </h1>
                <span className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Live Feed Active</span>
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Centralized Gauteng commerce telemetry, real-time dispatch, financial reconciliation & operational control
              </p>
            </div>
          </div>

          {/* Role and Export Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Staff Role Switcher */}
            <div className="flex items-center gap-1.5 bg-neutral-100 border border-neutral-200 px-2.5 py-1.5 rounded-xl text-xs">
              <UserCheck className="w-3.5 h-3.5 text-neutral-600" />
              <span className="text-neutral-500 font-medium">Role:</span>
              <select
                value={currentStaffRole}
                onChange={(e) => setStaffRole(e.target.value as StaffRole)}
                className="bg-white border border-neutral-200 rounded px-2 py-0.5 font-bold text-neutral-900 text-xs focus:outline-none cursor-pointer"
              >
                <option value="SUPER_ADMIN">SUPER_ADMIN (Full Platform)</option>
                <option value="OPERATIONS">OPERATIONS (Dispatch & Logistics)</option>
                <option value="FINANCE">FINANCE (Payouts & Fees)</option>
                <option value="SUPPORT">SUPPORT (Customer & Orders)</option>
                <option value="SELLER">SELLER (Merchant View)</option>
                <option value="RUNNER">RUNNER (Courier View)</option>
              </select>
            </div>

            {/* CSV Export Dropdown */}
            <div className="relative group">
              <button
                className="px-3 py-1.5 bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                title="Download CSV Reports"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
              <div className="absolute right-0 mt-1 w-48 bg-white border border-neutral-200 rounded-xl shadow-lg p-1 hidden group-hover:block z-50 text-xs">
                <button
                  onClick={() => exportReportCSV('orders')}
                  className="w-full text-left px-3 py-2 hover:bg-neutral-50 rounded-lg text-neutral-800 font-medium"
                >
                  Export Orders Ledger
                </button>
                <button
                  onClick={() => exportReportCSV('financials')}
                  className="w-full text-left px-3 py-2 hover:bg-neutral-50 rounded-lg text-neutral-800 font-medium"
                >
                  Export Financials Reconciliation
                </button>
                <button
                  onClick={() => exportReportCSV('runners')}
                  className="w-full text-left px-3 py-2 hover:bg-neutral-50 rounded-lg text-neutral-800 font-medium"
                >
                  Export Runner Logistics
                </button>
                <button
                  onClick={() => exportReportCSV('sellers')}
                  className="w-full text-left px-3 py-2 hover:bg-neutral-50 rounded-lg text-neutral-800 font-medium"
                >
                  Export Seller Performance
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Date Range Controller Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
            <span className="text-neutral-500 font-semibold px-2">Time Horizon:</span>
            {[
              { id: 'today', label: 'Today (24h)' },
              { id: '7days', label: 'Last 7 Days' },
              { id: '30days', label: 'Last 30 Days' },
              { id: 'all', label: 'All Time' },
            ].map(range => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id as TimeRangeFilter)}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${timeRange === range.id ? 'bg-white text-neutral-950 shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'}`}
              >
                {range.label}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-neutral-500 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <span>Timezone: Africa/Johannesburg (SAST) · Data synchronized</span>
          </div>
        </div>
      </div>

      {/* 2. PRIMARY TAB NAVIGATION */}
      <div className="flex items-center gap-2 mt-6 mb-6 border-b border-neutral-200 text-xs font-semibold overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'overview' ? 'border-neutral-950 text-neutral-950 font-bold' : 'border-transparent text-neutral-500 hover:text-neutral-800'}`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Executive Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('orders-monitor')}
          className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'orders-monitor' ? 'border-neutral-950 text-neutral-950 font-bold' : 'border-transparent text-neutral-500 hover:text-neutral-800'}`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Real-Time Order Monitor</span>
          <span className="bg-neutral-100 text-neutral-800 font-mono px-1.5 py-0.2 rounded-full text-[10px]">
            {orders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('marketplace')}
          className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'marketplace' ? 'border-neutral-950 text-neutral-950 font-bold' : 'border-transparent text-neutral-500 hover:text-neutral-800'}`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Marketplace & Catalog</span>
        </button>

        <button
          onClick={() => setActiveTab('runners')}
          className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'runners' ? 'border-neutral-950 text-neutral-950 font-bold' : 'border-transparent text-neutral-500 hover:text-neutral-800'}`}
        >
          <Bike className="w-4 h-4" />
          <span>Runner Fleet & SLAs</span>
        </button>

        <button
          onClick={() => setActiveTab('hubs')}
          className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'hubs' ? 'border-neutral-950 text-neutral-950 font-bold' : 'border-transparent text-neutral-500 hover:text-neutral-800'}`}
        >
          <MapPin className="w-4 h-4" />
          <span>Gauteng Regional Hubs</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'alerts' ? 'border-neutral-950 text-neutral-950 font-bold' : 'border-transparent text-neutral-500 hover:text-neutral-800'}`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Operational Alerts</span>
          {activeAlertsCount > 0 && (
            <span className="bg-rose-500 text-white font-bold px-1.5 py-0.2 rounded-full text-[10px]">
              {activeAlertsCount}
            </span>
          )}
        </button>

        {canViewFinancials && (
          <button
            onClick={() => setActiveTab('finance')}
            className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'finance' ? 'border-neutral-950 text-neutral-950 font-bold' : 'border-transparent text-neutral-500 hover:text-neutral-800'}`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Financial Reconciliation</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'audit' ? 'border-neutral-950 text-neutral-950 font-bold' : 'border-transparent text-neutral-500 hover:text-neutral-800'}`}
        >
          <FileText className="w-4 h-4" />
          <span>Audit Log & Events</span>
        </button>

        <button
          onClick={() => setActiveTab('approvals')}
          className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'approvals' ? 'border-neutral-950 text-neutral-950 font-bold' : 'border-transparent text-neutral-500 hover:text-neutral-800'}`}
        >
          <Shirt className="w-4 h-4" />
          <span>Runner Approvals</span>
          {pendingApprovalsCount > 0 && (
            <span className="bg-amber-500 text-neutral-950 font-bold px-1.5 py-0.2 rounded-full text-[10px]">
              {pendingApprovalsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('add-product')}
          className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'add-product' ? 'border-neutral-950 text-neutral-950 font-bold' : 'border-transparent text-neutral-500 hover:text-neutral-800'}`}
        >
          <Plus className="w-4 h-4" />
          <span>Quick Add Item</span>
        </button>
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Primary Financial & Operational KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
              <span className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider block">
                Gross Merchandise Value (GMV)
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-neutral-950 font-display mt-1 block">
                R {metrics.gmv.toLocaleString()}
              </span>
              <div className="mt-2 text-[11px] text-neutral-500 flex items-center justify-between">
                <span>Avg Order Value:</span>
                <strong className="text-neutral-800 font-mono">R {metrics.averageOrderValue.toLocaleString()}</strong>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
              <span className="text-[11px] text-amber-700 font-semibold uppercase tracking-wider block">
                JoziCart Net Platform Revenue (8%)
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-amber-700 font-display mt-1 block">
                R {metrics.netPlatformRevenue.toLocaleString()}
              </span>
              <div className="mt-2 text-[11px] text-neutral-500 flex items-center justify-between">
                <span>Delivery fees collected:</span>
                <strong className="text-neutral-800 font-mono">R {metrics.totalDeliveryFees.toLocaleString()}</strong>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
              <span className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider block">
                Orders Volume & Fulfilment
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-neutral-950 font-display mt-1 block">
                {metrics.totalOrders}
              </span>
              <div className="mt-2 text-[11px] text-neutral-500 flex items-center gap-2">
                <span className="text-emerald-700 font-semibold">{metrics.completedOrders} delivered</span>
                <span>·</span>
                <span className="text-amber-700 font-semibold">{metrics.inTransitOrders} in transit</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
              <span className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider block">
                Marketplace Conversion Rate
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-neutral-950 font-display mt-1 block">
                {metrics.conversionRate}%
              </span>
              <div className="mt-2 text-[11px] text-neutral-500 flex items-center justify-between">
                <span>Active Buyers:</span>
                <strong className="text-neutral-800 font-mono">{metrics.activeBuyersCount}</strong>
              </div>
            </div>
          </div>

          {/* Financial Reconciliation Strip */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-neutral-950 font-display">
                  Financial Reconciliation & Ecosystem Distribution
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Strictly balances customer payments against merchant disbursals, courier compensation, and JoziCart take-rate.
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-neutral-600 bg-neutral-100 px-2 py-1 rounded">
                Audited & Reconciled
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200/80">
                <span className="text-neutral-500 font-medium block">Net Seller Disbursals (92%)</span>
                <span className="text-lg font-bold text-neutral-900 font-mono mt-1 block">
                  R {metrics.totalSellerDisbursals.toLocaleString()}
                </span>
                <span className="text-[11px] text-neutral-500 mt-1 block">
                  Owed to verified Gauteng merchants
                </span>
              </div>

              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200/80">
                <span className="text-neutral-500 font-medium block">Runner Payouts (R55 / Drop)</span>
                <span className="text-lg font-bold text-neutral-900 font-mono mt-1 block">
                  R {metrics.totalRunnerEarnings.toLocaleString()}
                </span>
                <span className="text-[11px] text-neutral-500 mt-1 block">
                  Compensates last-mile courier fleet
                </span>
              </div>

              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/80">
                <span className="text-amber-900 font-medium block">JoziCart Net Platform Margin</span>
                <span className="text-lg font-bold text-amber-950 font-mono mt-1 block">
                  R {(metrics.netPlatformRevenue + (metrics.totalDeliveryFees - metrics.totalRunnerEarnings)).toLocaleString()}
                </span>
                <span className="text-[11px] text-amber-800/80 mt-1 block">
                  Commission + Delivery fee delta
                </span>
              </div>
            </div>
          </div>

          {/* E-Commerce Funnel & Live Stream */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Buyer Conversion Funnel */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-neutral-950 font-display">
                Buyer Funnel & Purchase Momentum
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-medium mb-1">
                    <span className="text-neutral-600">Product Explorations / Views</span>
                    <span className="font-mono text-neutral-950">{metrics.funnelViews}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                    <div className="h-full bg-neutral-800 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-medium mb-1">
                    <span className="text-neutral-600">Added to Cart</span>
                    <span className="font-mono text-neutral-950">{metrics.funnelCartAdds}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full" 
                      style={{ width: `${Math.min(100, (metrics.funnelCartAdds / Math.max(1, metrics.funnelViews)) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-medium mb-1">
                    <span className="text-neutral-600">Checkout Initiated</span>
                    <span className="font-mono text-neutral-950">{metrics.funnelCheckouts}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                    <div 
                      className="h-full bg-neutral-700 rounded-full" 
                      style={{ width: `${Math.min(100, (metrics.funnelCheckouts / Math.max(1, metrics.funnelViews)) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-medium mb-1">
                    <span className="text-neutral-600">Completed Orders</span>
                    <span className="font-mono text-emerald-700 font-bold">{metrics.funnelPurchases}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                    <div 
                      className="h-full bg-emerald-600 rounded-full" 
                      style={{ width: `${Math.min(100, (metrics.funnelPurchases / Math.max(1, metrics.funnelViews)) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Operational Events Pulse */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-950 font-display flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>Real-Time Platform Event Stream</span>
                </h3>
                <span className="text-[11px] text-neutral-400 font-mono">
                  {events.length} events logged
                </span>
              </div>

              <div className="space-y-2.5 text-xs max-h-64 overflow-y-auto pr-1">
                {events.slice(0, 6).map(evt => (
                  <div key={evt.id} className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100 flex items-start justify-between gap-3">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-neutral-900 uppercase">
                          {evt.type.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {evt.resourceId}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-600 truncate">
                        Actor: {evt.actor} ({evt.role})
                      </p>
                    </div>
                    <span className="text-[10px] text-neutral-400 whitespace-nowrap">
                      {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REAL-TIME ORDER MONITOR */}
      {activeTab === 'orders-monitor' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-neutral-200">
            {/* Status Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {[
                { id: 'all', label: 'All Orders' },
                { id: 'pending', label: 'Pending Prep / Pickup' },
                { id: 'in_transit', label: 'In Transit' },
                { id: 'delivered', label: 'Delivered' },
                { id: 'issues', label: 'Issues & Disputes' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setOrderStatusFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${orderStatusFilter === f.id ? 'bg-neutral-950 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search Order ID, customer, suburb..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                className="w-full bg-neutral-100 pl-8 pr-3 py-1.5 rounded-lg text-xs text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:bg-white border border-transparent focus:border-neutral-300"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Order ID & Date</th>
                    <th className="py-3 px-4">Customer & Suburb</th>
                    <th className="py-3 px-4">Merchandise</th>
                    <th className="py-3 px-4">Total (ZAR)</th>
                    <th className="py-3 px-4">Assigned Runner</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {monitoredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-neutral-950">{order.id}</div>
                        <div className="text-[11px] text-neutral-400">
                          {new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-neutral-900">{order.customer.fullName}</div>
                        <div className="text-[11px] text-neutral-500">{order.customer.suburb}, {order.customer.city}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-neutral-800 font-medium">
                          {order.items.reduce((s, i) => s + i.quantity, 0)} {order.items.length === 1 ? 'item' : 'items'}
                        </div>
                        <div className="text-[11px] text-neutral-400 truncate max-w-xs">
                          {order.items.map(i => i.product.title).join(', ')}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-neutral-950 font-mono">R {order.total.toLocaleString()}</div>
                        <div className="text-[10px] text-neutral-400 uppercase">{order.paymentMethod}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        {order.runner ? (
                          <div>
                            <span className="font-semibold text-neutral-800">{order.runner.name}</span>
                            <span className="text-[10px] text-neutral-400 block">{order.runner.vehicle}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded">
                            Unassigned
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                          order.status === 'in_transit' ? 'bg-amber-100 text-amber-900' :
                          order.status === 'disputed' || order.status === 'failed' ? 'bg-rose-100 text-rose-800' :
                          'bg-neutral-100 text-neutral-800'
                        }`}>
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrderForDetail(order)}
                          className="px-2.5 py-1 text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                        >
                          Lifecycle View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Order Lifecycle Drawer */}
          {selectedOrderForDetail && (
            <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white max-w-2xl w-full rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <div>
                    <span className="font-mono text-xs font-bold text-neutral-400 uppercase">
                      Order Lifecycle Detail
                    </span>
                    <h2 className="text-xl font-bold text-neutral-950 font-display">
                      {selectedOrderForDetail.id}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedOrderForDetail(null)}
                    className="p-1 text-neutral-400 hover:text-neutral-800 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Status Timeline */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    Fulfillment Milestones
                  </h3>
                  <div className="space-y-2 text-xs">
                    {selectedOrderForDetail.trackingUpdates.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${step.completed ? 'bg-emerald-600 text-white' : 'bg-neutral-200 text-neutral-600'}`}>
                          {step.completed ? '✓' : idx + 1}
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900">{step.title}</p>
                          <p className="text-neutral-500 text-[11px]">{step.description}</p>
                          <span className="text-[10px] text-neutral-400">{step.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer & Delivery Pin */}
                <div className="grid grid-cols-2 gap-4 text-xs bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  <div>
                    <span className="text-[10px] text-neutral-400 font-bold uppercase block mb-1">Customer Address</span>
                    <p className="font-bold text-neutral-900">{selectedOrderForDetail.customer.fullName}</p>
                    <p className="text-neutral-600">{selectedOrderForDetail.customer.phone}</p>
                    <p className="text-neutral-500">{selectedOrderForDetail.customer.street}, {selectedOrderForDetail.customer.suburb}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 font-bold uppercase block mb-1">Security Handover OTP</span>
                    <p className="font-mono text-xl font-bold text-neutral-950 tracking-widest">{selectedOrderForDetail.otpCode}</p>
                    <p className="text-neutral-500 text-[10px] mt-1">Required by runner to complete drop</p>
                  </div>
                </div>

                {/* Role-Guarded Actions */}
                {canModifyOperations && (
                  <div className="border-t border-neutral-100 pt-4 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-neutral-600">
                      Operations Override:
                    </span>
                    <div className="flex items-center gap-2">
                      {selectedOrderForDetail.status !== 'delivered' && (
                        <button
                          onClick={() => {
                            updateOrderStatus(selectedOrderForDetail.id, 'delivered', 'Operations manual verification');
                            setSelectedOrderForDetail(null);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Force Mark Delivered
                        </button>
                      )}
                      {selectedOrderForDetail.status !== 'cancelled' && (
                        <button
                          onClick={() => {
                            updateOrderStatus(selectedOrderForDetail.id, 'cancelled', 'Cancelled by Operations Staff');
                            setSelectedOrderForDetail(null);
                          }}
                          className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MARKETPLACE & CATALOG PERFORMANCE */}
      {activeTab === 'marketplace' && (
        <div className="space-y-6">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xs">
            <h3 className="text-sm font-bold text-neutral-950 font-display mb-4">
              Item-by-Item Commercial Catalog Velocity
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Product Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Price</th>
                    <th className="py-2.5 px-3">Stock Status</th>
                    <th className="py-2.5 px-3">Views</th>
                    <th className="py-2.5 px-3">Units Sold</th>
                    <th className="py-2.5 px-3">GMV Generated</th>
                    <th className="py-2.5 px-3">Conversion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {productPerformance.map(prod => (
                    <tr key={prod.id} className="hover:bg-neutral-50/50">
                      <td className="py-3 px-3">
                        <span className="font-bold text-neutral-900 block">{prod.title}</span>
                        <span className="text-[11px] text-neutral-400">{prod.sellerName}</span>
                      </td>
                      <td className="py-3 px-3 capitalize text-neutral-600">{prod.category}</td>
                      <td className="py-3 px-3 font-mono font-semibold text-neutral-900">R {prod.price}</td>
                      <td className="py-3 px-3">
                        {prod.stockCount <= 5 ? (
                          <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
                            Low Stock ({prod.stockCount})
                          </span>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-medium">
                            {prod.stockCount} in stock
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-neutral-600">{prod.viewsCount}</td>
                      <td className="py-3 px-3 font-mono font-bold text-neutral-900">{prod.unitsSold}</td>
                      <td className="py-3 px-3 font-mono font-bold text-neutral-950">R {prod.totalGMV.toLocaleString()}</td>
                      <td className="py-3 px-3 font-mono text-neutral-700">{prod.conversionRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RUNNER FLEET & SLAS */}
      {activeTab === 'runners' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-neutral-200">
              <span className="text-xs text-neutral-500 font-medium block">Total Active Runners</span>
              <span className="text-2xl font-bold text-neutral-950 font-display mt-1 block">
                {INITIAL_RUNNERS.length} Couriers
              </span>
              <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
                100% Verified with clean background checks
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200">
              <span className="text-xs text-neutral-500 font-medium block">Average Gauteng Delivery Time</span>
              <span className="text-2xl font-bold text-neutral-950 font-display mt-1 block">
                38 Minutes
              </span>
              <span className="text-[11px] text-neutral-400 mt-1 block">
                From merchant pickup to customer handover
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200">
              <span className="text-xs text-neutral-500 font-medium block">Runner Rate / Drop</span>
              <span className="text-2xl font-bold text-neutral-950 font-display mt-1 block font-mono">
                R 55.00
              </span>
              <span className="text-[11px] text-neutral-400 mt-1 block">
                Guaranteed per completed delivery drop
              </span>
            </div>
          </div>

          {/* Runners Table */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xs">
            <h3 className="text-sm font-bold text-neutral-950 font-display mb-4">
              Runner Fleet Capacity & Real-Time Status
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Runner Name</th>
                    <th className="py-2.5 px-3">Hub & Vehicle</th>
                    <th className="py-2.5 px-3">Rating</th>
                    <th className="py-2.5 px-3">Completed Drops</th>
                    <th className="py-2.5 px-3">Active Runs</th>
                    <th className="py-2.5 px-3">Total Earnings</th>
                    <th className="py-2.5 px-3">Current Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {runnerPerformance.map(r => (
                    <tr key={r.id}>
                      <td className="py-3 px-3">
                        <span className="font-bold text-neutral-900 block">{r.name}</span>
                        <span className="text-[11px] text-neutral-400">{r.phone}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-neutral-800">{r.currentHub}</span>
                        <span className="text-[11px] text-neutral-400 block">{r.vehicle}</span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-amber-700">★ {r.rating.toFixed(1)}</td>
                      <td className="py-3 px-3 font-mono font-bold text-neutral-900">{r.deliveriesCompleted}</td>
                      <td className="py-3 px-3 font-mono text-neutral-600">{r.deliveriesActive}</td>
                      <td className="py-3 px-3 font-mono font-bold text-neutral-950">R {r.totalEarningsZAR.toLocaleString()}</td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          r.status === 'on_delivery' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {r.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GAUTENG REGIONAL HUBS */}
      {activeTab === 'hubs' && (
        <div className="space-y-6">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xs">
            <h3 className="text-sm font-bold text-neutral-950 font-display mb-1">
              Gauteng Fulfilment Node Coverage & Density
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              Monitors order volume vs courier capacity across Johannesburg and Pretoria service areas.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {hubMetrics.map((hub, idx) => (
                <div key={idx} className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-950 text-sm">{hub.hubName}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${hub.demandCapacityRatio > 2.0 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                      {hub.demandCapacityRatio > 2.0 ? 'High Demand' : 'Optimal'}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1 text-neutral-600">
                    <div className="flex justify-between">
                      <span>Order Volume:</span>
                      <strong className="text-neutral-900 font-mono">{hub.totalOrders} orders</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>GMV Volume:</span>
                      <strong className="text-neutral-900 font-mono">R {hub.gmv.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>On-Ground Runners:</span>
                      <strong className="text-neutral-900">{hub.activeRunners} couriers</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Delivery SLA:</span>
                      <strong className="text-neutral-900">{hub.averageSlaMinutes} mins</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: OPERATIONAL ALERTS */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-neutral-950 font-display">
                Automated Operational Incident Center
              </h2>
              <p className="text-xs text-neutral-500">
                Triggered automatically when orders or courier capacity breach configured operational thresholds.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {alerts.map(alert => (
              <div 
                key={alert.id}
                className={`bg-white border rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  alert.severity === 'critical' ? 'border-rose-200 bg-rose-50/20' : 
                  alert.severity === 'warning' ? 'border-amber-200 bg-amber-50/20' : 
                  'border-neutral-200'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-neutral-400">{alert.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      alert.severity === 'critical' ? 'bg-rose-100 text-rose-800' :
                      alert.severity === 'warning' ? 'bg-amber-100 text-amber-900' :
                      'bg-neutral-100 text-neutral-700'
                    }`}>
                      {alert.severity}
                    </span>
                    <span className="text-[10px] text-neutral-400 uppercase font-semibold">{alert.category}</span>
                    <span className="text-[11px] text-neutral-400">· {alert.createdAt}</span>
                  </div>

                  <h4 className="text-sm font-bold text-neutral-950">{alert.title}</h4>
                  <p className="text-xs text-neutral-600">{alert.description}</p>

                  {alert.resolutionNotes && (
                    <p className="text-[11px] text-emerald-700 font-medium pt-1">
                      Resolution Note: {alert.resolutionNotes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {alert.status === 'new' && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id, 'Dispatch Desk')}
                      className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Acknowledge
                    </button>
                  )}

                  {alert.status !== 'resolved' && (
                    <button
                      onClick={() => setResolvingAlertId(alert.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Resolve
                    </button>
                  )}

                  {alert.status === 'resolved' && (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      Resolved
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Resolve Modal */}
          {resolvingAlertId && (
            <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
                <h3 className="text-sm font-bold text-neutral-950">
                  Resolve Operational Incident
                </h3>
                <textarea
                  rows={3}
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  className="w-full border border-neutral-300 rounded-lg p-2 text-xs text-neutral-900 focus:outline-none"
                  placeholder="Operational resolution details..."
                ></textarea>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setResolvingAlertId(null)}
                    className="px-3 py-1.5 border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      resolveAlert(resolvingAlertId, resolutionText);
                      setResolvingAlertId(null);
                    }}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                  >
                    Confirm Resolution
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 7: FINANCIAL RECONCILIATION */}
      {activeTab === 'finance' && canViewFinancials && (
        <div className="space-y-6">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-950 font-display">
              General Ledger Transaction Reconciliation
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Order Ref</th>
                    <th className="py-2.5 px-3">Total Paid</th>
                    <th className="py-2.5 px-3">Delivery Fee</th>
                    <th className="py-2.5 px-3">JoziCart 8% Take-Rate</th>
                    <th className="py-2.5 px-3">Seller Net</th>
                    <th className="py-2.5 px-3">Runner Fee</th>
                    <th className="py-2.5 px-3">Payout Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-mono">
                  {orders.map(o => {
                    const commission = Math.round(o.subtotal * 0.08);
                    const sellerNet = Math.round(o.subtotal * 0.92);

                    return (
                      <tr key={o.id}>
                        <td className="py-3 px-3 font-bold text-neutral-900">{o.id}</td>
                        <td className="py-3 px-3 font-bold text-neutral-950">R {o.total}</td>
                        <td className="py-3 px-3 text-neutral-600">R {o.deliveryFee}</td>
                        <td className="py-3 px-3 text-amber-700 font-bold">R {commission}</td>
                        <td className="py-3 px-3 text-neutral-800">R {sellerNet}</td>
                        <td className="py-3 px-3 text-neutral-600">R 55</td>
                        <td className="py-3 px-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            o.payoutStatus === 'cleared' ? 'bg-emerald-100 text-emerald-800' :
                            o.payoutStatus === 'held' ? 'bg-rose-100 text-rose-800' :
                            'bg-neutral-100 text-neutral-700'
                          }`}>
                            {o.payoutStatus || 'pending'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: AUDIT LOG & EVENTS */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-950 font-display">
              Administrative & Operational Audit Ledger (Append-Only)
            </h3>
            <div className="space-y-3 text-xs">
              {auditLogs.map(log => (
                <div key={log.id} className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-neutral-400">{log.id}</span>
                      <strong className="text-neutral-950 uppercase">{log.action}</strong>
                      <span className="text-[10px] bg-neutral-200 text-neutral-700 px-1.5 py-0.2 rounded font-mono">
                        {log.resourceType}:{log.resourceId}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-600 mt-1">{log.notes}</p>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="font-semibold text-neutral-800 block">{log.actorName} ({log.actorRole})</span>
                    <span className="text-[10px] text-neutral-400">{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: RUNNER PRODUCT & CLOTHES APPROVALS */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-neutral-200">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-neutral-500" />
              <span className="text-xs font-semibold text-neutral-700">Filter Submissions:</span>
              <div className="flex items-center gap-1">
                {(['pending', 'approved', 'rejected', 'all'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setSubmissionFilter(f)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${submissionFilter === f ? 'bg-neutral-950 text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}
                  >
                    {f} {f === 'pending' && pendingApprovalsCount > 0 ? `(${pendingApprovalsCount})` : ''}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveTab('add-product')}
              className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 w-fit cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Direct Add Item</span>
            </button>
          </div>

          <div className="space-y-4">
            {runnerSubmissions.filter(s => submissionFilter === 'all' || s.status === submissionFilter).map(sub => (
              <div
                key={sub.id}
                className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row items-start gap-4"
              >
                <img
                  src={sub.images[0]}
                  alt={sub.title}
                  className="w-24 h-24 rounded-xl object-cover border border-neutral-200 shrink-0"
                />

                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-neutral-400">{sub.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${sub.status === 'pending' ? 'bg-amber-100 text-amber-900' : sub.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {sub.status}
                    </span>
                    <span className="text-[11px] text-neutral-500 font-medium">Condition: <strong className="text-neutral-800">{sub.condition}</strong></span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-950">{sub.title}</h3>
                  <p className="text-xs text-neutral-600">{sub.description}</p>
                  <p className="text-[11px] text-neutral-500">
                    Sourced by: <strong>Runner {sub.runnerName}</strong> · Hub: <strong>{sub.runnerHub}</strong>
                  </p>
                </div>

                <div className="w-full md:w-56 text-left md:text-right border-t md:border-t-0 md:border-l border-neutral-200 pt-3 md:pt-0 md:pl-4 space-y-3 shrink-0">
                  <span className="text-xl font-bold text-neutral-950 font-display block">
                    R {sub.suggestedPrice.toLocaleString()}
                  </span>

                  {sub.status === 'pending' && (
                    <div className="space-y-2">
                      <button
                        onClick={() => handleApproveSubmission(sub)}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>1-Click Approve & Publish</span>
                      </button>

                      <button
                        onClick={() => setRejectingId(sub.id)}
                        className="w-full py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {sub.status === 'approved' && (
                    <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg block text-center">
                      Live on Marketplace
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Rejection Modal */}
          {rejectingId && (
            <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
                <h3 className="text-sm font-bold text-neutral-950">
                  Reject Runner Submission
                </h3>
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full border border-neutral-300 rounded-lg p-2 text-xs text-neutral-900"
                >
                  <option value="Price needs adjustment for Gauteng retail">Price needs adjustment for Gauteng retail</option>
                  <option value="Need clearer photos with natural studio lighting">Need clearer photos with natural studio lighting</option>
                  <option value="Item condition does not meet quality threshold">Item condition does not meet quality threshold</option>
                  <option value="Duplicate listing already active on marketplace">Duplicate listing already active on marketplace</option>
                </select>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setRejectingId(null)}
                    className="px-4 py-2 border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRejectConfirm(rejectingId)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 10: QUICK ADD ITEM */}
      {activeTab === 'add-product' && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <h2 className="text-lg font-bold text-neutral-950 font-display">
              Direct Product & Clothes Publisher
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Instantly publish fresh inventory directly into the live marketplace.
            </p>
          </div>

          <form onSubmit={handleQuickAddSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg p-2 text-neutral-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ProductCategory)}
                  className="w-full border border-neutral-200 rounded-lg p-2 text-neutral-900 bg-white"
                >
                  <option value="fashion">Streetwear & Apparel</option>
                  <option value="sneakers">Sneakers & Footwear</option>
                  <option value="accessories">Watches & Eyewear</option>
                  <option value="leather">Handcrafted Leather</option>
                  <option value="electronics">Audio & Electronics</option>
                  <option value="home">Home & Living</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Price (ZAR)</label>
                <input
                  type="number"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg p-2 text-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Stock Count</label>
                <input
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg p-2 text-neutral-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Description</label>
              <textarea
                rows={3}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full border border-neutral-200 rounded-lg p-2 text-neutral-900"
              ></textarea>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white font-bold rounded-xl cursor-pointer"
              >
                Publish to JoziCart Marketplace
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
