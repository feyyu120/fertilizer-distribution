import { useEffect, useState } from 'react';
import { MessageSquare, Reply, Trash2, Send, X, Mail, MailOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';

interface Message { _id: string; name: string; phone: string; message: string; status: string; reply?: string; repliedBy?: string; createdAt: string; }

const statusBadge: Record<string, string> = {
  unread: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
  read: 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400',
  replied: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
};

const MessagesTab = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const load = () => api.getMessages().then(d => { setMessages(d); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleReply = async (id: string) => {
    if (!replyText.trim()) { toast.error('Enter a reply'); return; }
    try {
      const updated = await api.replyMessage(id, replyText);
      setMessages(m => m.map(x => x._id === id ? updated : x));
      toast.success('Reply sent');
      setReplyingId(null);
      setReplyText('');
    } catch { toast.error('Failed to send reply'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    try { await api.deleteMessage(id); setMessages(m => m.filter(x => x._id !== id)); toast.success('Deleted'); } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="text-indigo-600 dark:text-indigo-400" size={24} />
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white transition-colors">Messages</h2>
        <span className="bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 text-xs px-3 py-1 rounded-full font-medium transition-colors">
          {messages.filter(m => m.status === 'unread').length} unread
        </span>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-10 border border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 shadow-sm dark:shadow-none transition-colors">
          <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
          <p>No messages yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map(m => (
            <div key={m._id} className={`bg-white dark:bg-gray-900 rounded-2xl p-4 md:p-5 border shadow-sm dark:shadow-none transition-all ${m.status === 'unread' ? 'border-indigo-300 dark:border-indigo-800' : 'border-gray-200 dark:border-gray-800'}`}>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <div className="flex items-center gap-2">
                      {m.status === 'unread' ? <Mail size={16} className="text-red-500 dark:text-red-400" /> : <MailOpen size={16} className="text-gray-400 dark:text-gray-500" />}
                      <p className="font-semibold text-gray-900 dark:text-white transition-colors">{m.name}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[m.status]}`}>{m.status}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 transition-colors">{m.phone}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3 transition-colors">{m.message}</p>

                  {m.reply && (
                    <div className="mt-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 rounded-xl p-3 transition-colors">
                      <p className="text-xs text-green-700 dark:text-green-400 font-medium mb-1 transition-colors">Reply from {m.repliedBy}:</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors">{m.reply}</p>
                    </div>
                  )}

                  {replyingId === m._id && (
                    <div className="mt-3 flex gap-2">
                      <textarea
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="Type your reply..."
                        rows={2}
                        className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-transparent text-gray-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 resize-none transition-all"
                      />
                      <div className="flex flex-col gap-2">
                        <button onClick={() => handleReply(m._id)} className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition"><Send size={16} /></button>
                        <button onClick={() => { setReplyingId(null); setReplyText(''); }} className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl transition-colors"><X size={16} /></button>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 transition-colors">{new Date(m.createdAt).toLocaleString()}</p>
                </div>

                <div className="flex gap-2 md:flex-col">
                  {m.status !== 'replied' && (
                    <button
                      onClick={() => { setReplyingId(m._id); setReplyText(''); }}
                      className="flex items-center gap-1 px-3 py-2 bg-indigo-600/80 hover:bg-indigo-700 text-white rounded-xl text-sm transition"
                    >
                      <Reply size={15} /> Reply
                    </button>
                  )}
                  <button onClick={() => handleDelete(m._id)} className="flex items-center gap-1 px-3 py-2 bg-red-600/70 hover:bg-red-700 text-white rounded-xl text-sm transition">
                    <Trash2 size={15} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesTab;
