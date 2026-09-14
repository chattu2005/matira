import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, Category } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-spices',
    name: 'Spices',
    slug: 'spices',
    description: 'Aromatic, stone-ground & whole Indian spices with rich natural oils',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 'cat-honey',
    name: 'Honey',
    slug: 'honey',
    description: '100% Raw, unfiltered forest nectar harvested ethically',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    displayOrder: 2,
    isActive: true,
  },
  {
    id: 'cat-oils',
    name: 'Edible Oils',
    slug: 'edible-oils',
    description: 'Traditional wood-churned cold pressed edible cooking oils',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    displayOrder: 3,
    isActive: true,
  },
  {
    id: 'cat-pulses',
    name: 'Pulses',
    slug: 'pulses',
    description: 'Unpolished, pesticide-free Indian lentils and dals',
    image: 'https://images.unsplash.com/photo-1585994192701-f1a505c817ea?auto=format&fit=crop&w=800&q=80',
    displayOrder: 4,
    isActive: true,
  },
  {
    id: 'cat-cereals',
    name: 'Cereals',
    slug: 'cereals',
    description: 'Heritage grains, aromatic traditional rice and millets',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    displayOrder: 5,
    isActive: true,
  },
  {
    id: 'cat-grocery',
    name: 'Grocery',
    slug: 'grocery',
    description: 'Essential everyday kitchen staples of pristine purity',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    displayOrder: 6,
    isActive: true,
  },
  {
    id: 'cat-natural-foods',
    name: 'Natural Foods',
    slug: 'natural-foods',
    description: 'Wholesome natural seeds, dry fruits and jaggery',
    image: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=800&q=80',
    displayOrder: 7,
    isActive: true,
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-cumin-jeera-1kg',
    name: 'Pure Whole Cumin Seeds (Jeera)',
    slug: 'pure-cumin-seeds-jeera',
    categoryId: 'cat-spices',
    categoryName: 'Spices',
    shortDescription: 'Sun-dried high-aroma whole cumin seeds sourced directly from Nagaur, Rajasthan.',
    fullDescription: 'MATIRA Pure Cumin Seeds (Jeera) are carefully hand-picked from the arid spice belt of Nagaur, Rajasthan. Naturally dried under clean desert sunlight without artificial polishing or sulfur treatment. Packed with rich essential oils (cuminaldehyde), offering an intensely warm, earthy, and nutty fragrance that elevates daily Indian tadkas, curries, and rice dishes.',
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80'
    ],
    price: 500, // Explicitly ₹500 per kg as mandated
    compareAtPrice: 599,
    discountPercentage: 16,
    weight: '1 kg',
    sku: 'MAT-SP-JRA-01',
    stockQuantity: 150,
    stockStatus: 'in_stock',
    isFeatured: true,
    isBestSeller: true,
    isNew: true,
    isActive: true,
    ingredients: '100% Pure Whole Dried Cumin Seeds (Cuminum cyminum)',
    benefits: [
      'Rich in volatile essential oils that aid healthy digestion',
      'Naturally high in iron and active antioxidants',
      'Stone-sorted and unpolished to retain genuine seed aroma',
      'No added preservatives, artificial colors or moisture'
    ],
    storageInfo: 'Store in an airtight container in a cool, dry place away from direct sunlight.',
    usageInfo: 'Roast lightly on a dry pan for 30 seconds before grinding or temper in hot mustard oil / ghee.',
    shippingInfo: 'Dispatched within 24 hours. Delivered in 3-5 business days across India.'
  },
  {
    id: 'prod-kashmiri-mirch-500g',
    name: 'Kashmiri Lal Mirch Powder',
    slug: 'kashmiri-lal-mirch-powder',
    categoryId: 'cat-spices',
    categoryName: 'Spices',
    shortDescription: 'Naturally stemless, stone-ground vibrant red chilli powder with mild gentle heat.',
    fullDescription: 'MATIRA Kashmiri Lal Mirch Powder is sourced from the fertile valleys of Kashmir. Prepared using whole stemless chillies slow-crushed at low temperatures to lock in the deep ruby-red color and rich mild sweetness without overwhelming pungency.',
    images: [
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80'
    ],
    price: 420,
    compareAtPrice: 480,
    discountPercentage: 12,
    weight: '500g',
    sku: 'MAT-SP-KMR-02',
    stockQuantity: 120,
    stockStatus: 'in_stock',
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    isActive: true,
    ingredients: '100% Pure Sun-Dried Kashmiri Chillies',
    benefits: [
      'Vibrant natural red hue with low Scoville heat units',
      'Cold ground to prevent thermal loss of aromatic compounds',
      'Completely free of Sudan dyes or adulterants'
    ],
    storageInfo: 'Keep in a cool, dry place. Seal tightly after opening.',
    usageInfo: 'Use 1-2 teaspoons for curries, marinades, gravies, and tandoori preparations.',
    shippingInfo: 'Dispatched within 24 hours across all Indian pincodes.'
  },
  {
    id: 'prod-lakadong-turmeric-500g',
    name: 'Lakadong High-Curcumin Turmeric Powder',
    slug: 'lakadong-high-curcumin-turmeric',
    categoryId: 'cat-spices',
    categoryName: 'Spices',
    shortDescription: 'Meghalaya Lakadong turmeric renowned for extraordinary 7%+ natural curcumin content.',
    fullDescription: 'Grown in the pristine Jaintia Hills of Meghalaya, Lakadong Turmeric is hailed worldwide for possessing one of the highest natural curcumin levels (7-8.5%). MATIRA brings you this golden treasure untouched by chemicals, non-irradiated, and full of therapeutic potency.',
    images: [
      'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80'
    ],
    price: 380,
    compareAtPrice: 450,
    discountPercentage: 15,
    weight: '500g',
    sku: 'MAT-SP-LKD-03',
    stockQuantity: 180,
    stockStatus: 'in_stock',
    isFeatured: true,
    isBestSeller: true,
    isNew: true,
    isActive: true,
    ingredients: '100% Pure Lakadong Turmeric Rhizomes',
    benefits: [
      'Tested 7%+ natural curcumin for maximum immunity support',
      'Intense golden glow and rich earthy aroma',
      'Zero lead chromate, chalk, or artificial colors'
    ],
    storageInfo: 'Store in an airtight dark jar or tin away from moisture.',
    usageInfo: 'Perfect for golden turmeric milk (Haldi Doodh), daily dal tadka, and wellness drinks.',
    shippingInfo: 'Shipped in moisture-barrier food grade packaging.'
  },
  {
    id: 'prod-wild-forest-honey-500g',
    name: 'Raw Wild Forest Honey',
    slug: 'raw-wild-forest-honey',
    categoryId: 'cat-honey',
    categoryName: 'Honey',
    shortDescription: '100% Unpasteurized, unfiltered wild multi-flora honey harvested from dense forests.',
    fullDescription: 'Extracted with sustainable tribal practices from the wild forest blooms of Central India. MATIRA Raw Honey is never heated, micro-filtered, or ultra-processed. It retains live floral enzymes, pollen grains, propolis, and essential trace minerals.',
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1000&q=80'
    ],
    price: 460,
    compareAtPrice: 550,
    discountPercentage: 16,
    weight: '500g',
    sku: 'MAT-HN-WLD-01',
    stockQuantity: 90,
    stockStatus: 'in_stock',
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    isActive: true,
    ingredients: '100% Pure Raw Multi-Flora Wild Honey',
    benefits: [
      'Contains natural pollen, royal jelly traces, and enzymes',
      'Never pasteurized; naturally rich in immunity boosters',
      'No added sugar syrup, C3/C4 sugars, or preservatives'
    ],
    storageInfo: 'Store at room temperature. Natural crystallization is proof of purity—place in warm water if needed.',
    usageInfo: 'Drizzle over warm oats, green tea, or warm lemon water.',
    shippingInfo: 'Packed safely in shock-resistant protective packaging.'
  },
  {
    id: 'prod-mustard-oil-1l',
    name: 'Kachi Ghani Wood-Pressed Mustard Oil',
    slug: 'kachi-ghani-wood-pressed-mustard-oil',
    categoryId: 'cat-oils',
    categoryName: 'Edible Oils',
    shortDescription: 'Traditional Kolhu cold-pressed golden mustard oil with authentic strong pungency.',
    fullDescription: 'Extracted in wooden expellers (Kachi Ghani) at temperatures under 40°C from locally grown black mustard seeds. Retains natural allyl isothiocyanate, imparting the signature sharp bite and robust aroma essential for authentic Bengali and North Indian cuisine.',
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80'
    ],
    price: 260,
    compareAtPrice: 310,
    discountPercentage: 16,
    weight: '1 Litre',
    sku: 'MAT-OL-MST-01',
    stockQuantity: 140,
    stockStatus: 'in_stock',
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    isActive: true,
    ingredients: '100% Pure First-Press Cold Pressed Mustard Seed Oil',
    benefits: [
      'Traditional wooden press method preserves Omega-3 & Omega-6 fatty acids',
      'High smoke point ideal for frying, tempering, and pickling',
      'Zero chemical refining, solvents, or argemone contamination'
    ],
    storageInfo: 'Keep in a cool pantry away from heat sources.',
    usageInfo: 'Ideal for fish curries, mustard gravies, achar (pickles), and daily vegetable sautes.',
    shippingInfo: 'Heavy-duty leak-proof tin / bottle packaging.'
  },
  {
    id: 'prod-green-cardamom-250g',
    name: 'Royal Bold Green Cardamom (Elaichi 8mm+)',
    slug: 'royal-bold-green-cardamom',
    categoryId: 'cat-spices',
    categoryName: 'Spices',
    shortDescription: 'Hand-graded jumbo Kerala cardamom pods bursting with sweet citrus fragrance.',
    fullDescription: 'Harvested from the misty hills of Idukki, Kerala, these lush 8mm+ jumbo cardamom pods are hand-graded for supreme boldness. Green, plump, and packed with aromatic dark seeds full of cineole and terpinyl acetate.',
    images: [
      'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=1000&q=80'
    ],
    price: 950,
    compareAtPrice: 1100,
    discountPercentage: 14,
    weight: '250g',
    sku: 'MAT-SP-ELA-01',
    stockQuantity: 85,
    stockStatus: 'in_stock',
    isFeatured: true,
    isBestSeller: false,
    isNew: true,
    isActive: true,
    ingredients: '100% Whole Grade A Green Cardamom Pods',
    benefits: [
      'Supreme 8mm+ size offering dense, highly aromatic seeds',
      'Natural breath freshener and digestive stimulant',
      'Unbleached and preserved in nitrogen-sealed freshness pouches'
    ],
    storageInfo: 'Store in an airtight jar in a cool, dark cabinet.',
    usageInfo: 'Crush gently before adding to chai, kheer, biryanis, and festive sweets.',
    shippingInfo: 'Dispatched in aroma-lock zipper packs.'
  },
  {
    id: 'prod-unpolished-toor-dal-1kg',
    name: 'Unpolished Organic Toor Dal (Arhar Dal)',
    slug: 'unpolished-organic-toor-dal',
    categoryId: 'cat-pulses',
    categoryName: 'Pulses',
    shortDescription: 'Naturally processed unpolished pigeon pea lentils rich in plant protein.',
    fullDescription: 'MATIRA Unpolished Toor Dal comes straight from native legume farms. Unlike commercial dal treated with water, oil, or stone powder for unnatural shine, our dal retains its natural seed coat and nutritional value, cooking up creamy and comforting.',
    images: [
      'https://images.unsplash.com/photo-1585994192701-f1a505c817ea?auto=format&fit=crop&w=1000&q=80'
    ],
    price: 195,
    compareAtPrice: 230,
    discountPercentage: 15,
    weight: '1 kg',
    sku: 'MAT-PL-TOR-01',
    stockQuantity: 200,
    stockStatus: 'in_stock',
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    isActive: true,
    ingredients: '100% Unpolished Pigeon Pea Lentils (Toor)',
    benefits: [
      'Zero polish, mineral oil, or synthetic polishing agents',
      'High in dietary fiber and essential plant protein',
      'Easier on digestion with wholesome natural taste'
    ],
    storageInfo: 'Store in a clean, moisture-free grain container.',
    usageInfo: 'Rinse twice and pressure cook for 3-4 whistles with turmeric and rock salt.',
    shippingInfo: 'Double-bagged for pest-free, fresh delivery.'
  },
  {
    id: 'prod-malabar-black-pepper-500g',
    name: 'Malabar Whole Black Peppercorns (Kali Mirch)',
    slug: 'malabar-whole-black-peppercorns',
    categoryId: 'cat-spices',
    categoryName: 'Spices',
    shortDescription: 'Sun-dried high-piperine Tellicherry black pepper with sharp, woody heat.',
    fullDescription: 'Direct from the Malabar Coast, world-famous for the finest black pepper on earth. Plump, heavily crinkled, and rich in natural piperine oil, delivering an assertive kick and sophisticated piney complexity.',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80'
    ],
    price: 560,
    compareAtPrice: 640,
    discountPercentage: 12,
    weight: '500g',
    sku: 'MAT-SP-BLP-01',
    stockQuantity: 110,
    stockStatus: 'in_stock',
    isFeatured: false,
    isBestSeller: true,
    isNew: false,
    isActive: true,
    ingredients: '100% Pure Whole Black Peppercorns (Piper nigrum)',
    benefits: [
      'Enhances nutrient and curcumin absorption in the body',
      'Dense essential oils give intense burst when freshly cracked',
      'Pure berry grade without empty husks or fillers'
    ],
    storageInfo: 'Store in whole form; grind fresh for optimal flavor.',
    usageInfo: 'Crack freshly over salads, curries, stews, and herbal decoctions (Khadha).',
    shippingInfo: 'Shipped within 24 hours.'
  },
  {
    id: 'prod-gobindobhog-rice-1kg',
    name: 'Aromatic Gobindobhog Heritage Rice',
    slug: 'aromatic-gobindobhog-heritage-rice',
    categoryId: 'cat-cereals',
    categoryName: 'Cereals',
    shortDescription: 'Sweet-scented short grain heritage rice prized for Bengali bhog and payesh.',
    fullDescription: 'Traditional short-grain white rice organically cultivated in South Bengal. Renowned for its delicate buttery aroma, soft texture, and sweet flavor. Naturally non-sticky and revered for deity offerings (Bhog), Khichuri, and Payesh.',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1000&q=80'
    ],
    price: 180,
    compareAtPrice: 220,
    discountPercentage: 18,
    weight: '1 kg',
    sku: 'MAT-CR-GBH-01',
    stockQuantity: 120,
    stockStatus: 'in_stock',
    isFeatured: true,
    isBestSeller: true,
    isNew: true,
    isActive: true,
    ingredients: '100% Pure Aged Gobindobhog Rice',
    benefits: [
      'Naturally scented without artificial jasmine or pandan fragrances',
      'Easily digestible, light on stomach, suitable for all ages',
      'Traditional heritage grain preserving biodiversity'
    ],
    storageInfo: 'Keep in an airtight container with bay leaves or dry chillies.',
    usageInfo: 'Cook with ghee, whole spices, and cashews for fragrant Pulao or comforting Khichuri.',
    shippingInfo: 'Packaged in vacuum-sealed bags.'
  },
  {
    id: 'prod-virgin-coconut-oil-1l',
    name: 'Cold Pressed Virgin Coconut Oil',
    slug: 'cold-pressed-virgin-coconut-oil',
    categoryId: 'cat-oils',
    categoryName: 'Edible Oils',
    shortDescription: 'Centrifuged raw virgin coconut oil extracted from fresh coconut milk.',
    fullDescription: 'Crafted from freshly harvested coastal coconuts. Unrefined, unbleached, and non-deodorized, preserving the natural tropical aroma, medium-chain triglycerides (MCTs), and beneficial lauric acid.',
    images: [
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=1000&q=80'
    ],
    price: 395,
    compareAtPrice: 450,
    discountPercentage: 12,
    weight: '1 Litre',
    sku: 'MAT-OL-CCN-01',
    stockQuantity: 75,
    stockStatus: 'in_stock',
    isFeatured: false,
    isBestSeller: false,
    isNew: false,
    isActive: true,
    ingredients: '100% Pure Cold-Pressed Virgin Coconut Oil',
    benefits: [
      'High in Lauric Acid and energy-producing MCTs',
      'Multi-purpose: culinary, hair conditioning, and skin nourishing',
      'Zero trans-fats, zero mineral oil or hydrogenation'
    ],
    storageInfo: 'Solidifies naturally below 24°C without any loss of quality.',
    usageInfo: 'Ideal for coastal curries, bullet coffee, baking, and hair massage.',
    shippingInfo: 'Leak-proof wide mouth jar.'
  },
  {
    id: 'prod-zanzibar-cloves-200g',
    name: 'Select Whole Cloves (Laung)',
    slug: 'select-whole-cloves-laung',
    categoryId: 'cat-spices',
    categoryName: 'Spices',
    shortDescription: 'Bold, reddish-brown whole cloves with intact crowns and high eugenol oil.',
    fullDescription: 'Hand-sorted whole cloves boasting intact crowns and rich oil heads. Bursting with natural eugenol oil that delivers a warm, pungent, and lingering sweet numbing sensation.',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80'
    ],
    price: 480,
    compareAtPrice: 550,
    discountPercentage: 12,
    weight: '200g',
    sku: 'MAT-SP-CLV-01',
    stockQuantity: 65,
    stockStatus: 'in_stock',
    isFeatured: false,
    isBestSeller: false,
    isNew: false,
    isActive: true,
    ingredients: '100% Whole Dried Cloves (Syzygium aromaticum)',
    benefits: [
      'Intact flower heads containing maximum medicinal oils',
      'Potent antimicrobial and oral care benefits',
      'Unexhausted cloves—never stripped of essential oils'
    ],
    storageInfo: 'Store in an airtight glass container.',
    usageInfo: 'Infuse in spiced tea, garam masala, and fragrant rice preparations.',
    shippingInfo: 'Shipped in seal-tight foil pouches.'
  },
  {
    id: 'prod-yellow-moong-dal-1kg',
    name: 'Unpolished Split Moong Dal',
    slug: 'unpolished-split-moong-dal',
    categoryId: 'cat-pulses',
    categoryName: 'Pulses',
    shortDescription: 'Gentle, light-on-stomach split yellow lentils cultivated naturally.',
    fullDescription: 'Pure split moong beans naturally dehusked without chemical steeping. Quick-cooking, highly digestible, and providing clean plant-based nutrition for everyday family wellness.',
    images: [
      'https://images.unsplash.com/photo-1585994192701-f1a505c817ea?auto=format&fit=crop&w=1000&q=80'
    ],
    price: 175,
    compareAtPrice: 200,
    discountPercentage: 12,
    weight: '1 kg',
    sku: 'MAT-PL-MNG-01',
    stockQuantity: 160,
    stockStatus: 'in_stock',
    isFeatured: false,
    isBestSeller: false,
    isNew: false,
    isActive: true,
    ingredients: '100% Unpolished Split Yellow Moong Dal',
    benefits: [
      'Lightest dal for gut health and recovery diets',
      'High protein, potassium, and magnesium content',
      'Cooks fast without prolonged soaking'
    ],
    storageInfo: 'Store in a dry, sealed jar.',
    usageInfo: 'Prepare comforting Moong Dal Tadka, Khichdi, or savory Moonglet.',
    shippingInfo: 'Secure, food-safe packaging.'
  }
];

// Seed initial categories and products into Firestore if collections are empty
export async function seedInitialDataIfEmpty(): Promise<void> {
  try {
    const productsSnap = await getDocs(collection(db, 'products'));
    if (productsSnap.empty) {
      console.log('[MATIRA] Initializing product catalogue in Firestore...');
      // Seed categories
      for (const cat of INITIAL_CATEGORIES) {
        await setDoc(doc(db, 'categories', cat.id), {
          ...cat,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      // Seed products
      for (const prod of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), {
          ...prod,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      // Seed default coupons
      await setDoc(doc(db, 'coupons', 'coupon-welcome10'), {
        id: 'coupon-welcome10',
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        minOrderValue: 499,
        maxDiscount: 150,
        expiryDate: '2028-12-31',
        usageLimit: 1000,
        timesUsed: 0,
        isActive: true,
        createdAt: new Date().toISOString()
      });

      await setDoc(doc(db, 'coupons', 'coupon-matira100'), {
        id: 'coupon-matira100',
        code: 'MATIRA100',
        discountType: 'fixed',
        discountValue: 100,
        minOrderValue: 999,
        expiryDate: '2028-12-31',
        usageLimit: 500,
        timesUsed: 0,
        isActive: true,
        createdAt: new Date().toISOString()
      });

      // Seed site content
      await setDoc(doc(db, 'site_content', 'home_settings'), {
        id: 'home_settings',
        announcementText: '✨ FREE Shipping across India on orders above ₹799! Pure & Honest Grocery.',
        heroHeading: 'Pure Indian Grocery & Spices',
        heroSubheading: 'Pure ingredients. Honest taste. Naturally better. From heritage farms to your kitchen.',
        contactPhone: '+91 9330713861',
        contactEmail: 'chattu1904@gmail.com',
        contactAddress: 'Little Complex, Lalkuthi, Newtown, Kolkata - 700136',
        whatsappNumber: '+91 9330713861',
        freeShippingThreshold: 799,
        standardShippingFee: 50,
        updatedAt: new Date().toISOString()
      });

      console.log('[MATIRA] Database seed complete!');
    }
  } catch (error) {
    console.warn('[MATIRA] Seeding check completed with message:', error);
  }
}

// Fetch all categories from Firestore
export async function getCategories(): Promise<Category[]> {
  try {
    const snap = await getDocs(collection(db, 'categories'));
    if (!snap.empty) {
      const items: Category[] = [];
      snap.forEach((d) => items.push(d.data() as Category));
      return items.sort((a, b) => a.displayOrder - b.displayOrder);
    }
  } catch (err) {
    console.error('Error fetching categories from Firestore:', err);
  }
  return INITIAL_CATEGORIES;
}

// Fetch all products with filtering options
export async function getProducts(options?: {
  categoryId?: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  searchQuery?: string;
}): Promise<Product[]> {
  try {
    const snap = await getDocs(collection(db, 'products'));
    if (!snap.empty) {
      let items: Product[] = [];
      snap.forEach((d) => {
        const prod = d.data() as Product;
        if (prod.isActive !== false) {
          items.push(prod);
        }
      });

      if (options?.categoryId && options.categoryId !== 'all') {
        items = items.filter((p) => p.categoryId === options.categoryId || p.categoryName.toLowerCase() === options.categoryId.toLowerCase());
      }
      if (options?.isFeatured) {
        items = items.filter((p) => p.isFeatured);
      }
      if (options?.isBestSeller) {
        items = items.filter((p) => p.isBestSeller);
      }
      if (options?.searchQuery) {
        const q = options.searchQuery.toLowerCase().trim();
        items = items.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.categoryName.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.shortDescription.toLowerCase().includes(q) ||
            (p.ingredients && p.ingredients.toLowerCase().includes(q))
        );
      }
      return items;
    }
  } catch (err) {
    console.error('Error fetching products from Firestore:', err);
  }

  // Fallback to initial catalogue if initial connection or seed in progress
  let fallback = [...INITIAL_PRODUCTS];
  if (options?.categoryId && options.categoryId !== 'all') {
    fallback = fallback.filter((p) => p.categoryId === options.categoryId);
  }
  if (options?.isFeatured) {
    fallback = fallback.filter((p) => p.isFeatured);
  }
  if (options?.isBestSeller) {
    fallback = fallback.filter((p) => p.isBestSeller);
  }
  if (options?.searchQuery) {
    const q = options.searchQuery.toLowerCase().trim();
    fallback = fallback.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    );
  }
  return fallback;
}

// Fetch single product by slug or ID
export async function getProductBySlugOrId(identifier: string): Promise<Product | null> {
  try {
    // Try by ID first
    const directDoc = await getDoc(doc(db, 'products', identifier));
    if (directDoc.exists()) {
      return directDoc.data() as Product;
    }

    // Try by Slug query
    const q = query(collection(db, 'products'), where('slug', '==', identifier), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs[0].data() as Product;
    }
  } catch (err) {
    console.error('Error fetching product:', err);
  }

  // Fallback lookup
  return (
    INITIAL_PRODUCTS.find((p) => p.id === identifier || p.slug === identifier) || null
  );
}

// Admin: Save or update product
export async function saveProduct(product: Product): Promise<void> {
  const ref = doc(db, 'products', product.id);
  await setDoc(
    ref,
    {
      ...product,
      updatedAt: new Date().toISOString()
    },
    { merge: true }
  );
}

// Admin: Delete product
export async function deleteProduct(productId: string): Promise<void> {
  await deleteDoc(doc(db, 'products', productId));
}

// Admin: Save or update category
export async function saveCategory(category: Category): Promise<void> {
  const ref = doc(db, 'categories', category.id);
  await setDoc(
    ref,
    {
      ...category,
      updatedAt: new Date().toISOString()
    },
    { merge: true }
  );
}

// Admin: Delete category
export async function deleteCategory(categoryId: string): Promise<void> {
  await deleteDoc(doc(db, 'categories', categoryId));
}

// Fetch site configuration
export async function getSiteContent(): Promise<any> {
  try {
    const d = await getDoc(doc(db, 'site_content', 'home_settings'));
    if (d.exists()) {
      return d.data();
    }
  } catch (e) {
    console.warn('Error fetching site content:', e);
  }
  return {
    announcementText: '✨ FREE Shipping across India on orders above ₹799! Pure & Honest Grocery.',
    heroHeading: 'Pure Indian Grocery & Spices',
    heroSubheading: 'Pure ingredients. Honest taste. Naturally better. From heritage farms to your kitchen.',
    contactPhone: '+91 9330713861',
    contactEmail: 'chattu1904@gmail.com',
    contactAddress: 'Little Complex, Lalkuthi, Newtown, Kolkata - 700136',
    whatsappNumber: '+91 9330713861',
    freeShippingThreshold: 799,
    standardShippingFee: 50
  };
}

// Admin: Update site configuration
export async function saveSiteContent(content: any): Promise<void> {
  await setDoc(doc(db, 'site_content', 'home_settings'), {
    ...content,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

// Admin: Quick update product stock
export async function updateProductStock(productId: string, newQuantity: number): Promise<void> {
  const ref = doc(db, 'products', productId);
  const newStatus = newQuantity === 0 ? 'out_of_stock' : newQuantity <= 15 ? 'low_stock' : 'in_stock';
  await updateDoc(ref, {
    stockQuantity: newQuantity,
    stockStatus: newStatus,
    updatedAt: new Date().toISOString()
  });
}

// Public convenience aliases
export const getStoreProducts = getProducts;
export const getStoreCategories = getCategories;

