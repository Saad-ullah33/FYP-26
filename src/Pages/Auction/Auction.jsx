import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../utils/api"; // Importing your verified Axios instance
import { useAuth } from "../context/AuthContext";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Gavel, 
  History, 
  User, 
  AlertCircle,
  CheckCircle2,
  Lock
} from "lucide-react";

// ---------- Ticking Countdown Custom Hook ----------
const useCountdown = (endDate, status) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (status === "CLOSED" || status === "SOLD" || status === "CONCLUDED") {
      setTimeLeft("Auction Concluded");
      return;
    }

    const calculateTime = () => {
      const diff = new Date(endDate) - new Date();

      if (diff <= 0) {
        setTimeLeft("Auction Ended");
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [endDate, status]);

  return timeLeft;
};

// ---------- MAIN COMPONENT ----------
const Auction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Grabbing authentication context token state mapping

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [bidsHistory, setBidsHistory] = useState([]);
  const [currentHighestBid, setCurrentHighestBid] = useState(0);
  const [selectedImage, setSelectedImage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setCheckMessage] = useState("");

  const countdown = useCountdown(property?.endTime || property?.endDate, property?.status);

  // Fetch Live Auction Payload details on mount
  useEffect(() => {
    const fetchAuctionDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/auctions/${id}`);
        const data = response.data;
        
        if (data) {
          setProperty(data);
          setBidsHistory(data.bids || []);
          setCurrentHighestBid(data.currentHighestBid || data.startingPrice || data.startPrice || 0);
          
          // Map gallery options safely
          if (data.images && data.images.length > 0) {
            setSelectedImage(data.images[0]);
          } else if (data.propertyImage) {
            setSelectedImage(data.propertyImage);
          }
        }
      } catch (err) {
        console.error("Error fetching live auction parameters:", err);
        setErrorMessage("Could not retrieve auction metadata profile.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAuctionDetails();
  }, [id]);

  // ---------- Place Real Authenticated Bid ----------
  const handlePlaceBid = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setCheckMessage("");

    // RULE 1: Enforce explicit authentication constraints
    if (!user) {
      setErrorMessage("Unauthorized. You must login or signup to place a valid bid.");
      return;
    }

    const numericBid = parseFloat(bidAmount);
    const minIncrement = property?.bidIncrement || 100000;
    const minimumAllowed = currentHighestBid + minIncrement;

    if (!numericBid || isNaN(numericBid)) {
      setErrorMessage("Please enter a valid numeric value.");
      return;
    }

    if (numericBid < minimumAllowed) {
      setErrorMessage(`Your counter-bid must be at least PKR ${minimumAllowed.toLocaleString()}`);
      return;
    }

    try {
      // POST payload directly to backend auction ecosystem tracking pipeline
      const response = await api.post(`/auctions/${id}/bid`, {
        amount: numericBid,
        bidderEmail: user.email
      });

      // Update state locally with verified payload database rows returned
      setCheckMessage("✅ Bid registered successfully on live node!");
      setCurrentHighestBid(numericBid);
      setBidAmount("");
      
      // Refresh bid array history listing matrix smoothly
      if (response.data?.bids) {
        setBidsHistory(response.data.bids);
      } else {
        // Fallback update
        const userDisplay = user.email.split("@")[0].toUpperCase() + " (You)";
        setBidsHistory([{ bidderName: userDisplay, amount: numericBid, time: "Just now" }, ...bidsHistory]);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || "Failed to process live transaction bid.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-400">Loading live asset context pool...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-6 bg-white border rounded-2xl shadow-sm">
        <AlertCircle className="mx-auto text-red-500 mb-3" size={32} />
        <h3 className="text-md font-bold text-slate-800">Auction Registry Missing</h3>
        <p className="text-xs text-slate-500 mt-1">This record ID could not be matched inside the live server indexes.</p>
        <Link to="/auction" className="mt-4 inline-block text-xs font-bold text-white bg-blue-600 px-4 py-2 rounded-xl">Return to Pool</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 text-slate-700 font-sans">
      <button 
        onClick={() => navigate("/auction")} 
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-blue-600 transition mb-6 cursor-pointer"
      >
        <ArrowLeft size={14} /> Back to Live Auctions
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT & CENTER FLANK */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Gallery View Component */}
          {selectedImage && (
            <div className="bg-white p-4 rounded-2xl border border-slate-150 shadow-sm">
              <div className="rounded-xl overflow-hidden h-80 md:h-[400px] bg-slate-100 shadow-inner">
                <img src={selectedImage} className="w-full h-full object-cover transition-all" alt={property.title} />
              </div>

              {property.images && property.images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {property.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      onClick={() => setSelectedImage(img)}
                      className={`w-20 h-16 cursor-pointer rounded-xl object-cover border-2 transition ${
                        img === selectedImage ? "border-blue-600 scale-[1.02]" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                      alt=""
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Heading parameters */}
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">{property.title || property.propertyTitle}</h1>
            <p className="text-xs font-semibold text-slate-400 mt-1 flex items-center gap-1">
              <MapPin size={12} /> {property.address || property.location || "Faisalabad"}
            </p>
          </div>

          {/* Asset Description Log */}
          <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <Info size={14} className="text-blue-600" /> Property Description
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">{property.description}</p>
          </div>

          {/* Authenticated Bid Ledger Stream */}
          <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <History size={14} className="text-blue-600" /> Bidding Registry Ledger ({bidsHistory.length})
            </h2>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {bidsHistory.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-6">No validated bids received yet on this listing.</p>
              ) : (
                bidsHistory.map((b, i) => (
                  <div key={i} className={`flex justify-between items-center text-xs p-2.5 rounded-xl border ${i === 0 ? 'bg-blue-50/40 border-blue-200 font-bold' : 'bg-slate-50/50 border-slate-100'}`}>
                    <span className="flex items-center gap-1 text-slate-600">
                      <User size={12} className="text-slate-400" /> 
                      {b.bidderName || `Bidder #${bidsHistory.length - i}`}
                    </span>
                    <span className={`font-mono ${i === 0 ? 'text-blue-700 font-black' : 'text-slate-800'}`}>
                      PKR {b.amount.toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT FLANK (ACTION INTERFACE MODULE) */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm h-fit space-y-4">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Current Highest Valuation Bid</p>
              <h2 className="text-3xl font-black text-blue-600 mt-0.5">
                PKR {currentHighestBid.toLocaleString()}
              </h2>
            </div>

            <div className="p-3 bg-slate-50 border rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium flex items-center gap-1"><Clock size={12} /> Timeline Window:</span>
              <span className="font-mono font-bold text-rose-600">{countdown}</span>
            </div>

            {/* Error/Success Feedbacks blocks */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xl flex items-start gap-1.5 font-medium">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs rounded-xl flex items-start gap-1.5 font-medium">
                <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Render conditional inputs if authorized user exists */}
            {!user ? (
              <div className="p-4 bg-slate-900 text-white rounded-xl text-center border space-y-3">
                <Lock className="mx-auto text-blue-400" size={20} />
                <div>
                  <p className="text-xs font-bold">Bidding Vault Restricted</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Anonymous placement constraints are enforced across ERP matrices rules layers.</p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link to="/login" className="px-2 py-1.5 bg-blue-600 text-white font-bold rounded-lg text-[10px] uppercase hover:bg-blue-500 transition">Log In</Link>
                  <Link to="/signup" className="px-2 py-1.5 bg-slate-800 text-slate-300 font-bold rounded-lg text-[10px] uppercase border border-slate-700 hover:bg-slate-750 transition">Sign Up</Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePlaceBid} className="space-y-3 pt-1">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">PKR</span>
                  <input
                    type="number"
                    placeholder={`Min target: ${(currentHighestBid + (property.bidIncrement || 100000)).toLocaleString()}`}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full border rounded-xl pl-11 pr-4 py-2.5 font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 text-slate-800"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white py-2.5 text-xs font-bold rounded-xl shadow-md hover:shadow-lg hover:shadow-blue-500/10 active:scale-[0.99] transition flex items-center justify-center gap-1.5 uppercase tracking-wide cursor-pointer"
                >
                  <Gavel size={14} /> Submit Verified Bid
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auction;