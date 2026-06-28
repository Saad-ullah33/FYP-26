import React, { useState, useEffect } from 'react';
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
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Trash2, 
  Edit, 
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
  LogOut
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Parse tab from query param if available (e.g. /dashboard?tab=profile)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tabParam = queryParams.get('tab');
    if (tabParam) {
      if (tabParam === 'profile') setActiveTab('Profile');
      else if (tabParam === 'listings') setActiveTab('My Listings');
      else if (tabParam === 'saved') setActiveTab('Saved Properties');
      else if (tabParam === 'estimates') setActiveTab('Smart Build');
      else if (tabParam === 'auctions') setActiveTab('Auctions');
    }
  }, [location]);

  const [activeTab, setActiveTab] = useState('Overview');

  // Search and Compare States
  const [searchQuery, setSearchQuery] = useState('');
  const [comparedProperties, setComparedProperties] = useState([]);

  // Mock User listings
  const [myListings, setMyListings] = useState([
    { id: 101, title: '5 Marla Modern House', location: 'Giga Mall, Islamabad', price: '1.8 Crore', status: 'Pending', type: 'HOUSE', views: 42, leads: 3 },
    { id: 105, title: 'Commercial Shop Ground Floor', location: 'Centaurus, Islamabad', price: '1.2 Crore', status: 'Approved', type: 'COMMERCIAL', views: 185, leads: 14 },
    { id: 106, title: '3 Marla Townhouse Block A', location: 'Samanabad, Faisalabad', price: '95 Lakhs', status: 'Approved', type: 'HOUSE', views: 67, leads: 5 }
  ]);

  // Mock Saved listings
  const [savedProperties, setSavedProperties] = useState([
    { id: 301, title: '1 Kanal Luxury Villa', location: 'DHA Phase 6, Lahore', price: '5.2 Crore', type: 'HOUSE', bedrooms: 5, bathrooms: 6, area: '4500 sqft', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c' },
    { id: 302, title: 'Modern 2 Bed Apartment', location: 'Gulberg Greens, Islamabad', price: '1.6 Crore', type: 'APARTMENT', bedrooms: 2, bathrooms: 2.5, area: '1400 sqft', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00' },
    { id: 303, title: '10 Marla Corner Plot', location: 'Bahria Town, Rawalpindi', price: '2.8 Crore', type: 'LAND', bedrooms: 0, bathrooms: 0, area: '2250 sqft', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef' },
  ]);

  // Mock Smart Build Estimations
  const [buildEstimates, setBuildEstimates] = useState([
    { id: 401, plotSize: '5 Marla', plotDimensions: '25x45', floors: 'Double Storey', quality: 'Premium A+', estimatedCost: '85 Lakhs', date: '2026-06-25' },
    { id: 402, plotSize: '10 Marla', plotDimensions: '35x65', floors: 'Single Storey', quality: 'Standard A', estimatedCost: '1.1 Crore', date: '2026-05-18' }
  ]);

  // Mock Auction Bids
  const [myBids, setMyBids] = useState([
    { id: 501, propertyTitle: '3 Bed Apartment Sec B', currentPrice: '1.4 Crore', myBid: '1.38 Crore', status: 'Outbid', timeLeft: '2 hours', leadingBidder: 'User #224' },
    { id: 502, propertyTitle: '10 Marla House DHA', currentPrice: '3.1 Crore', myBid: '3.1 Crore', status: 'Highest Bid', timeLeft: '1 day', leadingBidder: 'You' }
  ]);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    fullName: 'Saad Ullah',
    email: user?.email || 'demo@fyp.com',
    phone: '+92 312 3456789',
    city: 'Faisalabad',
    address: 'D-Type Colony, Faisalabad',
    notificationsEnabled: true
  });

  const [isSavedMsg, setIsSavedMsg] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'danger'
  });

  // Stats Grid Data
  const stats = [
    { title: 'My Listings', value: myListings.length, detail: '2 Active, 1 Pending', icon: Building2, color: 'bg-blue-600/10 text-blue-600 border-blue-500/20' },
    { title: 'Bookmarked', value: savedProperties.length, detail: 'Saved property alerts', icon: Heart, color: 'bg-rose-600/10 text-rose-600 border-rose-500/20' },
    { title: 'Smart Estimations', value: buildEstimates.length, detail: 'Calculated project costs', icon: Calculator, color: 'bg-purple-600/10 text-purple-600 border-purple-500/20' },
    { title: 'Auction Bids', value: myBids.length, detail: '1 Leading, 1 Outbid', icon: Gavel, color: 'bg-amber-600/10 text-amber-600 border-amber-500/20' },
  ];

  const notifications = [
    { id: 1, type: 'Alert', title: 'You have been outbid!', desc: 'Another user bid 1.4 Crore on "3 Bed Apartment Sec B".', time: '10 mins ago' },
    { id: 2, type: 'Deed', title: 'TrustDeed Approved!', desc: 'Your 5 Marla Modern House document TD-9921-PB has been verified.', time: '2 hours ago' },
    { id: 3, type: 'System', title: 'Monthly Appraisal Report', desc: 'Your bookmarked DHA Phase 6 Villa increased in value by 1.2%.', time: 'Yesterday' }
  ];

  const handleLogout = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Sign Out',
      message: 'Are you sure you want to sign out of PropSight? You will need to log in again to access your dashboard.',
      confirmText: 'Sign Out',
      cancelText: 'Cancel',
      type: 'warning',
      onConfirm: () => {
        logout();
        navigate('/login');
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const deleteListing = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Property Listing',
      message: 'Are you sure you want to delete this property listing? This action is permanent and cannot be undone.',
      confirmText: 'Delete Listing',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        setMyListings(prev => prev.filter(item => item.id !== id));
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const removeSavedProperty = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remove Saved Property',
      message: 'Are you sure you want to remove this property from your bookmarked items?',
      confirmText: 'Remove Bookmark',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        setSavedProperties(prev => prev.filter(item => item.id !== id));
        setComparedProperties(prev => prev.filter(item => item !== id));
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const toggleCompare = (id) => {
    if (comparedProperties.includes(id)) {
      setComparedProperties(comparedProperties.filter(item => item !== id));
    } else {
      if (comparedProperties.length >= 3) return; // Limit to 3
      setComparedProperties([...comparedProperties, id]);
    }
  };

  const saveProfileSettings = (e) => {
    e.preventDefault();
    setIsSavedMsg(true);
    setTimeout(() => setIsSavedMsg(false), 2000);
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-700 font-sans overflow-hidden">
      
      {/* ================= SIDEBAR ================= */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-200 transition-all duration-300 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between h-20 border-b border-slate-200">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">PS</span>
              <h1 className="text-lg font-black text-slate-800 tracking-wider">
                PropSight<span className="text-blue-600 text-xs font-semibold ml-0.5">User</span>
              </h1>
            </div>
          ) : (
            <span className="w-8 h-8 mx-auto rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">P</span>
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded cursor-pointer transition">
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-1.5 px-3">
            <SidebarItem icon={LayoutDashboard} text="Overview" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} isOpen={isSidebarOpen} />
            <SidebarItem icon={Building2} text="My Listings" active={activeTab === 'My Listings'} onClick={() => setActiveTab('My Listings')} isOpen={isSidebarOpen} />
            <SidebarItem icon={Heart} text="Saved Properties" active={activeTab === 'Saved Properties'} onClick={() => setActiveTab('Saved Properties')} isOpen={isSidebarOpen} />
            <SidebarItem icon={Calculator} text="Smart Build" active={activeTab === 'Smart Build'} onClick={() => setActiveTab('Smart Build')} isOpen={isSidebarOpen} />
            <SidebarItem icon={Gavel} text="Auctions" active={activeTab === 'Auctions'} onClick={() => setActiveTab('Auctions')} isOpen={isSidebarOpen} />
            
            <div className={`mt-6 mb-2 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider ${!isSidebarOpen && 'hidden'}`}>
              Account Settings
            </div>
            <SidebarItem icon={User} text="Profile" active={activeTab === 'Profile'} onClick={() => setActiveTab('Profile')} isOpen={isSidebarOpen} />
          </ul>
        </nav>

        {/* Profile Card */}
        {isSidebarOpen && (
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
          <button 
            onClick={handleLogout}
            className="flex items-center w-full p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer font-semibold text-sm"
          >
            <LogOut size={18} />
            {isSidebarOpen && <span className="ml-3">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-6 lg:p-8">
        
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              {activeTab === 'Overview' && <LayoutDashboard className="text-blue-600" />}
              {activeTab === 'My Listings' && <Building2 className="text-blue-600" />}
              {activeTab === 'Saved Properties' && <Heart className="text-blue-600" />}
              {activeTab === 'Smart Build' && <Calculator className="text-blue-600" />}
              {activeTab === 'Auctions' && <Gavel className="text-blue-600" />}
              {activeTab === 'Profile' && <User className="text-blue-600" />}
              {activeTab}
            </h2>
            <p className="text-slate-500 text-sm mt-1">Manage listings, appraisal histories, bids, and profile credentials.</p>
          </div>
          
          <div className="flex items-center gap-3.5 self-start sm:self-center">
            {activeTab === 'Overview' && (
              <button 
                onClick={() => navigate('/add-property')}
                className="px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-blue-500/20"
              >
                <PlusCircle size={14} />
                Post Property
              </button>
            )}
          </div>
        </header>

        {/* ================= TAB: OVERVIEW ================= */}
        {activeTab === 'Overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <div 
                  key={idx} 
                  onClick={() => {
                    if (stat.title === 'My Listings') setActiveTab('My Listings');
                    else if (stat.title === 'Bookmarked') setActiveTab('Saved Properties');
                    else if (stat.title === 'Smart Estimations') setActiveTab('Smart Build');
                    else if (stat.title === 'Auction Bids') setActiveTab('Auctions');
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
                  <div className="mt-4 text-xs text-slate-500 font-medium">
                    {stat.detail}
                  </div>
                </div>
              ))}
            </div>

            {/* Split Section: Notifications & Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Notifications */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Bell size={18} className="text-blue-600" />
                    Recent Alerts & System Logs
                  </h3>
                  <span className="text-[9px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">Live Status</span>
                </div>
                
                <div className="divide-y divide-slate-100">
                  {notifications.map((item) => (
                    <div key={item.id} className="p-5 hover:bg-slate-50/30 transition flex gap-4 items-start">
                      <div className={`p-2.5 rounded-xl shrink-0 ${
                        item.type === 'Alert' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                        item.type === 'Deed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        {item.type === 'Alert' ? <ShieldAlert size={16} /> : item.type === 'Deed' ? <CheckCircle2 size={16} /> : <Info size={16} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4">
                          <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                          <span className="text-[10px] text-slate-400 font-semibold whitespace-nowrap">{item.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-white rounded-2xl border border-slate-150 p-6 flex flex-col justify-between shadow-sm">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Sparkles size={18} className="text-blue-600" />
                    App Quick Actions
                  </h3>
                  <div className="space-y-3.5">
                    <button 
                      onClick={() => navigate('/property-finder')} 
                      className="w-full text-left p-3.5 bg-slate-50/50 hover:bg-gradient-to-r hover:from-blue-50/40 hover:to-white hover:text-blue-600 rounded-xl border border-slate-100 hover:border-blue-200 text-xs font-bold transition-all duration-300 flex items-center justify-between group shadow-sm hover:shadow-md"
                    >
                      <span className="flex items-center gap-2">
                        <Search size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                        <span>Find Properties with Smart Filters</span>
                      </span>
                      <ExternalLink size={14} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                    </button>
                    
                    <button 
                      onClick={() => navigate('/smart-build')} 
                      className="w-full text-left p-3.5 bg-slate-50/50 hover:bg-gradient-to-r hover:from-blue-50/40 hover:to-white hover:text-blue-600 rounded-xl border border-slate-100 hover:border-blue-200 text-xs font-bold transition-all duration-300 flex items-center justify-between group shadow-sm hover:shadow-md"
                    >
                      <span className="flex items-center gap-2">
                        <Calculator size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                        <span>Launch Smart Build Estimator</span>
                      </span>
                      <ExternalLink size={14} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                    </button>

                    <button 
                      onClick={() => setActiveTab('Profile')} 
                      className="w-full text-left p-3.5 bg-slate-50/50 hover:bg-gradient-to-r hover:from-blue-50/40 hover:to-white hover:text-blue-600 rounded-xl border border-slate-100 hover:border-blue-200 text-xs font-bold transition-all duration-300 flex items-center justify-between group shadow-sm hover:shadow-md"
                    >
                      <span className="flex items-center gap-2">
                        <User size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                        <span>Update Security Credentials</span>
                      </span>
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all duration-300" />
                    </button>
                  </div>
                </div>

                <div className="mt-8 bg-blue-50/40 p-4 rounded-xl border border-blue-100 text-xs leading-relaxed text-blue-800 flex gap-2.5 items-start">
                  <Info size={16} className="shrink-0 mt-0.5 text-blue-600" />
                  <div>
                    <span className="font-bold">Need assistance?</span> Contact customer support anytime via email or call center registry systems.
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= TAB: MY LISTINGS ================= */}
        {activeTab === 'My Listings' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-200">
            <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-md font-bold text-slate-800">Properties You Posted</h3>
              <button 
                onClick={() => navigate('/add-property')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5"
              >
                <PlusCircle size={14} />
                Add New Listing
              </button>
            </div>

            {myListings.length === 0 ? (
              <div className="p-12 text-center">
                <Building2 size={40} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium">You have not posted any property listings yet.</p>
                <button 
                  onClick={() => navigate('/add-property')}
                  className="mt-4 px-4 py-2 border border-blue-600 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-50 transition cursor-pointer"
                >
                  Create Your First Post
                </button>
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
                      <th className="px-6 py-4 text-center">Performance</th>
                      <th className="px-6 py-4 text-right">Settings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myListings.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4.5 font-bold text-slate-800">
                          <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                            {item.title}
                          </div>
                        </td>
                        <td className="px-6 py-4.5 text-xs text-slate-500 font-semibold">{item.location}</td>
                        <td className="px-6 py-4.5 text-sm font-extrabold text-blue-600">{item.price}</td>
                        <td className="px-6 py-4.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            item.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4.5">
                          <div className="flex justify-center items-center gap-4 text-xs font-semibold text-slate-500">
                            <span>👁 {item.views} Views</span>
                            <span>📞 {item.leads} Leads</span>
                          </div>
                        </td>
                        <td className="px-6 py-4.5 text-right">
                          <button
                            onClick={() => deleteListing(item.id)}
                            className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-transparent hover:border-rose-100 rounded-lg transition cursor-pointer"
                            title="Remove Listing"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: SAVED PROPERTIES ================= */}
        {activeTab === 'Saved Properties' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Grid of Saved Cards */}
            {savedProperties.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                <Heart size={40} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium">No bookmarked properties in your catalog.</p>
                <button 
                  onClick={() => navigate('/property-finder')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition cursor-pointer"
                >
                  Explore Current Live Listings
                </button>
              </div>
            ) : (
              <>
                <div className="bg-blue-50 border border-blue-100 text-blue-800 p-4 rounded-xl text-xs flex justify-between items-center">
                  <span className="font-semibold">Side-by-Side Comparator: Select up to 3 properties to compare structural parameters.</span>
                  <span className="font-bold text-xs bg-blue-100 px-3 py-1 rounded-full">{comparedProperties.length} / 3 selected</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedProperties.map((prop) => (
                    <div key={prop.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                      <div>
                        <div className="relative h-44 bg-slate-100">
                          <img 
                            src={prop.image} 
                            alt={prop.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6"; }} 
                          />
                          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-extrabold text-blue-600 uppercase border border-slate-100 shadow-sm">
                            {prop.type}
                          </span>
                        </div>
                        <div className="p-5">
                          <h4 className="font-bold text-slate-800 text-sm">{prop.title}</h4>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-semibold">
                            <MapPin size={13} className="text-slate-400" />
                            {prop.location}
                          </p>
                          
                          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-center text-[10px] font-bold text-slate-500">
                            <div>
                              <p className="text-slate-400">Area</p>
                              <p className="mt-0.5 text-slate-700">{prop.area}</p>
                            </div>
                            <div>
                              <p className="text-slate-400">Beds</p>
                              <p className="mt-0.5 text-slate-700">{prop.bedrooms || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-slate-400">Baths</p>
                              <p className="mt-0.5 text-slate-700">{prop.bathrooms || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="px-5 pb-5 pt-2 flex items-center justify-between gap-3">
                        <span className="text-sm font-extrabold text-blue-600">{prop.price}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleCompare(prop.id)}
                            className={`px-3 py-1.5 border rounded-lg text-xs font-bold transition cursor-pointer ${
                              comparedProperties.includes(prop.id) 
                                ? 'bg-blue-600 text-white border-blue-600' 
                                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {comparedProperties.includes(prop.id) ? 'Comparing' : 'Compare'}
                          </button>
                          <button
                            onClick={() => removeSavedProperty(prop.id)}
                            className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-100 rounded-lg transition cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Compare Drawer (If items selected) */}
                {comparedProperties.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xl animate-in slide-in-from-bottom duration-300">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-3.5 mb-5">
                      <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                        <Sparkles size={16} className="text-blue-600" />
                        Side-by-Side Property Comparison Registry
                      </h4>
                      <button 
                        onClick={() => setComparedProperties([])}
                        className="text-xs text-slate-400 hover:text-slate-600 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        Reset Compare
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {comparedProperties.map((id) => {
                        const prop = savedProperties.find(p => p.id === id);
                        if (!prop) return null;
                        return (
                          <div key={prop.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                            <h5 className="font-bold text-slate-800 text-sm truncate mb-2">{prop.title}</h5>
                            <div className="space-y-1.5 text-slate-600">
                              <div className="flex justify-between border-b border-slate-200/40 pb-1">
                                <span className="text-slate-400">Price tag</span>
                                <span className="font-bold text-blue-600">{prop.price}</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-200/40 pb-1">
                                <span className="text-slate-400">Location</span>
                                <span className="font-medium truncate max-w-[150px]">{prop.location}</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-200/40 pb-1">
                                <span className="text-slate-400">Dimensions</span>
                                <span className="font-bold text-slate-800">{prop.area}</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-200/40 pb-1">
                                <span className="text-slate-400">Bed/Bath configurations</span>
                                <span className="font-bold text-slate-800">{prop.bedrooms} / {prop.bathrooms}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Housing Type</span>
                                <span className="font-bold text-slate-800">{prop.type}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ================= TAB: SMART BUILD HISTORY ================= */}
        {activeTab === 'Smart Build' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-200">
            <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-md font-bold text-slate-800">Smart Build Estimations Log</h3>
                <p className="text-xs text-slate-400 mt-1">Estimations you ran for building structures including materials and finishes.</p>
              </div>
              <button 
                onClick={() => navigate('/smart-build')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5"
              >
                <Calculator size={14} />
                Run New Estimate
              </button>
            </div>

            {buildEstimates.length === 0 ? (
              <div className="p-12 text-center">
                <Calculator size={40} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium">No previous construction cost logs found.</p>
                <button 
                  onClick={() => navigate('/smart-build')}
                  className="mt-4 px-4 py-2 border border-blue-600 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-50 transition cursor-pointer"
                >
                  Estimate Material Costs
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase">
                    <tr>
                      <th className="px-6 py-4">Plot Size</th>
                      <th className="px-6 py-4">Dimensions</th>
                      <th className="px-6 py-4">Structural Profile</th>
                      <th className="px-6 py-4">Construction Grade</th>
                      <th className="px-6 py-4">Estimated Total Cost</th>
                      <th className="px-6 py-4 text-right">Calculation Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {buildEstimates.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4.5 font-bold text-slate-800">{item.plotSize}</td>
                        <td className="px-6 py-4.5 font-mono text-xs text-slate-500">{item.plotDimensions}</td>
                        <td className="px-6 py-4.5 text-xs text-slate-600 font-semibold">{item.floors}</td>
                        <td className="px-6 py-4.5 text-xs">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md font-bold text-[10px] border border-blue-100">
                            {item.quality}
                          </span>
                        </td>
                        <td className="px-6 py-4.5 font-extrabold text-blue-600 text-sm">{item.estimatedCost}</td>
                        <td className="px-6 py-4.5 text-xs text-slate-400 text-right font-medium">{item.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: AUCTIONS ================= */}
        {activeTab === 'Auctions' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-200">
            <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-md font-bold text-slate-800">Your Bids in Active Auctions</h3>
                <p className="text-xs text-slate-400 mt-1">Bidding logs, leading flags, and time alerts on real estate assets.</p>
              </div>
              <button 
                onClick={() => navigate('/auction')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5"
              >
                <Gavel size={14} />
                Explore Live Auctions
              </button>
            </div>

            {myBids.length === 0 ? (
              <div className="p-12 text-center">
                <Gavel size={40} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium">You have not entered any active auction bids.</p>
                <button 
                  onClick={() => navigate('/auction')}
                  className="mt-4 px-4 py-2 border border-blue-600 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-50 transition cursor-pointer"
                >
                  Join Live Auctions
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase">
                    <tr>
                      <th className="px-6 py-4">Auction Asset</th>
                      <th className="px-6 py-4">Current High Bid</th>
                      <th className="px-6 py-4">Your Placed Bid</th>
                      <th className="px-6 py-4">Bidding State</th>
                      <th className="px-6 py-4">Active Leader</th>
                      <th className="px-6 py-4 text-right">Closing Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myBids.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4.5 font-bold text-slate-800">{item.propertyTitle}</td>
                        <td className="px-6 py-4.5 text-xs text-slate-500 font-semibold">{item.currentPrice}</td>
                        <td className="px-6 py-4.5 font-extrabold text-blue-600 text-sm">{item.myBid}</td>
                        <td className="px-6 py-4.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            item.status === 'Highest Bid' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4.5 text-xs text-slate-600 font-bold">{item.leadingBidder}</td>
                        <td className="px-6 py-4.5 text-xs text-rose-500 text-right font-bold animate-pulse">{item.timeLeft}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: PROFILE ================= */}
        {activeTab === 'Profile' && (
          <div className="max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8 animate-in fade-in duration-200">
            <h3 className="text-md font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6">
              Personal Profile & Access Details
            </h3>

            {isSavedMsg && (
              <div className="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} />
                Profile credentials updated successfully!
              </div>
            )}

            <form onSubmit={saveProfileSettings} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    disabled
                    className="w-full border border-slate-200 bg-slate-50 text-slate-400 rounded-xl px-4 py-2.5 text-sm outline-none cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Mobile Number</label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Primary City</label>
                  <input
                    type="text"
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Home Address</label>
                <textarea
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 transition h-20"
                  required
                />
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Notification Configurations</h4>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="notif_check"
                    checked={profileForm.notificationsEnabled}
                    onChange={(e) => setProfileForm({ ...profileForm, notificationsEnabled: e.target.checked })}
                    className="w-4.5 h-4.5 accent-blue-600 rounded cursor-pointer"
                  />
                  <label htmlFor="notif_check" className="text-xs text-slate-600 font-semibold cursor-pointer">
                    Send immediate mobile/email alerts when outbid or when listing approval changes.
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/10"
                >
                  <Save size={14} />
                  Save Profiling Changes
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
          />
          
          {/* Modal Box */}
          <div className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100/80 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex gap-4 items-start">
              <div className={`p-3 rounded-xl shrink-0 ${
                confirmModal.type === 'danger' ? 'bg-rose-50 text-rose-600' :
                confirmModal.type === 'warning' ? 'bg-amber-50 text-amber-600' :
                'bg-blue-50 text-blue-600'
              }`}>
                {confirmModal.type === 'danger' ? <ShieldAlert size={22} /> : 
                 confirmModal.type === 'warning' ? <HelpCircle size={22} /> : 
                 <Info size={22} />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-md font-bold text-slate-800 tracking-tight">{confirmModal.title}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{confirmModal.message}</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl transition cursor-pointer border border-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className={`px-4 py-2 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md ${
                  confirmModal.type === 'danger' ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/10' :
                  confirmModal.type === 'warning' ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/10' :
                  'bg-blue-600 hover:bg-blue-700 shadow-blue-500/10'
                }`}
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component for sidebar items with professional style stack
const SidebarItem = ({ icon: Icon, text, active, onClick, isOpen }) => (
  <li 
    onClick={onClick}
    className={`
      flex items-center cursor-pointer px-4 py-3 rounded-xl transition-all duration-300 mb-1 font-bold text-sm tracking-wide relative group
      ${active 
        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/15' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-50'}
    `}
  >
    <Icon size={18} className={`min-w-[18px] shrink-0 transition-transform duration-300 ${active ? 'scale-105' : 'group-hover:scale-110 text-slate-400 group-hover:text-blue-600'}`} />
    <span className={`ml-3.5 whitespace-nowrap transition-all duration-300 font-semibold ${!isOpen ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
      {text}
    </span>
    {active && isOpen && (
      <span className="absolute right-3.5 w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
    )}
  </li>
);

export default UserDashboard;
