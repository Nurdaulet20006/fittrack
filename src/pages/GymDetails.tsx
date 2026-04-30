import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Gym, Review } from '../types';
import { 
  Star, MapPin, Clock, Phone, Globe, Share2, Heart, Navigation, 
  ChevronLeft, MessageCircle, CheckCircle2, StarHalf
} from 'lucide-react';
import { formatPrice, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function GymDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gym, setGym] = useState<Gym | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchGym = async () => {
      if (!id) return;
      setLoading(true);
      const gymDoc = await getDoc(doc(db, 'gyms', id));
      if (gymDoc.exists()) {
        const gymData = { id: gymDoc.id, ...gymDoc.data() } as Gym;
        setGym(gymData);
        
        // Fetch reviews
        const q = query(collection(db, 'reviews'), where('gymId', '==', id));
        const reviewSnapshot = await getDocs(q);
        setReviews(reviewSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review)));

        // Check if favorite in localStorage
        const savedFavs = JSON.parse(localStorage.getItem('guest_favorites') || '[]');
        if (savedFavs.some((fav: any) => fav.id === id)) {
          setIsFavorite(true);
        }
      }
      setLoading(false);
    };
    fetchGym();
  }, [id]);

  const toggleFavorite = () => {
    if (!gym) return;

    const savedFavs = JSON.parse(localStorage.getItem('guest_favorites') || '[]');
    if (isFavorite) {
      const updatedFavs = savedFavs.filter((fav: any) => fav.id !== gym.id);
      localStorage.setItem('guest_favorites', JSON.stringify(updatedFavs));
      setIsFavorite(false);
    } else {
      const newFavs = [...savedFavs, gym];
      localStorage.setItem('guest_favorites', JSON.stringify(newFavs));
      setIsFavorite(true);
    }
  };

  const handleRoute = () => {
    if (!gym) return;
    
    // 1. If explicit URL provided, use it
    if (gym.googleMapsUrl) {
      window.open(gym.googleMapsUrl, '_blank');
      return;
    }

    // 2. Otherwise generate Directions URL using Name + Address for pin accuracy
    const destinationAddress = encodeURIComponent(`${gym.name} ${gym.address}`);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        // Search by both location and name for Google to find the exact place card
        const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${destinationAddress}&travelmode=driving`;
        window.open(url, '_blank');
      }, (error) => {
        console.error("Geolocation error:", error);
        const url = `https://www.google.com/maps/dir/?api=1&destination=${destinationAddress}&travelmode=driving`;
        window.open(url, '_blank');
      });
    } else {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${destinationAddress}&travelmode=driving`;
      window.open(url, '_blank');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Signal captured: Link copied.');
  };

  if (loading || !gym) {
    return (
      <div className="flex flex-col items-center justify-center p-20 animate-pulse text-blue-500 italic font-bold h-[60vh] space-y-4">
        <div className="w-12 h-12 bg-blue-600 rounded-xl animate-bounce"></div>
        <span className="uppercase tracking-[0.3em] text-xs">Loading Fitness Sanctuary...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-8 flex items-center space-x-2 text-slate-500 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 backdrop-blur-sm"
      >
        <ChevronLeft size={16} />
        <span>Return to Exploration</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Header Image */}
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
            <img 
              src={gym.photos?.[0] || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80'} 
              className="w-full h-full object-cover" 
              alt={gym.name} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                {gym.district}
              </span>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
               <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic drop-shadow-lg">{gym.name}</h1>
               <div className="flex items-center space-x-4 mt-3">
                  <div className="flex items-center text-blue-400 font-black bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                    <Star size={16} fill="currentColor" className="text-yellow-400" />
                    <span className="ml-1 text-lg">{gym.rating}</span>
                  </div>
                  <span className="text-slate-300 font-bold text-xs uppercase tracking-widest bg-black/30 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/5">{gym.reviewCount} EXPERIENCED</span>
                </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-slate-400 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
            <MapPin size={16} className="text-blue-500" />
            <span className="font-medium text-sm">{gym.address}</span>
          </div>

          {/* Action Tabs */}
          <div className="border-b border-slate-800 flex space-x-8">
            {['Overview', 'Photos', 'Reviews', 'Schedule'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "pb-4 text-xs font-black uppercase tracking-widest transition-all relative",
                  activeTab === tab ? "text-white" : "text-slate-500 hover:text-slate-300"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full shadow-[0_-4px_12px_rgba(37,99,235,0.4)]" />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="py-4"
            >
              {activeTab === 'Overview' && (
                <div className="space-y-8">
                  <div className="space-y-4 text-slate-400 leading-relaxed text-sm bg-slate-900/30 p-6 rounded-3xl border border-slate-800/50">
                    <p>{gym.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 shadow-lg">
                      <h4 className="text-xs font-black text-white uppercase tracking-widest mb-3 flex items-center">
                        <Clock size={14} className="mr-2 text-blue-500" />
                        Availability
                      </h4>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">{gym.workingHours}</p>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 shadow-lg">
                      <h4 className="text-xs font-black text-white uppercase tracking-widest mb-3 flex items-center">
                        <CheckCircle2 size={14} className="mr-2 text-emerald-400" />
                        Key Features
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {gym.amenities.map(a => (
                          <span key={a} className="text-[10px] bg-slate-800 px-2 py-1 rounded-md font-bold uppercase tracking-tighter border border-slate-700/50 text-slate-300">{a}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Photos' && (
                <div className="grid grid-cols-2 gap-4">
                  {gym.photos.map((photo, i) => (
                    <img key={i} src={photo} className="rounded-2xl h-48 w-full object-cover shadow-xl border border-slate-800" alt="" />
                  ))}
                </div>
              )}

              {activeTab === 'Reviews' && (
                <div className="space-y-4">
                  {reviews.length > 0 ? reviews.map(rev => (
                    <div key={rev.id} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-3 shadow-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white text-xs uppercase tracking-[0.2em]">{rev.userName}</span>
                        <div className="flex text-yellow-500 bg-black/20 px-2 py-1 rounded-lg border border-white/5">
                           {Array(Math.floor(rev.rating)).fill(0).map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                        </div>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed italic">"{rev.text}"</p>
                    </div>
                  )) : <p className="text-slate-500 italic text-center py-10">No member reports yet. Launch yours above.</p>}
                </div>
              )}

              {activeTab === 'Schedule' && (
                <div className="bg-slate-900/50 p-12 rounded-3xl border border-slate-800 text-center space-y-3 shadow-xl backdrop-blur-sm">
                   <Clock className="mx-auto text-slate-700 mb-2" size={40} />
                   <p className="text-xs font-black text-white uppercase tracking-[0.3em]">Temporal Anomaly</p>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Schedule metadata encrypted. Please bridge with the facility representative for direct feed.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-[2.5rem] border border-slate-800 space-y-4 sticky top-24 shadow-2xl">
            <div className="mb-6 p-4 bg-slate-950 rounded-2xl border border-slate-800/50 text-center">
               <span className="block text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Standard Access</span>
               <span className="block text-3xl font-black text-white italic tracking-tighter">{formatPrice(gym.monthlyPrice)}</span>
               <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-1 inline-block">Renewable Monthly</span>
            </div>

            <button 
              onClick={handleRoute}
              className="w-full bg-slate-100 text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-white transition-all shadow-xl shadow-white/10 active:scale-[0.98] group"
            >
              <Navigation size={18} className="text-blue-600 group-hover:scale-125 transition-transform" />
              <span>Google Maps</span>
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <a 
                href={`tel:${gym.phone}`}
                className="bg-slate-800 text-slate-200 p-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex flex-col items-center justify-center space-y-2 border border-slate-700 hover:border-blue-500/50 transition-all shadow-lg"
              >
                <Phone size={18} className="text-blue-500" />
                <span>Call</span>
              </a>
              <a 
                href={`https://wa.me/${gym.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-800 text-slate-200 p-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex flex-col items-center justify-center space-y-2 border border-slate-700 hover:border-emerald-500/50 transition-all shadow-lg"
              >
                <MessageCircle size={18} className="text-emerald-500" />
                <span>WhatsApp</span>
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={toggleFavorite}
                className={cn(
                  "p-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex flex-col items-center justify-center space-y-2 border transition-all shadow-lg",
                  isFavorite ? "bg-blue-600/10 text-blue-400 border-blue-500/50 shadow-blue-500/10" : "bg-slate-800 text-slate-500 border-slate-700 hover:border-slate-500"
                )}
              >
                <Heart size={18} fill={isFavorite ? "currentColor" : "none"} className={isFavorite ? "text-red-500" : "text-slate-500"} />
                <span>{isFavorite ? 'ARCHIVED' : 'ARCHIVE'}</span>
              </button>
              <button 
                onClick={handleShare}
                className="bg-slate-800 text-slate-500 p-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex flex-col items-center justify-center space-y-2 border border-slate-700 hover:border-slate-500 transition-all shadow-lg"
              >
                <Share2 size={18} />
                <span>Link Sync</span>
              </button>
            </div>

            <div className="pt-6 border-t border-slate-800 space-y-4">
               <div className="flex items-center justify-between">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Portal</span>
                 <a href={gym.website} target="_blank" className="text-[10px] font-black text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-[0.2em] border-b border-blue-400/30">Connect Site</a>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Operational</span>
                 <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">ACTIVE NOW</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
