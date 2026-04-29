import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, UserCheck, Trash2, ShieldAlert, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';

interface Farmer { _id: string; fullname: string; phone: string; email?: string; address?: string; landSize?: string; status: string; createdAt: string; }

const FarmersTab = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = () => { 
    api.getAllFarmers().then(d => { 
      setFarmers(d); 
      setLoading(false); 
    }).catch(() => setLoading(false)); 
  };
  
  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.updateFarmerStatus(id, newStatus);
      toast.success(`Farmer marked as ${newStatus}`);
      setFarmers(f => f.map(x => x._id === id ? { ...x, status: newStatus } : x));
    } catch { toast.error('Status update failed'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to completely delete this farmer from the database? This action cannot be undone.')) return;
    try {
      await api.deleteFarmer(id);
      toast.success('Farmer deleted successfully');
      setFarmers(f => f.filter(x => x._id !== id));
    } catch { toast.error('Failed to delete farmer'); }
  };

  const filteredFarmers = filter === 'all' ? farmers : farmers.filter(f => f.status === filter);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <UserCheck className="text-blue-400" size={24} />
          <h2 className="text-xl md:text-2xl font-bold">Farmers Directory</h2>
          <span className="bg-blue-500/20 text-blue-400 text-xs px-3 py-1 rounded-full font-medium">{farmers.length} Total</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'approved', 'pending', 'rejected'].map(s => (
            <button 
              key={s} 
              onClick={() => setFilter(s)} 
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition ${filter === s ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            >
              {s === 'approved' ? 'Verified' : s}
            </button>
          ))}
        </div>
      </div>

      {filteredFarmers.length === 0 ? (
        <div className="bg-gray-900 rounded-2xl p-10 border border-gray-800 text-center text-gray-500">
          <UserCheck size={48} className="mx-auto mb-4 opacity-30" />
          <p>No farmers found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFarmers.map(f => (
            <div key={f._id} className="bg-gray-900 rounded-2xl p-4 md:p-6 border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-gray-700">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-lg">{f.fullname}</p>
                  {f.status === 'approved' ? (
                    <span className="flex items-center gap-1 bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      <ShieldCheck size={12} /> Verified
                    </span>
                  ) : f.status === 'pending' ? (
                    <span className="flex items-center gap-1 bg-orange-500/20 text-orange-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      <ShieldAlert size={12} /> Pending
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      <XCircle size={12} /> Rejected
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400">{f.phone} {f.email ? `• ${f.email}` : ''}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                  {f.landSize && <p className="text-xs text-gray-500"><span className="text-gray-600">Land:</span> {f.landSize}</p>}
                  {f.address && <p className="text-xs text-gray-500"><span className="text-gray-600">Loc:</span> {f.address}</p>}
                </div>
                <p className="text-xs text-gray-600 mt-2">Joined: {new Date(f.createdAt).toLocaleDateString()}</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                {f.status !== 'approved' && (
                  <button 
                    onClick={() => handleStatusChange(f._id, 'approved')} 
                    className="flex items-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-xl text-sm font-medium transition shadow-lg shadow-green-900/20"
                  >
                    <CheckCircle size={15} /> Verify
                  </button>
                )}
                {f.status !== 'pending' && (
                  <button 
                    onClick={() => handleStatusChange(f._id, 'pending')} 
                    className="flex items-center gap-1.5 px-3 py-2 bg-orange-600/80 hover:bg-orange-700 rounded-xl text-sm font-medium transition"
                  >
                    <ShieldAlert size={15} /> Set Pending
                  </button>
                )}
                
                <div className="w-px h-8 bg-gray-800 mx-1 hidden md:block"></div>
                
                <button 
                  onClick={() => handleDelete(f._id)} 
                  className="flex items-center gap-1.5 px-3 py-2 border border-red-900/50 text-red-400 hover:bg-red-950 hover:text-red-300 rounded-xl text-sm font-medium transition"
                >
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmersTab;
