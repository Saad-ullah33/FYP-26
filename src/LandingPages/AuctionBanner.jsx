import { IconFileCheckFilled } from '@tabler/icons-react';
import React from 'react';
import ScrollReveal from '../components/ScrollReveal';
import BorderBeam from '../components/BorderBeam';

export const AuctionBanner = () => {
  return (
    <div className="relative py-20 bg-white">
      
      {/* ── HEADER ── */}
      <ScrollReveal direction="up" duration={0.8}>
        <div className="container mx-auto px-6 text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
            Sell Your Property with Ease Through{" "}
            <span className="text-blue-600 underline decoration-2 decoration-blue-500/30 underline-offset-4">
              Bidding!
            </span>
          </h2>
          <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto py-5">
            Experience a transparent, competitive, and secure digital auction platform.
          </p>
        </div>
      </ScrollReveal>

      {/* ── RESPONSIVE GRID CARDS ── */}
      <ScrollReveal 
        cascade={true} 
        direction="up" 
        staggerAmount={0.12} 
        duration={0.8}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-6 py-2"
      >
        
        {/* Card 1: Verified Dealers */}
        <div className="relative overflow-hidden bg-white hover:bg-slate-50/50 border border-slate-100 hover:border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-slate-100/60 hover:-translate-y-1.5 group">
          {/* Border Beam Animation */}
          <BorderBeam size={130} duration={8} borderWidth={1.5} delay={0} />

          {/* Glowing Icon Wrapper (Soft Pastel Blue) */}
          <div className="flex items-center justify-center w-16 h-14 rounded-xl bg-blue-50/70 text-blue-600 mb-4 group-hover:scale-110 group-hover:bg-blue-100/80 transition-all duration-300 shadow-inner">
            <img
              className="h-9 w-9 object-contain"
              src="https://res.cloudinary.com/dr3ie9gpz/image/upload/v1739352981/emehyfjsfhivhsyjsaki.webp"
              alt="verified"
            />
          </div>

          <h3 className="text-slate-900 font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors duration-200">
            Verified Dealers
          </h3>

          <p className="text-slate-600 text-sm leading-relaxed">
            Explore only trusted, verified dealers for a seamless buying experience.
          </p>
        </div>

        {/* Card 2: Trusted Listings */}
        <div className="relative overflow-hidden bg-white hover:bg-slate-50/50 border border-slate-100 hover:border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-slate-100/60 hover:-translate-y-1.5 group">
          {/* Border Beam Animation */}
          <BorderBeam size={130} duration={8} borderWidth={1.5} delay={0} />

          {/* Glowing Icon Wrapper (Soft Pastel Blue) */}
          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-blue-50/70 text-blue-600 mb-4 group-hover:scale-110 group-hover:bg-blue-100/80 transition-all duration-300 shadow-inner">
            <IconFileCheckFilled className="h-8 w-8 text-blue-600" />
          </div>

          <h3 className="text-slate-900 font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors duration-200">
            Trusted Listings
          </h3>

          <p className="text-slate-600 text-sm leading-relaxed">
            Browse listings that are verified and reviewed to ensure complete reliability.
          </p>
        </div>

        {/* Card 3: Auction */}
        <div className="relative overflow-hidden bg-white hover:bg-slate-50/50 border border-slate-100 hover:border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-slate-100/60 hover:-translate-y-1.5 group">
          {/* Border Beam Animation */}
          <BorderBeam size={130} duration={8} borderWidth={1.5} delay={0} />

          {/* Glowing Icon Wrapper (Soft Pastel Blue) */}
          <div className="flex items-center justify-center w-16 h-14 rounded-xl bg-blue-50/70 text-blue-600 mb-4 group-hover:scale-110 group-hover:bg-blue-100/80 transition-all duration-300 shadow-inner">
            <img
              className="h-10 w-10 object-contain"
              src="https://res.cloudinary.com/dr3ie9gpz/image/upload/v1739352935/br5b7uyssnqyijfqx0zt.webp"
              alt="verified"
            />
          </div>

          <h3 className="text-slate-900 font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors duration-200">
            Auction
          </h3>

          <p className="text-slate-600 text-sm leading-relaxed">
            Bid on your favorite property in exciting online auctions with competitive pricing!
          </p>
        </div>
      </ScrollReveal>
    </div>
  );
};