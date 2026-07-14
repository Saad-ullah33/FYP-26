import React, { useState, useEffect } from 'react';
import { getQRUrls, createDeed, initializeDeeds } from '../utils/deedService';
import { QRCodeSVG } from 'qrcode.react';
import { useSubscription } from '../hooks/useSubscription';
import { PLANS } from '../data/plans';
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
  Lock,
  Gavel,
  CreditCard,
  Bell,
  ShieldAlert,
  Plus,
  Trash2,
  Edit,
  SlidersHorizontal,
  Eye,
  MapPin,
  Activity,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { subscription, setSubscription } = useSubscription();

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const [activeTab, setActiveTab] = useState('Overview');

  // Handle dynamic window resizing for responsive sidebar state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Overview Search/Sort/Pagination States
  const [opsSearch, setOpsSearch] = useState('');
  const [opsSortField, setOpsSortField] = useState('time');
  const [opsSortAsc, setOpsSortAsc] = useState(false);
  const [opsPage, setOpsPage] = useState(1);
  const opsPageSize = 3;
  const [selectedOp, setSelectedOp] = useState(null);

  // User Management Filter & Selection States
  const [userSearch, setUserSearch] = useState('');
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

  // Interactive Mock Data States
  const [usersList, setUsersList] = useState([
    { id: 1, name: 'Ali Khan', email: 'ali.khan@gmail.com', role: 'USER', status: 'Active', joined: '2026-01-15', properties: 4, plan: 'free' },
    { id: 2, name: 'Sarah Ahmed', email: 'sarah.ahmed@yahoo.com', role: 'USER', status: 'Active', joined: '2026-02-10', properties: 2, plan: 'pro' },
    { id: 3, name: 'Bilal Tech', email: 'bilal@proppredict.ai', role: 'ADMIN', status: 'Active', joined: '2025-11-01', properties: 0, plan: 'business' },
    { id: 4, name: 'Zainab Bibi', email: 'zainab.b@hotmail.com', role: 'USER', status: 'Suspended', joined: '2026-03-01', properties: 1, plan: 'free' },
    { id: 5, name: 'Usman Ghani', email: 'usman.g@outlook.com', role: 'USER', status: 'Active', joined: '2026-04-12', properties: 8, plan: 'pro' },
  ]);

  const [propertiesList, setPropertiesList] = useState([
    { id: 101, title: '5 Marla Modern House', location: 'Canal Road, Faisalabad', price: '1.8 Crore', owner: 'Ali Khan', date: '2026-06-25', status: 'Pending', type: 'HOUSE', city: 'Faisalabad' },
    { id: 102, title: 'Luxury 3 Bed Apartment', location: 'Gulberg III, Lahore', price: '2.5 Crore', owner: 'Sarah Ahmed', date: '2026-06-24', status: 'Approved', type: 'APARTMENT', city: 'Lahore' },
    { id: 103, title: 'Commercial Plaza Shop', location: 'Saddar, Rawalpindi', price: '95 Lakhs', owner: 'Usman Ghani', date: '2026-06-22', status: 'Pending', type: 'COMMERCIAL', city: 'Islamabad' },
    { id: 104, title: '10 Marla Residential Plot', location: 'DHA Phase 6, Karachi', price: '3.2 Crore', owner: 'Farhan Saeed', date: '2026-06-20', status: 'Rejected', type: 'LAND', city: 'Karachi' },
  ]);

  const [trustDeeds, setTrustDeeds] = useState([
    { id: 201, propertyId: 101, owner: 'Ali Khan', documentId: 'TD-9921-PB', registryOffice: 'Faisalabad West', status: 'Pending', uploadDate: '2026-06-26', verifiedAt: null },
    { id: 202, propertyId: 102, owner: 'Sarah Ahmed', documentId: 'TD-8812-IS', registryOffice: 'Lahore Registry Office', status: 'Verified', uploadDate: '2026-06-25', verifiedAt: '2026-06-26 14:30', qrCode: 'TD-102-8812' },
  ]);

  // QR modal view state
  const [qrModal, setQrModal] = useState({ isOpen: false, deedId: '', urls: {}, history: [] });

  // 1. Auction Management State
  const [auctionsList, setAuctionsList] = useState([
    { id: 1, title: '5 Marla Modern House, Faisalabad', status: 'Live', reservePrice: 15000000, highestBid: 16200000, highestBidder: 'Ali Khan', autoExtend: true, bidders: ['Ali Khan', 'Sarah Ahmed', 'Usman Ghani'], date: '2026-07-20' },
    { id: 2, title: 'Luxury 3 Bed Apartment, Lahore', status: 'Upcoming', reservePrice: 22000000, highestBid: 0, highestBidder: '', autoExtend: true, bidders: [], date: '2026-07-28' },
    { id: 3, title: 'Commercial Plaza Shop, Rawalpindi', status: 'Past', reservePrice: 9000000, highestBid: 9800000, highestBidder: 'Usman Ghani', autoExtend: false, bidders: ['Usman Ghani', 'Farhan Saeed'], date: '2026-07-10', winner: 'Usman Ghani' },
  ]);
  const [newAuctionForm, setNewAuctionForm] = useState({ title: '', reservePrice: '', date: '' });

  // 2. Verified Builders State
  const [buildersQueue, setBuildersQueue] = useState([
    { id: 1, companyName: 'Al-Haram Builders', license: 'PEC-65321', cnic: '35201-9988776-5', documents: ['Tax Certificate', 'Company Profile', 'Past Projects Portfolio'], date: '2026-07-02' },
    { id: 2, companyName: 'Faisalabad Developers', license: 'PEC-87612', cnic: '33100-1234567-9', documents: ['PEC License Certificate', 'CNIC Copy'], date: '2026-07-10' }
  ]);
  const [approvedBuilders, setApprovedBuilders] = useState([
    { id: 10, companyName: 'Chenab Construction Co', license: 'PEC-11223', cnic: '33100-7654321-3', portfolio: 'Completed 12 premium villas on Canal Road', rating: 4.8, status: 'Approved' },
    { id: 11, companyName: 'Sargodha Builders Group', license: 'PEC-44332', cnic: '38403-1122334-5', portfolio: 'Built FDA City commercial plazas', rating: 4.6, status: 'Approved' }
  ]);

  // 3. Smart Build Requests State
  const [smartBuildRequests, setSmartBuildRequests] = useState([
    { id: 1, clientName: 'Ali Khan', areaSize: '5 Marla', city: 'Faisalabad', status: 'AI review', date: '2026-07-12', aiSummary: 'Estimated Cost: 56.9 Lakh. Bricks: 11.5K. Cement: 816 Bags. Steel: 6.1 Tons. Recommended builder: Chenab Construction Co.', assignedBuilder: '' },
    { id: 2, clientName: 'Sarah Ahmed', areaSize: '10 Marla', city: 'Lahore', status: 'submitted', date: '2026-07-14', aiSummary: 'Estimated Cost: 112.5 Lakh. Tiles: 2250 sqft. Paint: 2250 sqft. Premium materials targeted.', assignedBuilder: '' },
    { id: 3, clientName: 'Usman Ghani', areaSize: '1 Kanal', city: 'Islamabad', status: 'assigned', date: '2026-07-10', aiSummary: 'Estimated Cost: 250 Lakh. Full premium build. Seismic reinforcements active.', assignedBuilder: 'Chenab Construction Co' }
  ]);

  // 4. Notifications & Alerts State
  const [broadcastMessages, setBroadcastMessages] = useState([
    { id: 1, title: 'Server Upgrade Scheduled', body: 'The AI core prediction nodes will undergo maintenance at 2 AM PST.', audience: 'All Users', date: '2026-07-14' }
  ]);
  const [broadcastForm, setBroadcastForm] = useState({ title: '', body: '', audience: 'All Users' });
  const [securityLogs, setSecurityLogs] = useState([
    { id: 1, type: 'Bypass Alert', location: 'DHA Phase 6 Node', time: '2026-07-15 01:22', message: 'Anomalous valuation query block bypassed. Checked & cleared.', status: 'Cleared' },
    { id: 2, type: 'Brute Force Attempt', location: 'Faisalabad Gate Node', time: '2026-07-14 18:40', message: 'Multiple rapid API key authentications blocked.', status: 'Blocked' },
    { id: 3, type: 'Registry Check Failure', location: 'Lahore Sub-Registrar Node', time: '2026-07-13 10:15', message: 'Invalid Merkle tree signature validation query rejected.', status: 'Rejected' }
  ]);

  // 5. Roles & Permissions State
  const [adminAccounts, setAdminAccounts] = useState([
    { id: 1, name: 'Bilal Tech', email: 'bilal@proppredict.ai', role: 'Administrator', access: ['Overview', 'Users', 'Properties', 'AI', 'TrustDeed', 'Settings'] },
    { id: 2, name: 'Zainab Bibi', email: 'zainab.b@hotmail.com', role: 'Moderator', access: ['Overview', 'Users', 'Properties'] },
    { id: 3, name: 'Usman Ghani', email: 'usman.g@outlook.com', role: 'Support', access: ['Overview', 'Users'] }
  ]);
  const [newAdminForm, setNewAdminForm] = useState({ name: '', email: '', role: 'Support' });

  // System General configuration
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    apiCaching: true,
    securityShield: true,
    backupInterval: 'Daily',
    apiEndpoint: 'https://api.proppredict.ai/v2',
    brandingName: 'PropSight AI ERP'
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
    { title: 'Total Properties', value: propertiesList.length, change: '+12%', icon: Building2, color: 'bg-blue-50 text-blue-700 border-blue-100', tab: 'Properties' },
    { title: 'Active Users', value: usersList.filter(u => u.status === 'Active').length, change: '+5%', icon: Users, color: 'bg-emerald-50 text-emerald-700 border-emerald-100', tab: 'Users' },
    { title: 'AI Valuations Run', value: '3,482', change: '+18%', icon: BrainCircuit, color: 'bg-purple-50 text-purple-700 border-purple-100', tab: 'AI', isAi: true },
    { title: 'Pending TrustDeeds', value: trustDeeds.filter(d => d.status === 'Pending').length, change: '-4%', icon: QrCode, color: 'bg-amber-50 text-amber-700 border-amber-100', tab: 'TrustDeed' },
  ];

  // Live Operations Mock Logs
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, user: 'Ali Khan', action: 'Requested Valuation', target: '5 Marla House, Islamabad', time: '2026-07-15 01:25', status: 'Processing' },
    { id: 2, user: 'Sarah Ahmed', action: 'New Property Listing', target: 'Apartment in Lahore', time: '2026-07-15 01:15', status: 'Completed' },
    { id: 3, user: 'System Agent', action: 'Deed Verification', target: 'TD-9921-PB Uploaded', time: '2026-07-15 00:10', status: 'Pending' },
    { id: 4, user: 'Bilal Tech', action: 'Estimator Weight Update', target: 'Model Weights Configured', time: '2026-07-14 22:30', status: 'Completed' },
    { id: 5, user: 'Zainab Bibi', action: 'User Suspension', target: 'Account Zainab Bibi Suspended', time: '2026-07-14 18:15', status: 'Completed' }
  ]);

  useEffect(() => {
    initializeDeeds();
  }, []);

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
        setTrainingLog(prev => [...prev, '[BATCH] Training weights on location variables... Validation Loss: 0.124']);
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
    }, 300);
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
      message: `Are you sure you want to change the role of "${user.name}" to ${nextRole}? This modifies administrative access.`,
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

  // Property status update
  const updatePropertyStatus = (propertyId, newStatus) => {
    setPropertiesList(prev => prev.map(p => 
      p.id === propertyId ? { ...p, status: newStatus } : p
    ));
  };

  // Bulk user modifications
  const handleBulkUserStatus = (status) => {
    if (selectedUserIds.length === 0) return;
    setUsersList(prev => prev.map(u => 
      selectedUserIds.includes(u.id) ? { ...u, status } : u
    ));
    setSelectedUserIds([]);
  };

  // Bulk property approval
  const handleBulkPropStatus = (status) => {
    if (selectedPropIds.length === 0) return;
    setPropertiesList(prev => prev.map(p => 
      selectedPropIds.includes(p.id) ? { ...p, status } : p
    ));
    setSelectedPropIds([]);
  };

  // Approve Trust Deed
  const approveTrustDeed = (deedId) => {
    const deed = trustDeeds.find(d => d.id === deedId);
    if (!deed) return;
    
    setConfirmModal({
      isOpen: true,
      title: 'Verify & Seal Title Deed',
      message: `Are you sure you want to verify the TrustDeed document "${deed.documentId}" uploaded by ${deed.owner}? This generates cryptographically signed QR certificate keys.`,
      confirmText: 'Verify & Seal',
      cancelText: 'Cancel',
      type: 'info',
      onConfirm: () => {
        const timeNow = new Date().toISOString().replace('T', ' ').substring(0, 16);
        const mockDeedData = {
          propertyId: deed.propertyId,
          title: "Premium Estate Registry Entry",
          location: "Faisalabad Punjab Registry",
          price: "1.2 Crore",
          buyerName: deed.owner,
          buyerEmail: 'client@proppredict.ai',
          buyerCNIC: '33100-1122334-5',
          textLockup: 'NextProperty Digital Trust Stamp',
          sellerName: 'Zainab Bibi',
          sellerEmail: 'zainab@gmail.com',
          sellerCNIC: '33100-5566778-9',
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

  // Subscription plan cost helper
  const getPlanMonthlyPrice = (planId) => {
    const plan = PLANS.find(p => p.id === planId);
    return plan ? plan.priceMonthly : 0;
  };

  const totalMonthlyRevenue = usersList.reduce((acc, user) => acc + getPlanMonthlyPrice(user.plan), 0);

  // Sorting helper for Overview Operations Table
  const sortedOperations = [...recentActivity]
    .filter(op => op.user.toLowerCase().includes(opsSearch.toLowerCase()) || op.action.toLowerCase().includes(opsSearch.toLowerCase()))
    .sort((a, b) => {
      let valA = a[opsSortField];
      let valB = b[opsSortField];
      if (opsSortAsc) return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });

  const totalOpsPages = Math.ceil(sortedOperations.length / opsPageSize);
  const pagedOperations = sortedOperations.slice((opsPage - 1) * opsPageSize, opsPage * opsPageSize);

  return (
    <div className="flex h-screen bg-[#F7F8FA] text-[#0F172A] font-sans overflow-hidden">
      
      {/* Dynamic green pulse keyframe injection */}
      <style>{`
        @keyframes greenPulse {
          0% { transform: scale(0.9); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.6; }
        }
        .animate-green-pulse {
          animation: greenPulse 2s infinite ease-in-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-green-pulse {
            animation: none;
            opacity: 0.8;
          }
        }
      `}</style>

      {/* ================= SIDEBAR BACKDROP ON MOBILE ================= */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-30
        ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-20'} 
        bg-white transition-all duration-300 flex flex-col border-r border-[#E5E7EB] shrink-0
      `}>
        <div className="p-4 flex items-center justify-between h-20 border-b border-[#E5E7EB]">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
              <img
                src="/favicon-icon.png"
                alt="NextProperty Icon"
                className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex flex-col leading-none gap-[3px] text-left">
                <span className="text-[15px] font-black tracking-tight text-[#0F172A]">
                  Next<span className="text-[#1D4ED8]">Property</span>
                </span>
                <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#64748B]">
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
            className="p-1.5 hover:bg-slate-50 text-[#64748B] hover:text-[#0F172A] rounded-lg cursor-pointer transition focus:ring-2 focus:ring-blue-500/25 focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {/* SECTION 1: OPERATIONS */}
            <div className={`mt-4 mb-2 px-3 text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider ${!isSidebarOpen && 'hidden'}`}>
              Operations
            </div>
            <SidebarItem icon={LayoutDashboard} text="Overview" active={activeTab === 'Overview'} onClick={() => { setActiveTab('Overview'); if (window.innerWidth < 1024) setIsSidebarOpen(false); }} isOpen={isSidebarOpen} />
            <SidebarItem icon={Users} text="User Management" active={activeTab === 'Users'} onClick={() => { setActiveTab('Users'); if (window.innerWidth < 1024) setIsSidebarOpen(false); }} isOpen={isSidebarOpen} />
            <SidebarItem icon={Building2} text="Properties" active={activeTab === 'Properties'} onClick={() => { setActiveTab('Properties'); if (window.innerWidth < 1024) setIsSidebarOpen(false); }} isOpen={isSidebarOpen} />

            {/* SECTION 2: MARKETPLACE */}
            <div className={`mt-5 mb-2 px-3 text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider ${!isSidebarOpen && 'hidden'}`}>
              Marketplace
            </div>
            <SidebarItem icon={Gavel} text="Auction Management" active={activeTab === 'Auction'} onClick={() => { setActiveTab('Auction'); if (window.innerWidth < 1024) setIsSidebarOpen(false); }} isOpen={isSidebarOpen} />
            <SidebarItem icon={UserCheck} text="Verified Builders" active={activeTab === 'Builders'} onClick={() => { setActiveTab('Builders'); if (window.innerWidth < 1024) setIsSidebarOpen(false); }} isOpen={isSidebarOpen} />
            <SidebarItem icon={FileText} text="Smart Build Requests" active={activeTab === 'BuildRequests'} onClick={() => { setActiveTab('BuildRequests'); if (window.innerWidth < 1024) setIsSidebarOpen(false); }} isOpen={isSidebarOpen} isAi />

            {/* SECTION 3: AI & SECURITY MODULES */}
            <div className={`mt-5 mb-2 px-3 text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider ${!isSidebarOpen && 'hidden'}`}>
              AI & Security Modules
            </div>
            <SidebarItem icon={BrainCircuit} text="PropPredict AI" active={activeTab === 'AI'} onClick={() => { setActiveTab('AI'); if (window.innerWidth < 1024) setIsSidebarOpen(false); }} isOpen={isSidebarOpen} isAi />
            <SidebarItem icon={QrCode} text="TrustDeed Requests" active={activeTab === 'TrustDeed'} onClick={() => { setActiveTab('TrustDeed'); if (window.innerWidth < 1024) setIsSidebarOpen(false); }} isOpen={isSidebarOpen} />

            {/* SECTION 4: CONTROL ROOM */}
            <div className={`mt-5 mb-2 px-3 text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider ${!isSidebarOpen && 'hidden'}`}>
              Control Room
            </div>
            <SidebarItem icon={CreditCard} text="Subscription & Billing" active={activeTab === 'Billing'} onClick={() => { setActiveTab('Billing'); if (window.innerWidth < 1024) setIsSidebarOpen(false); }} isOpen={isSidebarOpen} />
            <SidebarItem icon={Bell} text="Notifications Center" active={activeTab === 'Notifications'} onClick={() => { setActiveTab('Notifications'); if (window.innerWidth < 1024) setIsSidebarOpen(false); }} isOpen={isSidebarOpen} />
            <SidebarItem icon={ShieldAlert} text="Roles & Permissions" active={activeTab === 'Roles'} onClick={() => { setActiveTab('Roles'); if (window.innerWidth < 1024) setIsSidebarOpen(false); }} isOpen={isSidebarOpen} />
            <SidebarItem icon={Settings} text="System Settings" active={activeTab === 'Settings'} onClick={() => { setActiveTab('Settings'); if (window.innerWidth < 1024) setIsSidebarOpen(false); }} isOpen={isSidebarOpen} />
          </ul>
        </nav>

        {/* User Profile Footer */}
        {isSidebarOpen && (
          <div className="p-3 bg-slate-50 mx-3 mb-2 rounded-xl border border-[#E5E7EB] flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1D4ED8] flex items-center justify-center font-extrabold text-white text-xs">A</div>
            <div className="overflow-hidden text-left">
              <p className="text-xs font-bold text-[#0F172A] truncate">Administrator</p>
              <p className="text-[10px] text-[#64748B] truncate">admin@propsight.com</p>
            </div>
          </div>
        )}

        <div className="p-3 border-t border-[#E5E7EB]">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full p-2 text-red-650 hover:bg-red-50 rounded-xl transition-all cursor-pointer font-bold text-xs"
          >
            <LogOut size={16} />
            {isSidebarOpen && <span className="ml-3 text-red-600">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative text-left">
        
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            {/* Open Drawer Trigger Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-blue-600 rounded-lg cursor-pointer transition focus:ring-2 focus:ring-blue-500/25 focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
              aria-label="Open Sidebar"
            >
              <Menu size={22} />
            </button>

            <div className="text-left">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2">
                {activeTab === 'Overview' && <LayoutDashboard className="text-[#1D4ED8]" />}
                {activeTab === 'Users' && <Users className="text-[#1D4ED8]" />}
                {activeTab === 'Properties' && <Building2 className="text-[#1D4ED8]" />}
                {activeTab === 'Auction' && <Gavel className="text-[#1D4ED8]" />}
                {activeTab === 'Builders' && <UserCheck className="text-[#1D4ED8]" />}
                {activeTab === 'BuildRequests' && <FileText className="text-[#1D4ED8]" />}
                {activeTab === 'AI' && <BrainCircuit className="text-[#1D4ED8]" />}
                {activeTab === 'TrustDeed' && <QrCode className="text-[#1D4ED8]" />}
                {activeTab === 'Billing' && <CreditCard className="text-[#1D4ED8]" />}
                {activeTab === 'Notifications' && <Bell className="text-[#1D4ED8]" />}
                {activeTab === 'Roles' && <ShieldAlert className="text-[#1D4ED8]" />}
                {activeTab === 'Settings' && <Settings className="text-[#1D4ED8]" />}
                <span>{activeTab === 'AI' ? 'PropPredict AI Settings' : activeTab === 'BuildRequests' ? 'Smart Build AI Requests' : activeTab}</span>
                {(activeTab === 'AI' || activeTab === 'BuildRequests') && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-green-pulse inline-block self-center" />
                )}
              </h2>
              <p className="text-[#64748B] text-xs mt-1">PropSight AI System Control Terminal.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold border border-emerald-100">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              Live Node Online
            </div>
          </div>
        </header>

        {/* ================= TAB: OVERVIEW ================= */}
        {activeTab === 'Overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Clickable Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveTab(stat.tab)}
                  className="bg-white p-6 rounded-xl border border-[#E5E7EB] hover:border-blue-300 transition-all duration-350 flex flex-col justify-between shadow-sm hover:shadow-md cursor-pointer group"
                >
                  <div className="flex justify-between items-start">
                    <div className="text-left">
                      <p className="text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                        <span>{stat.title}</span>
                        {stat.isAi && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-green-pulse" />}
                      </p>
                      <h3 className="text-3xl font-black mt-2 text-[#0F172A] tracking-tight tabular-nums">{stat.value}</h3>
                    </div>
                    <div className={`p-3 rounded-lg border ${stat.color} transition-transform duration-300 group-hover:scale-105`}>
                      <stat.icon size={20} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-[10px] text-[#047857] font-bold">
                    <TrendingUp size={12} className="mr-1" />
                    <span>{stat.change}</span>
                    <span className="text-[#64748B] ml-1.5 font-semibold">vs last month</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Split Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Operations Table with scroll support */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm flex flex-col">
                <div className="p-6 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-[#0F172A]">Live System Operations</h3>
                    <p className="text-[11px] text-[#64748B] mt-0.5">Real-time valuation and post logs compiled dynamically.</p>
                  </div>
                  
                  <div className="relative w-full sm:w-60">
                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search initiator or action..."
                      value={opsSearch}
                      onChange={(e) => { setOpsSearch(e.target.value); setOpsPage(1); }}
                      className="w-full bg-white border border-[#E5E7EB] pl-9 pr-4 py-2 rounded-lg text-xs outline-none focus:border-blue-500 transition text-[#0F172A] min-h-[44px]"
                    />
                  </div>
                </div>

                {/* Horizontally scrollable container with visible scrollbar */}
                <div className="overflow-x-auto flex-1 scrollbar-thin scrollbar-thumb-slate-200">
                  <table className="w-full text-left text-sm text-[#64748B] min-w-[600px]">
                    <thead className="bg-slate-50 text-[#64748B] border-b border-[#E5E7EB] font-bold text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition" onClick={() => { setOpsSortField('user'); setOpsSortAsc(!opsSortAsc); }}>
                          User Initiator {opsSortField === 'user' && (opsSortAsc ? '▲' : '▼')}
                        </th>
                        <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition" onClick={() => { setOpsSortField('action'); setOpsSortAsc(!opsSortAsc); }}>
                          Operation {opsSortField === 'action' && (opsSortAsc ? '▲' : '▼')}
                        </th>
                        <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition" onClick={() => { setOpsSortField('time'); setOpsSortAsc(!opsSortAsc); }}>
                          Time stamp {opsSortField === 'time' && (opsSortAsc ? '▲' : '▼')}
                        </th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] text-slate-700">
                      {pagedOperations.map((item) => (
                        <tr 
                          key={item.id} 
                          onClick={() => setSelectedOp(item)}
                          className="hover:bg-slate-50/70 transition border-b border-[#E5E7EB] last:border-0 cursor-pointer"
                        >
                          <td className="px-6 py-4 font-bold text-[#0F172A] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-sm"></span>
                            {item.user}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col text-left">
                              <span className="font-bold text-slate-800 text-xs truncate max-w-[200px]" title={item.action}>{item.action}</span>
                              <span className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[200px]" title={item.target}>{item.target}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-mono tabular-nums">{item.time}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-extrabold border ${
                              item.status === 'Completed' ? 'bg-[#ECFDF5] text-[#047857] border-emerald-100' :
                              item.status === 'Pending' ? 'bg-[#FFFBEB] text-[#B45309] border-amber-100' :
                              'bg-[#EFF6FF] text-[#1D4ED8] border-blue-100'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="p-4 border-t border-[#E5E7EB] flex items-center justify-between bg-slate-50/30 text-xs font-semibold">
                  <span className="text-slate-500">Page {opsPage} of {totalOpsPages || 1}</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setOpsPage(prev => Math.max(prev - 1, 1))}
                      disabled={opsPage === 1}
                      className="px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-lg disabled:opacity-50 text-slate-650 hover:bg-slate-100 transition cursor-pointer min-h-[44px]"
                    >
                      Prev
                    </button>
                    <button 
                      onClick={() => setOpsPage(prev => Math.min(prev + 1, totalOpsPages))}
                      disabled={opsPage >= totalOpsPages}
                      className="px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-lg disabled:opacity-50 text-slate-650 hover:bg-slate-100 transition cursor-pointer min-h-[44px]"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>

              {/* Side Diagnostics Panel & warning box */}
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 flex flex-col justify-between shadow-sm space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A] mb-5 flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
                    <BrainCircuit size={18} className="text-[#7C3AED]" /> 
                    <span>AI Model Diagnostics</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-green-pulse" />
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-[#F5F3FF] rounded-lg border border-purple-100 text-left">
                      <div className="flex justify-between text-[10px] font-bold mb-1.5">
                        <span className="text-[#7C3AED]">PropPredict Model Accuracy</span>
                        <span className="text-emerald-700">95.1%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-500 h-1.5 rounded-full" style={{ width: '95.1%' }}></div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-150 text-left">
                      <div className="flex justify-between text-[10px] font-bold mb-1.5">
                        <span className="text-slate-600">AI Processor Load</span>
                        <span className="text-[#B45309]">42%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-[#B45309] h-1.5 rounded-full" style={{ width: '42%' }}></div>
                      </div>
                    </div>

                    {/* REDESIGNED: Security Alert Box */}
                    {securityLogs.length > 0 && (
                      <div className="p-4 bg-[#FEF2F2] rounded-lg border-l-4 border-l-[#B91C1C] border border-red-100 flex items-start gap-3 text-left">
                        <AlertCircle size={18} className="text-[#B91C1C] shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-[#B91C1C]">Security Alert Logged</h4>
                          <p className="text-[10px] text-red-800 font-semibold mt-1 leading-relaxed">{securityLogs[0].message}</p>
                          <span className="text-[8px] text-red-500 uppercase tracking-wide block mt-1.5 font-bold">Node: {securityLogs[0].location}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => setActiveTab('AI')}
                  className="w-full mt-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold py-2.5 rounded-lg text-[#1D4ED8] flex items-center justify-center gap-1 cursor-pointer transition focus:ring-2 focus:ring-blue-500/20 focus:outline-none min-h-[44px]"
                >
                  Configure AI Settings <ChevronRight size={14} />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ================= TAB: USER MANAGEMENT ================= */}
        {activeTab === 'Users' && (
          <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm animate-in fade-in duration-300">
            {/* Filters */}
            <div className="p-6 border-b border-[#E5E7EB] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] pl-9 pr-4 py-2 rounded-lg text-xs outline-none focus:border-blue-500 transition text-[#0F172A] min-h-[44px]"
                  />
                </div>
                
                {/* Role filter */}
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="bg-white border border-[#E5E7EB] px-3 py-2 rounded-lg text-xs outline-none font-bold text-slate-700 cursor-pointer focus:border-blue-500 min-h-[44px]"
                >
                  <option value="All">All Roles</option>
                  <option value="ADMIN">Admin Only</option>
                  <option value="USER">Users Only</option>
                </select>

                {/* Status filter */}
                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value)}
                  className="bg-white border border-[#E5E7EB] px-3 py-2 rounded-lg text-xs outline-none font-bold text-slate-700 cursor-pointer focus:border-blue-500 min-h-[44px]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active Only</option>
                  <option value="Suspended">Suspended Only</option>
                </select>
              </div>

              {/* Bulk actions */}
              {selectedUserIds.length > 0 && (
                <div className="flex gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => handleBulkUserStatus('Active')}
                    className="flex-1 sm:flex-initial px-3 py-2.5 bg-[#ECFDF5] hover:bg-emerald-100 text-[#047857] border border-emerald-200 text-xs font-bold rounded-lg transition cursor-pointer min-h-[44px]"
                  >
                    Activate Selected
                  </button>
                  <button 
                    onClick={() => handleBulkUserStatus('Suspended')}
                    className="flex-1 sm:flex-initial px-3 py-2.5 bg-[#FEF2F2] hover:bg-red-100 text-[#B91C1C] border border-red-200 text-xs font-bold rounded-lg transition cursor-pointer min-h-[44px]"
                  >
                    Suspend Selected
                  </button>
                </div>
              )}
            </div>

            {/* Desktop Users Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm text-[#64748B]">
                <thead className="bg-slate-50 text-[#64748B] border-b border-[#E5E7EB] font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 w-12">
                      <input 
                        type="checkbox"
                        checked={selectedUserIds.length === usersList.length}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedUserIds(usersList.map(u => u.id));
                          else setSelectedUserIds([]);
                        }}
                      />
                    </th>
                    <th className="px-6 py-4">User Details</th>
                    <th className="px-6 py-4">Registration</th>
                    <th className="px-6 py-4">Assigned Role</th>
                    <th className="px-6 py-4 text-center">Plan</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-slate-700">
                  {usersList
                    .filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))
                    .filter(u => userRoleFilter === 'All' ? true : u.role === userRoleFilter)
                    .filter(u => userStatusFilter === 'All' ? true : u.status === userStatusFilter)
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition border-b border-[#E5E7EB] last:border-0">
                        <td className="px-6 py-4">
                          <input 
                            type="checkbox" 
                            checked={selectedUserIds.includes(item.id)}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedUserIds(prev => [...prev, item.id]);
                              else setSelectedUserIds(prev => prev.filter(id => id !== item.id));
                            }}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-extrabold flex items-center justify-center text-xs">
                              {item.name.charAt(0)}
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-[#0F172A] text-sm">{item.name}</p>
                              <p className="text-[10px] text-slate-500 font-semibold">{item.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold tabular-nums">{item.joined}</td>
                        <td className="px-6 py-4 text-xs">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
                            item.role === 'ADMIN' ? 'bg-[#F5F3FF] text-[#7C3AED] border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                          }`}>
                            {item.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-xs font-bold text-slate-900 capitalize">{item.plan}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
                            item.status === 'Active' ? 'bg-[#ECFDF5] text-[#047857] border-emerald-100' : 'bg-[#FEF2F2] text-[#B91C1C] border-red-100'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setViewingUserActivity(item)}
                              className="px-2 py-1 bg-slate-50 border border-slate-200 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-lg text-[10px] font-bold transition flex items-center gap-1"
                            >
                              <Activity size={10} />
                              Log
                            </button>
                            <button
                              onClick={() => toggleUserRole(item.id)}
                              className="px-2 py-1 bg-slate-50 border border-slate-200 text-[#1D4ED8] hover:bg-slate-100 rounded-lg text-[10px] font-bold transition flex items-center gap-1"
                            >
                              Role
                            </button>
                            <button
                              onClick={() => toggleUserStatus(item.id)}
                              className={`p-1 rounded-lg border transition ${
                                item.status === 'Active' 
                                  ? 'bg-[#FEF2F2] text-[#B91C1C] border-red-200 hover:bg-red-100' 
                                  : 'bg-[#ECFDF5] text-[#047857] border-emerald-250 hover:bg-emerald-100'
                              }`}
                            >
                              {item.status === 'Active' ? <UserX size={13} /> : <UserCheck size={13} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Users Stacked Cards - Shown on Mobile */}
            <div className="md:hidden divide-y divide-slate-100 p-4 space-y-4">
              {usersList
                .filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))
                .filter(u => userRoleFilter === 'All' ? true : u.role === userRoleFilter)
                .filter(u => userStatusFilter === 'All' ? true : u.status === userStatusFilter)
                .map((item) => (
                  <div key={item.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3.5 text-xs text-left">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={selectedUserIds.includes(item.id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedUserIds(prev => [...prev, item.id]);
                            else setSelectedUserIds(prev => prev.filter(id => id !== item.id));
                          }}
                          className="w-4 h-4"
                        />
                        <span className="font-extrabold text-[#0F172A] text-sm">{item.name}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border ${
                        item.status === 'Active' ? 'bg-[#ECFDF5] text-[#047857] border-emerald-100' : 'bg-[#FEF2F2] text-[#B91C1C] border-red-100'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[#64748B] font-semibold">Email: <span className="text-slate-800 font-bold">{item.email}</span></p>
                      <p className="text-[#64748B] font-semibold">Joined: <span className="text-slate-800 font-bold font-mono">{item.joined}</span></p>
                      <p className="text-[#64748B] font-semibold">Role: 
                        <span className={`ml-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border ${
                          item.role === 'ADMIN' ? 'bg-[#F5F3FF] text-[#7C3AED] border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                        }`}>
                          {item.role}
                        </span>
                      </p>
                      <p className="text-[#64748B] font-semibold">Plan: <span className="text-slate-900 font-extrabold capitalize">{item.plan}</span></p>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                      <button
                        onClick={() => setViewingUserActivity(item)}
                        className="px-3 py-2 bg-white border border-slate-200 text-[#64748B] hover:text-[#0F172A] rounded-lg text-xs font-bold transition flex items-center gap-1 min-h-[44px]"
                      >
                        <Activity size={12} /> Log
                      </button>
                      <button
                        onClick={() => toggleUserRole(item.id)}
                        className="px-3 py-2 bg-white border border-slate-200 text-[#1D4ED8] rounded-lg text-xs font-bold transition flex items-center gap-1 min-h-[44px]"
                      >
                        Role
                      </button>
                      <button
                        onClick={() => toggleUserStatus(item.id)}
                        className={`p-2 rounded-lg border transition min-h-[44px] px-3 py-2 flex items-center ${
                          item.status === 'Active' 
                            ? 'bg-[#FEF2F2] text-[#B91C1C] border-red-200 hover:bg-red-100 font-bold text-xs' 
                            : 'bg-[#ECFDF5] text-[#047857] border-emerald-250 hover:bg-emerald-100 font-bold text-xs'
                        }`}
                      >
                        {item.status === 'Active' ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ================= TAB: PROPERTIES ================= */}
        {activeTab === 'Properties' && (
          <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm animate-in fade-in duration-300">
            {/* Filters */}
            <div className="p-6 border-b border-[#E5E7EB] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-full sm:w-60">
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={propertySearch}
                    onChange={(e) => setPropertySearch(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] pl-9 pr-4 py-2 rounded-lg text-xs outline-none focus:border-blue-500 transition text-[#0F172A] min-h-[44px]"
                  />
                </div>

                <select
                  value={propertyCityFilter}
                  onChange={(e) => setPropertyCityFilter(e.target.value)}
                  className="bg-white border border-[#E5E7EB] px-3 py-2 rounded-lg text-xs outline-none font-bold text-slate-700 cursor-pointer min-h-[44px]"
                >
                  <option value="All">All Cities</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Karachi">Karachi</option>
                </select>

                <select
                  value={propertyTypeFilter}
                  onChange={(e) => setPropertyTypeFilter(e.target.value)}
                  className="bg-white border border-[#E5E7EB] px-3 py-2 rounded-lg text-xs outline-none font-bold text-slate-700 cursor-pointer min-h-[44px]"
                >
                  <option value="All">All Types</option>
                  <option value="HOUSE">House</option>
                  <option value="APARTMENT">Apartment</option>
                  <option value="COMMERCIAL">Commercial</option>
                  <option value="LAND">Land</option>
                </select>

                <select
                  value={propertyStatusFilter}
                  onChange={(e) => setPropertyStatusFilter(e.target.value)}
                  className="bg-white border border-[#E5E7EB] px-3 py-2 rounded-lg text-xs outline-none font-bold text-slate-700 cursor-pointer min-h-[44px]"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Bulk operations */}
              {selectedPropIds.length > 0 && (
                <div className="flex gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => handleBulkPropStatus('Approved')}
                    className="flex-1 sm:flex-initial px-3 py-2 bg-[#ECFDF5] hover:bg-emerald-100 text-[#047857] border border-emerald-200 text-xs font-bold rounded-lg transition min-h-[44px]"
                  >
                    Approve Selected
                  </button>
                  <button 
                    onClick={() => handleBulkPropStatus('Rejected')}
                    className="flex-1 sm:flex-initial px-3 py-2 bg-[#FEF2F2] hover:bg-red-100 text-[#B91C1C] border border-red-200 text-xs font-bold rounded-lg transition min-h-[44px]"
                  >
                    Reject Selected
                  </button>
                </div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm text-[#64748B]">
                <thead className="bg-slate-50 text-[#64748B] border-b border-[#E5E7EB] font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 w-12">
                      <input 
                        type="checkbox"
                        checked={selectedPropIds.length === propertiesList.length}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedPropIds(propertiesList.map(p => p.id));
                          else setSelectedPropIds([]);
                        }}
                      />
                    </th>
                    <th className="px-6 py-4">Property Name</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Asking Price</th>
                    <th className="px-6 py-4">Owner</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-slate-700">
                  {propertiesList
                    .filter(p => propertyStatusFilter === 'All' ? true : p.status === propertyStatusFilter)
                    .filter(p => propertyCityFilter === 'All' ? true : p.city === propertyCityFilter)
                    .filter(p => propertyTypeFilter === 'All' ? true : p.type === propertyTypeFilter)
                    .filter(p => p.title.toLowerCase().includes(propertySearch.toLowerCase()) || p.owner.toLowerCase().includes(propertySearch.toLowerCase()))
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition border-b border-[#E5E7EB] last:border-0">
                        <td className="px-6 py-4">
                          <input 
                            type="checkbox" 
                            checked={selectedPropIds.includes(item.id)}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedPropIds(prev => [...prev, item.id]);
                              else setSelectedPropIds(prev => prev.filter(id => id !== item.id));
                            }}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {/* Thumbnail */}
                            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-700 font-extrabold text-[10px]">
                              {item.type}
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-[#0F172A] text-sm flex items-center gap-1.5">
                                <span>{item.title}</span>
                                <span className="inline-block text-[8px] bg-slate-100 border border-slate-200 px-1 rounded font-normal font-mono">ID: {item.id}</span>
                              </p>
                              <p className="text-[10px] text-slate-500 font-semibold">Posted: {item.date}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold flex items-center gap-1 mt-3">
                          <MapPin size={12} className="text-red-500 shrink-0" />
                          <span>{item.location}</span>
                        </td>
                        <td className="px-6 py-4 text-sm font-black text-[#1D4ED8] tabular-nums">{item.price}</td>
                        <td className="px-6 py-4 text-xs text-slate-700 font-semibold">{item.owner}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold border ${
                            item.status === 'Approved' ? 'bg-[#ECFDF5] text-[#047857] border-emerald-100' :
                            item.status === 'Pending' ? 'bg-[#FFFBEB] text-[#B45309] border-amber-100' :
                            'bg-[#FEF2F2] text-[#B91C1C] border-red-100'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {item.status === 'Pending' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => updatePropertyStatus(item.id, 'Approved')}
                                className="p-1 bg-[#ECFDF5] hover:bg-emerald-100 text-[#047857] border border-emerald-200 rounded-lg text-xs transition cursor-pointer"
                                title="Approve Listing"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                onClick={() => updatePropertyStatus(item.id, 'Rejected')}
                                className="p-1 bg-[#FEF2F2] hover:bg-red-100 text-[#B91C1C] border border-red-200 rounded-lg text-xs transition cursor-pointer"
                                title="Reject Listing"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic font-medium mr-2">Reviewed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Properties Stacked Cards - Shown on Mobile */}
            <div className="md:hidden divide-y divide-slate-100 p-4 space-y-4">
              {propertiesList
                .filter(p => propertyStatusFilter === 'All' ? true : p.status === propertyStatusFilter)
                .filter(p => propertyCityFilter === 'All' ? true : p.city === propertyCityFilter)
                .filter(p => propertyTypeFilter === 'All' ? true : p.type === propertyTypeFilter)
                .filter(p => p.title.toLowerCase().includes(propertySearch.toLowerCase()) || p.owner.toLowerCase().includes(propertySearch.toLowerCase()))
                .map((item) => (
                  <div key={item.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs text-left">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={selectedPropIds.includes(item.id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedPropIds(prev => [...prev, item.id]);
                            else setSelectedPropIds(prev => prev.filter(id => id !== item.id));
                          }}
                          className="w-4 h-4"
                        />
                        <span className="font-extrabold text-[#0F172A] text-sm">{item.title}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
                        item.status === 'Approved' ? 'bg-[#ECFDF5] text-[#047857] border-emerald-100' :
                        item.status === 'Pending' ? 'bg-[#FFFBEB] text-[#B45309] border-amber-100' :
                        'bg-[#FEF2F2] text-[#B91C1C] border-red-100'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[#64748B] font-semibold flex items-center gap-1">
                        <MapPin size={12} className="text-red-500" />
                        <span>Location: {item.location}</span>
                      </p>
                      <p className="text-[#64748B] font-semibold">Owner: <span className="text-slate-800 font-bold">{item.owner}</span></p>
                      <p className="text-[#64748B] font-semibold">Price: <span className="text-[#1D4ED8] font-black">{item.price}</span></p>
                      <p className="text-[#64748B] font-semibold">Submitted: <span className="text-slate-700 font-mono font-bold">{item.date}</span></p>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                      {item.status === 'Pending' ? (
                        <>
                          <button
                            onClick={() => updatePropertyStatus(item.id, 'Approved')}
                            className="px-3 py-2 bg-[#ECFDF5] hover:bg-emerald-100 text-[#047857] border border-emerald-200 rounded-lg text-xs font-bold transition flex items-center gap-1 min-h-[44px]"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updatePropertyStatus(item.id, 'Rejected')}
                            className="px-3 py-2 bg-[#FEF2F2] hover:bg-red-100 text-[#B91C1C] border border-red-200 rounded-lg text-xs font-bold transition flex items-center gap-1 min-h-[44px]"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Reviewed</span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ================= TAB: AUCTION MANAGEMENT ================= */}
        {activeTab === 'Auction' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Create Auction Form */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
              <h3 className="text-sm font-bold text-[#0F172A] border-b border-[#E5E7EB] pb-3 mb-5 flex items-center gap-2">
                <Gavel size={18} className="text-[#1D4ED8]" /> Add New Live Property Auction
              </h3>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newAuctionForm.title || !newAuctionForm.reservePrice) return;
                  setAuctionsList(prev => [...prev, {
                    id: Date.now(),
                    title: newAuctionForm.title,
                    status: 'Upcoming',
                    reservePrice: Number(newAuctionForm.reservePrice),
                    highestBid: 0,
                    highestBidder: '',
                    autoExtend: true,
                    bidders: [],
                    date: newAuctionForm.date || '2026-08-01'
                  }]);
                  setNewAuctionForm({ title: '', reservePrice: '', date: '' });
                }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end text-left"
              >
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Property Title</label>
                  <input
                    type="text"
                    required
                    value={newAuctionForm.title}
                    onChange={(e) => setNewAuctionForm({ ...newAuctionForm, title: e.target.value })}
                    placeholder="e.g. 5 Marla Plot, Faisalabad"
                    className="w-full bg-slate-50 border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-xs text-[#0F172A] outline-none min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Reserve Price (PKR)</label>
                  <input
                    type="number"
                    required
                    value={newAuctionForm.reservePrice}
                    onChange={(e) => setNewAuctionForm({ ...newAuctionForm, reservePrice: e.target.value })}
                    placeholder="e.g. 12000000"
                    className="w-full bg-slate-50 border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-xs text-[#0F172A] outline-none min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newAuctionForm.date}
                    onChange={(e) => setNewAuctionForm({ ...newAuctionForm, date: e.target.value })}
                    className="w-full bg-slate-50 border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-xs text-[#0F172A] outline-none min-h-[44px]"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-[#1D4ED8] hover:bg-blue-800 text-white font-bold py-2.5 rounded-lg text-xs transition min-h-[44px]"
                >
                  Schedule Auction
                </button>
              </form>
            </div>

            {/* Auctions Queue Table */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 border-b border-[#E5E7EB] text-left">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Operational Auctions List</h4>
              </div>
              
              {/* Desktop view */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm text-[#64748B]">
                  <thead className="bg-slate-50 border-b border-[#E5E7EB] font-bold text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Auction Asset</th>
                      <th className="px-6 py-4">Reserve (PKR)</th>
                      <th className="px-6 py-4">Highest Bid</th>
                      <th className="px-6 py-4">Auto-Extend</th>
                      <th className="px-6 py-4">Bidder Registry</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] text-slate-700">
                    {auctionsList.map((auc) => (
                      <tr key={auc.id} className="hover:bg-slate-50 border-b border-[#E5E7EB] last:border-0">
                        <td className="px-6 py-4">
                          <div className="text-left font-bold text-slate-900">{auc.title}</div>
                          <span className="text-[10px] text-slate-500 font-semibold">Start: {auc.date}</span>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold tabular-nums">Rs. {auc.reservePrice.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          {auc.highestBid > 0 ? (
                            <div className="text-left">
                              <span className="font-black text-[#1D4ED8] font-mono tabular-nums">Rs. {auc.highestBid.toLocaleString()}</span>
                              <p className="text-[8px] text-[#64748B] font-extrabold uppercase leading-none mt-0.5">By: {auc.highestBidder}</p>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-450 italic">No bids yet</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleAutoExtend(auc.id)}
                            className={`px-3 py-1 rounded-full text-[9px] font-extrabold border ${
                              auc.autoExtend ? 'bg-[#ECFDF5] text-[#047857] border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                            }`}
                          >
                            {auc.autoExtend ? 'Active' : 'Disabled'}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          {auc.bidders.length > 0 ? (
                            <span className="text-xs font-semibold text-slate-800">{auc.bidders.join(', ')}</span>
                          ) : (
                            <span className="text-xs text-slate-400 font-semibold">0 Registered</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold border ${
                            auc.status === 'Live' ? 'bg-[#EFF6FF] text-[#1D4ED8] border-blue-100 animate-pulse' :
                            auc.status === 'Upcoming' ? 'bg-[#FFFBEB] text-[#B45309] border-amber-100' :
                            'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {auc.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {auc.status === 'Live' && (
                              <button
                                onClick={() => assignWinner(auc.id)}
                                className="px-2 py-1 bg-[#ECFDF5] hover:bg-emerald-100 text-[#047857] border border-emerald-200 rounded text-xs font-bold transition"
                                title="Award Property to Top Bidder"
                              >
                                Award Winner
                              </button>
                            )}
                            <button
                              onClick={() => setAuctionsList(prev => prev.filter(a => a.id !== auc.id))}
                              className="p-1 bg-[#FEF2F2] hover:bg-red-100 text-[#B91C1C] border border-red-200 rounded transition"
                              title="Cancel Auction"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Auctions Stacked Cards - Shown on Mobile */}
              <div className="md:hidden divide-y divide-slate-100 p-4 space-y-4">
                {auctionsList.map((auc) => (
                  <div key={auc.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs text-left">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-[#0F172A] text-sm">{auc.title}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
                        auc.status === 'Live' ? 'bg-[#EFF6FF] text-[#1D4ED8] border-blue-100 animate-pulse' :
                        auc.status === 'Upcoming' ? 'bg-[#FFFBEB] text-[#B45309] border-amber-100' :
                        'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {auc.status}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[#64748B] font-semibold">Reserve Price: <span className="text-slate-800 font-bold font-mono">Rs. {auc.reservePrice.toLocaleString()}</span></p>
                      <p className="text-[#64748B] font-semibold">Highest Bid: 
                        {auc.highestBid > 0 ? (
                          <span className="text-[#1D4ED8] font-black font-mono ml-1">Rs. {auc.highestBid.toLocaleString()} (by {auc.highestBidder})</span>
                        ) : (
                          <span className="text-slate-400 italic ml-1">No bids</span>
                        )}
                      </p>
                      <p className="text-[#64748B] font-semibold">Auto-Extend: 
                        <button 
                          onClick={() => toggleAutoExtend(auc.id)}
                          className="ml-1.5 px-2.5 py-1 rounded-full text-[9px] font-extrabold bg-white border border-slate-350"
                        >
                          {auc.autoExtend ? 'Active' : 'Disabled'}
                        </button>
                      </p>
                      <p className="text-[#64748B] font-semibold">Bidders: <span className="text-slate-800 font-semibold">{auc.bidders.join(', ') || '0 Registered'}</span></p>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                      {auc.status === 'Live' && (
                        <button
                          onClick={() => assignWinner(auc.id)}
                          className="px-3 py-2 bg-[#ECFDF5] hover:bg-emerald-100 text-[#047857] border border-emerald-200 rounded-lg text-xs font-bold transition min-h-[44px]"
                        >
                          Award Winner
                        </button>
                      )}
                      <button
                        onClick={() => setAuctionsList(prev => prev.filter(a => a.id !== auc.id))}
                        className="px-3 py-2 bg-[#FEF2F2] hover:bg-red-100 text-[#B91C1C] border border-red-200 rounded-lg text-xs font-bold transition min-h-[44px] flex items-center justify-center gap-1"
                      >
                        <Trash2 size={12} /> Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: VERIFIED BUILDERS ================= */}
        {activeTab === 'Builders' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Split layout: Pending queue & Approved Directory tabs */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm">
              <div className="border-b border-[#E5E7EB] bg-slate-50/50 p-4 flex justify-between items-center">
                <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                  <UserCheck size={18} className="text-[#1D4ED8]" />
                  <span>Verified Builders Management</span>
                </h3>
              </div>

              {/* Pending Queue */}
              <div className="p-6">
                <h4 className="text-xs font-extrabold text-[#64748B] uppercase tracking-wider mb-3 text-left">Pending Verification Requests</h4>
                {buildersQueue.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 italic bg-slate-50 border border-slate-200 rounded-xl">No pending request queue items.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {buildersQueue.map((req) => (
                      <div key={req.id} className="border border-[#E5E7EB] rounded-xl p-4 bg-slate-50/50 flex flex-col justify-between">
                        <div className="text-left">
                          <span className="text-[10px] font-black text-[#1D4ED8] bg-blue-50 border border-blue-150 px-2 py-0.5 rounded uppercase font-mono">{req.license}</span>
                          <h4 className="text-sm font-bold text-slate-800 mt-2">{req.companyName}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">CNIC: {req.cnic}</p>
                          <div className="mt-3 space-y-1">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Submitted Documents</p>
                            <div className="flex flex-wrap gap-1">
                              {req.documents.map((d, i) => (
                                <span key={i} className="text-[9px] font-semibold text-slate-650 bg-white border border-slate-200 px-2 py-0.5 rounded">{d}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-200/60 flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setBuildersQueue(prev => prev.filter(b => b.id !== req.id));
                            }}
                            className="px-2.5 py-1.5 bg-[#FEF2F2] hover:bg-red-100 text-[#B91C1C] border border-red-200 rounded-lg text-xs font-bold transition min-h-[44px]"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => {
                              setApprovedBuilders(prev => [...prev, {
                                id: Date.now(),
                                companyName: req.companyName,
                                license: req.license,
                                cnic: req.cnic,
                                portfolio: 'Awaiting first project details',
                                rating: 5.0,
                                status: 'Approved'
                              }]);
                              setBuildersQueue(prev => prev.filter(b => b.id !== req.id));
                            }}
                            className="px-2.5 py-1.5 bg-[#ECFDF5] hover:bg-emerald-100 text-[#047857] border border-emerald-200 rounded-lg text-xs font-bold transition min-h-[44px]"
                          >
                            Approve License
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Approved Builders List */}
              <div className="p-6 border-t border-slate-100">
                <h4 className="text-xs font-extrabold text-[#64748B] uppercase tracking-wider mb-3 text-left">Approved Builders Directory</h4>
                
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-sm text-[#64748B]">
                    <thead className="bg-slate-50 border-b border-[#E5E7EB] font-bold text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Company</th>
                        <th className="px-6 py-4">PEC License</th>
                        <th className="px-6 py-4">Portfolio Summary</th>
                        <th className="px-6 py-4">Rating</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] text-slate-700">
                      {approvedBuilders.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50 border-b border-[#E5E7EB] last:border-0">
                          <td className="px-6 py-4 font-bold text-slate-900">{b.companyName}</td>
                          <td className="px-6 py-4 font-mono text-xs">{b.license}</td>
                          <td className="px-6 py-4 text-xs font-medium">{b.portfolio}</td>
                          <td className="px-6 py-4 font-mono font-bold text-[#B45309]">{b.rating} / 5.0</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => {
                                setApprovedBuilders(prev => prev.filter(item => item.id !== b.id));
                              }}
                              className="px-2.5 py-1.5 bg-[#FEF2F2] hover:bg-red-100 text-[#B91C1C] border border-red-200 rounded-lg text-xs font-bold transition"
                            >
                              Revoke & Suspend
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Approved Builders Stacked Cards - Shown on Mobile */}
                <div className="md:hidden divide-y divide-slate-100 p-0.5 space-y-4">
                  {approvedBuilders.map((b) => (
                    <div key={b.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs text-left">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-[#0F172A] text-sm">{b.companyName}</span>
                        <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-150 px-2 py-0.5 rounded uppercase font-mono font-bold">{b.license}</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[#64748B] font-semibold">Portfolio: <span className="text-slate-800 font-medium">{b.portfolio}</span></p>
                        <p className="text-[#64748B] font-semibold">Rating: <span className="text-[#B45309] font-black">{b.rating} / 5.0</span></p>
                      </div>
                      <div className="pt-2 border-t border-slate-200 flex justify-end">
                        <button
                          onClick={() => {
                            setApprovedBuilders(prev => prev.filter(item => item.id !== b.id));
                          }}
                          className="px-3 py-2 bg-[#FEF2F2] hover:bg-red-100 text-[#B91C1C] border border-red-200 rounded-lg text-xs font-bold transition min-h-[44px]"
                        >
                          Revoke & Suspend
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ================= TAB: SMART BUILD REQUESTS ================= */}
        {activeTab === 'BuildRequests' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm">
              <div className="p-6 border-b border-[#E5E7EB] bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                  <FileText size={18} className="text-[#7C3AED]" />
                  <span>Smart Build AI Customer Requests Queue</span>
                  <span className="w-1.5 h-1.5 bg-emerald-500 animate-green-pulse" />
                </h3>
              </div>

              <div className="divide-y divide-[#E5E7EB]">
                {smartBuildRequests.map((req) => (
                  <div key={req.id} className="p-6 hover:bg-slate-50/30 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="text-left space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-800">{req.clientName}</span>
                        <span className="px-2 py-0.5 bg-[#F5F3FF] text-[#7C3AED] rounded border border-purple-100 text-[9px] font-bold">
                          {req.areaSize} • {req.city}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">Submitted on: {req.date}</p>
                      
                      {/* AI Generated block */}
                      <div className="mt-4 p-4 bg-[#F5F3FF] rounded-lg border border-purple-100 text-xs text-purple-950 font-medium max-w-xl">
                        <p className="font-bold flex items-center gap-1 mb-1 text-[#7C3AED]">
                          <Sparkles size={12} className="animate-pulse" />
                          Google Grounded AI Survey Summary:
                        </p>
                        {req.aiSummary}
                      </div>
                    </div>

                    <div className="flex flex-col items-slate-stretch md:items-end gap-2.5 shrink-0 w-full md:w-auto">
                      <div className="flex justify-between md:justify-end items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Status:</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
                          req.status === 'assigned' ? 'bg-[#ECFDF5] text-[#047857] border-emerald-100' :
                          req.status === 'AI review' ? 'bg-[#F5F3FF] text-[#7C3AED] border-purple-100 shadow-sm' :
                          req.status === 'completed' ? 'bg-[#EFF6FF] text-[#1D4ED8] border-blue-100' :
                          'bg-[#FFFBEB] text-[#B45309] border-amber-100'
                        }`}>
                          {req.status}
                        </span>
                      </div>

                      {req.status !== 'assigned' && req.status !== 'completed' ? (
                        <div className="flex items-center gap-2 w-full">
                          <select
                            onChange={(e) => {
                              const bName = e.target.value;
                              if (!bName) return;
                              setSmartBuildRequests(prev => prev.map(item => 
                                item.id === req.id ? { ...item, status: 'assigned', assignedBuilder: bName } : item
                              ));
                            }}
                            className="bg-white border border-[#E5E7EB] rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 outline-none cursor-pointer min-h-[44px] w-full"
                          >
                            <option value="">Assign Builder...</option>
                            {approvedBuilders.map(b => (
                              <option key={b.id} value={b.companyName}>{b.companyName}</option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <p className="text-xs font-semibold text-[#047857] flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          Assigned to: <strong className="font-extrabold">{req.assignedBuilder}</strong>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: SUBSCRIPTION & BILLING ================= */}
        {activeTab === 'Billing' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Revenue card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm flex flex-col justify-between text-left">
                <div>
                  <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Active Plan Context</p>
                  <h4 className="text-xl font-bold mt-1 text-slate-900 capitalize">Plan Tier: {subscription.currentPlan}</h4>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold block mt-4">Cycle: {subscription.billingCycle}</span>
              </div>
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm flex flex-col justify-between text-left">
                <div>
                  <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Total Monthly Revenue Runrate</p>
                  <h4 className="text-3xl font-black mt-2 text-[#1D4ED8] tabular-nums">Rs. {totalMonthlyRevenue.toLocaleString()}</h4>
                </div>
                <span className="text-[10px] text-[#047857] font-bold block mt-4">Calculated from registered user database tiers</span>
              </div>
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm flex flex-col justify-between text-left">
                <div>
                  <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Distribution Tiers</p>
                  <p className="text-xs font-semibold text-slate-700 mt-2">
                    Free: {usersList.filter(u => u.plan === 'free').length} • 
                    Pro: {usersList.filter(u => u.plan === 'pro').length} • 
                    Business: {usersList.filter(u => u.plan === 'business').length}
                  </p>
                </div>
              </div>
            </div>

            {/* Subscriber list with overrides */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 border-b border-[#E5E7EB] text-left">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Subscribers Plan override Panel</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-[#64748B]">
                  <thead className="bg-slate-50 border-b border-[#E5E7EB] font-bold text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Active plan</th>
                      <th className="px-6 py-4">Monthly Rate</th>
                      <th className="px-6 py-4 text-right">Plan Overrule Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] text-slate-700">
                    {usersList.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50 border-b border-[#E5E7EB] last:border-0">
                        <td className="px-6 py-4 font-bold text-slate-900">{user.name}</td>
                        <td className="px-6 py-4 text-xs font-bold uppercase text-[#1D4ED8]">{user.plan}</td>
                        <td className="px-6 py-4 font-mono font-bold tabular-nums">Rs. {getPlanMonthlyPrice(user.plan).toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                          <select
                            value={user.plan}
                            onChange={(e) => {
                              const newPlan = e.target.value;
                              setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, plan: newPlan } : u));
                              // Also sync global context if matching active user
                              if (user.role === 'ADMIN') {
                                setSubscription(prev => ({ ...prev, currentPlan: newPlan }));
                              }
                            }}
                            className="bg-white border border-[#E5E7EB] rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 outline-none cursor-pointer min-h-[44px]"
                          >
                            <option value="free">Free Tier</option>
                            <option value="pro">Pro Tier</option>
                            <option value="business">Business Tier</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: NOTIFICATIONS CENTER ================= */}
        {activeTab === 'Notifications' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
            {/* Composer */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm text-left">
                <h3 className="text-sm font-bold text-[#0F172A] border-b border-[#E5E7EB] pb-3 mb-5 flex items-center gap-2">
                  <Bell size={18} className="text-[#1D4ED8]" /> Compose Broadcast Message
                </h3>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!broadcastForm.title || !broadcastForm.body) return;
                    setBroadcastMessages(prev => [...prev, {
                      id: Date.now(),
                      title: broadcastForm.title,
                      body: broadcastForm.body,
                      audience: broadcastForm.audience,
                      date: new Date().toISOString().substring(0, 10)
                    }]);
                    setBroadcastForm({ title: '', body: '', audience: 'All Users' });
                    alert("Broadcast message published successfully!");
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target Audience</label>
                    <select
                      value={broadcastForm.audience}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, audience: e.target.value })}
                      className="w-full bg-slate-50 border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-xs text-[#0F172A] outline-none cursor-pointer min-h-[44px]"
                    >
                      <option value="All Users">All Users</option>
                      <option value="Pro Subscribers">Pro Subscribers</option>
                      <option value="Business Subscribers">Business Subscribers</option>
                      <option value="Verified Builders">Verified Builders Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={broadcastForm.title}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                      placeholder="e.g. System upgrade"
                      className="w-full bg-slate-50 border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-xs text-[#0F172A] outline-none min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Message Body</label>
                    <textarea
                      required
                      rows="4"
                      value={broadcastForm.body}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, body: e.target.value })}
                      placeholder="Type details here..."
                      className="w-full bg-slate-50 border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs text-[#0F172A] outline-none resize-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 bg-[#1D4ED8] hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer min-h-[44px]"
                  >
                    Broadcast Message
                  </button>
                </form>
              </div>

              {/* Delivery History */}
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm text-left">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">Past Broadcast logs</h4>
                <div className="space-y-3">
                  {broadcastMessages.map((msg) => (
                    <div key={msg.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <h5 className="font-bold text-slate-800 text-xs">{msg.title}</h5>
                        <span className="text-[9px] font-bold text-slate-400 font-mono">{msg.date}</span>
                      </div>
                      <p className="text-xs text-slate-650 font-medium">{msg.body}</p>
                      <span className="text-[9px] bg-blue-50 text-[#1D4ED8] border border-blue-100 rounded px-1.5 py-0.5 mt-2 inline-block font-extrabold uppercase">To: {msg.audience}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Delivery/Security log alerts registry */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm flex flex-col space-y-4 text-left">
              <h3 className="text-sm font-bold text-[#0F172A] border-b border-[#E5E7EB] pb-3 flex items-center gap-2">
                <ShieldAlert size={18} className="text-red-500" />
                <span>Security Diagnostic Registers</span>
              </h3>
              
              <div className="space-y-4 overflow-y-auto max-h-[450px] pr-2">
                {securityLogs.map((log) => (
                  <div key={log.id} className="p-4 bg-[#FEF2F2] border-l-4 border-l-[#B91C1C] border border-red-100 rounded-lg text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <strong className="text-[#B91C1C] font-bold">{log.type}</strong>
                      <span className="text-[9px] text-red-500 font-semibold">{log.time}</span>
                    </div>
                    <p className="text-[11px] text-red-800 font-semibold mt-0.5">{log.message}</p>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-red-200/50">
                      <span className="text-[8px] text-red-600 font-extrabold uppercase">Node: {log.location}</span>
                      <span className="text-[9px] font-black text-emerald-800 uppercase">{log.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: ROLES & PERMISSIONS ================= */}
        {activeTab === 'Roles' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Add administrator */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
              <h3 className="text-sm font-bold text-[#0F172A] border-b border-[#E5E7EB] pb-3 mb-5 flex items-center gap-2 text-left">
                <ShieldAlert size={18} className="text-[#1D4ED8]" /> Configure Admin Sub-Accounts
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newAdminForm.name || !newAdminForm.email) return;
                  setAdminAccounts(prev => [...prev, {
                    id: Date.now(),
                    name: newAdminForm.name,
                    email: newAdminForm.email,
                    role: newAdminForm.role,
                    access: ['Overview']
                  }]);
                  setNewAdminForm({ name: '', email: '', role: 'Support' });
                }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end text-left"
              >
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={newAdminForm.name}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, name: e.target.value })}
                    placeholder="e.g. Usman Ghani"
                    className="w-full bg-slate-50 border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-xs text-[#0F172A] outline-none min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newAdminForm.email}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                    placeholder="e.g. usman@propsight.com"
                    className="w-full bg-slate-50 border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-xs text-[#0F172A] outline-none min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Role Type</label>
                  <select
                    value={newAdminForm.role}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, role: e.target.value })}
                    className="w-full bg-slate-50 border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-xs text-[#0F172A] outline-none cursor-pointer min-h-[44px]"
                  >
                    <option value="Administrator">Administrator</option>
                    <option value="Support">Support Desk</option>
                    <option value="Finance">Finance Auditor</option>
                    <option value="Moderator">Moderator</option>
                  </select>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-[#1D4ED8] hover:bg-blue-800 text-white font-bold py-2.5 rounded-lg text-xs transition min-h-[44px]"
                >
                  Create Sub-Account
                </button>
              </form>
            </div>

            {/* Accounts Table */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm">
              
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm text-[#64748B]">
                  <thead className="bg-slate-50 border-b border-[#E5E7EB] font-bold text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Operator</th>
                      <th className="px-6 py-4">System Role</th>
                      <th className="px-6 py-4">Module Access Control</th>
                      <th className="px-6 py-4 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] text-slate-700">
                    {adminAccounts.map((account) => (
                      <tr key={account.id} className="hover:bg-slate-50 border-b border-[#E5E7EB] last:border-0">
                        <td className="px-6 py-4 text-left">
                          <div className="text-left font-bold text-slate-900">{account.name}</div>
                          <span className="text-[10px] text-slate-500 font-semibold">{account.email}</span>
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-[#1D4ED8]">{account.role}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-left">
                            {['Overview', 'Users', 'Properties', 'AI', 'TrustDeed', 'Settings'].map((mod) => {
                              const isChecked = account.access.includes(mod);
                              return (
                                <label key={mod} className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                                  <input 
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                      const updatedAccess = e.target.checked
                                        ? [...account.access, mod]
                                        : account.access.filter(m => m !== mod);
                                      setAdminAccounts(prev => prev.map(act => act.id === account.id ? { ...act, access: updatedAccess } : act));
                                    }}
                                  />
                                  <span>{mod}</span>
                                </label>
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => {
                              setAdminAccounts(prev => prev.filter(a => a.id !== account.id));
                            }}
                            className="p-1.5 bg-[#FEF2F2] hover:bg-red-100 text-[#B91C1C] border border-red-200 rounded-lg transition cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card view for Roles & Permissions */}
              <div className="md:hidden divide-y divide-slate-100 p-4 space-y-4">
                {adminAccounts.map((account) => (
                  <div key={account.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs text-left">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-extrabold text-[#0F172A] text-sm">{account.name}</span>
                        <span className="text-[10px] text-slate-500 block font-semibold">{account.email}</span>
                      </div>
                      <span className="text-xs font-bold text-[#1D4ED8] bg-blue-50 px-2 py-0.5 rounded border border-blue-150">{account.role}</span>
                    </div>
                    <div className="space-y-1.5 pt-2 border-t border-slate-200">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Module Access Control</p>
                      <div className="grid grid-cols-2 gap-2">
                        {['Overview', 'Users', 'Properties', 'AI', 'TrustDeed', 'Settings'].map((mod) => {
                          const isChecked = account.access.includes(mod);
                          return (
                            <label key={mod} className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer min-h-[36px]">
                              <input 
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  const updatedAccess = e.target.checked
                                    ? [...account.access, mod]
                                    : account.access.filter(m => m !== mod);
                                  setAdminAccounts(prev => prev.map(act => act.id === account.id ? { ...act, access: updatedAccess } : act));
                                }}
                                className="w-4 h-4"
                              />
                              <span>{mod}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-end">
                      <button
                        onClick={() => {
                          setAdminAccounts(prev => prev.filter(a => a.id !== account.id));
                        }}
                        className="px-3 py-2 bg-[#FEF2F2] hover:bg-red-100 text-[#B91C1C] border border-red-200 rounded-lg text-xs font-bold transition min-h-[44px] flex items-center justify-center gap-1.5 w-full cursor-pointer"
                      >
                        <Trash2 size={12} /> Remove Account
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: PROPREDICT AI ================= */}
        {activeTab === 'AI' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
            
            {/* Accuracy Line chart & weights sliders */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm relative overflow-hidden">
                <h3 className="text-sm font-bold mb-6 text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2 text-left">
                  <SlidersHorizontal size={18} className="text-[#1D4ED8]" />
                  <span>Appraisal Weight Calibration Settings</span>
                </h3>

                {/* Accuracy chart */}
                <div className="mb-8 bg-slate-50 border border-slate-200 p-4 rounded-xl text-left">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                    <span className="text-xs font-bold text-slate-700">Model Valuation Accuracy Trend (Last 6 Months)</span>
                    <span className="text-xs font-extrabold text-[#7C3AED] bg-purple-50 px-2 py-0.5 rounded border border-purple-150">Current: 95.1%</span>
                  </div>
                  
                  {/* SVG Responsive Sparkline */}
                  <div className="h-28 w-full relative pt-2">
                    <svg className="w-full h-full" viewBox="0 0 500 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.25"/>
                          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0"/>
                        </linearGradient>
                      </defs>
                      <path 
                        d="M0,80 L100,65 L200,58 L300,45 L400,32 L500,20 L500,100 L0,100 Z" 
                        fill="url(#chartGlow)"
                      />
                      <path 
                        d="M0,80 L100,65 L200,58 L300,45 L400,32 L500,20" 
                        fill="none" 
                        stroke="#7C3AED" 
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <circle cx="0" cy="80" r="4" fill="#7C3AED" />
                      <circle cx="100" cy="65" r="4" fill="#7C3AED" />
                      <circle cx="200" cy="58" r="4" fill="#7C3AED" />
                      <circle cx="300" cy="45" r="4" fill="#7C3AED" />
                      <circle cx="400" cy="32" r="4" fill="#7C3AED" />
                      <circle cx="500" cy="20" r="4" fill="#7C3AED" />
                    </svg>
                    
                    <div className="flex justify-between text-[8px] sm:text-[9px] font-mono text-slate-500 mt-2 font-bold px-1">
                      <span>JAN</span>
                      <span>FEB</span>
                      <span>MAR</span>
                      <span>APR</span>
                      <span>MAY</span>
                      <span>JUN</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-left">
                  <h4 className="text-xs font-extrabold text-[#64748B] uppercase tracking-wider mb-2">Valuation Feature Weight Configuration</h4>
                  {Object.entries(modelSettings.featureWeights).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="capitalize text-slate-700">{key} Influence Weight</span>
                        <span className="text-[#1D4ED8] font-bold tabular-nums">{value}%</span>
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
                        className="w-full accent-blue-700 bg-slate-100 rounded-lg appearance-none cursor-pointer h-1.5 min-h-[44px]"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
                  <button className="w-full sm:w-auto px-5 py-2.5 bg-[#1D4ED8] hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm shadow-blue-500/10 cursor-pointer min-h-[44px]">
                    <Save size={14} />
                    Apply Hyperparameter Weights
                  </button>
                </div>
              </div>
            </div>

            {/* Neural Net Simulator console log */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 flex flex-col shadow-sm relative overflow-hidden text-left">
              <h3 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-150 pb-3 flex items-center gap-2">
                <Sparkles size={18} className="text-[#7C3AED]" />
                Live Model Compiler console
              </h3>

              {/* Console window */}
              <div className="flex items-center gap-1.5 bg-slate-900 px-4 py-2.5 rounded-t-xl shrink-0">
                <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                <span className="text-[9px] text-slate-500 font-bold ml-2 font-mono uppercase tracking-wider">compiler-shell@propsight-node:~</span>
              </div>

              <div className="flex-1 min-h-[220px] bg-slate-950 rounded-b-xl p-4 font-mono text-[10px] text-emerald-400 overflow-y-auto space-y-2 shadow-inner">
                {trainingLog.length === 0 ? (
                  <span className="text-slate-600 italic">Compiler standing by. Click compile model below to start optimization process.</span>
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
                <div className="w-full bg-slate-200 h-2 rounded-full mt-4 overflow-hidden">
                  <div className="bg-[#7C3AED] h-2 transition-all duration-300" style={{ width: `${trainingProgress}%` }}></div>
                </div>
              )}

              <button 
                onClick={startTraining}
                disabled={isTraining}
                className={`w-full mt-5 py-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-2 transition cursor-pointer shadow-md min-h-[44px] ${
                  isTraining 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                    : 'bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-600 text-white shadow-blue-500/10'
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
          <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm animate-in fade-in duration-300">
            <div className="p-6 border-b border-[#E5E7EB] bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                  <QrCode size={18} className="text-[#B45309]" />
                  <span>TrustDeed Registry Queue</span>
                </h3>
                <p className="text-xs text-[#64748B] mt-1">Cross-check official Title Deed title certificates.</p>
              </div>

              {/* Queue status switcher */}
              <div className="flex items-center gap-1.5 bg-slate-150/50 p-1 rounded-lg border border-slate-200 w-full sm:w-auto">
                {['Pending', 'Verified'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setDeedQueueTab(status)}
                    className={`flex-1 sm:flex-initial px-3 py-1.5 rounded text-[10px] font-bold transition cursor-pointer min-h-[36px] ${
                      deedQueueTab === status 
                        ? 'bg-white text-slate-800 border border-slate-200 shadow-sm' 
                        : 'bg-transparent text-slate-500'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Table view */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm text-[#64748B]">
                <thead className="bg-slate-50 border-b border-[#E5E7EB] font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Owner Name</th>
                    <th className="px-6 py-4">Title Deed Document ID</th>
                    <th className="px-6 py-4">Sub-Registrar District</th>
                    <th className="px-6 py-4">Submission Date</th>
                    <th className="px-6 py-4">Ledger Status</th>
                    <th className="px-6 py-4 text-center">Trust Seal Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-slate-700">
                  {trustDeeds
                    .filter(d => d.status === deedQueueTab)
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 border-b border-[#E5E7EB] last:border-0">
                        <td className="px-6 py-4 font-bold text-slate-900">{item.owner}</td>
                        <td className="px-6 py-4 font-mono text-xs">{item.documentId}</td>
                        <td className="px-6 py-4 text-xs font-semibold text-slate-750">{item.registryOffice}</td>
                        <td className="px-6 py-4 text-xs font-semibold text-slate-500">{item.uploadDate}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border ${
                            item.status === 'Verified' ? 'bg-[#ECFDF5] text-[#047857] border-emerald-100' : 'bg-[#FFFBEB] text-[#B45309] border-amber-100'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col items-center justify-center">
                            {item.status === 'Pending' ? (
                              <button
                                onClick={() => approveTrustDeed(item.id)}
                                className="px-3.5 py-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white text-[10px] font-extrabold rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-sm shadow-orange-500/10"
                              >
                                <ShieldCheck size={14} />
                                Verify & Seal Title
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  const urls = getQRUrls(item.qrCode || "TD-102-8812");
                                  const history = [
                                    { time: '2026-07-15 01:04', role: 'public', detail: 'Public QR scan log accessed successfully.' },
                                    { time: '2026-07-14 16:12', role: 'buyer', detail: 'Buyer certificate downloaded & verified.' },
                                    { time: '2026-07-14 10:10', role: 'admin', detail: 'Admin registry signature consensus created.' }
                                  ];
                                  setQrModal({ isOpen: true, deedId: item.qrCode || "TD-102-8812", urls, history });
                                }}
                                className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 px-3.5 py-2 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden group transition-all text-left cursor-pointer"
                              >
                                <div className="w-8 h-8 bg-white p-0.5 rounded border border-slate-200 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
                                  <span className="text-[5px] text-black font-mono font-bold leading-none break-all">QR-CODE</span>
                                </div>
                                <div className="text-left font-sans">
                                  <p className="text-[8px] text-[#047857] font-extrabold tracking-wider leading-none">VIEW QR KEYS</p>
                                  <span className="text-[9px] font-mono text-slate-800 mt-1 block font-bold leading-none">{item.qrCode || "TD-102-8812"}</span>
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

            {/* TrustDeed Stacked Cards - Shown on Mobile */}
            <div className="md:hidden divide-y divide-slate-100 p-4 space-y-4">
              {trustDeeds
                .filter(d => d.status === deedQueueTab)
                .map((item) => (
                  <div key={item.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs text-left">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-[#0F172A] text-sm">{item.owner}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border ${
                        item.status === 'Verified' ? 'bg-[#ECFDF5] text-[#047857] border-emerald-100' : 'bg-[#FFFBEB] text-[#B45309] border-amber-100'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[#64748B] font-semibold">Title ID: <span className="text-slate-800 font-bold font-mono">{item.documentId}</span></p>
                      <p className="text-[#64748B] font-semibold">District: <span className="text-slate-800 font-bold">{item.registryOffice}</span></p>
                      <p className="text-[#64748B] font-semibold">Submitted: <span className="text-slate-700 font-mono font-semibold">{item.uploadDate}</span></p>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-end">
                      {item.status === 'Pending' ? (
                        <button
                          onClick={() => approveTrustDeed(item.id)}
                          className="w-full justify-center px-3.5 py-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white text-[10px] font-extrabold rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-sm shadow-orange-500/10 min-h-[44px]"
                        >
                          <ShieldCheck size={14} />
                          Verify & Seal Title
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const urls = getQRUrls(item.qrCode || "TD-102-8812");
                            const history = [
                              { time: '2026-07-15 01:04', role: 'public', detail: 'Public QR scan log accessed successfully.' },
                              { time: '2026-07-14 16:12', role: 'buyer', detail: 'Buyer certificate downloaded & verified.' },
                              { time: '2026-07-14 10:10', role: 'admin', detail: 'Admin registry consensus signature created.' }
                            ];
                            setQrModal({ isOpen: true, deedId: item.qrCode || "TD-102-8812", urls, history });
                          }}
                          className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 px-3.5 py-2 rounded-lg border border-slate-200 shadow-sm transition-all text-left w-full justify-between min-h-[44px]"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white p-0.5 rounded border border-slate-200 flex items-center justify-center shrink-0 shadow-inner">
                              <span className="text-[5px] text-black font-mono font-bold leading-none break-all">QR-CODE</span>
                            </div>
                            <div className="text-left font-sans">
                              <p className="text-[8px] text-[#047857] font-extrabold tracking-wider leading-none">VIEW QR KEYS</p>
                              <span className="text-[9px] font-mono text-slate-800 mt-1 block font-bold leading-none">{item.qrCode || "TD-102-8812"}</span>
                            </div>
                          </div>
                          <ChevronRight size={14} className="text-slate-400" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ================= TAB: SETTINGS ================= */}
        {activeTab === 'Settings' && (
          <div className="max-w-4xl space-y-6 animate-in fade-in duration-300 relative z-10">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
              <h3 className="text-sm font-bold mb-6 text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2 text-left">
                <Database size={18} className="text-[#1D4ED8]" />
                <span>PropSight System Registry Settings</span>
              </h3>

              {/* Sub-tab switcher */}
              <div className="flex flex-wrap border-b border-slate-200 mb-6 gap-2">
                {['General', 'Security', 'API Keys', 'Notification Templates', 'Branding'].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSettingsSubTab(sub)}
                    className="px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer min-h-[44px]"
                  >
                    {sub}
                  </button>
                ))}
              </div>

              {/* Subtab content General */}
              {settingsSubTab === 'General' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 text-left">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">System Maintenance Mode</h4>
                      <p className="text-[10px] text-slate-500 mt-1">Restrict public access to ERP interfaces during network upgrades.</p>
                    </div>
                    <button 
                      onClick={() => setSystemSettings({ ...systemSettings, maintenanceMode: !systemSettings.maintenanceMode })}
                      className={`p-1 rounded-full w-12 h-6 transition-all duration-300 cursor-pointer flex items-center ${
                        systemSettings.maintenanceMode ? 'bg-[#B91C1C] justify-end' : 'bg-slate-300 justify-start'
                      }`}
                    >
                      <span className="w-4 h-4 bg-white rounded-full shadow"></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 text-left">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Advanced API Query Caching</h4>
                      <p className="text-[10px] text-slate-500 mt-1">Cache spatial coordinates appraisals on regional nodes to optimize latency.</p>
                    </div>
                    <button 
                      onClick={() => setSystemSettings({ ...systemSettings, apiCaching: !systemSettings.apiCaching })}
                      className={`p-1 rounded-full w-12 h-6 transition-all duration-300 cursor-pointer flex items-center ${
                        systemSettings.apiCaching ? 'bg-[#1D4ED8] justify-end' : 'bg-slate-300 justify-start'
                      }`}
                    >
                      <span className="w-4 h-4 bg-white rounded-full shadow"></span>
                    </button>
                  </div>
                </div>
              )}

              {/* Subtab content Security */}
              {settingsSubTab === 'Security' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 text-left">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">PropSight CyberShield Encryption</h4>
                      <p className="text-[10px] text-slate-500 mt-1">Require signed cryptographic ledger rings for Title Deed downloads.</p>
                    </div>
                    <button 
                      onClick={() => setSystemSettings({ ...systemSettings, securityShield: !systemSettings.securityShield })}
                      className={`p-1 rounded-full w-12 h-6 transition-all duration-300 cursor-pointer flex items-center ${
                        systemSettings.securityShield ? 'bg-[#1D4ED8] justify-end' : 'bg-slate-300 justify-start'
                      }`}
                    >
                      <span className="w-4 h-4 bg-white rounded-full shadow"></span>
                    </button>
                  </div>
                  
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-left">
                    <h4 className="text-xs font-bold text-slate-950 mb-2">Registry DB SQL Dump Backup</h4>
                    <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition cursor-pointer min-h-[44px]">
                      Dump SQL Registry Backup
                    </button>
                  </div>
                </div>
              )}

              {/* Subtab content API Keys */}
              {settingsSubTab === 'API Keys' && (
                <div className="space-y-4 text-left">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Gemini Model API Gateway URL</label>
                    <input 
                      type="text"
                      value={systemSettings.apiEndpoint}
                      onChange={(e) => setSystemSettings({ ...systemSettings, apiEndpoint: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs text-slate-800 outline-none min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Gemini API Key configuration</label>
                    <input 
                      type="password"
                      value="●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●"
                      disabled
                      className="w-full bg-slate-100 border border-slate-200 rounded-lg px-4 py-2.5 text-xs text-slate-400 outline-none min-h-[44px]"
                    />
                    <span className="text-[10px] text-slate-400 block mt-1">Configured securely in root .env file variables.</span>
                  </div>
                </div>
              )}

              {/* Subtab content templates */}
              {settingsSubTab === 'Notification Templates' && (
                <div className="space-y-4 text-left">
                  {templates.map((tpl, i) => (
                    <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                      <strong className="text-xs text-slate-900 block mb-1">{tpl.title}</strong>
                      <p className="text-xs text-slate-500 font-medium">{tpl.body}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Subtab content Branding */}
              {settingsSubTab === 'Branding' && (
                <div className="space-y-4 text-left">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Custom App Branding Name</label>
                    <input 
                      type="text"
                      value={systemSettings.brandingName}
                      onChange={(e) => setSystemSettings({ ...systemSettings, brandingName: e.target.value })}
                      className="w-full bg-slate-50 border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-xs text-slate-800 outline-none min-h-[44px]"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <img src="/favicon-icon.png" alt="branding icon" className="w-10 h-10 object-contain p-1 border border-slate-200 rounded-lg bg-slate-50" />
                    <div>
                      <strong className="text-xs text-slate-900 block">Brand Icon: favicon-icon.png</strong>
                      <span className="text-[10px] text-slate-400">Cropped transparent brand icon loaded dynamically.</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </main>

      {/* Overview Log Detail Modal */}
      {selectedOp && (
        <div className="fixed inset-0 z-50 flex sm:items-center sm:justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedOp(null)} />
          <div className="relative bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-md p-6 shadow-xl border-t sm:border border-slate-200 mt-auto sm:mt-0 max-h-[90vh] sm:max-h-none overflow-y-auto z-10 text-left">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-4">
              <h3 className="text-sm font-extrabold text-slate-900">Operation Log Details</h3>
              <button onClick={() => setSelectedOp(null)} className="text-slate-400 hover:text-slate-650 min-h-[44px] min-w-[44px] flex items-center justify-center"><X size={16} /></button>
            </div>
            <div className="space-y-3.5 text-xs text-slate-705">
              <p><strong>Initiated By:</strong> {selectedOp.user}</p>
              <p><strong>Operation Type:</strong> {selectedOp.action}</p>
              <p><strong>Target Resource:</strong> {selectedOp.target}</p>
              <p><strong>Timestamp:</strong> {selectedOp.time}</p>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[10px]">
                <p className="text-slate-450 uppercase font-bold text-[9px] mb-1">Status Code Payload</p>
                {"{"}
                <br />
                &nbsp;&nbsp;"operationId": "{selectedOp.id}",
                <br />
                &nbsp;&nbsp;"initiatorRole": "VERIFIED_OPERATOR",
                <br />
                &nbsp;&nbsp;"status": "{selectedOp.status}",
                <br />
                &nbsp;&nbsp;"serverNode": "PK-ISB-EDGE-01"
                <br />
                {"}"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Activity Drawer */}
      {viewingUserActivity && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setViewingUserActivity(null)} />
          <div className="relative bg-white w-full sm:w-96 h-full p-6 shadow-2xl border-l border-slate-200 animate-in slide-in-from-right duration-350 z-10 text-left flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-6">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Activity size={16} className="text-blue-655" />
                  <span>Activity: {viewingUserActivity.name}</span>
                </h3>
                <button onClick={() => setViewingUserActivity(null)} className="text-slate-400 hover:text-slate-650 min-h-[44px] min-w-[44px] flex items-center justify-center"><X size={16} /></button>
              </div>
              
              <div className="space-y-4">
                <div className="border-l-2 border-blue-500 pl-3 py-1">
                  <span className="text-[10px] text-slate-400 block font-mono">2026-07-15 01:10</span>
                  <p className="text-xs font-bold text-slate-800">LoggedIn from Chrome (Windows)</p>
                </div>
                <div className="border-l-2 border-slate-300 pl-3 py-1">
                  <span className="text-[10px] text-slate-400 block font-mono">2026-07-14 18:30</span>
                  <p className="text-xs text-slate-700 font-medium">Bidded Rs. 1.62 Crore on Auction id #1</p>
                </div>
                <div className="border-l-2 border-slate-300 pl-3 py-1">
                  <span className="text-[10px] text-slate-400 block font-mono">2026-07-12 11:45</span>
                  <p className="text-xs text-slate-700 font-medium">Generated Smart Build cost report</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setViewingUserActivity(null)}
              className="w-full bg-[#1D4ED8] hover:bg-blue-800 text-white font-bold py-2.5 rounded-lg text-xs transition min-h-[44px] cursor-pointer"
            >
              Close Activity Log
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex sm:items-center sm:justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
          />
          
          <div className="relative bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-sm p-6 shadow-xl border-t sm:border border-slate-200 mt-auto sm:mt-0 max-h-[90vh] sm:max-h-none overflow-y-auto z-10">
            <div className="flex gap-4 items-start text-left">
              <div className={`p-3 rounded-lg shrink-0 ${
                confirmModal.type === 'danger' ? 'bg-red-50 text-red-700 border border-red-100' :
                confirmModal.type === 'warning' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                'bg-blue-50 text-blue-700 border border-blue-100'
              }`}>
                <AlertCircle size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">{confirmModal.title}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed font-semibold">{confirmModal.message}</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition border border-slate-250 cursor-pointer min-h-[44px]"
              >
                Cancel
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className={`px-4 py-2.5 text-white text-xs font-bold rounded-lg transition cursor-pointer shadow-md min-h-[44px] ${
                  confirmModal.type === 'danger' ? 'bg-red-600 hover:bg-red-750' :
                  confirmModal.type === 'warning' ? 'bg-amber-600 hover:bg-amber-750' :
                  'bg-blue-600 hover:bg-blue-750'
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
        <div className="fixed inset-0 z-50 flex sm:items-center sm:justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setQrModal({ isOpen: false, deedId: '', urls: {}, history: [] })}
          />
          
          <div className="relative bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-2xl p-6 shadow-xl border-t sm:border border-slate-200 mt-auto sm:mt-0 max-h-[95vh] overflow-y-auto z-10 text-left">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <QrCode className="text-amber-500 animate-pulse" size={20} />
                  <span>TrustDeed Cryptographic QR Verification Panel</span>
                </h3>
                <p className="text-[10px] text-slate-500 mt-1 font-semibold">Generated credentials for Deed ID: <span className="font-mono text-blue-600 font-bold">{qrModal.deedId}</span></p>
              </div>
              <button 
                onClick={() => setQrModal({ isOpen: false, deedId: '', urls: {} })}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-650 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            {/* QR Codes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(qrModal.urls).map(([role, url]) => (
                <div key={role} className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col items-center relative overflow-hidden group">
                  <span className={`absolute top-2 right-2 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                    role === 'admin' ? 'bg-[#F5F3FF] text-[#7C3AED] border-purple-200' :
                    role === 'buyer' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    role === 'seller' ? 'bg-emerald-50 text-emerald-700 border-emerald-250' :
                    'bg-slate-100 text-slate-650 border-slate-200'
                  }`}>
                    {role}
                  </span>

                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-white p-2.5 rounded-lg mb-3 shadow-sm border border-slate-200 group-hover:scale-105 transition mt-3 block"
                    title="Verify certificate in new tab"
                  >
                    <QRCodeSVG value={url} size={100} />
                  </a>

                  <h4 className="text-xs font-bold text-slate-800 capitalize mb-1">{role} verification key</h4>
                  
                  <div className="flex gap-2 w-full mt-auto pt-4 border-t border-slate-200">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(url);
                        alert(`${role.toUpperCase()} verification link copied!`);
                      }}
                      className="flex-1 py-2.5 bg-white hover:bg-slate-50 text-slate-650 rounded-lg border border-slate-250 text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer min-h-[44px]"
                    >
                      Copy Link
                    </button>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 bg-[#1D4ED8] hover:bg-blue-800 text-white rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 text-center min-h-[44px] flex items-center"
                    >
                      Audit Link
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Audit Scan logs trail */}
            {qrModal.history && qrModal.history.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Cryptographic scan logs trail</h4>
                <div className="space-y-2.5">
                  {qrModal.history.map((h, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px] p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <span className="font-semibold text-slate-700">{h.detail}</span>
                      <span className="font-mono text-[9px] text-slate-400 font-bold">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Sidebar item sub-component
const SidebarItem = ({ icon: Icon, text, active, onClick, isOpen, isAi }) => (
  <li 
    onClick={onClick}
    className={`
      flex items-center cursor-pointer px-4 py-3 rounded-lg transition-all duration-300 mb-1 font-bold text-xs relative group min-h-[44px]
      ${active 
        ? 'bg-[#1D4ED8] text-white shadow-sm' 
        : 'text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A] border border-transparent'}
    `}
  >
    <Icon size={16} className={`min-w-[16px] shrink-0 transition-transform duration-300 ${active ? 'scale-105 text-white' : 'group-hover:scale-110 text-slate-455 group-hover:text-[#1D4ED8]'}`} />
    <span className={`ml-3 whitespace-nowrap transition-all duration-300 font-bold ${!isOpen ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
      {text}
    </span>
    {isAi && isOpen && (
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-green-pulse shrink-0 ml-1.5" />
    )}
    {active && isOpen && (
      <span className="absolute right-3.5 w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
    )}
  </li>
);

export default AdminDashboard;