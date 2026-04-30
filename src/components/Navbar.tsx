import { Link } from 'react-router-dom';
import { Dumbbell, Layers } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="hidden md:flex sticky top-0 h-20 items-center justify-between px-8 bg-slate-900 border-b border-slate-800 z-50 shadow-md">
      <Link to="/" className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
          <Dumbbell size={24} />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tighter text-white">FIT TRACK</span>
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] -mt-1">Almaty</span>
        </div>
      </Link>

      <nav className="flex items-center space-x-10">
        <Link to="/" className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-all">Explore</Link>
        <Link to="/ai-coach" className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-all">Neuro-Coach</Link>
        <Link to="/progress" className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-all">Progress</Link>
        <Link to="/compare" className="flex items-center space-x-3 text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-[0.2em] transition-all bg-slate-800/50 px-5 py-2.5 rounded-xl border border-slate-700/50 hover:bg-slate-800">
          <Layers size={14} className="text-blue-500" />
          <span>Compare</span>
        </Link>
      </nav>

      <Link to="/profile" className="w-10 h-10 rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-all overflow-hidden shadow-lg">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="w-full h-full object-cover" />
      </Link>
    </header>
  );
}
