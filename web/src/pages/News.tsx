import { Heart, MessageCircle, Share2, User, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const News = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedComments, setExpandedComments] = useState<string[]>([]);
    const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
    const [submittingComment, setSubmittingComment] = useState<string | null>(null);

    const { user: currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const data = await api.getNews();
                setPosts(data);
            } catch (error) {
                console.error("Failed to fetch news:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    const toggleLike = async (postId: string) => {
        if (!currentUser) {
            toast.error("Please login to like posts");
            setTimeout(() => navigate('/login'), 1500);
            return;
        }

        // Optimistic UI update
        setPosts(prevPosts => prevPosts.map(post => {
            if (post._id === postId) {
                const isLiked = post.likedBy?.includes(currentUser._id);
                const updatedLikedBy = isLiked
                    ? post.likedBy.filter((id: string) => id !== currentUser._id)
                    : [...(post.likedBy || []), currentUser._id];
                return { ...post, likedBy: updatedLikedBy };
            }
            return post;
        }));

        try {
            await api.toggleNewsLike(postId, currentUser._id);
        } catch (error) {
            toast.error("Failed to update like");
            // Revert on failure
            const data = await api.getNews();
            setPosts(data);
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
        if (!currentUser) {
            toast.error("Please login to comment");
            setTimeout(() => navigate('/login'), 1500);
            return;
        }

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
            toast.success("Comment added!");
        } catch (error) {
            toast.error("Failed to add comment");
        } finally {
            setSubmittingComment(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-300">
            <Toaster position="top-right" />
            <h1 className="text-3xl md:text-5xl font-bold mb-10 text-center text-gray-900 dark:text-white transition-colors duration-300">
                Agricultural News & Updates
            </h1>

            {posts.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-10 transition-colors duration-300">
                    <p>No news available at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 w-full">
                    {posts.map((post) => {
                        const isLiked = currentUser ? post.likedBy?.includes(currentUser._id || currentUser.id) : false;
                        const likeCount = post.likedBy?.length || 0;
                        const commentCount = post.comments?.length || 0;
                        const showComments = expandedComments.includes(post._id);

                        return (
                            <div
                                key={post._id}
                                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden w-full transition-all hover:shadow-xl dark:hover:border-gray-700 flex flex-col h-full duration-300"
                            >
                                {/* Post Header */}
                                <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-2xl transition-colors duration-300">
                                            {post.user === 'Admin' ? '👨‍💼' : '🌾'}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg transition-colors duration-300">{post.user}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                                                {new Date(post.createdAt).toLocaleDateString(undefined, {
                                                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                        <User size={24} />
                                    </button>
                                </div>

                                {/* Post Content Layout */}
                                <div className="flex flex-col flex-grow">
                                    {/* Post Image */}
                                    {post.image && (
                                        <div className="w-full relative h-[250px] sm:h-[300px]">
                                            <img
                                                src={post.image}
                                                alt="Post"
                                                className="absolute inset-0 w-full h-full object-cover block"
                                            />
                                        </div>
                                    )}

                                    {/* Caption & Actions */}
                                    <div className="flex flex-col justify-between p-6 flex-grow">
                                        <div>
                                            <h4 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 dark:text-white transition-colors duration-300">{post.title}</h4>
                                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg whitespace-pre-wrap transition-colors duration-300">{post.caption}</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-8 mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
                                            <button
                                                onClick={() => toggleLike(post._id)}
                                                className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'}`}
                                            >
                                                <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
                                                <span className="text-base font-medium">{likeCount}</span>
                                            </button>

                                            <button 
                                                onClick={() => toggleComments(post._id)}
                                                className={`flex items-center gap-2 transition-colors ${showComments ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'}`}
                                            >
                                                <MessageCircle size={24} fill={showComments ? "currentColor" : "none"} />
                                                <span className="text-base font-medium">{commentCount}</span>
                                            </button>

                                            <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors ml-auto">
                                                <Share2 size={24} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Comments Section */}
                                {showComments && (
                                    <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-6 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-200 transition-colors">
                                        {/* Existing Comments */}
                                        <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                                            {post.comments && post.comments.length > 0 ? (
                                                post.comments.map((comment: any, index: number) => (
                                                    <div key={index} className="bg-white dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-200 dark:border-gray-700/50 transition-colors">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="font-medium text-gray-900 dark:text-gray-200 transition-colors">{comment.userName}</span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                                                                {new Date(comment.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-700 dark:text-gray-300 text-sm transition-colors">{comment.text}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm transition-colors">No comments yet. Be the first to comment!</p>
                                            )}
                                        </div>

                                        {/* Add Comment Input */}
                                        <div className="flex gap-3 mt-2">
                                            <input
                                                type="text"
                                                placeholder="Write a comment..."
                                                value={commentInputs[post._id] || ''}
                                                onChange={(e) => handleCommentChange(post._id, e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && submitComment(post._id)}
                                                className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-green-500 dark:focus:border-green-500 text-gray-900 dark:text-white transition-colors"
                                            />
                                            <button
                                                onClick={() => submitComment(post._id)}
                                                disabled={!commentInputs[post._id]?.trim() || submittingComment === post._id}
                                                className="w-11 h-11 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white transition-colors shadow-sm"
                                            >
                                                {submittingComment === post._id ? (
                                                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <Send size={18} className="ml-[-2px]" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default News;