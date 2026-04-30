import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const InstagramIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

const TwitterIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
);

const YoutubeIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
);

const FacebookIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8 transition-colors duration-300 mt-auto">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
                    {/* Brand and Description */}
                    <div className="md:col-span-5 lg:col-span-4">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-900/30">
                                <Leaf size={20} />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Fertilizer<span className="text-green-500">Hub</span>
                            </h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-sm">
                            Empowering Ethiopian farmers with reliable access to quality fertilizers. Ensuring food security through transparent, fair, and modern distribution.
                        </p>

                        {/* Social Icons */}
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all border border-gray-100 dark:border-gray-800">
                                <InstagramIcon size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all border border-gray-100 dark:border-gray-800">
                                <TwitterIcon size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all border border-gray-100 dark:border-gray-800">
                                <FacebookIcon size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all border border-gray-100 dark:border-gray-800">
                                <YoutubeIcon size={18} />
                            </a>
                        </div>
                    </div>

                    <div className="md:col-span-1 lg:col-span-2 hidden md:block"></div>

                    {/* Quick Links */}
                    <div className="md:col-span-3 lg:col-span-3">
                        <h3 className="text-sm font-bold tracking-wider text-gray-900 dark:text-white uppercase mb-6">Quick Links</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link to="/news" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">News & Updates</Link>
                            </li>
                            <li>
                                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">Order Fertilizer</Link>
                            </li>
                            <li>
                                <Link to="/support" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">Support & Help</Link>
                            </li>
                            <li>
                                <Link to="/faq" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">FAQ</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="md:col-span-3 lg:col-span-3">
                        <h3 className="text-sm font-bold tracking-wider text-gray-900 dark:text-white uppercase mb-6">Resources</h3>
                        <ul className="space-y-4">
                            <li>
                                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">Farming Guides</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">Regional Offices</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">Partner Network</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">Contact Us</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        © {new Date().getFullYear()} FERTILIZERHUB. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex items-center gap-6 text-sm font-medium">
                        <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors uppercase tracking-wider text-xs">Terms</a>
                        <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors uppercase tracking-wider text-xs">Privacy</a>
                        <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors uppercase tracking-wider text-xs">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
