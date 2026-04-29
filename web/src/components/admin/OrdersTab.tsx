import { useEffect, useState } from 'react';
import { ShoppingCart, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';

interface Order {
  _id: string; farmerName: string; farmerPhone: string; deliveryAddress: string;
  totalAmount: number; status: string; paymentMethod: string;
  fertilizers: { name: string; quantity: number; pricePerQuintal: number }[];
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400',
  approved: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
  processing: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  delivered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
};

const OrdersTab = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = () => api.getOrders().then(d => { setOrders(d); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleStatus = async (id: string, status: string) => {
    try {
      const updated = await api.updateOrderStatus(id, status);
      setOrders(o => o.map(x => x._id === id ? { ...x, status: updated.status } : x));
      toast.success(`Order ${status}`);
    } catch { toast.error('Failed'); }
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <ShoppingCart className="text-blue-600 dark:text-blue-400" size={24} />
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white transition-colors">Orders</h2>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'approved', 'delivered', 'cancelled'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition ${filter === s ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>{s}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-10 border border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 shadow-sm dark:shadow-none transition-colors"><ShoppingCart size={48} className="mx-auto mb-4 opacity-30" /><p>No orders found</p></div>
      ) : (
        <div className="space-y-3">
          {filtered.map(o => (
            <div key={o._id} className="bg-white dark:bg-gray-900 rounded-2xl p-4 md:p-6 border border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none transition-all hover:border-gray-300 dark:hover:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900 dark:text-white transition-colors">{o.farmerName}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[o.status] || ''}`}>{o.status.toUpperCase()}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">{o.farmerPhone} • {o.deliveryAddress}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">{o.paymentMethod} • <span className="text-gray-900 dark:text-white font-medium transition-colors">ETB {o.totalAmount}</span></p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {o.fertilizers?.map((f, i) => (
                      <span key={i} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-lg transition-colors">{f.name} × {f.quantity}Q</span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 transition-colors">{new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
                {o.status === 'pending' && (
                  <div className="flex gap-2">
                    <button onClick={() => handleStatus(o._id, 'approved')} className="flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm transition"><CheckCircle size={15} /> Approve</button>
                    <button onClick={() => handleStatus(o._id, 'cancelled')} className="flex items-center gap-1 px-3 py-2 bg-red-600/80 hover:bg-red-700 text-white rounded-xl text-sm transition"><XCircle size={15} /> Reject</button>
                  </div>
                )}
                {o.status === 'approved' && (
                  <button onClick={() => handleStatus(o._id, 'delivered')} className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm transition"><Clock size={15} /> Mark Delivered</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersTab;
