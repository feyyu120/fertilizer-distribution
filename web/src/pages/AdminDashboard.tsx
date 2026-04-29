import { useState } from 'react';
import {
  LayoutDashboard, Users, Package, ShoppingCart,
  Newspaper, MessageSquare, Menu, X, LogOut, Leaf
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import OverviewTab from '../components/admin/OverviewTab';
import FarmersTab from '../components/admin/FarmersTab';
import FertilizersTab from '../components/admin/FertilizersTab';
import OrdersTab from '../components/admin/OrdersTab';
import NewsTab from '../components/admin/NewsTab';
import MessagesTab from '../components/admin/MessagesTab';
import ThemeToggle from '../components/ThemeToggle';

type Tab = 'overview' | 'farmers' | 'fertilizers' | 'orders' | 'news' | 'messages';

const navItems: { label: string; tab: Tab; icon: any; color: string }[] = [
  { label: 'Overview',    tab: 'overview',     icon: LayoutDashboard, color: 'text-green-400' },
  { label: 'Farmers',     tab: 'farmers',      icon: Users,           color: 'text-blue-400' },
  { label: 'Fertilizers', tab: 'fertilizers',  icon: Package,         color: 'text-amber-400' },
  { label: 'Orders',      tab: 'orders',       icon: ShoppingCart,    color: 'text-indigo-400' },
  { label: 'News & Posts',tab: 'news',         icon: Newspaper,       color: 'text-purple-400' },
  { label: 'Messages',    tab: 'messages',     icon: MessageSquare,   color: 'text-pink-400' },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleNav = (tab: Tab) => { setActiveTab(tab); setSidebarOpen(false); };

  const tabTitles: Record<Tab, string> = {
    overview: 'Dashboard Overview', farmers: 'Farmer Verification',
    fertilizers: 'Fertilizer Inventory', orders: 'Order Management',
    news: 'News & Posts', messages: 'Support Messages',
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <Toaster position="top-right" />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-30
        w-64 bg-black border-r border-gray-800 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
              <Leaf size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">FertilizerHub</h1>
              <p className="text-xs text-green-500 font-medium mt-0.5">ADMIN PANEL</p>
            </div>
          </div>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.tab}
              onClick={() => handleNav(item.tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all text-sm font-medium ${
                activeTab === item.tab
                  ? 'bg-green-600 text-white'
                  : 'hover:bg-gray-900 text-gray-400 hover:text-white'
              }`}
            >
              <item.icon size={18} className={activeTab === item.tab ? 'text-white' : item.color} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-9 h-9 bg-green-700 rounded-full flex items-center justify-center text-sm font-bold">A</div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">Administrator</p>
              <p className="text-xs text-gray-500 truncate">admin@fertilizerhub.et</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 justify-center py-2.5 text-red-400 hover:bg-red-950/50 rounded-xl text-sm font-medium transition"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-800 rounded-lg">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <Leaf size={18} className="text-green-500" />
            <span className="font-bold text-sm">FertilizerHub Admin</span>
          </div>
          <ThemeToggle />
        </header>

        {/* Page header */}
        <div className="hidden md:flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-950">
          <h1 className="text-2xl font-bold">{tabTitles[activeTab]}</h1>
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <ThemeToggle />
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="md:hidden mb-4">
            <h2 className="text-xl font-bold">{tabTitles[activeTab]}</h2>
          </div>
          {activeTab === 'overview'    && <OverviewTab />}
          {activeTab === 'farmers'     && <FarmersTab />}
          {activeTab === 'fertilizers' && <FertilizersTab />}
          {activeTab === 'orders'      && <OrdersTab />}
          {activeTab === 'news'        && <NewsTab />}
          {activeTab === 'messages'    && <MessagesTab />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;