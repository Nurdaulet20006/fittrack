import { useState, ChangeEvent, useEffect } from 'react';
import { UserProfile } from '../types';
import { Settings, Save, User as UserIcon, Calendar, Ruler, Weight, Target, History } from 'lucide-react';

interface ProfileProps {
  profile: UserProfile | null;
  setProfile: (p: UserProfile) => void;
}

export default function Profile({ profile, setProfile }: ProfileProps) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>(profile || {
    displayName: 'Anonymous User',
    age: 25,
    height: 175,
    weight: 70,
    goal: 'maintain'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedProfile = { ...formData, uid: 'guest' } as UserProfile;
      localStorage.setItem('guest_profile', JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'age' || name === 'height' || name === 'weight' ? Number(value) : value }));
  };

  const displayProfile = profile || (formData as UserProfile);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-600 rounded-[2rem] flex items-center justify-center font-black text-2xl text-white shadow-xl italic shadow-blue-600/20">
            {displayProfile.displayName?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">{displayProfile.displayName || 'Guest Profile'}</h1>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest italic">Local Storage Mode • No Account Required</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setEditing(!editing)}
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border border-slate-800 hover:border-blue-500/50 transition-all shadow-xl"
          >
            {editing ? 'Cancel' : 'Configure Bio'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Settings size={120} className="animate-spin-slow text-blue-500" />
            </div>
            
            <h2 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em] mb-8 flex items-center">
              <UserIcon size={14} className="mr-2" />
              Biometric Profile
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { label: 'Display Name', name: 'displayName', icon: UserIcon, isText: true },
                { label: 'Age', name: 'age', icon: Calendar, unit: 'years' },
                { label: 'Height', name: 'height', icon: Ruler, unit: 'cm' },
                { label: 'Weight', name: 'weight', icon: Weight, unit: 'kg' },
                { label: 'Goal', name: 'goal', icon: Target, isSelect: true, options: ['Lose Fat', 'Gain Muscle', 'Maintain'] },
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">{field.label}</label>
                  <div className="relative group">
                    <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={16} />
                    {editing ? (
                      field.isSelect ? (
                        <select
                          name={field.name}
                          value={(formData as any)[field.name]}
                          onChange={handleInputChange}
                          className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-white font-bold text-sm focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                        >
                          <option value="">Select Goal</option>
                          {field.options?.map(o => <option key={o} value={o.toLowerCase().replace(' ', '_')}>{o}</option>)}
                        </select>
                      ) : (
                        <input
                          type={field.isText ? "text" : "number"}
                          name={field.name}
                          value={(formData as any)[field.name]}
                          onChange={handleInputChange}
                          className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-white font-bold text-sm focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                          placeholder={`Enter ${field.label}`}
                        />
                      )
                    ) : (
                      <div className="w-full bg-slate-950/30 border border-slate-800/50 rounded-2xl py-3 pl-12 pr-4 text-white font-bold text-sm italic">
                        { (displayProfile as any)[field.name] || 'Not set' } {field.unit && (displayProfile as any)[field.name] && <span className="text-[10px] text-slate-500 lowercase ml-1">{field.unit}</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {editing && (
              <button 
                onClick={handleSave}
                disabled={saving}
                className="mt-12 w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center space-x-2 shadow-xl shadow-blue-600/20 active:scale-95 transition-all text-sm"
              >
                {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Save size={18} /><span>Synchronize Local Storage</span></>}
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
             <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center italic">
               <History size={14} className="mr-2 text-blue-500" />
               Interface Integrity
             </h3>
             <div className="space-y-3">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Your biometric data and session history are now persistent within your local browser environment.</p>
             </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
