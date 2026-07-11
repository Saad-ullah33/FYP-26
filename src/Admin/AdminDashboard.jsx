import React, { useState, useEffect } from 'react';
import { getQRUrls, createDeed, initializeDeeds } from '../utils/deedService';
import { adminService } from '../utils/adminService';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, ExternalLink, LayoutDashboard, Building2, Users, BrainCircuit, QrCode, Settings, LogOut, Menu, X, TrendingUp, AlertCircle, Search, Filter, Check, Sliders, ShieldCheck, UserCheck, UserX, Save, RefreshCw, ChevronRight, Sparkles, Database, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  // Dashboard Core Navigation States
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [globalLoading, setGlobalLoading] = useState(false);

  // Search and Filter States
  const [userSearch, setUserSearch] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('All');
  const [propertySearch, setPropertySearch] = useState('');

  // ── LIVE BACKEND DATA STATES ──
  const [liveStats, setLiveStats] = useState({
    totalUsers: 0, activeUsers: 0, blockedUsers: 0, pendingUsers: 0,
    totalProperties: 0, activeAuctions: 0, totalBids: 0
  });
  const [usersList, setUsersList] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);

  // Static Fallback Lists for Non-Analytics Modules
  const [propertiesList, setPropertiesList] = useState([
    { id: 101, title: '5 Marla Modern House', location: 'Giga Mall, Islamabad', price: '1.8 Crore', owner: 'Ali Khan', date: '2026-06-25', status: 'Pending', type: 'HOUSE' },
    { id: 102, title: 'Luxury 3 Bed Apartment', location: 'Gulberg III, Lahore', price: '2.5 Crore', owner: 'Sarah Ahmed', date: '2026-06-24', status: 'Approved', type: 'APARTMENT' }
  ]);
  const [trustDeeds, setTrustDeeds] = useState([
    { id: 201, propertyId: 101, owner: 'Ali Khan', documentId: 'TD-9921-PB', registryOffice: 'Faisalabad West', status: 'Pending', uploadDate: '2026-06-26', verifiedAt: null }
  ]);

  const [qrModal, setQrModal] = useState({ isOpen: false, deedId: '', urls: {} });
  const [toastMsg, setToastMsg] = useState("");

  const [modelSettings, setModelSettings] = useState({
    learningRate: 0.001, epochs: 150, batchSize: 32, activeModel: 'PropPredict-v2.4-Neural', autoTrain: true,
    featureWeights: { location: 40, size: 30, age: 15, condition: 15 }
  });

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
    fetchInitialDashboardData();
  }, []);

  const fetchInitialDashboardData = async () => {
    try {
      setGlobalLoading(true);
      const [statsData, usersData, completeAnalytics] = await Promise.all([
        adminService.getStatsSummary(),
        adminService.getAllUsers(),
        adminService.getComprehensiveDashboard()
      ]);
      
      setLiveStats(statsData);
      setUsersList(usersData);
      setAnalyticsData(completeAnalytics);
    } catch (err) {
      triggerToast("Failed to fetch dynamic server metrics.");
    } finally {
      setGlobalLoading(false);
    }
  };

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  // ── RE-WIRED ADMINISTRATIVE TRANSACTION PIPES ──
  const handleToggleUserBan = (user) => {
    const isCurrentlyActive = user.profile !== "BLOCKED"; // Mapping your profile text string to status limits
    const actionText = isCurrentlyActive ? 'Block' : 'Unblock';

    setConfirmModal({
      isOpen: true,
      title: `${actionText} User Account`,
      message: `Are you sure you want to change status parameters for user "${user.name}"?`,
      confirmText: `${actionText} User`,
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
        try {
          if (isCurrentlyActive) {
            await adminService.blockUserAccount(user.id);
            triggerToast(`User Account #${user.id} has been blocked.`);
          } else {
            await adminService.unblockUserAccount(user.id);
            triggerToast(`User Account #${user.id} is now active.`);
          }
          fetchInitialDashboardData(); // Fresh reload
        } catch (err) {
          triggerToast("Transaction authorization error.");
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleManualUserApproval = async (userId) => {
    try {
      await adminService.approveUserAccount(userId);
      triggerToast("User credentials marked as verified.");
      fetchInitialDashboardData();
    } catch (err) {
      triggerToast("Approval transaction failed.");
    }
  };

  // Stats Display Framework Matrix Mapping
  const stats = [
    { title: 'Total Registered Users', value: liveStats.totalUsers, change: `Pending: ${liveStats.pendingUsers}`, icon: Users, color: 'bg-green-500/20 text-green-400 border-green-500/30' },
    { title: 'Total Properties Listed', value: liveStats.totalProperties, change: 'Live Assets', icon: Building2, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { title: 'Live System Bids', value: liveStats.totalBids, change: `Active Auctions: ${liveStats.activeAuctions}`, icon: BrainCircuit, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    { title: 'System Engine Accuracy', value: '95.1%', change: 'PropPredict Core', icon: QrCode, color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  ];

  const updatePropertyStatus = (propertyId, newStatus) => {
    setPropertiesList(prev => prev.map(p => p.id === propertyId ? { ...p, status: newStatus } : p));
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
    triggerToast(`Property status updated to ${newStatus}`);
  };

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
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#0e1626] transition-all duration-300 flex flex-col border-r border-[#1e2d4a]`}>
        <div className="p-4 flex items-center justify-between h-20 border-b border-[#1e2d4a]">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">PS</span>
              <h1 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 tracking-wider">
                PropSight<span className="text-white text-xs font-medium ml-0.5">Admin</span>
              </h1>
            </div>
          ) : (
            <span className="w-8 h-8 mx-auto rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">P</span>
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-[#1a263f] text-slate-400 hover:text-white rounded cursor-pointer transition">
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-1.5 px-3">
            <SidebarItem icon={LayoutDashboard} text="Overview" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} isOpen={isSidebarOpen} />
            <SidebarItem icon={Users} text="User Management" active={activeTab === 'Users'} onClick={() => setActiveTab('Users')} isOpen={isSidebarOpen} />
            <SidebarItem icon={Building2} text="Properties" active={activeTab === 'Properties'} onClick={() => setActiveTab('Properties')} isOpen={isSidebarOpen} />
            <SidebarItem icon={BrainCircuit} text="PropPredict AI" active={activeTab === 'AI'} onClick={() => setActiveTab('AI')} isOpen={isSidebarOpen} />
            <SidebarItem icon={QrCode} text="TrustDeed Requests" active={activeTab === 'TrustDeed'} onClick={() => setActiveTab('TrustDeed')} isOpen={isSidebarOpen} />
            <SidebarItem icon={Settings} text="System Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} isOpen={isSidebarOpen} />
          </ul>
        </nav>

        <div className="p-4 border-t border-[#1e2d4a]">
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
              {activeTab}
            </h2>
            <p className="text-slate-400 text-xs mt-1">PropSight AI ERP Administration Dashboard Panel.</p>
          </div>
          <div className="flex items-center gap-3.5">
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
                <div key={idx} className="bg-[#0e1626]/80 backdrop-blur-md p-6 rounded-2xl border border-[#1e2d4a]/50 flex flex-col justify-between shadow-xl">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">{stat.title}</p>
                      <h3 className="text-3xl font-black mt-2 text-white tracking-tight">{stat.value}</h3>
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
                <h3 className="text-sm font-bold text-white mb-4">Live Traffic Matrix (Most Viewed)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-800">
                        <th className="pb-3">Property Asset Context</th>
                        <th className="pb-3">Calculated Spread</th>
                        <th className="pb-3">Traffic Views</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {analyticsData?.most_viewed_properties?.map((p, i) => (
                        <tr key={i} className="text-slate-350">
                          <td className="py-3 font-semibold text-slate-200">{p.title || `Asset ID #${p.id}`}</td>
                          <td className="py-3 font-mono text-blue-400">PKR {p.price?.toLocaleString()}</td>
                          <td className="py-3 font-mono text-emerald-400 font-bold">{p.views || Math.floor(Math.random() * 500 + 50)} Hits</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
        {activeTab === 'Browse Users' || activeTab === 'Users' && (
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
                <tbody className="divide-y divide-[#18263f]/60">
                  {usersList
                    .filter(u => u.name?.toLowerCase().includes(userSearch.toLowerCase()) || u.email?.toLowerCase().includes(userSearch.toLowerCase()))
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-[#121b2b]/30 transition border-b border-[#18263f]/30">
                        <td className="px-6 py-4.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20 font-extrabold flex items-center justify-center text-xs">
                              {item.name?.charAt(0)}
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
                              onClick={() => handleManualUserApproval(item.id)}
                              className="px-2.5 py-1.5 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-lg text-[10px] font-bold transition flex items-center gap-1"
                            >
                              Verify
                            </button>
                            <button
                              onClick={() => handleToggleUserBan(item)}
                              className="p-1.5 rounded-lg border bg-rose-500/10 text-rose-400 border-rose-500/25 hover:bg-rose-500/20 transition cursor-pointer"
                            >
                              <UserX size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB: PROPERTIES ================= */}
        {activeTab === 'Properties' && (
          <div className="bg-[#0e1626]/80 backdrop-blur-md rounded-2xl border border-[#1e2d4a]/50 overflow-hidden shadow-xl animate-in fade-in duration-300">
            <div className="p-6 border-b border-[#1e2d4a]/40 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111c30]/30">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input
                  type="text" placeholder="Search structural profiles..." value={propertySearch} onChange={(e) => setPropertySearch(e.target.value)}
                  className="w-full bg-[#121c2e] border border-[#1e2d4a]/50 pl-10 pr-4 py-2.5 rounded-xl text-xs outline-none text-slate-200"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-350">
                <thead className="bg-[#121c2e]/40 text-slate-400 font-bold text-xs uppercase tracking-wider border-b border-[#1e2d4a]/40">
                  <tr>
                    <th className="px-6 py-4">Property context</th>
                    <th className="px-6 py-4">Location Indices</th>
                    <th className="px-6 py-4">Capital Cost</th>
                    <th className="px-6 py-4">Registry Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#18263f]">
                  {propertiesList.map((item) => (
                    <tr key={item.id} className="hover:bg-[#121b2b]/40 transition">
                      <td className="px-6 py-4.5 font-bold text-white text-sm">{item.title}</td>
                      <td className="px-6 py-4.5 text-xs text-slate-400">{item.location}</td>
                      <td className="px-6 py-4.5 text-sm font-extrabold text-blue-400">{item.price}</td>
                      <td className="px-6 py-4.5">
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold">{item.status}</span>
                      </td>
                      <td className="px-6 py-4.5 text-right">
                        <button onClick={() => updatePropertyStatus(item.id, 'Approved')} className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-bold transition">Approve</button>
                      </td>
                    </tr>
                  ))}
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
              <button onClick={startTraining} disabled={isTraining} className="w-full mt-4 bg-indigo-600 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-indigo-500 transition">Optimize Engine Node</button>
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
                          <button onClick={() => approveTrustDeed(item.id)} className="bg-orange-600 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg hover:bg-orange-500 transition">Seal Asset Title</button>
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
              <button onClick={() => setSystemSettings({ ...systemSettings, apiCaching: !systemSettings.apiCaching })} className={`w-10 h-5 rounded-full p-0.5 flex items-center transition-colors ${systemSettings.apiCaching ? 'bg-blue-600 justify-end' : 'bg-slate-800 justify-start'}`}><span className="w-4 h-4 bg-white rounded-full shadow" /></button>
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Backdrop Dialog Frame */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setConfirmModal(p => ({ ...prev, isOpen: false }))} />
          <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-6 max-w-sm w-full relative z-10 space-y-4">
            <h3 className="font-bold text-sm text-white">{confirmModal.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{confirmModal.message}</p>
            <div className="flex justify-end gap-2 border-t border-slate-800 pt-3">
              <button onClick={() => setConfirmModal(p => ({ ...prev, isOpen: false }))} className="px-3 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-850 rounded-xl border border-slate-800 text-slate-400">Cancel</button>
              <button onClick={confirmModal.onConfirm} className="px-3 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl">Confirm Command</button>
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