import React, { useState } from "react";
import { Check, X, Loader2, Sparkles, AlertTriangle, ShieldCheck } from "lucide-react";
import { useSubscription } from "../../hooks/useSubscription";
import { PLANS } from "../../Data/plans";

export const UpgradeModal = () => {
  const {
    isUpgradeModalOpen,
    setIsUpgradeModalOpen,
    currentPlan,
    billingCycle: activeBillingCycle,
    isProcessingPayment,
    upgradePlan,
  } = useSubscription();

  const [cycle, setCycle] = useState(activeBillingCycle || "monthly");
  const [successPlan, setSuccessPlan] = useState(null);

  if (!isUpgradeModalOpen) return null;

  const handleUpgrade = async (planId) => {
    if (planId === currentPlan) return;
    const res = await upgradePlan(planId, cycle);
    if (res?.success) {
      setSuccessPlan(planId);
      setTimeout(() => {
        setSuccessPlan(null);
      }, 3000);
    }
  };

  const getFeaturesList = () => [
    { label: "Property Ad Listings", free: "5 Listings max", pro: "Unlimited Listings", biz: "Unlimited Listings" },
    { label: "AI Description Generator", free: "3 / month", pro: "Unlimited", biz: "Unlimited" },
    { label: "AI Chatbot Assistant", free: "5 msgs / day", pro: "Unlimited", biz: "Unlimited" },
    { label: "AI Price Estimation", free: false, pro: true, biz: true },
    { label: "Advanced Analytics & Trends", free: false, pro: true, biz: true },
    { label: "WhatsApp Lead Integration", free: false, pro: true, biz: true },
    { label: "Registry Deed PDF Prints", free: false, pro: true, biz: true },
    { label: "Multi-user Team Workspace", free: false, pro: false, biz: "5 Seats included" },
    { label: "Custom Broker Branding", free: false, pro: false, biz: true },
  ];

  return (
    <div className="fixed inset-0 z-[2000] flex sm:items-center sm:justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-300">
      {/* Dark overlay backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
        onClick={() => !isProcessingPayment && setIsUpgradeModalOpen(false)}
      />

      {/* Modal Card wrapper */}
      <div className="relative bg-slate-50 w-full sm:max-w-5xl rounded-t-3xl sm:rounded-3xl shadow-2xl border-t sm:border border-slate-200/85 overflow-hidden animate-in fade-in zoom-in-95 duration-350 max-h-[95vh] sm:max-h-[90vh] mt-auto sm:mt-0 flex flex-col z-10">
        
        {/* CLOSE BUTTON */}
        {!isProcessingPayment && (
          <button
            onClick={() => setIsUpgradeModalOpen(false)}
            className="absolute top-5 right-5 z-30 p-2 bg-white/80 hover:bg-slate-100 rounded-full border border-slate-200 transition text-slate-500 cursor-pointer hover:scale-105"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Modal content body (scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          
          {/* HEADER SECTION */}
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border border-blue-100">
              Pricing Options
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight mt-2.5">
              Choose the Perfect Plan for You
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Accelerate your real estate transactions across Faisalabad using our state-of-the-art AI valuation nodes and dashboard integrations.
            </p>

            {/* BILLING CYCLE TOGGLE */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <span className={`text-xs font-bold transition ${cycle === "monthly" ? "text-slate-800" : "text-slate-400"}`}>
                Monthly Billing
              </span>
              <button
                onClick={() => setCycle(cycle === "monthly" ? "yearly" : "monthly")}
                className="w-12 h-6 bg-blue-600 rounded-full p-1 transition relative flex items-center shadow-inner cursor-pointer"
              >
                <div 
                  className={`w-4 h-4 bg-white rounded-full transition shadow transform ${
                    cycle === "yearly" ? "translate-x-6" : "translate-x-0"
                  }`} 
                />
              </button>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-bold transition ${cycle === "yearly" ? "text-slate-800" : "text-slate-400"}`}>
                  Yearly Saver
                </span>
                <span className="px-2 py-0.5 text-[9px] bg-emerald-100 text-emerald-800 rounded-full font-black uppercase tracking-wide border border-emerald-200">
                  Save 20%
                </span>
              </div>
            </div>
          </div>

          {/* PLANS MATRIX GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {PLANS.map((plan) => {
              const isCurrent = plan.id === currentPlan;
              const isPopular = plan.popular;
              const price = cycle === "monthly" ? plan.priceMonthly : plan.priceYearly;
              const cycleLabel = cycle === "monthly" ? "month" : "year";

              return (
                <div 
                  key={plan.id}
                  className={`relative rounded-3xl p-6 bg-white flex flex-col justify-between transition-all duration-300 ${
                    isPopular 
                      ? "ring-2 ring-blue-600 shadow-xl scale-[1.01] md:scale-[1.02] z-10" 
                      : "border border-slate-200 shadow-sm hover:border-slate-350"
                  }`}
                >
                  {/* Popular Plan Badge */}
                  {isPopular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3.5 py-1 text-[9px] font-black rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                      <Sparkles size={11} /> Most Popular
                    </span>
                  )}

                  <div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">
                      {plan.name}
                    </h3>
                    <p className="text-slate-500 text-[11px] mt-1.5 leading-relaxed min-h-[36px]">
                      {plan.description}
                    </p>

                    {/* Price Tag */}
                    <div className="my-5">
                      <span className="text-slate-500 text-xs font-bold">Rs. </span>
                      <span className="text-3xl font-black text-slate-800 tracking-tight">
                        {price.toLocaleString()}
                      </span>
                      <span className="text-slate-400 text-xs font-bold">
                        /{cycleLabel}
                      </span>
                    </div>

                    {/* Features list */}
                    <ul className="space-y-3.5 text-xs text-slate-600 border-t border-slate-100 pt-5">
                      {getFeaturesList().map((feat, idx) => {
                        const cellVal = plan.id === "free" ? feat.free : plan.id === "pro" ? feat.pro : feat.biz;
                        
                        return (
                          <li key={idx} className="flex gap-2.5 items-start">
                            {cellVal ? (
                              <>
                                <div className="p-0.5 bg-blue-50 text-blue-600 rounded-full shrink-0 border border-blue-100">
                                  <Check className="w-3.5 h-3.5" />
                                </div>
                                <span className="font-semibold text-slate-700 leading-tight">
                                  {typeof cellVal === "string" ? cellVal : feat.label}
                                </span>
                              </>
                            ) : (
                              <>
                                <div className="p-0.5 bg-slate-50 text-slate-300 rounded-full shrink-0 border border-slate-100">
                                  <X className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-slate-350 line-through leading-tight">
                                  {feat.label}
                                </span>
                              </>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* ACTION CTA BUTTON */}
                  <div className="mt-8">
                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={isCurrent}
                      className={`w-full py-3 text-xs font-black rounded-2xl cursor-pointer transition flex items-center justify-center gap-1.5 shadow-sm ${
                        isCurrent
                          ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                          : isPopular
                          ? "bg-blue-600 hover:bg-blue-700 hover:shadow-md text-white shadow-blue-500/15"
                          : "bg-slate-900 hover:bg-black text-white hover:shadow-md"
                      }`}
                    >
                      {isCurrent ? "Active Plan" : `Upgrade to ${plan.name}`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Secure Transaction footer banner */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 text-center flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Simulated Paywall Environment. No actual money transactions occur.</span>
        </div>

        {/* PAYMENT PROCESSING OVERLAY */}
        {isProcessingPayment && (
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md z-[2100] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
            <div className="max-w-xs bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
              <h3 className="text-sm font-black text-slate-800 tracking-tight">
                Processing Secure Payment
              </h3>
              <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                Contacting checkout gateway (Stripe/Easypaisa sandbox)... Please wait a moment while we configure your premium nodes.
              </p>
            </div>
          </div>
        )}

        {/* TRANSACTION SUCCESS OVERLAY */}
        {successPlan && (
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md z-[2100] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
            <div className="max-w-xs bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 flex items-center justify-center mb-4 shadow-inner">
                <Check className="w-6 h-6 animate-bounce" />
              </div>
              <h3 className="text-sm font-black text-slate-800 tracking-tight">
                Subscription Confirmed!
              </h3>
              <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                Welcome to {successPlan.toUpperCase()} plan. Your premium tools have been initialized and are fully ready to use.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UpgradeModal;
