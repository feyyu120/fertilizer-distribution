import { useState, useEffect } from 'react';
import { ArrowRight, Users, Award, Truck } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import img from "../assets/back.png";

const heroImages = [
    "https://images.unsplash.com/photo-1664917351746-6dbf1dbffce6?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2070",
    img,
    "https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=2070",
];

const activeFarmers = [
    { name: "Tadesse Kebede", location: "Adama, Oromia", yield: "42% Increase", avatar: "👨‍🌾", image: "https://images.unsplash.com/photo-1505471768190-275e2ad7b3f9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Abebech Dibaba", location: "Shashemene, Oromia", yield: "35% Increase", avatar: "👩‍🌾", image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Mohammed Hassan", location: "Worabe, Silti Zone", yield: "51% Increase", avatar: "👨‍🌾", image: "https://images.unsplash.com/photo-1709542938843-61e60390846f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }
];

const Home = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const navigate = useNavigate();
    const { user } = useAuth();

    // Auto slide hero images
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white overflow-hidden font-sans p-5 transition-colors duration-300">
            {/* Hero Section */}
            <div className="relative h-screen flex items-center justify-center rounded-3xl overflow-hidden shadow-2xl">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2 }}
                        className="absolute inset-0 bg-cover bg-center before:content-[''] before:absolute before:inset-"
                        style={{ backgroundImage: `url(${heroImages[currentImage]})` }}
                    />
                </AnimatePresence>

                {/* Content */}
                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                    <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
                        <p className="uppercase tracking-[4px] text-green-400 text-sm font-bold mb-4 drop-shadow-md">
                            EMPOWERING ETHIOPIAN FARMERS
                        </p>

                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight mb-8 text-white drop-shadow-lg">
                            Fair <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">Fertilizer Distribution</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto mb-10 drop-shadow-md font-medium">
                            Verified suppliers • Fast delivery • Real results.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                            {user ? (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/news')}
                                    className="px-10 py-5 bg-green-600 hover:bg-green-700 rounded-2xl text-white text-lg font-semibold flex items-center gap-3 group shadow-xl shadow-green-900/30"
                                >
                                    Explore News & Posts
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            ) : (
                                <>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => navigate('/register')}
                                        className="px-10 py-5 bg-green-600 hover:bg-green-700 rounded-2xl text-white text-lg font-semibold flex items-center gap-3 group shadow-xl shadow-green-900/30"
                                    >
                                        Get Started Free
                                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => navigate('/login')}
                                        className="px-10 py-5 border-2 border-white hover:bg-white text-white hover:text-green-900 rounded-2xl text-lg font-semibold transition-all shadow-xl"
                                    >
                                        Sign In
                                    </motion.button>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Image Indicator Dots */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                    {heroImages.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentImage(idx)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentImage ? 'bg-green-500 scale-125 shadow-lg shadow-green-500/50' : 'bg-white/60 hover:bg-white'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Don't Miss This - Big News */}
            <div className="py-20 mt-10 rounded-3xl bg-gray-100 dark:bg-black transition-colors duration-300">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white transition-colors duration-300">Don't Miss This</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg transition-colors duration-300">Latest Opportunities & Updates</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-gradient-to-br dark:from-green-900/40 dark:to-gray-900 border border-gray-200 dark:border-green-700/50 rounded-3xl p-10 group hover:border-green-500 dark:hover:border-green-500 hover:shadow-2xl hover:shadow-green-900/20 transition-all duration-300">
                            <div className="inline-block px-3 py-1 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 text-xs font-bold tracking-widest rounded-full mb-5">URGENT</div>
                            <h3 className="text-3xl font-bold leading-tight mb-6 text-gray-900 dark:text-white">
                                New DAP Fertilizer Stock Just Arrived in Adama
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-8">
                                Limited stock available. Special price for first 200 farmers. Delivery within 48 hours.
                            </p>
                            <button
                                onClick={() => navigate('/news')}
                                className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-500 font-bold flex items-center gap-2 group-hover:gap-3 transition-all"
                            >
                                Read Full Story <ArrowRight />
                            </button>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-10 flex flex-col justify-between border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm dark:shadow-none transition-all duration-300">
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <Truck className="text-amber-500" size={32} />
                                    <span className="uppercase text-amber-500 font-medium">Fast Delivery</span>
                                </div>
                                <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Free Delivery for orders above 500kg</h3>
                                <p className="text-gray-600 dark:text-gray-400">Valid until end of this month across Oromia region.</p>
                            </div>
                            <button className="mt-10 self-start text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-500 font-bold flex items-center gap-2">
                                Claim Offer <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Most Active Farmers */}
            <div className="py-20 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex justify-between items-end mb-12 border-b border-gray-200 dark:border-gray-800 pb-4">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Most Active Farmers</h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-300">This month’s top performers</p>
                        </div>
                        <button
                            onClick={() => navigate('/news')}
                            className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-500 font-bold flex items-center gap-2"
                        >
                            See All <ArrowRight size={20} />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {activeFarmers.map((farmer, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-green-500 dark:hover:border-green-600 shadow-sm dark:shadow-none transition-all duration-300"
                            >
                                <div className="h-64 relative">
                                    <img
                                        src={farmer.image}
                                        alt={farmer.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/70 text-gray-900 dark:text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md backdrop-blur-sm">
                                        {farmer.yield}
                                    </div>
                                </div>

                                <div className="p-8">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="text-5xl bg-gray-50 dark:bg-gray-800 p-3 rounded-2xl">{farmer.avatar}</div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{farmer.name}</h3>
                                            <p className="text-gray-500 dark:text-gray-400 font-medium transition-colors duration-300">{farmer.location}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-xl w-fit">
                                        <Award size={20} />
                                        <span className="font-bold">Top Performer</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;