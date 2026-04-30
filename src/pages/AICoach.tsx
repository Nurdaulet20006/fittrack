import { useState, ChangeEvent, useEffect } from 'react';
import { UserProfile } from '../types';
import { generateFitnessPlan, UserData } from '../services/aiService';
import { Sparkles, Activity, Target, Zap, Waves, AlertTriangle, Lightbulb, Save, History } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface AICoachProps {
  profile: UserProfile | null;
}

export default function AICoach({ profile }: AICoachProps) {
  const [formData, setFormData] = useState<UserData>({
    gender: profile?.gender || 'male',
    age: profile?.age || 25,
    height: profile?.height || 175,
    weight: profile?.weight || 70,
    goal: profile?.goal || 'gain_muscle',
    activityLevel: profile?.activityLevel || 'moderate',
    experience: profile?.experience || 'beginner',
    daysPerWeek: profile?.daysPerWeek || 3,
    injuries: profile?.injuries || '',
    diseases: profile?.diseases || '',
    foodPreferences: profile?.foodPreferences || ''
  });

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'age' || name === 'height' || name === 'weight' || name === 'daysPerWeek' ? Number(value) : value }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const generatedPlan = await generateFitnessPlan(formData);
      setPlan(generatedPlan);
    } catch (err) {
      setError('Failed to generate plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('guest_ai_plans');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleSavePlan = () => {
    if (!plan) return;
    try {
      const savedPlans = JSON.parse(localStorage.getItem('guest_ai_plans') || '[]');
      const newPlan = {
        id: Date.now().toString(),
        plan: plan,
        createdAt: new Date().toISOString()
      };
      const updated = [newPlan, ...savedPlans];
      localStorage.setItem('guest_ai_plans', JSON.stringify(updated));
      setHistory(updated);
      alert('Plan archived to your local storage!');
    } catch (err) {
      alert('Failed to archive plan.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <section className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
            <Sparkles className="text-white" size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">AI Coach</h1>
        </div>
        <p className="text-slate-400 max-w-lg leading-relaxed">
          Your personalized, data-driven AI trainer that understands Almaty's fitness landscape and your unique physical needs.
        </p>
      </section>

      {!plan && (
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center space-x-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-blue-500 transition-colors bg-slate-900 px-4 py-2 rounded-xl border border-slate-800"
        >
          <History size={14} />
          <span>{showHistory ? 'Close Archive' : 'View Previous Computations'}</span>
        </button>
      )}

      {showHistory && !plan && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          {history.length > 0 ? history.map((item) => (
            <div 
              key={item.id} 
              onClick={() => { setPlan(item.plan); setShowHistory(false); }}
              className="bg-slate-900 border border-slate-800 p-5 rounded-3xl cursor-pointer hover:border-blue-500/50 transition-all group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{item.plan.goal.replace('_', ' ')} Plan</span>
                <span className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter">{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-xs font-bold text-white italic line-clamp-1 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{item.plan.workoutPlan[0]?.title || 'Workout Session'}</p>
            </div>
          )) : (
            <div className="col-span-full py-10 bg-slate-900/30 rounded-3xl border border-slate-800 border-dashed text-center">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">No archival data found.</p>
            </div>
          )}
        </div>
      )}

      {!plan && !showHistory && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-[2.5rem] p-8 md:p-12 border border-slate-800 shadow-2xl h-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Form Fields */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Anatomical Profile</label>
                <div className="grid grid-cols-2 gap-4">
                  <select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleInputChange}
                    className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-600/50 outline-none transition-all font-bold text-xs uppercase tracking-widest"
                  >
                    <option value="male">MALE</option>
                    <option value="female">FEMALE</option>
                  </select>
                  <input 
                    type="number" 
                    name="age" 
                    placeholder="AGE"
                    value={formData.age} 
                    onChange={handleInputChange}
                    className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-600/50 outline-none transition-all font-bold text-xs" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Height (CM)</label>
                  <input 
                    type="number" 
                    name="height" 
                    value={formData.height} 
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white font-bold text-xs focus:ring-2 focus:ring-blue-600/50 outline-none transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Weight (KG)</label>
                  <input 
                    type="number" 
                    name="weight" 
                    value={formData.weight} 
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white font-bold text-xs focus:ring-2 focus:ring-blue-600/50 outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Primary Objective</label>
                <select 
                  name="goal" 
                  value={formData.goal} 
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white font-bold uppercase text-xs tracking-widest focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                >
                  <option value="lose_fat">Lose Fat</option>
                  <option value="gain_muscle">Gain Muscle</option>
                  <option value="maintain">Maintain Equilibrium</option>
                  <option value="strength">Peak Strength</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Experience Tier</label>
                <select 
                  name="experience" 
                  value={formData.experience} 
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white font-bold uppercase text-xs tracking-widest focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                >
                  <option value="beginner">Phase 1: Beginner</option>
                  <option value="intermediate">Phase 2: Intermediate</option>
                  <option value="advanced">Phase 3: Advanced</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Structural Limitations</label>
                <textarea 
                  name="injuries" 
                  placeholder="Back tension, joint history..."
                  value={formData.injuries} 
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white font-bold text-xs min-h-[100px] outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">System Conditions</label>
                <textarea 
                  name="diseases" 
                  placeholder="Asthma, metabolic history, etc..."
                  value={formData.diseases} 
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white font-bold text-xs min-h-[100px] outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Fuel Preferences</label>
                <input 
                  type="text" 
                  name="foodPreferences" 
                  placeholder="Keto, Halal, Plant-based..."
                  value={formData.foodPreferences} 
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white font-bold text-xs focus:ring-2 focus:ring-blue-600/50 outline-none transition-all" 
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-[0.98]"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Zap size={20} />
                    <span>Initiate Computation</span>
                  </>
                )}
              </button>
              {error && <p className="text-red-500 text-[10px] font-black text-center uppercase tracking-widest">{error}</p>}
            </div>
          </div>
        </motion.div>
      )}

      {plan && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm">
             <button onClick={() => setPlan(null)} className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Reset Session</button>
             <button onClick={handleSavePlan} className="bg-blue-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all">
                <Save size={14} />
                <span>Archive Plan</span>
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Calories & Macros Sidebar */}
            <div className="space-y-6">
              <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 p-6 rounded-3xl shadow-2xl space-y-6">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Metabolic Target</h3>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-5xl font-black text-white italic tracking-tighter">{plan.calories.target}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">kcal / day</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Equilibrium Level: {plan.calories.maintenance} kcal</p>
                  </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-slate-800">
                  <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Macro Distribution</h3>
                  <div className="space-y-5">
                    {['protein', 'fat', 'carbs'].map(macro => (
                      <div key={macro} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-slate-500">{macro}</span>
                          <span className="text-white">{plan.macros[macro]}g</span>
                        </div>
                        <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                           <div 
                             className={cn("h-full rounded-full transition-all duration-1000", 
                               macro === 'protein' ? "bg-blue-500 w-3/4 shadow-[0_0_8px_rgba(59,130,246,0.5)]" : 
                               macro === 'fat' ? "bg-emerald-500 w-1/4 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-indigo-500 w-1/2 shadow-[0_0_8px_rgba(99,102,241,0.5)]")} 
                           />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {plan.warnings.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-3xl space-y-3 shadow-lg">
                  <div className="flex items-center space-x-2 text-red-500">
                    <AlertTriangle size={18} />
                    <h3 className="text-[10px] font-black uppercase tracking-widest">Integrity Alerts</h3>
                  </div>
                  <ul className="space-y-2">
                    {plan.warnings.map((w: string, i: number) => (
                      <li key={i} className="text-[10px] text-red-200/70 font-bold leading-relaxed uppercase tracking-tight">• {w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Main Plan Area */}
            <div className="md:col-span-2 space-y-8">
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <History size={100} className="text-blue-500" />
                 </div>
                 <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Biostructure Analysis</h2>
                 <p className="text-slate-200 text-lg font-medium leading-relaxed italic relative z-10 font-display tracking-tight">"{plan.bodyAnalysis}"</p>
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-black text-white uppercase italic tracking-tighter ml-2 flex items-center">
                  <Activity size={20} className="mr-2 text-blue-500" />
                  Structural Microcycle
                </h2>
                <div className="space-y-4">
                  {plan.workoutPlan.map((day: any, i: number) => (
                    <div key={i} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
                      <div className="flex justify-between items-center bg-slate-950/50 p-3 rounded-2xl border border-slate-800">
                        <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{day.day}</h4>
                        <span className="text-xs font-bold text-white uppercase tracking-tighter italic">{day.title}</span>
                      </div>
                      <div className="space-y-3 px-2">
                        {day.exercises.map((ex: any, j: number) => (
                          <div key={j} className="flex justify-between items-start pt-3 border-t border-slate-800/50">
                            <div>
                              <p className="text-sm font-bold text-white tracking-tight">{ex.name}</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 italic">{ex.notes}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-black text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">{ex.sets} × {ex.reps}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-black text-white uppercase italic tracking-tighter ml-2 flex items-center">
                  <Waves size={20} className="mr-2 text-blue-500" />
                  Nutritional Feed
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plan.dietPlan.map((meal: any, i: number) => (
                    <div key={i} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-3xl h-full shadow-lg">
                       <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 border-b border-blue-500/20 pb-1 inline-block">{meal.meal}</h4>
                       <p className="text-xs font-bold text-slate-200 leading-relaxed font-display tracking-wide">{meal.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
                <div className="flex items-center space-x-2 text-white mb-6">
                  <Lightbulb size={20} className="text-yellow-400" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest">Heuristic Insights</h3>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {plan.tips.map((tip: string, i: number) => (
                    <div key={i} className="flex space-x-4 items-start bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                      <span className="text-blue-500 font-black text-xs">MOD_0{i+1}</span>
                      <p className="text-xs text-slate-400 font-bold leading-relaxed tracking-tight">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
