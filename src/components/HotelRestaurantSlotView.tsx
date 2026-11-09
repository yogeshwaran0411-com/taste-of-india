import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HotelRestaurantProfile, Recipe } from '../types';
import { 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Utensils, 
  Clock, 
  Search, 
  Filter, 
  Sparkles, 
  PlusCircle, 
  Copy, 
  Check, 
  CookingPot, 
  Calendar, 
  Users, 
  Building2, 
  ChevronDown, 
  ChevronUp, 
  X, 
  ShieldCheck, 
  Play, 
  Eye, 
  FileText, 
  Edit3, 
  DollarSign, 
  Sparkle
} from 'lucide-react';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4 fill-current" }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);

export const HotelRestaurantSlotView: React.FC = () => {
  const { 
    hotelsAndRestaurants, 
    recipes, 
    setCurrentView, 
    setSelectedRecipe, 
    setActiveUploadBusinessType,
    openCreateBusinessAccount,
    openEditBusinessProfile,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'restaurants' | 'recipes'>('restaurants');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [restaurantTypeFilter, setRestaurantTypeFilter] = useState<string>('All');
  const [dietaryFilter, setDietaryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null);

  // Selected image preview modal
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Video Player preview modal
  const [activeVideoUrl, setActiveVideoUrl] = useState<{ title: string; url: string } | null>(null);

  // Table Booking Modal State
  const [bookingRestaurant, setBookingRestaurant] = useState<HotelRestaurantProfile | null>(null);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState('08:00 PM (Dinner)');
  const [guestCount, setGuestCount] = useState('4');
  const [customerName, setCustomerName] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Cities extracted
  const allCities = ['All', ...Array.from(new Set(hotelsAndRestaurants.map(h => h.city)))];

  // Filter restaurants
  const filteredRestaurants = hotelsAndRestaurants.filter(r => {
    const matchesCity = selectedCity === 'All' || r.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesSearch = 
      r.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ownerOrChefName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.specialities.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = restaurantTypeFilter === 'All' || r.restaurantType === restaurantTypeFilter;
    const matchesDietary = dietaryFilter === 'All' || 
      (dietaryFilter === 'Vegetarian' ? r.dietaryType === 'Pure Veg' :
       dietaryFilter === 'Non-Vegetarian' ? r.dietaryType === 'Non-Veg' :
       dietaryFilter === 'Both' ? r.dietaryType === 'Both Veg & Non-Veg' : true);
    return matchesCity && matchesSearch && matchesType && matchesDietary;
  });

  // Recipes uploaded by hotels and restaurants
  const restaurantRecipes = recipes.filter(r => 
    r.businessType === 'hotel_restaurant' || 
    r.restaurantDetails !== undefined ||
    hotelsAndRestaurants.some(h => h.uploadedRecipeIds?.includes(r.id))
  );

  const handleCopyPhone = (restaurant: HotelRestaurantProfile) => {
    navigator.clipboard?.writeText(restaurant.phone);
    setCopiedPhoneId(restaurant.id);
    showToast(`Copied phone: ${restaurant.phone}`);
    setTimeout(() => setCopiedPhoneId(null), 2500);
  };

  const handleWhatsAppBooking = (restaurant: HotelRestaurantProfile) => {
    const cleanNumber = restaurant.whatsappNumber ? restaurant.whatsappNumber.replace(/[^0-9]/g, '') : restaurant.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${restaurant.businessName}, I found your establishment on TASTE OF INDIA.\n\nI would like to inquire about table reservations / menu inquiry at your ${restaurant.city} location.\n\nCould you please share today's availability?`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  const handleSendBookingModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingRestaurant) return;
    const cleanNumber = bookingRestaurant.whatsappNumber ? bookingRestaurant.whatsappNumber.replace(/[^0-9]/g, '') : bookingRestaurant.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `*Table Reservation Request via TASTE OF INDIA*\n\n` +
      `*Restaurant:* ${bookingRestaurant.businessName}\n` +
      `*Guest Name:* ${customerName || 'Guest'}\n` +
      `*Party Size:* ${guestCount} Guests\n` +
      `*Date:* ${bookingDate}\n` +
      `*Preferred Time:* ${bookingTime}\n` +
      `*Special Notes:* ${specialRequests || 'Standard dining table'}\n\n` +
      `Please confirm table reservation availability.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
    setBookingRestaurant(null);
    showToast('Table booking request generated in WhatsApp!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Hero Banner Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#1C1613] via-[#2F1E16] to-[#1A120F] text-white p-6 sm:p-10 shadow-xl border border-amber-900/40">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Dedicated Hotel &amp; Restaurant Slot · Verified Culinary Venues</span>
          </div>

          <h1 className="font-serif-title text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Iconic Hotels, Heritage Haveli Eateries &amp; Grand Highway Dhabas
          </h1>

          <p className="text-stone-300 text-xs sm:text-sm sm:leading-relaxed max-w-2xl">
            Explore India’s most celebrated culinary institutions—from centuries-old royal havelis and luxury hotel dining rooms to famous 24x7 highway dhabas. View menu cards, video walkthroughs, chef signature dishes, and book tables directly with zero reservation fees.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => openCreateBusinessAccount('hotel_restaurant')}
              className="px-5 py-3 bg-gradient-to-r from-amber-500 to-[#E8590C] hover:from-amber-600 hover:to-[#D9480F] active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer border border-amber-300/30"
            >
              <Sparkles className="w-4 h-4 text-amber-100" />
              <span>Register Hotel / Restaurant &amp; Add Logo</span>
            </button>

            <button
              onClick={() => {
                setActiveUploadBusinessType('hotel_restaurant');
                setCurrentView('share-recipe');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer backdrop-blur-xs"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>Upload Chef's Signature Recipe &amp; Menu</span>
            </button>

            <div className="text-xs text-amber-200/90 flex items-center gap-1.5 py-2 px-3 bg-white/5 rounded-xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Direct reservations with venue management · Zero commissions</span>
            </div>
          </div>
        </div>

        {/* Decorative background watermark */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-10 translate-y-10">
          <Building2 className="w-96 h-96 text-amber-200" />
        </div>
      </div>

      {/* Navigation Tabs (Venues vs Recipes) */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-3 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'restaurants'
                ? 'bg-[#2B1B17] text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Hotels &amp; Restaurants ({filteredRestaurants.length})</span>
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
            <span>Chef's Signature Dishes ({restaurantRecipes.length})</span>
          </button>
        </div>

        <div className="text-xs text-stone-500 font-medium">
          Showing {activeTab === 'restaurants' ? filteredRestaurants.length : restaurantRecipes.length} verified dining establishments
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
              placeholder="Search hotels, dhabas, specialities, chefs..."
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

          {/* Restaurant Type Filter */}
          <div className="sm:col-span-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-stone-400 shrink-0" />
            <select
              value={restaurantTypeFilter}
              onChange={e => setRestaurantTypeFilter(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#E8590C]/30 focus:border-[#E8590C] cursor-pointer"
            >
              <option value="All">All Venue Types</option>
              <option value="Fine Dine Restaurant">Fine Dine Restaurant</option>
              <option value="Heritage Haveli & Palace">Heritage Haveli &amp; Palace</option>
              <option value="Highway Dhaba">Highway Dhaba (Grand 24x7)</option>
              <option value="Family Dining & Thali">Family Dining &amp; Thali</option>
              <option value="Boutique Hotel & Cafe">Boutique Hotel &amp; Cafe</option>
              <option value="Traditional Sweet & Chaat House">Traditional Sweet &amp; Chaat House</option>
            </select>
          </div>

          {/* Dietary Filter */}
          <div className="sm:col-span-2 flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-400 shrink-0" />
            <select
              value={dietaryFilter}
              onChange={e => setDietaryFilter(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#E8590C]/30 focus:border-[#E8590C] cursor-pointer font-medium"
            >
              <option value="All">All Diets</option>
              <option value="Vegetarian">🟢 Pure Veg Only</option>
              <option value="Non-Vegetarian">🔴 Non-Veg Feasts</option>
              <option value="Both">🟢🔴 Both Veg &amp; Non-Veg</option>
            </select>
          </div>

        </div>
      </div>

      {/* TAB 1: HOTELS & RESTAURANTS DIRECTORY */}
      {activeTab === 'restaurants' && (
        <div className="space-y-6">
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant) => {
              const restaurantRecipesList = recipes.filter(r => restaurant.uploadedRecipeIds?.includes(r.id));

              return (
                <div 
                  key={restaurant.id}
                  className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
                >
                  {/* Restaurant Header Row */}
                  <div className="p-5 sm:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-stone-100">
                    
                    <div className="flex items-start gap-4">
                      <div className="relative shrink-0">
                        <img
                          src={restaurant.logo || restaurant.avatar}
                          alt={restaurant.businessName}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-amber-500/30 shadow-xs bg-amber-50"
                        />
                        {restaurant.logo && (
                          <span className="absolute -bottom-1.5 -right-1.5 bg-amber-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider border border-white">
                            Logo
                          </span>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-serif-title text-lg sm:text-xl font-black text-[#2B1B17]">
                            {restaurant.businessName}
                          </h3>
                          {restaurant.verified && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 fill-emerald-100" />
                              <span>Verified Establishment</span>
                            </span>
                          )}

                          {/* Restaurant Dietary Badge */}
                          {restaurant.dietaryType === 'Pure Veg' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs">
                              <span className="w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-emerald-200 inline-block"></span>
                              <span>100% Pure Veg Dining</span>
                            </span>
                          )}
                          {restaurant.dietaryType === 'Non-Veg' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-800 border border-rose-300 shadow-2xs">
                              <span className="w-2 h-2 rounded-full bg-rose-600 ring-2 ring-rose-200 inline-block"></span>
                              <span>Non-Veg Feasts</span>
                            </span>
                          )}
                          {restaurant.dietaryType === 'Both Veg & Non-Veg' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"></span>
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 inline-block"></span>
                              <span>Veg &amp; Non-Veg Available</span>
                            </span>
                          )}

                          <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 bg-stone-100 text-stone-700 rounded-full border border-stone-200">
                            {restaurant.restaurantType}
                          </span>

                          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            ★ {restaurant.rating} ({restaurant.reviewsCount} reviews)
                          </span>
                        </div>

                        <div className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                          <Utensils className="w-3.5 h-3.5 text-[#E8590C]" />
                          <span>Led by / Head Chef: {restaurant.ownerOrChefName}</span>
                        </div>

                        {/* Specialities Badges with Increased Text Size */}
                        <div className="flex flex-wrap items-center gap-2 pt-1.5">
                          <span className="text-xs sm:text-sm font-black text-stone-700 mr-1">Famous Specialities:</span>
                          {restaurant.specialities.map((item, idx) => (
                            <span key={idx} className="text-xs sm:text-sm bg-amber-50 text-amber-950 font-bold px-2.5 py-1 rounded-lg border border-amber-300 shadow-2xs">
                              {item}
                            </span>
                          ))}
                        </div>

                        {/* Location, Hours & Seating Badges */}
                        <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs sm:text-sm text-stone-700">
                          <div className="flex items-center gap-1.5 font-bold text-stone-900 bg-stone-100 px-3 py-1.5 rounded-xl">
                            <MapPin className="w-4 h-4 text-[#E8590C]" />
                            <span>{restaurant.city}, {restaurant.state}</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 rounded-xl font-medium">
                            <Clock className="w-4 h-4 text-stone-500" />
                            <span>{restaurant.timings}</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 rounded-xl font-medium">
                            <Users className="w-4 h-4 text-stone-500" />
                            <span>Seating: {restaurant.seatingCapacity}</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-amber-50 text-amber-950 font-bold px-3 py-1.5 rounded-xl border border-amber-200">
                            <span>Cost: {restaurant.averageCostForTwo}</span>
                          </div>
                        </div>

                        {/* Address highlight */}
                        <div className="text-xs text-stone-600 flex items-center gap-1.5 pt-1">
                          <strong className="text-stone-800">Address &amp; Landmark:</strong>
                          <span>{restaurant.address}, {restaurant.city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Contact & Reservation Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 justify-center">
                      
                      {/* Direct Phone Call Button */}
                      <a
                        href={`tel:${restaurant.phone.replace(/[^0-9+]/g, '')}`}
                        className="px-4 py-2.5 bg-[#2B1B17] hover:bg-[#1F1310] active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                        <span>Call: {restaurant.phone}</span>
                      </a>

                      {/* WhatsApp Reservation Button */}
                      <button
                        type="button"
                        onClick={() => handleWhatsAppBooking(restaurant)}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <WhatsAppIcon className="w-4 h-4 fill-white" />
                        <span>Book via WhatsApp</span>
                      </button>

                      {/* Instant Table Booking Modal Button */}
                      <button
                        type="button"
                        onClick={() => setBookingRestaurant(restaurant)}
                        className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-[#E8590C] border border-orange-200 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Reserve Table Slot</span>
                      </button>

                      {/* Edit Restaurant Profile / Channel Option */}
                      <button
                        type="button"
                        onClick={() => openEditBusinessProfile('hotel_restaurant', restaurant)}
                        className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-stone-200"
                      >
                        <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E8590C]" />
                        <span>Edit Restaurant Channel &amp; Menus</span>
                      </button>

                      {/* Copy Phone */}
                      <button
                        type="button"
                        onClick={() => handleCopyPhone(restaurant)}
                        className="text-xs text-stone-500 hover:text-stone-800 flex items-center justify-center gap-1 cursor-pointer pt-0.5"
                      >
                        {copiedPhoneId === restaurant.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedPhoneId === restaurant.id ? 'Phone Number Copied' : 'Copy Contact Number'}</span>
                      </button>

                    </div>
                  </div>

                  {/* Menu Images & Video Tour Section */}
                  {((restaurant.menuImages && restaurant.menuImages.length > 0) || restaurant.videoUrl) && (
                    <div className="bg-[#FAF6F0] p-4 sm:px-7 border-b border-stone-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm sm:text-base font-black text-stone-900">
                          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#E8590C]" />
                          <span>Venue Menus &amp; Ambience Showcase:</span>
                        </div>
                        {restaurant.videoUrl && (
                          <button
                            type="button"
                            onClick={() => setActiveVideoUrl({ title: `${restaurant.businessName} - Ambiance Tour`, url: restaurant.videoUrl! })}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                            <span>Watch Video Tour</span>
                          </button>
                        )}
                      </div>

                      {restaurant.menuImages && restaurant.menuImages.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {restaurant.menuImages.map((imgUrl, imgIdx) => (
                            <div 
                              key={imgIdx}
                              onClick={() => setPreviewImage(imgUrl)}
                              className="group relative h-28 rounded-xl overflow-hidden border border-stone-200 cursor-pointer shadow-2xs hover:shadow-md transition-all"
                            >
                              <img 
                                src={imgUrl} 
                                alt={`Menu Card ${imgIdx + 1}`} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white text-xs font-bold">
                                <Eye className="w-4 h-4" />
                                <span>View Menu Card</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Uploaded Recipes by this Restaurant */}
                  {restaurantRecipesList.length > 0 && (
                    <div className="p-4 sm:px-7 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <CookingPot className="w-4 h-4 text-[#E8590C]" />
                        <span className="font-bold text-stone-700">Signature Recipes Uploaded by this Restaurant:</span>
                      </div>
                      <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0">
                        {restaurantRecipesList.map(rec => (
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
              <Building2 className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-serif-title text-xl font-bold text-stone-800">No Venues Matching Filters</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Try selecting a different city or clearing dietary filters. Are you managing a hotel, restaurant or dhaba? Register your venue now!
              </p>
              <button
                onClick={() => {
                  setSelectedCity('All');
                  setRestaurantTypeFilter('All');
                  setDietaryFilter('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RESTAURANT SIGNATURE RECIPES ONLY */}
      {activeTab === 'recipes' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <CookingPot className="w-4 h-4 text-[#E8590C] shrink-0" />
              <span>
                These dishes are uploaded directly by master chefs and culinary directors of top hotels &amp; dhabas. Click any recipe to view authentic spice secrets and restaurant dining details.
              </span>
            </div>
            <button
              onClick={() => {
                setActiveUploadBusinessType('hotel_restaurant');
                setCurrentView('share-recipe');
              }}
              className="px-3 py-1.5 bg-[#E8590C] text-white rounded-lg font-bold shrink-0 text-xs hover:bg-[#D9480F] cursor-pointer"
            >
              + Upload Restaurant Recipe
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {restaurantRecipes.map((recipe) => (
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
                      <Building2 className="w-3 h-3" />
                      <span>Chef's Special</span>
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

                    {/* Restaurant Business Stamp */}
                    {recipe.restaurantDetails && (
                      <div className="bg-amber-50/70 p-2 rounded-xl border border-amber-200/80 text-[11px] text-stone-700 space-y-0.5">
                        <div className="font-bold text-amber-900 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{recipe.restaurantDetails.restaurantName}</span>
                        </div>
                        <div className="text-stone-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          <span>{recipe.restaurantDetails.city} · Ph: {recipe.restaurantDetails.contactNumber}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 mt-2">
                  <span>{recipe.prepTime + recipe.cookTime} mins total</span>
                  <span className="font-bold text-[#E8590C]">View Recipe &amp; Reserve Table →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUICK TABLE BOOKING MODAL */}
      {bookingRestaurant && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-700 tracking-wider">Table Reservation</span>
                <h3 className="font-serif-title text-lg font-black text-[#2B1B17]">{bookingRestaurant.businessName}</h3>
              </div>
              <button 
                onClick={() => setBookingRestaurant(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendBookingModal} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Guest Full Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Reservation Date</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={e => setBookingDate(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Party Size / Guests</label>
                  <select
                    value={guestCount}
                    onChange={e => setGuestCount(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="1">1 Person</option>
                    <option value="2">2 Persons (Couple)</option>
                    <option value="4">4 Persons (Family)</option>
                    <option value="6">6 Persons</option>
                    <option value="8">8 Persons</option>
                    <option value="10+">10+ Persons (Large Group)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Preferred Time Slot</label>
                <select
                  value={bookingTime}
                  onChange={e => setBookingTime(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                >
                  <option value="12:30 PM (Lunch)">12:30 PM (Lunch)</option>
                  <option value="01:30 PM (Lunch)">01:30 PM (Lunch)</option>
                  <option value="02:30 PM (Late Lunch)">02:30 PM (Late Lunch)</option>
                  <option value="07:30 PM (Dinner)">07:30 PM (Dinner)</option>
                  <option value="08:30 PM (Dinner)">08:30 PM (Dinner)</option>
                  <option value="09:30 PM (Late Dinner)">09:30 PM (Late Dinner)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Special Preferences / Seating (Optional)</label>
                <textarea
                  value={specialRequests}
                  onChange={e => setSpecialRequests(e.target.value)}
                  rows={2}
                  placeholder="e.g. Window table, birthday celebration, high chair needed..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl text-stone-700 text-[11px] space-y-1">
                <div><strong>Address:</strong> {bookingRestaurant.address}, {bookingRestaurant.city}</div>
                <div><strong>Timings:</strong> {bookingRestaurant.timings}</div>
                <div><strong>Direct Contact:</strong> {bookingRestaurant.phone}</div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                <span>Confirm &amp; Send Reservation Request</span>
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
                  title="Venue Tour"
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
