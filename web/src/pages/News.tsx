import { Heart, MessageCircle, Share2, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../utils/api';

const News = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [likedPosts, setLikedPosts] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

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

    const toggleLike = (id: string) => {
        if (likedPosts.includes(id)) {
            setLikedPosts(likedPosts.filter(postId => postId !== id));
        } else {
            setLikedPosts([...likedPosts, id]);
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
        <div style={{ maxWidth: '100%', margin: '0 auto', padding: '3rem 1.5rem' }}>
            <h1 style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 'bold',
                marginBottom: '2.5rem',
                textAlign: 'center'
            }}>
                Agricultural News & Updates
            </h1>

            {posts.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                    <p>No news available at the moment.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '800px', margin: '0 auto' }}>
                    {posts.map((post) => (
                        <div
                            key={post._id}
                            style={{
                                background: 'var(--bg-secondary, #111827)',
                                borderRadius: '1.5rem',
                                overflow: 'hidden',
                                border: '1px solid var(--border-color, #1f2937)',
                                width: '100%',
                            }}
                            className="bg-gray-900 border-gray-800"
                        >
                            {/* Post Header */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1.25rem',
                                borderBottom: '1px solid var(--border-color, #1f2937)'
                            }} className="border-gray-800">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: '3rem',
                                        height: '3rem',
                                        background: '#374151',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.75rem'
                                    }}>
                                        {post.user === 'Admin' ? '👨‍💼' : '🌾'}
                                    </div>
                                    <div>
                                        <h3 style={{ fontWeight: 600 }} className="text-gray-100">{post.user}</h3>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <button style={{ color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <User size={20} />
                                </button>
                            </div>

                            {/* Post Image */}
                            {post.image && (
                                <img
                                    src={post.image}
                                    alt="Post"
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        objectFit: 'cover',
                                        maxHeight: '600px',
                                        display: 'block'
                                    }}
                                />
                            )}

                            {/* Caption */}
                            <div style={{ padding: '1.5rem' }}>
                                <h4 className="text-xl font-bold mb-2 text-white">{post.title}</h4>
                                <p style={{ color: '#d1d5db', lineHeight: 1.7, fontSize: '1.05rem' }}>{post.caption}</p>
                            </div>

                            {/* Actions */}
                            <div style={{
                                padding: '0 1.5rem 1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderTop: '1px solid var(--border-color, #1f2937)',
                                paddingTop: '1rem'
                            }} className="border-gray-800">
                                <div style={{ display: 'flex', gap: '2rem' }}>
                                    <button
                                        onClick={() => toggleLike(post._id)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: likedPosts.includes(post._id) ? '#ef4444' : '#d1d5db',
                                            transition: 'color 0.2s'
                                        }}
                                    >
                                        <Heart size={24} fill={likedPosts.includes(post._id) ? "currentColor" : "none"} />
                                        <span>{likedPosts.includes(post._id) ? 1 : 0}</span>
                                    </button>

                                    <button style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#d1d5db',
                                        transition: 'color 0.2s'
                                    }}>
                                        <MessageCircle size={24} />
                                        <span>0</span>
                                    </button>

                                    <button style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#d1d5db',
                                        transition: 'color 0.2s'
                                    }}>
                                        <Share2 size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default News;