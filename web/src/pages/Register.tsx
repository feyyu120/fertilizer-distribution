import { ClipboardSignature, CloudCog } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        fullname: '',
        phone: '',
        email: "",
        password: '',
        address: '',
        landSize: '',
    });
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/auth/register",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                })
            if (!response.ok) throw new Error("Registration failed");
            const data = await response.json();
            console.log(data);
            alert("Registration successful! Waiting for admin approval.");
            setFormData({ fullname: '', phone: '', email: "", password: '', address: '', landSize: '', });
            navigate("/login");
        } catch (error) {
            console.log("error occured")
        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 py-12 px-6">
            <div className="w-full max-w-lg">
                <h2 className="text-4xl font-bold text-center mb-8">Join as Farmer</h2>

                <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900 p-8 rounded-3xl border border-gray-800">
                    <div className="grid grid-cols-1 gap-6">
                        <input type="text" name="fullname" placeholder="Full Name" onChange={handleChange} required className="w-full px-4 py-3 bg-gray-800 rounded-xl" />
                        <input type="tel" name="phone" placeholder="Phone Number (+251)" onChange={handleChange} required className="w-full px-4 py-3 bg-gray-800 rounded-xl" />
                        <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required className="w-full px-4 py-3 bg-gray-800 rounded-xl" />
                        <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full px-4 py-3 bg-gray-800 rounded-xl" />
                        <input type="text" name="address" placeholder="Kebele / Address" onChange={handleChange} required className="w-full px-4 py-3 bg-gray-800 rounded-xl" />
                        <input type="text" name="landSize" placeholder="Land Size (in hectare)" onChange={handleChange} required className="w-full px-4 py-3 bg-gray-800 rounded-xl" />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-green-600 hover:bg-green-700 rounded-2xl font-semibold text-lg mt-4"
                    >
                        Submit Registration (Pending Admin Approval)
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-400">
                    Already registered? <Link to="/login" className="text-green-500 hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;