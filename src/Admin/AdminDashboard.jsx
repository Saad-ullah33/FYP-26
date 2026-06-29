import React, { useState, useEffect } from 'react';
import { getQRUrls, createDeed, initializeDeeds } from '../utils/deedService';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, ExternalLink } from 'lucide-react';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  BrainCircuit, 
  QrCode, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  TrendingUp,
  AlertCircle,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Sliders,
  ShieldCheck,
  UserCheck,
  UserX,
  FileText,
  Save,
  Check,
  Power,
  ChevronRight,
  Sparkles,
  Database,
  Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  // Search and Filter States
  const [userSearch, setUserSearch] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('All');
  const [propertySearch, setPropertySearch] = useState('');

  // Interactive Mock Data States
  const [usersList, setUsersList] = useState([
    { id: 1, name: 'Ali Khan', email: 'ali.khan@gmail.com', role: 'USER', status: 'Active', joined: '2026-01-15', properties: 4 },
    { id: 2, name: 'Sarah Ahmed', email: 'sarah.ahmed@yahoo.com', role: 'USER', status: 'Active', joined: '2026-02-10', properties: 2 },
    { id: 3, name: 'Bilal Tech', email: 'bilal@proppredict.ai', role: 'ADMIN', status: 'Active', joined: '2025-11-01', properties: 0 },
    { id: 4, name: 'Zainab Bibi', email: 'zainab.b@hotmail.com', role: 'USER', status: 'Suspended', joined: '2026-03-01', properties: 1 },
    { id: 5, name: 'Usman Ghani', email: 'usman.g@outlook.com', role: 'USER', status: 'Active', joined: '2026-04-12', properties: 8 },
  ]);

  const [propertiesList, setPropertiesList] = useState([
    { id: 101, title: '5 Marla Modern House', location: 'Giga Mall, Islamabad', price: '1.8 Crore', owner: 'Ali Khan', date: '2026-06-25', status: 'Pending', type: 'HOUSE' },
    { id: 102, title: 'Luxury 3 Bed Apartment', location: 'Gulberg III, Lahore', price: '2.5 Crore', owner: 'Sarah Ahmed', date: '2026-06-24', status: 'Approved', type: 'APARTMENT' },
    { id: 103, title: 'Commercial Plaza Shop', location: 'Saddar, Rawalpindi', price: '95 Lakhs', owner: 'Usman Ghani', date: '2026-06-22', status: 'Pending', type: 'COMMERCIAL' },
    { id: 104, title: '10 Marla Residential Plot', location: 'DHA Phase 6, Karachi', price: '3.2 Crore', owner: 'Farhan Saeed', date: '2026-06-20', status: 'Rejected', type: 'LAND' },
  ]);

  const [trustDeeds, setTrustDeeds] = useState([
    { id: 201, propertyId: 101, owner: 'Ali Khan', documentId: 'TD-9921-PB', registryOffice: 'Faisalabad West', status: 'Pending', uploadDate: '2026-06-26', verifiedAt: null },
    { id: 202, propertyId: 102, owner: 'Sarah Ahmed', documentId: 'TD-8812-IS', registryOffice: 'Lahore Registry Office', status: 'Verified', uploadDate: '2026-06-25', verifiedAt: '2026-06-26 14:30', qrCode: 'TD-102-8812' },
  ]);

  const [qrModal, setQrModal] = useState({ isOpen: false, deedId: '', urls: {} });

  useEffect(() => {
    initializeDeeds();
  }, []);

  const [modelSettings, setModelSettings] = useState({
    learningRate: 0.001,
    epochs: 150,
    batchSize: 32,
    activeModel: 'PropPredict-v2.4-Neural',
    autoTrain: true,
    featureWeights: { location: 40, size: 30, age: 15, condition: 15 }
  });

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    apiCaching: true,
    securityShield: true,
    backupInterval: 'Daily',
  });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'danger'
  });

  // AI Training Simulator state
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingLog, setTrainingLog] = useState([]);

  // Stats Grid Data
  const stats = [
    { title: 'Total Properties', value: propertiesList.length, change: '+12%', icon: Building2, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { title: 'Active Users', value: usersList.filter(u => u.status === 'Active').length, change: '+5%', icon: Users, color: 'bg-green-500/20 text-green-400 border-green-500/30' },
    { title: 'AI Valuations Run', value: '3,482', change: '+18%', icon: BrainCircuit, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    { title: 'Pending TrustDeeds', value: trustDeeds.filter(d => d.status === 'Pending').length, change: '-4%', icon: QrCode, color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  ];

  const recentActivity = [
    { id: 1, user: 'Ali Khan', action: 'Requested Valuation', target: '5 Marla House, Islamabad', time: '2 mins ago', status: 'Processing' },
    { id: 2, user: 'Sarah Ahmed', action: 'New Property Listing', target: 'Apartment in Lahore', time: '15 mins ago', status: 'Completed' },
    { id: 3, user: 'System', action: 'Deed Verification', target: 'TD-9921-PB Uploaded', time: '1 hour ago', status: 'Pending' },
    { id: 4, user: 'Bilal Tech', action: 'Estimator Weight Update', target: 'Model Weights Configured', time: '3 hours ago', status: 'Completed' },
  ];

  // User Actions
  const toggleUserStatus = (userId) => {
    const user = usersList.find(u => u.id === userId);
    if (!user) return;
    const actionText = user.status === 'Active' ? 'Suspend' : 'Activate';
    
    setConfirmModal({
      isOpen: true,
      title: `${actionText} User Account`,
      message: `Are you sure you want to ${actionText.toLowerCase()} the account for user "${user.name}" (${user.email})?`,
      confirmText: `${actionText} Account`,
      cancelText: 'Cancel',
      type: user.status === 'Active' ? 'danger' : 'info',
      onConfirm: () => {
        setUsersList(prev => prev.map(u => 
          u.id === userId ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u
        ));
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const toggleUserRole = (userId) => {
    const user = usersList.find(u => u.id === userId);
    if (!user) return;
    const nextRole = user.role === 'USER' ? 'ADMIN' : 'USER';
    
    setConfirmModal({
      isOpen: true,
      title: 'Modify User Permissions',
      message: `Are you sure you want to change the role of "${user.name}" to ${nextRole}? This modifies their administrative access.`,
      confirmText: 'Change Role',
      cancelText: 'Cancel',
      type: 'warning',
      onConfirm: () => {
        setUsersList(prev => prev.map(u => 
          u.id === userId ? { ...u, role: u.role === 'USER' ? 'ADMIN' : 'USER' } : u
        ));
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Property Actions
  const updatePropertyStatus = (propertyId, newStatus) => {
    const property = propertiesList.find(p => p.id === propertyId);
    if (!property) return;
    
    setConfirmModal({
      isOpen: true,
      title: `${newStatus === 'Approved' ? 'Approve' : 'Reject'} Listing Request`,
      message: `Are you sure you want to mark "${property.title}" as ${newStatus.toLowerCase()}?`,
      confirmText: `${newStatus} Property`,
      cancelText: 'Cancel',
      type: newStatus === 'Approved' ? 'info' : 'danger',
      onConfirm: () => {
        setPropertiesList(prev => prev.map(p => 
          p.id === propertyId ? { ...p, status: newStatus } : p
        ));
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // TrustDeed Actions
  const approveTrustDeed = (deedId) => {
    const deed = trustDeeds.find(d => d.id === deedId);
    if (!deed) return;
    
    setConfirmModal({
      isOpen: true,
      title: 'Verify & Seal Title Deed',
      message: `Are you sure you want to verify the TrustDeed document "${deed.documentId}" uploaded by ${deed.owner}? This generates a cryptographically signed QR certificate badge.`,
      confirmText: 'Verify & Seal',
      cancelText: 'Cancel',
      type: 'info',
      onConfirm: () => {
        const timeNow = new Date().toISOString().replace('T', ' ').substring(0, 16);
        
        // Register certified deed details in mock database
        const mockDeedData = {
          propertyId: deed.propertyId,
          title: deed.propertyId === 101 ? "5 Marla Modern House" : "Commercial Plaza Shop",
          location: deed.propertyId === 101 ? "Giga Mall, Islamabad" : "Saddar, Rawalpindi",
          price: deed.propertyId === 101 ? "1.8 Crore" : "95 Lakhs",
          buyerName: deed.owner,
          buyerEmail: deed.owner === 'Ali Khan' ? 'ali.khan@gmail.com' : 'usman.g@outlook.com',
          buyerCNIC: deed.owner === 'Ali Khan' ? '37405-1234567-9' : '37405-9988776-5',
          sellerName: deed.propertyId === 101 ? 'Kamran Shah' : 'Zainab Bibi',
          sellerEmail: deed.propertyId === 101 ? 'kamran@gmail.com' : 'zainab.b@hotmail.com',
          sellerCNIC: deed.propertyId === 101 ? '37405-7654321-3' : '37405-2233445-6',
          registryOffice: deed.registryOffice
        };
        const createdDeed = createDeed(mockDeedData);

        setTrustDeeds(prev => prev.map(d => 
          d.id === deedId ? { 
            ...d, 
            status: 'Verified', 
            verifiedAt: timeNow,
            qrCode: createdDeed.deedId
          } : d
        ));
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // AI Training Simulator
  const startTraining = () => {
    if (isTraining) return;
    setIsTraining(true);
    setTrainingProgress(0);
    setTrainingLog(['[INFO] Fetching real estate transaction datasets...', '[INFO] Standardizing property data vectors...']);
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setTrainingProgress(currentProgress);
      
      if (currentProgress === 30) {
        setTrainingLog(prev => [...prev, '[BATCH] Training weights on location variables... Loss: 0.124']);
      } else if (currentProgress === 60) {
        setTrainingLog(prev => [...prev, '[BATCH] Training neural network layers... Accuracy: 93.8%']);
      } else if (currentProgress === 90) {
        setTrainingLog(prev => [...prev, '[EVAL] Calculating validation loss coefficients...']);
      } else if (currentProgress === 100) {
        clearInterval(interval);
        setIsTraining(false);
        setTrainingLog(prev => [...prev, '[SUCCESS] Model trained successfully! Final Accuracy: 95.1%. Model version saved as PropPredict-v2.5-Neural.']);
        setModelSettings(prev => ({ ...prev, activeModel: 'PropPredict-v2.5-Neural' }));
      }
    }, 400);
  };

  const handleLogout = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Sign Out Admin Panel',
      message: 'Are you sure you want to sign out of the PropSight Admin control room?',
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

  return (
    <div className="flex h-screen bg-[#090d16] text-slate-100 font-sans overflow-hidden">
      
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
            
            <div className={`mt-6 mb-2 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider ${!isSidebarOpen && 'hidden'}`}>
              AI & Security Modules
            </div>
            <SidebarItem icon={BrainCircuit} text="PropPredict AI" active={activeTab === 'AI'} onClick={() => setActiveTab('AI')} isOpen={isSidebarOpen} />
            <SidebarItem icon={QrCode} text="TrustDeed Requests" active={activeTab === 'TrustDeed'} onClick={() => setActiveTab('TrustDeed')} isOpen={isSidebarOpen} />
            
            <div className={`mt-6 mb-2 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider ${!isSidebarOpen && 'hidden'}`}>
              Control Room
            </div>
            <SidebarItem icon={Settings} text="System Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} isOpen={isSidebarOpen} />
          </ul>
        </nav>

        {/* User Info Bar */}
        {isSidebarOpen && (
          <div className="p-4 bg-[#0a101d] mx-3 mb-2 rounded-xl border border-[#1b2a47] flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-extrabold text-white">A</div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">Administrator</p>
              <p className="text-[10px] text-blue-400 truncate">admin@propsight.com</p>
            </div>
          </div>
        )}

        <div className="p-4 border-t border-[#1e2d4a]">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full p-2.5 text-red-400 hover:text-red-300 hover:bg-[#ff4d4d]/10 rounded-xl transition-all cursor-pointer font-semibold text-sm"
          >
            <LogOut size={18} />
            {isSidebarOpen && <span className="ml-3">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 overflow-y-auto bg-[#090d16] p-6 lg:p-8 relative">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />
        
        {/* Top Floating Dashboard Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#142035] relative z-10">
          <div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              {activeTab === 'Overview' && <LayoutDashboard className="text-blue-500" />}
              {activeTab === 'Users' && <Users className="text-blue-500" />}
              {activeTab === 'Properties' && <Building2 className="text-blue-500" />}
              {activeTab === 'AI' && <BrainCircuit className="text-blue-500" />}
              {activeTab === 'TrustDeed' && <QrCode className="text-blue-500" />}
              {activeTab === 'Settings' && <Settings className="text-blue-500" />}
              {activeTab}
            </h2>
            <p className="text-slate-400 text-xs mt-1">PropSight AI ERP Administration Dashboard Panel.</p>
          </div>
          
          <div className="flex items-center gap-3.5 self-start sm:self-center">
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-bold border border-emerald-500/25">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              Live Node Online
            </div>
          </div>
        </header>

        {/* ================= TAB: OVERVIEW ================= */}
        {activeTab === 'Overview' && (
          <div className="space-y-8 animate-in fade-in duration-300 relative z-10">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-[#0e1626]/80 backdrop-blur-md p-6 rounded-2xl border border-[#1e2d4a]/50 hover:border-blue-500/30 transition-all duration-300 flex flex-col justify-between shadow-xl hover:-translate-y-0.5 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-slate-800/10 to-transparent rounded-bl-full pointer-events-none" />
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">{stat.title}</p>
                      <h3 className="text-3xl font-black mt-2 text-white tracking-tight">{stat.value}</h3>
                    </div>
                    <div className={`p-3 rounded-xl border ${stat.color} transition-transform duration-300 group-hover:scale-105`}>
                      <stat.icon size={20} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-[10px] text-emerald-400 font-bold">
                    <TrendingUp size={12} className="mr-1" />
                    <span>{stat.change}</span>
                    <span className="text-slate-500 ml-1.5 font-semibold">vs last month</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Content Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Recent Activity Logs */}
              <div className="lg:col-span-2 bg-[#0e1626]/80 backdrop-blur-md rounded-2xl border border-[#1e2d4a]/50 overflow-hidden shadow-xl">
                <div className="p-6 border-b border-[#1e2d4a]/40 flex justify-between items-center bg-[#111c30]/30">
                  <h3 className="text-sm font-bold text-white">Live System Operations</h3>
                  <button className="text-xs text-blue-400 hover:text-blue-300 font-bold transition">Export Logs</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-350">
                    <thead className="bg-[#121c2e]/40 text-slate-400 font-bold text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">User Initiator</th>
                        <th className="px-6 py-4">Operation Description</th>
                        <th className="px-6 py-4">Time Elapsed</th>
                        <th className="px-6 py-4">Execution Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#18263f]/60">
                      {recentActivity.map((item) => (
                        <tr key={item.id} className="hover:bg-[#121b2b]/30 transition border-b border-[#18263f]/30 last:border-0">
                          <td className="px-6 py-4.5 font-bold text-white flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500"></span>
                            {item.user}
                          </td>
                          <td className="px-6 py-4.5">
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-200 text-xs">{item.action}</span>
                              <span className="text-[10px] text-slate-500 mt-0.5 font-semibold">{item.target}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4.5 text-xs text-slate-400">{item.time}</td>
                          <td className="px-6 py-4.5">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold border ${
                              item.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                              item.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                              'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* AI Network Diagnostic Card */}
              <div className="bg-[#0e1626]/80 backdrop-blur-md rounded-2xl border border-[#1e2d4a]/50 p-6 flex flex-col justify-between shadow-xl">
                <div>
                  <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2 border-b border-[#1e2d4a]/40 pb-3">
                    <BrainCircuit size={18} className="text-purple-400"/> 
                    Model Diagnostics
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-[#121c2e]/40 rounded-xl border border-[#1c2e4f]/60">
                      <div className="flex justify-between text-[10px] font-bold mb-1.5">
                        <span className="text-slate-300">PropPredict Model Accuracy</span>
                        <span className="text-emerald-400">95.1%</span>
                      </div>
                      <div className="w-full bg-[#18263f] rounded-full h-1.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-emerald-400 h-1.5 rounded-full" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-[#121c2e]/40 rounded-xl border border-[#1c2e4f]/60">
                      <div className="flex justify-between text-[10px] font-bold mb-1.5">
                        <span className="text-slate-300">AI Processor Load</span>
                        <span className="text-amber-400">42%</span>
                      </div>
                      <div className="w-full bg-[#18263f] rounded-full h-1.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-amber-400 h-1.5 rounded-full" style={{ width: '42%' }}></div>
                      </div>
                    </div>

                    <div className="p-4 bg-rose-500/5 rounded-xl border border-rose-500/10 flex items-start gap-3">
                      <AlertCircle size={18} className="text-rose-400 shrink-0 mt-0.5 animate-pulse" />
                      <div>
                        <h4 className="text-xs font-bold text-rose-400">Security Alert Logged</h4>
                        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Anomalous valuation query block bypassed at DHA Phase 6 node. Checked & cleared.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveTab('AI')}
                  className="w-full mt-6 bg-[#16243d] hover:bg-[#1f3254] text-xs font-bold py-2.5 rounded-xl transition text-blue-450 hover:text-white flex items-center justify-center gap-1 border border-[#21375d] cursor-pointer"
                >
                  Configure AI Settings <ChevronRight size={14} />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ================= TAB: USER MANAGEMENT ================= */}
        {activeTab === 'Users' && (
          <div className="bg-[#0e1626]/80 backdrop-blur-md rounded-2xl border border-[#1e2d4a]/50 overflow-hidden shadow-xl animate-in fade-in duration-300">
            {/* Table Filters */}
            <div className="p-6 border-b border-[#1e2d4a]/40 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111c30]/30">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full bg-[#121c2e] border border-[#1e2d4a]/50 pl-10 pr-4 py-2.5 rounded-xl text-xs outline-none focus:border-blue-500 transition text-slate-200 placeholder:text-slate-500"
                />
              </div>
              <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide bg-[#121c2e] border border-[#1e2d4a]/50 px-4 py-2.5 rounded-xl flex items-center gap-2">
                <Filter size={14} className="text-blue-500" />
                Total Registered Accounts: {usersList.length}
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-350">
                <thead className="bg-[#121c2e]/40 text-slate-400 font-bold text-xs uppercase tracking-wider border-b border-[#1e2d4a]/40">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Registration Date</th>
                    <th className="px-6 py-4">Assigned Role</th>
                    <th className="px-6 py-4">Properties Posted</th>
                    <th className="px-6 py-4">Account Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#18263f]/60">
                  {usersList
                    .filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-[#121b2b]/30 transition border-b border-[#18263f]/30 last:border-0">
                        <td className="px-6 py-4.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20 font-extrabold flex items-center justify-center text-xs">
                              {item.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-white text-sm">{item.name}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5 font-semibold">{item.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4.5 text-xs font-semibold text-slate-400">{item.joined}</td>
                        <td className="px-6 py-4.5 text-xs">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border ${
                            item.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          }`}>
                            {item.role}
                          </span>
                        </td>
                        <td className="px-6 py-4.5 text-xs font-bold text-slate-300">{item.properties} units</td>
                        <td className="px-6 py-4.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border ${
                            item.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-sm shadow-emerald-500/5' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => toggleUserRole(item.id)}
                              title="Toggle User/Admin Role"
                              className="px-2.5 py-1.5 bg-[#16243d] hover:bg-[#203457] border border-[#21375d] text-slate-300 hover:text-white rounded-lg text-[10px] font-extrabold transition cursor-pointer flex items-center gap-1"
                            >
                              <Sliders size={12} className="text-blue-400" />
                              Role
                            </button>
                            <button
                              onClick={() => toggleUserStatus(item.id)}
                              title={item.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                              className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                item.status === 'Active' 
                                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/25 hover:bg-rose-500/20' 
                                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20'
                              }`}
                            >
                              {item.status === 'Active' ? <UserX size={14} /> : <UserCheck size={14} />}
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
            {/* Table Filters */}
            <div className="p-6 border-b border-[#1e2d4a]/40 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111c30]/30">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search properties by title or owner..."
                  value={propertySearch}
                  onChange={(e) => setPropertySearch(e.target.value)}
                  className="w-full bg-[#121c2e] border border-[#1e2d4a]/50 pl-10 pr-4 py-2.5 rounded-xl text-xs outline-none focus:border-blue-500 transition text-slate-200 placeholder:text-slate-500"
                />
              </div>
              <div className="flex items-center gap-1.5 bg-[#121c2e]/65 p-1 rounded-xl border border-[#1e2d4a]/40">
                {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setPropertyFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition border cursor-pointer ${
                      propertyFilter === status 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10' 
                        : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Properties Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-350">
                <thead className="bg-[#121c2e]/40 text-slate-400 font-bold text-xs uppercase tracking-wider border-b border-[#1e2d4a]/40">
                  <tr>
                    <th className="px-6 py-4">Property</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Asking Price</th>
                    <th className="px-6 py-4">Owner Name</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Verification Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#18263f]">
                  {propertiesList
                    .filter(p => propertyFilter === 'All' ? true : p.status === propertyFilter)
                    .filter(p => p.title.toLowerCase().includes(propertySearch.toLowerCase()) || p.owner.toLowerCase().includes(propertySearch.toLowerCase()))
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-[#121b2b]/40 transition">
                        <td className="px-6 py-4.5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700 shrink-0 font-bold text-xs text-blue-400">
                              {item.type.substring(0, 4)}
                            </div>
                            <div>
                              <p className="font-bold text-white text-sm">{item.title}</p>
                              <p className="text-xs text-slate-500 mt-0.5">Submitted: {item.date}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4.5 text-xs text-slate-400 font-medium">{item.location}</td>
                        <td className="px-6 py-4.5 text-sm font-extrabold text-blue-400">{item.price}</td>
                        <td className="px-6 py-4.5 text-xs text-slate-300">{item.owner}</td>
                        <td className="px-6 py-4.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            item.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            item.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4.5 text-right">
                          {item.status === 'Pending' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => updatePropertyStatus(item.id, 'Approved')}
                                className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1"
                              >
                                <Check size={12} />
                                Approve
                              </button>
                              <button
                                onClick={() => updatePropertyStatus(item.id, 'Rejected')}
                                className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1"
                              >
                                <X size={12} />
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-500 italic mr-3">Reviewed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB: PROPREDICT AI ================= */}
        {activeTab === 'AI' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
            
            {/* Core Neural Net Config */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#0e1626]/80 backdrop-blur-md rounded-2xl border border-[#1e2d4a]/50 p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-bl-full pointer-events-none" />
                <h3 className="text-sm font-bold mb-6 text-white border-b border-[#1e2d4a]/40 pb-3 flex items-center gap-2">
                  <Sliders size={18} className="text-blue-400" />
                  Neural Network Hyperparameters
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Learning Rate</label>
                    <select 
                      value={modelSettings.learningRate} 
                      onChange={(e) => setModelSettings({ ...modelSettings, learningRate: parseFloat(e.target.value) })}
                      className="w-full bg-[#121c2e] border border-[#1e2d4a]/55 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-blue-500 transition cursor-pointer"
                    >
                      <option value={0.0001}>0.0001 (Slow / Precise)</option>
                      <option value={0.001}>0.001 (Standard)</option>
                      <option value={0.01}>0.01 (Fast / High Variance)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Training Epochs</label>
                    <input 
                      type="number"
                      value={modelSettings.epochs}
                      onChange={(e) => setModelSettings({ ...modelSettings, epochs: parseInt(e.target.value) })}
                      className="w-full bg-[#121c2e] border border-[#1e2d4a]/55 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-blue-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Batch Size</label>
                    <select 
                      value={modelSettings.batchSize} 
                      onChange={(e) => setModelSettings({ ...modelSettings, batchSize: parseInt(e.target.value) })}
                      className="w-full bg-[#121c2e] border border-[#1e2d4a]/55 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-blue-500 transition cursor-pointer"
                    >
                      <option value={16}>16 Samples</option>
                      <option value={32}>32 Samples</option>
                      <option value={64}>64 Samples</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Active Prediction Model</label>
                    <div className="bg-[#121c2e] border border-[#1e2d4a]/50 rounded-xl px-4 py-2.5 text-xs text-slate-350 font-mono flex items-center justify-between">
                      <span>{modelSettings.activeModel}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-400" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-[#1e2d4a]/40 pt-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Regression Weights for Appraisals</h4>
                  <div className="space-y-4">
                    {Object.entries(modelSettings.featureWeights).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between text-[10px] mb-1 font-semibold">
                          <span className="capitalize text-slate-400">{key} Coefficient weight</span>
                          <span className="text-blue-400 font-bold">{value}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={value}
                          onChange={(e) => {
                            const newWeights = { ...modelSettings.featureWeights, [key]: parseInt(e.target.value) };
                            setModelSettings({ ...modelSettings, featureWeights: newWeights });
                          }}
                          className="w-full accent-blue-500 bg-[#18263f] rounded-lg appearance-none cursor-pointer h-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-500/10">
                    <Save size={14} />
                    Apply Hyperparameter Stack
                  </button>
                </div>
              </div>
            </div>

            {/* Neural Net Training Log Console */}
            <div className="bg-[#0e1626]/80 backdrop-blur-md rounded-2xl border border-[#1e2d4a]/50 p-6 flex flex-col shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/5 to-transparent rounded-bl-full pointer-events-none" />
              <h3 className="text-sm font-bold text-white mb-4 border-b border-[#1e2d4a]/40 pb-3 flex items-center gap-2">
                <Sparkles size={18} className="text-purple-400" />
                Live Model Compiler
              </h3>

              {/* Terminal Window Header Decoration */}
              <div className="flex items-center gap-1.5 bg-[#070b13]/85 px-4 py-2.5 rounded-t-xl border border-[#16233d] border-b-0 shrink-0">
                <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                <span className="text-[9px] text-slate-500 font-bold ml-2 font-mono uppercase tracking-wider">compiler-shell@propsight-node:~</span>
              </div>

              <div className="flex-1 min-h-[220px] bg-[#05080e] border border-[#16233d] rounded-b-xl p-4 font-mono text-[10px] text-emerald-450 overflow-y-auto space-y-2.5 shadow-inner">
                {trainingLog.length === 0 ? (
                  <span className="text-slate-500 italic">Compiler standing by. Click compile model below to start optimization process.</span>
                ) : (
                  trainingLog.map((log, index) => (
                    <div key={index} className="leading-relaxed border-l-2 border-emerald-500/30 pl-2">
                      {log}
                    </div>
                  ))
                )}
                {isTraining && (
                  <div className="flex items-center gap-2 text-blue-400 mt-1 pl-2">
                    <RefreshCw className="animate-spin w-3.5 h-3.5" />
                    <span>Compiling network layers ({trainingProgress}%)...</span>
                  </div>
                )}
              </div>

              {isTraining && (
                <div className="w-full bg-[#18263f] h-2 rounded-full mt-4 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2" style={{ width: `${trainingProgress}%` }}></div>
                </div>
              )}

              <button 
                onClick={startTraining}
                disabled={isTraining}
                className={`w-full mt-5 py-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition cursor-pointer shadow-md ${
                  isTraining 
                    ? 'bg-[#18263f] text-slate-500 cursor-not-allowed border border-[#1b2b48]' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-purple-500/10'
                }`}
              >
                <RefreshCw size={14} className={isTraining ? 'animate-spin' : ''} />
                Optimize PropPredict Core Network
              </button>
            </div>

          </div>
        )}

        {/* ================= TAB: TRUSTDEED REQUESTS ================= */}
        {activeTab === 'TrustDeed' && (
          <div className="bg-[#0e1626]/80 backdrop-blur-md rounded-2xl border border-[#1e2d4a]/50 overflow-hidden shadow-xl animate-in fade-in duration-300">
            <div className="p-6 border-b border-[#1e2d4a]/40 bg-[#111c30]/30">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <QrCode size={18} className="text-orange-400" />
                TrustDeed Ledger Land Verification Registry
              </h3>
              <p className="text-xs text-slate-400 mt-1">Cross-check official Registry Office title documents and generate secure trust-certificates.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-350">
                <thead className="bg-[#121c2e]/40 text-slate-400 font-bold text-xs uppercase tracking-wider border-b border-[#1e2d4a]/40">
                  <tr>
                    <th className="px-6 py-4">Owner Name</th>
                    <th className="px-6 py-4">Title Deed Document ID</th>
                    <th className="px-6 py-4">Sub-Registrar District</th>
                    <th className="px-6 py-4">Submission Date</th>
                    <th className="px-6 py-4">Ledger Status</th>
                    <th className="px-6 py-4 text-center">Trust Seal Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#18263f]/60">
                  {trustDeeds.map((item) => (
                    <tr key={item.id} className="hover:bg-[#121b2b]/30 transition border-b border-[#18263f]/30 last:border-0">
                      <td className="px-6 py-4.5 font-bold text-white text-sm">{item.owner}</td>
                      <td className="px-6 py-4.5 font-mono text-xs text-slate-400">{item.documentId}</td>
                      <td className="px-6 py-4.5 text-xs text-slate-300 font-medium">{item.registryOffice}</td>
                      <td className="px-6 py-4.5 text-xs text-slate-500">{item.uploadDate}</td>
                      <td className="px-6 py-4.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border ${
                          item.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4.5">
                        <div className="flex flex-col items-center justify-center">
                          {item.status === 'Pending' ? (
                            <button
                              onClick={() => approveTrustDeed(item.id)}
                              className="px-3.5 py-2 bg-gradient-to-r from-orange-500 to-amber-505 hover:from-orange-650 hover:to-amber-600 text-white text-[10px] font-extrabold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-orange-500/10"
                            >
                              <ShieldCheck size={14} />
                              Verify & Seal Title
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                const urls = getQRUrls(item.qrCode || "TD-102-8812");
                                setQrModal({ isOpen: true, deedId: item.qrCode || "TD-102-8812", urls });
                              }}
                              className="flex items-center gap-3 bg-[#111c30]/80 hover:bg-[#15233d] px-3.5 py-2 rounded-xl border border-[#1b2b48]/75 hover:border-blue-500/50 shadow-lg relative overflow-hidden group transition-all text-left cursor-pointer"
                            >
                              <div className="absolute inset-0 bg-emerald-500/[0.02] pointer-events-none" />
                              {/* Simple Simulated QR Icon block */}
                              <div className="w-8 h-8 bg-white p-0.5 rounded border border-slate-100 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
                                <span className="text-[5px] text-black font-mono font-bold leading-none break-all">QR-CODE</span>
                              </div>
                              <div className="text-left font-sans">
                                <p className="text-[8px] text-emerald-400 font-extrabold tracking-wider leading-none">VIEW QR KEYS</p>
                                <span className="text-[9px] font-mono text-slate-350 mt-1 block font-bold leading-none">{item.qrCode || "TD-102-8812"}</span>
                              </div>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB: SETTINGS ================= */}
        {activeTab === 'Settings' && (
          <div className="max-w-3xl space-y-6 animate-in fade-in duration-300 relative z-10">
            <div className="bg-[#0e1626]/80 backdrop-blur-md rounded-2xl border border-[#1e2d4a]/50 p-6 shadow-xl">
              <h3 className="text-sm font-bold mb-6 text-white border-b border-[#1e2d4a]/40 pb-3 flex items-center gap-2">
                <Database size={18} className="text-blue-400" />
                Database & Security Diagnostics
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#121c2e]/40 rounded-xl border border-[#1c2e4f]/50 hover:border-slate-800 transition duration-300">
                  <div>
                    <h4 className="text-xs font-bold text-white">System Undergoing Maintenance</h4>
                    <p className="text-[10px] text-slate-500 mt-1">Toggle maintenance mode to restrict front-end access.</p>
                  </div>
                  <button 
                    onClick={() => setSystemSettings({ ...systemSettings, maintenanceMode: !systemSettings.maintenanceMode })}
                    className={`p-1.5 rounded-full w-12 h-6 transition-all duration-300 cursor-pointer flex items-center ${
                      systemSettings.maintenanceMode ? 'bg-[#ef4444] justify-end shadow-lg shadow-rose-500/20' : 'bg-[#1b2a47] justify-start'
                    }`}
                  >
                    <span className="w-4.5 h-4.5 bg-white rounded-full shadow-md"></span>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#121c2e]/40 rounded-xl border border-[#1c2e4f]/50 hover:border-slate-800 transition duration-300">
                  <div>
                    <h4 className="text-sm font-semibold text-white">Advanced API Caching</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Caches property valuations on regional server nodes to boost throughput.</p>
                  </div>
                  <button 
                    onClick={() => setSystemSettings({ ...systemSettings, apiCaching: !systemSettings.apiCaching })}
                    className={`p-1.5 rounded-full w-12 h-6 transition-colors duration-250 cursor-pointer flex items-center ${
                      systemSettings.apiCaching ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'
                    }`}
                  >
                    <span className="w-5.5 h-5 bg-white rounded-full shadow-md"></span>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#121c2e]/60 rounded-xl border border-[#1c2e4f]">
                  <div>
                    <h4 className="text-sm font-semibold text-white">PropSight CyberShield Encryption</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Requires secure signed key rings for TrustDeed document downloads.</p>
                  </div>
                  <button 
                    onClick={() => setSystemSettings({ ...systemSettings, securityShield: !systemSettings.securityShield })}
                    className={`p-1.5 rounded-full w-12 h-6 transition-colors duration-250 cursor-pointer flex items-center ${
                      systemSettings.securityShield ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'
                    }`}
                  >
                    <span className="w-5.5 h-5 bg-white rounded-full shadow-md"></span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#0e1626] rounded-2xl border border-[#1e2d4a] p-6 shadow-xl shadow-black/20">
              <h3 className="text-md font-bold mb-4 text-white border-b border-[#1e2d4a] pb-3 flex items-center gap-2">
                <Lock size={18} className="text-purple-400" />
                Backup Configuration Registry
              </h3>
              <div className="flex items-center gap-4">
                <button className="px-4.5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-purple-500/10">
                  <Database size={14} />
                  Initiate Raw DB SQL Dump Backup
                </button>
                <span className="text-xs text-slate-500">Last backup processed: Yesterday, 23:40 GMT</span>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[#040810]/70 backdrop-blur-sm transition-opacity"
            onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
          />
          
          {/* Modal Box */}
          <div className="relative bg-[#0e1626] rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#1e2d4a] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex gap-4 items-start">
              <div className={`p-3 rounded-xl shrink-0 ${
                confirmModal.type === 'danger' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                confirmModal.type === 'warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              }`}>
                {confirmModal.type === 'danger' ? <AlertCircle size={22} /> : 
                 confirmModal.type === 'warning' ? <AlertCircle size={22} /> : 
                 <ShieldCheck size={22} />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-md font-bold text-white tracking-tight">{confirmModal.title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{confirmModal.message}</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2.5 mt-6 pt-4 border-t border-[#1e2d4a]">
              <button
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 bg-[#16243d] hover:bg-[#203457] text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer border border-[#21375d]"
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

      {/* QR Code Viewer Modal */}
      {qrModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[#040810]/75 backdrop-blur-sm transition-opacity"
            onClick={() => setQrModal({ isOpen: false, deedId: '', urls: {} })}
          />
          
          {/* Modal Box */}
          <div className="relative bg-[#0e1626] rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#1e2d4a] animate-in fade-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh] z-10">
            <div className="flex justify-between items-center border-b border-[#1e2d4a]/60 pb-4 mb-5">
              <div>
                <h3 className="text-md font-bold text-white tracking-tight flex items-center gap-2">
                  <QrCode className="text-amber-500 animate-pulse" size={20} />
                  TrustDeed Cryptographic QR Keyring
                </h3>
                <p className="text-[10px] text-slate-400 mt-1">Generated keys for Deed ID: <span className="font-mono text-blue-400 font-bold">{qrModal.deedId}</span></p>
              </div>
              <button 
                onClick={() => setQrModal({ isOpen: false, deedId: '', urls: {} })}
                className="p-1 hover:bg-[#16243d] rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(qrModal.urls).map(([role, url]) => (
                <div key={role} className="bg-[#121c2e]/60 border border-[#1c2e4f]/50 p-4 rounded-xl flex flex-col items-center relative overflow-hidden group">
                  {/* Role indicator */}
                  <span className={`absolute top-2 right-2 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                    role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                    role === 'buyer' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' :
                    role === 'seller' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    'bg-slate-500/10 text-slate-400 border-slate-500/20'
                  }`}>
                    {role}
                  </span>

                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-white p-2.5 rounded-xl mb-3 shadow-lg group-hover:scale-105 transition-transform duration-300 mt-3 cursor-pointer block"
                    title="Click to verify deed directly in new tab"
                  >
                    <QRCodeSVG value={url} size={110} />
                  </a>

                  <h4 className="text-xs font-bold text-slate-200 capitalize mb-1">{role} Access QR</h4>
                  <p className="text-[9px] text-slate-400 text-center mb-4 leading-normal px-2">
                    {role === 'admin' && 'Allows land registrar to audit & verify official logs.'}
                    {role === 'buyer' && 'Digital possession deed of property ownership.'}
                    {role === 'seller' && 'Official receipt of sale and tax registry.'}
                    {role === 'public' && 'Public scan board. Masked GDPR data.'}
                  </p>

                  <div className="flex gap-2 w-full mt-auto pt-2 border-t border-[#1a2947]/40">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(url);
                        alert(`${role.toUpperCase()} link copied!`);
                      }}
                      className="flex-1 py-2 bg-[#16243d] hover:bg-[#203457] text-slate-350 hover:text-white rounded-lg border border-[#21375d] text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Copy size={11} />
                      Copy Link
                    </button>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer text-center"
                    >
                      <ExternalLink size={11} />
                      Verify Link
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component for sidebar navigation items with professional style stack
const SidebarItem = ({ icon: Icon, text, active, onClick, isOpen }) => (
  <li 
    onClick={onClick}
    className={`
      flex items-center cursor-pointer px-4 py-3 rounded-xl transition-all duration-300 mb-1.5 font-bold text-sm tracking-wide relative group
      ${active 
        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/15' 
        : 'text-slate-400 hover:bg-[#152037] hover:text-slate-200 border border-transparent'}
    `}
  >
    <Icon size={18} className={`min-w-[18px] shrink-0 transition-transform duration-300 ${active ? 'scale-105' : 'group-hover:scale-110 text-slate-500 group-hover:text-blue-400'}`} />
    <span className={`ml-3.5 whitespace-nowrap transition-all duration-300 font-semibold ${!isOpen ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
      {text}
    </span>
    {active && isOpen && (
      <span className="absolute right-3.5 w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
    )}
  </li>
);

export default AdminDashboard;