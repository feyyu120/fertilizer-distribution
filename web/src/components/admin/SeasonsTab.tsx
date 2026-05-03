import { useEffect, useState } from 'react';
import { Calendar, Plus, Trash2, X, Save, Circle } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';

interface Season { 
    _id: string; 
    seasonName: string; 
    year: string; 
    isActive: boolean; 
    createdAt: string; 
}

const empty = { seasonName: 'Summer', year: new Date().getFullYear().toString() };

const SeasonsTab = () => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<any>(empty);

  const load = () => api.getSeasons().then(d => { setSeasons(d); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(empty); setModal(true); };

  const handleSave = async () => {
    if (!form.seasonName || !form.year) { toast.error('Fill all fields'); return; }
    try {
      const n = await api.addSeason(form);
      setSeasons(s => [n, ...s]);
      toast.success('Season added');
      setModal(false);
    } catch { toast.error('Failed to save'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this season?')) return;
    try { await api.deleteSeason(id); setSeasons(s => s.filter(x => x._id !== id)); toast.success('Deleted'); } catch { toast.error('Failed'); }
  };

  const handleActivate = async (id: string) => {
    try {
      await api.activateSeason(id);
      setSeasons(s => s.map(x => ({ ...x, isActive: x._id === id })));
      toast.success('Season activated');
    } catch { toast.error('Failed to activate'); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="text-blue-600 dark:text-blue-400" size={24} />
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Agricultural Seasons</h2>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium text-sm transition"><Plus size={18} /> Add Season</button>
      </div>

      {seasons.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-10 border border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 shadow-sm transition-colors"><Calendar size={48} className="mx-auto mb-4 opacity-30" /><p>No seasons found</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {seasons.map(s => (
            <div key={s._id} className={`bg-white dark:bg-gray-900 rounded-2xl p-5 border shadow-sm transition-all ${s.isActive ? 'border-green-500 ring-1 ring-green-500/20' : 'border-gray-200 dark:border-gray-800'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{s.seasonName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{s.year}</p>
                </div>
                {s.isActive ? (
                  <span className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-200 dark:border-green-800">ACTIVE</span>
                ) : (
                  <button onClick={() => handleActivate(s._id)} className="text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center gap-1 text-xs font-medium"><Circle size={14} /> Set Active</button>
                )}
              </div>
              
              <div className="flex gap-2 mt-4">
                <button onClick={() => handleDelete(s._id)} className="flex-1 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl flex items-center justify-center gap-1 text-sm font-medium transition"><Trash2 size={15} /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700 shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add New Season</h3>
              <button onClick={() => setModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Season Name *</label>
                <select value={form.seasonName} onChange={e => setForm((p: any) => ({ ...p, seasonName: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-transparent text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all">
                  <option value="Summer">Summer</option>
                  <option value="Winter">Winter</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Year *</label>
                <input type="text" value={form.year} onChange={e => setForm((p: any) => ({ ...p, year: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-transparent text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all" placeholder="e.g. 2024" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(false)} className="flex-1 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2"><Save size={16} /> Save Season</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeasonsTab;
