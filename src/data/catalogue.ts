import { Product, Seller, Runner, Order, RunnerSubmission, MarketplaceEvent, AuditLogEntry, OperationalAlert, SouthAfricanProvince, DeliveryType, InterprovincialCorridor } from '../types';

import heroImg from '../assets/images/jozi_hero_fashion_1790857952409.jpg';
import sneakerImg from '../assets/images/product_sneakers_1790857966199.jpg';
import headphoneImg from '../assets/images/product_headphones_1790857977522.jpg';
import serumImg from '../assets/images/product_serum_1790857990478.jpg';
import hoodieImg from '../assets/images/product_hoodie_1790858004350.jpg';
import mugImg from '../assets/images/product_mug_1790858022404.jpg';
import watchImg from '../assets/images/product_watch_1790858034295.jpg';
import walletImg from '../assets/images/product_wallet_1790858047317.jpg';
import sunglassesImg from '../assets/images/product_sunglasses_1790858086226.jpg';
import candleImg from '../assets/images/product_candle_1790858100396.jpg';

export { heroImg };

export const INITIAL_SELLERS: Seller[] = [
  {
    id: 'seller-1',
    name: 'Urban Stitch Co.',
    hub: 'Maboneng Precinct, Johannesburg',
    city: 'Johannesburg',
    province: 'Gauteng',
    rating: 4.9,
    ordersFulfilled: 342,
    verified: true,
    joinedYear: 2023,
  },
  {
    id: 'seller-2',
    name: 'Kasi Sneaker Lab',
    hub: 'Braamfontein, Johannesburg',
    city: 'Johannesburg',
    province: 'Gauteng',
    rating: 4.8,
    ordersFulfilled: 512,
    verified: true,
    joinedYear: 2022,
  },
  {
    id: 'seller-3',
    name: 'Aura Acoustics',
    hub: 'Sandton City, Johannesburg',
    city: 'Johannesburg',
    province: 'Gauteng',
    rating: 4.9,
    ordersFulfilled: 289,
    verified: true,
    joinedYear: 2023,
  },
  {
    id: 'seller-4',
    name: 'Botanica Fynbos & Clay',
    hub: 'Rosebank, Johannesburg',
    city: 'Johannesburg',
    province: 'Gauteng',
    rating: 5.0,
    ordersFulfilled: 198,
    verified: true,
    joinedYear: 2024,
  },
  {
    id: 'seller-5',
    name: 'Highveld Leather Goods',
    hub: 'Cullinan / Pretoria',
    city: 'Pretoria',
    province: 'Gauteng',
    rating: 4.9,
    ordersFulfilled: 410,
    verified: true,
    joinedYear: 2021,
  },
  {
    id: 'seller-6',
    name: 'Joburg Artisans & Home',
    hub: '4th Avenue Parkhurst, Johannesburg',
    city: 'Johannesburg',
    province: 'Gauteng',
    rating: 4.8,
    ordersFulfilled: 165,
    verified: true,
    joinedYear: 2023,
  },
  {
    id: 'seller-7',
    name: 'Table Mountain Atelier',
    hub: 'Kloof Street, Cape Town',
    city: 'Cape Town',
    province: 'Western Cape',
    rating: 4.9,
    ordersFulfilled: 310,
    verified: true,
    joinedYear: 2023,
  },
  {
    id: 'seller-8',
    name: 'Durban Coastal Threads',
    hub: 'Florida Road, Durban',
    city: 'Durban',
    province: 'KwaZulu-Natal',
    rating: 4.8,
    ordersFulfilled: 245,
    verified: true,
    joinedYear: 2023,
  },
  {
    id: 'seller-9',
    name: 'Karoo Merino & Leather',
    hub: 'Bram Fischer Hub, Bloemfontein',
    city: 'Bloemfontein',
    province: 'Free State',
    rating: 4.8,
    ordersFulfilled: 180,
    verified: true,
    joinedYear: 2023,
  },
  {
    id: 'seller-10',
    name: 'Algoa Bay Surf & Apparel',
    hub: 'Humewood / Boardwalk, Gqeberha',
    city: 'Gqeberha (Port Elizabeth)',
    province: 'Eastern Cape',
    rating: 4.9,
    ordersFulfilled: 195,
    verified: true,
    joinedYear: 2023,
  },
];

export const INITIAL_RUNNERS: Runner[] = [
  {
    id: 'run-1',
    name: 'Sipho Mabena',
    phone: '+27 82 459 1024',
    vehicle: 'Motorbike',
    currentHub: 'Rosebank Hub (Gauteng)',
    province: 'Gauteng',
    runnerType: 'metro_runner',
    rating: 4.9,
    deliveriesCompleted: 620,
    status: 'available',
  },
  {
    id: 'run-2',
    name: 'Lindiwe Khumalo',
    phone: '+27 71 883 9401',
    vehicle: 'Motorbike',
    currentHub: 'Maboneng / CBD Hub (Gauteng)',
    province: 'Gauteng',
    runnerType: 'metro_runner',
    rating: 5.0,
    deliveriesCompleted: 485,
    status: 'on_delivery',
  },
  {
    id: 'run-3',
    name: 'Tshepo Nkosi',
    phone: '+27 83 204 7715',
    vehicle: 'Vehicle',
    currentHub: 'Sandton / Fourways Hub (Gauteng)',
    province: 'Gauteng',
    runnerType: 'linehaul_liaison',
    rating: 4.8,
    deliveriesCompleted: 340,
    status: 'available',
  },
  {
    id: 'run-4',
    name: 'Chadwick Pietersen',
    phone: '+27 79 312 8840',
    vehicle: 'Motorbike',
    currentHub: 'Cape Town CBD & Waterfront (Western Cape)',
    province: 'Western Cape',
    runnerType: 'metro_runner',
    rating: 4.9,
    deliveriesCompleted: 412,
    status: 'available',
  },
  {
    id: 'run-5',
    name: 'Bongani Cele',
    phone: '+27 84 901 3320',
    vehicle: 'Motorbike',
    currentHub: 'Durban Central & Umhlanga (KZN)',
    province: 'KwaZulu-Natal',
    runnerType: 'metro_runner',
    rating: 4.9,
    deliveriesCompleted: 380,
    status: 'available',
  },
  {
    id: 'run-6',
    name: 'Akhona Mini',
    phone: '+27 76 512 4490',
    vehicle: 'Motorbike',
    currentHub: 'Chief Dawid Stuurman Hub (Eastern Cape)',
    province: 'Eastern Cape',
    runnerType: 'metro_runner',
    rating: 4.8,
    deliveriesCompleted: 210,
    status: 'available',
  },
  {
    id: 'run-7',
    name: 'Kobus Van Zyl',
    phone: '+27 82 991 3004',
    vehicle: 'Vehicle',
    currentHub: 'Bloemfontein Central Hub (Free State)',
    province: 'Free State',
    runnerType: 'linehaul_liaison',
    rating: 4.9,
    deliveriesCompleted: 275,
    status: 'available',
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Highveld Retro Leather Lows',
    category: 'sneakers',
    price: 899,
    originalPrice: 1199,
    discountPercent: 25,
    description: 'Constructed from full-grain bovine leather with cushioned rubber cupsole and breathable canvas lining. Designed for walking Johannesburg streets with effortless urban style.',
    highlights: [
      'Genuine full-grain leather upper with suede trim',
      'Gum rubber high-traction tread for urban durability',
      'Ortholite memory foam insole for all-day comfort',
      'Handcrafted in small batches in Braamfontein'
    ],
    specs: {
      'Upper': 'Full-grain calf leather',
      'Sole': 'Natural vulcanized gum rubber',
      'Fit': 'True to UK shoe size',
      'Care': 'Wipe clean with damp cloth and leather balm'
    },
    images: [sneakerImg],
    seller: INITIAL_SELLERS[1],
    inStock: true,
    stockCount: 14,
    variants: [
      { name: 'Size', options: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'] },
      { name: 'Color', options: ['Forest Green / Chalk', 'Triple White', 'Navy / Gum'] }
    ],
    badge: 'Trending in Jozi',
    tags: ['sneakers', 'shoes', 'footwear', 'leather', 'braamfontein'],
    estimatedDeliveryDays: 1,
  },
  {
    id: 'prod-2',
    title: 'Aura Studio Wireless ANC Headphones',
    category: 'electronics',
    price: 1450,
    originalPrice: 1899,
    discountPercent: 23,
    description: 'Immersive sound engineering with 40mm beryllium drivers and hybrid active noise cancellation. 38 hours playback on a single USB-C charge with ultra-plush memory foam earcups.',
    highlights: [
      'Hybrid Active Noise Cancellation (-35dB attenuation)',
      '38-Hour battery life + 10-minute fast charge for 4h play',
      'Bluetooth 5.3 with multi-point device pairing',
      'Foldable aluminum & vegan protein leather architecture'
    ],
    specs: {
      'Driver Size': '40mm High-Resolution Beryllium',
      'Frequency': '10Hz – 40,000Hz',
      'Weight': '248g',
      'Warranty': '12-Month JoziCart replacement guarantee'
    },
    images: [headphoneImg],
    seller: INITIAL_SELLERS[2],
    inStock: true,
    stockCount: 8,
    variants: [
      { name: 'Colorway', options: ['Matte Charcoal', 'Brushed Platinum', 'Desert Sand'] }
    ],
    badge: 'Next-Day Delivery',
    tags: ['audio', 'headphones', 'bluetooth', 'gadgets', 'sandton'],
    estimatedDeliveryDays: 1,
  },
  {
    id: 'prod-3',
    title: 'Cape Botanicals Marula & Rosehip Glow Serum',
    category: 'beauty',
    price: 340,
    originalPrice: 420,
    discountPercent: 19,
    description: 'Cold-pressed virgin wild marula seed oil infused with organic rosehip, bakuchiol, and vitamin C. Restores cellular moisture, repairs urban barrier stress, and imparts a natural non-greasy glow.',
    highlights: [
      '100% African cold-pressed botanicals (Marula, Kalahari Melon)',
      'Gentle plant-derived bakuchiol (natural retinol alternative)',
      'Sustainably hand-harvested by local rural cooperatives',
      'Formulated without synthetic fragrance, parabens, or sulfates'
    ],
    specs: {
      'Volume': '30ml Amber Dropper Bottle',
      'Skin Types': 'All types including sensitive and dehydrated',
      'Application': '2-3 drops morning and evening onto damp skin',
      'Shelf Life': '18 months after opening'
    },
    images: [serumImg],
    seller: INITIAL_SELLERS[3],
    inStock: true,
    stockCount: 22,
    badge: 'Top Seller in Skincare',
    tags: ['beauty', 'skincare', 'serum', 'organic', 'fynbos', 'rosebank'],
    estimatedDeliveryDays: 1,
  },
  {
    id: 'prod-4',
    title: 'Heavyweight Cotton Oversized Boxy Hoodie',
    category: 'fashion',
    price: 680,
    originalPrice: 850,
    discountPercent: 20,
    description: 'A custom 460gsm organic French terry cotton hoodie cut in a structured, dropped-shoulder silhouette. Preshrunk for lifetime wash stability and finished with deep ribbing.',
    highlights: [
      'Heavyweight 460gsm 100% combed African cotton terry',
      'Generous double-layered hood without drawstring clutter',
      'Reinforced bar-tack stitching on kangaroo pocket',
      'Garment-dyed in Sage for a soft matte vintage drape'
    ],
    specs: {
      'Fabric': '100% Combed African Cotton (460gsm)',
      'Fit': 'Oversized boxy silhouette (order normal size)',
      'Manufacture': 'Patterned & crafted in Maboneng, JHB',
      'Care': 'Machine wash cold, lay flat to dry'
    },
    images: [hoodieImg],
    seller: INITIAL_SELLERS[0],
    inStock: true,
    stockCount: 19,
    variants: [
      { name: 'Size', options: ['S', 'M', 'L', 'XL', 'XXL'] },
      { name: 'Color', options: ['Sage Green', 'Washed Wasabi', 'Obsidian Black', 'Raw Ecru'] }
    ],
    badge: 'Local Designer',
    tags: ['fashion', 'streetwear', 'hoodie', 'apparel', 'maboneng'],
    estimatedDeliveryDays: 1,
  },
  {
    id: 'prod-5',
    title: 'Speckled Stoneware Mug & Pour-Over Dripper',
    category: 'home',
    price: 395,
    originalPrice: 480,
    discountPercent: 17,
    description: 'Wheel-thrown speckled high-fire stoneware with a satin dolomite glaze. Custom shaped for optimal thermal retention and seamless coffee extraction.',
    highlights: [
      'Individual wheel-thrown pottery by Parkhurst ceramicists',
      'Fits standard V60 or wave paper filters',
      'Microwave and dishwasher safe high-temperature stoneware',
      '400ml generous everyday morning coffee capacity'
    ],
    specs: {
      'Material': 'Highveld stoneware clay, lead-free glaze',
      'Capacity': '400ml (13.5 oz)',
      'Origin': 'Parkhurst, Johannesburg',
      'Care': 'Dishwasher safe'
    },
    images: [mugImg],
    seller: INITIAL_SELLERS[5],
    inStock: true,
    stockCount: 11,
    badge: 'Artisanal Batch',
    tags: ['home', 'kitchen', 'ceramics', 'coffee', 'handmade', 'parkhurst'],
    estimatedDeliveryDays: 2,
  },
  {
    id: 'prod-6',
    title: 'Apex Sub-Zero Chronograph Watch',
    category: 'accessories',
    price: 1850,
    originalPrice: 2300,
    discountPercent: 19,
    description: 'Precision Japanese quartz movement housed in a 41mm 316L matte black surgical stainless steel casing with sapphire crystal glass and an interchangeable saddle leather strap.',
    highlights: [
      'Scratch-resistant anti-reflective Sapphire crystal lens',
      'Sub-dial 60-second and 30-minute stopwatch precision',
      '50-Meter water resistance (5 ATM)',
      'Full-grain vegetable-tanned leather strap with quick release'
    ],
    specs: {
      'Case Diameter': '41mm',
      'Case Thickness': '10.2mm',
      'Movement': 'Miyota Chronograph Quartz',
      'Band Width': '20mm'
    },
    images: [watchImg],
    seller: INITIAL_SELLERS[2],
    inStock: true,
    stockCount: 6,
    variants: [
      { name: 'Strap Color', options: ['Saddle Brown Leather', 'Matte Black Steel Mesh', 'Olive Military Canvas'] }
    ],
    badge: 'Limited Stock',
    tags: ['watch', 'accessories', 'chronograph', 'leather', 'sandton'],
    estimatedDeliveryDays: 1,
  },
  {
    id: 'prod-7',
    title: 'Handstitched Vegetable-Tanned Bifold Wallet',
    category: 'leather',
    price: 490,
    originalPrice: 590,
    discountPercent: 16,
    description: 'Cut from 1.6mm Badalassi Carlo vegetable-tanned pull-up leather, saddle-stitched by hand with bonded nylon thread. Will develop a rich, lustrous patina with every passing month.',
    highlights: [
      '100% Genuine vegetable-tanned pull-up bovine leather',
      'Holds 8-10 cards plus folded Rand banknotes easily',
      'Burnished edges finished with natural beeswax',
      'Guaranteed lifetime stitching repair warranty'
    ],
    specs: {
      'Dimensions': '11cm x 8.5cm closed',
      'Leather': 'Vegetable-tanned full grain',
      'Stitching': 'Traditional hand saddle stitch',
      'Crafted in': 'Cullinan Workshop, Gauteng'
    },
    images: [walletImg],
    seller: INITIAL_SELLERS[4],
    inStock: true,
    stockCount: 15,
    variants: [
      { name: 'Leather Finish', options: ['Caramel Tan', 'Dark Walnut', 'Midnight Navy'] }
    ],
    badge: 'Lifetime Stitch Guarantee',
    tags: ['leather', 'wallet', 'handmade', 'accessories', 'pretoria'],
    estimatedDeliveryDays: 1,
  },
  {
    id: 'prod-8',
    title: 'Maboneng Polarized Acetate Sunglasses',
    category: 'accessories',
    price: 620,
    originalPrice: 780,
    discountPercent: 20,
    description: 'Italian Mazzucchelli hand-polished acetate frames featuring Category 3 TAC polarized lenses with 100% UV400 solar protection. Engineered for South African sunshine.',
    highlights: [
      '100% UV400 polarized Category 3 glare-reducing lenses',
      'Hand-shaped cellulose acetate with stainless steel wire cores',
      'Five-barrel hinges for smooth tension and lifetime durability',
      'Includes rigid microfibre protective fold case & cloth'
    ],
    specs: {
      'Lens Width': '51mm',
      'Bridge': '20mm',
      'Temple Length': '145mm',
      'Protection': 'UV400 Polarized (Cat 3)'
    },
    images: [sunglassesImg],
    seller: INITIAL_SELLERS[0],
    inStock: true,
    stockCount: 17,
    variants: [
      { name: 'Frame Hue', options: ['Classic Tortoiseshell', 'Matte Jet Black', 'Smoked Honey Amber'] }
    ],
    badge: 'Popular in Gauteng',
    tags: ['sunglasses', 'eyewear', 'fashion', 'accessories', 'maboneng'],
    estimatedDeliveryDays: 1,
  },
  {
    id: 'prod-9',
    title: 'Highveld Rooibos & Vanilla Bean Soy Candle',
    category: 'home',
    price: 260,
    originalPrice: 320,
    discountPercent: 18,
    description: 'Hand-poured 100% soy wax infused with botanical extracts of Cederberg red bush rooibos, crushed vanilla pods, and warm African cedarwood. Clean, soot-free 55-hour burn.',
    highlights: [
      '55-Hour clean burn with lead-free natural crackling wooden wick',
      'Artisanal terracotta vessel that can be repurposed as a succulent planter',
      'Essential oils blended with natural botanicals',
      'Handmade in Parkhurst studio'
    ],
    specs: {
      'Wax': '100% Non-GMO Soy Wax',
      'Weight': '280g',
      'Burn Time': '50 - 55 hours',
      'Scent Profile': 'Smoked Rooibos, Bourbon Vanilla, Amber'
    },
    images: [candleImg],
    seller: INITIAL_SELLERS[5],
    inStock: true,
    stockCount: 25,
    badge: 'Locally Sourced',
    tags: ['candle', 'home', 'fragrance', 'rooibos', 'parkhurst'],
    estimatedDeliveryDays: 2,
  },
  {
    id: 'prod-10',
    title: 'Kloof Street Linen Resort Shirt',
    category: 'fashion',
    price: 740,
    originalPrice: 890,
    discountPercent: 17,
    description: 'Breezy washed Belgian flax linen tailored in Cape Town. Relaxed camp collar with authentic mother-of-pearl buttons. Perfect for coastal summers and urban warmth.',
    highlights: [
      '100% Breathable European flax linen certified OEKO-TEX',
      'Pre-washed for relaxed drape and zero shrinkage',
      'Single chest pocket and curved hemline',
      'Tailored in small batches on Kloof Street, Cape Town'
    ],
    specs: {
      'Fabric': '100% Washed Linen (170gsm)',
      'Fit': 'Relaxed Casual Fit',
      'Buttons': 'Real Trocas Shell',
      'Origin': 'Cape Town, Western Cape'
    },
    images: [hoodieImg],
    seller: INITIAL_SELLERS[6],
    inStock: true,
    stockCount: 16,
    variants: [
      { name: 'Size', options: ['S', 'M', 'L', 'XL', 'XXL'] },
      { name: 'Color', options: ['Atlantic Seafoam', 'Oatmeal Natural', 'Deep Navy'] }
    ],
    badge: 'Western Cape Artisan',
    tags: ['fashion', 'linen', 'shirt', 'capetown', 'coastal'],
    estimatedDeliveryDays: 2,
  },
  {
    id: 'prod-11',
    title: 'Durban Coastal Heavy French Terry Sweatshorts',
    category: 'fashion',
    price: 520,
    originalPrice: 650,
    discountPercent: 20,
    description: 'Crafted from 400gsm heavyweight African cotton looped terry with a comfortable elasticated waistband, brass eyelets, and raw-edge hem.',
    highlights: [
      '400gsm Premium African cotton french terry',
      'Deep side pockets and reinforced back patch pocket',
      'Heavy cotton drawstring with brass aglets',
      'Designed and milled in Durban, KwaZulu-Natal'
    ],
    specs: {
      'Material': '100% Combed Cotton Terry',
      'Inseam': '7 Inches',
      'Care': 'Cold machine wash',
      'Origin': 'Florida Road, Durban (KZN)'
    },
    images: [hoodieImg],
    seller: INITIAL_SELLERS[7],
    inStock: true,
    stockCount: 18,
    variants: [
      { name: 'Size', options: ['S', 'M', 'L', 'XL'] },
      { name: 'Color', options: ['Washed Black', 'Sand Dune', 'Forest'] }
    ],
    badge: 'KZN Coastal Lab',
    tags: ['shorts', 'streetwear', 'durban', 'kzn', 'apparel'],
    estimatedDeliveryDays: 2,
  },
  {
    id: 'prod-12',
    title: 'Karoo Merino Wool Minimalist Throw Blanket',
    category: 'home',
    price: 1150,
    originalPrice: 1450,
    discountPercent: 21,
    description: 'Pure virgin merino wool fleece sourced ethically from Free State Karoo farms. Exceptionally soft, lightweight yet insulating with hand-twisted fringe borders.',
    highlights: [
      '100% Sustainable Free State virgin merino wool',
      'Non-scratch ultra-fine 21-micron spinning',
      'Natural temperature-regulating properties',
      'Woven in historical Bloemfontein mills'
    ],
    specs: {
      'Size': '140cm x 180cm',
      'Weight': '820g',
      'Weave': 'Herringbone twill',
      'Origin': 'Bloemfontein, Free State'
    },
    images: [candleImg],
    seller: INITIAL_SELLERS[8],
    inStock: true,
    stockCount: 10,
    badge: 'Free State Heritage',
    tags: ['home', 'blanket', 'wool', 'karoo', 'bloemfontein'],
    estimatedDeliveryDays: 3,
  },
  {
    id: 'prod-13',
    title: 'Algoa Bay Waxed Canvas Weekender Duffle',
    category: 'leather',
    price: 1280,
    originalPrice: 1600,
    discountPercent: 20,
    description: 'Rugged 18oz heavy waxed water-repellent cotton canvas complemented with vegetable-tanned bovine leather straps and solid antique brass YKK zips.',
    highlights: [
      'Weatherproof 18oz paraffin-waxed duck canvas',
      'Full-grain leather carry handles and removable shoulder strap',
      'Compliant with domestic airline cabin baggage regulations',
      'Handcrafted in Gqeberha, Eastern Cape'
    ],
    specs: {
      'Capacity': '42 Litres',
      'Dimensions': '52cm x 30cm x 26cm',
      'Hardware': 'Solid Brass YKK #10',
      'Origin': 'Gqeberha, Eastern Cape'
    },
    images: [walletImg],
    seller: INITIAL_SELLERS[9],
    inStock: true,
    stockCount: 11,
    badge: 'Eastern Cape Studio',
    tags: ['bag', 'travel', 'leather', 'canvas', 'gqeberha'],
    estimatedDeliveryDays: 2,
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'JC-84920',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        selectedVariant: { Size: 'UK 9', Color: 'Forest Green / Chalk' }
      },
      {
        product: INITIAL_PRODUCTS[2],
        quantity: 1
      }
    ],
    subtotal: 1239,
    deliveryFee: 95,
    discount: 0,
    total: 1334,
    platformFee: 99,
    sellerPayout: 1140,
    runnerFee: 55,
    deliveryType: 'local_runner',
    route: {
      originProvince: 'Gauteng',
      originCity: 'Johannesburg',
      destinationProvince: 'Gauteng',
      destinationCity: 'Johannesburg',
      isInterprovincial: false,
    },
    customer: {
      fullName: 'Nompumelelo Dlamini',
      email: 'nompumelelo@example.co.za',
      phone: '+27 72 884 1992',
      street: '42 Oxford Road, Block B',
      suburb: 'Rosebank',
      city: 'Johannesburg',
      province: 'Gauteng',
      postalCode: '2196',
      deliveryNotes: 'Leave at security reception desk'
    },
    deliveryMethod: 'express',
    paymentMethod: 'instant_eft',
    status: 'in_transit',
    payoutStatus: 'pending',
    runner: INITIAL_RUNNERS[0],
    trackingUpdates: [
      {
        status: 'payment_confirmed',
        title: 'Payment Confirmed',
        description: 'Payment verified via Capitec Pay / Instant EFT',
        timestamp: 'Today, 08:15 AM',
        completed: true,
      },
      {
        status: 'packing',
        title: 'Prepared by Sellers',
        description: 'Packed by Kasi Sneaker Lab & Botanica Fynbos',
        timestamp: 'Today, 09:30 AM',
        completed: true,
      },
      {
        status: 'runner_assigned',
        title: 'JoziCart Runner Dispatched',
        description: 'Runner Sipho Mabena assigned for pickup',
        timestamp: 'Today, 10:10 AM',
        completed: true,
      },
      {
        status: 'in_transit',
        title: 'Out for Delivery',
        description: 'Runner on route to Oxford Rd, Rosebank',
        timestamp: 'Today, 11:20 AM',
        completed: true,
      },
      {
        status: 'delivered',
        title: 'Delivery Confirmation',
        description: 'Pending handoff via 4-digit security PIN',
        timestamp: 'Estimated: 12:45 PM',
        completed: false,
      }
    ],
    otpCode: '4821',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    estimatedDeliveryDate: 'Today between 12:30 PM – 1:30 PM',
  },
  {
    id: 'JC-84921',
    items: [
      {
        product: INITIAL_PRODUCTS[1],
        quantity: 1,
        selectedVariant: { Color: 'Sandton Matte Black' }
      }
    ],
    subtotal: 1899,
    deliveryFee: 0,
    discount: 0,
    total: 1899,
    platformFee: 152,
    sellerPayout: 1747,
    runnerFee: 55,
    deliveryType: 'local_runner',
    route: {
      originProvince: 'Gauteng',
      originCity: 'Sandton',
      destinationProvince: 'Gauteng',
      destinationCity: 'Johannesburg',
      isInterprovincial: false,
    },
    customer: {
      fullName: 'David Van Der Merwe',
      email: 'david.vdm@merwe-capital.co.za',
      phone: '+27 82 559 3011',
      street: '12 Fredman Drive, Sandhurst',
      suburb: 'Sandton',
      city: 'Johannesburg',
      province: 'Gauteng',
      postalCode: '2196',
      deliveryNotes: 'Call upon arrival at boom gate'
    },
    deliveryMethod: 'express',
    paymentMethod: 'card',
    status: 'delivered',
    payoutStatus: 'cleared',
    runner: INITIAL_RUNNERS[1],
    trackingUpdates: [
      {
        status: 'payment_confirmed',
        title: 'Payment Confirmed',
        description: 'Settled via Visa 3D-Secure',
        timestamp: 'Today, 07:30 AM',
        completed: true,
      },
      {
        status: 'packing',
        title: 'Inspected & Sealed',
        description: 'Prepared at Aura Acoustics Sandton Hub',
        timestamp: 'Today, 08:00 AM',
        completed: true,
      },
      {
        status: 'in_transit',
        title: 'Dispatched with Runner',
        description: 'Runner Kagiso Ndlovu on Yamaha MT-03',
        timestamp: 'Today, 08:45 AM',
        completed: true,
      },
      {
        status: 'delivered',
        title: 'Delivered Successfully',
        description: 'Recipient verified with OTP PIN 9214',
        timestamp: 'Today, 09:22 AM',
        completed: true,
      }
    ],
    otpCode: '9214',
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    estimatedDeliveryDate: 'Delivered',
  },
  {
    id: 'JC-84922',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        selectedVariant: { Size: 'UK 8' }
      }
    ],
    subtotal: 950,
    deliveryFee: 60,
    discount: 0,
    total: 1010,
    platformFee: 76,
    sellerPayout: 874,
    runnerFee: 55,
    deliveryType: 'local_runner',
    route: {
      originProvince: 'Gauteng',
      originCity: 'Johannesburg',
      destinationProvince: 'Gauteng',
      destinationCity: 'Johannesburg',
      isInterprovincial: false,
    },
    customer: {
      fullName: 'Thabo Mokoena',
      email: 'thabo.mokoena@wits.ac.za',
      phone: '+27 76 341 8802',
      street: 'Yale Village, Empire Road',
      suburb: 'Braamfontein',
      city: 'Johannesburg',
      province: 'Gauteng',
      postalCode: '2001',
      deliveryNotes: 'Wait at student gate'
    },
    deliveryMethod: 'standard',
    paymentMethod: 'instant_eft',
    status: 'ready_for_pickup',
    payoutStatus: 'pending',
    trackingUpdates: [
      {
        status: 'payment_confirmed',
        title: 'Payment Confirmed',
        description: 'Instant EFT from Nedbank verified',
        timestamp: 'Today, 10:05 AM',
        completed: true,
      },
      {
        status: 'ready_for_pickup',
        title: 'Ready at Seller Counter',
        description: 'Kasi Sneaker Lab Braamfontein ready for courier collection',
        timestamp: 'Today, 10:45 AM',
        completed: true,
      }
    ],
    otpCode: '3157',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    estimatedDeliveryDate: 'Today afternoon',
  },
  {
    id: 'JC-84923',
    items: [
      {
        product: INITIAL_PRODUCTS[10], // Durban Coastal Heavy Sweatshorts
        quantity: 1,
        selectedVariant: { Size: 'L', Color: 'Washed Black' }
      }
    ],
    subtotal: 520,
    deliveryFee: 110,
    discount: 0,
    total: 630,
    platformFee: 42,
    sellerPayout: 478,
    runnerFee: 55,
    deliveryType: 'interprovincial_linehaul',
    route: {
      originProvince: 'KwaZulu-Natal',
      originCity: 'Durban',
      destinationProvince: 'Gauteng',
      destinationCity: 'Johannesburg',
      isInterprovincial: true,
      transitHub: 'King Shaka Airfreight Terminal (DUR) ✈ O.R. Tambo Logistics Gateway (JHB)'
    },
    customer: {
      fullName: 'Zanele Sithole',
      email: 'zanele.s@gmail.com',
      phone: '+27 84 991 4452',
      street: '286 Fox Street, Main Change',
      suburb: 'Maboneng',
      city: 'Johannesburg',
      province: 'Gauteng',
      postalCode: '2094',
      deliveryNotes: 'Buzz apartment 304'
    },
    deliveryMethod: 'standard',
    paymentMethod: 'card',
    status: 'in_transit',
    payoutStatus: 'pending',
    runner: INITIAL_RUNNERS[1],
    trackingUpdates: [
      {
        status: 'payment_confirmed',
        title: 'Payment Confirmed',
        description: 'Visa authorization approved',
        timestamp: 'Yesterday, 14:20 PM',
        completed: true,
      },
      {
        status: 'packing',
        title: 'Packaged in Durban Hub',
        description: 'Sealed by Durban Coastal Threads on Florida Road',
        timestamp: 'Yesterday, 16:00 PM',
        completed: true,
      },
      {
        status: 'ready_for_pickup',
        title: 'Transferred to King Shaka Gateway',
        description: 'Consolidated into national airfreight cargo container',
        timestamp: 'Yesterday, 20:30 PM',
        completed: true,
      },
      {
        status: 'in_transit',
        title: 'Interprovincial Flight Arrived JHB',
        description: 'Disembarked at O.R. Tambo Air Cargo. Transferred to local courier Lindiwe Khumalo for final drop.',
        timestamp: 'Today, 09:10 AM',
        completed: true,
      },
      {
        status: 'delivered',
        title: 'Delivery Confirmation',
        description: 'Pending handoff via 4-digit security PIN',
        timestamp: 'Estimated: 14:00 PM',
        completed: false,
      }
    ],
    otpCode: '7412',
    createdAt: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
    estimatedDeliveryDate: 'Today afternoon by 2:00 PM',
  },
  {
    id: 'JC-84924',
    items: [
      {
        product: INITIAL_PRODUCTS[9], // Kloof Street Linen Resort Shirt
        quantity: 1,
        selectedVariant: { Size: 'M', Color: 'Atlantic Seafoam' }
      }
    ],
    subtotal: 740,
    deliveryFee: 160,
    discount: 0,
    total: 900,
    platformFee: 59,
    sellerPayout: 681,
    runnerFee: 55,
    deliveryType: 'interprovincial_linehaul',
    route: {
      originProvince: 'Western Cape',
      originCity: 'Cape Town',
      destinationProvince: 'Gauteng',
      destinationCity: 'Johannesburg',
      isInterprovincial: true,
      transitHub: 'Cape Town Airport Cargo Hub (CPT) ✈ O.R. Tambo Logistics Gateway (JHB)'
    },
    customer: {
      fullName: 'Kgosi Mathe',
      email: 'kgosi.mathe@outlook.com',
      phone: '+27 83 221 9918',
      street: '884 Vilakazi Street, Orlando West',
      suburb: 'Soweto',
      city: 'Johannesburg',
      province: 'Gauteng',
      postalCode: '1804',
      deliveryNotes: 'Gate is black, house number clearly visible'
    },
    deliveryMethod: 'express',
    paymentMethod: 'instant_eft',
    status: 'in_transit',
    payoutStatus: 'pending',
    runner: INITIAL_RUNNERS[2],
    trackingUpdates: [
      {
        status: 'payment_confirmed',
        title: 'Payment Received',
        description: 'Capitec Pay settlement completed',
        timestamp: 'Yesterday, 11:35 AM',
        completed: true,
      },
      {
        status: 'packing',
        title: 'Inspected in Cape Town',
        description: 'Tailored and boxed at Kloof Street studio',
        timestamp: 'Yesterday, 14:00 PM',
        completed: true,
      },
      {
        status: 'in_transit',
        title: 'Air Cargo Linehaul Transit',
        description: 'Flown CPT → JHB. Sorted at Gauteng Gateway for runner handover to Soweto.',
        timestamp: 'Today, 08:30 AM',
        completed: true,
      }
    ],
    otpCode: '8520',
    createdAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    estimatedDeliveryDate: 'Today between 1:00 PM – 3:00 PM',
  },
  {
    id: 'JC-84925',
    items: [
      {
        product: INITIAL_PRODUCTS[5],
        quantity: 1
      },
      {
        product: INITIAL_PRODUCTS[7],
        quantity: 1
      }
    ],
    subtotal: 1470,
    deliveryFee: 0,
    discount: 0,
    total: 1470,
    platformFee: 118,
    sellerPayout: 1352,
    runnerFee: 55,
    deliveryType: 'local_runner',
    route: {
      originProvince: 'Gauteng',
      originCity: 'Pretoria',
      destinationProvince: 'Gauteng',
      destinationCity: 'Pretoria',
      isInterprovincial: false,
    },
    customer: {
      fullName: 'Annelize Botha',
      email: 'annelize.b@lawfirm.co.za',
      phone: '+27 82 447 9003',
      street: '144 Lynnwood Road, Brooklyn',
      suburb: 'Pretoria East',
      city: 'Pretoria',
      province: 'Gauteng',
      postalCode: '0181',
      deliveryNotes: 'Hand over to reception'
    },
    deliveryMethod: 'express',
    paymentMethod: 'card',
    status: 'delivered',
    payoutStatus: 'cleared',
    runner: INITIAL_RUNNERS[1],
    trackingUpdates: [
      {
        status: 'delivered',
        title: 'Completed Delivery',
        description: 'Handoff confirmed Brooklyn, Pretoria',
        timestamp: 'Yesterday, 15:40 PM',
        completed: true,
      }
    ],
    otpCode: '6190',
    createdAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    estimatedDeliveryDate: 'Delivered',
  },
  {
    id: 'JC-84926',
    items: [
      {
        product: INITIAL_PRODUCTS[8],
        quantity: 1
      }
    ],
    subtotal: 320,
    deliveryFee: 60,
    discount: 0,
    total: 380,
    platformFee: 26,
    sellerPayout: 294,
    runnerFee: 55,
    deliveryType: 'local_runner',
    route: {
      originProvince: 'Gauteng',
      originCity: 'Johannesburg',
      destinationProvince: 'Gauteng',
      destinationCity: 'Johannesburg',
      isInterprovincial: false,
    },
    customer: {
      fullName: 'Marcus Sterling',
      email: 'm.sterling@agency.co.za',
      phone: '+27 71 882 1019',
      street: '22 4th Avenue',
      suburb: 'Parkhurst',
      city: 'Johannesburg',
      province: 'Gauteng',
      postalCode: '2193',
      deliveryNotes: 'Building intercom #12'
    },
    deliveryMethod: 'standard',
    paymentMethod: 'card',
    status: 'disputed',
    payoutStatus: 'held',
    disputeReason: 'Recipient was unavailable during designated delivery window. Package held in hub.',
    trackingUpdates: [
      {
        status: 'payment_confirmed',
        title: 'Payment Confirmed',
        description: 'Mastercard authorization approved',
        timestamp: 'Yesterday, 14:10 PM',
        completed: true,
      },
      {
        status: 'failed',
        title: 'Delivery Attempt Failed',
        description: 'No response at intercom or phone after 3 attempts',
        timestamp: 'Yesterday, 17:30 PM',
        completed: true,
      }
    ],
    otpCode: '1094',
    createdAt: new Date(Date.now() - 32 * 3600 * 1000).toISOString(),
    estimatedDeliveryDate: 'Resolution in progress',
  },
  {
    id: 'JC-84927',
    items: [
      {
        product: INITIAL_PRODUCTS[12], // Algoa Bay Waxed Canvas Weekender Duffle
        quantity: 1
      }
    ],
    subtotal: 1280,
    deliveryFee: 0, // Free over R800
    discount: 0,
    total: 1280,
    platformFee: 102,
    sellerPayout: 1178,
    runnerFee: 55,
    deliveryType: 'interprovincial_linehaul',
    route: {
      originProvince: 'Eastern Cape',
      originCity: 'Gqeberha',
      destinationProvince: 'Western Cape',
      destinationCity: 'Cape Town',
      isInterprovincial: true,
      transitHub: 'Chief Dawid Stuurman Logistics (PLZ) ✈ Cape Town Airport Cargo Hub (CPT)'
    },
    customer: {
      fullName: 'Francois Du Plessis',
      email: 'f.duplessis@vineyards.co.za',
      phone: '+27 82 774 2190',
      street: '45 Victoria Road',
      suburb: 'Camps Bay',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '8005',
      deliveryNotes: 'Ring main villa intercom'
    },
    deliveryMethod: 'express',
    paymentMethod: 'card',
    status: 'in_transit',
    payoutStatus: 'pending',
    runner: INITIAL_RUNNERS[3], // Chadwick Pietersen (Cape Town)
    trackingUpdates: [
      {
        status: 'payment_confirmed',
        title: 'Payment Verified',
        description: 'Settled via Mastercard 3D-Secure',
        timestamp: 'Yesterday, 16:20 PM',
        completed: true,
      },
      {
        status: 'ready_for_pickup',
        title: 'Dispatched to Airport Terminal',
        description: 'Consolidated at Chief Dawid Stuurman Terminal (PLZ)',
        timestamp: 'Today, 06:45 AM',
        completed: true,
      },
      {
        status: 'in_transit',
        title: 'Received at CPT Cargo Hub',
        description: 'Allocated to Cape Town runner Chadwick Pietersen for Camps Bay doorstep handover.',
        timestamp: 'Today, 10:15 AM',
        completed: true,
      }
    ],
    otpCode: '5519',
    createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    estimatedDeliveryDate: 'Today afternoon by 3:30 PM',
  }
];

export const INITIAL_EVENTS: MarketplaceEvent[] = [
  {
    id: 'evt-1001',
    type: 'payment_confirmed',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    actor: 'Kgosi Mathe',
    role: 'BUYER',
    resourceId: 'JC-84924',
    details: { totalZAR: 510, method: 'instant_eft' }
  },
  {
    id: 'evt-1002',
    type: 'order_ready_for_pickup',
    timestamp: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    actor: 'Kasi Sneaker Lab',
    role: 'SELLER',
    resourceId: 'JC-84922',
    details: { hub: 'Braamfontein', parcelCount: 1 }
  },
  {
    id: 'evt-1003',
    type: 'delivery_started',
    timestamp: new Date(Date.now() - 160 * 60 * 1000).toISOString(),
    actor: 'Sipho Mabena',
    role: 'RUNNER',
    resourceId: 'JC-84920',
    details: { destinationSuburb: 'Rosebank' }
  },
  {
    id: 'evt-1004',
    type: 'delivery_completed',
    timestamp: new Date(Date.now() - 320 * 60 * 1000).toISOString(),
    actor: 'Kagiso Ndlovu',
    role: 'RUNNER',
    resourceId: 'JC-84921',
    details: { destinationSuburb: 'Sandton', otpVerified: true }
  },
  {
    id: 'evt-1005',
    type: 'product_added_to_cart',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    actor: 'Customer (Sandton)',
    role: 'BUYER',
    resourceId: 'prod-1',
    details: { product: 'Maboneng Highveld Sneaker' }
  },
  {
    id: 'evt-1006',
    type: 'product_viewed',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    actor: 'Customer (Rosebank)',
    role: 'BUYER',
    resourceId: 'prod-4',
    details: { category: 'fashion' }
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'audit-901',
    timestamp: 'Today, 08:35 AM',
    actorName: 'Sipho Khumalo',
    actorRole: 'SUPER_ADMIN',
    action: 'RUNNER_SUBMISSION_APPROVED',
    resourceType: 'product',
    resourceId: 'RS-101',
    previousState: 'pending',
    newState: 'approved',
    notes: 'Approved Braamfontein Heavy Corduroy Jacket for live listing.'
  },
  {
    id: 'audit-902',
    timestamp: 'Today, 09:12 AM',
    actorName: 'Lerato Dlamini',
    actorRole: 'OPERATIONS',
    action: 'RUNNER_DISPATCHED',
    resourceType: 'order',
    resourceId: 'JC-84920',
    previousState: 'packing',
    newState: 'runner_assigned',
    notes: 'Assigned Runner Sipho Mabena for Oxford Rd pickup.'
  },
  {
    id: 'audit-903',
    timestamp: 'Today, 09:25 AM',
    actorName: 'Finance Automated Engine',
    actorRole: 'FINANCE',
    action: 'SELLER_PAYOUT_CLEARED',
    resourceType: 'payout',
    resourceId: 'JC-84921',
    previousState: 'pending',
    newState: 'cleared',
    notes: 'Disbursal of R 1,747.00 queued for Aura Acoustics Sandton.'
  },
  {
    id: 'audit-904',
    timestamp: 'Yesterday, 17:35 PM',
    actorName: 'Zuko Support',
    actorRole: 'SUPPORT',
    action: 'ORDER_DISPUTE_FLAGGED',
    resourceType: 'order',
    resourceId: 'JC-84926',
    previousState: 'in_transit',
    newState: 'disputed',
    notes: 'Customer unreachable at Parkhurst address. Delivery held.'
  }
];

export const CATEGORIES_LIST = [
  { id: 'all', label: 'All Items' },
  { id: 'fashion', label: 'Streetwear & Apparel' },
  { id: 'sneakers', label: 'Sneakers & Shoes' },
  { id: 'electronics', label: 'Audio & Tech' },
  { id: 'beauty', label: 'Skincare & Beauty' },
  { id: 'home', label: 'Home & Living' },
  { id: 'leather', label: 'Handcrafted Leather' },
  { id: 'accessories', label: 'Watches & Eyewear' },
];

export const SA_HUBS = [
  'All South Africa Hubs',
  'Gauteng: Rosebank & Parkhurst',
  'Gauteng: Sandton & Fourways',
  'Gauteng: Maboneng & JHB CBD',
  'Gauteng: Braamfontein',
  'Gauteng: Soweto & South Gate',
  'Gauteng: Pretoria & Centurion',
  'Western Cape: Cape Town CBD & Kloof St',
  'Western Cape: Stellenbosch & Winelands',
  'KwaZulu-Natal: Durban & Umhlanga',
  'Eastern Cape: Gqeberha (PE)',
  'Free State: Bloemfontein'
];

export const SA_PROVINCES: { 
  id: SouthAfricanProvince; 
  name: string; 
  majorCities: string[]; 
  postalRange: string;
  linehaulHub: string;
}[] = [
  { 
    id: 'Gauteng', 
    name: 'Gauteng', 
    majorCities: ['Johannesburg', 'Pretoria', 'Sandton', 'Soweto', 'Midrand'], 
    postalRange: '0001 - 2199',
    linehaulHub: 'O.R. Tambo Logistics Gateway (JHB)'
  },
  { 
    id: 'Western Cape', 
    name: 'Western Cape', 
    majorCities: ['Cape Town', 'Stellenbosch', 'Somerset West', 'George', 'Paarl'], 
    postalRange: '6500 - 8099',
    linehaulHub: 'Cape Town Airport Cargo Hub (CPT)'
  },
  { 
    id: 'KwaZulu-Natal', 
    name: 'KwaZulu-Natal', 
    majorCities: ['Durban', 'Umhlanga', 'Ballito', 'Pietermaritzburg'], 
    postalRange: '2900 - 4499',
    linehaulHub: 'King Shaka Airfreight Terminal (DUR)'
  },
  { 
    id: 'Eastern Cape', 
    name: 'Eastern Cape', 
    majorCities: ['Gqeberha (Port Elizabeth)', 'East London', 'Mthatha'], 
    postalRange: '5200 - 6499',
    linehaulHub: 'Chief Dawid Stuurman Logistics (PLZ)'
  },
  { 
    id: 'Free State', 
    name: 'Free State', 
    majorCities: ['Bloemfontein', 'Welkom', 'Sasolburg'], 
    postalRange: '9300 - 9999',
    linehaulHub: 'Bram Fischer Hub (BFN)'
  },
  { 
    id: 'Mpumalanga', 
    name: 'Mpumalanga', 
    majorCities: ['Mbombela (Nelspruit)', 'eMalahleni (Witbank)', 'Secunda'], 
    postalRange: '1000 - 1399',
    linehaulHub: 'Kruger Mpumalanga Express (MQP)'
  },
  { 
    id: 'Limpopo', 
    name: 'Limpopo', 
    majorCities: ['Polokwane', 'Tzaneen', 'Mokopane'], 
    postalRange: '0600 - 0999',
    linehaulHub: 'Polokwane Gateway (PTG)'
  },
  { 
    id: 'North West', 
    name: 'North West', 
    majorCities: ['Rustenburg', 'Potchefstroom', 'Klerksdorp', 'Mahikeng'], 
    postalRange: '2500 - 2899',
    linehaulHub: 'North West Regional Depot (RTB)'
  },
  { 
    id: 'Northern Cape', 
    name: 'Northern Cape', 
    majorCities: ['Kimberley', 'Upington', 'Springbok'], 
    postalRange: '8300 - 8999',
    linehaulHub: 'Kimberley Central Hub (KIM)'
  },
];

export const INTERPROVINCIAL_CORRIDORS: InterprovincialCorridor[] = [
  {
    id: 'corridor-gp-wc',
    name: 'Gauteng ↔ Western Cape (JHB - CPT)',
    originProvince: 'Gauteng',
    destinationProvince: 'Western Cape',
    originGateway: 'O.R. Tambo Logistics Gateway (JHB)',
    destinationGateway: 'Cape Town Airport Cargo Hub (CPT)',
    transitMode: 'Domestic Airfreight Cargo',
    dailyFlightsOrDepartures: 8,
    transitHours: 24,
    activeParcelsCount: 42,
    onTimeRate: 99.6,
    status: 'optimal'
  },
  {
    id: 'corridor-gp-kzn',
    name: 'Gauteng ↔ KwaZulu-Natal (JHB - DUR)',
    originProvince: 'Gauteng',
    destinationProvince: 'KwaZulu-Natal',
    originGateway: 'O.R. Tambo Logistics Gateway (JHB)',
    destinationGateway: 'King Shaka Airfreight Terminal (DUR)',
    transitMode: 'Domestic Airfreight Cargo',
    dailyFlightsOrDepartures: 6,
    transitHours: 24,
    activeParcelsCount: 29,
    onTimeRate: 99.2,
    status: 'optimal'
  },
  {
    id: 'corridor-wc-ec',
    name: 'Western Cape ↔ Eastern Cape (CPT - PLZ)',
    originProvince: 'Western Cape',
    destinationProvince: 'Eastern Cape',
    originGateway: 'Cape Town Airport Cargo Hub (CPT)',
    destinationGateway: 'Chief Dawid Stuurman Logistics (PLZ)',
    transitMode: 'Express Highway Linehaul',
    dailyFlightsOrDepartures: 4,
    transitHours: 36,
    activeParcelsCount: 18,
    onTimeRate: 98.9,
    status: 'optimal'
  },
  {
    id: 'corridor-gp-fs',
    name: 'Gauteng ↔ Free State (JHB - BFN)',
    originProvince: 'Gauteng',
    destinationProvince: 'Free State',
    originGateway: 'O.R. Tambo Logistics Gateway (JHB)',
    destinationGateway: 'Bram Fischer Hub (BFN)',
    transitMode: 'Express Highway Linehaul',
    dailyFlightsOrDepartures: 5,
    transitHours: 24,
    activeParcelsCount: 14,
    onTimeRate: 99.5,
    status: 'optimal'
  },
  {
    id: 'corridor-gp-mp',
    name: 'Gauteng ↔ Mpumalanga (JHB - MQP)',
    originProvince: 'Gauteng',
    destinationProvince: 'Mpumalanga',
    originGateway: 'O.R. Tambo Logistics Gateway (JHB)',
    destinationGateway: 'Kruger Mpumalanga Express (MQP)',
    transitMode: 'Regional Feeder Route',
    dailyFlightsOrDepartures: 3,
    transitHours: 24,
    activeParcelsCount: 11,
    onTimeRate: 99.1,
    status: 'optimal'
  },
  {
    id: 'corridor-gp-lp',
    name: 'Gauteng ↔ Limpopo (JHB - PTG)',
    originProvince: 'Gauteng',
    destinationProvince: 'Limpopo',
    originGateway: 'O.R. Tambo Logistics Gateway (JHB)',
    destinationGateway: 'Polokwane Gateway (PTG)',
    transitMode: 'Regional Feeder Route',
    dailyFlightsOrDepartures: 3,
    transitHours: 24,
    activeParcelsCount: 9,
    onTimeRate: 98.8,
    status: 'optimal'
  }
];

export const INITIAL_RUNNER_SUBMISSIONS: RunnerSubmission[] = [
  {
    id: 'RS-101',
    runnerId: 'runner-1',
    runnerName: 'Sipho Mabena',
    runnerHub: 'Braamfontein, JHB',
    title: 'Braamfontein Heavy Corduroy Overshirt (Tobacco Brown)',
    category: 'fashion',
    suggestedPrice: 650,
    description: 'Sourced directly from a local garment studio near Juta Street. 100% thick wale cotton corduroy with brass hardware.',
    images: [hoodieImg],
    condition: 'Brand New',
    stockCount: 8,
    variants: [
      { name: 'Size', options: ['S', 'M', 'L', 'XL'] }
    ],
    status: 'pending',
    submittedAt: 'Today, 08:30 AM',
  },
  {
    id: 'RS-102',
    runnerId: 'runner-2',
    runnerName: 'Kagiso Ndlovu',
    runnerHub: 'Soweto & South Gate',
    title: 'Soweto Kasi Retro Canvas Lows (Ochre & Charcoal)',
    category: 'sneakers',
    suggestedPrice: 799,
    description: 'Authentic township streetwear collaboration. Vulcanized gum sole, padded collar, double-stitched canvas.',
    images: [sneakerImg],
    condition: 'Brand New',
    stockCount: 12,
    variants: [
      { name: 'Size', options: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'] }
    ],
    status: 'pending',
    submittedAt: 'Today, 09:15 AM',
  },
  {
    id: 'RS-103',
    runnerId: 'runner-3',
    runnerName: 'Lerato Khumalo',
    runnerHub: 'Maboneng & JHB CBD',
    title: 'Maboneng Skyline Acid-Wash Boxy Tee',
    category: 'fashion',
    suggestedPrice: 380,
    description: 'Hand screen-printed tee celebrating Johannesburg brutalist architecture. 240gsm pre-shrunk organic cotton.',
    images: [heroImg],
    condition: 'Handcrafted',
    stockCount: 15,
    variants: [
      { name: 'Size', options: ['M', 'L', 'XL'] }
    ],
    status: 'pending',
    submittedAt: 'Yesterday, 16:40 PM',
  },
];
