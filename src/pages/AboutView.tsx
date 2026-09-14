import React from 'react';
import { ShieldCheck, Heart, Sparkles, CheckCircle2, Award, Phone } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#2D5A47]">
          About MATIRA Natural Foods
        </span>
        <h1 className="font-serif-heading text-3xl sm:text-5xl font-bold text-[#1C1917]">
          Pure Ingredients. Honest Taste. Naturally Better.
        </h1>
        <p className="text-sm sm:text-base text-[#78716C] leading-relaxed">
          Founded in Kolkata, MATIRA was born out of a simple longing: to bring the unadulterated flavors of our childhood kitchens back to contemporary Indian dining tables.
        </p>
      </div>

      {/* Origin & Philosophy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4 text-xs sm:text-sm text-[#57534E] leading-relaxed">
          <h2 className="font-serif-heading text-2xl font-bold text-[#1C1917]">
            Rooted in <em>"Mati"</em> — The Sacred Living Soil
          </h2>
          <p>
            In Indian tradition, true flavor does not come from laboratories or chemical preservatives. It comes from the mineral-rich soil of native agricultural regions: the dry desert winds that concentrate the volatile cumin oils of Nagaur, Rajasthan; the pristine high valleys of Meghalaya yieldingLakadong turmeric with 7%+ curcumin; and the deep forest reserves where honey bees gather wild flora.
          </p>
          <p>
            When spices are factory-ground at rapid speeds, intense friction heat evaporates their natural aromatics and healing bio-actives. At MATIRA, our whole spices are cleaned with zero chemicals, sun-dried, and stone-ground gently to lock in every trace of volatile oil.
          </p>
          <p>
            Our wood-pressed oils (Kachi Ghani) are extracted using age-old wooden Kolhus below 40°C, guaranteeing zero petroleum solvent extraction or refining bleach.
          </p>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-xl border border-[#E7E2D9]">
          <img
            src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80"
            alt="MATIRA Pure Spices and Grocery"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* 4 Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E7E2D9] space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#E8F3ED] text-[#1A362B] flex items-center justify-center font-bold">
            1
          </div>
          <h3 className="font-serif-heading text-base font-bold text-[#1C1917]">Direct Origin Sourcing</h3>
          <p className="text-xs text-[#78716C] leading-relaxed">
            We partner with regional farmers across Rajasthan, Kerala, Meghalaya, and Bengal, eliminating middlemen and artificial inventory hoarding.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E7E2D9] space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#E8F3ED] text-[#1A362B] flex items-center justify-center font-bold">
            2
          </div>
          <h3 className="font-serif-heading text-base font-bold text-[#1C1917]">Zero Adulteration</h3>
          <p className="text-xs text-[#78716C] leading-relaxed">
            Tested and certified free from synthetic dyes (Sudan/Metanil yellow), starch fillers, mineral oil gloss, or artificial flavors.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E7E2D9] space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#E8F3ED] text-[#1A362B] flex items-center justify-center font-bold">
            3
          </div>
          <h3 className="font-serif-heading text-base font-bold text-[#1C1917]">Fresh Small Batches</h3>
          <p className="text-xs text-[#78716C] leading-relaxed">
            We pack in micro-batches to ensure you never receive dead spice inventory that has languished for months in regional warehouses.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E7E2D9] space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#E8F3ED] text-[#1A362B] flex items-center justify-center font-bold">
            4
          </div>
          <h3 className="font-serif-heading text-base font-bold text-[#1C1917]">Responsible Packaging</h3>
          <p className="text-xs text-[#78716C] leading-relaxed">
            Multi-layer aroma-barrier pouches and food-grade tins ensure zero moisture penetration and retain original harvest aromas.
          </p>
        </div>
      </div>

      {/* Kolkata Facility Banner */}
      <div className="bg-[#1A362B] text-white rounded-3xl p-8 sm:p-12 border border-[#2D5A47] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="font-serif-heading text-2xl font-bold text-[#EAD098]">
            Visit or Connect with MATIRA Natural Foods
          </h3>
          <p className="text-xs sm:text-sm text-[#D1E0D7] max-w-xl">
            Our central fulfillment and packing unit operates out of Newtown, Kolkata. We are delighted to assist with family grocery subscriptions, organic bulk spice inquiries, or festive corporate hampers.
          </p>
        </div>
        <a
          href="https://wa.me/919330713861"
          target="_blank"
          rel="noreferrer"
          className="px-6 py-3.5 bg-[#EAD098] hover:bg-[#F2DEC0] text-[#142A21] font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0 flex items-center gap-2"
        >
          <Phone className="w-4 h-4" />
          <span>WhatsApp +91 9330713861</span>
        </a>
      </div>
    </div>
  );
};
