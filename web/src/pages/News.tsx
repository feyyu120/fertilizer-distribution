import { Heart, MessageCircle, Share2, User } from 'lucide-react';
import { useState } from 'react';

const posts = [
    {
        id: 1,
        user: "Oromia Agriculture Office",
        avatar: "🌾",
        time: "2 hours ago",
        image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070",
        caption: "New high-yield fertilizer arrived in Adama! Suitable for maize and teff. Farmers can now order through FertilizerHub.",
        likes: 1240,
        comments: 89
    },
    {
        id: 2,
        user: "Farmer Tadesse Kebede",
        avatar: "👨‍🌾",
        time: "Yesterday",
        image: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=2070",
        caption: "Thanks to FertilizerHub, my wheat yield increased by 40% this season! Highly recommend their DAP fertilizer.",
        likes: 342,
        comments: 67
    },
    {
        id: 3,
        user: "Ethio Fertilizer Supply",
        avatar: "🏭",
        time: "3 days ago",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a9c?q=80&w=2070",
        caption: "Urea fertilizer stock updated. Delivery available to all zones in Oromia within 48 hours.",
        likes: 856,
        comments: 45
    }
];

const News = () => {
    const [likedPosts, setLikedPosts] = useState<number[]>([]);

    const toggleLike = (id: number) => {
        if (likedPosts.includes(id)) {
            setLikedPosts(likedPosts.filter(postId => postId !== id));
        } else {
            setLikedPosts([...likedPosts, id]);
        }
    };

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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                {posts.map((post) => (
                    <div
                        key={post.id}
                        style={{
                            background: '#111827',
                            borderRadius: '1.5rem',
                            overflow: 'hidden',
                            border: '1px solid #1f2937',
                            width: '100%',
                        }}
                    >
                        {/* Post Header */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1.25rem',
                            borderBottom: '1px solid #1f2937'
                        }}>
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
                                    {post.avatar}
                                </div>
                                <div>
                                    <h3 style={{ fontWeight: 600 }}>{post.user}</h3>
                                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{post.time}</p>
                                </div>
                            </div>
                            <button style={{ color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}>
                                <User size={20} />
                            </button>
                        </div>

                        {/* Post Image */}
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

                        {/* Caption */}
                        <div style={{ padding: '1.5rem' }}>
                            <p style={{ color: '#d1d5db', lineHeight: 1.7, fontSize: '1.05rem' }}>{post.caption}</p>
                        </div>

                        {/* Actions */}
                        <div style={{
                            padding: '0 1.5rem 1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderTop: '1px solid #1f2937',
                            paddingTop: '1rem'
                        }}>
                            <div style={{ display: 'flex', gap: '2rem' }}>
                                <button
                                    onClick={() => toggleLike(post.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: likedPosts.includes(post.id) ? '#ef4444' : '#d1d5db',
                                        transition: 'color 0.2s'
                                    }}
                                >
                                    <Heart size={24} fill={likedPosts.includes(post.id) ? "currentColor" : "none"} />
                                    <span>{(post.likes + (likedPosts.includes(post.id) ? 1 : 0)).toLocaleString()}</span>
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
                                    <span>{post.comments}</span>
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
        </div>
    );
};

export default News;