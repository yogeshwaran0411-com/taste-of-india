import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ExternalLink } from 'lucide-react';

export const SponsoredPartnerAd: React.FC = () => {
  const { currentUser, setIsPremiumModalOpen } = useApp();

  // Premium subscribers get a 100% ad-free experience!
  if (currentUser?.isPremium) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-[#F6EFE6] border border-[#E8DFC8] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop&q=80"
            alt="Handcrafted Indian Cookware"
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-xl object-cover ring-1 ring-stone-200 shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 bg-stone-200/60 px-2 py-0.5 rounded">
                Sponsored Partner
              </span>
              <span className="text-xs font-semibold text-[#E8590C]">
                Bharatiya Handcrafted Cast Iron & Clay Cookware
              </span>
            </div>
            <p className="text-xs text-stone-600 line-clamp-1">
              Cook authentic curries with traditional heavy pre-seasoned iron kadhais and earthen pots. Retain maximum micro-nutrients.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
          <button
            onClick={() => setIsPremiumModalOpen(true)}
            className="text-[11px] text-stone-500 hover:text-[#E8590C] underline font-medium"
          >
            Remove ads with Premium
          </button>
          <a
            href="#partner"
            onClick={(e) => { e.preventDefault(); alert('Redirecting to verified partner store'); }}
            className="px-3.5 py-1.5 bg-[#2B1B17] text-white hover:bg-stone-800 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
          >
            <span>Explore Cookware</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
