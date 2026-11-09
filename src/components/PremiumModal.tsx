import React from 'react';
import { useApp } from '../context/AppContext';
import { SUBSCRIPTION_PLANS } from '../data/subscriptions';
import { SubscriptionPlanId } from '../types';
import { Crown, Check, X, Sparkles, Download, BookOpen, ShieldCheck, Zap } from 'lucide-react';

interface PremiumModalProps {
  onClose: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ onClose }) => {
  const { setSelectedPaymentPlan, setIsPaymentModalOpen, currentUser, setIsAuthModalOpen, openInvoiceModal } = useApp();

  const handleSelectPlan = (planId: SubscriptionPlanId) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedPaymentPlan(planId);
    setIsPaymentModalOpen(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#FAF6F0] w-full max-w-4xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto flex flex-col max-h-[94vh]">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#2B1B17] via-[#3B2219] to-[#2B1B17] text-white p-6 sm:p-8 text-center shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="bg-[#FAF6F0] px-4 py-2 rounded-2xl shadow-xs inline-flex items-center mb-3">
            <img
              src="/assets/aistudio/file_00000000fb9482119cbfd58d08ef92d6_70233663.png"
              alt="TASTE OF INDIA"
              className="h-12 sm:h-14 w-auto object-contain"
            />
          </div>

          <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>PREMIUM MEMBERSHIP PASS</span>
          </div>

          <h2 className="font-serif-title text-2xl sm:text-3xl font-extrabold tracking-tight">
            Unlock the Complete Taste of India!
          </h2>

          <p className="text-stone-300 text-xs sm:text-sm max-w-xl mx-auto mt-2 leading-relaxed">
            Become a TASTE OF INDIA Premium member and download your favourite recipes, exclusive cooking guides, and master state collections.
          </p>

          <div className="mt-3 text-[11px] text-amber-400 font-semibold tracking-wide uppercase">
            Plans starting at just ₹49/month · Instant Access · Cancel Anytime
          </div>
        </div>

        {/* Active Subscription Running Guarantee Banner */}
        {currentUser?.isPremium && (
          <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 p-4 px-6 text-white border-b border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-xs shrink-0">
                ✓
              </div>
              <div>
                <div className="text-[11px] font-black uppercase text-emerald-400 tracking-wider">
                  Active Subscription Running Smoothly
                </div>
                <div className="text-xs sm:text-sm font-bold text-white">
                  You currently have an active {SUBSCRIPTION_PLANS.find(p => p.id === currentUser.plan)?.name || 'Heritage Explorer'} Pass
                </div>
                <div className="text-[11px] text-emerald-200">
                  Valid until {currentUser.premiumExpiry ? new Date(currentUser.premiumExpiry).toLocaleDateString('en-IN') : 'Active'} · Preserved across all logouts &amp; logins
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <button
                onClick={() => {
                  onClose();
                  openInvoiceModal({
                    customerName: currentUser.name,
                    customerEmail: currentUser.email,
                    planName: SUBSCRIPTION_PLANS.find(p => p.id === currentUser.plan)?.name || 'Heritage Pass',
                    amount: SUBSCRIPTION_PLANS.find(p => p.id === currentUser.plan)?.price || 49,
                    validUntil: currentUser.premiumExpiry ? new Date(currentUser.premiumExpiry).toLocaleDateString('en-IN') : undefined,
                    status: 'PAID'
                  });
                }}
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                View Payment Receipt
              </button>
              <button
                onClick={onClose}
                className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                Keep Current Plan
              </button>
            </div>
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const isPopular = plan.popular;
              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-xl p-5 border flex flex-col justify-between transition-all relative ${
                    isPopular
                      ? 'border-[#E8590C] shadow-md ring-1 ring-[#E8590C]/30'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E8590C] text-white text-[10px] font-bold uppercase tracking-wider py-0.5 px-2.5 rounded-full shadow-xs">
                      {plan.badge}
                    </div>
                  )}

                  <div>
                    <h3 className="font-serif-title font-bold text-base text-[#2B1B17]">
                      {plan.name}
                    </h3>
                    <div className="text-xs text-stone-500">{plan.durationText}</div>

                    <div className="mt-4 mb-3">
                      <span className="font-serif-title text-3xl font-black text-[#2B1B17] tabular-nums">
                        ₹{plan.price}
                      </span>
                      <span className="text-xs text-stone-500"> / {plan.durationText}</span>
                    </div>

                    {plan.savings ? (
                      <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm inline-block mb-4">
                        {plan.savings}
                      </div>
                    ) : (
                      <div className="text-[11px] text-stone-400 mb-4">Standard renewal</div>
                    )}

                    {/* Features list */}
                    <ul className="space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-3">
                      {plan.features.slice(0, 4).map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#2B8A3E] shrink-0 mt-0.5" />
                          <span className="leading-tight">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`mt-6 w-full py-2.5 px-3 rounded-lg text-xs font-bold transition-all shadow-xs active:scale-95 ${
                      isPopular
                        ? 'bg-[#E8590C] text-white hover:bg-[#D9480F]'
                        : 'bg-[#2B1B17] text-white hover:bg-stone-800'
                    }`}
                  >
                    Subscribe Now
                  </button>
                </div>
              );
            })}
          </div>

          {/* Premium Highlights */}
          <div className="mt-8 pt-6 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-600">
            <div className="flex items-center gap-2.5 p-3 bg-white rounded-lg border border-stone-200">
              <Download className="w-4 h-4 text-[#E8590C] shrink-0" />
              <span>Unlimited offline recipe PDFs with professional layout</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 bg-white rounded-lg border border-stone-200">
              <Zap className="w-4 h-4 text-amber-500 shrink-0" />
              <span>100% Ad-Free experience across the entire website</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 bg-white rounded-lg border border-stone-200">
              <BookOpen className="w-4 h-4 text-[#2B8A3E] shrink-0" />
              <span>Complete regional heritage recipe books & festival collections</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
