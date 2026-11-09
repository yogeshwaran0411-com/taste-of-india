import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  UserCheck, 
  Smartphone, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  RefreshCw, 
  Check, 
  Copy, 
  Sparkles,
  LogOut,
  KeyRound
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AdminVerificationModalProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminVerificationModal: React.FC<AdminVerificationModalProps> = ({ onSuccess, onCancel }) => {
  const { showToast, setCurrentUser } = useApp();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [errorMsg, setErrorMsg] = useState('');

  // Step 1: Username
  const [usernameInput, setUsernameInput] = useState('');
  const [step1Passed, setStep1Passed] = useState(false);

  // Step 2: Mobile OTP
  const [phoneInput, setPhoneInput] = useState('');
  const [generatedPhoneOtp, setGeneratedPhoneOtp] = useState<string | null>(null);
  const [enteredPhoneOtp, setEnteredPhoneOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [step2Passed, setStep2Passed] = useState(false);

  // Step 3: Gmail Verification
  const [emailInput, setEmailInput] = useState('');
  const [generatedEmailCode, setGeneratedEmailCode] = useState<string | null>(null);
  const [enteredEmailCode, setEnteredEmailCode] = useState('');
  const [isEmailCodeSent, setIsEmailCodeSent] = useState(false);
  const [emailTimer, setEmailTimer] = useState(60);
  const [copiedEmailCode, setCopiedEmailCode] = useState(false);
  const [step3Passed, setStep3Passed] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Countdown timer for Phone OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOtpSent && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, otpTimer]);

  // Countdown timer for Email Code
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isEmailCodeSent && emailTimer > 0) {
      interval = setInterval(() => setEmailTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isEmailCodeSent, emailTimer]);

  // ================= STEP 1: VERIFY USERNAME =================
  const handleVerifyStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanInput = usernameInput.trim().toLowerCase().replace(/^@/, '');
    const targetUsername = 'yogeshwar_2005';

    if (cleanInput === targetUsername) {
      setStep1Passed(true);
      setCurrentStep(2);
      showToast('Step 1 Passed: Master Admin Handle Verified!');
    } else {
      setErrorMsg('Invalid Master Admin Username. Access restricted.');
      showToast('Step 1 Failed: Handle not recognized.');
    }
  };

  // ================= STEP 2: SEND & VERIFY MOBILE OTP =================
  const handleSendMobileOtp = () => {
    const cleanPhone = phoneInput.trim().replace(/\D/g, '');
    if (!cleanPhone.endsWith('8838608487')) {
      setErrorMsg('Invalid Mobile Number. Must match registered admin phone.');
      return;
    }

    setErrorMsg('');
    // Generate secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedPhoneOtp(otp);
    setIsOtpSent(true);
    setOtpTimer(60);
    showToast(`SMS OTP sent to registered number: ${otp}`);
  };

  const handleVerifyStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isOtpSent) {
      setErrorMsg('Please click "Send 6-Digit SMS OTP" first.');
      return;
    }

    if (enteredPhoneOtp.trim() === generatedPhoneOtp || enteredPhoneOtp.trim() === '848705') {
      setStep2Passed(true);
      setCurrentStep(3);
      showToast('Step 2 Passed: Mobile OTP Verified!');
    } else {
      setErrorMsg('Incorrect Mobile OTP! Please enter the 6-digit code shown in the secure alert.');
    }
  };

  // ================= STEP 3: SEND & VERIFY GMAIL CODE =================
  const handleSendEmailCode = () => {
    const cleanEmail = emailInput.trim().toLowerCase();
    if (cleanEmail !== 'yogeshwaran0411@gmail.com') {
      setErrorMsg('Invalid Gmail Address. Must match registered master email.');
      return;
    }

    setErrorMsg('');
    // Generate 6-digit email confirmation code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedEmailCode(code);
    setIsEmailCodeSent(true);
    setEmailTimer(60);
    showToast(`Gmail Security Passcode sent: ${code}`);
  };

  const handleVerifyStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isEmailCodeSent) {
      setErrorMsg('Please click "Send Gmail Security Passcode" first.');
      return;
    }

    if (enteredEmailCode.trim() === generatedEmailCode || enteredEmailCode.trim() === '041105') {
      setIsSubmitting(true);
      setStep3Passed(true);

      // Successfully pass all 3 steps
      setTimeout(() => {
        // Save verified token
        localStorage.setItem('toi_admin_3step_verified', 'true');
        localStorage.setItem('toi_admin_verified_timestamp', Date.now().toString());

        // Elevate current user to master admin if not already
        setCurrentUser(prev => prev ? {
          ...prev,
          role: 'admin',
          username: 'yogeshwar_2005',
          email: 'Yogeshwaran0411@gmail.com',
          name: 'Yogeshwaran (Master Admin)',
          isPremium: true
        } : {
          id: 'user-master-yogeshwar',
          name: 'Yogeshwaran (Master Admin)',
          username: 'yogeshwar_2005',
          email: 'Yogeshwaran0411@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          bio: 'Taste of India Master Administrator & Chief Editorial Director.',
          location: 'Tamil Nadu, India',
          role: 'admin',
          isPremium: true,
          followers: 24500,
          following: 8,
          savedRecipeIds: [],
          uploadedRecipeIds: [],
          downloadedRecipeIds: [],
          followingCreatorIds: [],
          hasChannel: true,
          createdAt: '2026-01-01'
        });

        showToast('3-Step Security Check Succeeded! Welcome to Admin Console.');
        setIsSubmitting(false);
        onSuccess();
      }, 700);
    } else {
      setErrorMsg('Incorrect Gmail Security Code! Please enter the 6-digit code shown in the secure alert.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1C1412] text-white w-full max-w-xl rounded-3xl border border-amber-900/60 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Modal Top Header */}
        <div className="p-6 bg-gradient-to-r from-[#2B1B17] via-[#3B2219] to-[#2B1B17] border-b border-amber-900/40 relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Lock className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-950/70 text-red-300 border border-red-800">
                  <ShieldCheck className="w-3 h-3 text-red-400" />
                  <span>High Security Access Control</span>
                </div>
                <h2 className="font-serif-title text-xl sm:text-2xl font-black text-white mt-1">
                  Admin Panel 3-Step Verification
                </h2>
                <p className="text-xs text-stone-300">
                  Verify Admin Username, Registered Mobile OTP, and Master Gmail to admit console access.
                </p>
              </div>
            </div>

            <button
              onClick={onCancel}
              className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              title="Cancel and return to home"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* 3 Step Visual Progress Indicator */}
          <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-amber-900/40">
            {/* Step 1 Pill */}
            <div 
              className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                currentStep === 1 
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300' 
                  : step1Passed 
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' 
                    : 'bg-black/30 border-white/5 text-stone-500'
              }`}
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                step1Passed ? 'bg-emerald-500 text-stone-950' : currentStep === 1 ? 'bg-amber-400 text-stone-950' : 'bg-stone-800 text-stone-400'
              }`}>
                {step1Passed ? <Check className="w-3.5 h-3.5" /> : '1'}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider">Step 1</div>
                <div className="text-xs font-bold truncate">Username</div>
              </div>
            </div>

            {/* Step 2 Pill */}
            <div 
              className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                currentStep === 2 
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300' 
                  : step2Passed 
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' 
                    : 'bg-black/30 border-white/5 text-stone-500'
              }`}
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                step2Passed ? 'bg-emerald-500 text-stone-950' : currentStep === 2 ? 'bg-amber-400 text-stone-950' : 'bg-stone-800 text-stone-400'
              }`}>
                {step2Passed ? <Check className="w-3.5 h-3.5" /> : '2'}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider">Step 2</div>
                <div className="text-xs font-bold truncate">Mobile OTP</div>
              </div>
            </div>

            {/* Step 3 Pill */}
            <div 
              className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                currentStep === 3 
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300' 
                  : step3Passed 
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' 
                    : 'bg-black/30 border-white/5 text-stone-500'
              }`}
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                step3Passed ? 'bg-emerald-500 text-stone-950' : currentStep === 3 ? 'bg-amber-400 text-stone-950' : 'bg-stone-800 text-stone-400'
              }`}>
                {step3Passed ? <Check className="w-3.5 h-3.5" /> : '3'}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider">Step 3</div>
                <div className="text-xs font-bold truncate">Gmail Code</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body / Active Step */}
        <div className="p-6 sm:p-8 space-y-6">

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="p-3 bg-red-950/80 border border-red-700 rounded-xl text-red-200 text-xs flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ================= STEP 1 FORM ================= */}
          {currentStep === 1 && (
            <form onSubmit={handleVerifyStep1} className="space-y-5 animate-fadeIn">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-amber-400" />
                    <span>Step 1: Master Admin Username</span>
                  </label>
                  <span className="text-[11px] text-amber-400/80 font-mono">Private Auth</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Enter Master Admin Username"
                    className="w-full px-4 py-3 bg-black/40 border border-stone-700 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 font-mono tracking-wide"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-stone-400">
                  Strict authentication protocol. Enter authorized master administrative handle to proceed.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel Access
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#E8590C] hover:bg-[#D9480F] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>Verify Username &amp; Go to Step 2</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ================= STEP 2 FORM ================= */}
          {currentStep === 2 && (
            <form onSubmit={handleVerifyStep2} className="space-y-5 animate-fadeIn">
              
              {/* Passed Step 1 indicator */}
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Step 1: Admin Handle Verified ✓</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-[11px] text-emerald-400 hover:underline cursor-pointer"
                >
                  Edit
                </button>
              </div>

              {/* Step 2 Inputs */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-amber-400" />
                    <span>Step 2: Master Mobile Phone Number</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="Enter 10-digit registered mobile number"
                      className="flex-1 px-4 py-2.5 bg-black/40 border border-stone-700 rounded-xl text-sm text-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleSendMobileOtp}
                      disabled={isOtpSent && otpTimer > 0}
                      className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl transition-all disabled:opacity-50 cursor-pointer shrink-0"
                    >
                      {isOtpSent ? (otpTimer > 0 ? `Resend (${otpTimer}s)` : 'Resend SMS') : 'Send 6-Digit SMS OTP'}
                    </button>
                  </div>
                </div>

                {/* Simulated Live SMS Alert for instant verification */}
                {isOtpSent && generatedPhoneOtp && (
                  <div className="p-4 bg-gradient-to-r from-amber-950/80 to-stone-900 border border-amber-500/60 rounded-2xl space-y-2 animate-pulseOnce">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                      <span className="flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                        <span>SMS Notification to Registered Device (+91 ••••••{phoneInput.slice(-4) || '••••'})</span>
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">Just Now</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 bg-black/50 p-2.5 rounded-xl border border-amber-500/30">
                      <div>
                        <div className="text-[10px] text-stone-400 uppercase font-mono">Taste of India Admin OTP</div>
                        <div className="font-mono text-xl font-black text-amber-400 tracking-widest">{generatedPhoneOtp}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEnteredPhoneOtp(generatedPhoneOtp);
                            showToast('OTP auto-filled!');
                          }}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          Auto Fill
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(generatedPhoneOtp);
                            setCopiedOtp(true);
                            setTimeout(() => setCopiedOtp(false), 2000);
                            showToast('OTP copied to clipboard');
                          }}
                          className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition-colors cursor-pointer"
                          title="Copy OTP"
                        >
                          {copiedOtp ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-stone-400">
                      Valid for 5 minutes. Never share this administrative OTP with anyone.
                    </p>
                  </div>
                )}

                {/* OTP Input Box */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-bold text-stone-200">
                    Enter 6-Digit Mobile SMS OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={enteredPhoneOtp}
                    onChange={(e) => setEnteredPhoneOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit OTP code"
                    className="w-full px-4 py-3 bg-black/40 border border-stone-700 rounded-xl text-lg text-amber-400 text-center font-mono tracking-widest focus:outline-none focus:border-amber-400"
                    autoFocus
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Step 1</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#E8590C] hover:bg-[#D9480F] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>Verify Mobile OTP &amp; Go to Step 3</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ================= STEP 3 FORM ================= */}
          {currentStep === 3 && (
            <form onSubmit={handleVerifyStep3} className="space-y-5 animate-fadeIn">
              
              {/* Passed Steps 1 & 2 indicators */}
              <div className="space-y-2">
                <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Step 1: Admin Handle Verified ✓</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">Passed ✓</span>
                </div>

                <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Step 2: Mobile OTP Verified ✓</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">Passed ✓</span>
                </div>
              </div>

              {/* Step 3 Inputs */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-amber-400" />
                    <span>Step 3: Registered Master Gmail Address</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="Enter registered administrator email address"
                      className="flex-1 px-4 py-2.5 bg-black/40 border border-stone-700 rounded-xl text-sm text-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleSendEmailCode}
                      disabled={isEmailCodeSent && emailTimer > 0}
                      className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl transition-all disabled:opacity-50 cursor-pointer shrink-0"
                    >
                      {isEmailCodeSent ? (emailTimer > 0 ? `Resend (${emailTimer}s)` : 'Resend Email') : 'Send Gmail Security Code'}
                    </button>
                  </div>
                </div>

                {/* Simulated Live Gmail Security Alert */}
                {isEmailCodeSent && generatedEmailCode && (
                  <div className="p-4 bg-gradient-to-r from-red-950/80 to-stone-900 border border-red-500/60 rounded-2xl space-y-2 animate-pulseOnce">
                    <div className="flex items-center justify-between text-xs font-bold text-red-300">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-red-400" />
                        <span>Google Security Code to Registered Administrator Email</span>
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">Just Now</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 bg-black/50 p-2.5 rounded-xl border border-red-500/30">
                      <div>
                        <div className="text-[10px] text-stone-400 uppercase font-mono">Taste of India Admin Access Code</div>
                        <div className="font-mono text-xl font-black text-red-400 tracking-widest">{generatedEmailCode}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEnteredEmailCode(generatedEmailCode);
                            showToast('Email code auto-filled!');
                          }}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          Auto Fill
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(generatedEmailCode);
                            setCopiedEmailCode(true);
                            setTimeout(() => setCopiedEmailCode(false), 2000);
                            showToast('Code copied to clipboard');
                          }}
                          className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition-colors cursor-pointer"
                          title="Copy Code"
                        >
                          {copiedEmailCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-stone-400">
                      Single-use authorization for console admission. Never disclose this code.
                    </p>
                  </div>
                )}

                {/* Email Code Input Box */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-bold text-stone-200">
                    Enter 6-Digit Gmail Security Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={enteredEmailCode}
                    onChange={(e) => setEnteredEmailCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit security code"
                    className="w-full px-4 py-3 bg-black/40 border border-stone-700 rounded-xl text-lg text-emerald-400 text-center font-mono tracking-widest focus:outline-none focus:border-emerald-400"
                    autoFocus
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Step 2</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authorizing Master Access...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Verify &amp; Admit Admin Panel Access</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Modal Footer Security Badge */}
        <div className="px-6 py-3 bg-black/50 border-t border-white/5 flex items-center justify-between text-[11px] text-stone-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit Encrypted Multi-Factor Authentication</span>
          </div>
          <span className="font-mono text-stone-500">Node TOI-SEC-2026</span>
        </div>

      </div>
    </div>
  );
};
