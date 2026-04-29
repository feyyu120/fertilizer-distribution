import { useState, useEffect } from 'react';
import { Bell, Globe, Menu, X, LogOut, User } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const [language, setLanguage] = useState<'en' | 'am'>('en');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                // Ignore parse errors
            }
        }
    }, [location]); // Re-check when route changes

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
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
        closeMenu();
    };

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/news', label: 'News' },
        { path: '/faq', label: 'FAQ' },
        { path: '/support', label: 'Support' }
    ];

    const firstName = user?.fullname ? user.fullname.split(' ')[0] : 'User';

    return (
        <nav className="bg-gray-950/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-green-900/30">
                            🌱
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-2xl font-bold tracking-tight text-white">Fertilizer<span className="text-green-500">Hub</span></h1>
                            <p className="text-xs text-gray-500 -mt-1">For Ethiopian Farmers</p>
                        </div>
                        <div className="sm:hidden">
                            <h1 className="text-xl font-bold text-white">FertilizerHub</h1>
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
                                    className={`relative transition-colors py-1 ${isActive ? 'text-green-400' : 'text-gray-300 hover:text-white'}`}
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
                            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-800 text-gray-300 hover:text-white transition-colors text-sm border border-transparent hover:border-gray-700"
                        >
                            <Globe size={18} />
                            <span className="hidden lg:inline">{language === 'en' ? 'English' : 'አማርኛ'}</span>
                        </button>

                        {/* Notification */}
                        <button className="p-2 hover:bg-gray-800 rounded-xl text-gray-300 hover:text-white transition-colors relative border border-transparent hover:border-gray-700">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-gray-950"></span>
                        </button>

                        {user ? (
                            <div className="flex items-center gap-2 pl-2 border-l border-gray-800">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-900/30 text-green-400 border border-green-800/50 rounded-xl font-medium">
                                    <User size={16} />
                                    <span>{firstName}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-5 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
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
                        <button
                            onClick={toggleMenu}
                            className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
                        >
                            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 pb-6 border-t border-gray-800 pt-6 animate-in slide-in-from-top-4 duration-200">
                        <div className="flex flex-col gap-2 text-lg font-medium">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.path;
                                return (
                                    <Link 
                                        key={link.path}
                                        to={link.path} 
                                        className={`px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-green-500/10 text-green-400' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                                        onClick={closeMenu}
                                    >
                                        {link.label}
                                    </Link>
                                )
                            })}
                        </div>

                        {/* Mobile Actions */}
                        <div className="mt-8 flex flex-col gap-3 px-2 border-t border-gray-800 pt-6">
                            <button
                                onClick={toggleLanguage}
                                className="flex items-center justify-center gap-3 py-3.5 bg-gray-900 border border-gray-800 rounded-2xl text-gray-300 hover:text-white transition-colors font-medium"
                            >
                                <Globe size={20} />
                                {language === 'en' ? 'Switch to አማርኛ' : 'Switch to English'}
                            </button>

                            {user ? (
                                <div className="grid grid-cols-2 gap-3 mt-2">
                                    <div className="flex items-center justify-center gap-2 py-3.5 bg-green-900/20 border border-green-800/40 rounded-2xl text-green-400 font-medium">
                                        <User size={18} /> {firstName}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center justify-center gap-2 py-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 hover:bg-red-500/20 transition-colors font-medium"
                                    >
                                        <LogOut size={18} /> Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 mt-2">
                                    <button
                                        onClick={() => { navigate('/login'); closeMenu(); }}
                                        className="py-3.5 text-center border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 rounded-2xl transition-colors font-medium"
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
    );
};

export default Navbar;