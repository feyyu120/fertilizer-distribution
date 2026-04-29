import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, password })
            })
            if (!response.ok) throw new Error("Login failed");
            const data = await response.json();
            console.log(data);
            alert("Login successful!");
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Redirect based on role
            if (data.user.role === 'admin') {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (error) {
            console.log("error occured")
            alert("Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 px-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-bold mb-3">Welcome Back</h2>
                    <p className="text-gray-400">Sign in to access your fertilizer orders</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900 p-8 rounded-3xl border border-gray-800">
                    <div>
                        <label className="block text-sm mb-2">Email or Phone</label>
                        <input
                            type="text"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                            placeholder="Enter email or phone"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-green-600 hover:bg-green-700 rounded-2xl font-semibold text-lg"
                    >
                        Sign In
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-green-500 hover:underline">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;