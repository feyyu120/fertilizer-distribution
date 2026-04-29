import { Heart, MessageCircle, Share2, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const News = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-12">
            <Toaster position="top-right" />
            <h1 className="text-3xl md:text-5xl font-bold mb-10 text-center">
                Agricultural News & Updates
            </h1>

            {posts.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                    <p>No news available at the moment.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-8 w-full">
                    {posts.map((post) => {
                        const isLiked = currentUser ? post.likedBy?.includes(currentUser._id) : false;
                        const likeCount = post.likedBy?.length || 0;

                        return (
                            <div
                                key={post._id}
                                className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden w-full transition-all hover:border-gray-700"
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
                                <div className="flex flex-col lg:flex-row">
                                    {/* Post Image */}
                                    {post.image && (
                                        <div className="lg:w-1/2 relative">
                                            <img
                                                src={post.image}
                                                alt="Post"
                                                className="w-full h-full object-cover max-h-[500px] lg:max-h-[600px] block"
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

                                            <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
                                                <MessageCircle size={28} />
                                                <span className="text-lg font-medium">0</span>
                                            </button>

                                            <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors ml-auto">
                                                <Share2 size={28} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default News;