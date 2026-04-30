import { useEffect, useState } from 'react';
import { Users, CheckCircle, Package, Clock, TrendingUp, MessageSquare, ShoppingCart, CheckCircle2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';

interface Order {
  _id: string; farmerName: string; farmerPhone: string; totalAmount: number;
  status: string; paymentMethod: string; createdAt: string;
}
interface Farmer { _id: string; fullname: string; phone: string; landSize?: string; createdAt: string; }

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400',
  approved: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
  processing: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  delivered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
};

const OverviewTab = () => {
  const [stats, setStats] = useState({ totalFarmers: 0, verifiedFarmers: 0, pendingFarmers: 0, totalFertilizers: 0, totalQuintals: 0 });
  const [totalMessages, setTotalMessages] = useState(0);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [pendingFarmers, setPendingFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getStats(),
      api.getMessages(),
      api.getOrders(),
      api.getPendingFarmers(),
    ]).then(([statsData, messages, orders, farmers]) => {
      setStats(statsData);
      setTotalMessages(messages.length);
      setRecentOrders(orders.slice(0, 5));
      setPendingFarmers(farmers.slice(0, 5));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleFarmerAction = async (id: string, status: string) => {
    // Optimistic Update
    const previousPending = [...pendingFarmers];
    setPendingFarmers(f => f.filter(x => x._id !== id));
    toast.success(`Farmer ${status}`);

    try {
      await api.approveFarmer(id, status);
    } catch {
      toast.error('Action failed');
      setPendingFarmers(previousPending); // Revert
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const cards = [
    { title: 'Total Farmers', value: stats.totalFarmers, change: `${stats.pendingFarmers} pending`, icon: Users, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-500/10' },
    { title: 'Verified Farmers', value: stats.verifiedFarmers, change: stats.totalFarmers > 0 ? `${Math.round((stats.verifiedFarmers / stats.totalFarmers) * 100)}% verified` : '0%', icon: CheckCircle, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-500/10' },
    { title: 'Fertilizer Stock (Q)', value: stats.totalQuintals, change: `${stats.totalFertilizers} types`, icon: Package, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-500/10' },
    { title: 'Pending Farmers', value: stats.pendingFarmers, change: 'Requires action', icon: Clock, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-500/10' },
    { title: 'Total Messages', value: totalMessages, change: 'Support inbox', icon: MessageSquare, color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-100 dark:bg-pink-500/10' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 hover:border-green-500 dark:hover:border-green-700 shadow-sm dark:shadow-none transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon className={stat.color} size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold mb-1 text-gray-900 dark:text-white transition-colors">{stat.value}</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs transition-colors">{stat.title}</p>
            <p className="text-green-600 dark:text-green-400 text-xs mt-2 flex items-center gap-1 transition-colors">
              <TrendingUp size={12} /> {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom two panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm dark:shadow-none transition-colors">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200 dark:border-gray-800 transition-colors">
            <ShoppingCart className="text-indigo-600 dark:text-indigo-400" size={20} />
            <h3 className="font-semibold text-gray-900 dark:text-white transition-colors">Recent Orders</h3>
            <span className="ml-auto text-xs text-gray-500 dark:text-gray-400 transition-colors">{recentOrders.length} shown</span>
          </div>
          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm transition-colors">
              <ShoppingCart size={36} className="mx-auto mb-3 opacity-20" />
              No orders yet
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentOrders.map(order => (
                <div key={order._id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate text-gray-900 dark:text-white transition-colors">{order.farmerName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{order.farmerPhone} • ETB {order.totalAmount}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 transition-colors">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`ml-3 shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || ''}`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Farmers */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm dark:shadow-none transition-colors">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200 dark:border-gray-800 transition-colors">
            <Clock className="text-orange-600 dark:text-orange-400" size={20} />
            <h3 className="font-semibold text-gray-900 dark:text-white transition-colors">Pending Farmer Verification</h3>
            <span className="ml-auto text-xs text-gray-500 dark:text-gray-400 transition-colors">{pendingFarmers.length} pending</span>
          </div>
          {pendingFarmers.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm transition-colors">
              <CheckCircle size={36} className="mx-auto mb-3 opacity-20" />
              No pending farmers
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {pendingFarmers.map(f => (
                <div key={f._id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate text-gray-900 dark:text-white transition-colors">{f.fullname}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{f.phone}{f.landSize && ` • ${f.landSize}`}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 transition-colors">{new Date(f.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2 ml-3 shrink-0">
                    <button
                      onClick={() => handleFarmerAction(f._id, 'approved')}
                      className="p-1.5 bg-green-600/80 hover:bg-green-600 text-white rounded-lg transition"
                      title="Approve"
                    >
                      <CheckCircle2 size={15} />
                    </button>
                    <button
                      onClick={() => handleFarmerAction(f._id, 'rejected')}
                      className="p-1.5 bg-red-600/70 hover:bg-red-600 text-white rounded-lg transition"
                      title="Reject"
                    >
                      <XCircle size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default OverviewTab;
