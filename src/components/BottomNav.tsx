import { Link, useLocation } from 'react-router-dom';
import { Home, Sparkles, Activity, User, BarChart3 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { name: 'Scan', path: '/', icon: Home },
    { name: 'Coach', path: '/ai-coach', icon: Sparkles },
    { name: 'Progress', path: '/progress', icon: Activity },
    { name: 'Review', path: '/compare', icon: BarChart3 },
    { name: 'Bio', path: '/profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900 border-t border-slate-800 flex items-center justify-around z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center space-y-1 w-full h-full transition-colors",
              isActive ? "text-blue-500" : "text-slate-500"
            )}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
