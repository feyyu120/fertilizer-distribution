import { useEffect, useState } from 'react';
import { Truck, Plus, Trash2, X, Save, MapPin, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';

interface Supplier { 
    _id: string; 
    supplierName: string; 
    phone: string; 
    address: string; 
    region: string; 
    city: string; 
}

const empty = { supplierName: '', phone: '', address: '', region: '', city: '' };

const SuppliersTab = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<any>(empty);

  const load = () => api.getSuppliers().then(d => { setSuppliers(d); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(empty); setModal(true); };

  const handleSave = async () => {
    if (!form.supplierName || !form.phone) { toast.error('Name and Phone are required'); return; }
    try {
      const n = await api.addSupplier(form);
      setSuppliers(s => [n, ...s]);
      toast.success('Supplier added');
      setModal(false);
    } catch { toast.error('Failed to save'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this supplier?')) return;
    try { await api.deleteSupplier(id); setSuppliers(s => s.filter(x => x._id !== id)); toast.success('Deleted'); } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <Truck className="text-purple-600 dark:text-purple-400" size={24} />
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Fertilizer Suppliers</h2>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium text-sm transition"><Plus size={18} /> Add Supplier</button>
      </div>

      {suppliers.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-10 border border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 shadow-sm transition-colors"><Truck size={48} className="mx-auto mb-4 opacity-30" /><p>No suppliers found</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliers.map(s => (
            <div key={s._id} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 hover:border-green-500 dark:hover:border-green-700 shadow-sm transition-all group">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{s.supplierName}</h3>
                <button onClick={() => handleDelete(s._id)} className="text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Phone size={14} className="text-green-500" />
                  <span>{s.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin size={14} className="text-blue-500" />
                  <span>{s.city}, {s.region}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 italic">{s.address}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700 shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add New Supplier</h3>
              <button onClick={() => setModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Supplier Name *</label>
                <input type="text" value={form.supplierName} onChange={e => setForm((p: any) => ({ ...p, supplierName: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-transparent text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all" />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Phone Number *</label>
                <input type="text" value={form.phone} onChange={e => setForm((p: any) => ({ ...p, phone: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-transparent text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Region</label>
                  <input type="text" value={form.region} onChange={e => setForm((p: any) => ({ ...p, region: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-transparent text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">City</label>
                  <input type="text" value={form.city} onChange={e => setForm((p: any) => ({ ...p, city: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-transparent text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Address</label>
                <textarea value={form.address} onChange={e => setForm((p: any) => ({ ...p, address: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-transparent text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none" rows={2} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(false)} className="flex-1 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2"><Save size={16} /> Save Supplier</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuppliersTab;
