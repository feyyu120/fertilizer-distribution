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
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Toaster position="top-right" />
            <h1 className="text-3xl md:text-5xl font-bold mb-10 text-center">
                Agricultural News & Updates
            </h1>

            {posts.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                    <p>No news available at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">
                    {posts.map((post) => {
                        const isLiked = currentUser ? post.likedBy?.includes(currentUser._id || currentUser.id) : false;
                        const likeCount = post.likedBy?.length || 0;
                        const commentCount = post.comments?.length || 0;
                        const showComments = expandedComments.includes(post._id);

                        return (
                            <div
                                key={post._id}
                                className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden w-full transition-all hover:border-gray-700 flex flex-col h-full"
                            >
                                {/* Post Header */}
                                <div className="flex items-center justify-between p-5 border-b border-gray-800">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-2xl">
                                            {post.user === 'Admin' ? '👨‍💼' : '🌾'}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-100 text-lg">{post.user}</h3>
                                            <p className="text-sm text-gray-500">
                                                {new Date(post.createdAt).toLocaleDateString(undefined, {
                                                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <button className="text-gray-500 hover:text-gray-300 transition">
                                        <User size={24} />
                                    </button>
                                </div>

                                {/* Post Content Layout */}
                                <div className="flex flex-col lg:flex-row flex-grow">
                                    {/* Post Image */}
                                    {post.image && (
                                        <div className="lg:w-1/2 relative min-h-[300px]">
                                            <img
                                                src={post.image}
                                                alt="Post"
                                                className="absolute inset-0 w-full h-full object-cover block"
                                            />
                                        </div>
                                    )}

                                    {/* Caption & Actions */}
                                    <div className={`flex flex-col justify-between p-6 md:p-8 ${post.image ? 'lg:w-1/2' : 'w-full'}`}>
                                        <div>
                                            <h4 className="text-2xl font-bold mb-4 text-white">{post.title}</h4>
                                            <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">{post.caption}</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-8 mt-8 pt-6 border-t border-gray-800">
                                            <button
                                                onClick={() => toggleLike(post._id)}
                                                className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
                                            >
                                                <Heart size={28} fill={isLiked ? "currentColor" : "none"} />
                                                <span className="text-lg font-medium">{likeCount}</span>
                                            </button>

                                            <button 
                                                onClick={() => toggleComments(post._id)}
                                                className={`flex items-center gap-2 transition-colors ${showComments ? 'text-blue-500' : 'text-gray-400 hover:text-blue-400'}`}
                                            >
                                                <MessageCircle size={28} fill={showComments ? "currentColor" : "none"} />
                                                <span className="text-lg font-medium">{commentCount}</span>
                                            </button>

                                            <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors ml-auto">
                                                <Share2 size={28} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Comments Section */}
                                {showComments && (
                                    <div className="border-t border-gray-800 bg-gray-900/50 p-6 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-200">
                                        {/* Existing Comments */}
                                        <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                                            {post.comments && post.comments.length > 0 ? (
                                                post.comments.map((comment: any, index: number) => (
                                                    <div key={index} className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700/50">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="font-medium text-gray-200">{comment.userName}</span>
                                                            <span className="text-xs text-gray-500">
                                                                {new Date(comment.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-300 text-sm">{comment.text}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-center text-gray-500 py-4 text-sm">No comments yet. Be the first to comment!</p>
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
                                                className="flex-1 bg-gray-800 border border-gray-700 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-green-500 text-white"
                                            />
                                            <button
                                                onClick={() => submitComment(post._id)}
                                                disabled={!commentInputs[post._id]?.trim() || submittingComment === post._id}
                                                className="w-11 h-11 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white transition-colors"
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