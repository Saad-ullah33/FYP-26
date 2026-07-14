import React, { useState } from "react";
import { Check, X, ShieldCheck, Sparkles, Loader2, Award, Calendar, HelpCircle } from "lucide-react";
import { useSubscription } from "../hooks/useSubscription";
import { PLANS } from "../data/plans";

const PricingPage = () => {
  const {
    currentPlan,
    billingCycle: activeBillingCycle,
    isProcessingPayment,
    upgradePlan,
  } = useSubscription();

  const [cycle, setCycle] = useState(activeBillingCycle || "monthly");
  const [successPlan, setSuccessPlan] = useState(null);

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

  const comparisonFeatures = [
    { name: "Property Listings Maximum", free: "5 ads max", pro: "Unlimited", business: "Unlimited" },
    { name: "AI Description Generator", free: "3 / month", pro: "Unlimited", business: "Unlimited" },
    { name: "AI Chatbot Assistant", free: "5 msgs / day", pro: "Unlimited", business: "Unlimited" },
    { name: "AI Price Estimation", free: false, pro: true, business: true },
    { name: "Advanced Market Trends", free: false, pro: true, business: true },
    { name: "WhatsApp Lead Integration", free: false, pro: true, business: true },
    { name: "Registry Deed PDF Prints", free: false, pro: true, business: true },
    { name: "Multi-user Team Seats", free: false, pro: false, business: "5 seats" },
    { name: "Custom Broker Branding", free: false, pro: false, business: true },
    { name: "Priority Support Ticket Line", free: false, pro: "24/7 Priority", business: "1-on-1 Dedicated" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* HEADER HERO SECTION */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-wider border border-blue-200 shadow-sm">
          Subscription Plans
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-800 tracking-tight mt-4">
          Flexible Pricing for Smart Real Estate
        </h1>
        <p className="text-sm text-slate-500 mt-4 max-w-2xl mx-auto leading-relaxed">
          Unlock the true potential of your listings with machine-learned spatial indices, automated AI description parameters, and verified title registry details.
        </p>

        {/* BILLING TOGGLE */}
        <div className="flex items-center justify-center gap-3.5 mt-8">
          <span className={`text-sm font-bold transition ${cycle === "monthly" ? "text-slate-800" : "text-slate-400"}`}>
            Monthly Cycle
          </span>
          <button
            onClick={() => setCycle(cycle === "monthly" ? "yearly" : "monthly")}
            className="w-14 h-7 bg-blue-600 rounded-full p-1 transition relative flex items-center shadow-inner cursor-pointer"
          >
            <div 
              className={`w-5 h-5 bg-white rounded-full transition shadow transform ${
                cycle === "yearly" ? "translate-x-7" : "translate-x-0"
              }`} 
            />
          </button>
          <div className="flex items-center gap-1.5">
            <span className={`text-sm font-bold transition ${cycle === "yearly" ? "text-slate-800" : "text-slate-400"}`}>
              Yearly Billing
            </span>
            <span className="px-2.5 py-0.5 text-[9px] bg-emerald-100 text-emerald-800 rounded-full font-black uppercase tracking-wider border border-emerald-200">
              Save 20%
            </span>
          </div>
        </div>
      </div>

      {/* PLANS CARD COLUMNS */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-20">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          const isPopular = plan.popular;
          const price = cycle === "monthly" ? plan.priceMonthly : plan.priceYearly;
          const cycleLabel = cycle === "monthly" ? "month" : "year";

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                isPopular
                  ? "ring-2 ring-blue-600 shadow-xl scale-100 md:scale-[1.03] z-10"
                  : "border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300"
              }`}
            >
              {isPopular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-md">
                  <Sparkles size={11} /> Featured Choice
                </span>
              )}

              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">
                  {plan.name}
                </h3>
                <p className="text-slate-500 text-xs mt-2.5 leading-relaxed min-h-[40px]">
                  {plan.description}
                </p>

                {/* Price block */}
                <div className="my-6 flex items-baseline">
                  <span className="text-slate-500 text-sm font-bold">Rs. </span>
                  <span className="text-4xl font-black text-slate-800 tracking-tight ml-1">
                    {price.toLocaleString()}
                  </span>
                  <span className="text-slate-400 text-sm font-bold ml-1">
                    /{cycleLabel}
                  </span>
                </div>

                {/* Core Perks */}
                <ul className="space-y-4 text-xs border-t border-slate-100 pt-6">
                  {plan.id === "free" && (
                    <>
                      <li className="flex gap-2.5 items-start text-slate-600">
                        <div className="p-0.5 bg-blue-50 text-blue-600 rounded-full shrink-0 border border-blue-100"><Check size={14} /></div>
                        <span className="font-semibold text-slate-700">Up to 5 Listings</span>
                      </li>
                      <li className="flex gap-2.5 items-start text-slate-600">
                        <div className="p-0.5 bg-blue-50 text-blue-600 rounded-full shrink-0 border border-blue-100"><Check size={14} /></div>
                        <span className="font-semibold text-slate-700">3 AI Descriptions per month</span>
                      </li>
                      <li className="flex gap-2.5 items-start text-slate-600">
                        <div className="p-0.5 bg-blue-50 text-blue-600 rounded-full shrink-0 border border-blue-100"><Check size={14} /></div>
                        <span className="font-semibold text-slate-700">5 AI Chatbot messages per day</span>
                      </li>
                    </>
                  )}
                  {plan.id === "pro" && (
                    <>
                      <li className="flex gap-2.5 items-start text-slate-600">
                        <div className="p-0.5 bg-blue-50 text-blue-600 rounded-full shrink-0 border border-blue-100"><Check size={14} /></div>
                        <span className="font-semibold text-slate-700">Unlimited Listings ads</span>
                      </li>
                      <li className="flex gap-2.5 items-start text-slate-600">
                        <div className="p-0.5 bg-blue-50 text-blue-600 rounded-full shrink-0 border border-blue-100"><Check size={14} /></div>
                        <span className="font-semibold text-slate-700">Full AI Price Predictions</span>
                      </li>
                      <li className="flex gap-2.5 items-start text-slate-600">
                        <div className="p-0.5 bg-blue-50 text-blue-600 rounded-full shrink-0 border border-blue-100"><Check size={14} /></div>
                        <span className="font-semibold text-slate-700">Deed prints & PDF downloads</span>
                      </li>
                    </>
                  )}
                  {plan.id === "business" && (
                    <>
                      <li className="flex gap-2.5 items-start text-slate-600">
                        <div className="p-0.5 bg-blue-50 text-blue-600 rounded-full shrink-0 border border-blue-100"><Check size={14} /></div>
                        <span className="font-semibold text-slate-700">All Pro Tier features included</span>
                      </li>
                      <li className="flex gap-2.5 items-start text-slate-600">
                        <div className="p-0.5 bg-blue-50 text-blue-600 rounded-full shrink-0 border border-blue-100"><Check size={14} /></div>
                        <span className="font-semibold text-slate-700">5 seats team license</span>
                      </li>
                      <li className="flex gap-2.5 items-start text-slate-600">
                        <div className="p-0.5 bg-blue-50 text-blue-600 rounded-full shrink-0 border border-blue-100"><Check size={14} /></div>
                        <span className="font-semibold text-slate-700">Custom Broker Branding</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-8">
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isCurrent}
                  className={`w-full py-3.5 text-xs font-black rounded-2xl cursor-pointer transition flex items-center justify-center gap-1.5 shadow-sm ${
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

      {/* DETAILED FEATURE MATRICES */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden mb-16">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-md font-bold text-slate-800">Plan Comparison Matrix</h3>
          <p className="text-xs text-slate-400 mt-1">Direct breakdown of permissions and limits for all 3 subscription tiers.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <th className="px-6 py-4.5 font-black">Features</th>
                <th className="px-6 py-4.5 font-black text-center w-1/5">Free</th>
                <th className="px-6 py-4.5 font-black text-center w-1/5">Pro</th>
                <th className="px-6 py-4.5 font-black text-center w-1/5">Business</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {comparisonFeatures.map((feat, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-bold text-slate-700">{feat.name}</td>
                  
                  {/* Free column */}
                  <td className="px-6 py-4 text-center">
                    {typeof feat.free === "string" ? (
                      <span className="font-semibold text-slate-700">{feat.free}</span>
                    ) : feat.free ? (
                      <Check className="w-4 h-4 text-blue-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>

                  {/* Pro column */}
                  <td className="px-6 py-4 text-center">
                    {typeof feat.pro === "string" ? (
                      <span className="font-semibold text-slate-700 text-blue-600">{feat.pro}</span>
                    ) : feat.pro ? (
                      <Check className="w-4 h-4 text-blue-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>

                  {/* Business column */}
                  <td className="px-6 py-4 text-center">
                    {typeof feat.business === "string" ? (
                      <span className="font-semibold text-slate-700 text-indigo-600">{feat.business}</span>
                    ) : feat.business ? (
                      <Check className="w-4 h-4 text-indigo-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TRANSACTION OVERLAYS */}
      {isProcessingPayment && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[2100] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
          <div className="max-w-xs bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <h3 className="text-sm font-black text-slate-800 tracking-tight">Processing Secure Payment</h3>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Contacting checkout gateway (Stripe/Easypaisa sandbox)... Please wait a moment while we configure your premium nodes.
            </p>
          </div>
        </div>
      )}

      {successPlan && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[2100] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
          <div className="max-w-xs bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 flex items-center justify-center mb-4 shadow-inner">
              <Check className="w-6 h-6 animate-bounce" />
            </div>
            <h3 className="text-sm font-black text-slate-800 tracking-tight">Subscription Confirmed!</h3>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Welcome to {successPlan.toUpperCase()} plan. Your premium tools have been initialized and are fully ready to use.
            </p>
          </div>
        </div>
      )}

      {/* Secure Transaction footer banner */}
      <div className="max-w-md mx-auto text-center flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 mt-8">
        <ShieldCheck className="w-4 h-4 text-slate-350 shrink-0" />
        <span>Simulated Paywall Environment. No actual money transactions occur.</span>
      </div>

    </div>
  );
};

export default PricingPage;
