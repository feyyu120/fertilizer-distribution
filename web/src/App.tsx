import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import News from './pages/News';
import CreatePost from './pages/CreatePost';
import FAQ from './pages/FAQ';
import Support from './pages/Support';
import AdminDashboard from './pages/AdminDashboard';
import OrderFertilizer from './pages/OrderFertilizer';
import AiAssistant from './components/Ai';
import React from 'react';

// Custom route to redirect logged-in users away from auth pages
const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AiAssistant />
        <Routes>
          <Route path="/*" element={<UserLayout />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

// Layout for normal users (with Navbar)
const UserLayout = () => (
  <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
    <Navbar />
    <main className="flex-1 flex flex-col relative">
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/news" element={<News />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/order-fertilizer/:id" element={<OrderFertilizer />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/support" element={<Support />} />
      </Routes>
    </main>
    <Footer />
  </div>
);

export default App;