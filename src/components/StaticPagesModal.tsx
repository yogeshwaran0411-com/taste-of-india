import React from 'react';
import { useApp } from '../context/AppContext';
import { X, BookOpen, Mail, HelpCircle, Shield, FileText, CheckCircle2 } from 'lucide-react';

interface StaticPagesModalProps {
  pageId: string;
  onClose: () => void;
}

export const StaticPagesModal: React.FC<StaticPagesModalProps> = ({ pageId, onClose }) => {
  const renderContent = () => {
    switch (pageId) {
      case 'about':
        return (
          <div className="space-y-4">
            <div className="bg-[#FAF6F0] p-3 rounded-2xl border border-amber-200/80 inline-flex items-center">
              <img
                src="/assets/aistudio/file_00000000fb9482119cbfd58d08ef92d6_70233663.png"
                alt="TASTE OF INDIA - Discover the Flavours of India"
                className="h-14 sm:h-16 w-auto object-contain"
              />
            </div>
            <h2 className="font-serif-title text-2xl font-black text-[#2B1B17]">About TASTE OF INDIA</h2>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              <strong>TASTE OF INDIA</strong> was born from a singular culinary reverence: India does not have one cuisine, but thousands of micro-regional gastronomic legacies. Across all 28 states and 8 union territories, every village, river basin, and mountain hearth possesses distinct heirloom recipes, ground spices, and seasonal cooking traditions.
            </p>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              Our mission is to digitally preserve and celebrate these authentic methods, empower home chefs and traditional cooks, and provide clean, ad-free downloadable recipe archives for food lovers across India and around the globe.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
                <div className="font-bold text-amber-900 text-sm">36 Territories</div>
                <div className="text-[11px] text-stone-600">All 28 States & 8 UTs</div>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
                <div className="font-bold text-amber-900 text-sm">100% Authentic</div>
                <div className="text-[11px] text-stone-600">Strictly verified recipes</div>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
                <div className="font-bold text-amber-900 text-sm">Global Access</div>
                <div className="text-[11px] text-stone-600">6 Indian languages</div>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-4">
            <h2 className="font-serif-title text-2xl font-black text-[#2B1B17]">Contact Us</h2>
            <p className="text-xs text-stone-600">
              Have a culinary query, traditional recipe to contribute, or subscription inquiry? Our team in New Delhi and Chennai is happy to help.
            </p>
            <div className="space-y-2 text-xs text-stone-700 bg-stone-50 p-4 rounded-xl border border-stone-200">
              <div><strong>Email:</strong> <a href="mailto:tasteofindia.support@gmail.com" className="text-[#E8590C] hover:underline font-semibold">tasteofindia.support@gmail.com</a></div>
              <div><strong>Editorial Office:</strong> Eswaran Kovil Street Nedungundram Chennai - 600127</div>
            </div>
            <form onSubmit={e => { e.preventDefault(); alert('Message dispatched! We will reply within 24 hours.'); onClose(); }} className="space-y-3 pt-3 border-t border-stone-200 text-xs">
              <div>
                <label className="block text-stone-600 mb-1 font-semibold">Your Message</label>
                <textarea rows={3} required placeholder="How can we assist you today?" className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl" />
              </div>
              <button type="submit" className="px-5 py-2 bg-[#E8590C] text-white font-bold rounded-lg hover:bg-[#D9480F]">
                Send Message
              </button>
            </form>
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-4">
            <h2 className="font-serif-title text-2xl font-black text-[#2B1B17]">Frequently Asked Questions</h2>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div className="font-bold text-stone-900 mb-1">What is TASTE OF INDIA Premium?</div>
                <p className="text-stone-600">TASTE OF INDIA Premium unlocks unlimited high-definition recipe PDF downloads, ad-free browsing, exclusive 28-state heritage e-books, and priority support starting at ₹49/month.</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div className="font-bold text-stone-900 mb-1">How does the recipe moderation process work?</div>
                <p className="text-stone-600">Every community recipe submitted via "Share Your Recipe" undergoes review by our culinary panel to prevent duplicates, verify cooking times, and ensure authenticity before going live.</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div className="font-bold text-stone-900 mb-1">What payment methods are supported?</div>
                <p className="text-stone-600">We support all major Indian payment channels: UPI (Google Pay, PhonePe, Paytm, BHIM), Debit & Credit cards (Visa, MasterCard, RuPay), and Netbanking across all Indian banks.</p>
              </div>
            </div>
          </div>
        );

      case 'terms':
        return (
          <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
            <h2 className="font-serif-title text-2xl font-black text-[#2B1B17]">Terms & Conditions</h2>
            <p>1. By accessing TASTE OF INDIA, you agree to comply with our community guidelines, intellectual property policies, and terms of service.</p>
            <p>2. Users submitting recipes warrant that they hold the right to share the culinary instructions and photography provided.</p>
            <p>3. Premium subscriptions are billed in Indian Rupees (INR) for the specified cycle (1, 3, 6, or 12 months) and entitle the subscriber to personal PDF downloads.</p>
          </div>
        );

      case 'refund':
        return (
          <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
            <h2 className="font-serif-title text-2xl font-black text-[#2B1B17]">Refund & Cancellation Policy</h2>
            <p>We pride ourselves on offering India's premier culinary recipe experience. If you experience technical defects preventing access to your premium membership or downloads, please contact tasteofindia.support@gmail.com within 7 days of transaction for a full refund to your original payment method.</p>
          </div>
        );

      case 'privacy':
      default:
        return (
          <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
            <h2 className="font-serif-title text-2xl font-black text-[#2B1B17]">Privacy Policy</h2>
            <p>At TASTE OF INDIA, we are committed to safeguarding your privacy. We collect minimal personal data (name, email, and recipe preferences) strictly to facilitate community interactions, save your favourite dishes, and deliver secure payment receipts.</p>
            <p>We never sell your personal information to third-party data brokers. Payment data is processed under 256-bit SSL encryption via RBI authorized gateways.</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-black/60 backdrop-blur-xs flex justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto flex flex-col max-h-[85vh]">
        <div className="p-4 sm:p-5 bg-[#FAF6F0] border-b border-stone-200 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E8590C]">
            TASTE OF INDIA Institutional Archive
          </span>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 p-1 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 sm:p-8 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
