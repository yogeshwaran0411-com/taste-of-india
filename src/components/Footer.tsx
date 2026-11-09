import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INDIAN_STATES_AND_UTS } from '../data/states';
import { CookingPot, Mail, Heart, ShieldCheck, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, setSelectedState, setStaticPageId, showToast } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSubscribeNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    showToast('Subscribed to Taste of India weekly regional recipes!');
    setNewsletterEmail('');
  };

  const handleOpenPage = (page: string) => {
    setStaticPageId(page);
    setCurrentView('static-page');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#2B1B17] text-stone-300 pt-16 pb-12 border-t border-[#3B2219]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Footer: Brand & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-stone-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <button
              onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-left group cursor-pointer focus:outline-none"
              aria-label="Taste of Bharat Homepage"
            >
              <div className="bg-[#FAF6F0] p-2.5 sm:p-3 rounded-2xl shadow-sm hover:shadow-md transition-all inline-flex items-center border border-amber-900/20 group-hover:scale-[1.02]">
                <img
                  src="/assets/aistudio/file_00000000fb9482119cbfd58d08ef92d6_70233663.png"
                  alt="TASTE OF INDIA - Discover the Flavours of India"
                  className="h-14 sm:h-16 w-auto object-contain"
                />
              </div>
            </button>

            <p className="text-xs text-stone-400 leading-relaxed max-w-md">
              A community where cooks across India and worldwide discover traditional regional dishes, share family culinary legacies, and download professional recipe archives.
            </p>

            {/* Official Contact & Editorial Office */}
            <div className="bg-[#1F1310] p-3.5 rounded-xl border border-stone-800 text-xs text-stone-300 space-y-1.5 max-w-md">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-400">Contact Email:</span>
                <a href="mailto:tasteofindia.support@gmail.com" className="text-stone-200 hover:text-[#E8590C] hover:underline font-mono">
                  tasteofindia.support@gmail.com
                </a>
              </div>
              <div className="text-[11px] text-stone-400 leading-tight">
                <span className="font-bold text-amber-400/90">Editorial Office:</span> Eswaran Kovil Street Nedungundram Chennai - 600127
              </div>
            </div>

            <div className="text-xs text-amber-300 font-medium">
              Made with pure love for Bharatiya culinary heritage · All 28 States &amp; 8 UTs
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="lg:col-span-7 bg-[#341A0B] p-6 rounded-2xl border border-stone-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <Sparkles className="w-4 h-4" />
              <h3 className="font-serif-title text-base font-bold text-white">
                Subscribe to Bharat's Weekly Recipe Letter
              </h3>
            </div>
            <p className="text-xs text-stone-300">
              Receive a curated heritage recipe from a different Indian state every weekend with chef tips and printable guides.
            </p>
            <form onSubmit={handleSubscribeNewsletter} className="flex gap-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="grow text-xs p-3 bg-stone-900 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-[#E8590C]"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-[#E8590C] hover:bg-[#D9480F] text-white font-bold text-xs rounded-xl transition-colors shrink-0"
              >
                Subscribe Free
              </button>
            </form>
          </div>

        </div>

        {/* States & Union Territories Index */}
        <div className="space-y-4">
          <h4 className="font-serif-title text-sm font-bold text-white uppercase tracking-wider">
            Explore All 28 States & 8 Union Territories:
          </h4>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-stone-400">
            {INDIAN_STATES_AND_UTS.map(st => (
              <button
                key={st.id}
                onClick={() => {
                  setSelectedState(st);
                  setCurrentView('state-detail');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-amber-400 transition-colors"
              >
                {st.name} ·
              </button>
            ))}
          </div>
        </div>

        {/* Institutional & Legal Links */}
        <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button onClick={() => handleOpenPage('about')} className="hover:text-stone-300">About Us</button>
            <span>·</span>
            <button onClick={() => handleOpenPage('contact')} className="hover:text-stone-300">Contact Us</button>
            <span>·</span>
            <button onClick={() => handleOpenPage('faq')} className="hover:text-stone-300">FAQ</button>
            <span>·</span>
            <button onClick={() => handleOpenPage('privacy')} className="hover:text-stone-300">Privacy Policy</button>
            <span>·</span>
            <button onClick={() => handleOpenPage('terms')} className="hover:text-stone-300">Terms & Conditions</button>
            <span>·</span>
            <button onClick={() => handleOpenPage('refund')} className="hover:text-stone-300">Refund Policy</button>
            <span>·</span>
            <button 
              onClick={() => { setCurrentView('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className="text-amber-400 font-bold hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>

          <div>
            © {new Date().getFullYear()} TASTE OF INDIA. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
};
