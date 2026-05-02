import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { toast } from 'react-hot-toast';
import { Save, Info, Loader2 } from 'lucide-react';

const AboutTab = () => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchAbout();
    }, []);

    const fetchAbout = async () => {
        try {
            const data = await api.getAbout();
            if (data && data.content) {
                setContent(data.content);
            }
        } catch (error) {
            toast.error('Failed to load About info');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!content.trim()) {
            toast.error('Content cannot be empty');
            return;
        }

        setSaving(true);
        try {
            await api.updateAbout({ content });
            toast.success('About information updated successfully');
        } catch (error) {
            toast.error('Failed to update About info');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                            <Info size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Website Information</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Update the information that the AI assistant uses to answer questions about FertilizerHub.</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-green-900/20"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
                
                <div className="p-6">
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                            About FertilizerHub & Instructions for Farmers
                        </label>
                        <div className="relative">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full h-96 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white resize-none font-medium"
                                placeholder="Describe the website, mission, and provide instructions for registration/ordering..."
                            />
                            <div className="absolute bottom-4 right-4 text-xs text-gray-400 dark:text-gray-500">
                                {content.length} characters
                            </div>
                        </div>
                        
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 rounded-xl">
                            <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2 mb-1">
                                <Info size={14} /> Tip for Better AI Responses
                            </h4>
                            <p className="text-xs text-amber-700/80 dark:text-amber-500/80 leading-relaxed">
                                Include details about the registration process, how to place an order, payment methods, and delivery information. The AI uses this text directly to answer farmer inquiries.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutTab;
