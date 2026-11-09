import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  ShieldCheck, 
  Check, 
  Eye, 
  EyeOff, 
  Sparkles, 
  KeyRound, 
  ArrowRight,
  ChefHat,
  Crown,
  Fingerprint
} from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { login, register, showToast } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Form fields
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      if (!email.trim() || !password.trim()) {
        showToast('Please enter both email and password.');
        return;
      }
      login(email.trim());
      onClose();
    } else {
      if (!name.trim() || !email.trim() || !password.trim()) {
        showToast('Please enter name, email and password.');
        return;
      }
      if (password !== confirmPassword) {
        showToast('Passwords do not match.');
        return;
      }
      register(name.trim(), email.trim());
      onClose();
    }
  };

  const handleDemoLogin = (userType: 'member' | 'creator' | 'admin') => {
    if (userType === 'creator') {
      login('chettinad_heritage@example.com', 'user');
    } else if (userType === 'admin') {
      login('admin@tasteofindia.com', 'admin');
    } else {
      login('priya.sharma@example.com', 'user');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-black/70 backdrop-blur-sm flex justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto flex flex-col transition-all">
        
        {/* Executive Header */}
        <div className="p-6 bg-gradient-to-br from-[#1C1614] via-[#2B1B17] to-[#1C1614] text-white relative overflow-hidden">
          {/* Subtle gold glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#E8590C]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div className="bg-[#FAF6F0] px-3.5 py-1.5 rounded-xl shadow-xs inline-flex items-center">
              <img
                src="/assets/aistudio/file_00000000fb9482119cbfd58d08ef92d6_70233663.png"
                alt="TASTE OF INDIA"
                className="h-9 w-auto object-contain"
              />
            </div>
            
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 relative z-10">
            <h3 className="font-serif-title text-2xl font-black text-white">
              {mode === 'login' ? 'Culinary Member Access' : 'Create Your Foodie Account'}
            </h3>
            <p className="text-xs text-stone-300 mt-1">
              {mode === 'login' 
                ? 'Sign in to access your running subscriptions, bookmarks, and culinary badges'
                : 'Join millions preserving authentic Indian heritage recipes and culinary traditions'}
            </p>
          </div>

          {/* Segmented Mode Switcher */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-white/10 rounded-xl mt-5 relative z-10 border border-white/10">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#2B1B17] shadow-sm font-black'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-[#2B1B17] shadow-sm font-black'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Modal Form Body */}
        <div className="p-6 space-y-4">
          
          {/* Active Plan Protection Guarantee Banner */}
          <div className="bg-emerald-50/90 border border-emerald-300 p-3 rounded-2xl flex items-center gap-3 text-xs text-emerald-950 shadow-2xs">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
              ✓
            </div>
            <div className="leading-tight">
              <strong className="block text-emerald-900 font-bold">Active Subscription Protection:</strong>
              <span className="text-[11px] text-emerald-800">
                Subscriptions remain active and running across logouts and return sign-ins.
              </span>
            </div>
          </div>

          {/* Quick Demo Switcher with Badge Info */}
          <div className="bg-[#FAF6F0] p-3.5 rounded-2xl border border-[#E8DFC8] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-stone-600 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#E8590C]" />
                <span>Instant Verified Sign In:</span>
              </span>
              <span className="text-[10px] text-emerald-700 font-bold">Pass Active</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleDemoLogin('member')}
                className="p-2 bg-white border border-stone-200 hover:border-[#E8590C] rounded-xl font-bold text-stone-800 hover:text-[#E8590C] transition-all cursor-pointer text-left shadow-2xs hover:shadow-xs group"
              >
                <div className="text-[11px] font-black group-hover:text-[#E8590C]">Priya S.</div>
                <div className="text-[9px] text-emerald-700 font-bold flex items-center gap-0.5">
                  <Crown className="w-2.5 h-2.5 text-amber-500" />
                  <span>Quarterly</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('creator')}
                className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-all cursor-pointer text-left shadow-2xs hover:shadow-xs group"
              >
                <div className="text-[11px] font-black">Meenakshi</div>
                <div className="text-[9px] text-amber-100 font-semibold flex items-center gap-0.5">
                  <ChefHat className="w-2.5 h-2.5" />
                  <span>Creator Studio</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="p-2 bg-[#2B1B17] hover:bg-black text-white rounded-xl font-bold transition-all cursor-pointer text-left shadow-2xs hover:shadow-xs group"
              >
                <div className="text-[11px] font-black">Vikramaditya</div>
                <div className="text-[9px] text-stone-300 font-semibold flex items-center gap-0.5">
                  <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                  <span>Curator Admin</span>
                </div>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-stone-700 mb-1 font-bold">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Ananya Mukherjee"
                      className="w-full pl-9 p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#E8590C] font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 mb-1 font-bold">Username Handle (@)</label>
                  <div className="relative">
                    <span className="text-stone-400 font-bold absolute left-3.5 top-2.5 text-xs">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
                      placeholder="e.g. ananya_cooks"
                      className="w-full pl-8 p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#E8590C] font-mono font-medium"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-stone-700 mb-1 font-bold">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#E8590C] font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-stone-700 font-bold">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => showToast('Demo accounts require any password to sign in.')}
                    className="text-[10px] text-[#E8590C] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#E8590C] font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-stone-400 hover:text-stone-700 absolute right-2.5 top-2.5 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-stone-700 mb-1 font-bold">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#E8590C] font-medium"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 mt-1 bg-[#E8590C] hover:bg-[#D9480F] active:scale-95 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{mode === 'login' ? 'Sign In to TASTE OF INDIA' : 'Create Member Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Security footnote */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-center gap-2 text-[11px] text-stone-500">
            <Fingerprint className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit Encrypted Session · Instant Subscription Recovery</span>
          </div>

        </div>

      </div>
    </div>
  );
};
