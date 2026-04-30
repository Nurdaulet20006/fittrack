import { useState, useEffect, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Activity, Ruler, Weight, Flame, Footprints, CheckCircle2, History, Plus, Save, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProgressEntry {
  id: string;
  date: string;
  weight: number;
  height: number;
  calories: number;
  steps: number;
  workoutDone: boolean;
  notes: string;
}

export default function Progress() {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<ProgressEntry>>({
    weight: 0,
    height: 0,
    calories: 0,
    steps: 0,
    workoutDone: false,
    notes: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('guest_progress_logs');
    if (saved) {
      setEntries(JSON.parse(saved));
    } else {
      // Load initial from profile if exists
      const profile = localStorage.getItem('guest_profile');
      if (profile) {
        const p = JSON.parse(profile);
        setFormData(prev => ({ ...prev, weight: p.weight, height: p.height }));
      }
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : (type === 'number' ? Number(value) : value);
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const saveEntry = () => {
    const newEntry: ProgressEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      weight: formData.weight || 0,
      height: formData.height || 0,
      calories: formData.calories || 0,
      steps: formData.steps || 0,
      workoutDone: !!formData.workoutDone,
      notes: formData.notes || ''
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('guest_progress_logs', JSON.stringify(updated));
    setShowForm(false);
    
    // Also update profile basic stats if they changed
    const profile = localStorage.getItem('guest_profile');
    if (profile) {
      const p = JSON.parse(profile);
      localStorage.setItem('guest_profile', JSON.stringify({ ...p, weight: newEntry.weight, height: newEntry.height }));
    }
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('guest_progress_logs', JSON.stringify(updated));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
            <Activity className="text-blue-500" size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">Bio-Log</h1>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center space-x-2 text-xs"
        >
          {showForm ? <span>Cancel</span> : <><Plus size={18} /><span>Add Entry</span></>}
        </button>
      </div>

      {showForm && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 flex items-center">
                    <Weight size={10} className="mr-1" /> Weight (KG)
                  </label>
                  <input 
                    type="number" 
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white font-bold text-xs focus:ring-2 focus:ring-blue-600/50 outline-none transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 flex items-center">
                    <Ruler size={10} className="mr-1" /> Height (CM)
                  </label>
                  <input 
                    type="number" 
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white font-bold text-xs focus:ring-2 focus:ring-blue-600/50 outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 flex items-center">
                    <Flame size={10} className="mr-1" /> Calories
                  </label>
                  <input 
                    type="number" 
                    name="calories"
                    value={formData.calories}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white font-bold text-xs focus:ring-2 focus:ring-blue-600/50 outline-none transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 flex items-center">
                    <Footprints size={10} className="mr-1" /> Steps
                  </label>
                  <input 
                    type="number" 
                    name="steps"
                    value={formData.steps}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white font-bold text-xs focus:ring-2 focus:ring-blue-600/50 outline-none transition-all" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Insights / Notes</label>
                <textarea 
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="How was your energy today? Any PRs?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white font-bold text-xs min-h-[100px] outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
                />
              </div>

              <div className="flex items-center space-x-3 p-4 bg-slate-950 rounded-2xl border border-slate-800/50">
                <input 
                  type="checkbox" 
                  name="workoutDone"
                  id="workoutDone"
                  checked={formData.workoutDone}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-600/50" 
                />
                <label htmlFor="workoutDone" className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer">Training Protocol Completed</label>
              </div>
            </div>
          </div>

          <button 
            onClick={saveEntry}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center space-x-2 text-xs"
          >
            <Save size={18} />
            <span>Commit Entry to Memory</span>
          </button>
        </motion.div>
      )}

      <div className="space-y-6">
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 flex items-center">
          <History size={14} className="mr-2" />
          Neural Logs
        </h2>
        
        <div className="space-y-4">
          {entries.length > 0 ? entries.map((entry) => (
            <motion.div 
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-slate-700 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Date</p>
                    <p className="text-xs font-black text-white italic">{new Date(entry.date).toLocaleDateString()}</p>
                  </div>
                  <div className="w-px h-8 bg-slate-800 hidden md:block" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    <div>
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Weight</p>
                      <p className="text-xs font-black text-blue-400 italic">{entry.weight} kg</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Calories</p>
                      <p className="text-xs font-black text-white">{entry.calories}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Steps</p>
                      <p className="text-xs font-black text-white">{entry.steps.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {entry.workoutDone ? (
                        <div className="px-2 py-1 bg-emerald-500/10 rounded border border-emerald-500/20 text-[8px] font-black text-emerald-500 uppercase tracking-widest flex items-center">
                          <CheckCircle2 size={10} className="mr-1" /> Trained
                        </div>
                      ) : (
                        <div className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-[8px] font-black text-slate-500 uppercase tracking-widest">
                          Rest
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between md:justify-end space-x-4">
                  {entry.notes && (
                    <div className="max-w-[200px] hidden lg:block">
                      <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Notes</p>
                      <p className="text-[10px] text-slate-400 line-clamp-1 italic">"{entry.notes}"</p>
                    </div>
                  )}
                  <button 
                    onClick={() => deleteEntry(entry.id)}
                    className="p-3 bg-slate-950 text-slate-600 hover:text-red-500 border border-slate-800 rounded-xl transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="py-20 text-center bg-slate-900/20 rounded-[2.5rem] border border-slate-800 border-dashed backdrop-blur-sm">
               <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-xs">Biometric sequence not found.</p>
               <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest mt-2 mt-2">Initialize log to track evolution.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
