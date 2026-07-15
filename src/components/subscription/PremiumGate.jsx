import React from "react";
import { Lock, Sparkles } from "lucide-react";
import { useSubscription } from "../../hooks/useSubscription";

export const PremiumGate = ({ feature, children, fallbackMessage }) => {
  const { canAccess, setIsUpgradeModalOpen } = useSubscription();

  const hasAccess = canAccess(feature);

  if (hasAccess) {
    return <>{children}</>;
  }

  // Get human readable feature name
  const getFeatureLabel = () => {
    switch (feature) {
      case "aiPriceEstimation":
        return "AI Price Estimation";
      case "aiDescriptionGenerator":
        return "AI Description Generator";
      case "aiChatbotAssistant":
        return "AI Chatbot Assistant";
      case "advancedAnalytics":
        return "Advanced Analytics";
      case "whatsappLeadIntegration":
        return "WhatsApp Lead Integration";
      case "documentGenerator":
        return "Registry Deed Downloads";
      case "multiUserTeam":
        return "Multi-user Workspace Seats";
      case "customBranding":
        return "Custom Broker Branding";
      default:
        return "Premium Feature";
    }
  };

  return (
    <div className="relative group/gate overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* Blurred background preview */}
      <div className="select-none pointer-events-none filter blur-[5px] opacity-40 scale-[1.01] transition-all duration-500">
        {children}
      </div>

      {/* Gated lock card overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-[2px] p-6 text-center animate-in fade-in duration-300">
        <div className="max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-white/20 transform translate-y-0 scale-100 transition-all duration-300 flex flex-col items-center">
          
          {/* Glowing lock badge */}
          <div className="relative flex items-center justify-center w-12 h-12 bg-blue-50 text-blue-600 rounded-xl mb-4 border border-blue-100 shadow-sm animate-pulse">
            <Lock className="w-5 h-5" />
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-500" />
          </div>

          <span className="px-2.5 py-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full text-[9px] font-black uppercase tracking-wider mb-2.5 shadow-sm">
            {getFeatureLabel()}
          </span>

          <h4 className="text-sm font-extrabold text-slate-800 tracking-tight">
            Feature Locked under Current Plan
          </h4>
          
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            {fallbackMessage || `Get instant access to ${getFeatureLabel()} and other AI utilities by upgrading your plan today.`}
          </p>

          <button
            onClick={() => setIsUpgradeModalOpen(true)}
            className="w-full mt-5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 hover:shadow-md text-white font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumGate;
