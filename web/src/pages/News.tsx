import { Heart, MessageCircle, Share2, User, Send, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const News = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedComments, setExpandedComments] = useState<string[]>([]);
    const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
    const [submittingComment, setSubmittingComment] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<any>(null); // For profile modal

    const { user: currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const data = await api.getNews();
            setPosts(data);
        } catch (error) {
            console.error("Failed to fetch news:", error);
            toast.error("Failed to load news");
        } finally {
            setLoading(false);
        }
    };

    const toggleLike = async (postId: string) => {
        if (!currentUser) {
            toast.error("Please login to like posts");
            setTimeout(() => navigate('/login'), 1500);
            return;
        }

        // Optimistic update
        setPosts(prev => prev.map(post => {
            if (post._id === postId) {
                const uid = currentUser._id || currentUser.id;
                const isCurrentlyLiked = post.likedBy?.some((id: any) => id.toString() === uid);
                return {
                    ...post,
                    likedBy: isCurrentlyLiked
                        ? post.likedBy.filter((id: any) => id.toString() !== uid)
                        : [...(post.likedBy || []), uid]
                };
            }
            return post;
        }));

        try {
            await api.toggleNewsLike(postId, currentUser._id || currentUser.id);
            // Refresh to get accurate count from backend
            const updatedData = await api.getNews();
            setPosts(updatedData);
        } catch (error) {
            toast.error("Failed to update like");
            fetchNews(); // Revert
        }
    };

    const toggleComments = (postId: string) => {
        setExpandedComments(prev =>
            prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
        );
    };

    const handleCommentChange = (postId: string, text: string) => {
        setCommentInputs(prev => ({ ...prev, [postId]: text }));
    };

    const submitComment = async (postId: string) => {
        if (!currentUser) return toast.error("Please login to comment");

        const text = commentInputs[postId]?.trim();
        if (!text) return;

        setSubmittingComment(postId);

        try {
            const updatedPost = await api.addNewsComment(postId, {
                userId: currentUser._id || currentUser.id,
                userName: currentUser.fullname,
                text
            });

            setPosts(prev => prev.map(p => p._id === postId ? updatedPost : p));
            setCommentInputs(prev => ({ ...prev, [postId]: '' }));
            toast.success("Comment posted successfully!");
        } catch (error) {
            toast.error("Failed to post comment");
        } finally {
            setSubmittingComment(null);
        }
    };

    const openProfile = (post: any) => {
        setSelectedUser({
            name: post.user,
            phone: post.userPhone || "Not available",
            role: post.user === "Admin" ? "Administrator" : "Agricultural Officer"
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 transition-colors duration-300">
            <Toaster position="top-center" />

            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold text-center mb-12 text-gray-900 dark:text-white transition-colors">
                    Agricultural News & Updates
                </h1>

                <div className="space-y-10">
                    {posts.map((post) => {
                        const uid = currentUser?._id || currentUser?.id;
                        const isLiked = uid && post.likedBy?.some((id: any) => id.toString() === uid);
                        const likeCount = post.likedBy?.length || 0;
                        const commentCount = post.comments?.length || 0;
                        const showComments = expandedComments.includes(post._id);

                        return (
                            <motion.div
                                key={post._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl dark:shadow-2xl transition-colors duration-300"
                            >
                                {/* Full Width Hero Image */}
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => openProfile(post)}
                                            className="w-14 h-14 bg-gray-100 dark:bg-gray-800 hover:bg-green-600 rounded-2xl flex items-center justify-center text-3xl transition-all active:scale-95"
                                        >
                                            {post.user === 'Admin' ? '👨‍💼' : '🌾'}
                                        </button>
                                        <div>
                                            <h3 className="font-bold text-xl text-gray-900 dark:text-white transition-colors">{post.user}</h3>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">
                                                {new Date(post.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {post.image && (
                                    <div className="relative h-[380px] md:h-[480px] lg:h-[550px] overflow-hidden">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black/90" />
                                    </div>
                                )}

                                {/* Content Section */}
                                <div className="p-6 md:p-10">


                                    {/* Title & Caption */}
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8 transition-colors">
                                        {post.caption}
                                    </p>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-8 border-t border-gray-100 dark:border-gray-800 pt-6 transition-colors">
                                        <button
                                            onClick={() => toggleLike(post._id)}
                                            className={`flex items-center gap-3 text-xl transition-all ${isLiked ? 'text-red-500 scale-110' : 'text-gray-400 hover:text-red-500'}`}
                                        >
                                            <Heart size={28} fill={isLiked ? "currentColor" : "none"} />
                                            <span className="font-semibold">{likeCount}</span>
                                        </button>

                                        <button
                                            onClick={() => toggleComments(post._id)}
                                            className={`flex items-center gap-3 text-xl transition-all ${showComments ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'}`}
                                        >
                                            <MessageCircle size={28} fill={showComments ? "currentColor" : "none"} />
                                            <span className="font-semibold">{commentCount}</span>
                                        </button>

                                        <button className="flex items-center gap-3 text-xl text-gray-400 hover:text-green-500 transition-all ml-auto">
                                            <Share2 size={28} />
                                        </button>
                                    </div>
                                </div>

                                {/* Comments Section */}
                                <AnimatePresence>
                                    {showComments && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-6 md:p-10 transition-colors"
                                        >
                                            <div className="max-h-[420px] overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
                                                {post.comments?.length > 0 ? (
                                                    post.comments.map((comment: any, i: number) => (
                                                        <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-transparent p-5 rounded-2xl transition-colors">
                                                            <div className="flex justify-between mb-2">
                                                                <span className="font-medium text-green-700 dark:text-green-400 transition-colors">{comment.userName}</span>
                                                                <span className="text-xs text-gray-500">
                                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            <p className="text-gray-700 dark:text-gray-300 transition-colors">{comment.text}</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-center text-gray-500 py-8">No comments yet. Be the first!</p>
                                                )}
                                            </div>

                                            {/* Comment Input */}
                                            <div className="flex gap-3">
                                                <input
                                                    type="text"
                                                    placeholder="Write your comment..."
                                                    value={commentInputs[post._id] || ''}
                                                    onChange={(e) => handleCommentChange(post._id, e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && submitComment(post._id)}
                                                    className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl px-6 py-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                                                />
                                                <button
                                                    onClick={() => submitComment(post._id)}
                                                    disabled={!commentInputs[post._id]?.trim()}
                                                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-700 w-14 h-14 rounded-2xl flex items-center justify-center transition-all"
                                                >
                                                    <Send size={22} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* User Profile Modal */}
            <AnimatePresence>
                {selectedUser && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-sm w-full border border-gray-200 dark:border-gray-700 shadow-2xl transition-colors"
                        >
                            <div className="flex justify-end mb-4">
                                <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                    <X size={28} />
                                </button>
                            </div>

                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center text-6xl mb-6">
                                    {selectedUser.name.includes('Admin') ? '👨‍💼' : '🌾'}
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 transition-colors">{selectedUser.name}</h2>
                                <p className="text-green-600 dark:text-green-400 mb-6 transition-colors">{selectedUser.role}</p>

                                <div className="w-full space-y-4 text-left bg-gray-50 dark:bg-gray-950 rounded-2xl p-6 transition-colors">
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">Phone Number</p>
                                        <p className="text-gray-900 dark:text-white text-lg font-medium transition-colors">{selectedUser.phone}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedUser(null)}
                                className="mt-8 w-full py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-2xl font-medium transition-colors"
                            >
                                Close
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default News;