import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  // Mock Data for PropSight AI context
  const stats = [
    { title: 'Total Properties', value: '1,240', change: '+12%', icon: Building2, color: 'bg-blue-500' },
    { title: 'Active Users', value: '856', change: '+5%', icon: Users, color: 'bg-green-500' },
    { title: 'AI Valuations Run', value: '3,402', change: '+18%', icon: BrainCircuit, color: 'bg-purple-500' }, // Specific to PropPredict
    { title: 'Pending Verifications', value: '14', change: '-2%', icon: QrCode, color: 'bg-orange-500' }, // Specific to TrustDeed
  ];

  const recentActivity = [
    { id: 1, user: 'Ali Khan', action: 'Requested Valuation', target: '10 Marla House, Faisalabad', time: '2 mins ago', status: 'Processing' },
    { id: 2, user: 'Sarah Ahmed', action: 'New Property Listing', target: 'Apartment in Lahore', time: '15 mins ago', status: 'Completed' },
    { id: 3, user: 'System', action: 'TrustDeed Verification', target: 'Transaction #9921', time: '1 hour ago', status: 'Flagged' },
    { id: 4, user: 'Bilal Tech', action: 'Cost Estimation', target: '5 Marla Construction', time: '3 hours ago', status: 'Completed' },
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gray-800 transition-all duration-300 flex flex-col border-r border-gray-700`}>
        <div className="p-4 flex items-center justify-between h-16 border-b border-gray-700">
          {isSidebarOpen && <h1 className="text-xl font-bold text-blue-400 tracking-wider">PropSight<span className="text-white">AI</span></h1>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-gray-700 rounded">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            <SidebarItem icon={LayoutDashboard} text="Overview" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} isOpen={isSidebarOpen} />
            <SidebarItem icon={Users} text="User Management" active={activeTab === 'Users'} onClick={() => setActiveTab('Users')} isOpen={isSidebarOpen} />
            <SidebarItem icon={Building2} text="Properties" active={activeTab === 'Properties'} onClick={() => setActiveTab('Properties')} isOpen={isSidebarOpen} />
            
            {/* FYP Specific Modules */}
            <div className={`mt-4 mb-2 px-4 text-xs font-semibold text-gray-500 uppercase ${!isSidebarOpen && 'hidden'}`}>
              AI & Security
            </div>
            <SidebarItem icon={BrainCircuit} text="PropPredict Models" active={activeTab === 'AI'} onClick={() => setActiveTab('AI')} isOpen={isSidebarOpen} />
            <SidebarItem icon={QrCode} text="TrustDeed Requests" active={activeTab === 'TrustDeed'} onClick={() => setActiveTab('TrustDeed')} isOpen={isSidebarOpen} />
            
            <div className={`mt-4 mb-2 px-4 text-xs font-semibold text-gray-500 uppercase ${!isSidebarOpen && 'hidden'}`}>
              System
            </div>
            <SidebarItem icon={Settings} text="Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} isOpen={isSidebarOpen} />
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button className="flex items-center w-full p-2 text-red-400 hover:bg-gray-700 rounded transition-colors">
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-900 p-6">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">{activeTab}</h2>
            <p className="text-gray-400 text-sm">Welcome back, Administrator.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm border border-green-500/20">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              System Online
            </div>
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center border border-gray-600">
              <span className="font-bold">AD</span>
            </div>
          </div>
        </header>

        {/* Dashboard Widgets */}
        {activeTab === 'Overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-400 text-sm">{stat.title}</p>
                      <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color} bg-opacity-20 text-white`}>
                      <stat.icon size={24} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-green-400">
                    <TrendingUp size={16} className="mr-1" />
                    <span>{stat.change}</span>
                    <span className="text-gray-500 ml-2">from last month</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content Area: Recent Activity & AI Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Recent Activity Table */}
              <div className="lg:col-span-2 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                  <h3 className="text-lg font-bold">Recent System Activity</h3>
                  <button className="text-sm text-blue-400 hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-gray-700/50 text-gray-200 uppercase font-medium">
                      <tr>
                        <th className="px-6 py-3">User</th>
                        <th className="px-6 py-3">Action</th>
                        <th className="px-6 py-3">Time</th>
                        <th className="px-6 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {recentActivity.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-700/30 transition-colors">
                          <td className="px-6 py-4 font-medium text-white">{item.user}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span>{item.action}</span>
                              <span className="text-xs text-gray-500">{item.target}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">{item.time}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs border ${
                              item.status === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                              item.status === 'Flagged' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                              'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
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

              {/* AI Server Status */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <BrainCircuit size={20} className="text-purple-400"/> 
                  AI Model Health
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">PropPredict Accuracy</span>
                      <span className="text-green-400">94.2%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Server Load</span>
                      <span className="text-orange-400">62%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                    </div>
                  </div>

                  <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20 flex items-start gap-3">
                    <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-red-400">Potential Anomaly</h4>
                      <p className="text-xs text-gray-400 mt-1">High variance detected in valuation estimates for Sector B.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Simple helper component for Sidebar items
const SidebarItem = ({ icon: Icon, text, active, onClick, isOpen }) => (
  <li 
    onClick={onClick}
    className={`
      flex items-center cursor-pointer p-3 rounded-lg transition-colors mb-1
      ${active ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}
    `}
  >
    <Icon size={20} className="min-w-[20px]" />
    <span className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${!isOpen && 'opacity-0 hidden'}`}>
      {text}
    </span>
  </li>
);

export default AdminDashboard;