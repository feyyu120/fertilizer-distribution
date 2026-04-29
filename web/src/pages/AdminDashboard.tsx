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
  { label: 'Overview',    tab: 'overview',     icon: LayoutDashboard, color: 'text-green-600 dark:text-green-400' },
  { label: 'Farmers',     tab: 'farmers',      icon: Users,           color: 'text-blue-600 dark:text-blue-400' },
  { label: 'Fertilizers', tab: 'fertilizers',  icon: Package,         color: 'text-amber-600 dark:text-amber-400' },
  { label: 'Orders',      tab: 'orders',       icon: ShoppingCart,    color: 'text-indigo-600 dark:text-indigo-400' },
  { label: 'News & Posts',tab: 'news',         icon: Newspaper,       color: 'text-purple-600 dark:text-purple-400' },
  { label: 'Messages',    tab: 'messages',     icon: MessageSquare,   color: 'text-pink-600 dark:text-pink-400' },
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
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white overflow-hidden transition-colors duration-300">
      <Toaster position="top-right" />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 md:hidden transition-opacity" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-30
        w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 flex flex-col
        transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center shadow-sm">
              <Leaf size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none text-gray-900 dark:text-white transition-colors duration-300">FertilizerHub</h1>
              <p className="text-xs text-green-600 dark:text-green-500 font-bold mt-0.5 transition-colors duration-300">ADMIN PANEL</p>
            </div>
          </div>
          <button className="md:hidden text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-300" onClick={() => setSidebarOpen(false)}>
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
                  ? 'bg-green-600 text-white shadow-md'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <item.icon size={18} className={activeTab === item.tab ? 'text-white' : item.color} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-9 h-9 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300">A</div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate text-gray-900 dark:text-white transition-colors duration-300">Administrator</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate transition-colors duration-300">admin@fertilizerhub.et</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 justify-center py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl text-sm font-bold transition-colors duration-300"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <Leaf size={18} className="text-green-600 dark:text-green-500 transition-colors" />
            <span className="font-bold text-sm text-gray-900 dark:text-white transition-colors">FertilizerHub Admin</span>
          </div>
          <ThemeToggle />
        </header>

        {/* Page header */}
        <div className="hidden md:flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 transition-colors duration-300">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{tabTitles[activeTab]}</h1>
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium transition-colors duration-300">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <ThemeToggle />
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
          <div className="md:hidden mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{tabTitles[activeTab]}</h2>
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