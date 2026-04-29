import { useState } from 'react';
import {
    Users, Package, Clock, MessageSquare, TrendingUp,
    Plus, Edit2, Trash2, CheckCircle, XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface Fertilizer {
    id: number;
    name: string;
    type: string;
    quantity: number; // in Quintal
    price: number;
    status: 'available' | 'low';
}

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'farmers' | 'fertilizers' | 'orders' | 'news'>('overview');

    // Mock Data
    const [stats] = useState({
        totalFarmers: 124,
        verifiedFarmers: 98,
        pendingFarmers: 26,
        totalFertilizers: 18,
        totalQuintals: 1240,
        pendingOrders: 34,
        totalMessages: 12,
    });

    const [fertilizers, setFertilizers] = useState<Fertilizer[]>([
        { id: 1, name: "DAP", type: "Diammonium Phosphate", quantity: 450, price: 1850, status: 'available' },
        { id: 2, name: "Urea", type: "Nitrogen Fertilizer", quantity: 320, price: 1650, status: 'low' },
        { id: 3, name: "NPK 19-19-19", type: "Compound Fertilizer", quantity: 280, price: 2100, status: 'available' },
    ]);

    const [pendingFarmers] = useState([
        { id: 101, name: "Alemayehu Tesfaye", phone: "+251 911 234 567", landSize: "3.5 ha", date: "2026-04-28" },
        { id: 102, name: "Fatuma Ahmed", phone: "+251 922 345 678", landSize: "2.1 ha", date: "2026-04-29" },
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [editingFertilizer, setEditingFertilizer] = useState<Fertilizer | null>(null);

    const handleApproveFarmer = (id: number) => {
        toast.success(`Farmer ID ${id} approved successfully!`);
    };

    const handleDeleteFertilizer = (id: number) => {
        if (confirm("Delete this fertilizer?")) {
            setFertilizers(fertilizers.filter(f => f.id !== id));
            toast.success("Fertilizer deleted");
        }
    };

    const handleAddFertilizer = (newFert: Omit<Fertilizer, 'id'>) => {
        setFertilizers([...fertilizers, { ...newFert, id: Date.now() }]);
        setShowAddModal(false);
        toast.success("New fertilizer added successfully");
    };

    return (
        <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
            {/* Sidebar */}
            <div className="w-72 bg-black border-r border-gray-800 flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-600 rounded-2xl flex items-center justify-center text-2xl">🌱</div>
                        <div>
                            <h1 className="text-2xl font-bold">FertilizerHub</h1>
                            <p className="text-xs text-green-500 font-medium">ADMIN PANEL</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {[
                        { label: "Overview", icon: Users, tab: 'overview' as const },
                        { label: "Farmers", icon: Users, tab: 'farmers' as const },
                        { label: "Fertilizers", icon: Package, tab: 'fertilizers' as const },
                        { label: "Orders", icon: Clock, tab: 'orders' as const },
                        { label: "News & Posts", icon: MessageSquare, tab: 'news' as const },
                    ].map((item) => (
                        <button
                            key={item.tab}
                            onClick={() => setActiveTab(item.tab)}
                            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-left transition-all ${activeTab === item.tab
                                    ? 'bg-green-600 text-white'
                                    : 'hover:bg-gray-900 text-gray-400 hover:text-white'
                                }`}
                        >
                            <item.icon size={22} />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-6 border-t border-gray-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-lg">👨‍💼</div>
                        <div>
                            <p className="font-medium">Admin User</p>
                            <p className="text-xs text-gray-500">admin@fertilizerhub.et</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("user");
                            toast.success("Logged out successfully");
                            window.location.href = "/login";
                        }}
                        className="w-full py-3 text-red-500 hover:bg-red-950/50 rounded-2xl text-sm font-medium transition"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h1 className="text-4xl font-bold">Dashboard Overview</h1>
                            <p className="text-gray-400 mt-2">Welcome back, here's what's happening today.</p>
                        </div>
                        <div className="text-sm text-gray-500">April 29, 2026</div>
                    </div>

                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <>
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                                {[
                                    { title: "Total Farmers", value: stats.totalFarmers, change: "+12 this month", icon: Users, color: "text-blue-400" },
                                    { title: "Verified Farmers", value: stats.verifiedFarmers, change: "79% verified", icon: CheckCircle, color: "text-green-400" },
                                    { title: "Total Fertilizer (Quintal)", value: stats.totalQuintals, change: "18 types", icon: Package, color: "text-amber-400" },
                                    { title: "Pending Orders", value: stats.pendingOrders, change: "Requires action", icon: Clock, color: "text-orange-400" },
                                ].map((stat, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-gray-900 rounded-3xl p-8 border border-gray-800 hover:border-green-700 transition-all"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-gray-400 text-sm">{stat.title}</p>
                                                <p className="text-5xl font-bold mt-4">{stat.value}</p>
                                            </div>
                                            <stat.icon className={`${stat.color}`} size={32} />
                                        </div>
                                        <p className="text-green-400 text-sm mt-6 flex items-center gap-1">
                                            <TrendingUp size={16} /> {stat.change}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Pending Farmers & Messages */}
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800">
                                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
                                        <Clock className="text-orange-400" /> Pending Farmer Verification
                                    </h3>
                                    {pendingFarmers.map(farmer => (
                                        <div key={farmer.id} className="flex justify-between items-center py-5 border-b border-gray-800 last:border-0">
                                            <div>
                                                <p className="font-medium">{farmer.name}</p>
                                                <p className="text-sm text-gray-500">{farmer.phone} • {farmer.landSize}</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleApproveFarmer(farmer.id)}
                                                    className="px-5 py-2 bg-green-600 hover:bg-green-700 rounded-2xl text-sm font-medium"
                                                >
                                                    Approve
                                                </button>
                                                <button className="px-5 py-2 bg-red-600/80 hover:bg-red-700 rounded-2xl text-sm font-medium">
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800">
                                    <h3 className="text-xl font-semibold mb-6">Recent Messages</h3>
                                    <div className="space-y-6 text-sm">
                                        <p className="text-gray-400">• 8 new support requests from farmers</p>
                                        <p className="text-gray-400">• 4 delivery related inquiries</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Fertilizers Management */}
                    {activeTab === 'fertilizers' && (
                        <div>
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-3xl font-bold">Fertilizer Inventory</h2>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-2xl font-medium"
                                >
                                    <Plus size={20} /> Add New Fertilizer
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {fertilizers.map((fert) => (
                                    <div key={fert.id} className="bg-gray-900 rounded-3xl p-8 border border-gray-800 hover:border-green-600 transition-all">
                                        <div className="flex justify-between">
                                            <div>
                                                <h3 className="text-2xl font-bold">{fert.name}</h3>
                                                <p className="text-gray-400">{fert.type}</p>
                                            </div>
                                            <span className={`px-4 py-1 rounded-full text-xs font-medium ${fert.status === 'available' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                                {fert.status.toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="mt-10 space-y-2">
                                            <p><span className="text-gray-400">Quantity:</span> <span className="font-semibold text-xl">{fert.quantity} Quintal</span></p>
                                            <p><span className="text-gray-400">Price per Quintal:</span> <span className="font-semibold">ETB {fert.price}</span></p>
                                        </div>

                                        <div className="flex gap-3 mt-8">
                                            <button
                                                onClick={() => setEditingFertilizer(fert)}
                                                className="flex-1 py-3 border border-gray-700 hover:bg-gray-800 rounded-2xl flex items-center justify-center gap-2"
                                            >
                                                <Edit2 size={18} /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteFertilizer(fert.id)}
                                                className="flex-1 py-3 bg-red-600/80 hover:bg-red-700 rounded-2xl flex items-center justify-center gap-2"
                                            >
                                                <Trash2 size={18} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* You can extend other tabs (Farmers, Orders, News) similarly */}
                </div>
            </div>

            {/* Add/Edit Fertilizer Modal - You can expand this later */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-gray-900 rounded-3xl p-10 w-full max-w-md">
                        <h3 className="text-2xl font-bold mb-8">Add New Fertilizer</h3>
                        {/* Simple form - extend as needed */}
                        <button
                            onClick={() => setShowAddModal(false)}
                            className="mt-6 w-full py-4 bg-gray-700 rounded-2xl"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;