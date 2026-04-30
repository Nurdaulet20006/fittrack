import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProfile } from './types';

// Components
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import GymDetails from './pages/GymDetails';
import AICoach from './pages/AICoach';
import Compare from './pages/Compare';
import Profile from './pages/Profile';
import Progress from './pages/Progress';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load profile from localStorage instead of Firebase Auth
    const savedProfile = localStorage.getItem('guest_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-16 md:pb-0 md:pl-0">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gym/:id" element={<GymDetails />} />
            <Route path="/ai-coach" element={<AICoach profile={profile} />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/profile" element={<Profile profile={profile} setProfile={setProfile} />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </Router>
  );
}
