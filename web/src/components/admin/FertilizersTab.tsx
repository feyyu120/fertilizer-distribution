import { useEffect, useState } from 'react';
import { Package, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';

interface Fertilizer { _id: string; name: string; type: string; quantity: number; pricePerQuintal: number; status: string; }
const empty = { name: '', type: '', quantity: 0, pricePerQuintal: 0, status: 'available' };

const FertilizersTab = () => {
  const [fertilizers, setFertilizers] = useState<Fertilizer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Fertilizer | null>(null);
  const [form, setForm] = useState<any>(empty);

  const load = () => api.getFertilizers().then(d => { setFertilizers(d); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(empty); setEditing(null); setModal(true); };
  const openEdit = (f: Fertilizer) => { setForm({ name: f.name, type: f.type, quantity: f.quantity, pricePerQuintal: f.pricePerQuintal, status: f.status }); setEditing(f); setModal(true); };

  const handleSave = async () => {
    if (!form.name || !form.quantity || !form.pricePerQuintal) { toast.error('Fill all required fields'); return; }
    const payload = { ...form, quantity: Number(form.quantity), pricePerQuintal: Number(form.pricePerQuintal), status: Number(form.quantity) > 100 ? 'available' : 'low' };
    try {
      if (editing) { const u = await api.updateFertilizer(editing._id, payload); setFertilizers(f => f.map(x => x._id === editing._id ? u : x)); toast.success('Fertilizer updated'); }
      else { const n = await api.addFertilizer(payload); setFertilizers(f => [n, ...f]); toast.success('Fertilizer added'); }
      setModal(false);
    } catch { toast.error('Failed to save'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this fertilizer?')) return;
    try { await api.deleteFertilizer(id); setFertilizers(f => f.filter(x => x._id !== id)); toast.success('Deleted'); } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <Package className="text-amber-600 dark:text-amber-400" size={24} />
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white transition-colors">Fertilizer Inventory</h2>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium text-sm transition"><Plus size={18} /> Add New</button>
      </div>

      {fertilizers.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-10 border border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 shadow-sm dark:shadow-none transition-colors"><Package size={48} className="mx-auto mb-4 opacity-30" /><p>No fertilizers found</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {fertilizers.map(f => (
            <div key={f._id} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 hover:border-green-500 dark:hover:border-green-700 shadow-sm dark:shadow-none transition-all">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors">{f.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">{f.type}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${f.status === 'available' ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' : 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400'} transition-colors`}>{f.status.toUpperCase()}</span>
              </div>
              <div className="space-y-1 text-sm mb-4">
                <p><span className="text-gray-500 dark:text-gray-400 transition-colors">Qty:</span> <span className="font-semibold text-gray-900 dark:text-white transition-colors">{f.quantity} Quintal</span></p>
                <p><span className="text-gray-500 dark:text-gray-400 transition-colors">Price:</span> <span className="font-semibold text-gray-900 dark:text-white transition-colors">ETB {f.pricePerQuintal}/Q</span></p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(f)} className="flex-1 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl flex items-center justify-center gap-1 text-sm transition-colors"><Edit2 size={15} /> Edit</button>
                <button onClick={() => handleDelete(f._id)} className="flex-1 py-2 bg-red-600/70 hover:bg-red-700 text-white rounded-xl flex items-center justify-center gap-1 text-sm transition"><Trash2 size={15} /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700 shadow-2xl transition-colors">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">{editing ? 'Edit Fertilizer' : 'Add Fertilizer'}</h3>
              <button onClick={() => setModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              {[['Name *', 'name', 'text'], ['Type', 'type', 'text'], ['Quantity (Quintal) *', 'quantity', 'number'], ['Price per Quintal (ETB) *', 'pricePerQuintal', 'number']].map(([label, key, type]) => (
                <div key={key}>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block transition-colors">{label}</label>
                  <input type={type} value={form[key]} onChange={e => setForm((p: any) => ({ ...p, [key]: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-transparent text-gray-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 transition-all" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setModal(false)} className="flex-1 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition"><Save size={16} /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FertilizersTab;
