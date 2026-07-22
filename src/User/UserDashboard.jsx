import React, { useState, useEffect } from 'react';
import {
  getDashboardStats,
  getMyProperties,
  getMyAuctions,
  deletePropertyListing,
  getUserProfile,
  updateUserProfile,
  createPropertyListing,
  updatePropertyListing,
  enablePropertyAuction,
  getPersonalAnalyticsOverview
} from "../utils/userDashboardService";

import {
  LayoutDashboard,
  Building2,
  Heart,
  Calculator,
  Gavel,
  User,
  Menu,
  X,
  PlusCircle,
  Trash2,
  Save,
  Bell,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  ShieldAlert,
  Info,
  ExternalLink,
  MapPin,
  Sparkles,
  LogOut,
  QrCode,
  Calendar,
  Copy,
  Search,
  Edit2,
  ArrowUpRight,
  Filter,
  Clock,
  Coins,
  TrendingUp,
  Award,
  AlertOctagon
} from 'lucide-react';

import { useNavigate, useLocation } from 'react-router-dom';
import { getQRUrls, getDeeds, getUserDeeds, requestDeedVerification, generateSignature, getQRBaseUrl } from '../utils/deedService';
import { QRCodeSVG } from 'qrcode.react';
import { useSubscription } from '../hooks/useSubscription';
import { geminiService } from '../services/geminiService';
import CTABanner from '../components/subscription/CTABanner';
import { Loader2 } from 'lucide-react';

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { plan, billingCycle, canAccess, setIsUpgradeModalOpen, incrementUsage } = useSubscription();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("Overview");
  const [comparedProperties, setComparedProperties] = useState([]);

  /* ===========================
      REAL DATA STATES
  =========================== */
  const [myListings, setMyListings] = useState([]);
  const [myAuctions, setMyAuctions] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalProperties: 0,
    totalAuctions: 0,
    activeAuctions: 0,
    pendingAuctions: 0,
    rejectedAuctions: 0,
    soldAuctions: 0
  });

  const [personalAnalytics, setPersonalAnalytics] = useState({
    totalBidsPlaced: 0,
    successfulAuctionsWon: 0,
    totalCapitalExpended: 0.0,
    myTotalAuctionsCreated: 0,
    myActiveAuctions: 0,
    mySoldAuctions: 0
  });

  const [savedProperties] = useState([]); 
  const [buildEstimates] = useState([]);   
  const [notifications] = useState([]);    

  /* ===========================
      FILTER STATES
  =========================== */
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  
  const [currentTime, setCurrentTime] = useState(new Date());

  /* ===========================
      CRUD & MODAL INTERACTION STATES
  ========================== */
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);

  const [isAuctionModalOpen, setIsAuctionModalOpen] = useState(false);
  const [auctionSetupForm, setAuctionSetupForm] = useState({
    propertyId: null,
    startingPrice: "",
    reservePrice: "",
    startTime: "",
    endTime: ""
  });

  const [propertyForm, setPropertyForm] = useState({
    title: "",
    description: "",
    price: "",
    purpose: "SALE", // Updated from "BUY" to match backend "SALE"
    propertyType: "HOUSE",
    location: "D Ground",
    cityId: 1, 
    bathrooms: 2,
    bedrooms: 3,
    area: "5 Marla",
    address: "",
    auctionEnabled: false
  });

  /* ===========================
      PROFILE STATE
  =========================== */
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    notificationsEnabled: true
  });

  const [isSavedMsg, setIsSavedMsg] = useState(false);
  const [generatingDesc, setGeneratingDesc] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    confirmText: "Confirm",
    cancelText: "Cancel",
    type: "danger"
  });

  /* ===========================
      LOAD DATA
  =========================== */
  useEffect(() => {
    loadDashboard();
    loadUserProfile();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const [stats, properties, auctions, analyticsData] = await Promise.all([
        getDashboardStats(),
        getMyProperties(),
        getMyAuctions(),
        getPersonalAnalyticsOverview()
      ]);

      setDashboardStats(stats || { totalProperties: 0, totalAuctions: 0, activeAuctions: 0, pendingAuctions: 0, rejectedAuctions: 0, soldAuctions: 0 });
      setMyListings(Array.isArray(properties) ? properties : []);
      setMyAuctions(Array.isArray(auctions) ? auctions : []);
      if (analyticsData) setPersonalAnalytics(analyticsData);
    } catch (err) {
      console.error(err);
      setError("Failed to load user records from remote endpoint.");
    } finally {
      setLoading(false);
    }
  };

  const [myDeeds, setMyDeeds] = useState([]);
  const [isDeedModalOpen, setIsDeedModalOpen] = useState(false);
  const [selectedPropForDeed, setSelectedPropForDeed] = useState("");

  const loadUserProfile = async () => {
    try {
      const data = await getUserProfile();
      const userEmail = data.email || "user@app.com";
      setProfileForm({
        fullName: data.fullName || "",
        email: userEmail,
        phone: data.phone || "",
        city: data.city || "",
        address: data.address || "",
        notificationsEnabled: data.notificationsEnabled ?? true
      });
      setMyDeeds(getUserDeeds(userEmail));
    } catch (err) {
      console.error("Error pulling profile:", err);
      setMyDeeds(getUserDeeds("user@app.com"));
    }
  };

  /* ===========================
      TAB MAPPING
  =========================== */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab === "profile") setActiveTab("Profile");
    else if (tab === "listings") setActiveTab("My Listings");
    else if (tab === "saved") setActiveTab("Saved Properties");
    else if (tab === "estimates") setActiveTab("Smart Build");
    else if (tab === "auctions") setActiveTab("Auctions");
  }, [location]);

const handleOpenCreateModal = () => {
    if (!canAccess('unlimitedListings') && myListings.length >= 5) {
      alert("You have reached the maximum listing limit (5) for the Free plan. Please upgrade to Pro or Business to add unlimited listings.");
      setIsUpgradeModalOpen(true);
      return;
    }

    // Redirect directly to your standalone step-by-step AddProperty component
    navigate("/add-property"); 
  };
  const handleOpenEditModal = (item) => {
    setIsEditMode(true);
    setSelectedPropertyId(item.id);
    setSelectedImages([]);
    setPropertyForm({
      title: item.title || "", description: item.description || "", price: item.price || "",
      purpose: item.purpose || "SALE", propertyType: item.propertyType || "HOUSE", location: item.location || "D Ground",
      cityId: 1, bathrooms: item.bathrooms || 2, bedrooms: item.bedrooms || 3, area: item.area || "5 Marla",
      address: item.address || "", auctionEnabled: item.auctionEnabled || false
    });
    setIsCreateModalOpen(true);
  };

  const handleImageChange = (e) => {
    if (e.target.files) setSelectedImages(Array.from(e.target.files));
  };

  const handleGenerateAIDescription = async () => {
    if (!canAccess("aiDescriptionGenerator")) {
      setIsUpgradeModalOpen(true);
      return;
    }
    if (!propertyForm.propertyType || !propertyForm.location || !propertyForm.area || !propertyForm.price) {
      alert("Please fill in Property Type, Price, Area, and Location Sector first so the AI can generate a description tailored to your listing.");
      return;
    }
    setGeneratingDesc(true);
    try {
      const description = await geminiService.generatePropertyDescription({
        title: propertyForm.title,
        propertyType: propertyForm.propertyType,
        location: propertyForm.location,
        area: propertyForm.area,
        price: propertyForm.price,
        bedrooms: propertyForm.bedrooms,
        bathrooms: propertyForm.bathrooms
      });
      setPropertyForm(prev => ({ ...prev, description }));
      incrementUsage("aiDescriptionGenerator");
    } catch (err) {
      console.error("AI Description fault layer:", err);
      alert("Failed to generate AI description.");
    } finally {
      setGeneratingDesc(false);
    }
  };

const handlePropertyFormSubmit = async (e) => {
    e.preventDefault();
    if (!isEditMode && !canAccess('unlimitedListings') && myListings.length >= 5) {
      alert("You have reached the maximum listing limit (5) for the Free plan. Please upgrade to Pro or Business to add unlimited listings.");
      setIsUpgradeModalOpen(true);
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      
      // Package the property parameters as an application/json blob
      const propertyBlob = new Blob([JSON.stringify(propertyForm)], { 
        type: "application/json" 
      });
      formData.append("property", propertyBlob);

      // Append binary images
      selectedImages.forEach(img => {
        formData.append("images", img);
      });

      // Config containing the header explicitly telling Axios to let the browser handle boundary markers
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      if (isEditMode) {
        await updatePropertyListing(selectedPropertyId, formData, config);
      } else {
        await createPropertyListing(formData, config);
        incrementUsage("unlimitedListings");
      }
      setIsCreateModalOpen(false);
      await loadDashboard(); 
    } catch (err) {
      console.error("Payload submission error details:", err.response?.data || err.message);
      alert(`Submission failed: ${err.response?.data?.message || "Verify your form parameters."}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerAuctionLaunch = (item) => {
    setAuctionSetupForm({
      propertyId: item.id,
      startingPrice: item.price || "",
      reservePrice: "",
      startTime: "",
      endTime: ""
    });
    setIsAuctionModalOpen(true);
  };

  const handleAuctionFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await enablePropertyAuction(auctionSetupForm.propertyId, {
        startingPrice: parseFloat(auctionSetupForm.startingPrice),
        reservePrice: auctionSetupForm.reservePrice ? parseFloat(auctionSetupForm.reservePrice) : null,
        startTime: auctionSetupForm.startTime,
        endTime: auctionSetupForm.endTime
      });
      setIsAuctionModalOpen(false);
      await loadDashboard();
      alert("Land auction request routed to Admin verify board successfully.");
    } catch (err) {
      console.error(err);
      alert("Error processing launch setup. Verify date matrices framework rules.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setConfirmModal({
      isOpen: true,
      title: "Sign Out",
      message: "Are you sure you want to sign out?",
      confirmText: "Sign Out",
      type: "warning",
      onConfirm: () => { logout(); navigate("/login"); }
    });
  };

  const deleteListing = (id) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Property",
      message: "Delete this property listing? This operation removes all binary file assets from the cloud registry and cannot be reversed.",
      confirmText: "Delete",
      type: "danger",
      onConfirm: async () => {
        try {
          await deletePropertyListing(id);
          setConfirmModal({ isOpen: false });
          await loadDashboard();
        } catch (err) {
          console.error(err);
          alert("Error processing deletion.");
        }
      }
    });
  };

  const saveProfileSettings = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(profileForm);
      setIsSavedMsg(true);
      setTimeout(() => setIsSavedMsg(false), 2000);
    } catch (err) {
      console.error(err);
      alert("Profile save failed.");
    }
  };

  const calculateAuctionTimeState = (startTimeStr, endTimeStr) => {
    if (!startTimeStr || !endTimeStr) return { label: "Unknown Date Matrix", color: "text-slate-400" };
    const start = new Date(startTimeStr);
    const end = new Date(endTimeStr);
    
    if (currentTime < start) {
      const diff = start - currentTime;
      return { label: `Starts in: ${formatTimeDiff(diff)}`, color: "text-purple-600 bg-purple-50 border-purple-100" };
    } else if (currentTime >= start && currentTime <= end) {
      const diff = end - currentTime;
      return { label: `Closing in: ${formatTimeDiff(diff)}`, color: "text-rose-600 bg-rose-50 border-rose-100 animate-pulse font-bold" };
    } else {
      return { label: "Auction Concluded", color: "text-slate-500 bg-slate-100 border-slate-200 font-medium" };
    }
  };

  const formatTimeDiff = (ms) => {
    const totalSecs = Math.floor(ms / 1000);
    const days = Math.floor(totalSecs / (3600 * 24));
    const hours = Math.floor((totalSecs % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;

    let str = "";
    if (days > 0) str += `${days}d `;
    if (hours > 0 || days > 0) str += `${hours}h `;
    str += `${minutes}m ${seconds}s`;
    return str;
  };

  const filteredListings = myListings.filter(item => {
    const matchesType = typeFilter === "ALL" || (item.propertyType && item.propertyType.toUpperCase() === typeFilter.toUpperCase());
    const matchesStatus = statusFilter === "ALL" || (item.status && item.status.toUpperCase() === statusFilter.toUpperCase());
    return matchesType && matchesStatus;
  });

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-700 font-sans overflow-hidden">
      {/* ================= SIDEBAR ================= */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-200 transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between h-20 border-b border-slate-200">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
              <img
                src="/favicon-icon.png"
                alt="NextProperty Icon"
                className="w-9 h-9 object-contain group-hover:scale-105 transition-transform duration-300"
              />
              <div className="flex flex-col leading-none gap-[3px]">
                <span className="text-[16px] font-black tracking-tight text-slate-850">
                  Next<span className="text-blue-600">Property</span>
                </span>
                <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  User Workspace
                </span>
              </div>
            </div>
          ) : (
            <img
              src="/favicon-icon.png"
              alt="NP"
              className="w-9 h-9 mx-auto object-contain cursor-pointer"
              onClick={() => navigate('/')}
            />
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded cursor-pointer transition">
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-1.5 px-3">
            <SidebarItem icon={LayoutDashboard} text="Overview" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} isOpen={isSidebarOpen} />
            <SidebarItem icon={Building2} text="My Listings" active={activeTab === 'My Listings'} onClick={() => setActiveTab('My Listings')} isOpen={isSidebarOpen} />
            <SidebarItem icon={Heart} text="Saved Properties" active={activeTab === 'Saved Properties'} onClick={() => setActiveTab('Saved Properties')} isOpen={isSidebarOpen} />
            <SidebarItem icon={Calculator} text="Smart Build" active={activeTab === 'Smart Build'} onClick={() => setActiveTab('Smart Build')} isOpen={isSidebarOpen} />
            <SidebarItem icon={Gavel} text="Auctions" active={activeTab === 'Auctions'} onClick={() => setActiveTab('Auctions')} isOpen={isSidebarOpen} />
            <SidebarItem icon={QrCode} text="Digital Deeds" active={activeTab === 'Deeds'} onClick={() => setActiveTab('Deeds')} isOpen={isSidebarOpen} />
            <div className={`mt-6 mb-2 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider ${!isSidebarOpen && 'hidden'}`}>
              Account Settings
            </div>
            <SidebarItem icon={User} text="Profile" active={activeTab === 'Profile'} onClick={() => setActiveTab('Profile')} isOpen={isSidebarOpen} />
          </ul>
        </nav>

        {isSidebarOpen && profileForm.fullName && (
          <div className="p-4 bg-slate-50 mx-3 mb-2 rounded-2xl border border-slate-200/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm">
              {profileForm.fullName.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate">{profileForm.fullName}</p>
              <p className="text-[10px] text-slate-400 truncate">{profileForm.email}</p>
            </div>
          </div>
        )}

        <div className="p-4 border-t border-slate-200">
          <button onClick={handleLogout} className="flex items-center w-full p-2.5 text-red-500 hover:bg-red-550 rounded-xl transition-all cursor-pointer font-semibold text-sm">
            <LogOut size={18} />
            {isSidebarOpen && <span className="ml-3">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-6 lg:p-8">
        {loading && <div className="absolute top-4 left-1/2 bg-blue-600 text-white text-xs px-4 py-1.5 rounded-full z-50 animate-bounce">Processing Server Requests...</div>}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              {activeTab === 'Overview' && <LayoutDashboard className="text-blue-600" />}
              {activeTab === 'My Listings' && <Building2 className="text-blue-600" />}
              {activeTab === 'Saved Properties' && <Heart className="text-blue-600" />}
              {activeTab === 'Smart Build' && <Calculator className="text-blue-600" />}
              {activeTab === 'Auctions' && <Gavel className="text-blue-600" />}
              {activeTab === 'Deeds' && <QrCode className="text-blue-600" />}
              {activeTab === 'Profile' && <User className="text-blue-600" />}
              {activeTab === 'Deeds' ? "Digital Deeds" : activeTab}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Manage listings, appraisal histories, bids, and profile credentials.
            </p>
          </div>

          <div className="flex items-center gap-3.5 self-start sm:self-center">
            {activeTab === 'Overview' && (
              <button onClick={handleOpenCreateModal} className="px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-blue-500/20">
                <PlusCircle size={14} /> Post Property
              </button>
            )}
          </div>
        </header>

        {/* ================= TAB: OVERVIEW ================= */}
        {activeTab === 'Overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Coins size={22} /></div>
                <div>
                  <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Total Capital Expended</p>
                  <h4 className="text-xl font-black text-slate-800 mt-1">Rs {personalAnalytics.totalCapitalExpended?.toLocaleString() || "0"}</h4>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Award size={22} /></div>
                <div>
                  <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Successful Wins</p>
                  <h4 className="text-xl font-black text-slate-800 mt-1">{personalAnalytics.successfulAuctionsWon} Completed</h4>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><TrendingUp size={22} /></div>
                <div>
                  <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Active Bids Placed</p>
                  <h4 className="text-xl font-black text-slate-800 mt-1">{personalAnalytics.totalBidsPlaced} Bids</h4>
                </div>
              </div>
            </div>

            {/* Upgrade banner for Free accounts */}
            <CTABanner />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "My Listings", value: dashboardStats.totalProperties, detail: "Properties uploaded", icon: Building2, color: "bg-blue-600/10 text-blue-600" },
                { title: "Auctions", value: dashboardStats.totalAuctions, detail: `${dashboardStats.activeAuctions} Active`, icon: Gavel, color: "bg-amber-600/10 text-amber-600" },
                { title: "Pending Auctions", value: dashboardStats.pendingAuctions, detail: "Waiting approval", icon: Calendar, color: "bg-purple-600/10 text-purple-600" },
                { title: "Sold Auctions", value: dashboardStats.soldAuctions, detail: "Completed", icon: CheckCircle2, color: "bg-green-600/10 text-green-600" }
              ].map((stat, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (stat.title === "My Listings") setActiveTab("My Listings");
                    else if (stat.title === "Auctions") setActiveTab("Auctions");
                  }}
                  className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between shadow-sm hover:-translate-y-1 cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-slate-50/50 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider group-hover:text-blue-600 transition-colors">{stat.title}</p>
                      <h3 className="text-3xl font-black mt-2 text-slate-800 tracking-tight">{stat.value}</h3>
                    </div>
                    <div className={`p-3 rounded-xl border ${stat.color} transition-all duration-300 group-hover:scale-105`}>
                      <stat.icon size={20} />
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-slate-500 font-medium">{stat.detail}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB: MY LISTINGS ================= */}
        {activeTab === 'My Listings' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-200">
            <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-md font-bold text-slate-800">Properties You Posted</h3>
                <p className="text-xs text-slate-400 mt-0.5">Filter matching real estate assets and execute operational updates.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 bg-white border px-2.5 py-1.5 rounded-xl shadow-sm text-xs font-semibold">
                  <Filter size={12} className="text-slate-400" />
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Type:</span>
                  <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="outline-none bg-transparent font-bold text-slate-700 cursor-pointer">
                    <option value="ALL">All Asset Types</option>
                    <option value="HOUSE">House</option>
                    <option value="PLOT">Plot</option>
                    <option value="APARTMENT">Apartment</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 bg-white border px-2.5 py-1.5 rounded-xl shadow-sm text-xs font-semibold">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">State:</span>
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="outline-none bg-transparent font-bold text-slate-700 cursor-pointer">
                    <option value="ALL">All Status States</option>
                    <option value="PENDING">Pending Moderation</option>
                    <option value="APPROVED">Approved (Live)</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="SOLD">Sold Out</option>
                  </select>
                </div>

                <button onClick={handleOpenCreateModal} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer">
                  <PlusCircle size={14} /> Add Property
                </button>
              </div>
            </div>

            {filteredListings.length === 0 ? (
              <div className="p-12 text-center">
                <Building2 size={40} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium">No property records matched your current sorting criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase">
                    <tr>
                      <th className="px-6 py-4">Listed Unit</th>
                      <th className="px-6 py-4">District / Area</th>
                      <th className="px-6 py-4">Asking Price</th>
                      <th className="px-6 py-4">Post State</th>
                      <th className="px-6 py-4 text-center">Auction Integration</th>
                      <th className="px-6 py-4 text-right">Settings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredListings.map((item) => {
                      const activeWorkflow = myAuctions.find(auc => auc.propertyId === item.id);
                      
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition">
                          <td className="px-6 py-4.5 font-bold text-slate-800">
                            <div className="flex flex-col">
                              <span>{item.title}</span>
                              <span className="text-[10px] text-slate-400 font-mono mt-0.5">Ref ID: #PRP-{item.id}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4.5 text-xs text-slate-500 font-semibold">{item.city || item.location || "N/A"}</td>
                          <td className="px-6 py-4.5 text-sm font-extrabold text-blue-600">Rs {item.price?.toLocaleString()}</td>
                          <td className="px-6 py-4.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              item.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                              item.status === 'SOLD' ? 'bg-blue-50 text-blue-600 border-blue-200' : 
                              item.status === 'REJECTED' ? 'bg-red-50 text-red-600 border-red-200' :
                              'bg-amber-50 text-amber-600 border-amber-200'
                            }`}>
                              {item.status || "PENDING"}
                            </span>
                          </td>
                          <td className="px-6 py-4.5 text-center">
                            <div className="flex flex-col items-center justify-center gap-1 text-xs font-semibold text-slate-500">
                              {activeWorkflow ? (
                                <>
                                  {activeWorkflow.status === 'PENDING_APPROVAL' && (
                                    <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[9px] font-extrabold uppercase tracking-wide flex items-center gap-1">
                                      <Clock size={10} /> Request Processing
                                    </span>
                                  )}
                                  {activeWorkflow.status === 'REJECTED' && (
                                    <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded text-[9px] font-extrabold uppercase tracking-wide flex items-center gap-1" title="Violation flagged by administrative moderator rules.">
                                      <AlertOctagon size={10} /> Violation/Rejected
                                    </span>
                                  )}
                                  {['ACTIVE', 'SCHEDULED', 'APPROVED', 'SOLD'].includes(activeWorkflow.status) && (
                                    <span className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-100 rounded text-[9px] font-extrabold uppercase tracking-wide flex items-center gap-1">
                                      <CheckCircle2 size={10} /> Live in Pool
                                    </span>
                                  )}
                                </>
                              ) : (
                                <button 
                                  onClick={() => handleTriggerAuctionLaunch(item)}
                                  className="text-[9px] font-bold flex items-center gap-0.5 px-2 py-1 rounded border bg-gradient-to-r from-blue-600 to-blue-500 text-white border-transparent hover:opacity-90 cursor-pointer shadow-sm shadow-blue-500/10"
                                >
                                  <ArrowUpRight size={10} /> Launch Auction
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => handleOpenEditModal(item)} className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 border border-transparent hover:border-blue-100 rounded-lg transition cursor-pointer">
                                <Edit2 size={14} />
                              </button>
                              <button onClick={() => deleteListing(item.id)} className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-transparent hover:border-rose-100 rounded-lg transition cursor-pointer">
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================= MODAL: CREATE & EDIT PROPERTY ================= */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)} />
            <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
              <h3 className="text-md font-bold text-slate-800 border-b pb-3 mb-4">{isEditMode ? "Modify Property Structure" : "Post New Real Estate Asset"}</h3>
              <form onSubmit={handlePropertyFormSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-400 uppercase mb-1">Title</label>
                    <input type="text" value={propertyForm.title} onChange={e => setPropertyForm({...propertyForm, title: e.target.value})} className="w-full border rounded-xl px-3 py-2 outline-none focus:border-blue-500" required />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-400 uppercase mb-1">Price (PKR)</label>
                    <input type="number" value={propertyForm.price} onChange={e => setPropertyForm({...propertyForm, price: e.target.value})} className="w-full border rounded-xl px-3 py-2 outline-none focus:border-blue-500" required />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-400 uppercase mb-1">Purpose</label>
                    <select value={propertyForm.purpose} onChange={e => setPropertyForm({...propertyForm, purpose: e.target.value})} className="w-full border rounded-xl px-3 py-2 bg-transparent outline-none">
                      <option value="SALE">For Sale</option> {/* Corrected value to "SALE" */}
                      <option value="RENT">Rent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-400 uppercase mb-1">Type</label>
                    <select value={propertyForm.propertyType} onChange={e => setPropertyForm({...propertyForm, propertyType: e.target.value})} className="w-full border rounded-xl px-3 py-2 bg-transparent outline-none">
                      <option value="HOUSE">House</option>
                      <option value="PLOT">Plot</option>
                      <option value="APARTMENT">Apartment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-400 uppercase mb-1">Area Size</label>
                    <input type="text" value={propertyForm.area} onChange={e => setPropertyForm({...propertyForm, area: e.target.value})} className="w-full border rounded-xl px-3 py-2 outline-none focus:border-blue-500" placeholder="e.g. 5 Marla" required />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-400 uppercase mb-1">Bedrooms</label>
                    <input type="number" value={propertyForm.bedrooms} onChange={e => setPropertyForm({...propertyForm, bedrooms: parseInt(e.target.value) || 0})} className="w-full border rounded-xl px-3 py-2" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-400 uppercase mb-1">Bathrooms</label>
                    <input type="number" value={propertyForm.bathrooms} onChange={e => setPropertyForm({...propertyForm, bathrooms: parseInt(e.target.value) || 0})} className="w-full border rounded-xl px-3 py-2" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-400 uppercase mb-1">Location Sector</label>
                    <select value={propertyForm.location} onChange={e => setPropertyForm({...propertyForm, location: e.target.value})} className="w-full border rounded-xl px-3 py-2 bg-transparent outline-none">
                      <option value="D Ground">D Ground</option>
                      <option value="Madina Town">Madina Town</option>
                      <option value="Canal Road">Canal Road</option>
                      <option value="Samanabad">Samanabad</option>
                    </select>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block font-bold text-slate-400 uppercase">Description</label>
                    <button
                      type="button"
                      onClick={handleGenerateAIDescription}
                      disabled={generatingDesc}
                      className="px-2.5 py-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-lg text-[10px] font-black uppercase flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50 transition"
                    >
                      {generatingDesc ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3" />
                          Generate AI Description
                        </>
                      )}
                    </button>
                  </div>
                  <textarea value={propertyForm.description} onChange={e => setPropertyForm({...propertyForm, description: e.target.value})} className="w-full border rounded-xl px-3 py-2 h-16 outline-none focus:border-blue-500" required />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 uppercase mb-1">Detailed Street Address</label>
                  <input type="text" value={propertyForm.address} onChange={e => setPropertyForm({...propertyForm, address: e.target.value})} className="w-full border rounded-xl px-3 py-2 outline-none focus:border-blue-500" required />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 uppercase mb-1">Media Catalog ({isEditMode ? "Optional Overwrite" : "Required"})</label>
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full text-slate-500" required={!isEditMode} />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 border rounded-xl hover:bg-slate-50 cursor-pointer font-bold">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer font-bold">Save Configuration</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= MODAL: AUCTION STEPPER CONFIGURATOR ================= */}
        {isAuctionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAuctionModalOpen(false)} />
            <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95">
              <div className="flex items-center gap-2 border-b pb-3 mb-4 text-slate-800">
                <Gavel className="text-amber-600" size={18} />
                <h3 className="text-md font-bold">Configure Land Auction Registry</h3>
              </div>
              <form onSubmit={handleAuctionFormSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-400 uppercase mb-1">Starting Bidding Floor (PKR)</label>
                  <input type="number" value={auctionSetupForm.startingPrice} onChange={e => setAuctionSetupForm({...auctionSetupForm, startingPrice: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500" required />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 uppercase mb-1">Minimum Hidden Reserve Target (PKR - Optional)</label>
                  <input type="number" value={auctionSetupForm.reservePrice} onChange={e => setAuctionSetupForm({...auctionSetupForm, reservePrice: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500" placeholder="e.g. Lowest price acceptable to close sale" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-400 uppercase mb-1">Opening Bid Window</label>
                    <input type="datetime-local" value={auctionSetupForm.startTime} onChange={e => setAuctionSetupForm({...auctionSetupForm, startTime: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500" required />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-400 uppercase mb-1">Closing Expiration Window</label>
                    <input type="datetime-local" value={auctionSetupForm.endTime} onChange={e => setAuctionSetupForm({...auctionSetupForm, endTime: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500" required />
                  </div>
                </div>
                <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl flex gap-2.5 text-amber-800 text-[11px] leading-relaxed">
                  <Info size={16} className="shrink-0 mt-0.5" />
                  <p>Upgrading listings places them directly into the admin approval workflow. Live timestamps update automatically.</p>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button type="button" onClick={() => setIsAuctionModalOpen(false)} className="px-4 py-2 border rounded-xl hover:bg-slate-50 cursor-pointer font-bold">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-xl hover:opacity-95 cursor-pointer font-bold">Launch to Moderator Panel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= TAB: SAVED PROPERTIES ================= */}
        {activeTab === 'Saved Properties' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {savedProperties.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                <Heart size={40} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium">No bookmarked properties in your catalog.</p>
                <button onClick={() => navigate('/property-finder')} className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition cursor-pointer">Explore Current Live Listings</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedProperties.map((prop) => (
                  <div key={prop.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between" />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: SMART BUILD HISTORY ================= */}
        {activeTab === 'Smart Build' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-200">
            <div className="p-12 text-center">
              <Calculator size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">No previous construction cost logs found.</p>
            </div>
          </div>
        )}

        {/* ================= TAB: AUCTIONS ================= */}
        {activeTab === 'Auctions' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-200">
            <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-md font-bold text-slate-800">Your Bids & Linked Auctions</h3>
                <p className="text-xs text-slate-400 mt-1">Real-time scheduling logs, active high bidders, and chronological ticker frames.</p>
              </div>
              <button onClick={() => navigate('/auction')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/10">
                <Gavel size={14} /> Explore Live Auctions
              </button>
            </div>

            {myAuctions.length === 0 ? (
              <div className="p-12 text-center">
                <Gavel size={40} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium">You have no active or historical auction listings logs mapped.</p>
                <button onClick={() => navigate('/auction')} className="mt-4 px-4 py-2 border border-blue-600 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-50 transition cursor-pointer">
                  Join Live Auctions
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase">
                    <tr>
                      <th className="px-6 py-4">Auction Asset</th>
                      <th className="px-6 py-4">District / Area</th>
                      <th className="px-6 py-4">Starting Target</th>
                      <th className="px-6 py-4">Current High Bid</th>
                      <th className="px-6 py-4">Status / Workflow</th>
                      <th className="px-6 py-4 text-right">Chronological Scheduler Ticker</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myAuctions.map((item) => {
                      const countdown = calculateAuctionTimeState(item.startTime, item.endTime);
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition">
                          <td className="px-6 py-4.5 font-bold text-slate-800">
                            <div className="flex flex-col">
                              <span className="text-sm tracking-tight text-slate-800">{item.propertyTitle || "Asset Frame Logging"}</span>
                              <span className="text-[10px] text-slate-400 font-mono mt-0.5">ID: #AUC-{item.id}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4.5 text-xs text-slate-500 font-semibold">
                            <div className="flex items-center gap-1">
                              <MapPin size={12} className="text-slate-400" />
                              <span>{item.location || "Faisalabad"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4.5 font-semibold text-slate-600 text-xs">
                            Rs {item.startingPrice?.toLocaleString() || "0"}
                          </td>
                          <td className="px-6 py-4.5 font-black text-blue-600 text-sm">
                            Rs {item.currentHighestBid ? item.currentHighestBid.toLocaleString() : "No Bids Placed"}
                          </td>
                          <td className="px-6 py-4.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide border ${
                              item.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                              item.status === 'PENDING_APPROVAL' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                              item.status === 'SOLD' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                              'bg-slate-50 text-slate-600 border-slate-200'
                            }`}>
                              {item.status === 'PENDING_APPROVAL' ? 'PENDING MODERATION' : item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4.5 text-right whitespace-nowrap">
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold font-mono ${countdown.color}`}>
                              <Clock size={13} />
                              <span>{countdown.label}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: DIGITAL DEEDS ================= */}
        {activeTab === 'Deeds' && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            {/* HEADER BANNER */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <QrCode className="text-amber-500" size={20} />
                  <h3 className="text-lg font-black text-slate-800">My Registered Title Deeds</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Cryptographically sealed property title deeds backed by SHA-256 blockchain proofs and land revenue registry approval.
                </p>
              </div>

              <button
                onClick={() => setIsDeedModalOpen(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/10 shrink-0"
              >
                <PlusCircle size={15} /> Request Deed Verification
              </button>
            </div>

            {/* DEEDS GRID */}
            {myDeeds.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                <QrCode size={40} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium">No title deed verification requests submitted yet.</p>
                <button
                  onClick={() => setIsDeedModalOpen(true)}
                  className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl transition cursor-pointer"
                >
                  Submit Property for Verification
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myDeeds.map((deed) => {
                  const isVerified = deed.status === "Verified";
                  const publicSig = generateSignature(deed.deedId, "public");
                  const ownerSig = generateSignature(deed.deedId, "buyer");
                  const publicUrl = `/verify-deed?deedId=${deed.deedId}&role=public&sig=${publicSig}`;
                  const ownerUrl = `/verify-deed?deedId=${deed.deedId}&role=buyer&sig=${ownerSig}`;

                  return (
                    <div key={deed.deedId} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 font-mono text-xs font-bold">
                            {deed.deedId}
                          </span>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                            isVerified 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {deed.status}
                          </span>
                        </div>

                        <h4 className="text-base font-extrabold text-slate-900">{deed.title}</h4>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <MapPin size={13} className="text-slate-400" /> {deed.location}
                        </p>

                        <div className="my-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Transaction Valuation:</span>
                            <span className="font-bold text-slate-800">{deed.price}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Registry Authority:</span>
                            <span className="font-medium text-slate-700">{deed.registryOffice}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Verification Status:</span>
                            <span className="font-mono text-xs text-slate-700">{deed.verifiedAt}</span>
                          </div>
                        </div>

                        {/* Live Scannable Vector QR Code */}
                        {isVerified && (
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-4 my-3">
                            <div className="bg-white p-2 rounded-xl border border-slate-200 shrink-0">
                              <QRCodeSVG 
                                value={`${getQRBaseUrl()}${publicUrl}`} 
                                size={90} 
                                level="H" 
                                includeMargin={true} 
                              />
                            </div>
                            <div className="text-left space-y-1">
                              <span className="text-[10px] font-mono font-bold text-amber-600 uppercase block">📷 Mobile Camera Scannable QR</span>
                              <p className="text-[11px] text-slate-500 leading-tight">
                                Point any mobile camera or QR app at this code to verify public title deed authenticity.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex gap-2">
                        <button
                          onClick={() => navigate(publicUrl)}
                          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <ExternalLink size={14} /> Public Scan
                        </button>

                        <button
                          onClick={() => navigate(ownerUrl)}
                          className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10"
                        >
                          <ShieldCheck size={14} /> Owner Unmasked Deed
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* MODAL: REQUEST DEED VERIFICATION */}
        {isDeedModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsDeedModalOpen(false)} />
            <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95">
              <div className="flex items-center gap-2 border-b pb-3 mb-4 text-slate-800">
                <QrCode className="text-amber-500" size={20} />
                <h3 className="text-md font-bold">Request Title Deed Verification</h3>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const selectedProp = myListings.find(p => String(p.id) === String(selectedPropForDeed)) || { id: Math.floor(100 + Math.random() * 900), title: "My Residential Property", location: "Faisalabad", price: "1.5 Crore" };
                requestDeedVerification(selectedProp, profileForm.email);
                setMyDeeds(getUserDeeds(profileForm.email));
                setIsDeedModalOpen(false);
              }} className="space-y-4 text-xs text-left">
                <div>
                  <label className="block font-bold text-slate-400 uppercase mb-1">Select Property Listing</label>
                  <select 
                    value={selectedPropForDeed} 
                    onChange={(e) => setSelectedPropForDeed(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-amber-500 text-slate-700 font-semibold"
                    required
                  >
                    <option value="">-- Choose from posted properties --</option>
                    {myListings.map(p => (
                      <option key={p.id} value={p.id}>{p.title || p.propertyTitle || `Property #${p.id}`}</option>
                    ))}
                  </select>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex gap-2 text-amber-800 text-[11px] leading-relaxed">
                  <Info size={16} className="shrink-0 mt-0.5" />
                  <p>Submitting your property initiates cryptographic SHA-256 land revenue record matching and generates your camera-scannable QR title deed.</p>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button type="button" onClick={() => setIsDeedModalOpen(false)} className="px-4 py-2 border rounded-xl hover:bg-slate-50 cursor-pointer font-bold">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-xl hover:opacity-95 cursor-pointer font-black">Submit for Verification</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= TAB: PROFILE ================= */}
        {activeTab === 'Profile' && (
          <div className="max-w-3xl space-y-6 animate-in fade-in duration-200">
            
            {/* CURRENT SUBSCRIPTION BADGE CARD */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest block">Active Account Plan</span>
                <div className="flex items-center gap-2 mt-1">
                  <h3 className="text-lg font-black text-slate-800 capitalize">{plan.name} Plan</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    plan.id === 'free' ? 'bg-slate-100 text-slate-500 border border-slate-200' :
                    plan.id === 'pro' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                    'bg-indigo-50 text-indigo-650 border border-indigo-150'
                  }`}>
                    {plan.id === 'free' ? 'Free' : 'Premium'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {plan.id === 'free' 
                    ? "Upgrade your account to unlock AI Price Assessor maps, unlimited listings, and registry deed certificates." 
                    : `Your ${plan.name} account is active, billed ${billingCycle}. Enjoy unlimited AI tools and features.`
                  }
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/pricing')}
                className="px-4.5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-sm hover:shadow-md shrink-0"
              >
                Manage Subscription
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
              <form onSubmit={saveProfileSettings} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                    <input type="text" value={profileForm.fullName} onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                    <input type="email" value={profileForm.email} disabled className="w-full border border-slate-200 bg-slate-50 text-slate-400 rounded-xl px-4 py-2.5 text-sm outline-none cursor-not-allowed" />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"><Save size={14} /> Save Profiling Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} />
          <div className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100/80 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex gap-4 items-start">
              <div className={`p-3 rounded-xl shrink-0 ${confirmModal.type === 'danger' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                {confirmModal.type === 'danger' ? <ShieldAlert size={22} /> : <HelpCircle size={22} />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-md font-bold text-slate-800 tracking-tight">{confirmModal.title}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{confirmModal.message}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100">
              <button onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl transition cursor-pointer border border-slate-100">Cancel</button>
              <button onClick={confirmModal.onConfirm} className={`px-4 py-2 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md ${confirmModal.type === 'danger' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-amber-600 hover:bg-amber-700'}`}>{confirmModal.confirmText}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SidebarItem = ({ icon: Icon, text, active, onClick, isOpen }) => (
  <li onClick={onClick} className={`flex items-center cursor-pointer px-4 py-3 rounded-xl transition-all duration-300 mb-1 font-bold text-sm tracking-wide relative group ${active ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/15' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}>
    <Icon size={18} className={`min-w-[18px] shrink-0 transition-transform duration-300 ${active ? 'scale-105' : 'group-hover:scale-110 text-slate-400 group-hover:text-blue-600'}`} />
    <span className={`ml-3.5 whitespace-nowrap transition-all duration-300 font-semibold ${!isOpen ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>{text}</span>
    {active && isOpen && <span className="absolute right-3.5 w-1.5 h-1.5 rounded-full bg-white shadow-sm" />}
  </li>
);

export default UserDashboard;