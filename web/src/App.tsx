import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import News from './pages/News';
import FAQ from './pages/FAQ';
import Support from './pages/Support';
import AdminDashboard from './pages/AdminDashboard';

// Custom route to redirect logged-in users away from auth pages
const GuestRoute = ({ children }: { children: JSX.Element }) => {
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
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/news" element={<News />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/support" element={<Support />} />
    </Routes>
  </div>
);

export default App;