import { MessageCircle, Send, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Support = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.fullname || '',
                phone: user.phone || ''
            }));
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user) {
            toast.error("You must be logged in to send a message.");
            setTimeout(() => navigate('/login'), 1500);
            return;
        }

        setLoading(true);
        try {
            await api.sendMessage(formData);
            toast.success("Thank you! Your message has been sent. We will reply soon.");
            setFormData(prev => ({ ...prev, message: '' })); // Only clear message
        } catch (error) {
            toast.error("Failed to send message. Please try again.");
            console.error("Support message error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-16 px-6">
            <Toaster position="top-right" />
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold mb-4">Get In Touch</h1>
                <p className="text-gray-400 text-lg">We're here to help you with any questions</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="space-y-10">
                    <div>
                        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                            <MessageCircle className="text-green-500" /> Contact Us
                        </h3>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-900/50 rounded-2xl flex items-center justify-center">
                                    <Phone className="text-green-500" size={28} />
                                </div>
                                <div>
                                    <p className="font-medium">Call or WhatsApp</p>
                                    <p className="text-green-400">+251 911 234 567</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-900/50 rounded-2xl flex items-center justify-center text-blue-400 text-2xl">
                                    📧
                                </div>
                                <div>
                                    <p className="font-medium">Email</p>
                                    <p className="text-green-400">support@fertilizerhub.et</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-600/30 rounded-2xl flex items-center justify-center text-blue-400 text-2xl">
                                    ✈️
                                </div>
                                <div>
                                    <p className="font-medium">Telegram</p>
                                    <p className="text-green-400">@FertilizerHubSupport</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feedback Form */}
                <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800">
                    <h3 className="text-2xl font-semibold mb-6">Send us a Message</h3>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <input
                            type="text"
                            placeholder="Your Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-5 py-4 bg-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-600 transition disabled:opacity-50"
                            required
                            disabled={!!user} // disabled if auto-filled
                        />

                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-5 py-4 bg-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-600 transition disabled:opacity-50"
                            required
                            disabled={!!user} // disabled if auto-filled
                        />

                        <textarea
                            rows={6}
                            placeholder="Write your message, question or feedback..."
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full px-5 py-4 bg-gray-800 rounded-3xl focus:outline-none focus:ring-2 focus:ring-green-600 resize-y transition"
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl font-semibold flex items-center justify-center gap-3 transition"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <Send size={20} />
                                    Send Message
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Support;