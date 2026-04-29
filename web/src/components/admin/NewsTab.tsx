import { useEffect, useState } from 'react';
import { Newspaper, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';

interface NewsPost { _id: string; title: string; caption: string; image: string; user: string; createdAt: string; comments?: any[]; }
const empty = { title: '', caption: '', image: '', user: 'Admin' };

const NewsTab = () => {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<NewsPost | null>(null);
  const [form, setForm] = useState<any>(empty);

  const load = () => api.getNews().then(d => { setPosts(d); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(empty); setEditing(null); setModal(true); };
  const openEdit = (p: NewsPost) => { setForm({ title: p.title, caption: p.caption, image: p.image, user: p.user }); setEditing(p); setModal(true); };

  const handleSave = async () => {
    if (!form.title || !form.caption) { toast.error('Title and content are required'); return; }
    try {
      if (editing) { const u = await api.updateNews(editing._id, form); setPosts(p => p.map(x => x._id === editing._id ? u : x)); toast.success('Post updated'); }
      else { const n = await api.addNews(form); setPosts(p => [n, ...p]); toast.success('Post published'); }
      setModal(false);
    } catch { toast.error('Failed to save'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    try { await api.deleteNews(id); setPosts(p => p.filter(x => x._id !== id)); toast.success('Deleted'); } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <Newspaper className="text-purple-600 dark:text-purple-400" size={24} />
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white transition-colors">News & Posts</h2>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium text-sm transition"><Plus size={18} /> New Post</button>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-10 border border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 shadow-sm dark:shadow-none transition-colors"><Newspaper size={48} className="mx-auto mb-4 opacity-30" /><p>No posts yet</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map(p => (
            <div key={p._id} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col shadow-sm dark:shadow-none transition-all hover:border-gray-300 dark:hover:border-gray-700">
              {p.image && <img src={p.image} alt={p.title} className="w-full h-40 object-cover" onError={e => (e.currentTarget.style.display = 'none')} />}
              <div className="p-4 flex flex-col flex-grow">
                <p className="font-bold text-lg leading-tight mb-1 text-gray-900 dark:text-white transition-colors">{p.title}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 transition-colors">{p.caption}</p>
                <div className="flex items-center justify-between mt-3 mb-3">
                  <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{p.user} • {new Date(p.createdAt).toLocaleDateString()}</span>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="p-1.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(p._id)} className="p-1.5 bg-red-600/70 hover:bg-red-700 text-white rounded-lg transition"><Trash2 size={14} /></button>
                  </div>
                </div>
                
                {/* Admin Comments View */}
                {p.comments && p.comments.length > 0 && (
                  <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800 transition-colors">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 transition-colors">Comments ({p.comments.length})</p>
                    <div className="space-y-2 max-h-[100px] overflow-y-auto custom-scrollbar pr-1">
                      {p.comments.map((c: any, i: number) => (
                        <div key={i} className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg transition-colors">
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors">{c.userName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 transition-colors">{c.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-lg border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto shadow-2xl transition-colors">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">{editing ? 'Edit Post' : 'New Post'}</h3>
              <button onClick={() => setModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              {[['Title *', 'title'], ['Author', 'user'], ['Image URL', 'image']].map(([label, key]) => (
                <div key={key}>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block transition-colors">{label}</label>
                  <input value={form[key]} onChange={e => setForm((p: any) => ({ ...p, [key]: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-transparent text-gray-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 transition-all" />
                </div>
              ))}
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block transition-colors">Content *</label>
                <textarea value={form.caption} onChange={e => setForm((p: any) => ({ ...p, caption: e.target.value }))} rows={4} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-transparent text-gray-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 resize-none transition-all" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setModal(false)} className="flex-1 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition"><Save size={16} /> Publish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsTab;
