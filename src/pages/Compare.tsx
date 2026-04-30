import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Gym } from '../types';
import { Layers, Plus, X, Star, Check, Minus } from 'lucide-react';
import { formatPrice, cn } from '../lib/utils';
import { motion } from 'framer-motion';

export default function Compare() {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGyms = async () => {
      const querySnapshot = await getDocs(collection(db, 'gyms'));
      setGyms(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Gym)));
      setLoading(false);
    };
    fetchGyms();

    const saved = localStorage.getItem('compare_ids');
    if (saved) setCompareIds(JSON.parse(saved));
  }, []);

  const toggleCompare = (id: string) => {
    const newIds = compareIds.includes(id) 
      ? compareIds.filter(i => i !== id) 
      : compareIds.length < 3 ? [...compareIds, id] : compareIds;
    setCompareIds(newIds);
    localStorage.setItem('compare_ids', JSON.stringify(newIds));
  };

  const selectedGyms = gyms.filter(g => compareIds.includes(g.id));

  if (loading) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
            <Layers className="text-blue-500" size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">Grid Analysis</h1>
        </div>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] max-w-[200px] leading-relaxed">
          Concurrent comparison of up to 3 facilities for optimal selection.
        </p>
      </div>

      {compareIds.length > 0 ? (
        <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
          <table className="w-full min-w-[800px] border-separate border-spacing-x-4">
            <thead>
              <tr>
                <th className="w-48"></th>
                {selectedGyms.map(gym => (
                  <th key={gym.id} className="bg-slate-900 backdrop-blur-sm rounded-t-3xl p-6 border-x border-t border-slate-800 align-top relative group">
                    <button 
                      onClick={() => toggleCompare(gym.id)} 
                      className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition-colors bg-slate-950 p-1.5 rounded-lg border border-slate-800 opacity-0 group-hover:opacity-100"
                    >
                      <X size={14} />
                    </button>
                    <div className="w-full h-32 rounded-2xl overflow-hidden mb-4 shadow-2xl border border-slate-800">
                      <img src={gym.photos[0]} className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-700" alt="" />
                    </div>
                    <h3 className="text-lg font-black text-white italic uppercase tracking-tighter line-clamp-1">{gym.name}</h3>
                  </th>
                ))}
                {Array(Math.max(0, 3 - selectedGyms.length)).fill(0).map((_, i) => (
                  <th key={i} className="bg-slate-900/20 rounded-t-3xl p-6 border-dashed border-2 border-slate-800 align-top opacity-30">
                    <div className="h-full flex flex-col items-center justify-center space-y-2 py-10">
                       <Plus size={24} className="text-slate-700" />
                       <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Available Slot</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-center font-bold">
              {[
                { label: 'Rating', key: 'rating', render: (val: any) => <div className="flex items-center justify-center space-x-1 text-blue-500 font-black italic"><Star size={14} fill="currentColor" /><span>{val}</span></div> },
                { label: 'Monthly Investment', key: 'monthlyPrice', render: (val: any) => <span className="text-white italic tracking-tighter">{formatPrice(val)}</span> },
                { label: 'Zone/District', key: 'district', render: (val: any) => <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{val}</span> },
                { label: 'Aquatic Center', feature: 'Swimming Pool' },
                { label: 'Mind & Body Zone', feature: 'Yoga' },
                { label: 'Thermal Recovery', feature: 'Spa' },
                { label: 'Functional Power', feature: 'CrossFit' },
                { label: 'Metabolic Training', feature: 'Cardio Zone' },
              ].map((row, i) => (
                <tr key={i}>
                  <td className="text-left py-5 px-4 text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black border-b border-slate-800/30">{row.label}</td>
                  {selectedGyms.map(gym => (
                    <td key={gym.id} className="bg-slate-900 p-6 border-x border-b border-slate-800 text-sm">
                      {row.key ? (row.render ? row.render((gym as any)[row.key]) : (gym as any)[row.key]) : (
                        gym.amenities.some(a => row.feature && a.includes(row.feature)) 
                          ? <Check className="mx-auto text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" /> 
                          : <Minus className="mx-auto text-slate-800" />
                      )}
                    </td>
                  ))}
                  {Array(Math.max(0, 3 - selectedGyms.length)).fill(0).map((_, i) => (
                    <td key={i} className="bg-slate-900/10 p-6 border-x border-b border-slate-800 border-dashed opacity-20" />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-[2.5rem] p-16 text-center space-y-6 border border-slate-800 border-dashed shadow-2xl">
          <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center mx-auto border border-slate-800 shadow-inner">
            <Plus size={32} className="text-slate-700" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-white uppercase tracking-wider italic">Empty Buffer</h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest max-w-xs mx-auto">Interface initialized. Select items for concurrent processing.</p>
          </div>
        </div>
      )}

      {/* Selector Grid */}
      <div className="space-y-6 mt-12">
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 flex items-center">
          <div className="w-1 h-1 bg-blue-500 mr-2 rounded-full animate-pulse" />
          Queue Deployment
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gyms.slice(0, 8).map(gym => (
            <button
              key={gym.id}
              onClick={() => toggleCompare(gym.id)}
              className={cn(
                "p-5 rounded-3xl border transition-all text-left space-y-4 relative overflow-hidden active:scale-95",
                compareIds.includes(gym.id) 
                  ? "bg-blue-600/10 border-blue-500 text-white shadow-lg shadow-blue-600/10" 
                  : "bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-700 hover:bg-slate-900"
              )}
            >
              <div className="flex justify-between items-start">
                <h4 className="text-[10px] font-black uppercase tracking-widest truncate w-32">{gym.name}</h4>
                {compareIds.includes(gym.id) ? (
                  <div className="p-1 bg-blue-600 rounded">
                    <Check size={10} className="text-white" />
                  </div>
                ) : (
                  <Plus size={12} className="text-slate-600" />
                )}
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">{formatPrice(gym.monthlyPrice)}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
