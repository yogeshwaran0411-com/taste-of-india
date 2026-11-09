import React from 'react';
import { useApp } from '../context/AppContext';
import { RecipeCard } from './RecipeCard';
import { TopFoodCreatorsSection } from './TopFoodCreatorsSection';
import { INDIAN_STATES_AND_UTS } from '../data/states';
import { FOOD_CATEGORIES } from '../data/categories';
import { 
  Sparkles, 
  Crown, 
  Leaf, 
  Flame, 
  HeartPulse, 
  Clock, 
  MapPin, 
  ArrowRight, 
  ChefHat,
  CalendarDays,
  IndianRupee,
  Users,
  Store,
  Home,
  Phone,
  UtensilsCrossed,
  CheckCircle2,
  Map,
  Plus,
  Compass,
  MessageCircle,
  Building2
} from 'lucide-react';

export const HomeSections: React.FC = () => {
  const { 
    recipes, 
    setCurrentView, 
    setSelectedState, 
    setSelectedCategory, 
    setIsPremiumModalOpen,
    setSelectedRecipe,
    caterers,
    homemadeBusinesses,
    hotelsAndRestaurants,
    openCreateBusinessAccount,
    showToast
  } = useApp();

  // Region filter for the 36 Territories slot
  const [selectedRegionFilter, setSelectedRegionFilter] = React.useState<string>('All');

  // Curated Slices
  const todaysSpecial = recipes.find(r => r.isSpecialToday) || recipes[0];
  const mostPopular = [...recipes].sort((a, b) => b.likes - a.likes).slice(0, 4);
  const trending = [...recipes].filter(r => r.rating >= 4.8).slice(0, 4);
  const traditional = recipes.filter(r => r.category.includes('Traditional') || r.category.includes('Dal') || r.category.includes('Biryani')).slice(0, 4);
  const healthy = recipes.filter(r => r.category.includes('Healthy') || r.dietary === 'Vegan' || r.nutrition.calories < 300).slice(0, 4);
  const vegetarian = recipes.filter(r => r.dietary === 'Vegetarian').slice(0, 4);
  const nonVegetarian = recipes.filter(r => r.dietary === 'Non-Vegetarian').slice(0, 4);
  const peoplesUploaded = recipes.filter(r => 
    r.id.startsWith('recipe-custom-') || 
    r.isUserUploaded || 
    r.tags?.some(t => t.toLowerCase().includes('community') || t.toLowerCase().includes('people')) ||
    r.creator?.recipesCount === undefined || r.creator?.recipesCount < 20
  ).slice(0, 4);

  // Top featured caterers, homemade businesses & hotels/restaurants
  const topCaterers = (caterers || []).slice(0, 3);
  const topHomemade = (homemadeBusinesses || []).slice(0, 3);
  const topHotelsAndRestaurants = (hotelsAndRestaurants || []).slice(0, 3);

  // Filter 36 Territories by Region
  const filteredTerritories = INDIAN_STATES_AND_UTS.filter(item => {
    if (selectedRegionFilter === 'All') return true;
    if (selectedRegionFilter === 'Union Territory') return item.type === 'ut';
    return item.region === selectedRegionFilter && item.type !== 'ut';
  });

  return (
    <div className="space-y-16 py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* ============================================================== */}
      {/* HOMEPAGE TOP SLOT 1: CATERING CREATORS (VEG & NON-VEG)        */}
      {/* ============================================================== */}
      <section className="bg-gradient-to-br from-amber-50/80 via-white to-orange-50/60 rounded-3xl border-2 border-amber-300 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-200/70 pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#E8590C] text-white shadow-xs">
                <Store className="w-3.5 h-3.5" />
                <span>OFFICIAL CATERING CREATOR SLOT</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse"></span>
                <span>Pure Veg &amp; Non-Veg Options</span>
              </span>
            </div>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-black text-[#2B1B17]">
              Verified Event Caterers &amp; Grand Feasts
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
              Connect directly with verified Indian wedding, party &amp; event caterers. Browse bulk recipes, per-plate packages, kitchen addresses &amp; contact numbers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => openCreateBusinessAccount('catering')}
              className="px-4 py-2.5 bg-[#2B1B17] hover:bg-black text-amber-300 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Register Catering &amp; Logo</span>
            </button>
            <button
              onClick={() => { setCurrentView('catering'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="px-4 py-2.5 bg-[#E8590C] hover:bg-[#D9480F] text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <span>View All Caterers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Featured Caterers Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {topCaterers.map((caterer) => (
            <div 
              key={caterer.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md hover:border-[#E8590C]/50 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3.5">
                  <div className="relative shrink-0">
                    <img 
                      src={caterer.logo || caterer.avatar} 
                      alt={caterer.businessName} 
                      className="w-16 h-16 rounded-xl object-cover ring-2 ring-amber-500/30 bg-amber-50"
                    />
                    {caterer.logo && (
                      <span className="absolute -bottom-1 -right-1 bg-amber-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase border border-white">
                        Logo
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-serif-title font-black text-lg text-[#2B1B17] leading-snug">
                        {caterer.businessName}
                      </h3>
                      {caterer.verified && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </div>
                    {/* Dietary Type Badge: Pure Veg vs Non Veg vs Both */}
                    {caterer.dietaryType === 'Pure Veg' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse"></span>
                        <span>Pure Veg Only</span>
                      </span>
                    )}
                    {caterer.dietaryType === 'Non-Veg' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-50 text-rose-800 border border-rose-300">
                        <span className="w-2 h-2 rounded-full bg-rose-600 inline-block"></span>
                        <span>Non-Veg Feasts</span>
                      </span>
                    )}
                    {(!caterer.dietaryType || caterer.dietaryType === 'Both Veg & Non-Veg') && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-50 text-amber-900 border border-amber-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 inline-block"></span>
                        <span>Both Veg &amp; Non-Veg</span>
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
                  {caterer.speciality}
                </p>

                {/* Address & Contact Slot */}
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-stone-700 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#E8590C] shrink-0" />
                    <span className="truncate">{caterer.address}, {caterer.city}</span>
                  </div>
                  <div className="flex items-center justify-between text-stone-600 pt-0.5">
                    <span className="font-bold text-stone-900">Ph: {caterer.phone}</span>
                    <span className="text-[#E8590C] font-black text-sm">{caterer.pricePerPlateRange}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`tel:${caterer.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex-1 py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs sm:text-sm font-bold text-center transition-colors flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call</span>
                </a>
                <button
                  onClick={() => { setCurrentView('catering'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="flex-1 py-2.5 px-3 bg-[#E8590C] hover:bg-[#D9480F] text-white rounded-xl text-xs sm:text-sm font-bold text-center transition-colors shadow-2xs cursor-pointer"
                >
                  View Packages
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* HOMEPAGE TOP SLOT 2: HOMEMADE FOOD CREATORS (GHAR KA KHANA)   */}
      {/* ============================================================== */}
      <section className="bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50 rounded-3xl border-2 border-emerald-300 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-200/70 pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-700 text-white shadow-xs">
                <Home className="w-3.5 h-3.5" />
                <span>OFFICIAL HOMEMADE CREATOR SLOT</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-white px-2.5 py-0.5 rounded-full border border-emerald-300">
                <ChefHat className="w-3 h-3 text-emerald-600" />
                <span>Ghar Ka Swad &amp; Daily Tiffins</span>
              </span>
            </div>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-black text-[#2B1B17]">
              Homemade Food Businesses &amp; Home Kitchens
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
              Authentic daily tiffin services, regional home bakes &amp; generational family recipes straight from certified home kitchens.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => openCreateBusinessAccount('homemade')}
              className="px-4 py-2.5 bg-[#2B1B17] hover:bg-black text-emerald-300 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Register Home Kitchen &amp; Logo</span>
            </button>
            <button
              onClick={() => { setCurrentView('homemade'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <span>Explore Homemade Slot</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Featured Homemade Kitchens Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {topHomemade.map((kitchen) => (
            <div 
              key={kitchen.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3.5">
                  <div className="relative shrink-0">
                    <img 
                      src={kitchen.logo || kitchen.avatar} 
                      alt={kitchen.businessName} 
                      className="w-16 h-16 rounded-xl object-cover ring-2 ring-emerald-500/30 bg-emerald-50"
                    />
                    {kitchen.logo && (
                      <span className="absolute -bottom-1 -right-1 bg-emerald-700 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase border border-white">
                        Logo
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-serif-title font-black text-lg text-[#2B1B17] leading-snug">
                        {kitchen.businessName}
                      </h3>
                      {kitchen.verified && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </div>
                    <span className="inline-block text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      Home Chef: {kitchen.chefName}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
                  {kitchen.speciality}
                </p>

                {/* Address & Contact Slot */}
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-stone-700 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{kitchen.address}, {kitchen.city}</span>
                  </div>
                  <div className="flex items-center justify-between text-stone-600 pt-0.5">
                    <span className="font-bold text-stone-900">Ph: {kitchen.phone}</span>
                    <span className="text-emerald-700 font-bold">{kitchen.serviceType}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`tel:${kitchen.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex-1 py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs sm:text-sm font-bold text-center transition-colors flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call</span>
                </a>
                <button
                  onClick={() => { setCurrentView('homemade'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="flex-1 py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold text-center transition-colors shadow-2xs cursor-pointer"
                >
                  Order Tiffin
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* HOMEPAGE TOP SLOT 3: HOTEL, RESTAURANT & DHABA CREATORS        */}
      {/* ============================================================== */}
      <section className="bg-gradient-to-br from-amber-50/70 via-white to-stone-100/60 rounded-3xl border-2 border-amber-300 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-200/70 pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#2B1B17] text-amber-300 shadow-xs">
                <Building2 className="w-3.5 h-3.5" />
                <span>OFFICIAL HOTEL &amp; RESTAURANT CREATOR SLOT</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                <Store className="w-3 h-3 text-amber-700" />
                <span>Fine Dine, Heritage Havelis &amp; Grand Dhabas</span>
              </span>
            </div>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-black text-[#2B1B17]">
              Iconic Hotels, Heritage Havelis &amp; Grand Dhabas
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
              Discover India's most celebrated dining institutions, menu cards, video walkthroughs &amp; chef signature recipes. Direct table reservations with zero fees.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => openCreateBusinessAccount('hotel_restaurant')}
              className="px-4 py-2.5 bg-[#2B1B17] hover:bg-black text-amber-300 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Register Hotel / Restaurant &amp; Logo</span>
            </button>
            <button
              onClick={() => { setCurrentView('hotel-restaurant'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="px-4 py-2.5 bg-[#E8590C] hover:bg-[#D9480F] text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <span>Explore All Hotels &amp; Dhabas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Featured Hotels & Restaurants Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {topHotelsAndRestaurants.map((venue) => (
            <div 
              key={venue.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3.5">
                  <div className="relative shrink-0">
                    <img 
                      src={venue.logo || venue.avatar} 
                      alt={venue.businessName} 
                      className="w-16 h-16 rounded-xl object-cover ring-2 ring-amber-500/30 bg-amber-50"
                    />
                    {venue.logo && (
                      <span className="absolute -bottom-1 -right-1 bg-amber-700 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase border border-white">
                        Logo
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-serif-title font-black text-lg text-[#2B1B17] leading-snug">
                        {venue.businessName}
                      </h3>
                      {venue.verified && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="inline-block text-xs font-bold text-stone-700 bg-stone-100 px-2.5 py-0.5 rounded-md border border-stone-200">
                        {venue.restaurantType}
                      </span>
                      {venue.dietaryType === 'Pure Veg' ? (
                        <span className="inline-block text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          🟢 Pure Veg
                        </span>
                      ) : venue.dietaryType === 'Non-Veg' ? (
                        <span className="inline-block text-xs font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                          🔴 Non-Veg
                        </span>
                      ) : (
                        <span className="inline-block text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          🟢🔴 Veg &amp; Non-Veg
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-stone-700 space-y-0.5">
                  <div className="font-bold text-stone-900">Chef / Master: {venue.ownerOrChefName}</div>
                  <div className="text-xs text-stone-600">Specialities: {venue.specialities.slice(0, 2).join(', ')}</div>
                </div>

                <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-100 pt-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#E8590C] shrink-0" />
                    <span className="truncate">{venue.address}, {venue.city}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{venue.timings}</span>
                  </div>
                  <div className="flex items-center justify-between text-stone-800 font-bold pt-1">
                    <span className="text-sm font-black text-amber-900">{venue.averageCostForTwo}</span>
                    <span className="text-amber-800 text-xs font-bold">★ {venue.rating} ({venue.reviewsCount})</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                <a
                  href={`tel:${venue.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex-1 py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs sm:text-sm font-bold text-center transition-colors flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#E8590C]" />
                  <span>Call Venue</span>
                </a>
                <button
                  onClick={() => { setCurrentView('hotel-restaurant'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="flex-1 py-2.5 px-3 bg-[#E8590C] hover:bg-[#D9480F] text-white rounded-xl text-xs sm:text-sm font-bold text-center transition-colors shadow-2xs cursor-pointer"
                >
                  Reserve Table
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* HOMEPAGE TOP SLOT 4: 36 STATES & UNION TERRITORIES RECIPES     */}
      {/* ============================================================== */}
      <section className="bg-gradient-to-br from-[#2B1B17] via-[#381F15] to-[#2B1B17] text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg space-y-6 border border-amber-900/40 relative overflow-hidden">
        {/* Background Decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-700/80 pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-xs">
                <Map className="w-3.5 h-3.5 text-stone-950" />
                <span>36 TERRITORIES RECIPE ARCHIVE</span>
              </span>
              <span className="text-xs font-bold text-amber-300">
                28 States + 8 Union Territories
              </span>
            </div>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-black text-white">
              Explore Bharat's Complete Culinary Heritage
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl">
              From Kashmir's Wazwan to Tamil Nadu's Chettinad feasts, select any of the 36 territories below to discover heirloom regional spices and traditional cooking secrets.
            </p>
          </div>

          <button
            onClick={() => { setCurrentView('states'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 shrink-0 self-start md:self-center"
          >
            <Compass className="w-4 h-4 text-stone-950" />
            <span>Open Interactive Map of Bharat</span>
            <ArrowRight className="w-4 h-4 text-stone-950" />
          </button>
        </div>

        {/* Region Filter Tabs for 36 Territories */}
        <div className="relative z-10 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
          {['All', 'North', 'South', 'West', 'East', 'Central', 'Northeast', 'Union Territory'].map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegionFilter(region)}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedRegionFilter === region
                  ? 'bg-amber-400 text-stone-950 shadow-xs ring-2 ring-amber-300/40'
                  : 'bg-white/10 text-stone-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              {region === 'All' ? 'All 36 Territories' : region === 'Union Territory' ? '8 Union Territories' : `${region} India`}
            </button>
          ))}
        </div>

        {/* Horizontal Scroll / Grid of Territories */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-[380px] overflow-y-auto pr-1">
          {filteredTerritories.map((st) => {
            const stateRecipeCount = recipes.filter(r => r.state.toLowerCase() === st.name.toLowerCase()).length;
            return (
              <button
                key={st.id}
                onClick={() => {
                  setSelectedState(st);
                  setCurrentView('state-detail');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white/10 hover:bg-white/20 active:scale-98 border border-white/10 hover:border-amber-400/50 p-3 rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-amber-300 font-bold mb-1">
                    <span>{st.type === 'ut' ? 'UT' : st.region}</span>
                    <span className="bg-black/40 px-1.5 py-0.2 rounded-full text-stone-300">
                      {stateRecipeCount} dishes
                    </span>
                  </div>
                  <h4 className="font-serif-title font-bold text-sm text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                    {st.name}
                  </h4>
                  <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                    {st.famousDishes?.[0] || 'Regional Delicacies'}
                  </p>
                </div>
                <div className="pt-2 text-[10px] text-amber-400 font-bold flex items-center justify-between">
                  <span>Explore</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 1. Today's Special Recipe (Featured Spotlight)                 */}
      {/* ============================================================== */}
      <section className="bg-white rounded-3xl border border-[#E8DFC8] p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 relative aspect-4/3 rounded-2xl overflow-hidden shadow-md">
            <img
              src={todaysSpecial.image}
              alt={todaysSpecial.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-[#E8590C] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-xs">
              Today's Special
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#E8590C]">
              <span>{todaysSpecial.state}</span>
              <span className="text-stone-300">·</span>
              <span>{todaysSpecial.category}</span>
              <span className="text-stone-300">·</span>
              <span className="text-stone-500">{todaysSpecial.difficulty}</span>
            </div>

            <h2 className="font-serif-title text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2B1B17]">
              {todaysSpecial.title}
            </h2>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl">
              {todaysSpecial.description}
            </p>

            {/* Quick Metrics */}
            <div className="flex items-center gap-6 text-xs text-stone-600 pt-1">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Total Time</span>
                <span className="font-bold text-stone-900 tabular-nums">{todaysSpecial.totalTime} mins</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Servings</span>
                <span className="font-bold text-stone-900 tabular-nums">{todaysSpecial.servings} people</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Rating</span>
                <span className="font-bold text-amber-600 tabular-nums">★ {todaysSpecial.rating.toFixed(1)} / 5.0</span>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedRecipe(todaysSpecial)}
                className="px-6 py-2.5 bg-[#E8590C] hover:bg-[#D9480F] active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
              >
                Cook Today's Special
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Interactive Tool Cards (Pantry, Budget, Meal Planner) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tool 1 */}
        <div
          onClick={() => setCurrentView('kitchen-finder')}
          className="group cursor-pointer bg-gradient-to-br from-amber-50 to-orange-100/60 rounded-2xl p-6 border border-amber-200/80 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#E8590C] text-white flex items-center justify-center shadow-xs">
              <ChefHat className="w-5 h-5" />
            </div>
            <h3 className="font-serif-title font-bold text-lg text-[#2B1B17]">
              What's In My Kitchen?
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Enter ingredients in your pantry and find out which authentic Indian recipes you can cook right now.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#E8590C] group-hover:translate-x-1 transition-transform">
            <span>Match My Ingredients</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Tool 2 */}
        <div
          onClick={() => setCurrentView('budget')}
          className="group cursor-pointer bg-gradient-to-br from-emerald-50 to-teal-100/60 rounded-2xl p-6 border border-emerald-200/80 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <IndianRupee className="w-5 h-5" />
            </div>
            <h3 className="font-serif-title font-bold text-lg text-[#2B1B17]">
              Budget Cooking
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Feast on mouthwatering recipes calculated under ₹50, ₹100, ₹150, and ₹200 per plate.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 group-hover:translate-x-1 transition-transform">
            <span>Explore Budget Dishes</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Tool 3 */}
        <div
          onClick={() => setCurrentView('meal-planner')}
          className="group cursor-pointer bg-gradient-to-br from-sky-50 to-indigo-100/60 rounded-2xl p-6 border border-sky-200/80 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-sky-700 text-white flex items-center justify-center shadow-xs">
              <CalendarDays className="w-5 h-5" />
            </div>
            <h3 className="font-serif-title font-bold text-lg text-[#2B1B17]">
              30-Day Meal Planner
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Balanced breakfast, lunch, and dinner suggestions planned across all 30 days of the month.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800 group-hover:translate-x-1 transition-transform">
            <span>View 30-Day Schedule</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

      </section>

      {/* 2. Most Popular Recipes */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif-title text-2xl font-black text-[#2B1B17]">
              Most Popular Recipes
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">Loved and highest rated by our home cook community</p>
          </div>
          <button
            onClick={() => setCurrentView('explore')}
            className="text-xs font-bold text-[#E8590C] hover:underline flex items-center gap-1"
          >
            <span>See all recipes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mostPopular.map(r => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      </section>

      {/* 3. Explore Recipes by State (Visual Carousel Strip) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif-title text-2xl font-black text-[#2B1B17]">
              Explore Recipes by State & UT
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">Authentic micro-cuisines across all 36 territories</p>
          </div>
          <button
            onClick={() => setCurrentView('states')}
            className="text-xs font-bold text-[#E8590C] hover:underline flex items-center gap-1"
          >
            <span>View all 36</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {INDIAN_STATES_AND_UTS.slice(0, 6).map(st => (
            <div
              key={st.id}
              onClick={() => {
                setSelectedState(st);
                setCurrentView('state-detail');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group cursor-pointer bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-[#E8590C] transition-all"
            >
              <div className="aspect-4/3 overflow-hidden bg-stone-100">
                <img
                  src={st.heroImage}
                  alt={st.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-2.5 text-center">
                <div className="text-xs font-bold text-stone-900 group-hover:text-[#E8590C] transition-colors truncate">
                  {st.name}
                </div>
                <div className="text-[10px] text-stone-400">{st.region} India</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Uploads: Recipes Uploaded by People */}
      <section className="space-y-6 bg-gradient-to-br from-amber-50/70 via-orange-50/50 to-amber-50/70 p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#E8590C] mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Community Kitchen</span>
            </div>
            <h2 className="font-serif-title text-2xl font-black text-[#2B1B17]">
              Recipes Uploaded by People
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Cherished family recipes and traditional cooking secrets shared by home cooks across India
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setCurrentView('share-recipe')}
              className="px-4 py-2 bg-[#E8590C] hover:bg-[#D9480F] text-white text-xs font-bold rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              + Upload Recipe
            </button>
            <button
              onClick={() => setCurrentView('peoples-recipes')}
              className="px-4 py-2 bg-white border border-stone-200 hover:border-[#E8590C] text-stone-700 hover:text-[#E8590C] text-xs font-bold rounded-xl transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <span>See All People's Uploads</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {peoplesUploaded.map(r => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      </section>

      {/* DEDICATED SEPARATE SLOTS: Catering Creators & Homemade Food Businesses */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-black text-[#2B1B17]">
              Catering &amp; Homemade Food Slots
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Verified food service creators with operational addresses, menu details, and direct contact numbers
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Slot 1: Catering Services & Event Menus */}
          <div 
            onClick={() => {
              setCurrentView('catering');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group cursor-pointer bg-gradient-to-br from-purple-50 via-white to-amber-50/40 rounded-3xl p-6 sm:p-7 border-2 border-purple-200 hover:border-purple-500 hover:shadow-lg transition-all space-y-4 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-12 h-12 rounded-2xl bg-purple-700 text-white flex items-center justify-center shadow-md">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                    Separate Catering Slot
                  </span>
                  <h3 className="font-serif-title font-bold text-lg text-purple-950 mt-0.5">
                    Catering Services &amp; Event Menus
                  </h3>
                </div>
              </div>
              <span className="text-xs font-bold text-purple-800 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
                Bulk Orders
              </span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Find verified Indian wedding &amp; event caterers. Browse menu packages (₹350 - ₹750/plate), guest capacity, kitchen addresses, and call/WhatsApp caterers directly.
            </p>

            <div className="pt-2 flex items-center justify-between border-t border-purple-100 text-xs">
              <span className="text-purple-900 font-semibold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-purple-600" />
                <span>Verified Phone &amp; Address Included</span>
              </span>
              <span className="font-bold text-purple-700 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                <span>Open Catering Slot</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Slot 2: Homemade Food Creators & Tiffin Services */}
          <div 
            onClick={() => {
              setCurrentView('homemade');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group cursor-pointer bg-gradient-to-br from-emerald-50 via-white to-amber-50/40 rounded-3xl p-6 sm:p-7 border-2 border-emerald-200 hover:border-emerald-500 hover:shadow-lg transition-all space-y-4 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md">
                  <Home className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Separate Homemade Slot
                  </span>
                  <h3 className="font-serif-title font-bold text-lg text-emerald-950 mt-0.5">
                    Ghar Ka Khana &amp; Home Chefs
                  </h3>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                Daily Tiffins
              </span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Wholesome home-cooked food by passionate local home chefs. View daily tiffin menus (from ₹100/meal), delivery radius, kitchen locations, and order via WhatsApp.
            </p>

            <div className="pt-2 flex items-center justify-between border-t border-emerald-100 text-xs">
              <span className="text-emerald-900 font-semibold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Contact Number &amp; Kitchen Locality</span>
              </span>
              <span className="font-bold text-emerald-700 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                <span>Open Homemade Slot</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif-title text-2xl font-black text-[#2B1B17]">
              Trending This Week
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">Dishes cooks are making right now</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trending.map(r => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      </section>

      {/* 5. Top Food Creators of India (Creator Channel Spotlight) */}
      <TopFoodCreatorsSection />

      {/* 5. Traditional Indian Food & Heritage Spotlight */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif-title text-2xl font-black text-[#2B1B17]">
              Traditional Indian Food
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">Century-old slow cooking, stone-ground masalas, and earthen pots</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {traditional.map(r => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      </section>

      {/* 6. Vegetarian Special vs Non-Vegetarian Special */}
      <section className="space-y-8">
        <div>
          <div className="flex items-center gap-2 text-[#2B8A3E] mb-1">
            <Leaf className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Plant & Dairy Delights</span>
          </div>
          <h2 className="font-serif-title text-2xl font-black text-[#2B1B17]">
            Vegetarian Special
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
            {vegetarian.map(r => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-stone-200">
          <div className="flex items-center gap-2 text-red-600 mb-1">
            <Flame className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Coastal & Royal Slow Braises</span>
          </div>
          <h2 className="font-serif-title text-2xl font-black text-[#2B1B17]">
            Non-Vegetarian Special
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
            {nonVegetarian.map(r => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Premium Membership Collection Callout */}
      <section className="bg-gradient-to-r from-[#2B1B17] via-[#3B2219] to-[#2B1B17] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
        <div className="max-w-xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>TASTE OF INDIA PREMIUM</span>
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl font-extrabold leading-tight">
            Download Authentic Regional Recipe PDFs Anytime, Anywhere.
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Starting at only ₹49/month. Enjoy ad-free browsing, print-ready recipe formats, and master e-books covering all 28 states and 8 union territories.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsPremiumModalOpen(true)}
              className="px-6 py-3 bg-[#E8590C] hover:bg-[#D9480F] active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all"
            >
              View Subscription Plans (from ₹49)
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
