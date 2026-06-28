import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MOCK_AUCTIONS } from "../../constants/mockAuctions";
import { useAuth } from "../../context/AuthContext";
import { 
  ChevronLeft, 
  MapPin, 
  Clock, 
  TrendingUp, 
  DollarSign, 
  Send, 
  Users, 
  ShieldCheck, 
  ChevronRight, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  Info,
  Layers,
  Heart,
  Volume2,
  VolumeX,
  Plus
} from "lucide-react";

// Ticking Timer Component with color shifts
const DetailCountdown = ({ endDate, onEnded }) => {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0, ended: false });

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(endDate) - new Date();
      if (difference <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0, ended: true });
        if (onEnded) onEnded();
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const m = Math.floor((difference / (1000 * 60)) % 60);
      const s = Math.floor((difference / 1000) % 60);

      setTimeLeft({ d, h, m, s, ended: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  if (timeLeft.ended) {
    return (
      <div className="flex items-center gap-2 text-red-500 font-bold bg-red-50 px-4 py-2.5 rounded-xl border border-red-100 text-sm">
        <AlertCircle size={18} /> Auction Closed
      </div>
    );
  }

  const isEndingSoon = timeLeft.d === 0 && timeLeft.h < 2; // Under 2 hours

  return (
    <div className={`p-4 rounded-2xl border transition-all duration-300 ${
      isEndingSoon 
        ? "bg-red-50 border-red-200 text-red-600 animate-pulse shadow-sm shadow-red-100" 
        : "bg-blue-50/50 border-blue-100 text-blue-700"
    }`}>
      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1 flex items-center gap-1">
        <Clock size={12} className={isEndingSoon ? "text-red-500" : "text-blue-500"} /> Time Remaining
      </p>
      <div className="font-mono text-xl md:text-2xl font-black flex gap-1 items-center">
        {timeLeft.d > 0 && (
          <>
            <span>{timeLeft.d}</span>
            <span className="text-xs text-slate-400 font-sans font-normal uppercase mr-1.5">d</span>
          </>
        )}
        <span>{timeLeft.h.toString().padStart(2, '0')}</span>
        <span className="text-slate-400 text-base font-sans font-normal mx-0.5">:</span>
        <span>{timeLeft.m.toString().padStart(2, '0')}</span>
        <span className="text-slate-400 text-base font-sans font-normal mx-0.5">:</span>
        <span className={`${isEndingSoon ? "text-red-600" : "text-indigo-600 font-bold"}`}>{timeLeft.s.toString().padStart(2, '0')}</span>
      </div>
      {isEndingSoon && (
        <span className="text-[9px] uppercase font-black tracking-widest text-red-500 block mt-1">
          ⚠️ Ending soon - place bids quickly
        </span>
      )}
    </div>
  );
};

const AuctionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bids, setBids] = useState([]);
  const [currentHighestBid, setCurrentHighestBid] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [mainImageIndex, setMainImageIndex] = useState(0);

  // Sound and Visual Feedback States
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notification, setNotification] = useState(null);
  const [simulateBidders, setSimulateBidders] = useState(true);
  const [isUsersTurn, setIsUsersTurn] = useState(false);
  const [isLosing, setIsLosing] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  // Refs for auto scrolling history
  const bidHistoryEndRef = useRef(null);

  // Audio synthesize function for placing bids (SFX without media assets)
  const playBidSound = (type = "success") => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === "success") {
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } else if (type === "simulated") {
        osc.frequency.setValueAtTime(329.63, audioCtx.currentTime); // E4
        osc.frequency.setValueAtTime(392.00, audioCtx.currentTime + 0.08); // G4
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
      } else {
        // Error buzz
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      }
    } catch (e) {
      console.log("Audio not allowed yet by user interaction");
    }
  };

  // Fetch / Load data
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        // Look up in mock database matching the ID
        const matched = MOCK_AUCTIONS.find(item => item.id === Number(id));
        
        if (matched) {
          setAuction(matched);
          setBids(matched.bids);
          setCurrentHighestBid(matched.currentBid || matched.startPrice);
          if (matched.status === "CLOSED" || matched.status === "SOLD") {
            setIsEnded(true);
          }
        }
      } catch (err) {
        console.error("Load error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  // Automated Bid Simulator Effect (FYP Demo Value Add)
  useEffect(() => {
    if (!simulateBidders || isEnded || !auction || auction.status !== "ACTIVE") return;

    const competitorNames = [
      "Malik Muhammad Hassan",
      "Sardar Hamza",
      "Chaudhary Shahzad",
      "Haji Abdul Waheed",
      "Rana Kamran",
      "Mian Zain",
      "Barrister Ali Raza"
    ];

    const interval = setInterval(() => {
      // 30% chance to bid every 14 seconds
      if (Math.random() > 0.4) {
        const increment = auction.bidIncrement;
        const randomMultiplier = Math.floor(Math.random() * 2) + 1; // 1 or 2 increments
        const addedAmount = increment * randomMultiplier;
        
        setBids(prev => {
          const nextBidAmount = (prev.length > 0 ? prev[0].amount : currentHighestBid) + addedAmount;
          const randomCompetitor = competitorNames[Math.floor(Math.random() * competitorNames.length)];
          
          const newBidObj = {
            id: Date.now(),
            bidderName: randomCompetitor,
            amount: nextBidAmount,
            time: "Just now"
          };

          setCurrentHighestBid(nextBidAmount);
          setIsUsersTurn(false);
          setIsLosing(true);
          playBidSound("simulated");

          // Visual notification toast
          setNotification({
            type: "competitor",
            text: `${randomCompetitor} placed a bid of PKR ${nextBidAmount.toLocaleString()}!`
          });

          // Dismiss toast
          setTimeout(() => setNotification(null), 5000);

          return [newBidObj, ...prev];
        });
      }
    }, 14000);

    return () => clearInterval(interval);
  }, [simulateBidders, isEnded, auction, currentHighestBid]);

  // Place custom bid handler
  const handlePlaceBid = (customAmount = null) => {
    if (isEnded) return;

    const bidVal = customAmount ? parseFloat(customAmount) : parseFloat(bidAmount);
    const minBidRequired = currentHighestBid + (auction?.bidIncrement || 100000);

    if (isNaN(bidVal)) {
      setNotification({ type: "error", text: "Please enter a valid numeric bid amount" });
      playBidSound("error");
      return;
    }

    if (bidVal < minBidRequired) {
      setNotification({
        type: "error",
        text: `Bid must be at least PKR ${minBidRequired.toLocaleString()} (Current + Increment)`
      });
      playBidSound("error");
      return;
    }

    // Add bid to state
    const userEmail = user?.email || "demo@fyp.com";
    const displayName = userEmail.split("@")[0].toUpperCase() + " (You)";

    const newBidObj = {
      id: Date.now(),
      bidderName: displayName,
      amount: bidVal,
      time: "Just now"
    };

    setBids(prev => [newBidObj, ...prev]);
    setCurrentHighestBid(bidVal);
    setBidAmount("");
    setIsLosing(false);
    setIsUsersTurn(true);
    playBidSound("success");

    setNotification({
      type: "success",
      text: `Congratulations! You are currently the highest bidder at PKR ${bidVal.toLocaleString()}!`
    });

    setTimeout(() => setNotification(null), 5000);
  };

  const handleQuickBid = (extra) => {
    const nextBid = currentHighestBid + extra;
    handlePlaceBid(nextBid);
  };

  const handleAuctionEnded = () => {
    setIsEnded(true);
    if (auction) {
      setAuction(prev => ({ ...prev, status: "CLOSED" }));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-slate-400 font-semibold">Decrypting secure auction vault...</span>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="max-w-xl mx-auto py-20 px-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Auction Vault Locked</h2>
        <p className="text-slate-500 mt-2">
          The requested auction ID could not be loaded or is invalid. Please return to active catalog listings.
        </p>
        <Link to="/auction" className="mt-6 inline-block bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold">
          View Active Auctions
        </Link>
      </div>
    );
  }

  const isUpcoming = auction.status === "UPCOMING";
  const minIncrement = auction.bidIncrement || 100000;
  const nextMinBid = currentHighestBid + minIncrement;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 pt-6">
      
      {/* ── TOP NAV BAR & HEADER INFO ── */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <button 
          onClick={() => navigate("/auction")}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition mb-4 cursor-pointer"
        >
          <ChevronLeft size={16} /> Back to Live Auction Catalog
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded bg-teal-50 text-teal-600 text-[10px] font-black uppercase tracking-wider border border-teal-100 ${
                auction.status === "ACTIVE" ? "animate-pulse" : ""
              }`}>
                ● {auction.status}
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                {auction.propertyType}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">
              {auction.title}
            </h1>
            <p className="text-slate-500 text-sm flex items-center gap-1 mt-1 font-semibold">
              <MapPin size={14} className="text-slate-400 shrink-0" />
              {auction.address}
            </p>
          </div>

          {/* Verification Badge */}
          {auction.owner?.verified && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">PropVerified Asset</p>
                <p className="text-[11px] text-slate-500">Documents verified via local land registry.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── DYNAMIC NOTIFICATIONS OVERLAY ── */}
      {notification && (
        <div className="max-w-7xl mx-auto px-4 mb-4">
          <div className={`p-4 rounded-xl border flex items-center justify-between text-sm font-bold shadow-sm ${
            notification.type === "success" 
              ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
              : notification.type === "competitor"
              ? "bg-amber-50 border-amber-200 text-amber-800 animate-bounce"
              : "bg-red-50 border-red-200 text-red-800"
          }`}>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className={notification.type === "competitor" ? "text-amber-500" : "text-emerald-500"} />
              {notification.text}
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="text-xs uppercase opacity-60 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT GRID ── */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ================= LEFT SECTION (GALLERY & DETAILS) ================= */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. IMAGE CAROUSEL CONTAINER */}
          <div className="bg-white rounded-3xl border border-slate-150 overflow-hidden shadow-sm p-4">
            <div className="relative h-[320px] md:h-[420px] rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
              <img
                src={auction.images?.[mainImageIndex] || "https://via.placeholder.com/800"}
                alt={auction.title}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Verified Owner overlay tag */}
              <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-lg text-[10px] font-black uppercase text-white tracking-widest border border-white/10 flex items-center gap-1">
                Owner: {auction.owner?.name}
              </div>
            </div>

            {/* Thumbnail rows */}
            {auction.images && auction.images.length > 1 && (
              <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1 select-none">
                {auction.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`View ${i}`}
                    onClick={() => setMainImageIndex(i)}
                    className={`h-16 w-24 object-cover rounded-xl cursor-pointer border-2 transition-all shrink-0 ${
                      i === mainImageIndex ? "border-blue-600 scale-[1.03] shadow" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 2. SPECIFICATION OVERVIEW */}
          <div className="bg-white rounded-3xl border border-slate-150 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Layers size={16} className="text-blue-600" /> Property Overview
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs font-semibold text-slate-700">
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 block mb-0.5 uppercase tracking-wide">Property Size</span>
                📐 {auction.area}
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 block mb-0.5 uppercase tracking-wide">Bedrooms</span>
                🛏 {auction.bedrooms || "N/A"} Beds
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 block mb-0.5 uppercase tracking-wide">Bathrooms</span>
                🛁 {auction.bathrooms || "N/A"} Baths
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 block mb-0.5 uppercase tracking-wide">Area Location</span>
                📌 {auction.location}
              </div>
            </div>
          </div>

          {/* 3. DETAILED INFORMATION TABS */}
          <div className="bg-white rounded-3xl border border-slate-150 overflow-hidden shadow-sm">
            <div className="flex border-b border-slate-100 bg-slate-50/50">
              {["overview", "amenities", "valuation"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3.5 text-xs font-black uppercase tracking-wider transition ${
                    activeTab === tab 
                      ? "text-blue-600 border-b-2 border-blue-600 bg-white" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab === "valuation" ? "📊 AI Analytics" : tab}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Tab Contents: Overview */}
              {activeTab === "overview" && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Description</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {auction.description}
                  </p>
                  <div className="bg-blue-50/40 p-4 rounded-2xl border border-blue-100/50 flex gap-3 text-xs text-slate-600 mt-4 leading-relaxed">
                    <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
                    <span>
                      <b>Note for Bidders:</b> Bidding on this property requires a verified bank guarantee statement. Please ensure your financial documents are updated in your Profile settings before placing bids higher than PKR 100 Million.
                    </span>
                  </div>
                </div>
              )}

              {/* Tab Contents: Amenities */}
              {activeTab === "amenities" && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Key Features & Amenities</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {auction.features?.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                        {feat}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab Contents: AI Analytics */}
              {activeTab === "valuation" && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 border border-slate-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-blue-300 font-extrabold uppercase tracking-widest flex items-center gap-1 mb-1">
                          <Sparkles size={12} /> PropSight AI Valuation
                        </span>
                        <h4 className="text-xl font-black">PKR {auction.aiValuation?.estimatedValue.toLocaleString()}</h4>
                        <p className="text-xs text-slate-400 mt-1">Average market value calculation based on neural-node spatial metrics.</p>
                      </div>
                      <div className="bg-blue-600 text-white text-xs font-black px-2.5 py-1.5 rounded-xl border border-blue-500 shadow-md">
                        {auction.aiValuation?.confidenceScore}% Confidence
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-white/5 text-xs">
                      <div>
                        <span className="text-slate-400 block mb-0.5">Valuation Range</span>
                        <span className="font-bold text-slate-200">PKR {auction.aiValuation?.lowRange.toLocaleString()} - {auction.aiValuation?.highRange.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Market Sentiment</span>
                        <span className="font-bold text-teal-400">{auction.aiValuation?.marketTrend}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-150">
                    PropSight AI analytics are computed automatically by reviewing land registries, regional sale metrics, Susan/Canal Road inflation trends, and surrounding spatial node densities.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= RIGHT SECTION (BIDDING CONSOLE) ================= */}
        <div className="space-y-6">
          
          {/* 1. TIMER & PRICING CARD */}
          <div className="bg-white rounded-3xl border border-slate-150 p-6 shadow-sm space-y-5">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest block">Current Highest Bid</span>
              <h2 className="text-3xl font-black text-blue-700 mt-0.5">
                PKR {currentHighestBid.toLocaleString()}
              </h2>
              <div className="flex justify-between items-center text-xs mt-2 text-slate-500 font-semibold border-b border-slate-50 pb-2">
                <span>Start Price:</span>
                <span>PKR {auction.startPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500 font-semibold pt-1">
                <span>Min. Increment:</span>
                <span>+ PKR {minIncrement.toLocaleString()}</span>
              </div>
            </div>

            {/* Live Ticking Countdown */}
            <DetailCountdown endDate={auction.endDate} onEnded={handleAuctionEnded} />

            {/* Bidding Status Tags */}
            {!isEnded && (
              <>
                {isUsersTurn ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center text-xs text-emerald-800 font-bold flex items-center justify-center gap-1.5">
                    <CheckCircle size={16} className="text-emerald-600" /> You are the highest bidder!
                  </div>
                ) : isLosing && bids.length > 0 ? (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-center text-xs text-rose-800 font-bold flex items-center justify-center gap-1.5 animate-bounce">
                    <AlertCircle size={16} className="text-rose-600" /> You've been outbid! Place counter-bid.
                  </div>
                ) : null}
              </>
            )}

            {/* Bid Input Box */}
            {isEnded ? (
              <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 text-center">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">Auction has Ended</p>
                <p className="text-xs text-slate-500 mt-1">Final Winning Bid: PKR {currentHighestBid.toLocaleString()}</p>
              </div>
            ) : isUpcoming ? (
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 text-center">
                <Clock className="w-8 h-8 text-indigo-500 mx-auto mb-2 animate-spin" />
                <p className="text-sm font-bold text-indigo-800">Bidding starts soon</p>
                <p className="text-xs text-indigo-600 mt-1">Starting next week. Verify documents now.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-black">PKR</span>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={`Enter ${nextMinBid.toLocaleString()} or more`}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold"
                  />
                </div>

                {/* Quick Addition buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {[minIncrement, minIncrement * 2, minIncrement * 5].map((extra) => (
                    <button
                      key={extra}
                      onClick={() => handleQuickBid(extra)}
                      className="py-2.5 px-1 border border-slate-200 hover:border-blue-300 rounded-xl text-[10px] font-black text-slate-700 bg-slate-50/50 hover:bg-blue-50/30 flex items-center justify-center gap-0.5 transition cursor-pointer"
                    >
                      <Plus size={10} /> {(extra / 1000).toLocaleString()}K
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePlaceBid()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/15 flex items-center justify-center gap-1.5 text-xs uppercase tracking-wide hover:scale-[1.01] active:scale-[0.99] transition cursor-pointer"
                >
                  <Send size={14} /> Place Secure Bid
                </button>
              </div>
            )}
          </div>

          {/* 2. LIVE SIMULATION CONTROLLER (DEVELOPER DEMO SWITCH) */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 space-y-3 shadow-xl">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-blue-300 font-extrabold uppercase tracking-widest flex items-center gap-1">
                <Sparkles size={12} className="text-amber-400" /> FYP Demo Mode
              </span>
              
              {/* Sound toggler */}
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="text-slate-400 hover:text-white transition"
                title={soundEnabled ? "Disable SFX" : "Enable SFX"}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
            </div>

            <div>
              <h4 className="text-xs font-bold">Live Competitor Bids</h4>
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                When enabled, simulated bidders place counter-bids automatically every few seconds to show examiners dynamic website responses.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] font-black text-slate-300 uppercase">Simulator Engine</span>
              <button
                onClick={() => setSimulateBidders(!simulateBidders)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition ${
                  simulateBidders 
                    ? "bg-teal-500 text-white shadow shadow-teal-500/20" 
                    : "bg-slate-700 text-slate-400"
                }`}
              >
                {simulateBidders ? "ENABLED" : "DISABLED"}
              </button>
            </div>
          </div>

          {/* 3. BIDS HISTORY LOG PANEL */}
          <div className="bg-white rounded-3xl border border-slate-150 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <Users size={14} className="text-blue-600" /> Live Bid History ({bids.length})
            </h3>

            <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1 select-none">
              {bids.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-6">No bids placed yet. Place the first bid!</p>
              ) : (
                bids.map((b, i) => (
                  <div 
                    key={b.id || i} 
                    className={`p-2.5 rounded-xl border flex justify-between items-center text-xs transition ${
                      i === 0 
                        ? "bg-blue-50/40 border-blue-200 font-bold" 
                        : "bg-slate-50/50 border-slate-100 text-slate-600"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-800">{b.bidderName}</span>
                        {i === 0 && (
                          <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-[8px] font-black uppercase leading-none scale-[0.9]">
                            High
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-400 block mt-0.5">{b.time}</span>
                    </div>
                    <span className={`font-mono font-black ${i === 0 ? "text-blue-700" : "text-slate-600"}`}>
                      PKR {b.amount.toLocaleString()}
                    </span>
                  </div>
                ))
              )}
              <div ref={bidHistoryEndRef} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;