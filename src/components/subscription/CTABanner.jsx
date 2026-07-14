import React, { useState } from "react";
import { Sparkles, X, ArrowUpRight } from "lucide-react";
import { useSubscription } from "../../hooks/useSubscription";

export const CTABanner = () => {
  const { currentPlan, setIsUpgradeModalOpen } = useSubscription();
  const [dismissed, setDismissed] = useState(false);

  // Render only if user is on Free plan and has not dismissed the banner
  if (currentPlan !== "free" || dismissed) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white rounded-3xl p-5 md:p-6 shadow-lg border border-white/10 animate-in slide-in-from-top-6 duration-400 mb-6">
      
      {/* Background glow animations */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />

      {/* Dismiss Button */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-4 right-4 text-white/60 hover:text-white hover:bg-white/10 rounded-full p-1 transition cursor-pointer"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pr-6">
        
        {/* Info Left */}
        <div className="flex gap-4 items-start md:items-center">
          <div className="p-3 bg-white/10 border border-white/20 text-amber-400 rounded-2xl shrink-0 hidden sm:flex">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-amber-400 text-slate-900 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm">
                Pro Tools Promo
              </span>
              <h3 className="font-extrabold text-sm tracking-tight">
                Unlock Faisalabad's AI Valuation Network
              </h3>
            </div>
            <p className="text-xs text-white/80 mt-1.5 leading-relaxed max-w-2xl">
              Get unlimited property ads listings, generate instant AI descriptions, use the AI Chatbot Assistant without daily caps, and verify official deeds. Upgrade to Pro for just <strong>Rs. 2,999/month</strong>.
            </p>
          </div>
        </div>

        {/* Upgrade Buttons Right */}
        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
          <button
            onClick={() => setIsUpgradeModalOpen(true)}
            className="w-full md:w-auto justify-center px-5 py-2.5 bg-amber-400 hover:bg-amber-350 text-slate-900 font-extrabold text-xs rounded-xl shadow-md transition-all duration-300 hover:shadow-lg cursor-pointer hover:scale-[1.02] flex items-center gap-1.5 min-h-[44px]"
          >
            Upgrade Now
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};

export default CTABanner;
