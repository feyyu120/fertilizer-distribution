import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Package, Truck, CreditCard, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const OrderFertilizer = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [fertilizer, setFertilizer] = useState<any>(location.state?.fertilizer || null);
    const [activeSeason, setActiveSeason] = useState<any>(null);
    const [loadingSeason, setLoadingSeason] = useState(true);
    
    const [quantity, setQuantity] = useState<number>(1);
    const [address, setAddress] = useState(user?.address || '');
    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchSeason = async () => {
            try {
                const season = await api.getActiveSeason();
                if (season && !season.message) {
                    setActiveSeason(season);
                }
            } catch (err) {
                console.error("Error fetching active season:", err);
            } finally {
                setLoadingSeason(false);
            }
        };

        if (!user) {
            toast.error("Please log in to place an order");
            navigate('/login');
        }
        if (!fertilizer && id) {
            navigate('/');
        }
        fetchSeason();
    }, [user, fertilizer, id, navigate]);

    if (!fertilizer || !user) return null;

    const totalAmount = quantity * fertilizer.pricePerQuintal;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (quantity < 1 || quantity > fertilizer.quantity) {
            toast.error(`Please enter a valid quantity up to ${fertilizer.quantity}`);
            return;
        }

        if (!address.trim()) {
            toast.error("Delivery address is required");
            return;
        }

        setIsSubmitting(true);

        try {
            const orderData = {
                farmer: user._id || user.id,
                farmerName: user.fullname,
                farmerPhone: user.phone,
                fertilizers: [{
                    fertilizerId: fertilizer._id,
                    name: fertilizer.name,
                    quantity: quantity,
                    pricePerQuintal: fertilizer.pricePerQuintal
                }],
                totalAmount: totalAmount,
                deliveryAddress: address,
                paymentMethod: paymentMethod,
                notes: notes
            };

            const response = await api.createOrder(orderData);
            
            if (response.message && response.message.includes('already')) {
                toast.error(response.message);
                setIsSubmitting(false);
                return;
            }
            
            if (response.message && (response.status === 400 || response.status === 500)) {
                toast.error(response.message);
                setIsSubmitting(false);
                return;
            }

            toast.success("Order placed successfully!");
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (error) {
            console.error("Order error:", error);
            toast.error("Failed to place order. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 transition-colors duration-300">
            <Toaster position="top-center" />
            <div className="max-w-3xl mx-auto">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-8 font-medium"
                >
                    <ChevronLeft size={20} /> Back
                </button>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl dark:shadow-2xl transition-colors duration-300"
                >
                    <div className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">
                            Complete Your Order
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            Review details and select your payment method
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Order Summary Section */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Package size={20} className="text-green-500" /> Order Summary
                                </h3>
                                {activeSeason ? (
                                    <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-200 dark:border-green-800 animate-pulse">
                                        Active Season: {activeSeason.seasonName} {activeSeason.year}
                                    </div>
                                ) : !loadingSeason && (
                                    <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-200 dark:border-red-800">
                                        No Active Season
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white text-lg">{fertilizer.name}</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">{fertilizer.pricePerQuintal.toLocaleString()} ETB per Quintal</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="w-full sm:w-1/2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantity (Quintals)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={fertilizer.quantity}
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 transition-colors"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">Max available: {fertilizer.quantity}</p>
                                </div>

                                <div className="w-full sm:w-1/2 bg-green-50 dark:bg-green-500/10 p-4 rounded-xl border border-green-100 dark:border-green-500/20 text-right">
                                    <p className="text-sm text-green-700 dark:text-green-400 font-medium">Total Amount</p>
                                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                        {totalAmount.toLocaleString()} ETB
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Section */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Truck size={20} className="text-green-500" /> Delivery Information
                            </h3>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Delivery Address *</label>
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter full address for delivery..."
                                rows={3}
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-5 py-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 resize-none transition-colors"
                                required
                            />
                        </div>

                        {/* Payment Section */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <CreditCard size={20} className="text-green-500" /> Payment Method
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {['Cash on Delivery', 'TeleBirr', 'CBE Birr'].map((method) => (
                                    <label 
                                        key={method} 
                                        className={`relative flex items-center justify-center p-4 cursor-pointer rounded-xl border-2 transition-all ${
                                            paymentMethod === method 
                                                ? 'border-green-500 bg-green-50 dark:bg-green-500/10' 
                                                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-green-200 dark:hover:border-green-800'
                                        }`}
                                    >
                                        <input 
                                            type="radio" 
                                            name="paymentMethod" 
                                            value={method}
                                            checked={paymentMethod === method}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="sr-only"
                                        />
                                        <span className={`font-medium ${paymentMethod === method ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                            {method}
                                        </span>
                                        {paymentMethod === method && (
                                            <CheckCircle2 size={18} className="absolute top-2 right-2 text-green-500" />
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Notes Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Additional Notes (Optional)</label>
                            <input
                                type="text"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Any specific instructions..."
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-5 py-4 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 transition-colors"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                            <button
                                type="submit"
                                disabled={isSubmitting || !activeSeason}
                                className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-2xl font-bold text-lg shadow-lg shadow-green-900/20 active:scale-[0.98] transition-all flex justify-center items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>Confirm & Place Order</>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default OrderFertilizer;
