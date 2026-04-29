import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Phone, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Login failed');

            login(data.user, data.token);
            toast.success(`Welcome back, ${data.user.fullname || 'Admin'}!`);

            setTimeout(() => {
                if (data.user.role === 'admin') navigate('/admin');
                else navigate('/');
            }, 800);
        } catch (err: any) {
            toast.error(err.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 relative overflow-hidden">
            <Toaster position="top-right" />

            {/* Background blobs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-900/20 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-900/20 rounded-full blur-3xl -z-10" />

            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-4 shadow-lg shadow-green-900/50">
                        <Leaf size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-1">Welcome Back</h1>
                    <p className="text-gray-400 text-sm">Sign in to FertilizerHub</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-3xl p-7 space-y-5 shadow-xl">
                    {/* Identifier */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email or Phone</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                {identifier.includes('@') ? (
                                    <Mail size={17} className="text-gray-500" />
                                ) : (
                                    <Phone size={17} className="text-gray-500" />
                                )}
                            </div>
                            <input
                                type="text"
                                value={identifier}
                                onChange={e => setIdentifier(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-600 placeholder-gray-600 transition"
                                placeholder="Enter email or phone number"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock size={17} className="text-gray-500" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full pl-11 pr-12 py-3 bg-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-600 placeholder-gray-600 transition"
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition"
                            >
                                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-900/30"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        ) : (
                            <><LogIn size={18} /> Sign In</>
                        )}
                    </button>

                    {/* Admin hint */}
                    <div className="bg-gray-800/60 rounded-xl p-3 text-xs text-gray-500 text-center">
                        Admin: <span className="text-gray-300">admin@fertilizerhub.et</span> / <span className="text-gray-300">admin123</span>
                    </div>
                </form>

                <p className="text-center mt-5 text-gray-400 text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-green-400 hover:text-green-300 font-medium transition">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;