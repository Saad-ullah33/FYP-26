import React, { useState, useEffect } from 'react';
import { getQRUrls, createDeed, initializeDeeds } from '../utils/deedService';
import { adminService } from '../utils/adminService';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Copy, ExternalLink, LayoutDashboard, Building2, Users, BrainCircuit, QrCode, 
  Settings, LogOut, Menu, X, TrendingUp, AlertCircle, Search, Filter, Check, 
  Sliders, ShieldCheck, UserCheck, UserX, Save, RefreshCw, ChevronRight, 
  Sparkles, Database, Lock, Play, Ban, ShieldAlert, Activity, Clock, ShieldX, Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout, user: currentUser } = useAuth(); // Grabbing current admin session info to prevent self-deletion
  
  // Dashboard Core Navigation States
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [globalLoading, setGlobalLoading] = useState(false);

  // Pagination Controls Variables
  const [opsPage, setOpsPage] = useState(1);
  const [totalOpsPages, setTotalOpsPages] = useState(1);

  // Search and Filter States
  const [userSearch, setUserSearch] = useState('');
  const [auctionFilter, setAuctionFilter] = useState('ALL');
  const [auctionSearch, setAuctionSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [userStatusFilter, setUserStatusFilter] = useState('All');
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [viewingUserActivity, setViewingUserActivity] = useState(null);

  // Properties Filter & Selection States
  const [propertySearch, setPropertySearch] = useState('');
  const [propertyCityFilter, setPropertyCityFilter] = useState('All');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('All');
  const [propertyStatusFilter, setPropertyStatusFilter] = useState('All');
  const [selectedPropIds, setSelectedPropIds] = useState([]);

  // System Settings Active Sub-Tab
  const [settingsSubTab, setSettingsSubTab] = useState('General');

  // TrustDeed request queue status tab
  const [deedQueueTab, setDeedQueueTab] = useState('Pending');

  // AI Predict Settings
  const [modelSettings, setModelSettings] = useState({
    learningRate: 0.001,
    epochs: 150,
    batchSize: 32,
    activeModel: 'PropPredict-v2.4-Neural',
    autoTrain: true,
    featureWeights: { location: 40, size: 30, amenities: 15, marketTrend: 15 }
  });

  // ── LIVE BACKEND DATA STATES ──
  const [liveStats, setLiveStats] = useState({
    totalUsers: 0, activeUsers: 0, blockedUsers: 0, pendingUsers: 0,
    totalProperties: 0, activeAuctions: 0, totalBids: 0
  });
  const [usersList, setUsersList] = useState([]);
  const [auctionsList, setAuctionsList] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);

  // Static Fallback Lists for Non-Analytics Modules
  const [trustDeeds, setTrustDeeds] = useState([
    { id: 201, propertyId: 101, owner: 'Ali Khan', documentId: 'TD-9921-PB', registryOffice: 'Faisalabad West', status: 'Pending', uploadDate: '2026-06-26', verifiedAt: null }
  ]);

  const [qrModal, setQrModal] = useState({ isOpen: false, deedId: '', urls: {} });
  const [toastMsg, setToastMsg] = useState("");

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false, apiCaching: true, securityShield: true, backupInterval: 'Daily',
  });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false, title: '', message: '', onConfirm: null, confirmText: 'Confirm', cancelText: 'Cancel', type: 'danger'
  });

  // AI Training Simulator state
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingLog, setTrainingLog] = useState([]);

  // ── HOOK INTO SPRING BOOT NETWORKS ON MOUNT ──
  useEffect(() => {
    initializeDeeds();
    loadAllDashboardData(); 
  }, []);

  // Sync state filter mutations dynamically
  useEffect(() => {
    fetchAuctionsByFilters();
  }, [auctionFilter, activeTab]);

  const loadAllDashboardData = async () => {
    try {
      setGlobalLoading(true);
      const [statsData, usersData, completeAnalytics, auctionsData] = await Promise.all([
        adminService.getStatsSummary(),
        adminService.getAllUsers(),
        adminService.getComprehensiveDashboard(),
        adminService.getAllAuctions()
      ]);
      
      setLiveStats(statsData || { totalUsers: 0, activeUsers: 0, blockedUsers: 0, pendingUsers: 0, totalProperties: 0, activeAuctions: 0, totalBids: 0 });
      setUsersList(usersData || []);
      setAnalyticsData(completeAnalytics || null);
      setAuctionsList(auctionsData || []);
    } catch (err) {
      console.error("Dashboard fetch error: ", err);
      triggerToast("Failed to fetch dynamic server metrics.");
    } finally {
      setGlobalLoading(false);
    }
  };

  const fetchAuctionsByFilters = async () => {
    try {
      setGlobalLoading(true);
      let data;
      if (auctionFilter === 'ALL') {
        data = await adminService.getAllAuctions();
      } else {
        data = await adminService.getAuctionsByStatus(auctionFilter);
      }
      setAuctionsList(data || []);
    } catch (err) {
      triggerToast("Failed to retrieve filtered auction records.");
    } finally {
      setGlobalLoading(false);
    }
  };

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  // Compute pending items count cleanly from our reactive arrays
  const pendingRequestsCount = auctionsList.filter(a => a.status === "PENDING_APPROVAL").length;

  // ── USER MANAGEMENT SIGNATURE PIPES (CONNECTED TO REFACTORED ADMIN CONTROLLER) ──
  const handleToggleUserBan = (user) => {
    const isCurrentlyBlocked = user.status === "BLOCKED" || user.profile === "BLOCKED"; 
    const actionText = isCurrentlyBlocked ? 'Unblock' : 'Block';

    setConfirmModal({
      isOpen: true,
      title: `${actionText} User Account`,
      message: `Are you sure you want to change status parameters for user "${user.name}"? This immediately updates system credentials authorization filters layers.`,
      confirmText: `${actionText} User`,
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
        try {
          if (!isCurrentlyBlocked) {
            await adminService.blockUserAccount(user.id);
            triggerToast(`User Account #${user.id} has been blocked.`);
          } else {
            await adminService.unblockUserAccount(user.id);
            triggerToast(`User Account #${user.id} is now active.`);
          }
          loadAllDashboardData(); 
        } catch (err) {
          triggerToast("Transaction authorization error.");
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  // FIXED: Explicitly calling full master re-sync pipeline to push changes immediately to column indices
  const handleManualUserApproval = async (userId) => {
    try {
      setGlobalLoading(true);
      await adminService.approveUserAccount(userId);
      triggerToast("✅ User verification complete. Account state synchronization finalized.");
      await loadAllDashboardData(); // Force master database re-query mapping execution
    } catch (err) {
      console.error("Verification error:", err);
      triggerToast("Approval transaction failure occurred.");
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleHardDeleteUser = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hard System Account Purge',
      message: 'Are you sure you want to permanently erase this user registry map from the master database? This removes all active session tokens and cannot be reversed.',
      confirmText: 'Purge Account',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
        try {
          await adminService.deleteUserAccount(id); // Connected to endpoint: DELETE /api/admin/users/{id}
          triggerToast("User credentials completely purged.");
          loadAllDashboardData();
        } catch (err) {
          triggerToast("Purge command aborted by server context mapping constraint.");
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const toggleUserRole = async (id) => {
    triggerToast("Updating account authorization layer flags.");
  };

  const toggleUserStatus = async (id) => {
    triggerToast("Altering workspace parameters access state.");
  };

  // ── AUCTION MANAGEMENT SIGNATURE PIPES (MAPPED TO ADMIN CONTROLLER) ──
  const handleApproveAuction = async (id) => {
    try {
      setGlobalLoading(true);
      await adminService.approveAuction(id); 
      triggerToast(`Auction #${id} approved successfully!`);
      loadAllDashboardData();
    } catch (err) {
      triggerToast("Failed to complete approval process.");
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleRejectAuction = async (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Reject Auction Request',
      message: `Are you sure you want to reject this request? The user can request again after 24 hours.`,
      confirmText: 'Reject Auction',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
        try {
          await adminService.rejectAuction(id); 
          triggerToast(`Auction Listing #${id} rejected.`);
          loadAllDashboardData();
        } catch (err) {
          triggerToast("Transaction error modifying state variables.");
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handlePublishAuction = async (id) => {
    try {
      setGlobalLoading(true);
      await adminService.publishAuction(id); 
      triggerToast(`Auction #${id} is now live for public bidding!`);
      loadAllDashboardData();
    } catch (err) {
      triggerToast("Failed to launch auction listing.");
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleForceFinalizeAuction = async (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Force Finalize Auction Settlement',
      message: `Warning: This triggers an administrative command override to close bidding operations for Auction #${id} instantly. Proceed?`,
      confirmText: 'Force Settlement',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
        try {
          await adminService.finalizeAuction(id); 
          triggerToast(`Settlement routines run on Auction #${id}.`);
          loadAllDashboardData();
        } catch (err) {
          triggerToast("Failed to execute manual settlement override.");
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleHardDeleteAuction = async (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hard System Deletion',
      message: `Are you sure you want to permanently cancel and purge Auction #${id}? This action cannot be reversed.`,
      confirmText: 'Hard Delete Record',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
        try {
          await adminService.deleteAuction(id); 
          triggerToast(`Auction profile #${id} safely purged from backend.`);
          loadAllDashboardData();
        } catch (err) {
          triggerToast("Purge command execution dropped.");
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  // Stats Display Framework Matrix Mapping
  const stats = [
    { title: 'Total Registered Users', value: liveStats.totalUsers, change: `Pending: ${liveStats.pendingUsers}`, icon: Users, color: 'bg-green-500/20 text-green-400 border-green-500/30' },
    { title: 'Total Properties Listed', value: liveStats.totalProperties, change: 'Live Assets', icon: Building2, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { title: 'Live System Bids', value: liveStats.totalBids, change: `Active Auctions: ${liveStats.activeAuctions}`, icon: BrainCircuit, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    { title: 'Pending Queue Requests', value: pendingRequestsCount, change: 'Requires Attention', icon: Clock, color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', alert: pendingRequestsCount > 0 },
  ];

  const approveTrustDeed = (deedId) => {
    const deed = trustDeeds.find(d => d.id === deedId);
    if (!deed) return;
    const timeNow = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const createdDeed = createDeed({
      propertyId: deed.propertyId, title: "5 Marla House", location: "Islamabad", price: "1.8 Crore",
      buyerName: deed.owner, registryOffice: deed.registryOffice
    });

    setTrustDeeds(prev => prev.map(d => d.id === deedId ? { ...d, status: 'Verified', verifiedAt: timeNow, qrCode: createdDeed.deedId } : d));
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
    triggerToast("TrustDeed securely sealed with QR Keyring.");
  };

  const startTraining = () => {
    if (isTraining) return;
    setIsTraining(true);
    setTrainingProgress(0);
    setTrainingLog(['[INFO] Fetching real estate transaction datasets...', '[INFO] Standardizing property data vectors...']);
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setTrainingProgress(currentProgress);
      if (currentProgress === 30) setTrainingLog(prev => [...prev, '[BATCH] Training weights on location variables... Loss: 0.124']);
      if (currentProgress === 60) setTrainingLog(prev => [...prev, '[BATCH] Training neural network layers... Accuracy: 93.8%']);
      if (currentProgress === 100) {
        clearInterval(interval);
        setIsTraining(false);
        setTrainingLog(prev => [...prev, '[SUCCESS] Model optimized successfully across system registries!']);
        setModelSettings(prev => ({ ...prev, activeModel: 'PropPredict-v2.5-Neural' }));
      }
    }, 200);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#090d16] text-slate-100 font-sans overflow-hidden">
      
      {/* FLOATING TOAST NOTIFICATION CONTAINER */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 border border-slate-800 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <p className="text-xs font-semibold">{toastMsg}</p>
        </div>
      )}

      {/* ================= SIDEBAR ================= */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-30
        ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-20'} 
        bg-[#0b1220] transition-all duration-300 flex flex-col border-r border-slate-800 shrink-0
      `}>
        <div className="p-4 flex items-center justify-between h-20 border-b border-slate-800">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
              <img
                src="/favicon-icon.png"
                alt="NextProperty Icon"
                className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex flex-col leading-none gap-[3px] text-left">
                <span className="text-[15px] font-black tracking-tight text-white">
                  Next<span className="text-[#1D4ED8]">Property</span>
                </span>
                <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Admin Control
                </span>
              </div>
            </div>
          ) : (
            <img
              src="/favicon-icon.png"
              alt="NP"
              className="w-8 h-8 mx-auto object-contain cursor-pointer"
              onClick={() => navigate('/')}
            />
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg cursor-pointer transition focus:ring-2 focus:ring-blue-500/25 focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-1.5 px-3">
            <SidebarItem icon={LayoutDashboard} text="Overview" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} isOpen={isSidebarOpen} />
            <SidebarItem icon={Users} text="User Management" active={activeTab === 'Users'} onClick={() => setActiveTab('Users')} isOpen={isSidebarOpen} />
            <SidebarItem icon={Building2} text="Property Auctions" active={activeTab === 'Auctions'} onClick={() => setActiveTab('Auctions')} isOpen={isSidebarOpen} />
            <SidebarItem icon={BrainCircuit} text="PropPredict AI" active={activeTab === 'AI'} onClick={() => setActiveTab('AI')} isOpen={isSidebarOpen} />
            <SidebarItem icon={QrCode} text="TrustDeed Requests" active={activeTab === 'TrustDeed'} onClick={() => setActiveTab('TrustDeed')} isOpen={isSidebarOpen} />
            <SidebarItem icon={Settings} text="System Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} isOpen={isSidebarOpen} />
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center w-full p-2.5 text-red-400 hover:text-red-300 hover:bg-[#ff4d4d]/10 rounded-xl transition-all cursor-pointer font-semibold text-sm">
            <LogOut size={18} />
            {isSidebarOpen && <span className="ml-3">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 overflow-y-auto bg-[#090d16] p-6 lg:p-8 relative">
        {globalLoading && <div className="absolute top-4 left-1/2 bg-blue-600 text-white text-xs px-4 py-1.5 rounded-full z-50 animate-bounce">Syncing Server Logs...</div>}
        
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#142035] relative z-10">
          <div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              {activeTab === 'Auctions' ? 'Property Auctions' : activeTab}
            </h2>
            <p className="text-slate-400 text-xs mt-1">PropSight AI ERP Administration Dashboard Panel.</p>
          </div>
          <div className="flex items-center gap-3.5">
            <button 
              onClick={loadAllDashboardData} 
              className="flex items-center gap-2 px-3 py-1.5 bg-[#121c2e] hover:bg-[#1b2b47] rounded-xl text-xs font-semibold border border-[#1e2d4a] transition"
              title="Force Database Sync"
            >
              <RefreshCw size={12} className={globalLoading ? "animate-spin text-blue-400" : "text-slate-400"} /> Sync Data
            </button>
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-bold border border-emerald-500/25">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" /> Live Node Online
            </div>
          </div>
        </header>

        {/* ================= TAB: OVERVIEW ================= */}
        {activeTab === 'Overview' && (
          <div className="space-y-8 animate-in fade-in duration-300 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <div key={idx} className={`bg-[#0e1626]/80 backdrop-blur-md p-6 rounded-2xl border flex flex-col justify-between shadow-xl transition ${stat.alert ? 'border-orange-500/40 bg-orange-950/10' : 'border-[#1e2d4a]/50'}`}>
                  <div className="flex justify-between items-start">
                    <div className="text-left">
                      <p className="text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                        <span>{stat.title}</span>
                        {stat.alert && <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />}
                      </p>
                      <h3 className="text-3xl font-black mt-2 text-white tracking-tight tabular-nums">{stat.value}</h3>
                    </div>
                    <div className={`p-3 rounded-xl border ${stat.color}`}>
                      <stat.icon size={20} />
                    </div>
                  </div>
                  <div className="mt-4 text-[10px] text-slate-400 font-bold">{stat.change}</div>
                </div>
              ))}
            </div>

            {/* Middle Split Grid View */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Analytics Live Performance Table */}
              <div className="lg:col-span-2 bg-[#0e1626]/80 backdrop-blur-md rounded-2xl border border-[#1e2d4a]/50 p-6 shadow-xl">
                <h3 className="text-sm font-bold text-white mb-4">Live Traffic Matrix / System Catalog</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-800">
                        <th className="pb-3">Property Asset Context</th>
                        <th className="pb-3">Calculated Spread</th>
                        <th className="pb-3">Workflow State</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {(analyticsData?.most_viewed_properties || auctionsList.slice(0, 5)).map((p, i) => (
                        <tr key={i} className="text-slate-350">
                          <td className="py-3 font-semibold text-slate-200">{p.title || p.propertyTitle || `Asset Reference #${p.id}`}</td>
                          <td className="py-3 font-mono text-blue-400">
                            PKR {(p.reservePrice || p.price || p.startingPrice || 0).toLocaleString()}
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.status === 'PENDING_APPROVAL' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'}`}>
                              {p.status || "ACTIVE"}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {(!analyticsData?.most_viewed_properties && auctionsList.length === 0) && (
                        <tr>
                          <td colSpan="3" className="text-center py-6 text-slate-500 text-xs">No global auction profiles found in database.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500">Page {opsPage} of {totalOpsPages || 1}</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setOpsPage(prev => Math.max(prev - 1, 1))}
                      disabled={opsPage === 1}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg disabled:opacity-50 text-slate-400 hover:bg-slate-800 transition cursor-pointer"
                    >
                      Prev
                    </button>
                    <button 
                      onClick={() => setOpsPage(prev => Math.min(prev + 1, totalOpsPages))}
                      disabled={opsPage >= totalOpsPages}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg disabled:opacity-50 text-slate-400 hover:bg-slate-800 transition cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Config Drawer Display */}
              <div className="bg-[#0e1626]/80 backdrop-blur-md rounded-2xl border border-[#1e2d4a]/50 p-6 shadow-xl">
                <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                  <BrainCircuit size={16} className="text-purple-400" /> System State
                </h3>
                <div className="space-y-4 mt-4">
                  <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl flex justify-between items-center text-xs">
                    <span>API Caching Status</span>
                    <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">Active</span>
                  </div>
                  <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl flex justify-between items-center text-xs">
                    <span>CyberShield Shield</span>
                    <span className="text-indigo-400 font-bold uppercase tracking-wider text-[10px]">Encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: USER MANAGEMENT ================= */}
        {activeTab === 'Users' && (
          <div className="bg-[#0e1626]/80 backdrop-blur-md rounded-2xl border border-[#1e2d4a]/50 overflow-hidden shadow-xl animate-in fade-in duration-300">
            <div className="p-6 border-b border-[#1e2d4a]/40 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111c30]/30">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input
                  type="text" placeholder="Search operational users..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full bg-[#121c2e] border border-[#1e2d4a]/50 pl-10 pr-4 py-2.5 rounded-xl text-xs outline-none focus:border-blue-500 text-slate-200"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-350">
                <thead className="bg-[#121c2e]/40 text-slate-400 font-bold text-xs uppercase tracking-wider border-b border-[#1e2d4a]/40">
                  <tr>
                    <th className="px-6 py-4">User Name</th>
                    <th className="px-6 py-4">Contact Phone</th>
                    <th className="px-6 py-4">Address Parameters</th>
                    <th className="px-6 py-4 text-right">Account Verification Commands</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {usersList
                    .filter(u => u.name?.toLowerCase().includes(userSearch.toLowerCase()) || u.email?.toLowerCase().includes(userSearch.toLowerCase()))
                    // SECURITY GUARDRAIL: Automatically hide current logged-in root admin from selection lists
                    .filter(u => u.email !== currentUser?.email)
                    .map((item) => {
                      const isCurrentlyBlocked = item.status === "BLOCKED" || item.profile === "BLOCKED";
                      return (
                        <tr key={item.id} className="hover:bg-[#121b2b]/30 transition border-b border-[#18263f]/30">
                          <td className="px-6 py-4.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20 font-extrabold flex items-center justify-center text-xs">
                                {item.name?.charAt(0) || "U"}
                              </div>
                              <div>
                                <p className="font-bold text-white text-sm">{item.name}</p>
                                <p className="text-[10px] text-slate-500 font-semibold">{item.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4.5 text-xs font-mono font-semibold text-slate-400">{item.phone || 'N/A'}</td>
                          <td className="px-6 py-4.5 text-xs text-slate-300 max-w-xs truncate">{item.address || 'Faisalabad Regional Registry'}</td>
                          <td className="px-6 py-4.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setViewingUserActivity(item)}
                                className="px-2.5 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                              >
                                <Activity size={10} /> Log
                              </button>
                              <button
                                onClick={() => handleManualUserApproval(item.id)}
                                className="px-2.5 py-1.5 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                              >
                                Verify
                              </button>
                              <button
                                onClick={() => handleToggleUserBan(item)}
                                className={`px-2.5 py-1.5 rounded-lg border font-bold text-[10px] transition cursor-pointer flex items-center gap-1 ${
                                  isCurrentlyBlocked 
                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-600 hover:text-white' 
                                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-600 hover:text-white'
                                }`}
                              >
                                <UserX size={12} /> {isCurrentlyBlocked ? "Unblock" : "Block"}
                              </button>
                              <button
                                onClick={() => handleHardDeleteUser(item.id)}
                                className="p-1.5 rounded-lg border bg-red-500/10 text-red-400 border-red-500/25 hover:bg-red-600 hover:text-white transition cursor-pointer"
                                title="Purge Profile"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  {usersList.filter(u => u.email !== currentUser?.email).length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-slate-500 text-xs">No user profiles registered in database.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Users Stacked Cards - Shown on Mobile */}
            <div className="md:hidden divide-y divide-slate-800/40 p-4 space-y-4">
              {usersList
                .filter(u => u.name?.toLowerCase().includes(userSearch.toLowerCase()) || u.email?.toLowerCase().includes(userSearch.toLowerCase()))
                .filter(u => u.email !== currentUser?.email)
                .map((item) => {
                  const isCurrentlyBlocked = item.status === "BLOCKED" || item.profile === "BLOCKED";
                  return (
                    <div key={item.id} className="p-4 bg-[#111c30]/40 border border-slate-800 rounded-xl space-y-3.5 text-xs text-left">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-white text-sm">{item.name}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border ${
                          isCurrentlyBlocked ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {item.status || (isCurrentlyBlocked ? "BLOCKED" : "ACTIVE")}
                        </span>
                      </div>
                      <div className="space-y-1 text-slate-400">
                        <p>Email: <span className="text-white font-bold">{item.email}</span></p>
                        <p>Phone: <span className="text-white font-mono font-bold">{item.phone || 'N/A'}</span></p>
                      </div>
                      <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
                        <button
                          onClick={() => setViewingUserActivity(item)}
                          className="px-3 py-2 bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition flex items-center gap-1 min-h-[44px]"
                        >
                          <Activity size={12} /> Log
                        </button>
                        <button
                          onClick={() => handleToggleUserBan(item)}
                          className={`px-3 py-2 rounded-lg border transition min-h-[44px] flex items-center font-bold text-xs ${
                            isCurrentlyBlocked 
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-600' 
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-600'
                          }`}
                        >
                          {isCurrentlyBlocked ? 'Unblock' : 'Block'}
                        </button>
                        <button
                          onClick={() => handleHardDeleteUser(item.id)}
                          className="px-3 py-2 rounded-lg border bg-red-500/10 text-red-400 border-red-500/25 hover:bg-red-600 hover:text-white transition font-bold text-xs flex items-center min-h-[44px]"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ================= TAB: PROPERTIES / SYSTEM AUCTIONS ================= */}
        {activeTab === 'Auctions' && (
          <div className="bg-[#0e1626]/80 backdrop-blur-md rounded-2xl border border-[#1e2d4a]/50 overflow-hidden shadow-xl animate-in fade-in duration-300">
            <div className="p-6 border-b border-[#1e2d4a]/40 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111c30]/30">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input
                  type="text" placeholder="Search system auctions..." value={auctionSearch} onChange={(e) => setAuctionSearch(e.target.value)}
                  className="w-full bg-[#121c2e] border border-[#1e2d4a]/50 pl-10 pr-4 py-2.5 rounded-xl text-xs outline-none text-slate-200"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-slate-400" />
                <select
                  value={auctionFilter}
                  onChange={(e) => setAuctionFilter(e.target.value)}
                  className="bg-[#121c2e] border border-[#1e2d4a]/50 text-slate-200 text-xs rounded-xl px-3 py-2 cursor-pointer outline-none focus:border-blue-500"
                >
                  <option value="ALL">All States</option>
                  <option value="PENDING_APPROVAL">Pending Approval</option>
                  <option value="APPROVED">Approved</option>
                  <option value="ACTIVE">Active (Live)</option>
                  <option value="CONCLUDED">Concluded</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-350">
                <thead className="bg-[#121c2e]/40 text-slate-400 font-bold text-xs uppercase tracking-wider border-b border-[#1e2d4a]/40">
                  <tr>
                    <th className="px-6 py-4">Auction Ref</th>
                    <th className="px-6 py-4">Assigned Location</th>
                    <th className="px-6 py-4">Reserves/Pricing</th>
                    <th className="px-6 py-4">Workflow Status</th>
                    <th className="px-6 py-4 text-right">Administration Pipeline Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#18263f]">
                  {auctionsList
                    .filter(a => {
                      const term = auctionSearch.toLowerCase();
                      const titleStr = a.title || a.propertyTitle || `Auction Profile #${a.id}`;
                      return titleStr.toLowerCase().includes(term) || a.location?.toLowerCase().includes(term);
                    })
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-[#121b2b]/40 transition">
                        <td className="px-6 py-4.5 font-bold text-white text-sm">
                          <div>
                            <p>{item.title || item.propertyTitle || `Auction Profile #${item.id}`}</p>
                            <p className="text-[10px] text-slate-500 font-normal">Owner ID Ref: {item.ownerId || 'System'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4.5 text-xs text-slate-400">{item.location || 'Faisalabad Regional'}</td>
                        <td className="px-6 py-4.5 text-sm font-extrabold text-blue-400">
                          PKR {(item.reservePrice || item.startingPrice || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === 'PENDING_APPROVAL' ? 'bg-amber-500/10 text-amber-400' :
                            item.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' :
                            item.status === 'CONCLUDED' ? 'bg-blue-500/10 text-blue-400' :
                            item.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-400' :
                            'bg-slate-500/10 text-slate-400'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {item.status === 'PENDING_APPROVAL' && (
                              <>
                                <button 
                                  onClick={() => handleApproveAuction(item.id)} 
                                  className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                                >
                                  <Check size={12} /> Approve
                                </button>
                                <button 
                                  onClick={() => handleRejectAuction(item.id)} 
                                  className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                                >
                                  <Ban size={12} /> Reject
                                </button>
                              </>
                            )}

                            {item.status === 'APPROVED' && (
                              <button 
                                onClick={() => handlePublishAuction(item.id)} 
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                              >
                                <Play size={12} /> Launch Live
                              </button>
                            )}

                            {item.status === 'ACTIVE' && (
                              <button 
                                onClick={() => handleForceFinalizeAuction(item.id)} 
                                className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                              >
                                <ShieldCheck size={12} /> Force Finalize
                              </button>
                            )}

                            <button 
                              onClick={() => handleHardDeleteAuction(item.id)} 
                              className="p-1.5 rounded-lg border bg-rose-500/10 text-rose-400 border-rose-500/25 hover:bg-rose-500/20 transition cursor-pointer"
                              title="Hard System Purge"
                            >
                              <ShieldX size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  {auctionsList.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-slate-500 text-xs">No administrative auctions match state or criteria parameters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB: PROPREDICT AI CONFIG ================= */}
        {activeTab === 'AI' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in">
            <div className="lg:col-span-2 bg-[#0e1626]/80 p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
              <h3 className="text-sm font-bold flex items-center gap-2 text-white border-b border-slate-800 pb-3">
                <Sliders size={18} className="text-blue-400" /> Neural Network Configuration Framework
              </h3>
              <div className="space-y-4">
                {Object.entries(modelSettings.featureWeights).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between text-[11px] mb-1 font-semibold text-slate-400">
                      <span className="capitalize">{key} Factor Offset</span>
                      <span className="text-blue-400 font-bold">{value}%</span>
                    </div>
                    <input
                      type="range" min="0" max="100" value={value}
                      onChange={(e) => setModelSettings({ ...modelSettings, featureWeights: { ...modelSettings.featureWeights, [key]: parseInt(e.target.value) } })}
                      className="w-full accent-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0e1626]/80 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
              <h3 className="text-sm font-bold border-b border-slate-800 pb-3 mb-4"><Sparkles size={16} className="inline mr-1 text-purple-400" /> Live Compiler Shell</h3>
              <div className="bg-black/80 font-mono text-[10px] p-4 rounded-xl text-emerald-400 flex-1 min-h-[180px] overflow-y-auto space-y-2">
                {trainingLog.map((log, idx) => <div key={idx}>{log}</div>)}
                {isTraining && <div className="text-blue-400 animate-pulse">Running compilation layer weights ({trainingProgress}%)...</div>}
              </div>
              <button onClick={startTraining} disabled={isTraining} className="w-full mt-4 bg-indigo-600 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-indigo-500 transition cursor-pointer">Optimize Engine Node</button>
            </div>
          </div>
        )}

        {/* ================= TAB: TRUSTDEED VERIFICATION ================= */}
        {activeTab === 'TrustDeed' && (
          <div className="bg-[#0e1626]/80 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-800 bg-[#111c30]/20">
              <h3 className="text-sm font-bold text-white flex items-center gap-2"><QrCode size={18} className="text-orange-400" /> TrustDeed Certification Vault</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-400">
                <thead className="bg-[#121c2e]/40 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Owner Name</th>
                    <th className="p-4">Registry Office Document Reference</th>
                    <th className="p-4 text-center">Trust Verification Action</th>
                  </tr>
                </thead>
                <tbody>
                  {trustDeeds.map((item) => (
                    <tr key={item.id} className="border-b border-slate-900 text-slate-300">
                      <td className="p-4 font-bold text-white">{item.owner}</td>
                      <td className="p-4 font-mono">{item.documentId} • {item.registryOffice}</td>
                      <td className="p-4 text-center">
                        {item.status === 'Pending' ? (
                          <button onClick={() => approveTrustDeed(item.id)} className="bg-orange-600 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg hover:bg-orange-500 transition cursor-pointer">Seal Asset Title</button>
                        ) : (
                          <span className="text-emerald-400 font-bold font-mono">SEALED: {item.qrCode}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB: SYSTEM CONFIGS ================= */}
        {activeTab === 'Settings' && (
          <div className="bg-[#0e1626]/80 border border-slate-800 rounded-2xl p-6 shadow-xl max-w-2xl space-y-6">
            <h3 className="text-sm font-bold border-b border-slate-800 pb-3 flex items-center gap-2"><Database size={18} className="text-blue-400" /> Database Cache Configurations</h3>
            <div className="flex items-center justify-between p-4 bg-slate-950/30 border border-slate-900 rounded-xl">
              <div>
                <h4 className="text-xs font-bold text-white">Dynamic API Compression</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Caches predictive valuation structures on proxy servers to boost UI execution speed.</p>
              </div>
              <button onClick={() => setSystemSettings({ ...systemSettings, apiCaching: !systemSettings.apiCaching })} className={`w-10 h-5 rounded-full p-0.5 flex items-center transition-colors ${systemSettings.apiCaching ? 'bg-blue-600 justify-end' : 'bg-slate-800 justify-start'}`}><span className="w-4 h-4 bg-white rounded-full shadow cursor-pointer" /></button>
            </div>
          </div>
        )}
      </main>

      {/* ── USER REAL-TIME SYSTEM AUDIT TRAIL LOG DRAWER ── */}
      {viewingUserActivity && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setViewingUserActivity(null)} />
          <div className="relative w-full max-w-md h-full bg-[#0e1626] border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
            <div>
              <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">User Session Audit Trails</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Real-time parameters tracking for {viewingUserActivity.name}</p>
                </div>
                <button onClick={() => setViewingUserActivity(null)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"><X size={16} /></button>
              </div>

              <div className="space-y-3 mt-6">
                <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-850 text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Assigned Context Email</span>
                  <span className="text-white font-semibold">{viewingUserActivity.email}</span>
                </div>
                <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-850 text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Authorization Privilege Role</span>
                  <span className="text-purple-400 font-bold">{viewingUserActivity.role || viewingUserActivity.userType || "USER"}</span>
                </div>
                <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-850 text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Account Insertion Date</span>
                  <span className="text-slate-200 font-mono font-bold">
                    {viewingUserActivity.createdAt ? new Date(viewingUserActivity.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-850 text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Last Timestamp Login</span>
                  <span className="text-blue-400 font-mono font-bold">
                    {viewingUserActivity.lastLogin ? new Date(viewingUserActivity.lastLogin).toLocaleString() : 'Never Logged In'}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={() => setViewingUserActivity(null)} className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition">Close Trail View</button>
          </div>
        </div>
      )}

      {/* Confirmation Backdrop Dialog Frame */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setConfirmModal(p => ({ ...p, isOpen: false }))} />
          <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-6 max-w-sm w-full relative z-10 space-y-4 shadow-2xl">
            <h3 className="font-bold text-sm text-white">{confirmModal.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{confirmModal.message}</p>
            <div className="flex justify-end gap-2 border-t border-slate-800 pt-3">
              <button onClick={() => setConfirmModal(p => ({ ...p, isOpen: false }))} className="px-3 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-850 rounded-xl border border-slate-800 text-slate-400 cursor-pointer">Cancel</button>
              <button onClick={confirmModal.onConfirm} className="px-3 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl cursor-pointer">Confirm Command</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SidebarItem = ({ icon: Icon, text, active, onClick, isOpen }) => (
  <li onClick={onClick} className={`flex items-center cursor-pointer px-4 py-3 rounded-xl transition-all duration-300 mb-1.5 font-bold text-sm tracking-wide relative group ${active ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/15' : 'text-slate-400 hover:bg-[#152037] hover:text-slate-200 border border-transparent'}`}>
    <Icon size={18} className={`min-w-[18px] shrink-0 ${active ? 'scale-105' : 'text-slate-500 group-hover:text-blue-400'}`} />
    <span className={`ml-3.5 transition-all duration-300 font-semibold ${!isOpen ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>{text}</span>
  </li>
);

export default AdminDashboard;