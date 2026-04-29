import { MessageCircle, Mail, Send, Phone } from 'lucide-react';
import { useState } from 'react';

const Support = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Thank you! Your message has been sent. We will reply via Telegram or phone.");
    };

    return (
        <div className="max-w-4xl mx-auto py-16 px-6">
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
                                <div className="w-12 h-12 bg-blue-900/50 rounded-2xl flex items-center justify-center">
                                    📬
                                </div>
                                <div>
                                    <p className="font-medium">Email</p>
                                    <p className="text-green-400">support@fertilizerhub.et</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-600/30 rounded-2xl flex items-center justify-center text-2xl">
                                    𝕏
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
                            className="w-full px-5 py-4 bg-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-600"
                            required
                        />

                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-5 py-4 bg-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-600"
                            required
                        />

                        <textarea
                            rows={6}
                            placeholder="Write your message, question or feedback..."
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full px-5 py-4 bg-gray-800 rounded-3xl focus:outline-none focus:ring-2 focus:ring-green-600 resize-y"
                            required
                        />

                        <button
                            type="submit"
                            className="w-full py-4 bg-green-600 hover:bg-green-700 rounded-2xl font-semibold flex items-center justify-center gap-3"
                        >
                            <Send size={20} />
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Support;