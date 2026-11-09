import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HomemadeFoodProfile, Recipe } from '../types';
import { 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Heart, 
  Clock, 
  Search, 
  Filter, 
  Sparkles, 
  PlusCircle, 
  Copy, 
  Check, 
  CookingPot, 
  ShoppingBag, 
  ChevronDown, 
  ChevronUp, 
  X,
  Truck,
  ShieldCheck,
  ChefHat,
  Edit3
} from 'lucide-react';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4 fill-current" }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);

export const HomemadeFoodSlotView: React.FC = () => {
  const { 
    homemadeBusinesses, 
    recipes, 
    setCurrentView, 
    setSelectedRecipe, 
    setActiveUploadBusinessType,
    openCreateBusinessAccount,
    openEditBusinessProfile,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'kitchens' | 'recipes'>('kitchens');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>('All');
  const [dietaryFilter, setDietaryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null);

  // Quick Order Modal
  const [orderBusiness, setOrderBusiness] = useState<HomemadeFoodProfile | null>(null);
  const [selectedDishName, setSelectedDishName] = useState('');
  const [orderQuantity, setOrderQuantity] = useState('1');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryTiming, setDeliveryTiming] = useState('Today Lunch (12:30 PM - 1:30 PM)');

  // Cities extracted
  const allCities = ['All', ...Array.from(new Set(homemadeBusinesses.map(h => h.city)))];

  // Filter homemade businesses
  const filteredBusinesses = homemadeBusinesses.filter(h => {
    const matchesCity = selectedCity === 'All' || h.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesSearch = 
      h.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.chefName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.speciality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.deliveryArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesService = serviceTypeFilter === 'All' || h.serviceType === serviceTypeFilter;
    const matchesDietary = dietaryFilter === 'All' || h.dietaryType.toLowerCase().includes(dietaryFilter.toLowerCase());
    return matchesCity && matchesSearch && matchesService && matchesDietary;
  });

  // Recipes uploaded by homemade food creators
  const homemadeRecipes = recipes.filter(r => 
    r.businessType === 'homemade' || 
    r.homemadeDetails !== undefined ||
    homemadeBusinesses.some(h => h.uploadedRecipeIds.includes(r.id))
  );

  const handleCopyPhone = (biz: HomemadeFoodProfile) => {
    navigator.clipboard?.writeText(biz.phone);
    setCopiedPhoneId(biz.id);
    showToast(`Copied phone: ${biz.phone}`);
    setTimeout(() => setCopiedPhoneId(null), 2500);
  };

  const handleWhatsAppOrder = (biz: HomemadeFoodProfile, dishName?: string) => {
    const cleanNumber = biz.whatsappNumber ? biz.whatsappNumber.replace(/[^0-9]/g, '') : biz.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${biz.chefName} (${biz.businessName}), I found your homemade food kitchen on TASTE OF INDIA.\n\nI would like to order ${dishName ? `"${dishName}"` : 'your homemade daily tiffin / meals'}.\n\nCould you please let me know today's menu availability and delivery to my location?`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  const handleSendOrderModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderBusiness) return;
    const cleanNumber = orderBusiness.whatsappNumber ? orderBusiness.whatsappNumber.replace(/[^0-9]/g, '') : orderBusiness.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `*New Homemade Food Order via TASTE OF INDIA*\n\n` +
      `*To:* ${orderBusiness.businessName} (${orderBusiness.chefName})\n` +
      `*Meal / Dish:* ${selectedDishName || 'Standard Daily Thali'}\n` +
      `*Quantity:* ${orderQuantity} Portion(s)\n` +
      `*Preferred Time:* ${deliveryTiming}\n` +
      `*Delivery Address:* ${deliveryAddress || 'Will share location on chat'}\n\n` +
      `Please confirm order and payment method.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
    setOrderBusiness(null);
    showToast('Order details ready in WhatsApp!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Hero Banner Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#2B1B17] via-[#45271D] to-[#2B1B17] text-white p-6 sm:p-10 shadow-xl border border-amber-900/40">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>Dedicated Homemade Food Business Slot · Ghar Ka Khana</span>
          </div>

          <h1 className="font-serif-title text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Homemade Food Creators, Daily Tiffins &amp; Local Home Chefs
          </h1>

          <p className="text-stone-300 text-xs sm:text-sm sm:leading-relaxed max-w-2xl">
            Enjoy fresh, hygienic, unadulterated comfort food cooked by local mothers, grandmothers, and passionate home culinary entrepreneurs. Discover daily tiffin meal boxes, monthly dabba subscriptions, fresh rotis, handmade pickles, and regional sweets with direct contact numbers and kitchen addresses.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => openCreateBusinessAccount('homemade')}
              className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer border border-emerald-300/30"
            >
              <Sparkles className="w-4 h-4 text-emerald-100" />
              <span>Create Homemade Account &amp; Add Logo</span>
            </button>

            <button
              onClick={() => {
                setActiveUploadBusinessType('homemade');
                setCurrentView('share-recipe');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer backdrop-blur-xs"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>Upload Recipe &amp; Tiffin Menu</span>
            </button>

            <div className="text-xs text-amber-200/90 flex items-center gap-1.5 py-2 px-3 bg-white/5 rounded-xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Home Kitchens · Zero Artificial Preservatives · Direct Contact</span>
            </div>
          </div>
        </div>

        {/* Decorative background watermark */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-10 translate-y-10">
          <ChefHat className="w-96 h-96 text-amber-200" />
        </div>
      </div>

      {/* Navigation Tabs (Directory vs Recipes) */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-3 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('kitchens')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'kitchens'
                ? 'bg-[#2B1B17] text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <ChefHat className="w-4 h-4 text-amber-400" />
            <span>Home Kitchens &amp; Tiffins ({filteredBusinesses.length})</span>
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
            <span>Homemade Family Recipes ({homemadeRecipes.length})</span>
          </button>
        </div>

        <div className="text-xs text-stone-500 font-medium">
          Showing {activeTab === 'kitchens' ? filteredBusinesses.length : homemadeRecipes.length} verified home cooks
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          
          {/* Search Box */}
          <div className="sm:col-span-4 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by chef, tiffin, dish, or area..."
              className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#E8590C]/30 focus:border-[#E8590C]"
            />
          </div>

          {/* City Filter */}
          <div className="sm:col-span-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#E8590C]/30 focus:border-[#E8590C] cursor-pointer"
            >
              <option value="All">All Cities</option>
              {allCities.filter(c => c !== 'All').map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Service Type Filter */}
          <div className="sm:col-span-3 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-stone-400 shrink-0" />
            <select
              value={serviceTypeFilter}
              onChange={e => setServiceTypeFilter(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#E8590C]/30 focus:border-[#E8590C] cursor-pointer"
            >
              <option value="All">All Service Types</option>
              <option value="Daily Tiffin Service">Daily Tiffin Service</option>
              <option value="Home Kitchen Pre-orders">Home Kitchen Pre-orders</option>
              <option value="Homemade Sweets & Pickles">Homemade Sweets &amp; Pickles</option>
            </select>
          </div>

          {/* Dietary Filter */}
          <div className="sm:col-span-2 flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-400 shrink-0" />
            <select
              value={dietaryFilter}
              onChange={e => setDietaryFilter(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#E8590C]/30 focus:border-[#E8590C] cursor-pointer"
            >
              <option value="All">All Diets</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Jain">Jain Friendly</option>
              <option value="Non-Veg">Non-Veg</option>
            </select>
          </div>

        </div>
      </div>

      {/* TAB 1: HOME KITCHENS & TIFFIN DIRECTORY */}
      {activeTab === 'kitchens' && (
        <div className="space-y-6">
          {filteredBusinesses.length > 0 ? (
            filteredBusinesses.map((biz) => {
              const bizRecipesList = recipes.filter(r => biz.uploadedRecipeIds.includes(r.id));

              return (
                <div 
                  key={biz.id}
                  className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
                >
                  {/* Business Header Row */}
                  <div className="p-5 sm:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-stone-100">
                    
                    <div className="flex items-start gap-4">
                      <div className="relative shrink-0">
                        <img
                          src={biz.logo || biz.avatar}
                          alt={biz.businessName}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-emerald-500/30 shadow-xs bg-emerald-50"
                        />
                        {biz.logo && (
                          <span className="absolute -bottom-1.5 -right-1.5 bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider border border-white">
                            Logo
                          </span>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-serif-title text-lg sm:text-xl font-black text-[#2B1B17]">
                            {biz.businessName}
                          </h3>
                          {biz.verified && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 fill-emerald-100" />
                              <span>Verified Home Kitchen</span>
                            </span>
                          )}
                          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            ★ {biz.rating} ({biz.reviewsCount} customer reviews)
                          </span>
                        </div>

                        <div className="text-xs font-semibold text-stone-700 flex items-center gap-2">
                          <ChefHat className="w-3.5 h-3.5 text-[#E8590C]" />
                          <span>Prepared by: {biz.chefName}</span>
                          <span>·</span>
                          <span className="text-emerald-700 font-bold">{biz.dietaryType}</span>
                        </div>

                        <p className="text-xs text-stone-600 max-w-2xl leading-relaxed">
                          {biz.speciality}
                        </p>

                        {/* Location, Service & Hours Badges */}
                        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-stone-600">
                          <div className="flex items-center gap-1 font-bold text-stone-800 bg-stone-100 px-2.5 py-1 rounded-lg">
                            <MapPin className="w-3.5 h-3.5 text-[#E8590C]" />
                            <span>{biz.city}, {biz.state}</span>
                          </div>
                          <div className="flex items-center gap-1 bg-amber-50 text-amber-900 font-semibold px-2.5 py-1 rounded-lg border border-amber-200">
                            <Truck className="w-3.5 h-3.5 text-[#E8590C]" />
                            <span>{biz.deliveryArea}</span>
                          </div>
                          <div className="flex items-center gap-1 bg-stone-100 px-2.5 py-1 rounded-lg">
                            <Clock className="w-3.5 h-3.5 text-stone-500" />
                            <span>{biz.operatingHours}</span>
                          </div>
                        </div>

                        {/* Address highlight */}
                        <div className="text-[11px] text-stone-500 flex items-center gap-1 pt-0.5">
                          <strong className="text-stone-700">Kitchen Locality:</strong>
                          <span>{biz.address}, {biz.city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Contact & Ordering Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 justify-center">
                      
                      {/* Direct Phone Call Button */}
                      <a
                        href={`tel:${biz.phone.replace(/[^0-9+]/g, '')}`}
                        className="px-4 py-2.5 bg-[#2B1B17] hover:bg-[#1F1310] active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5 text-amber-400" />
                        <span>Call: {biz.phone}</span>
                      </a>

                      {/* WhatsApp Direct Order Button */}
                      <button
                        type="button"
                        onClick={() => handleWhatsAppOrder(biz)}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <WhatsAppIcon className="w-4 h-4 fill-white" />
                        <span>Order via WhatsApp</span>
                      </button>

                      {/* Quick Meal Order Modal Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setOrderBusiness(biz);
                          setSelectedDishName(biz.menuItems[0]?.dishName || 'Standard Daily Thali');
                        }}
                        className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-[#E8590C] border border-orange-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Book Daily Tiffin</span>
                      </button>

                      {/* Edit Kitchen Profile & Channel Button */}
                      <button
                        type="button"
                        onClick={() => openEditBusinessProfile('homemade', biz)}
                        className="px-4 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-stone-200"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Edit Kitchen Profile &amp; Menu</span>
                      </button>

                      {/* Copy Phone */}
                      <button
                        type="button"
                        onClick={() => handleCopyPhone(biz)}
                        className="text-[10px] text-stone-500 hover:text-stone-800 flex items-center justify-center gap-1 cursor-pointer pt-0.5"
                      >
                        {copiedPhoneId === biz.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedPhoneId === biz.id ? 'Phone Number Copied' : 'Copy Contact Number'}</span>
                      </button>

                    </div>
                  </div>

                  {/* Homemade Menu Details Section with Increased Text Readability */}
                  <div className="bg-[#FAF6F0] p-4 sm:px-7 border-b border-stone-100">
                    <div className="text-sm sm:text-base font-black text-stone-900 mb-3.5 flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#E8590C]" />
                      <span>Today's Homemade Tiffin &amp; Specialty Menu:</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {biz.menuItems.map((item) => (
                        <div 
                          key={item.id}
                          className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2 flex flex-col justify-between"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-start justify-between gap-2.5">
                              <h5 className="font-serif-title font-black text-base sm:text-lg text-[#2B1B17] leading-snug">
                                {item.dishName}
                              </h5>
                              <span className="font-black text-base sm:text-lg text-[#E8590C] shrink-0">
                                ₹{item.price}
                              </span>
                            </div>
                            <div className="text-xs sm:text-sm text-stone-600 font-semibold flex items-center gap-2 flex-wrap">
                              <span>{item.portionSize}</span>
                              <span>·</span>
                              <span className="text-emerald-700 font-bold">{item.availability}</span>
                            </div>
                            {item.description && (
                              <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed mt-1">
                                {item.description}
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleWhatsAppOrder(biz, item.dishName)}
                            className="w-full mt-2.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-emerald-700" />
                            <span>Order for ₹{item.price}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Uploaded Recipes by this Home Chef */}
                  {bizRecipesList.length > 0 && (
                    <div className="p-4 sm:px-7 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <CookingPot className="w-4 h-4 text-[#E8590C]" />
                        <span className="font-bold text-stone-700">Recipes Uploaded by {biz.chefName}:</span>
                      </div>
                      <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0">
                        {bizRecipesList.map(rec => (
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
              <ChefHat className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-serif-title text-xl font-bold text-stone-800">No Home Kitchens Found</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                No home cooks match your current filter selection. Reset filters or be the first home cook to list your tiffin service in this city!
              </p>
              <button
                onClick={() => {
                  setSelectedCity('All');
                  setServiceTypeFilter('All');
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

      {/* TAB 2: HOMEMADE FAMILY RECIPES */}
      {activeTab === 'recipes' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs text-emerald-950">
            <div className="flex items-center gap-2">
              <CookingPot className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                These authentic recipes are shared directly by home cooks and tiffin creators. Click any recipe to view family tips, traditional preparation, and order directly from their home kitchen!
              </span>
            </div>
            <button
              onClick={() => {
                setActiveUploadBusinessType('homemade');
                setCurrentView('share-recipe');
              }}
              className="px-3 py-1.5 bg-[#E8590C] text-white rounded-lg font-bold shrink-0 text-xs hover:bg-[#D9480F]"
            >
              + Upload Homemade Recipe
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {homemadeRecipes.map((recipe) => (
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
                    <span className="absolute top-2.5 left-2.5 bg-emerald-900/90 backdrop-blur-xs text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                      <span>Ghar Ka Khana</span>
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

                    {/* Homemade Business Stamp */}
                    {recipe.homemadeDetails && (
                      <div className="bg-emerald-50/70 p-2 rounded-xl border border-emerald-200/80 text-[11px] text-stone-700 space-y-0.5">
                        <div className="font-bold text-emerald-950 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{recipe.homemadeDetails.businessName}</span>
                        </div>
                        <div className="text-stone-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          <span>{recipe.homemadeDetails.city} · Ph: {recipe.homemadeDetails.contactNumber}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 mt-2">
                  <span>{recipe.prepTime + recipe.cookTime} mins total</span>
                  <span className="font-bold text-[#E8590C]">View Recipe &amp; Home Chef →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUICK TIFFIN ORDER MODAL */}
      {orderBusiness && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-700 tracking-wider">Direct Home Tiffin Order</span>
                <h3 className="font-serif-title text-lg font-black text-[#2B1B17]">{orderBusiness.businessName}</h3>
              </div>
              <button 
                onClick={() => setOrderBusiness(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendOrderModal} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Select Meal / Tiffin Package</label>
                <select
                  value={selectedDishName}
                  onChange={e => setSelectedDishName(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                >
                  {orderBusiness.menuItems.map(item => (
                    <option key={item.id} value={item.dishName}>
                      {item.dishName} — ₹{item.price} ({item.portionSize})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Portions / Quantity</label>
                  <input
                    type="number"
                    value={orderQuantity}
                    onChange={e => setOrderQuantity(e.target.value)}
                    min="1"
                    max="20"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Preferred Time</label>
                  <select
                    value={deliveryTiming}
                    onChange={e => setDeliveryTiming(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="Today Lunch (12:30 PM - 1:30 PM)">Today Lunch (12:30 PM - 1:30 PM)</option>
                    <option value="Today Dinner (7:30 PM - 8:30 PM)">Today Dinner (7:30 PM - 8:30 PM)</option>
                    <option value="Tomorrow Lunch">Tomorrow Lunch</option>
                    <option value="Weekly Tiffin Subscription Inquiry">Weekly Subscription Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Your Delivery Address &amp; Landmark</label>
                <textarea
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  rows={2}
                  placeholder="e.g. Flat 302, Green Residency, 4th Main..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl text-stone-700 text-[11px] space-y-1">
                <div><strong>Home Kitchen:</strong> {orderBusiness.address}, {orderBusiness.city}</div>
                <div><strong>Chef Contact:</strong> {orderBusiness.phone}</div>
                <div><strong>Delivery Coverage:</strong> {orderBusiness.deliveryArea}</div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                <span>Place Order Directly on WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
