import { X, Package, Tag, Layers, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface FertilizerDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    fertilizer: any;
}

const FertilizerDetailsModal = ({ isOpen, onClose, fertilizer }: FertilizerDetailsModalProps) => {
    const navigate = useNavigate();

    if (!isOpen || !fertilizer) return null;

    const handleOrder = () => {
        onClose();
        navigate(`/order-fertilizer/${fertilizer._id}`, { state: { fertilizer } });
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 transition-colors duration-300"
                >
                    {/* Header Image Area */}
                    <div className="bg-gradient-to-br from-green-500 to-green-700 h-32 relative">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
                        >
                            <X size={20} />
                        </button>
                        <div className="absolute -bottom-10 left-8">
                            <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white dark:border-gray-900 text-4xl">
                                🌾
                            </div>
                        </div>
                    </div>

                    <div className="pt-14 px-8 pb-8">
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
                                {fertilizer.name}
                            </h2>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                    fertilizer.status === 'available' ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' :
                                    fertilizer.status === 'low' ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' :
                                    'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                                }`}>
                                    {fertilizer.status.toUpperCase()}
                                </span>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {new Date(fertilizer.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 transition-colors">
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                    <Tag className="text-green-500" size={20} />
                                    <span className="font-medium">Type</span>
                                </div>
                                <span className="font-semibold text-gray-900 dark:text-white">{fertilizer.type || 'Standard'}</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 transition-colors">
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                    <Layers className="text-green-500" size={20} />
                                    <span className="font-medium">Available Quantity</span>
                                </div>
                                <span className="font-semibold text-gray-900 dark:text-white">{fertilizer.quantity} Quintals</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 transition-colors">
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                    <Package className="text-green-500" size={20} />
                                    <span className="font-medium">Price per Quintal</span>
                                </div>
                                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                    {fertilizer.pricePerQuintal.toLocaleString()} ETB
                                </span>
                            </div>
                        </div>

                        {fertilizer.status === 'outofstock' ? (
                            <div className="flex items-center justify-center gap-2 text-red-500 p-4 bg-red-50 dark:bg-red-500/10 rounded-2xl font-medium border border-red-100 dark:border-red-500/20">
                                <AlertCircle size={20} />
                                Currently Out of Stock
                            </div>
                        ) : (
                            <button
                                onClick={handleOrder}
                                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-green-900/20 active:scale-[0.98] transition-all flex justify-center items-center gap-2"
                            >
                                <Package size={20} />
                                Order Now
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default FertilizerDetailsModal;
