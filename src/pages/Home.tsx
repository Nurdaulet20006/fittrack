import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Gym } from '../types';
import { Search, SlidersHorizontal, MapPin, Star, ChevronRight, Dumbbell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice, cn } from '../lib/utils';
import { motion } from 'framer-motion';

export default function Home() {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [loading, setLoading] = useState(true);

  const districts = ['All', 'Bostandyk', 'Almaly', 'Medeu', 'Auezov', 'Turksib', 'Nauryzbay'];

  useEffect(() => {
    const fetchGyms = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'gyms'));
      const gymData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Gym));
      setGyms(gymData);
      setLoading(false);
    };
    fetchGyms();
  }, []);

  const filteredGyms = gyms.filter(gym => {
    const matchesSearch = gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          gym.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict = selectedDistrict === 'All' || gym.district === selectedDistrict;
    return matchesSearch && matchesDistrict;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero */}
      <section className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
          Find Your <span className="text-blue-600">Almaty</span> Strength
        </h1>
        <p className="text-slate-400 max-w-lg leading-relaxed">
          The most complete discovery platform for fitness enthusiasts in Kazakhstan's cultural capital.
        </p>
      </section>

      {/* Search & Filters */}
      <div className="sticky top-20 z-30 bg-slate-950/80 backdrop-blur-xl py-4 -mx-4 px-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
          <input
            type="text"
            placeholder="Search gyms in Bostandyk, Medeu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all font-medium"
          />
        </div>

        <div className="flex overflow-x-auto pb-2 space-x-2 scrollbar-hide no-scrollbar">
          {districts.map(district => (
            <button
              key={district}
              onClick={() => setSelectedDistrict(district)}
              className={cn(
                "px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all border",
                selectedDistrict === district 
                  ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
              )}
            >
              {district}
            </button>
          ))}
        </div>
      </div>

      {/* Gym List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-80 bg-slate-900 rounded-3xl animate-pulse" />
          ))
        ) : filteredGyms.length > 0 ? (
          filteredGyms.map((gym, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={gym.id}
            >
              <Link
                to={`/gym/${gym.id}`}
                className="group block bg-slate-900/50 rounded-3xl overflow-hidden border border-slate-800 hover:border-blue-500 transition-all shadow-xl backdrop-blur-sm"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={gym.photos?.[0] || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80'}
                    alt={gym.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                    {gym.district}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-lg flex items-center space-x-1 border border-slate-700">
                    <Star className="text-yellow-400 fill-yellow-400" size={14} />
                    <span className="text-xs font-bold text-white">{gym.rating}</span>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-white tracking-tight leading-none group-hover:text-blue-400 transition-colors">{gym.name}</h3>
                      <div className="flex items-center text-slate-500 text-xs mt-2">
                        <MapPin size={12} className="mr-1 text-blue-500" />
                        <span className="truncate">{gym.address}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block text-lg font-black text-white">{formatPrice(gym.monthlyPrice)}</span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">/ month</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
                    {gym.amenities.slice(0, 3).map(amn => (
                      <span key={amn} className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-1 rounded-md uppercase font-bold tracking-wider border border-slate-700/50">
                        {amn}
                      </span>
                    ))}
                    {gym.amenities.length > 3 && (
                      <span className="text-[10px] text-slate-500 font-bold self-center">+{gym.amenities.length - 3} more</span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-full text-slate-700 border border-slate-800">
              <Dumbbell size={32} />
            </div>
            <p className="text-slate-500 font-medium tracking-tight">No gyms found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
