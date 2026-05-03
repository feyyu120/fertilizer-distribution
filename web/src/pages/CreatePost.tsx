import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { ImagePlus, Send, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const CreatePost = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [title, setTitle] = useState('');
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // If user is not logged in or not an admin, redirect them
    if (!user || user.role !== 'admin') {
        toast.error("Only administrators can create posts");
        navigate('/news');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title.trim() || !caption.trim()) {
            toast.error("Title and caption are required");
            return;
        }

        setIsSubmitting(true);

        try {
            const newPost = {
                title: title.trim(),
                caption: caption.trim(),
                image: image.trim(),
                user: user.fullname,
                userId: user._id || user.id
            };

            await api.addNews(newPost);
            toast.success("Post created successfully!");
            setTimeout(() => {
                navigate('/news');
            }, 1000);
        } catch (error) {
            console.error("Failed to create post:", error);
            toast.error("Failed to create post");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 transition-colors duration-300">
            <Toaster position="top-center" />
            <div className="max-w-2xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl dark:shadow-2xl transition-colors duration-300"
                >
                    <div className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-gray-800 pb-6 transition-colors">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">Create News Post</h1>
                        <button 
                            onClick={() => navigate('/news')}
                            className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Post Title *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="E.g., New Farming Techniques"
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl px-5 py-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Caption / Content *</label>
                            <textarea
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder="Describe the news or update here..."
                                rows={6}
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl px-5 py-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-none transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Image URL (Optional)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <ImagePlus size={20} className="text-gray-400 dark:text-gray-500" />
                                </div>
                                <input
                                    type="url"
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl pl-12 pr-5 py-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                                />
                            </div>
                            {image && (
                                <div className="mt-4 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 h-48 bg-gray-100 dark:bg-gray-800 transition-colors">
                                    <img 
                                        src={image} 
                                        alt="Preview" 
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Invalid+Image+URL';
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting || !title.trim() || !caption.trim()}
                                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 text-white rounded-2xl py-4 font-bold text-lg shadow-lg shadow-green-900/20 active:scale-[0.98] transition-all"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Posting...
                                    </>
                                ) : (
                                    <>
                                        <Send size={20} />
                                        Post News
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default CreatePost;
