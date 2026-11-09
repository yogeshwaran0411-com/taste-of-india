import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUBSCRIPTION_PLANS } from '../data/subscriptions';
import { SubscriptionPlanId } from '../types';
import { 
  Lock, 
  Mail, 
  User, 
  Crown, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard, 
  Eye, 
  EyeOff, 
  LogOut
} from 'lucide-react';

interface OnboardingFlowGateProps {
  onPlanSelected: (planId: SubscriptionPlanId) => void;
}

export const OnboardingFlowGate: React.FC<OnboardingFlowGateProps> = ({ onPlanSelected }) => {
  const { 
    currentUser, 
    login, 
    register, 
    logout, 
    showToast,
    setSelectedPaymentPlan,
    setIsPaymentModalOpen
  } = useApp();

  // Auth Mode: Login or Sign Up (Register)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Form State
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Check if current user has an active, running subscription
  const isSubscribed = currentUser?.role === 'admin' || (
    currentUser?.isPremium && 
    currentUser?.premiumExpiry && 
    new Date(currentUser.premiumExpiry).getTime() > Date.now()
  );

  // Determine current active onboarding step
  // Step 1: Login or Sign In (!currentUser)
  // Step 2: Subscription (currentUser && !isSubscribed)
  // Step 3: All View (currentUser && isSubscribed)
  const currentStep = !currentUser ? 1 : !isSubscribed ? 2 : 3;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'login') {
      if (!email.trim() || !password.trim()) {
        showToast('Please enter your email and password.');
        return;
      }
      login(email.trim());
    } else {
      if (!name.trim() || !email.trim() || !password.trim()) {
        showToast('Please complete all fields to create your account.');
        return;
      }
      if (password !== confirmPassword) {
        showToast('Passwords do not match.');
        return;
      }
      register(name.trim(), email.trim());
    }
  };

  const handleSelectSubscriptionPlan = (planId: SubscriptionPlanId) => {
    setSelectedPaymentPlan(planId);
    onPlanSelected(planId);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-between text-[#2B1B17]">
      
      {/* Top Global Header Bar */}
      <header className="border-b border-[#E8DFC8] bg-white/90 backdrop-blur-md py-3.5 px-4 sm:px-8 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#FAF6F0] px-3 py-1.5 rounded-xl border border-[#E8DFC8] shadow-2xs">
              <img
                src="/assets/aistudio/file_00000000fb9482119cbfd58d08ef92d6_70233663.png"
                alt="TASTE OF INDIA"
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </div>
            <div>
              <span className="font-serif-title font-black text-sm sm:text-base text-[#2B1B17] tracking-tight block">
                TASTE OF INDIA
              </span>
              <span className="text-[10px] text-stone-500 font-medium hidden sm:block">
                Preserving Authentic Regional Culinary Heritage
              </span>
            </div>
          </div>

          {/* User Status / Logout if logged in on Step 2 */}
          {currentUser && (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-stone-900">{currentUser.name}</div>
                <div className="text-[10px] text-stone-500 font-mono">@{currentUser.username}</div>
              </div>
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#E8590C]/30"
              />
              <button
                type="button"
                onClick={logout}
                className="p-2 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
                title="Sign out and return to Step 1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main 3-Step Guided Container */}
      <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12 w-full space-y-8 grow">
        
        {/* 3-Step Progress Indicator Strip */}
        <div className="bg-white rounded-2xl border border-stone-200 p-3 sm:p-4 shadow-xs">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
            
            {/* Step 1 Indicator */}
            <div className={`p-2.5 sm:p-3 rounded-xl transition-all ${
              currentStep === 1 
                ? 'bg-gradient-to-r from-[#2B1B17] to-[#3B2219] text-white shadow-sm ring-2 ring-[#E8590C]' 
                : currentStep > 1 
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' 
                : 'bg-stone-50 text-stone-400'
            }`}>
              <div className="flex items-center justify-center gap-1.5 text-xs font-black">
                {currentStep > 1 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-[#E8590C] text-white text-[10px] flex items-center justify-center font-bold">1</span>
                )}
                <span className="hidden sm:inline">Step 1:</span>
                <span>Login or Sign In</span>
              </div>
              <div className={`text-[10px] mt-0.5 truncate ${currentStep === 1 ? 'text-amber-300 font-medium' : 'text-stone-500'}`}>
                {currentStep > 1 ? `Signed In (${currentUser?.email?.split('@')[0]})` : 'Sign in / Create Account'}
              </div>
            </div>

            {/* Step 2 Indicator */}
            <div className={`p-2.5 sm:p-3 rounded-xl transition-all ${
              currentStep === 2 
                ? 'bg-gradient-to-r from-emerald-800 to-teal-900 text-white shadow-sm ring-2 ring-emerald-400' 
                : currentStep > 2 
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' 
                : 'bg-stone-50 text-stone-400 border border-stone-200'
            }`}>
              <div className="flex items-center justify-center gap-1.5 text-xs font-black">
                {currentStep > 2 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                    currentStep === 2 ? 'bg-emerald-500 text-white' : 'bg-stone-300 text-stone-600'
                  }`}>2</span>
                )}
                <span className="hidden sm:inline">Step 2:</span>
                <span>Subscription</span>
              </div>
              <div className={`text-[10px] mt-0.5 truncate ${currentStep === 2 ? 'text-emerald-200 font-medium' : 'text-stone-500'}`}>
                {currentStep > 2 ? 'Subscription Verified (✓)' : 'Choose Pass & Pay UPI'}
              </div>
            </div>

            {/* Step 3 Indicator */}
            <div className={`p-2.5 sm:p-3 rounded-xl transition-all ${
              currentStep === 3 
                ? 'bg-gradient-to-r from-amber-600 to-[#E8590C] text-white shadow-sm' 
                : 'bg-stone-50 text-stone-400 border border-stone-200'
            }`}>
              <div className="flex items-center justify-center gap-1.5 text-xs font-black">
                <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                  currentStep === 3 ? 'bg-white text-[#E8590C]' : 'bg-stone-300 text-stone-600'
                }`}>3</span>
                <span className="hidden sm:inline">Step 3:</span>
                <span>All View</span>
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5 truncate">
                {currentStep === 3 ? 'Platform Unlocked!' : 'Complete Steps 1 & 2'}
              </div>
            </div>

          </div>
        </div>

        {/* ============================================================== */}
        {/* STEP 1: WEBSITE FIRST OPEN LOGIN OR SIGN IN SCREEN             */}
        {/* ============================================================== */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden max-w-xl mx-auto animate-fadeIn">
            
            {/* Header Banner */}
            <div className="p-6 sm:p-8 bg-gradient-to-br from-[#1C1614] via-[#2B1B17] to-[#1C1614] text-white relative">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8590C]/20 border border-[#E8590C]/40 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#E8590C]" />
                <span>Step 1 of 3: Identity Verification</span>
              </div>
              <h2 className="font-serif-title text-2xl sm:text-3xl font-black text-white">
                {authMode === 'login' ? 'Sign In to Taste of India' : 'Create Your Culinary Account'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed">
                {authMode === 'login'
                  ? 'Sign in to access your running subscriptions, bookmarks, and culinary badges.'
                  : 'Join millions discovering authentic regional Indian heirloom recipes and kitchen traditions.'}
              </p>

              {/* Segmented Mode Switcher */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-white/10 rounded-xl mt-5 border border-white/10">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-white text-[#2B1B17] font-black shadow-xs'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-white text-[#2B1B17] font-black shadow-xs'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="p-6 sm:p-8 space-y-4 text-xs">
              
              {authMode === 'register' && (
                <div className="space-y-1">
                  <label className="block font-bold text-stone-700">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Priya Sharma or Arun Kumar"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-stone-50 text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="block font-bold text-stone-700">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-stone-50 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-stone-700">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-stone-50 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authMode === 'register' && (
                <div className="space-y-1">
                  <label className="block font-bold text-stone-700">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-stone-50 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-[#E8590C] hover:bg-[#D9480F] active:scale-98 text-white font-black text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{authMode === 'login' ? 'Sign In & Proceed to Step 2 →' : 'Create Account & Proceed to Step 2 →'}</span>
              </button>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 2: NEXT SUBSCRIPTION SELECTION & COMPULSORY UTR FLOW      */}
        {/* ============================================================== */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Header Greeting & Instruction */}
            <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl border border-emerald-500/40 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider border border-emerald-400/30">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>Step 2 of 3: Next Subscription Pass</span>
                  </div>
                  <h2 className="font-serif-title text-2xl sm:text-3xl font-black text-white">
                    Welcome, {currentUser?.name}!
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl leading-relaxed">
                    You have successfully completed <strong>Step 1 (Sign In)</strong>. To unlock <strong>Step 3 (All View)</strong> across Taste of India, choose your subscription pass tier below.
                  </p>
                </div>

                <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15 text-xs text-left shrink-0 max-w-xs space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Secure UPI &amp; Bank UTR Guarantee</span>
                  </div>
                  <p className="text-[11px] text-emerald-200 leading-normal">
                    Pay securely via UPI QR or UPI apps. Enter your <strong>compulsory 12-digit UPI UTR</strong> to receive the verified <strong>Green Tick (✓)</strong> and unlock all views.
                  </p>
                </div>
              </div>
            </div>

            {/* 4 Subscription Plans Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {SUBSCRIPTION_PLANS.map((plan) => {
                const isQuarterly = plan.id === 'quarterly';
                const isYearly = plan.id === 'yearly';

                return (
                  <div 
                    key={plan.id}
                    className={`bg-white rounded-3xl border-2 p-5 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all relative overflow-hidden ${
                      isQuarterly 
                        ? 'border-[#E8590C] ring-2 ring-[#E8590C]/20' 
                        : isYearly 
                        ? 'border-purple-400 ring-2 ring-purple-100' 
                        : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {/* Badge */}
                    {(plan.badge || isQuarterly || isYearly) && (
                      <div className="absolute top-0 right-0">
                        <span className={`inline-block px-3 py-1 rounded-bl-xl text-[10px] font-black uppercase tracking-wider text-white shadow-2xs ${
                          isQuarterly ? 'bg-[#E8590C]' : isYearly ? 'bg-purple-600' : 'bg-stone-700'
                        }`}>
                          {plan.badge || (isQuarterly ? 'Most Popular' : 'Best Value')}
                        </span>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                          Pass Tier
                        </span>
                        <h3 className="font-serif-title text-xl font-black text-[#2B1B17]">
                          {plan.name}
                        </h3>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {plan.durationText} Full Access
                        </p>
                      </div>

                      <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl sm:text-3xl font-black text-stone-900">₹{plan.price}</span>
                          <span className="text-xs text-stone-500">/{plan.durationText}</span>
                        </div>
                        <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                          ✓ Direct UPI · No Hidden Charges
                        </div>
                      </div>

                      {/* Benefits */}
                      <ul className="space-y-2 text-xs text-stone-600">
                        <li className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>All Regional State Recipes &amp; Secret Masalas</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>HD Video Masterclasses &amp; Cooking Guides</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Full People's Recipes, Catering &amp; Tiffins</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Download Recipe PDFs with Photos &amp; Logo</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-5 mt-4 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() => handleSelectSubscriptionPlan(plan.id)}
                        className={`w-full py-3 px-4 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                          isQuarterly
                            ? 'bg-[#E8590C] hover:bg-[#D9480F] text-white'
                            : isYearly
                            ? 'bg-purple-600 hover:bg-purple-700 text-white'
                            : 'bg-[#2B1B17] hover:bg-stone-800 text-white'
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Select &amp; Pay via UPI</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Verification Guarantee & Note */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 text-xs text-stone-600 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>
                  <strong>Compulsory UTR Policy:</strong> After making the UPI payment, enter your 12-digit UPI UTR to trigger the official Green Tick (✓) and unlock Step 3 (All View).
                </span>
              </div>
              <button
                type="button"
                onClick={logout}
                className="text-xs text-stone-500 hover:text-stone-800 underline font-semibold cursor-pointer shrink-0"
              >
                Switch Account / Sign Out
              </button>
            </div>

          </div>
        )}

      </main>

      {/* Global Footer in Gate */}
      <footer className="border-t border-[#E8DFC8] bg-white py-4 px-4 text-center text-xs text-stone-500">
        Taste of India Culinary Platform · First Open Login/Sign In → Subscription → All View
      </footer>

    </div>
  );
};
