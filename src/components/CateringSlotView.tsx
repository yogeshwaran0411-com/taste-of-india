import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CateringProfile, Recipe } from '../types';
import { 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Users, 
  UtensilsCrossed, 
  Calendar, 
  Search, 
  Filter, 
  Clock, 
  Sparkles, 
  PlusCircle, 
  MessageSquare, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Award,
  ShieldCheck,
  CookingPot,
  Share2,
  Copy,
  Check,
  X,
  Play,
  Eye,
  Edit3,
  CalendarDays,
  FileImage,
  CalendarX
} from 'lucide-react';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4 fill-current" }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);

export const CateringSlotView: React.FC = () => {
  const { 
    caterers, 
    recipes, 
    setCurrentView, 
    setSelectedRecipe, 
    setActiveUploadBusinessType,
    openCreateBusinessAccount,
    openEditBusinessProfile,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'caterers' | 'recipes'>('caterers');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [dietaryFilter, setDietaryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedPackageCatererId, setExpandedPackageCatererId] = useState<string | null>(null);
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null);

  // Quick Inquiry Modal State
  const [inquiryCaterer, setInquiryCaterer] = useState<CateringProfile | null>(null);
  const [eventDate, setEventDate] = useState('');
  const [guestCount, setGuestCount] = useState('150');
  const [eventType, setEventType] = useState('Wedding Reception');
  const [customNotes, setCustomNotes] = useState('');

  // Cities extracted from caterers
  const allCities = ['All', ...Array.from(new Set(caterers.map(c => c.city)))];

  // Selected image preview modal
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Video Player preview modal
  const [activeVideoUrl, setActiveVideoUrl] = useState<{ title: string; url: string } | null>(null);

  // Filter caterers
  const filteredCaterers = caterers.filter(c => {
    const matchesCity = selectedCity === 'All' || c.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesSearch = 
      c.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.speciality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDietary = dietaryFilter === 'All' || 
      (c.dietaryType && (
        dietaryFilter === 'Vegetarian' ? c.dietaryType === 'Pure Veg' :
        dietaryFilter === 'Non-Vegetarian' ? c.dietaryType === 'Non-Veg' :
        dietaryFilter === 'Both' ? c.dietaryType === 'Both Veg & Non-Veg' : true
      )) ||
      c.menuPackages.some(p => {
        if (dietaryFilter === 'Vegetarian') return p.dietary.toLowerCase().includes('veg') && !p.dietary.toLowerCase().includes('non');
        if (dietaryFilter === 'Non-Vegetarian') return p.dietary.toLowerCase().includes('non');
        return true;
      });
    return matchesCity && matchesSearch && matchesDietary;
  });

  // Catering recipes uploaded by catering businesses
  const cateringRecipes = recipes.filter(r => 
    r.businessType === 'catering' || 
    r.cateringDetails !== undefined ||
    caterers.some(c => c.uploadedRecipeIds.includes(r.id))
  );

  const handleCopyPhone = (caterer: CateringProfile) => {
    navigator.clipboard?.writeText(caterer.phone);
    setCopiedPhoneId(caterer.id);
    showToast(`Copied phone: ${caterer.phone}`);
    setTimeout(() => setCopiedPhoneId(null), 2500);
  };

  const handleOpenWhatsAppInquiry = (caterer: CateringProfile, pkgName?: string) => {
    const cleanNumber = caterer.whatsappNumber ? caterer.whatsappNumber.replace(/[^0-9]/g, '') : caterer.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${caterer.businessName}, I found your catering profile on TASTE OF INDIA.\n\nI would like to inquire about ${pkgName ? `the "${pkgName}"` : 'your catering services & menu packages'} for an upcoming event.\n\nCould you please share your availability and detailed menu brochure?`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  const handleSendInquiryModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryCaterer) return;
    const cleanNumber = inquiryCaterer.whatsappNumber ? inquiryCaterer.whatsappNumber.replace(/[^0-9]/g, '') : inquiryCaterer.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `*New Catering Inquiry via TASTE OF INDIA*\n\n` +
      `*To:* ${inquiryCaterer.businessName}\n` +
      `*Event Type:* ${eventType}\n` +
      `*Event Date:* ${eventDate || 'Upcoming'}\n` +
      `*Estimated Guests:* ${guestCount} People\n` +
      `*Notes:* ${customNotes || 'Looking forward to customized menu options.'}\n\n` +
      `Please reply with quote and menu details.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
    setInquiryCaterer(null);
    showToast('Inquiry message generated in WhatsApp!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Hero Banner Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#2B1B17] via-[#3B2219] to-[#1F1310] text-white p-6 sm:p-10 shadow-xl border border-amber-900/40">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-bold uppercase tracking-wider">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Dedicated Catering Slot · Verified Bulk Menus</span>
          </div>

          <h1 className="font-serif-title text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Authentic Indian Catering Services &amp; Event Menus
          </h1>

          <p className="text-stone-300 text-xs sm:text-sm sm:leading-relaxed max-w-2xl">
            Book authentic regional caterers for weddings, housewarming feasts, poojas, corporate galas, and family celebrations. View transparent price per plate, complete itemized menu packages, direct phone numbers, and operational addresses.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => openCreateBusinessAccount('catering')}
              className="px-5 py-3 bg-gradient-to-r from-amber-500 to-[#E8590C] hover:from-amber-600 hover:to-[#D9480F] active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer border border-amber-300/30"
            >
              <Sparkles className="w-4 h-4 text-amber-100" />
              <span>Create Catering Account &amp; Add Logo</span>
            </button>

            <button
              onClick={() => {
                setActiveUploadBusinessType('catering');
                setCurrentView('share-recipe');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer backdrop-blur-xs"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>Upload Recipe &amp; Menu Details</span>
            </button>

            <div className="text-xs text-amber-200/90 flex items-center gap-1.5 py-2 px-3 bg-white/5 rounded-xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Direct contact with business owners · Zero middleman commission</span>
            </div>
          </div>
        </div>

        {/* Decorative background watermark */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
          <UtensilsCrossed className="w-96 h-96 text-amber-200" />
        </div>
      </div>

      {/* Navigation Tabs (Directory vs Recipes) */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-3 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('caterers')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'caterers'
                ? 'bg-[#2B1B17] text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4 text-amber-400" />
            <span>Caterers &amp; Menu Packages ({filteredCaterers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('recipes')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'recipes'
                ? 'bg-[#2B1B17] text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <CookingPot className="w-4 h-4 text-amber-400" />
            <span>Catering Signature Recipes ({cateringRecipes.length})</span>
          </button>
        </div>

        <div className="text-xs text-stone-500 font-medium">
          Showing {activeTab === 'caterers' ? filteredCaterers.length : cateringRecipes.length} verified listings
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          
          {/* Search Box */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search caterers, specialities, menus, dishes..."
              className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#E8590C]/30 focus:border-[#E8590C]"
            />
          </div>

          {/* City Filter */}
          <div className="sm:col-span-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#E8590C]/30 focus:border-[#E8590C] cursor-pointer"
            >
              <option value="All">All Operating Cities</option>
              {allCities.filter(c => c !== 'All').map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Dietary Filter */}
          <div className="sm:col-span-3 flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-400 shrink-0" />
            <select
              value={dietaryFilter}
              onChange={e => setDietaryFilter(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#E8590C]/30 focus:border-[#E8590C] cursor-pointer font-medium"
            >
              <option value="All">All Dietary (Veg &amp; Non-Veg)</option>
              <option value="Vegetarian">🟢 Pure Vegetarian Only</option>
              <option value="Non-Vegetarian">🔴 Non-Vegetarian Feasts</option>
              <option value="Both">🟢🔴 Both Veg &amp; Non-Veg</option>
            </select>
          </div>

        </div>
      </div>

      {/* TAB 1: CATERERS & MENU PACKAGES DIRECTORY */}
      {activeTab === 'caterers' && (
        <div className="space-y-6">
          {filteredCaterers.length > 0 ? (
            filteredCaterers.map((caterer) => {
              const isPackagesExpanded = expandedPackageCatererId === caterer.id;
              const catererRecipesList = recipes.filter(r => caterer.uploadedRecipeIds.includes(r.id));

              return (
                <div 
                  key={caterer.id}
                  className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
                >
                  {/* Caterer Header Row */}
                  <div className="p-5 sm:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-stone-100">
                    
                    <div className="flex items-start gap-4">
                      <div className="relative shrink-0">
                        <img
                          src={caterer.logo || caterer.avatar}
                          alt={caterer.businessName}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-amber-500/30 shadow-xs bg-amber-50"
                        />
                        {caterer.logo && (
                          <span className="absolute -bottom-1.5 -right-1.5 bg-amber-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider border border-white">
                            Logo
                          </span>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-serif-title text-lg sm:text-xl font-black text-[#2B1B17]">
                            {caterer.businessName}
                          </h3>
                          {caterer.verified && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 fill-emerald-100" />
                              <span>Verified Caterer</span>
                            </span>
                          )}

                          {/* Catering Dietary Badge: Pure Veg / Non-Veg / Both */}
                          {caterer.dietaryType === 'Pure Veg' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs">
                              <span className="w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-emerald-200 inline-block animate-pulse"></span>
                              <span>Pure Veg Catering</span>
                            </span>
                          )}
                          {caterer.dietaryType === 'Non-Veg' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-800 border border-rose-300 shadow-2xs">
                              <span className="w-2 h-2 rounded-full bg-rose-600 ring-2 ring-rose-200 inline-block"></span>
                              <span>Non-Veg Feasts</span>
                            </span>
                          )}
                          {(!caterer.dietaryType || caterer.dietaryType === 'Both Veg & Non-Veg') && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"></span>
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 inline-block"></span>
                              <span>Veg &amp; Non-Veg Available</span>
                            </span>
                          )}

                          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            ★ {caterer.rating} ({caterer.reviewsCount} events)
                          </span>
                        </div>

                        <div className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-[#E8590C]" />
                          <span>Led by: {caterer.ownerName} · {caterer.experienceYears} Years Heritage Experience</span>
                        </div>

                        <p className="text-xs text-stone-600 max-w-2xl leading-relaxed">
                          {caterer.speciality}
                        </p>

                        {/* Location and Capacity Badges */}
                        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-stone-600">
                          <div className="flex items-center gap-1 font-bold text-stone-800 bg-stone-100 px-2.5 py-1 rounded-lg">
                            <MapPin className="w-3.5 h-3.5 text-[#E8590C]" />
                            <span>{caterer.city}, {caterer.state}</span>
                          </div>
                          <div className="flex items-center gap-1 bg-stone-100 px-2.5 py-1 rounded-lg">
                            <Users className="w-3.5 h-3.5 text-stone-500" />
                            <span>Capacity: {caterer.capacityRange}</span>
                          </div>
                          <div className="flex items-center gap-1 bg-amber-50 text-amber-900 font-bold px-2.5 py-1 rounded-lg border border-amber-200">
                            <span>Packages: {caterer.pricePerPlateRange}</span>
                          </div>
                        </div>

                        {/* Address highlight */}
                        <div className="text-[11px] text-stone-500 flex items-center gap-1 pt-0.5">
                          <strong className="text-stone-700">Kitchen &amp; Office Address:</strong>
                          <span>{caterer.address}, {caterer.city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Contact & Inquiry Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 justify-center">
                      
                      {/* Direct Phone Call Button */}
                      <a
                        href={`tel:${caterer.phone.replace(/[^0-9+]/g, '')}`}
                        className="px-4 py-2.5 bg-[#2B1B17] hover:bg-[#1F1310] active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5 text-amber-400" />
                        <span>Call: {caterer.phone}</span>
                      </a>

                      {/* WhatsApp Inquiry Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenWhatsAppInquiry(caterer)}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <WhatsAppIcon className="w-4 h-4 fill-white" />
                        <span>Inquire via WhatsApp</span>
                      </button>

                      {/* Instant Event Quote Modal Button */}
                      <button
                        type="button"
                        onClick={() => setInquiryCaterer(caterer)}
                        className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-[#E8590C] border border-orange-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Check Date &amp; Quote</span>
                      </button>

                      {/* Edit Catering Profile & Channel Button */}
                      <button
                        type="button"
                        onClick={() => openEditBusinessProfile('catering', caterer)}
                        className="px-4 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-stone-200"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#E8590C]" />
                        <span>Edit Profile, Menus &amp; Schedule</span>
                      </button>

                      {/* Copy Phone */}
                      <button
                        type="button"
                        onClick={() => handleCopyPhone(caterer)}
                        className="text-[10px] text-stone-500 hover:text-stone-800 flex items-center justify-center gap-1 cursor-pointer pt-0.5"
                      >
                        {copiedPhoneId === caterer.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedPhoneId === caterer.id ? 'Phone Number Copied' : 'Copy Contact Number'}</span>
                      </button>

                    </div>
                  </div>

                  {/* Catering Availability Calendar & Busy Schedule */}
                  <div className="bg-[#FAF6F0] p-4 sm:px-7 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-sm">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 font-black text-sm sm:text-base text-stone-900">
                        <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-[#E8590C]" />
                        <span>Booking Availability &amp; Busy Calendar Schedule:</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <span className="text-xs font-bold text-stone-700">Marked Booked / Busy Dates:</span>
                        {caterer.bookedDates && caterer.bookedDates.length > 0 ? (
                          caterer.bookedDates.map((dateStr, dIdx) => (
                            <span key={dIdx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-800 border border-rose-300 rounded-lg font-bold text-xs shadow-2xs">
                              <span className="w-2 h-2 rounded-full bg-rose-600 inline-block animate-pulse"></span>
                              <span>🔴 {dateStr} (Already Booked)</span>
                            </span>
                          ))
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg font-bold text-xs shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                            <span>🟢 Available For All Upcoming Dates</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => openEditBusinessProfile('catering', caterer)}
                        className="px-3.5 py-2 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <CalendarX className="w-4 h-4 text-rose-600" />
                        <span>Update Busy Dates</span>
                      </button>
                      {caterer.videoUrl && (
                        <button
                          type="button"
                          onClick={() => setActiveVideoUrl({ title: `${caterer.businessName} - Showcase Video`, url: caterer.videoUrl! })}
                          className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Play className="w-4 h-4 fill-white" />
                          <span>Watch Showcase Video</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Catering Menu Images & Buffet Gallery */}
                  {caterer.menuImages && caterer.menuImages.length > 0 && (
                    <div className="p-4 sm:px-7 bg-white border-b border-stone-100 space-y-2.5">
                      <div className="flex items-center gap-2 text-sm sm:text-base font-black text-stone-900">
                        <FileImage className="w-4 h-4 sm:w-5 sm:h-5 text-[#E8590C]" />
                        <span>Menu Cards &amp; Buffet Photo Gallery:</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {caterer.menuImages.map((imgUrl, mIdx) => (
                          <div
                            key={mIdx}
                            onClick={() => setPreviewImage(imgUrl)}
                            className="group relative h-28 rounded-xl overflow-hidden border border-stone-200 cursor-pointer shadow-2xs hover:shadow-md transition-all"
                          >
                            <img src={imgUrl} alt={`Menu card ${mIdx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white text-xs font-bold">
                              <Eye className="w-4 h-4" />
                              <span>View Menu</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Menu Packages Accordion Section */}
                  <div className="bg-[#FAF6F0] p-4 sm:px-7 border-b border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm sm:text-base font-black text-stone-900">
                      <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5 text-[#E8590C]" />
                      <span>Catering Menu Details ({caterer.menuPackages.length} Curated Packages Available)</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedPackageCatererId(isPackagesExpanded ? null : caterer.id)}
                      className="text-xs sm:text-sm font-bold text-[#E8590C] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isPackagesExpanded ? 'Hide Menu Packages' : 'View Full Menu Packages & Pricing'}</span>
                      {isPackagesExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Expanded Menu Package Cards with Increased Text Sizes */}
                  {isPackagesExpanded && (
                    <div className="p-5 sm:p-7 bg-stone-50/70 border-b border-stone-200 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {caterer.menuPackages.map((pkg) => (
                          <div 
                            key={pkg.id}
                            className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between"
                          >
                            <div className="space-y-3">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-1.5 ${
                                    pkg.dietary === 'Vegetarian' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {pkg.dietary}
                                  </span>
                                  <h4 className="font-serif-title font-black text-lg sm:text-xl text-[#2B1B17]">
                                    {pkg.packageName}
                                  </h4>
                                </div>
                                <div className="text-right shrink-0">
                                  <div className="font-black text-xl sm:text-2xl text-[#E8590C]">₹{pkg.pricePerPlate}</div>
                                  <div className="text-xs text-stone-500 font-bold">per plate</div>
                                </div>
                              </div>

                              {pkg.description && (
                                <p className="text-sm text-stone-700 italic leading-relaxed">
                                  "{pkg.description}"
                                </p>
                              )}

                              <div className="text-sm font-bold text-stone-900 pt-1">
                                Items Included in Menu:
                              </div>
                              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm font-medium text-stone-700">
                                {pkg.itemsIncluded.map((item, idx) => (
                                  <li key={idx} className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#E8590C] shrink-0" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>

                              <div className="text-xs sm:text-sm text-stone-600 pt-1.5 border-t border-stone-100">
                                Min Guest Requirement: <strong className="text-stone-900 font-bold">{pkg.minGuests} Guests</strong>
                                {pkg.maxGuests && ` · Max: ${pkg.maxGuests} Guests`}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleOpenWhatsAppInquiry(caterer, pkg.packageName)}
                              className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
                            >
                              <WhatsAppIcon className="w-4 h-4 fill-emerald-700" />
                              <span>Inquire for {pkg.packageName}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Uploaded Recipes by this Caterer */}
                  {catererRecipesList.length > 0 && (
                    <div className="p-4 sm:px-7 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <CookingPot className="w-4 h-4 text-[#E8590C]" />
                        <span className="font-bold text-stone-700">Signature Recipes Uploaded by this Caterer:</span>
                      </div>
                      <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0">
                        {catererRecipesList.map(rec => (
                          <button
                            key={rec.id}
                            type="button"
                            onClick={() => setSelectedRecipe(rec)}
                            className="flex items-center gap-2 p-1.5 pr-3 bg-stone-50 hover:bg-amber-50 rounded-xl border border-stone-200 transition-colors cursor-pointer shrink-0"
                          >
                            <img src={rec.image} alt={rec.title} className="w-7 h-7 rounded-lg object-cover" />
                            <span className="font-bold text-stone-800 hover:text-[#E8590C]">{rec.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-3">
              <UtensilsCrossed className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-serif-title text-xl font-bold text-stone-800">No Caterers Matching Filters</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Try selecting a different city or clearing dietary filters. Are you a catering specialist? List your business now!
              </p>
              <button
                onClick={() => {
                  setSelectedCity('All');
                  setDietaryFilter('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CATERING RECIPES ONLY */}
      {activeTab === 'recipes' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <CookingPot className="w-4 h-4 text-[#E8590C] shrink-0" />
              <span>
                These dishes are uploaded directly by professional event caterers. Click any recipe to view authentic ingredients, bulk measurements, and the caterer's contact details.
              </span>
            </div>
            <button
              onClick={() => {
                setActiveUploadBusinessType('catering');
                setCurrentView('share-recipe');
              }}
              className="px-3 py-1.5 bg-[#E8590C] text-white rounded-lg font-bold shrink-0 text-xs hover:bg-[#D9480F]"
            >
              + Upload Catering Recipe
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cateringRecipes.map((recipe) => (
              <div 
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md hover:border-[#E8590C]/40 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden">
                    <img 
                      src={recipe.image} 
                      alt={recipe.title} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                    />
                    <span className="absolute top-2.5 left-2.5 bg-[#2B1B17]/90 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <UtensilsCrossed className="w-3 h-3" />
                      <span>Catering Signature</span>
                    </span>
                    <span className="absolute top-2.5 right-2.5 bg-white/95 text-stone-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                      {recipe.state}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="font-serif-title font-bold text-base text-[#2B1B17] line-clamp-1 hover:text-[#E8590C]">
                      {recipe.title}
                    </h4>

                    <p className="text-xs text-stone-500 line-clamp-2">
                      {recipe.description}
                    </p>

                    {/* Catering Business Stamp */}
                    {recipe.cateringDetails && (
                      <div className="bg-amber-50/70 p-2 rounded-xl border border-amber-200/80 text-[11px] text-stone-700 space-y-0.5">
                        <div className="font-bold text-amber-900 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{recipe.cateringDetails.businessName}</span>
                        </div>
                        <div className="text-stone-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          <span>{recipe.cateringDetails.city} · Ph: {recipe.cateringDetails.contactNumber}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 mt-2">
                  <span>{recipe.prepTime + recipe.cookTime} mins total</span>
                  <span className="font-bold text-[#E8590C]">View Recipe &amp; Menu →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUICK INQUIRY MODAL */}
      {inquiryCaterer && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-700 tracking-wider">Catering Inquiry</span>
                <h3 className="font-serif-title text-lg font-black text-[#2B1B17]">{inquiryCaterer.businessName}</h3>
              </div>
              <button 
                onClick={() => setInquiryCaterer(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendInquiryModal} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Occasion / Function Type</label>
                <select
                  value={eventType}
                  onChange={e => setEventType(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                >
                  <option value="Wedding Reception">Wedding Reception</option>
                  <option value="Muhurtham Traditional Lunch">Muhurtham Traditional Lunch (Banana Leaf)</option>
                  <option value="Housewarming / Gruhapravesam">Housewarming / Gruhapravesam</option>
                  <option value="Birthday / Anniversary Party">Birthday / Anniversary Party</option>
                  <option value="Corporate Event / Buffet">Corporate Event / Buffet</option>
                  <option value="Pooja / Satsang Feast">Pooja / Satsang Feast</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Event Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={e => setEventDate(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Guest Count</label>
                  <input
                    type="number"
                    value={guestCount}
                    onChange={e => setGuestCount(e.target.value)}
                    placeholder="e.g. 150"
                    min="20"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Specific Dishes or Menu Preferences</label>
                <textarea
                  value={customNotes}
                  onChange={e => setCustomNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Need live appam counter, pure ghee sweets, and welcome drinks..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl text-stone-700 text-[11px] space-y-1">
                <div><strong>Address:</strong> {inquiryCaterer.address}, {inquiryCaterer.city}</div>
                <div><strong>Direct Contact:</strong> {inquiryCaterer.phone}</div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                <span>Send WhatsApp Inquiry Directly</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LIGHTBOX FOR MENU IMAGES */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-70 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-stone-900 rounded-2xl overflow-hidden shadow-2xl p-2" onClick={e => e.stopPropagation()}>
            <img src={previewImage} alt="Menu card preview" className="max-w-full max-h-[80vh] object-contain mx-auto rounded-lg" />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-black/90 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* VIDEO TOUR MODAL */}
      {activeVideoUrl && (
        <div 
          onClick={() => setActiveVideoUrl(null)}
          className="fixed inset-0 z-70 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="bg-[#1C1613] text-white rounded-2xl max-w-2xl w-full p-4 space-y-3" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-2 border-b border-stone-700">
              <span className="font-serif-title font-bold text-sm text-amber-300">{activeVideoUrl.title}</span>
              <button onClick={() => setActiveVideoUrl(null)} className="p-1 text-stone-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
              {activeVideoUrl.url.includes('youtube') || activeVideoUrl.url.includes('youtu.be') ? (
                <iframe
                  src={activeVideoUrl.url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                  title="Catering Video"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={activeVideoUrl.url} controls className="w-full h-full object-cover" />
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
