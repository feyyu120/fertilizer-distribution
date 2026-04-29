import { useState, useEffect } from 'react';
import { ArrowRight, Users, Award, Truck } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import img from "../assets/back.png";
const heroImages = [
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070", // Farmer spraying fertilizer
    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2070", // Green crops field
    img, // Fertilizer/agriculture work
    "https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=2070", // Farmer working in field
];
const activeFarmers = [
    {
        name: "Tadesse Kebede",
        location: "Adama, Oromia",
        yield: "42% Increase",
        avatar: "👨‍🌾",
        image: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=600"
    },
    {
        name: "Abebech Dibaba",
        location: "Shashemene, Oromia",
        yield: "35% Increase",
        avatar: "👩‍🌾",
        image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=600"
    },
    {
        name: "Mohammed Hassan",
        location: "Worabe, Silti Zone",
        yield: "51% Increase",
        avatar: "👨‍🌾",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a9c?q=80&w=600"
    }
];

const Home = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const navigate = useNavigate();

    // Auto slide hero images
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % heroImages.length);
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gray-950 text-white overflow-hidden font-sans p-5">
            {/* Hero Section with Auto Changing Background */}
            <div className="relative h-screen flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2 }}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.75)), url(${heroImages[currentImage]})`,
                        }}
                    />
                </AnimatePresence>

                {/* Content */}
                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="uppercase tracking-[4px] text-white-400 text-sm  mb-4">
                            EMPOWERING ETHIOPIAN FARMERS
                        </p>

                        <h1 className="text-6xl md:text-5xl lg:text-7xl font-bold leading-none mb-16">
                            FairPrice   <br />
                            <span className="text-white-500">Fertilizer Distribution</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10">

                            Verified suppliers • Fast delivery • Real results.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/register')}
                                className="px-10 py-5 bg-green-600 hover:bg-green-700 rounded-2xl text-lg font-semibold flex items-center gap-3 group"
                            >
                                Get Started Free
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/login')}
                                className="px-10 py-5 border-2 border-white/70 hover:bg-white/10 rounded-2xl text-lg font-semibold transition-all"
                            >
                                Sign In
                            </motion.button>
                        </div>
                    </motion.div>
                </div>

                {/* Image Indicator Dots */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                    {heroImages.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentImage(idx)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentImage ? 'bg-green-500 scale-125' : 'bg-white/40'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Don't Miss This - Big News */}
            <div className="py-20 bg-black">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-3">Don't Miss This</h2>
                        <p className="text-gray-400 text-lg">Latest Opportunities & Updates</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-gradient-to-br from-green-900/30 to-black border border-green-800 rounded-3xl p-10 group hover:border-green-500 transition-all">
                            <div className="uppercase text-green-400 text-sm tracking-widest mb-4">URGENT</div>
                            <h3 className="text-3xl font-bold leading-tight mb-6">
                                New DAP Fertilizer Stock Just Arrived in Adama
                            </h3>
                            <p className="text-gray-300 mb-8">
                                Limited stock available. Special price for first 200 farmers. Delivery within 48 hours.
                            </p>
                            <button
                                onClick={() => navigate('/news')}
                                className="text-green-400 hover:text-green-500 font-medium flex items-center gap-2 group-hover:gap-3 transition-all"
                            >
                                Read Full Story <ArrowRight />
                            </button>
                        </div>

                        <div className="bg-zinc-900 rounded-3xl p-10 flex flex-col justify-between border border-gray-800 hover:border-gray-600 transition-all">
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <Truck className="text-amber-500" size={32} />
                                    <span className="uppercase text-amber-500 font-medium">Fast Delivery</span>
                                </div>
                                <h3 className="text-3xl font-bold mb-4">Free Delivery for orders above 500kg</h3>
                                <p className="text-gray-400">Valid until end of this month across Oromia region.</p>
                            </div>
                            <button className="mt-10 self-start text-green-400 hover:text-green-500 font-medium">
                                Claim Offer →
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Most Active Farmers */}
            <div className="py-20 bg-gray-950">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-4xl font-bold">Most Active Farmers</h2>
                            <p className="text-gray-400 mt-2">This month’s top performers</p>
                        </div>
                        <button
                            onClick={() => navigate('/news')}
                            className="text-green-400 hover:text-green-500 flex items-center gap-2"
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
                                className="group bg-zinc-900 rounded-3xl overflow-hidden border border-gray-800 hover:border-green-600 transition-all duration-300"
                            >
                                <div className="h-64 relative">
                                    <img
                                        src={farmer.image}
                                        alt={farmer.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-black/70 px-4 py-1 rounded-full text-sm font-medium">
                                        {farmer.yield}
                                    </div>
                                </div>

                                <div className="p-8">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="text-5xl">{farmer.avatar}</div>
                                        <div>
                                            <h3 className="text-2xl font-semibold">{farmer.name}</h3>
                                            <p className="text-gray-500">{farmer.location}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-green-400">
                                        <Award size={20} />
                                        <span className="font-medium">Top Performer</span>
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