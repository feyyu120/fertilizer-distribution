import { useState } from 'react';
import { Bell, Globe, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [language, setLanguage] = useState<'en' | 'am'>('en');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'am' : 'en');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="bg-black/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-2xl">
                            🌱
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-2xl font-bold tracking-tight">Fertilizer<span className="text-green-500">Hub</span></h1>
                            <p className="text-xs text-gray-500 -mt-1">For Ethiopian Farmers</p>
                        </div>
                        <div className="sm:hidden">
                            <h1 className="text-xl font-bold">FertilizerHub</h1>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-10 text-md font-medium">
                        <Link to="/" className="hover:text-green-400 transition-colors" onClick={closeMenu}>Home</Link>
                        <Link to="/news" className="hover:text-green-400 transition-colors" onClick={closeMenu}>News</Link>
                        <Link to="/faq" className="hover:text-green-400 transition-colors" onClick={closeMenu}>FAQ</Link>
                        <Link to="/support" className="hover:text-green-400 transition-colors" onClick={closeMenu}>Support</Link>
                    </div>

                    {/* Right Side - Desktop */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Language Selector */}
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors text-sm"
                        >
                            <Globe size={18} />
                            <span className="hidden sm:inline">{language === 'en' ? 'English' : 'አማርኛ'}</span>
                        </button>

                        {/* Notification */}
                        <button className="p-3 hover:bg-gray-800 rounded-xl transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-black"></span>
                        </button>

                        <button
                            onClick={() => navigate('/login')}
                            className="px-6 py-2 text-sm font-medium hover:bg-gray-800 rounded-xl transition-colors"
                        >
                            Sign in
                        </button>

                        <button
                            onClick={() => navigate('/register')}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-xl text-sm font-medium transition-all active:scale-95"
                        >
                            Get Started
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden p-3 text-white hover:bg-gray-800 rounded-xl transition-colors"
                    >
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden mt-6 pb-6 border-t border-gray-800 pt-6">
                        <div className="flex flex-col gap-6 text-lg">
                            <Link to="/" className="hover:text-green-400 transition-colors" onClick={closeMenu}>Home</Link>
                            <Link to="/news" className="hover:text-green-400 transition-colors" onClick={closeMenu}>News</Link>
                            <Link to="/faq" className="hover:text-green-400 transition-colors" onClick={closeMenu}>FAQ</Link>
                            <Link to="/support" className="hover:text-green-400 transition-colors" onClick={closeMenu}>Support</Link>
                        </div>

                        {/* Mobile Actions */}
                        <div className="mt-8 flex flex-col gap-4">
                            <button
                                onClick={toggleLanguage}
                                className="flex items-center justify-center gap-3 py-4 bg-gray-900 rounded-2xl hover:bg-gray-800 transition-colors"
                            >
                                <Globe size={22} />
                                {language === 'en' ? 'አማርኛ' : 'English'}
                            </button>

                            <button
                                onClick={() => { navigate('/login'); closeMenu(); }}
                                className="py-4 text-center border border-gray-700 rounded-2xl hover:bg-gray-900 transition-colors"
                            >
                                Sign in
                            </button>

                            <button
                                onClick={() => { navigate('/register'); closeMenu(); }}
                                className="py-4 bg-green-600 hover:bg-green-700 rounded-2xl font-medium transition-all"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;