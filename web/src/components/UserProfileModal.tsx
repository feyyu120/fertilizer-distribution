import { useState, useEffect } from 'react';
import { X, User, Package, MessageSquare, Edit2, Trash2, Save, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface UserProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    onLogout: () => void;
}

const UserProfileModal = ({ isOpen, onClose, user, onLogout }: UserProfileModalProps) => {
    const navigate = useNavigate();
    const { updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'messages'>('profile');
    
    // Profile Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(user?.fullname || '');
    const [isSaving, setIsSaving] = useState(false);

    // History Data
    const [orders, setOrders] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    useEffect(() => {
        if (isOpen && user) {
            setNewName(user.fullname);
            fetchHistory();
        }
    }, [isOpen, user]);

    const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
            const [ordersData, messagesData] = await Promise.all([
                api.getMyOrders(user.id),
                api.getMyMessages(user.phone)
            ]);
            setOrders(Array.isArray(ordersData) ? ordersData : []);
            setMessages(Array.isArray(messagesData) ? messagesData : []);
        } catch (error) {
            console.error("Failed to fetch history:", error);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleUpdateProfile = async () => {
        if (!newName.trim()) return;
        setIsSaving(true);
        try {
            const updatedUser = await api.updateProfile(user.id, newName);
            updateUser({ fullname: updatedUser.fullname });
            toast.success("Profile updated successfully!");
            setIsEditing(false);
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.")) {
            try {
                await api.deleteProfile(user.id);
                toast.success("Account deleted successfully.");
                onLogout();
            } catch (error) {
                toast.error("Failed to delete account");
            }
        }
    };

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-gray-900/50">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-900/50 rounded-full flex items-center justify-center text-green-500">
                            <User size={20} />
                        </div>
                        My Profile
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition bg-gray-800 p-2 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-800 px-6">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`py-4 px-6 font-medium border-b-2 transition-all ${activeTab === 'profile' ? 'border-green-500 text-green-400' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
                    >
                        Account Details
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`py-4 px-6 font-medium border-b-2 transition-all flex items-center gap-2 ${activeTab === 'orders' ? 'border-green-500 text-green-400' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
                    >
                        <Package size={16} /> Order History
                    </button>
                    <button
                        onClick={() => setActiveTab('messages')}
                        className={`py-4 px-6 font-medium border-b-2 transition-all flex items-center gap-2 ${activeTab === 'messages' ? 'border-green-500 text-green-400' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
                    >
                        <MessageSquare size={16} /> My Messages
                    </button>
                </div>

                {/* Content Area */}
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
                            <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-200">Personal Information</h3>
                                    {!isEditing ? (
                                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition px-3 py-1.5 bg-blue-500/10 rounded-lg">
                                            <Edit2 size={16} /> Edit Name
                                        </button>
                                    ) : (
                                        <button onClick={() => setIsEditing(false)} className="text-sm text-gray-400 hover:text-white transition">Cancel</button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-gray-400 mb-1">Full Name</p>
                                        {isEditing ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={newName}
                                                    onChange={(e) => setNewName(e.target.value)}
                                                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                                                />
                                                <button onClick={handleUpdateProfile} disabled={isSaving} className="p-2 bg-green-600 hover:bg-green-700 rounded-lg text-white disabled:opacity-50 transition">
                                                    <Save size={20} />
                                                </button>
                                            </div>
                                        ) : (
                                            <p className="text-lg font-medium text-white">{user.fullname}</p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 mb-1">Phone Number</p>
                                        <p className="text-lg font-medium text-white">{user.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 mb-1">Email Address</p>
                                        <p className="text-lg font-medium text-white">{user.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 mb-1">Account Status</p>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            user.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                            {user.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-800 flex justify-between items-center">
                                <button
                                    onClick={onLogout}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-white font-medium transition"
                                >
                                    <LogOut size={18} /> Sign Out
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-red-900/30 hover:bg-red-900/50 border border-red-900/50 text-red-400 rounded-xl font-medium transition"
                                >
                                    <Trash2 size={18} /> Delete Account
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <div className="animate-in fade-in zoom-in-95 duration-200">
                            {loadingHistory ? (
                                <div className="text-center py-10 text-gray-400">Loading orders...</div>
                            ) : orders.length === 0 ? (
                                <div className="text-center py-12 bg-gray-800/30 rounded-2xl border border-gray-800">
                                    <Package className="mx-auto text-gray-600 mb-4" size={48} />
                                    <p className="text-gray-400">You haven't placed any orders yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map((order: any) => (
                                        <div key={order._id} className="bg-gray-800/50 border border-gray-700 p-5 rounded-xl flex flex-col md:flex-row justify-between md:items-center gap-4">
                                            <div>
                                                <p className="text-xs text-gray-400 mb-1">Order #{order._id.slice(-6)} • {new Date(order.createdAt).toLocaleDateString()}</p>
                                                <h4 className="font-semibold text-lg">{order.fertilizers.map((f:any) => f.name).join(', ')}</h4>
                                                <p className="text-gray-400">{order.totalAmount} ETB</p>
                                            </div>
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold text-center ${
                                                order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                                                order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                                                order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                                                'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                                {order.status.toUpperCase()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Messages Tab */}
                    {activeTab === 'messages' && (
                        <div className="animate-in fade-in zoom-in-95 duration-200">
                            {loadingHistory ? (
                                <div className="text-center py-10 text-gray-400">Loading messages...</div>
                            ) : messages.length === 0 ? (
                                <div className="text-center py-12 bg-gray-800/30 rounded-2xl border border-gray-800">
                                    <MessageSquare className="mx-auto text-gray-600 mb-4" size={48} />
                                    <p className="text-gray-400">You haven't sent any messages.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {messages.map((msg: any) => (
                                        <div key={msg._id} className="bg-gray-800/50 border border-gray-700 p-5 rounded-xl space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-xs text-gray-400 mb-1">{new Date(msg.createdAt).toLocaleDateString()}</p>
                                                    <p className="text-gray-200">{msg.message}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    msg.status === 'replied' ? 'bg-green-500/20 text-green-400' :
                                                    msg.status === 'read' ? 'bg-blue-500/20 text-blue-400' :
                                                    'bg-gray-700 text-gray-300'
                                                }`}>
                                                    {msg.status.toUpperCase()}
                                                </span>
                                            </div>
                                            {msg.reply && (
                                                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700/50 mt-4 relative">
                                                    <div className="absolute top-0 left-4 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-gray-900 -mt-2"></div>
                                                    <p className="text-xs text-green-400 font-semibold mb-1">Admin Reply</p>
                                                    <p className="text-gray-300">{msg.reply}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfileModal;
