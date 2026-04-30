import { useState, useEffect, useRef } from 'react';
import { Bell, Globe, Menu, X, LogOut, User, Leaf, Package } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import UserProfileModal from './UserProfileModal';
import FertilizerDetailsModal from './FertilizerDetailsModal';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

const Navbar = () => {
    const [language, setLanguage] = useState<'en' | 'am'>('en');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [fertilizers, setFertilizers] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [selectedFertilizer, setSelectedFertilizer] = useState<any>(null);
    const notifRef = useRef<HTMLDivElement>(null);

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchNotifs = async () => {
            if (user) {
                try {
                    // Fetch latest profile to get lastViewedFertilizersAt
                    const token = localStorage.getItem('token');
                    let viewTime = new Date(0);
                    if (token) {
                        try {
                            const currentUser = await api.getMe(token);
                            if (currentUser.lastViewedFertilizersAt) {
                                viewTime = new Date(currentUser.lastViewedFertilizersAt);
                            }
                        } catch(e) {}
                    }

                    const ferts = await api.getFertilizers();
                    setFertilizers(ferts.slice(0, 5)); // Latest 5

                    const unread = ferts.filter((f: any) => new Date(f.createdAt) > viewTime);
                    setUnreadCount(unread.length);
                } catch(e) {}
            }
        };
        fetchNotifs();
    }, [user]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setIsNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotifClick = async () => {
        setIsNotifOpen(!isNotifOpen);
        if (!isNotifOpen && unreadCount > 0 && user) {
            try {
                await api.markFertilizersRead(user._id || user.id);
                setUnreadCount(0);
            } catch(e) {}
        }
    };

    const handleFertilizerClick = (fert: any) => {
        setSelectedFertilizer(fert);
        setIsNotifOpen(false);
    };

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'am' : 'en');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        setIsProfileModalOpen(false);
        navigate('/login');
        closeMenu();
    };

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/news', label: 'News' },
        { path: '/faq', label: 'FAQ' },
        { path: '/support', label: 'Support' }
    ];

    if (user) {
        navLinks.splice(2, 0, { path: '/create-post', label: 'Create post' });
    }

    const firstName = user?.fullname ? user.fullname.split(' ')[0] : 'User';

    return (
        <>
            <nav className="bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-green-900/30">
                                <Leaf size={20} />
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors duration-300">Fertilizer<span className="text-green-500">Hub</span></h1>
                                <p className="text-xs text-gray-500 -mt-1">For Ethiopian Farmers</p>
                            </div>
                            <div className="sm:hidden">
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">FertilizerHub</h1>
                            </div>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-10 text-md font-medium">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.path;
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`relative transition-colors py-1 ${isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
                                        onClick={closeMenu}
                                    >
                                        {link.label}
                                        {isActive && (
                                            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-green-500 rounded-full" />
                                        )}
                                    </Link>
                                )
                            })}
                        </div>

                        {/* Right Side - Desktop */}
                        <div className="hidden md:flex items-center gap-4">
                            <ThemeToggle />

                            {/* Language Selector */}
                            <button
                                onClick={toggleLanguage}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                            >
                                <Globe size={18} />
                                <span className="hidden lg:inline">{language === 'en' ? 'English' : 'አማርኛ'}</span>
                            </button>

                            {/* Notification */}
                            <div className="relative" ref={notifRef}>
                                <button 
                                    onClick={handleNotifClick}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors relative border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                                >
                                    <Bell size={20} />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-950 flex items-center justify-center text-[9px] font-bold text-white">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </button>
                                
                                {isNotifOpen && (
                                    <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden">
                                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                            <h3 className="font-bold text-gray-900 dark:text-white">Recent Fertilizers</h3>
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                            {fertilizers.length === 0 ? (
                                                <div className="p-4 text-center text-sm text-gray-500">No fertilizers available yet.</div>
                                            ) : (
                                                fertilizers.map(f => (
                                                    <button 
                                                        key={f._id}
                                                        onClick={() => handleFertilizerClick(f)}
                                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 last:border-0 transition-colors flex items-start gap-3"
                                                    >
                                                        <div className="mt-1 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-500 flex-shrink-0">
                                                            <Package size={16} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">{f.name}</p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{f.quantity} Quintals • {f.pricePerQuintal} ETB</p>
                                                            <p className="text-[10px] text-gray-400 mt-1">{new Date(f.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {user ? (
                                <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-800">
                                    <button
                                        onClick={() => setIsProfileModalOpen(true)}
                                        className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-xl font-medium transition"
                                    >
                                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800/50 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
                                            <User size={16} />
                                        </div>
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="px-5 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                                    >
                                        Sign in
                                    </button>
                                    <button
                                        onClick={() => navigate('/register')}
                                        className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-green-900/20 active:scale-95"
                                    >
                                        Get Started
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center gap-2">
                            <ThemeToggle />
                            {user && (
                                <button
                                    onClick={() => { setIsProfileModalOpen(true); closeMenu(); }}
                                    className="p-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800/50"
                                >
                                    <User size={22} />
                                </button>
                            )}
                            <button
                                onClick={toggleMenu}
                                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                            >
                                {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="md:hidden mt-4 pb-6 border-t border-gray-200 dark:border-gray-800 pt-6 animate-in slide-in-from-top-4 duration-200">
                            <div className="flex flex-col gap-2 text-lg font-medium">
                                {navLinks.map((link) => {
                                    const isActive = location.pathname === link.path;
                                    return (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            className={`px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}`}
                                            onClick={closeMenu}
                                        >
                                            {link.label}
                                        </Link>
                                    )
                                })}
                            </div>

                            {/* Mobile Actions */}
                            <div className="mt-8 flex flex-col gap-3 px-2 border-t border-gray-200 dark:border-gray-800 pt-6">
                                <button
                                    onClick={toggleLanguage}
                                    className="flex items-center justify-center gap-3 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
                                >
                                    <Globe size={20} />
                                    {language === 'en' ? 'Switch to አማርኛ' : 'Switch to English'}
                                </button>

                                {!user && (
                                    <div className="grid grid-cols-2 gap-3 mt-2">
                                        <button
                                            onClick={() => { navigate('/login'); closeMenu(); }}
                                            className="py-3.5 text-center border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-colors font-medium"
                                        >
                                            Sign in
                                        </button>
                                        <button
                                            onClick={() => { navigate('/register'); closeMenu(); }}
                                            className="py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-medium transition-colors shadow-lg shadow-green-900/20"
                                        >
                                            Get Started
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            <UserProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                user={user}
                onLogout={handleLogout}
            />

            <FertilizerDetailsModal
                isOpen={!!selectedFertilizer}
                onClose={() => setSelectedFertilizer(null)}
                fertilizer={selectedFertilizer}
            />
        </>
    );
};

export default Navbar;