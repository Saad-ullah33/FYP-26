import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { generateSignature } from "../utils/deedService";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  Calendar,
  MessageSquare,
  Clock,
  Check,
  Building,
  Info,
  MapPin,
  Share2,
  Heart,
  Mail,
  ShieldCheck,
  Users,
  BedDouble,
  Bath,
  Home,
  Maximize2,
  Hash
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

// AI INTEGRATION COMPONENTS (PHASE 3)
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [property, setProperty] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mainIndex, setMainIndex] = useState(0);

  // Modal and Interactive States
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [submittingContact, setSubmittingContact] = useState(false);
  const [submittingSchedule, setSubmittingSchedule] = useState(false);

  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [liked, setLiked] = useState(false);

  // Notification Toast
  const [toastMsg, setToastMsg] = useState("");

  // ── AI ENGINE LOCAL STATES ──
  const [aiLoading, setAiLoading] = useState(true);
  const [aiError, setAiError] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [showAiExplanation, setShowAiExplanation] = useState(false);
  const [trendData, setTrendData] = useState([]);
  const [trendLoading, setTrendLoading] = useState(true);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  useEffect(() => {
    fetchProperty();
    fetchAiValuationMetrics();
    fetchHistoricalTrends();
  }, [id]);

  const formatPrice = (p) => {
    if (!p) return "N/A";
    const num = parseFloat(p);
    if (isNaN(num)) return p;
    if (num >= 10000000) {
      return `${(num / 10000000).toFixed(2)} Crore`;
    } else if (num >= 100000) {
      return `${(num / 100000).toFixed(2)} Lakh`;
    }
    return num.toLocaleString();
  };

  // ── AI VALUATION METRICS FETCH PIPE ──
  const fetchAiValuationMetrics = async () => {
    try {
      setAiLoading(true);
      const res = await api.get(
        `/predictions/${id}/explanation`
      ); setAiData(res.data);
      setAiError(null);
    } catch (err) {
      setAiError("Failed to generate real-time evaluation framework.");
    } finally {
      setAiLoading(false);
    }
  };

  // ── AI VALUATION HISTORICAL TRACK FETCH PIPE ──
  const fetchHistoricalTrends = async () => {
    try {
      setTrendLoading(true);
      const res = await api.get(
        `/predictions/historical-trends/${id}`
      ); setTrendData(res.data.timeline);
    } catch (err) {
      console.error("🔍 DEBUG AI TRAJECTORY ERROR:", err.response?.[0] || err.response || err);
    } finally {
      setTrendLoading(false);
    }
  };
  const fetchProperty = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/properties/id/${id}`);

      const data = res.data;

      setProperty(data);

      setContactMessage(
        `Assalam-o-Alaikum, I am interested in your property "${data.title}" (PKR ${formatPrice(data.price)}) located in ${data.area}, ${data.city?.name || data.city}. Please get back to me. JazakAllah.`
      );

      const relatedRes = await api.get(
        `/properties/type/${data.propertyType}`
      );

      setRelated(
        (relatedRes.data || []).filter((p) => p.id !== data.id)
      );

    } catch (err) {
      console.log("Property fetch error:", err);
      setProperty(null);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSubmittingContact(true);
    setTimeout(() => {
      setSubmittingContact(false);
      setIsContactOpen(false);
      triggerToast("Success! The owner has been notified and will contact you shortly.");
      // Reset non-auth fields
      if (!user) {
        setContactName("");
        setContactPhone("");
        setContactEmail("");
      }
    }, 1500);
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!scheduleDate || !scheduleTime) return;
    setSubmittingSchedule(true);
    setTimeout(() => {
      setSubmittingSchedule(false);
      setIsScheduleOpen(false);

      // Format readable date
      const dateObj = new Date(scheduleDate);
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      const formattedDate = dateObj.toLocaleDateString('en-US', options);

      triggerToast(`Visit Scheduled for ${formattedDate} at ${scheduleTime}! An agent will call you to confirm.`);
      setScheduleDate("");
      setScheduleTime("");
    }, 1500);
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center py-24 text-slate-500 min-h-screen bg-slate-50">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-sm font-semibold text-gray-600 animate-pulse">Loading property details...</p>
      </div>
    );

  if (!property)
    return (
      <div className="p-10 text-center text-red-500 min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="bg-white p-8 rounded-3xl shadow-lg border text-center max-w-md">
          <Info size={48} className="mx-auto text-red-500 mb-4 animate-bounce" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Property Not Found</h2>
          <p className="text-gray-500 text-sm mb-6">The listing you are searching for might have been removed or is temporarily unavailable.</p>
          <button
            onClick={() => navigate('/property-finder')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 px-6 rounded-xl transition shadow-md"
          >
            Return to Finder
          </button>
        </div>
      </div>
    );

  const images = property.images || [];
  const mainImage = images[mainIndex]?.cloudinary_src || "https://via.placeholder.com/800x450?text=No+Image+Available";

  const next = () =>
    setMainIndex((prev) =>
      prev < images.length - 1 ? prev + 1 : prev
    );

  const prev = () =>
    setMainIndex((prev) => (prev > 0 ? prev - 1 : prev));

  return (
    <div className="bg-gray-50 min-h-screen pb-16 relative">

      {/* FLOATING TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed top-24 right-5 z-50 bg-slate-900 border border-slate-800 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-xs sm:text-sm font-semibold">{toastMsg}</p>
        </div>
      )}

      {/* HEADER CONTROLS */}
      <div className="max-w-6xl mx-auto px-4 pt-6 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-700 hover:text-blue-600 transition bg-white hover:bg-slate-100 border px-4 py-2.5 rounded-xl shadow-sm cursor-pointer"
        >
          <ChevronLeft size={16} />
          Go Back
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setLiked(!liked);
              triggerToast(liked ? "Removed from Wishlist" : "Added to Wishlist!");
            }}
            className={`p-2.5 rounded-xl border transition shadow-sm cursor-pointer ${liked
                ? "bg-rose-50 text-rose-500 border-rose-100"
                : "bg-white text-gray-600 hover:text-rose-500 border-gray-200"
              }`}
          >
            <Heart size={18} className={liked ? "fill-rose-500" : ""} />
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              triggerToast("Link copied to clipboard!");
            }}
            className="p-2.5 rounded-xl border bg-white hover:bg-slate-100 text-gray-600 border-gray-200 transition shadow-sm cursor-pointer"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* PROPERTY TITLE & ADDRESS */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {property.title}
            </h1>
            <p className="text-gray-500 text-sm mt-2 flex items-center gap-1">
              <MapPin size={16} className="text-blue-600" />
              {property.address} • {property.area}, {property.city?.name || property.city}
            </p>
          </div>

          <div className="flex gap-2 items-center">
            <span className="bg-blue-50 border border-blue-100 text-blue-700 font-bold text-[10px] sm:text-xs uppercase tracking-widest px-3.5 py-1.5 rounded-full">
              For {property.purpose || "Buy"}
            </span>
            {property.featured && (
              <span className="bg-amber-50 border border-amber-100 text-amber-700 font-bold text-[10px] sm:text-xs uppercase tracking-widest px-3.5 py-1.5 rounded-full">
                Featured
              </span>
            )}
          </div>
        </div>
      </div>

      {/* HERO IMAGE CONTAINER */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="relative rounded-3xl overflow-hidden shadow-xl bg-slate-900 border">
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-[280px] sm:h-[420px] object-cover transition-all duration-500"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-lg text-gray-800 transition transform hover:scale-105 cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-lg text-gray-800 transition transform hover:scale-105 cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Floating counter */}
          {images.length > 0 && (
            <div className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-lg border border-white/10 shadow">
              {mainIndex + 1} / {images.length} Photos
            </div>
          )}
        </div>

        {/* THUMBNAILS CAROUSEL */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-thin">
            {images.map((img, i) => (
              <img
                key={i}
                src={img.cloudinary_src}
                alt="thumbnail"
                onClick={() => setMainIndex(i)}
                className={`h-16 w-24 object-cover rounded-xl cursor-pointer border-2 transition-all shrink-0 hover:brightness-110 ${i === mainIndex
                    ? "border-blue-600 ring-2 ring-blue-100 brightness-100"
                    : "border-transparent brightness-75"
                  }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* MAIN CONTENT SPLIT GRID */}
      <div className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN: SPECS & DESC & AGENT */}
        <div className="lg:col-span-2 space-y-8">

          {/* OVERVIEW PANEL */}
          <div className="bg-white rounded-3xl p-6 border shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
              <Building className="text-blue-600" size={20} /> Property Overview
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

              {property.bedrooms > 0 && (
                <div className="bg-slate-50/60 border border-slate-100 p-4 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <BedDouble size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Bedrooms</span>
                    <span className="text-sm sm:text-base font-extrabold text-gray-800">{property.bedrooms} Beds</span>
                  </div>
                </div>
              )}

              {property.bathrooms > 0 && (
                <div className="bg-slate-50/60 border border-slate-100 p-4 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Bath size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Bathrooms</span>
                    <span className="text-sm sm:text-base font-extrabold text-gray-800">{property.bathrooms} Baths</span>
                  </div>
                </div>
              )}

              <div className="bg-slate-50/60 border border-slate-100 p-4 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Home size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Property Type</span>
                  <span className="text-sm sm:text-base font-extrabold text-gray-800">{property.propertyType}</span>
                </div>
              </div>

              <div className="bg-slate-50/60 border border-slate-100 p-4 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Maximize2 size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Area / Size</span>
                  <span className="text-sm sm:text-base font-extrabold text-gray-800">{property.area}</span>
                </div>
              </div>

              <div className="bg-slate-50/60 border border-slate-100 p-4 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">City</span>
                  <span className="text-sm sm:text-base font-extrabold text-gray-800 truncate block max-w-[120px]">{property.city?.name || property.city}</span>
                </div>
              </div>

              <div className="bg-slate-50/60 border border-slate-100 p-4 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Hash size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Listing ID</span>
                  <span className="text-sm sm:text-base font-extrabold text-blue-600">ID-{property.id}</span>
                </div>
              </div>

            </div>
          </div>

          {/* DESCRIPTION PANEL */}
          <div className="bg-white rounded-3xl p-6 border shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Description</h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* ── AI VALUATION TRAJECTORY HISTORICAL GRAPH (INTEGRATED) ── */}
          <div className="bg-white p-6 border border-gray-250 rounded-3xl shadow-sm">
            <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="text-indigo-600" size={18} /> AI Valuation Trajectory
            </h3>
            {trendLoading ? (
              <div className="text-xs text-gray-400 animate-pulse py-8 text-center">Loading market trajectory metrics...</div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: '11px', fontWeight: '600' }} />
                    <YAxis
                      stroke="#94a3b8"
                      style={{ fontSize: '11px', fontWeight: '600' }}
                      tickFormatter={(v) => v >= 10000000 ? `${(v / 10000000).toFixed(1)}C` : `${(v / 100000).toFixed(0)}L`}
                    />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="price" stroke="#4f46e5" strokeWidth={2.5} dot={{ fill: '#4f46e5', r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* OWNER TRUST CARD */}
          <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/30 border border-blue-100 rounded-3xl p-6 shadow-sm">
            {user ? (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-blue-100 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow">
                      <User size={20} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-gray-900">
                        {property.owner?.name || "Verified Owner"}
                      </h3>
                      <p className="text-[11px] text-blue-600 uppercase tracking-widest font-black flex items-center gap-0.5">
                        <ShieldCheck size={12} /> PropSight Verified Owner
                      </p>
                    </div>
                  </div>

                  <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Online
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
                  <p className="flex items-center gap-2 bg-white/70 p-2.5 rounded-xl border border-blue-100/50">
                    <User className="text-blue-500" size={16} />
                    <span><b>Name:</b> {property.owner?.name || "Private Owner"}</span>
                  </p>

                  <p className="flex items-center gap-2 bg-white/70 p-2.5 rounded-xl border border-blue-100/50">
                    <Phone className="text-blue-500" size={16} />
                    <span><b>Phone:</b> {property.owner?.phone || "+92 300 0000000"}</span>
                  </p>
                </div>

                <button
                  onClick={() => setIsContactOpen(true)}
                  className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl transition shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  Contact Owner
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <Users size={32} className="mx-auto text-blue-500 mb-3" />
                <h3 className="font-bold text-gray-800 mb-1">Verify Owner Contact Info</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4 leading-relaxed">
                  Log in with a developer bypass or real account to view the owner's phone number, name, and contact options.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition shadow"
                >
                  Log In to View Info
                </button>
              </div>
            )}
          </div>

          {/* TRUSTDEED CERTIFICATION CARD */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <ShieldCheck size={20} />
                </div>
                <div className="text-left">
                  <h3 className="font-extrabold text-sm text-white">TrustDeed Title Verification</h3>
                  <p className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-wider">
                    SHA-256 Blockchain Verified
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider">
                Title Clear
              </span>
            </div>

            <p className="text-xs text-slate-300 text-left leading-relaxed mb-4">
              This property features a cryptographically sealed land registry deed certificate. Audit public ownership records, transaction dates, and blockchain transaction proofs.
            </p>

            <button
              onClick={() => {
                const deedId = `TD-${property.id || 101}-9921`;
                const sig = generateSignature(deedId, "public");
                navigate(`/verify-deed?deedId=${deedId}&role=public&sig=${sig}`);
              }}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black py-3 rounded-2xl transition shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              <ShieldCheck size={16} /> Audit Digital Title Deed
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: PRICE & SCHEDULING BOARD */}
        <div className="space-y-6">

          {/* STICKY PRICE CARD */}
          <div className="bg-white rounded-3xl p-6 border shadow-lg sticky top-24 space-y-5">
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-widest font-black block">Price Range</span>
              <p className="text-2xl sm:text-3xl font-black text-blue-700 mt-1 tracking-tight">
                PKR {formatPrice(property.price)}
              </p>
            </div>

            {/* ── AI VALUATION PREMIUM INTERACTION FRAMEWORK (INTEGRATED) ── */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white relative overflow-hidden shadow-md">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="bg-indigo-500/10 text-indigo-400 text-[9px] font-bold px-2 py-0.5 rounded border border-indigo-500/20 uppercase tracking-wider">
                    PropSight AI Engine
                  </span>
                  <h4 className="text-slate-400 text-[11px] font-medium mt-1">Estimated Market Value</h4>
                </div>
                {aiData && (
                  <span className="text-emerald-400 font-mono text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                    {aiData.confidence} Certainty
                  </span>
                )}
              </div>

              {aiLoading ? (
                <div className="animate-pulse text-slate-500 text-xs py-2 font-mono">Running algorithmic matrices...</div>
              ) : aiError ? (
                <div className="text-red-400 text-[11px] font-mono">{aiError}</div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <span className="text-xl font-bold font-mono text-slate-100">
                      PKR {formatPrice(aiData.predictedPrice)}
                    </span>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Target Range: <span className="font-mono text-slate-300">PKR {formatPrice(aiData.priceRange?.min)} - {formatPrice(aiData.priceRange?.max)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAiExplanation(!showAiExplanation)}
                    className="w-full bg-slate-800 hover:bg-slate-750 border border-slate-700 transition text-[10px] font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5"
                  >
                    {showAiExplanation ? 'Hide Valuation Audit' : 'Analyze Pricing Drivers'}
                    <ChevronRight size={12} className={`transform transition-transform ${showAiExplanation ? 'rotate-90' : ''}`} />
                  </button>

                  {showAiExplanation && (
                    <div className="pt-3 border-t border-slate-800 space-y-2 max-h-40 overflow-y-auto pr-1">
                      {Object.entries(aiData.factorExplanation || {}).map(([key, desc]) => (
                        <div key={key} className="bg-slate-950 p-2 rounded-lg border border-slate-900 text-[10px]">
                          <div className="text-indigo-400 font-bold font-mono text-[9px]">{key.replace('_', ' ').toUpperCase()}</div>
                          <div className="text-slate-400 leading-relaxed mt-0.5">{desc}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setIsContactOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-500/10 transition flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <MessageSquare size={18} /> Contact Seller
              </button>

              <button
                onClick={() => setIsScheduleOpen(true)}
                className="w-full bg-white hover:bg-slate-50 text-gray-800 border border-gray-200 font-bold py-3.5 rounded-2xl transition flex items-center justify-center gap-2 shadow-sm cursor-pointer text-sm"
              >
                <Calendar size={18} className="text-blue-600" /> Schedule Visit
              </button>
            </div>

            <div className="border-t pt-4 text-[11px] text-gray-400 leading-normal flex items-start gap-1">
              <Info size={14} className="shrink-0 text-blue-500 mt-0.5" />
              <span>Prices listed are provided by verified owners and might be subject to negotiation. No commission fees on PropSight.</span>
            </div>
          </div>
        </div>
      </div>

      {/* RELATED SIMILAR LISTINGS */}
      {related.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 mt-16">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Building size={20} className="text-blue-600" /> Similar Properties
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.slice(0, 3).map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  navigate(`/property/${p.id}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border cursor-pointer transition transform hover:-translate-y-1 duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 w-full overflow-hidden relative bg-gray-100">
                    <img
                      src={p.images?.[0]?.cloudinary_src || "https://via.placeholder.com/400x250"}
                      alt={p.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                    <span className="absolute top-3 left-3 bg-blue-600 text-white font-bold text-[8px] uppercase tracking-widest px-2.5 py-0.5 rounded shadow">
                      {p.propertyType}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-extrabold text-sm text-gray-800 group-hover:text-blue-600 transition truncate">
                      {p.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-0.5 truncate">
                      <MapPin size={12} className="text-gray-400" /> {p.area}, {p.city?.name || p.city}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold">Price</span>
                  <span className="text-sm font-extrabold text-blue-600">PKR {formatPrice(p.price)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CONTACT MODAL ── */}
      {isContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border animate-scale-up">

            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={20} />
                <h3 className="font-bold text-base sm:text-lg">Contact Property Seller</h3>
              </div>
              <button
                onClick={() => setIsContactOpen(false)}
                className="text-white/80 hover:text-white font-bold text-xl cursor-pointer p-1"
              >
                &times;
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleContactSubmit} className="p-6 space-y-4">

              {/* Dynamic User Details Warning if not Logged In */}
              {!user && (
                <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs text-amber-800">
                  <Info size={16} className="shrink-0 mt-0.5 text-amber-600" />
                  <div>
                    <span className="font-bold block">Developer Demo Mode Input</span>
                    Since you're currently not logged in, please fill in your details below so the owner can respond.
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={user ? "Demo User" : contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    disabled={!!user}
                    className="w-full border rounded-xl p-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+92 300 1234567"
                    value={user ? "+92 300 9999999" : contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    disabled={!!user}
                    className="w-full border rounded-xl p-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none disabled:text-gray-500"
                  />
                </div>
              </div>

              {!user && (
                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full border rounded-xl p-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block mb-1">Message to Owner</label>
                <textarea
                  rows={4}
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full border rounded-xl p-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsContactOpen(false)}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-800 px-4 py-2 border rounded-xl cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submittingContact}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  {submittingContact ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Inquiry
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ── SCHEDULE VISIT MODAL ── */}
      {isScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border animate-scale-up">

            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-750 to-blue-600 px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={20} />
                <h3 className="font-bold text-base sm:text-lg">Schedule Visit</h3>
              </div>
              <button
                onClick={() => setIsScheduleOpen(false)}
                className="text-white/80 hover:text-white font-bold text-xl cursor-pointer p-1"
              >
                &times;
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleScheduleSubmit} className="p-6 space-y-4">

              <div className="bg-blue-50 border border-blue-100 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs text-blue-800">
                <Clock size={16} className="shrink-0 mt-0.5 text-blue-600" />
                <div>
                  <span className="font-bold block">Free In-Person Visit</span>
                  Select a convenient slot. An agent will verify and coordinate the timing with you and the owner.
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block mb-1">Preferred Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]} // Block past dates
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full border rounded-xl p-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block mb-1">Preferred Time Block</label>
                <select
                  required
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full border rounded-xl p-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select Time Segment</option>
                  <option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM - 12:00 PM)</option>
                  <option value="Afternoon (12:00 PM - 04:00 PM)">Afternoon (12:00 PM - 04:00 PM)</option>
                  <option value="Evening (04:00 PM - 07:00 PM)">Evening (04:00 PM - 07:00 PM)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsScheduleOpen(false)}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-800 px-4 py-2 border rounded-xl cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submittingSchedule}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  {submittingSchedule ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    <>
                      Confirm Visit Slot
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PropertyDetail;