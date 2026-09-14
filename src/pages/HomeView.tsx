import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles, CheckCircle2, Phone, Star, Leaf, Award, HeartHandshake } from 'lucide-react';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';

interface HomeViewProps {
  categories?: Category[];
  products?: Product[];
  onSelectProduct: (product: Product) => void;
  onNavigate?: (view: string, param?: string) => void;
  onCategoryClick?: (categoryId: string) => void;
  onSelectCategory?: (categoryId: string) => void;
  onNavigateShop?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  categories = [],
  products = [],
  onSelectProduct,
  onNavigate,
  onCategoryClick,
  onSelectCategory,
  onNavigateShop
}) => {
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  const handleNav = (view: string, param?: string) => {
    if (onNavigate) {
      onNavigate(view, param);
    } else if (view === 'shop' && onNavigateShop) {
      onNavigateShop();
    }
  };

  const handleCatClick = (categoryId: string) => {
    if (onCategoryClick) {
      onCategoryClick(categoryId);
    } else if (onSelectCategory) {
      onSelectCategory(categoryId);
    } else if (onNavigate) {
      onNavigate('shop', categoryId);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[580px] sm:min-h-[640px] flex items-center justify-center overflow-hidden bg-[#162D24] text-white">
        {/* Background Image with Dark Emerald/Warm Wood Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1920&q=80"
            alt="Pure Indian Spices and Grocery"
            className="w-full h-full object-cover object-center opacity-30 mix-blend-overlay scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#142A21] via-[#1A362B]/90 to-[#142A21]/70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          {/* Subtle Tagline */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAD098]/15 border border-[#EAD098]/30 text-[#EAD098] text-xs font-semibold uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Honest Indian Staples Direct from Heritage Growers</span>
          </div>

          {/* Primary Messaging */}
          <h1 className="font-serif-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-4">
            <span className="text-[#EAD098]">MATIRA</span>
            <br />
            <span className="text-3xl sm:text-5xl md:text-6xl font-normal italic">
              Pure Indian Grocery & Spices
            </span>
          </h1>

          {/* Supporting Messaging */}
          <p className="max-w-2xl mx-auto text-base sm:text-xl text-[#D1E0D7] font-light leading-relaxed mb-8">
            "Pure ingredients. Honest taste. Naturally better."
            <br />
            <span className="text-sm sm:text-base text-[#A3B8AC]">
              Unadulterated spices, cold-pressed oils, raw forest honey, and unpolished dals delivered straight to your home.
            </span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => handleNav('shop')}
              className="w-full sm:w-auto px-8 py-4 bg-[#EAD098] hover:bg-[#F2DEC0] text-[#142A21] font-bold text-sm tracking-wider uppercase rounded-xl transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              id="hero-shop-now-btn"
            >
              <span>SHOP NOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleNav('categories')}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm tracking-wider uppercase rounded-xl transition-all backdrop-blur-xs flex items-center justify-center gap-2"
              id="hero-explore-products-btn"
            >
              <span>EXPLORE PRODUCTS</span>
            </button>
          </div>

          {/* Key Metric Highlights */}
          <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-[#EAD098]">100%</div>
              <div className="text-xs text-[#A3B8AC]">Unpolished & Preservative Free</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-[#EAD098]">₹500</div>
              <div className="text-xs text-[#A3B8AC]">Pure Rajasthan Jeera / 1 kg</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-[#EAD098]">₹799+</div>
              <div className="text-xs text-[#A3B8AC]">Free Shipping Pan India</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-[#EAD098]">24h</div>
              <div className="text-xs text-[#A3B8AC]">Dispatch from Newtown, Kolkata</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY CHOOSE MATIRA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-[#2D5A47] font-bold">
            The MATIRA Standard
          </span>
          <h2 className="font-serif-heading text-2xl sm:text-4xl font-bold text-[#1C1917] mt-1">
            Why Choose MATIRA?
          </h2>
          <p className="text-sm text-[#78716C] mt-2">
            In an era of mass commercial processing, we preserve ancient Indian kitchen purity with absolute transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E7E2D9] hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#E8F3ED] text-[#1A362B] flex items-center justify-center font-bold text-xl mb-4">
              🌱
            </div>
            <h3 className="font-serif-heading text-base sm:text-lg font-bold text-[#1C1917]">Pure Ingredients</h3>
            <p className="text-xs sm:text-sm text-[#78716C] mt-2 leading-relaxed">
              Never blended with starch, synthetic coloring, sawdust, or cheap fillers. Every grain and spice is test-verified for natural purity.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E7E2D9] hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#E8F3ED] text-[#1A362B] flex items-center justify-center font-bold text-xl mb-4">
              ✨
            </div>
            <h3 className="font-serif-heading text-base sm:text-lg font-bold text-[#1C1917]">Quality Focused</h3>
            <p className="text-xs sm:text-sm text-[#78716C] mt-2 leading-relaxed">
              Stone-ground at low temperatures and wood-pressed (Kolhu) below 40°C to preserve natural volatile oils, antioxidants, and aroma.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E7E2D9] hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#E8F3ED] text-[#1A362B] flex items-center justify-center font-bold text-xl mb-4">
              🥘
            </div>
            <h3 className="font-serif-heading text-base sm:text-lg font-bold text-[#1C1917]">Authentic Indian Taste</h3>
            <p className="text-xs sm:text-sm text-[#78716C] mt-2 leading-relaxed">
              Rajasthan Cumin, Meghalaya Lakadong Haldi, Kerala Cardamom, and Kashmir Chillies—native origins where soil and climate create supreme flavor.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E7E2D9] hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#E8F3ED] text-[#1A362B] flex items-center justify-center font-bold text-xl mb-4">
              🌾
            </div>
            <h3 className="font-serif-heading text-base sm:text-lg font-bold text-[#1C1917]">Carefully Selected</h3>
            <p className="text-xs sm:text-sm text-[#78716C] mt-2 leading-relaxed">
              Every harvest is hand-sorted and sun-dried. We discard substandard batches and reject chemically ripened products.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E7E2D9] hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#E8F3ED] text-[#1A362B] flex items-center justify-center font-bold text-xl mb-4">
              📦
            </div>
            <h3 className="font-serif-heading text-base sm:text-lg font-bold text-[#1C1917]">Trusted Packaging</h3>
            <p className="text-xs sm:text-sm text-[#78716C] mt-2 leading-relaxed">
              Aroma-lock foil pouches and food-grade barriers ensure zero moisture ingress, guaranteeing original farm-freshness at your doorstep.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E7E2D9] hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#E8F3ED] text-[#1A362B] flex items-center justify-center font-bold text-xl mb-4">
              ⚡
            </div>
            <h3 className="font-serif-heading text-base sm:text-lg font-bold text-[#1C1917]">Convenient Shopping</h3>
            <p className="text-xs sm:text-sm text-[#78716C] mt-2 leading-relaxed">
              Order seamlessly with live tracking, Cash on Delivery support, and personalized WhatsApp assistance whenever you need help.
            </p>
          </div>
        </div>
      </section>

      {/* 3. SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#2D5A47] font-bold">
              Collections
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#1C1917] mt-1">
              Shop by Category
            </h2>
          </div>
          <button
            onClick={() => handleNav('categories')}
            className="text-xs sm:text-sm font-semibold text-[#1A362B] hover:text-[#2D5A47] flex items-center gap-1 mt-2 sm:mt-0"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCatClick(cat.id)}
              className="group relative rounded-2xl overflow-hidden aspect-4/3 sm:aspect-square cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-[#E7E2D9]"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                <h3 className="font-serif-heading text-base sm:text-lg font-bold group-hover:text-[#EAD098] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-white/80 line-clamp-1 mt-0.5">
                  {cat.description}
                </p>
                <span className="text-[10px] uppercase font-bold text-[#EAD098] mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Browse items <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#8B5E3C] font-bold">
              Hand-Picked Selection
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#1C1917] mt-1">
              Featured Staples
            </h2>
          </div>
          <button
            onClick={() => handleNav('shop')}
            className="text-xs sm:text-sm font-semibold text-[#1A362B] hover:text-[#2D5A47] flex items-center gap-1 mt-2 sm:mt-0"
          >
            <span>See Full Store</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onSelect={onSelectProduct} />
          ))}
        </div>
      </section>

      {/* 5. SPOTLIGHT BANNER: PURE CUMIN / JEERA MANDATE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1A362B] rounded-3xl overflow-hidden border border-[#2D5A47] text-white grid grid-cols-1 lg:grid-cols-2 shadow-xl">
          <div className="p-8 sm:p-12 md:p-16 flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAD098]/20 text-[#EAD098] text-xs font-bold uppercase tracking-wider w-fit">
              Harvest Spotlight
            </div>
            
            <div>
              <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-white leading-tight">
                Pure Whole Cumin Seeds (Jeera)
              </h2>
              <p className="text-xl sm:text-2xl font-semibold text-[#EAD098] mt-2">
                ₹500 <span className="text-sm text-[#D1E0D7] font-normal">/ 1 kg pack</span>{' '}
                <span className="text-xs text-[#A3B8AC] line-through ml-2">MRP ₹599</span>
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#D1E0D7] leading-relaxed">
              Directly from Nagaur, Rajasthan. Stone-sorted and sun-dried under clean desert skies without synthetic gloss or sulfur fumigation. Packed with high cuminaldehyde oil that provides intense aromatic warmth to daily tadkas.
            </p>

            <ul className="space-y-2 text-xs sm:text-sm text-[#EAD098]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#88D49E]" />
                100% Whole Cumin Seeds with zero dust or hollow husks
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#88D49E]" />
                Rich in natural essential oils for superior digestive comfort
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#88D49E]" />
                Freshly sealed in nitrogen-flushed multi-layer freshness pouches
              </li>
            </ul>

            <div>
              <button
                onClick={() => handleNav('shop')}
                className="px-6 py-3.5 bg-[#EAD098] hover:bg-[#F2DEC0] text-[#142A21] font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                <span>Order Pure Jeera Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative min-h-[300px] lg:min-h-full bg-[#142A21] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80"
              alt="MATIRA Pure Cumin Seeds"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A362B] via-transparent to-transparent lg:hidden" />
          </div>
        </div>
      </section>

      {/* 6. BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#1A362B] font-bold">
              Customer Favorites
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#1C1917] mt-1">
              Best Sellers
            </h2>
          </div>
          <button
            onClick={() => handleNav('shop')}
            className="text-xs sm:text-sm font-semibold text-[#1A362B] hover:text-[#2D5A47] flex items-center gap-1 mt-2 sm:mt-0"
          >
            <span>Explore Store</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} onSelect={onSelectProduct} />
          ))}
        </div>
      </section>

      {/* 7. MATIRA BRAND STORY & NATURAL FOODS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF8F5] border border-[#E7E2D9] rounded-3xl p-8 sm:p-12 md:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2D5A47]">
              The Story of MATIRA
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-4xl font-bold text-[#1C1917] leading-tight">
              Reconnecting Indian Kitchens with Uncompromised Earthy Purity
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-[#57534E] leading-relaxed">
              <p>
                In the Bengali and Indian linguistic roots, <em>Matira</em> reflects <em>"Mati"</em> — the sacred living earth that nurtures life. We founded MATIRA Natural Foods with one unshakeable principle: the food we feed our families must remain exactly as nature intended.
              </p>
              <p>
                Commercial grocery shelves have become crowded with chemically polished lentils, solvent-extracted oils, and adulterated spice powders depleted of natural oils. At MATIRA, we reject industrial shortcuts.
              </p>
              <p>
                From cold-pressing mustard seeds in wooden Kolhus to sourcing raw, unpasteurized forest honey from indigenous collectors, we bring honesty back to your daily meals.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3 bg-white rounded-xl border border-[#E7E2D9]">
                <p className="text-lg font-bold text-[#1A362B]">Zero</p>
                <p className="text-xs text-[#78716C]">Synthetic Polishing</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E7E2D9]">
                <p className="text-lg font-bold text-[#1A362B]">100%</p>
                <p className="text-xs text-[#78716C]">Stone Ground Spices</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E7E2D9]">
                <p className="text-lg font-bold text-[#1A362B]">Raw</p>
                <p className="text-xs text-[#78716C]">Unpasteurized Honey</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#E7E2D9]">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                alt="Natural Indian Spices and Grocery"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 8. CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-[#2D5A47] font-bold">
            Real Experiences
          </span>
          <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#1C1917] mt-1">
            Loved by Indian Homes
          </h2>
          <p className="text-xs sm:text-sm text-[#78716C] mt-1">
            Honest reviews from families, home cooks, and food connoisseurs across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E7E2D9] space-y-3">
            <div className="flex text-[#D97706] gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed italic">
              "The aroma of MATIRA Cumin (Jeera) when tossed into hot ghee took me back to my grandmother's village in Rajasthan. You can immediately tell it has not been stripped of its essential oil."
            </p>
            <div className="pt-2 border-t border-[#F2ECE1]">
              <p className="text-xs font-bold text-[#1C1917]">Sunita Singhania</p>
              <p className="text-[11px] text-[#78716C]">Home Chef, Kolkata</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E7E2D9] space-y-3">
            <div className="flex text-[#D97706] gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed italic">
              "Their Kachi Ghani Mustard Oil has that authentic sharp kick you rarely find in packaged supermarket oils today. It elevated our weekend Macher Jhol completely."
            </p>
            <div className="pt-2 border-t border-[#F2ECE1]">
              <p className="text-xs font-bold text-[#1C1917]">Debabrata Roy</p>
              <p className="text-[11px] text-[#78716C]">Newtown, Kolkata</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E7E2D9] space-y-3">
            <div className="flex text-[#D97706] gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed italic">
              "Raw wild honey from MATIRA crystallizes naturally in cool weather—the definitive proof of zero adulteration. Prompt delivery and very safe packaging."
            </p>
            <div className="pt-2 border-t border-[#F2ECE1]">
              <p className="text-xs font-bold text-[#1C1917]">Dr. Ananya Murthy</p>
              <p className="text-[11px] text-[#78716C]">Bengaluru</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. WHATSAPP & CONTACT CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#1A362B] to-[#142A21] rounded-3xl p-8 sm:p-12 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 border border-[#2D5A47] shadow-xl">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#EAD098]">
              Personalized Grocery Care
            </span>
            <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-white">
              Need assistance or prefer ordering over WhatsApp?
            </h3>
            <p className="text-xs sm:text-sm text-[#D1E0D7] leading-relaxed">
              Our Kolkata team is available directly on WhatsApp to answer questions regarding product sourcing, custom bulk orders, or shipping timelines.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href="https://wa.me/919330713861?text=Hello%20MATIRA%20Natural%20Foods,%20I%20would%20like%20to%20place%20an%20order."
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>WhatsApp: +91 9330713861</span>
            </a>
            <button
              onClick={() => handleNav('contact')}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
