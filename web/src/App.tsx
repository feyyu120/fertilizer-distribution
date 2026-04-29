import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import News from './pages/News';
import FAQ from './pages/FAQ';
import Support from './pages/Support';
import AdminDashboard from './pages/AdminDashboard';   // New
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/*" element={<UserLayout />} />
        <Route path="/admin/*" element={<AdminDashboard />} />


      </Routes>
    </Router>
  );
}

// Separate layout for normal users
const UserLayout = () => (
  <div className="min-h-screen bg-gray-950 text-white">
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/news" element={<News />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/support" element={<Support />} />
    </Routes>
  </div>
);

export default App;