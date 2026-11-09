import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { INDIAN_STATES_AND_UTS } from '../data/states';
import { 
  X, 
  Store, 
  Home, 
  Building2, 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Users, 
  UtensilsCrossed, 
  Clock, 
  ChefHat,
  ShieldCheck,
  Check,
  Video,
  Calendar,
  Plus,
  Trash2,
  CalendarDays,
  FileImage,
  DollarSign,
  LogOut
} from 'lucide-react';

const CATERING_LOGO_PRESETS = [
  { id: 'cat-logo-1', name: 'Royal Golden Degh', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=250&auto=format&fit=crop&q=80' },
  { id: 'cat-logo-2', name: 'Heritage Brass Handi', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=250&auto=format&fit=crop&q=80' },
  { id: 'cat-logo-3', name: 'Master Chef Crown', url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=250&auto=format&fit=crop&q=80' },
  { id: 'cat-logo-4', name: 'Shahi Dawat Feast', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=250&auto=format&fit=crop&q=80' },
  { id: 'cat-logo-5', name: 'Southern Plantain Feast', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=250&auto=format&fit=crop&q=80' }
];

const HOMEMADE_LOGO_PRESETS = [
  { id: 'hm-logo-1', name: 'Maa Ki Rasoi Clay Pot', url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=250&auto=format&fit=crop&q=80' },
  { id: 'hm-logo-2', name: 'Amma’s Comfort Kitchen', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=250&auto=format&fit=crop&q=80' },
  { id: 'hm-logo-3', name: 'Pure Sattvic Kadai', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=250&auto=format&fit=crop&q=80' },
  { id: 'hm-logo-4', name: 'Homestyle Dabba Box', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=250&auto=format&fit=crop&q=80' },
  { id: 'hm-logo-5', name: 'Grandma’s Spice Stone', url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=250&auto=format&fit=crop&q=80' }
];

const HOTEL_RESTAURANT_LOGO_PRESETS = [
  { id: 'rest-logo-1', name: 'Grand Bukhara Crown', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=250&auto=format&fit=crop&q=80' },
  { id: 'rest-logo-2', name: 'Heritage Haveli Emblem', url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=250&auto=format&fit=crop&q=80' },
  { id: 'rest-logo-3', name: 'Royal Dhaba Tandoor', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=250&auto=format&fit=crop&q=80' },
  { id: 'rest-logo-4', name: 'Pure Sattvic Dining', url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=250&auto=format&fit=crop&q=80' }
];

export const CreateBusinessAccountModal: React.FC = () => {
  const { 
    isCreateBusinessModalOpen, 
    setIsCreateBusinessModalOpen, 
    businessModalType, 
    setBusinessModalType,
    editingBusinessProfile,
    setEditingBusinessProfile,
    currentUser,
    addCateringProfile,
    updateCateringProfile,
    addHomemadeProfile,
    updateHomemadeProfile,
    addHotelRestaurantProfile,
    updateHotelRestaurantProfile,
    setActiveUploadBusinessType,
    setPrefilledBusinessData,
    setCurrentView,
    showToast 
  } = useApp();

  const isEditing = Boolean(editingBusinessProfile);
  const mode = businessModalType || 'catering';

  // Step 1: Form, Step 2: Next Recipe Upload Prompt
  const [createdAccountResult, setCreatedAccountResult] = useState<{
    id: string;
    businessName: string;
    logo: string;
    phone: string;
    address: string;
    city: string;
    price: number;
    menuTitle: string;
    type: 'catering' | 'homemade' | 'hotel_restaurant';
    dietaryType?: 'Pure Veg' | 'Non-Veg' | 'Both Veg & Non-Veg';
  } | null>(null);

  // Logo state
  const [logoSource, setLogoSource] = useState<'preset' | 'device' | 'url'>('preset');
  const [logoUrl, setLogoUrl] = useState<string>(CATERING_LOGO_PRESETS[0].url);
  const [logoFileName, setLogoFileName] = useState<string>('');
  const [customLogoUrl, setCustomLogoUrl] = useState<string>('');
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // Catering fields & Veg/Non-Veg option
  const [cateringDietary, setCateringDietary] = useState<'Pure Veg' | 'Non-Veg' | 'Both Veg & Non-Veg'>('Both Veg & Non-Veg');
  const [cateringName, setCateringName] = useState('Sri Krishna Grand Catering Services');
  const [cateringOwner, setCateringOwner] = useState(currentUser?.name || 'Chef R. Sundaram');
  const [cateringPhone, setCateringPhone] = useState('+91 98401 22334');
  const [cateringWhatsapp, setCateringWhatsapp] = useState('+91 98401 22334');
  const [cateringAddress, setCateringAddress] = useState('14, Cathedral Road, Gopalapuram');
  const [cateringCity, setCateringCity] = useState('Chennai');
  const [cateringState, setCateringState] = useState('Tamil Nadu');
  const [cateringSpeciality, setCateringSpeciality] = useState('Traditional Muhurtham Banquets & Grand Buffet Catering');
  const [cateringExperience, setCateringExperience] = useState<number>(15);
  const [cateringCapacity, setCateringCapacity] = useState('100 - 2,500 Guests');
  const [cateringPriceRange, setCateringPriceRange] = useState('₹450 - ₹850 / Plate');
  const [cateringMenuTitle, setCateringMenuTitle] = useState('Grand Royal Wedding Feast (28 Items)');
  const [cateringPricePerPlate, setCateringPricePerPlate] = useState<number>(499);
  const [cateringMinGuests, setCateringMinGuests] = useState<number>(100);
  const [cateringMenuHighlights, setCateringMenuHighlights] = useState('Welcome Rose Drink, Mysore Pak, Medu Vada, Bisibelebath, Curd Rice, Palada Payasam');
  
  // NEW Catering Features: Menu Images, Video Showcase, Busy / Already Booked Schedule
  const [cateringMenuImages, setCateringMenuImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80'
  ]);
  const [newMenuImageUrl, setNewMenuImageUrl] = useState('');
  const [cateringVideoUrl, setCateringVideoUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [cateringBookedDates, setCateringBookedDates] = useState<string[]>([
    '2026-11-15',
    '2026-11-22',
    '2026-12-05'
  ]);
  const [newBookedDate, setNewBookedDate] = useState('');

  // Homemade food fields
  const [homemadeKitchenName, setHomemadeKitchenName] = useState('Maa Ki Rasoi Homemade Tiffins');
  const [homemadeChefName, setHomemadeChefName] = useState(currentUser?.name || 'Chef Rekha Sharma');
  const [homemadePhone, setHomemadePhone] = useState('+91 98112 34567');
  const [homemadeWhatsapp, setHomemadeWhatsapp] = useState('+91 98112 34567');
  const [homemadeAddress, setHomemadeAddress] = useState('Flat 402, Green Glen Towers, Bellandur');
  const [homemadeLocality, setHomemadeLocality] = useState('Bellandur, Outer Ring Road & HSR');
  const [homemadeCity, setHomemadeCity] = useState('Bengaluru');
  const [homemadeState, setHomemadeState] = useState('Karnataka');
  const [homemadeSpeciality, setHomemadeSpeciality] = useState('Ghar Jaisa Khana, Soft Phulkas, Panchmel Dal & Paneer Sabzi');
  const [homemadeServiceType, setHomemadeServiceType] = useState<'Daily Tiffin Service' | 'Home Kitchen Pre-orders' | 'Homemade Sweets & Pickles' | 'Regional Bakery & Snacks'>('Daily Tiffin Service');
  const [homemadeDietary, setHomemadeDietary] = useState<'100% Pure Veg' | 'Pure Veg & Jain' | 'Veg & Non-Veg' | 'Halal Certified'>('100% Pure Veg');
  const [homemadeDeliveryRadius, setHomemadeDeliveryRadius] = useState('Within 5 km radius');
  const [homemadeTiffinPrice, setHomemadeTiffinPrice] = useState<number>(120);
  const [homemadeTimings, setHomemadeTimings] = useState('Lunch: 12:00 PM - 2:00 PM | Dinner: 7:30 PM - 9:30 PM');

  // Hotel & Restaurant fields (NEW!)
  const [restaurantName, setRestaurantName] = useState('Grand Haveli Royal Dining & Heritage Hotel');
  const [restaurantOwner, setRestaurantOwner] = useState(currentUser?.name || 'Chef Vikram Rathore');
  const [restaurantType, setRestaurantType] = useState<'Fine Dine Restaurant' | 'Heritage Haveli & Palace' | 'Highway Dhaba' | 'Family Dining & Thali' | 'Boutique Hotel & Cafe' | 'Traditional Sweet & Chaat House'>('Fine Dine Restaurant');
  const [restaurantDietary, setRestaurantDietary] = useState<'Pure Veg' | 'Non-Veg' | 'Both Veg & Non-Veg'>('Both Veg & Non-Veg');
  const [restaurantPhone, setRestaurantPhone] = useState('+91 98401 22334');
  const [restaurantWhatsapp, setRestaurantWhatsapp] = useState('+91 98401 22334');
  const [restaurantAddress, setRestaurantAddress] = useState('Palace Road, Heritage Fort Enclave');
  const [restaurantCity, setRestaurantCity] = useState('Jaipur');
  const [restaurantState, setRestaurantState] = useState('Rajasthan');
  const [restaurantTimings, setRestaurantTimings] = useState('12:00 PM - 11:30 PM (All Day)');
  const [restaurantCapacity, setRestaurantCapacity] = useState('160 Seats');
  const [restaurantAvgCost, setRestaurantAvgCost] = useState('₹1,400 for two');
  const [restaurantSpecialities, setRestaurantSpecialities] = useState('Laal Maas, Shahi Dal Bukhara, Ker Sangri, Jalebi Rabri');
  const [restaurantMenuImages, setRestaurantMenuImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop&q=80'
  ]);
  const [newRestMenuImageUrl, setNewRestMenuImageUrl] = useState('');
  const [restaurantVideoUrl, setRestaurantVideoUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [restaurantTableBooking, setRestaurantTableBooking] = useState(true);

  // Sync state if editing an existing profile
  useEffect(() => {
    if (editingBusinessProfile) {
      const p = editingBusinessProfile.profile;
      if (editingBusinessProfile.type === 'catering') {
        setCateringName(p.businessName || '');
        setCateringOwner(p.ownerName || '');
        setCateringPhone(p.phone || '');
        setCateringWhatsapp(p.whatsappNumber || p.phone || '');
        setCateringAddress(p.address || '');
        setCateringCity(p.city || '');
        setCateringState(p.state || 'Tamil Nadu');
        setCateringSpeciality(p.speciality || '');
        setCateringExperience(p.experienceYears || 10);
        setCateringCapacity(p.capacityRange || '100 - 2,500 Guests');
        setCateringPriceRange(p.pricePerPlateRange || '₹450 - ₹850 / Plate');
        setCateringDietary(p.dietaryType || 'Both Veg & Non-Veg');
        setLogoUrl(p.logo || p.avatar || CATERING_LOGO_PRESETS[0].url);
        if (p.menuImages) setCateringMenuImages(p.menuImages);
        if (p.videoUrl) setCateringVideoUrl(p.videoUrl);
        if (p.bookedDates) setCateringBookedDates(p.bookedDates);
      } else if (editingBusinessProfile.type === 'homemade') {
        setHomemadeKitchenName(p.businessName || '');
        setHomemadeChefName(p.chefName || '');
        setHomemadePhone(p.phone || '');
        setHomemadeWhatsapp(p.whatsappNumber || p.phone || '');
        setHomemadeAddress(p.address || '');
        setHomemadeCity(p.city || '');
        setHomemadeState(p.state || 'Karnataka');
        setHomemadeSpeciality(p.speciality || '');
        setHomemadeServiceType(p.serviceType || 'Daily Tiffin Service');
        setHomemadeDietary(p.dietaryType || '100% Pure Veg');
        setHomemadeTimings(p.operatingHours || '');
        setLogoUrl(p.logo || p.avatar || HOMEMADE_LOGO_PRESETS[0].url);
      } else if (editingBusinessProfile.type === 'hotel_restaurant') {
        setRestaurantName(p.businessName || '');
        setRestaurantOwner(p.ownerOrChefName || '');
        setRestaurantPhone(p.phone || '');
        setRestaurantWhatsapp(p.whatsappNumber || p.phone || '');
        setRestaurantAddress(p.address || '');
        setRestaurantCity(p.city || '');
        setRestaurantState(p.state || 'Rajasthan');
        setRestaurantType(p.restaurantType || 'Fine Dine Restaurant');
        setRestaurantDietary(p.dietaryType || 'Both Veg & Non-Veg');
        setRestaurantTimings(p.timings || '');
        setRestaurantCapacity(p.seatingCapacity || '160 Seats');
        setRestaurantAvgCost(p.averageCostForTwo || '₹1,400 for two');
        if (p.specialities) setRestaurantSpecialities(p.specialities.join(', '));
        setLogoUrl(p.logo || p.avatar || HOTEL_RESTAURANT_LOGO_PRESETS[0].url);
        if (p.menuImages) setRestaurantMenuImages(p.menuImages);
        if (p.videoUrl) setRestaurantVideoUrl(p.videoUrl);
        setRestaurantTableBooking(p.tableBookingAvailable !== undefined ? p.tableBookingAvailable : true);
      }
    }
  }, [editingBusinessProfile]);

  if (!isCreateBusinessModalOpen) return null;

  // Handle Logo Upload from local device file
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Logo file size must be under 5MB.');
      return;
    }

    setIsUploadingLogo(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setLogoUrl(result);
        setLogoSource('device');
        setLogoFileName(file.name);
        showToast('Logo uploaded from device successfully!');
      }
      setIsUploadingLogo(false);
    };
    reader.onerror = () => {
      showToast('Error reading logo file.');
      setIsUploadingLogo(false);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = () => {
    if (!customLogoUrl.trim()) return;
    setLogoUrl(customLogoUrl.trim());
    setLogoSource('url');
    showToast('Custom logo URL applied!');
  };

  // Add Menu Image for Caterer
  const handleAddCateringMenuImage = () => {
    if (!newMenuImageUrl.trim()) return;
    setCateringMenuImages(prev => [...prev, newMenuImageUrl.trim()]);
    setNewMenuImageUrl('');
    showToast('Menu photo added to catering showcase!');
  };

  // Remove Menu Image
  const handleRemoveCateringMenuImage = (index: number) => {
    setCateringMenuImages(prev => prev.filter((_, i) => i !== index));
    showToast('Menu image removed.');
  };

  // Add Booked / Busy Date
  const handleAddBookedDate = () => {
    if (!newBookedDate) {
      showToast('Please select a date to mark as Already Booked / Busy.');
      return;
    }
    if (cateringBookedDates.includes(newBookedDate)) {
      showToast('Date is already marked as booked.');
      return;
    }
    setCateringBookedDates(prev => [...prev, newBookedDate].sort());
    setNewBookedDate('');
    showToast('Date scheduled as ALREADY BOOKED (Busy)!');
  };

  const handleRemoveBookedDate = (dateToRemove: string) => {
    setCateringBookedDates(prev => prev.filter(d => d !== dateToRemove));
    showToast(`Date ${dateToRemove} is now Available.`);
  };

  // Add Menu Image for Hotel & Restaurant
  const handleAddRestMenuImage = () => {
    if (!newRestMenuImageUrl.trim()) return;
    setRestaurantMenuImages(prev => [...prev, newRestMenuImageUrl.trim()]);
    setNewRestMenuImageUrl('');
    showToast('Menu card photo added to restaurant profile!');
  };

  // Submit Account Creation / Update
  const handleCreateOrUpdateAccount = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'catering') {
      if (!cateringName.trim() || !cateringPhone.trim() || !cateringAddress.trim()) {
        showToast('Please fill Catering Business Name, Phone Number, and Address.');
        return;
      }

      if (isEditing && editingBusinessProfile?.profile?.id) {
        updateCateringProfile(editingBusinessProfile.profile.id, {
          businessName: cateringName.trim(),
          logo: logoUrl,
          avatar: logoUrl,
          ownerName: cateringOwner.trim(),
          phone: cateringPhone.trim(),
          whatsappNumber: cateringWhatsapp.trim() || cateringPhone.trim(),
          address: cateringAddress.trim(),
          city: cateringCity.trim(),
          state: cateringState,
          speciality: cateringSpeciality.trim(),
          experienceYears: Number(cateringExperience) || 10,
          pricePerPlateRange: cateringPriceRange,
          capacityRange: cateringCapacity,
          dietaryType: cateringDietary,
          menuImages: cateringMenuImages,
          videoUrl: cateringVideoUrl.trim() || undefined,
          bookedDates: cateringBookedDates
        });
        setIsCreateBusinessModalOpen(false);
        setEditingBusinessProfile(null);
        return;
      }

      const created = addCateringProfile({
        businessName: cateringName.trim(),
        logo: logoUrl,
        avatar: logoUrl,
        ownerName: cateringOwner.trim(),
        phone: cateringPhone.trim(),
        whatsappNumber: cateringWhatsapp.trim() || cateringPhone.trim(),
        address: cateringAddress.trim(),
        city: cateringCity.trim(),
        state: cateringState,
        speciality: cateringSpeciality.trim(),
        experienceYears: Number(cateringExperience) || 10,
        pricePerPlateRange: cateringPriceRange,
        capacityRange: cateringCapacity,
        dietaryType: cateringDietary,
        menuImages: cateringMenuImages,
        videoUrl: cateringVideoUrl.trim() || undefined,
        bookedDates: cateringBookedDates,
        menuPackages: [
          {
            id: `pkg-${Date.now()}`,
            packageName: cateringMenuTitle.trim() || 'Grand Wedding Feast',
            pricePerPlate: Number(cateringPricePerPlate) || 499,
            minGuests: Number(cateringMinGuests) || 100,
            dietary: cateringDietary === 'Pure Veg' ? 'Vegetarian' : cateringDietary === 'Non-Veg' ? 'Non-Vegetarian' : 'Vegetarian',
            itemsIncluded: cateringMenuHighlights.split(',').map(s => s.trim()).filter(Boolean),
            description: 'Itemized signature catering banquet prepared with traditional techniques.'
          }
        ]
      });

      setCreatedAccountResult({
        id: created.id,
        businessName: created.businessName,
        logo: logoUrl,
        phone: created.phone,
        address: `${created.address}, ${created.city}`,
        city: created.city,
        price: cateringPricePerPlate,
        menuTitle: cateringMenuTitle,
        type: 'catering',
        dietaryType: cateringDietary
      });
    } else if (mode === 'homemade') {
      if (!homemadeKitchenName.trim() || !homemadePhone.trim() || !homemadeAddress.trim()) {
        showToast('Please fill Home Kitchen Name, Phone Number, and Address.');
        return;
      }

      if (isEditing && editingBusinessProfile?.profile?.id) {
        updateHomemadeProfile(editingBusinessProfile.profile.id, {
          businessName: homemadeKitchenName.trim(),
          logo: logoUrl,
          avatar: logoUrl,
          chefName: homemadeChefName.trim(),
          phone: homemadePhone.trim(),
          whatsappNumber: homemadeWhatsapp.trim() || homemadePhone.trim(),
          address: homemadeAddress.trim(),
          city: homemadeCity.trim(),
          state: homemadeState,
          deliveryArea: `${homemadeLocality} (${homemadeDeliveryRadius})`,
          speciality: homemadeSpeciality.trim(),
          serviceType: homemadeServiceType,
          dietaryType: homemadeDietary,
          operatingHours: homemadeTimings
        });
        setIsCreateBusinessModalOpen(false);
        setEditingBusinessProfile(null);
        return;
      }

      const created = addHomemadeProfile({
        businessName: homemadeKitchenName.trim(),
        logo: logoUrl,
        avatar: logoUrl,
        chefName: homemadeChefName.trim(),
        phone: homemadePhone.trim(),
        whatsappNumber: homemadeWhatsapp.trim() || homemadePhone.trim(),
        address: homemadeAddress.trim(),
        city: homemadeCity.trim(),
        state: homemadeState,
        deliveryArea: `${homemadeLocality} (${homemadeDeliveryRadius})`,
        speciality: homemadeSpeciality.trim(),
        serviceType: homemadeServiceType,
        dietaryType: homemadeDietary,
        operatingHours: homemadeTimings,
        menuItems: [
          {
            id: `item-${Date.now()}`,
            dishName: 'Daily Special Homestyle Tiffin',
            price: Number(homemadeTiffinPrice) || 120,
            portionSize: 'Standard Meal Box',
            dietary: homemadeDietary.includes('Veg') ? 'Vegetarian' : 'Non-Vegetarian',
            availability: 'Lunch & Dinner Daily',
            description: `Fresh homestyle tiffin meal with roti, dal, sabzi, rice, and salad.`
          }
        ]
      });

      setCreatedAccountResult({
        id: created.id,
        businessName: created.businessName,
        logo: logoUrl,
        phone: created.phone,
        address: `${created.address}, ${created.city}`,
        city: created.city,
        price: homemadeTiffinPrice,
        menuTitle: 'Daily Special Homestyle Tiffin',
        type: 'homemade'
      });
    } else {
      // Hotel & Restaurant Mode
      if (!restaurantName.trim() || !restaurantPhone.trim() || !restaurantAddress.trim()) {
        showToast('Please fill Restaurant Name, Phone Number, and Address.');
        return;
      }

      if (isEditing && editingBusinessProfile?.profile?.id) {
        updateHotelRestaurantProfile(editingBusinessProfile.profile.id, {
          businessName: restaurantName.trim(),
          logo: logoUrl,
          avatar: logoUrl,
          ownerOrChefName: restaurantOwner.trim(),
          restaurantType,
          dietaryType: restaurantDietary,
          phone: restaurantPhone.trim(),
          whatsappNumber: restaurantWhatsapp.trim() || restaurantPhone.trim(),
          address: restaurantAddress.trim(),
          city: restaurantCity.trim(),
          state: restaurantState,
          timings: restaurantTimings.trim(),
          seatingCapacity: restaurantCapacity,
          averageCostForTwo: restaurantAvgCost,
          specialities: restaurantSpecialities.split(',').map(s => s.trim()).filter(Boolean),
          menuImages: restaurantMenuImages,
          videoUrl: restaurantVideoUrl.trim() || undefined,
          tableBookingAvailable: restaurantTableBooking
        });
        setIsCreateBusinessModalOpen(false);
        setEditingBusinessProfile(null);
        return;
      }

      const created = addHotelRestaurantProfile({
        businessName: restaurantName.trim(),
        logo: logoUrl,
        avatar: logoUrl,
        ownerOrChefName: restaurantOwner.trim(),
        restaurantType,
        dietaryType: restaurantDietary,
        phone: restaurantPhone.trim(),
        whatsappNumber: restaurantWhatsapp.trim() || restaurantPhone.trim(),
        address: restaurantAddress.trim(),
        city: restaurantCity.trim(),
        state: restaurantState,
        timings: restaurantTimings.trim(),
        seatingCapacity: restaurantCapacity,
        averageCostForTwo: restaurantAvgCost,
        specialities: restaurantSpecialities.split(',').map(s => s.trim()).filter(Boolean),
        menuImages: restaurantMenuImages,
        videoUrl: restaurantVideoUrl.trim() || undefined,
        tableBookingAvailable: restaurantTableBooking
      });

      setCreatedAccountResult({
        id: created.id,
        businessName: created.businessName,
        logo: logoUrl,
        phone: created.phone,
        address: `${created.address}, ${created.city}`,
        city: created.city,
        price: 800,
        menuTitle: 'Chef Special Signature Dine Menu',
        type: 'hotel_restaurant',
        dietaryType: restaurantDietary
      });
    }
  };

  // User proceeds to Next: Recipe Uploaded Option
  const handleProceedToRecipeUpload = () => {
    if (!createdAccountResult) return;

    setActiveUploadBusinessType(createdAccountResult.type);
    setPrefilledBusinessData({
      businessName: createdAccountResult.businessName,
      logo: createdAccountResult.logo,
      contactNumber: createdAccountResult.phone,
      whatsappNumber: createdAccountResult.phone,
      address: createdAccountResult.address,
      city: createdAccountResult.city,
      pricePerPlate: createdAccountResult.price,
      tiffinPrice: createdAccountResult.price,
      menuTitle: createdAccountResult.menuTitle,
      type: createdAccountResult.type,
      dietaryType: createdAccountResult.dietaryType
    });

    setIsCreateBusinessModalOpen(false);
    setCurrentView('share-recipe');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Account linked! Now upload recipes under "${createdAccountResult.businessName}".`);
  };

  const handleClose = () => {
    setIsCreateBusinessModalOpen(false);
    setCreatedAccountResult(null);
    setEditingBusinessProfile(null);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-gradient-to-r from-stone-900 via-[#2B1B17] to-stone-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs ${
              mode === 'catering' ? 'bg-[#E8590C]' : mode === 'homemade' ? 'bg-emerald-600' : 'bg-amber-600'
            }`}>
              {mode === 'catering' ? <Store className="w-5 h-5" /> : mode === 'homemade' ? <Home className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
            </div>
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-full ${
                mode === 'catering' ? 'bg-orange-500/30 text-amber-300' : mode === 'homemade' ? 'bg-emerald-500/30 text-emerald-200' : 'bg-amber-500/30 text-amber-200'
              }`}>
                {mode === 'catering' ? 'Catering Creators Portal' : mode === 'homemade' ? 'Homemade Food Portal' : 'Hotel & Restaurant Creators'}
              </span>
              <h2 className="font-serif-title text-base sm:text-lg font-bold">
                {isEditing ? `Edit ${mode === 'catering' ? 'Catering Profile & Calendar' : mode === 'homemade' ? 'Homemade Kitchen' : 'Hotel & Restaurant Profile'}` : `Create ${mode === 'catering' ? 'Catering Account' : mode === 'homemade' ? 'Homemade Account' : 'Hotel & Restaurant Account'}`}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleClose} 
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-white/20"
              title="Exit and Cancel"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-300" />
              <span>Exit {isEditing ? 'Editing' : 'Portal'}</span>
            </button>
            <button 
              onClick={handleClose} 
              className="text-stone-400 hover:text-white p-1 rounded-full transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3 Main Business Creator Tabs */}
        {!isEditing && !createdAccountResult && (
          <div className="grid grid-cols-3 p-2 bg-stone-100 border-b border-stone-200 gap-1.5 shrink-0 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setBusinessModalType('catering');
                setLogoUrl(CATERING_LOGO_PRESETS[0].url);
              }}
              className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mode === 'catering' ? 'bg-[#E8590C] text-white shadow-xs' : 'text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span className="truncate">Event Catering</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setBusinessModalType('homemade');
                setLogoUrl(HOMEMADE_LOGO_PRESETS[0].url);
              }}
              className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mode === 'homemade' ? 'bg-emerald-700 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span className="truncate">Homemade Tiffins</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setBusinessModalType('hotel_restaurant');
                setLogoUrl(HOTEL_RESTAURANT_LOGO_PRESETS[0].url);
              }}
              className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mode === 'hotel_restaurant' ? 'bg-[#2B1B17] text-white shadow-xs' : 'text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span className="truncate">Hotel &amp; Restaurant</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-xs text-stone-700">
          
          {/* STEP 2 CONFIRMATION SCREEN */}
          {createdAccountResult ? (
            <div className="space-y-5 text-center py-4 animate-scaleUp">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
                <Check className="w-9 h-9 stroke-[3]" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Business Account Created &amp; Verified
                </span>
                <h3 className="font-serif-title text-2xl font-black text-[#2B1B17]">
                  {createdAccountResult.businessName}
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Your business profile is now active on Taste of India. Now upload your authentic recipes to showcase under your brand slot!
                </p>
              </div>

              {/* Confirmation Details Card */}
              <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-stone-200 text-left max-w-md mx-auto flex items-center gap-4 shadow-xs">
                <img
                  src={createdAccountResult.logo}
                  alt={createdAccountResult.businessName}
                  className="w-16 h-16 rounded-xl object-cover ring-2 ring-emerald-500/40 bg-white shrink-0"
                />
                <div className="space-y-0.5 text-xs">
                  <div className="font-bold text-stone-900">{createdAccountResult.businessName}</div>
                  <div className="text-stone-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#E8590C]" />
                    <span>{createdAccountResult.address}</span>
                  </div>
                  <div className="text-stone-500 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-600" />
                    <span>{createdAccountResult.phone}</span>
                  </div>
                </div>
              </div>

              {/* Next Step Action Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleProceedToRecipeUpload}
                  className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#E8590C] to-amber-600 hover:from-[#D9480F] hover:to-amber-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Next: Upload Recipe Under Your Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto px-5 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Done, Go to Directory
                </button>
              </div>
            </div>
          ) : (
            /* STEP 1: REGISTRATION / EDIT FORM */
            <form onSubmit={handleCreateOrUpdateAccount} className="space-y-5">
              
              {/* SECTION 1: BUSINESS LOGO OPTION */}
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-stone-900 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-[#E8590C]" />
                    <span>Official Business / Channel Logo (Required)</span>
                  </label>
                  <span className="text-[10px] text-amber-800 font-bold uppercase">Displayed on recipes &amp; slot</span>
                </div>

                {/* Logo Preview Row */}
                <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-stone-200">
                  <div className="relative shrink-0">
                    <img 
                      src={logoUrl} 
                      alt="Selected Logo" 
                      className="w-16 h-16 rounded-xl object-cover ring-2 ring-[#E8590C] bg-white shadow-xs"
                    />
                    <span className="absolute -bottom-1 -right-1 bg-[#E8590C] text-white text-[8px] font-black px-1 rounded-full uppercase">
                      Logo
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-stone-900 text-xs">
                      {logoSource === 'device' ? `Uploaded: ${logoFileName}` : logoSource === 'url' ? 'Custom Logo URL' : 'Curated Brand Logo'}
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Upload your high-res logo from device or select a heritage badge below.
                    </div>
                  </div>
                </div>

                {/* Device Upload Option */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label className="flex items-center justify-center gap-2 p-2.5 bg-white border border-dashed border-stone-300 hover:border-[#E8590C] rounded-xl font-bold text-xs cursor-pointer transition-colors text-stone-700 hover:text-[#E8590C]">
                    <Upload className="w-4 h-4 text-[#E8590C]" />
                    <span>Upload Logo from Device</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleLogoFileUpload} 
                      className="hidden" 
                    />
                  </label>

                  <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-xl p-1 px-2">
                    <input 
                      type="url" 
                      value={customLogoUrl} 
                      onChange={e => setCustomLogoUrl(e.target.value)} 
                      placeholder="Or paste direct image URL..." 
                      className="w-full text-xs bg-transparent focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomUrl}
                      className="px-2.5 py-1 bg-stone-800 hover:bg-black text-white text-[10px] font-bold rounded-lg shrink-0 cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Presets Grid */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-stone-500 uppercase">Or choose from authentic logo presets:</span>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {(mode === 'catering' ? CATERING_LOGO_PRESETS : mode === 'homemade' ? HOMEMADE_LOGO_PRESETS : HOTEL_RESTAURANT_LOGO_PRESETS).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setLogoUrl(p.url);
                          setLogoSource('preset');
                        }}
                        className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                          logoUrl === p.url ? 'border-[#E8590C] bg-amber-100/70 ring-2 ring-orange-300' : 'border-stone-200 hover:bg-white'
                        }`}
                      >
                        <img src={p.url} alt={p.name} className="w-10 h-10 object-cover rounded-lg mx-auto" />
                        <span className="block text-[9px] font-semibold text-stone-700 truncate mt-1">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 2: CATERING BUSINESS FORM WITH MENU IMAGES, VIDEO & BUSY SCHEDULE */}
              {mode === 'catering' && (
                <div className="space-y-4">
                  {/* Dietary Option */}
                  <div>
                    <label className="block text-stone-700 font-bold mb-1.5">
                      Catering Dietary Specialization:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setCateringDietary('Pure Veg')}
                        className={`py-2 px-3 rounded-xl border text-center font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          cateringDietary === 'Pure Veg'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-300 shadow-xs'
                            : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block animate-pulse"></span>
                        <span>🟢 Pure Veg Only</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCateringDietary('Non-Veg')}
                        className={`py-2 px-3 rounded-xl border text-center font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          cateringDietary === 'Non-Veg'
                            ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-300 shadow-xs'
                            : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block"></span>
                        <span>🔴 Non-Veg Feasts</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCateringDietary('Both Veg & Non-Veg')}
                        className={`py-2 px-3 rounded-xl border text-center font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          cateringDietary === 'Both Veg & Non-Veg'
                            ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-300 shadow-xs'
                            : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                        <span className="w-2 h-2 rounded-full bg-rose-600 inline-block"></span>
                        <span>🟢🔴 Both Veg &amp; Non-Veg</span>
                      </button>
                    </div>
                  </div>

                  {/* Name and Owner */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-600 mb-1 font-semibold">Catering Business Name *</label>
                      <input 
                        type="text" 
                        required 
                        value={cateringName} 
                        onChange={e => setCateringName(e.target.value)} 
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 mb-1 font-semibold">Head Chef / Owner Name</label>
                      <input 
                        type="text" 
                        value={cateringOwner} 
                        onChange={e => setCateringOwner(e.target.value)} 
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Contact Number & Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-600 mb-1 font-semibold">Contact Phone Number *</label>
                      <input 
                        type="tel" 
                        required 
                        value={cateringPhone} 
                        onChange={e => setCateringPhone(e.target.value)} 
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 mb-1 font-semibold">WhatsApp Number</label>
                      <input 
                        type="tel" 
                        value={cateringWhatsapp} 
                        onChange={e => setCateringWhatsapp(e.target.value)} 
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-600 mb-1 font-semibold">Kitchen &amp; Office Address *</label>
                    <input 
                      type="text" 
                      required 
                      value={cateringAddress} 
                      onChange={e => setCateringAddress(e.target.value)} 
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>

                  {/* City, State & Capacity */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-stone-600 mb-1 font-semibold">City</label>
                      <input 
                        type="text" 
                        value={cateringCity} 
                        onChange={e => setCateringCity(e.target.value)} 
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 mb-1 font-semibold">State</label>
                      <select 
                        value={cateringState} 
                        onChange={e => setCateringState(e.target.value)} 
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                      >
                        {INDIAN_STATES_AND_UTS.map(st => (
                          <option key={st.id} value={st.name}>{st.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-stone-600 mb-1 font-semibold">Price per Plate</label>
                      <input 
                        type="number" 
                        value={cateringPricePerPlate} 
                        onChange={e => setCateringPricePerPlate(Number(e.target.value))} 
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* FEATURE 1: MENU IMAGE ADD OPTION */}
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-stone-800 flex items-center gap-1.5">
                        <FileImage className="w-4 h-4 text-[#E8590C]" />
                        <span>Catering Menu Cards &amp; Buffet Setup Photos</span>
                      </label>
                      <span className="text-[10px] text-stone-500 font-semibold">{cateringMenuImages.length} images added</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={newMenuImageUrl}
                        onChange={e => setNewMenuImageUrl(e.target.value)}
                        placeholder="Paste menu card photo image URL..."
                        className="flex-1 p-2 bg-white border border-stone-200 rounded-xl text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddCateringMenuImage}
                        className="px-3.5 py-2 bg-[#E8590C] hover:bg-[#D9480F] text-white rounded-xl font-bold flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Photo</span>
                      </button>
                    </div>

                    {/* Menu Images Preview Grid */}
                    {cateringMenuImages.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
                        {cateringMenuImages.map((imgUrl, idx) => (
                          <div key={idx} className="relative rounded-xl overflow-hidden border border-stone-200 aspect-4/3 group">
                            <img src={imgUrl} alt={`Menu photo ${idx+1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveCateringMenuImage(idx)}
                              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-80 hover:opacity-100 transition-opacity"
                              title="Delete photo"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* FEATURE 2: VIDEO UPLOAD / SHOWCASE VIDEO OPTION */}
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                    <label className="font-bold text-stone-800 flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-[#E8590C]" />
                      <span>Catering Showcase Video URL (YouTube / MP4)</span>
                    </label>
                    <input
                      type="url"
                      value={cateringVideoUrl}
                      onChange={e => setCateringVideoUrl(e.target.value)}
                      placeholder="e.g. https://www.youtube.com/watch?v=... or .mp4 video link"
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl font-mono text-xs"
                    />
                    <div className="text-[11px] text-stone-500">
                      Showcase your grand banquet hall setup, live counter stalls, and wedding buffet service to clients.
                    </div>
                  </div>

                  {/* FEATURE 3: CALENDAR BUSY / ALREADY BOOKED SCHEDULE OPTION */}
                  <div className="bg-stone-50 p-4 rounded-2xl border-2 border-amber-300 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-stone-900 flex items-center gap-1.5">
                        <CalendarDays className="w-4 h-4 text-[#E8590C]" />
                        <span>Catering Availability &amp; Already Booked Calendar Schedule</span>
                      </label>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        Live Booking Calendar
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-600 leading-tight">
                      Mark the dates when your catering team is <strong className="text-rose-700">Already Booked / Busy</strong> so customers inquiring can view open dates.
                    </p>

                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={newBookedDate}
                        onChange={e => setNewBookedDate(e.target.value)}
                        className="p-2 bg-white border border-stone-300 rounded-xl text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleAddBookedDate}
                        className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer text-xs shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Mark as Busy / Booked (🔴)</span>
                      </button>
                    </div>

                    {/* Booked Dates Chips */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-stone-500 uppercase block">
                        Dates Currently Marked as Busy / Already Booked:
                      </span>
                      {cateringBookedDates.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {cateringBookedDates.map((dateStr) => (
                            <span 
                              key={dateStr}
                              className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-800 border border-rose-300 px-2.5 py-1 rounded-lg text-xs font-bold shadow-2xs font-mono"
                            >
                              <span className="w-2 h-2 rounded-full bg-rose-600 inline-block"></span>
                              <span>{dateStr} (BUSY)</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveBookedDate(dateStr)}
                                className="text-rose-400 hover:text-rose-700 p-0.5"
                                title="Remove booked date"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-emerald-700 font-bold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                          🟢 All dates are currently open for booking!
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* SECTION 3: HOMEMADE FOOD BUSINESS FORM */}
              {mode === 'homemade' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-600 mb-1 font-semibold">Home Kitchen / Brand Name *</label>
                      <input 
                        type="text" 
                        required 
                        value={homemadeKitchenName} 
                        onChange={e => setHomemadeKitchenName(e.target.value)} 
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 mb-1 font-semibold">Home Chef Name</label>
                      <input 
                        type="text" 
                        value={homemadeChefName} 
                        onChange={e => setHomemadeChefName(e.target.value)} 
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-600 mb-1 font-semibold">Contact Phone Number *</label>
                      <input 
                        type="tel" 
                        required 
                        value={homemadePhone} 
                        onChange={e => setHomemadePhone(e.target.value)} 
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 mb-1 font-semibold">WhatsApp Number</label>
                      <input 
                        type="tel" 
                        value={homemadeWhatsapp} 
                        onChange={e => setHomemadeWhatsapp(e.target.value)} 
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-600 mb-1 font-semibold">Home Kitchen Street Address *</label>
                    <input 
                      type="text" 
                      required 
                      value={homemadeAddress} 
                      onChange={e => setHomemadeAddress(e.target.value)} 
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-stone-600 mb-1 font-semibold">Locality / Area</label>
                      <input 
                        type="text" 
                        value={homemadeLocality} 
                        onChange={e => setHomemadeLocality(e.target.value)} 
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 mb-1 font-semibold">City</label>
                      <input 
                        type="text" 
                        value={homemadeCity} 
                        onChange={e => setHomemadeCity(e.target.value)} 
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 mb-1 font-semibold">State</label>
                      <select 
                        value={homemadeState} 
                        onChange={e => setHomemadeState(e.target.value)} 
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                      >
                        {INDIAN_STATES_AND_UTS.map(st => (
                          <option key={st.id} value={st.name}>{st.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-600 mb-1 font-semibold">Dietary Classification</label>
                      <select 
                        value={homemadeDietary} 
                        onChange={e => setHomemadeDietary(e.target.value as any)} 
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                      >
                        <option value="100% Pure Veg">100% Pure Veg</option>
                        <option value="Pure Veg & Jain">Pure Veg &amp; Jain Friendly</option>
                        <option value="Veg & Non-Veg">Both Veg &amp; Non-Veg</option>
                        <option value="Halal Certified">Halal Certified</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-stone-600 mb-1 font-semibold">Tiffin / Meal Box Price (₹)</label>
                      <input 
                        type="number" 
                        value={homemadeTiffinPrice} 
                        onChange={e => setHomemadeTiffinPrice(Number(e.target.value))} 
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 4: HOTEL & RESTAURANT CREATORS FORM (NEW!) */}
              {mode === 'hotel_restaurant' && (
                <div className="space-y-4">
                  {/* Restaurant Dietary Option */}
                  <div>
                    <label className="block text-stone-700 font-bold mb-1.5">
                      Dining Dietary Classification:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setRestaurantDietary('Pure Veg')}
                        className={`py-2 px-3 rounded-xl border text-center font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          restaurantDietary === 'Pure Veg'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-300 shadow-xs'
                            : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block animate-pulse"></span>
                        <span>🟢 Pure Veg Only</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRestaurantDietary('Non-Veg')}
                        className={`py-2 px-3 rounded-xl border text-center font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          restaurantDietary === 'Non-Veg'
                            ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-300 shadow-xs'
                            : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block"></span>
                        <span>🔴 Non-Veg Feasts</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRestaurantDietary('Both Veg & Non-Veg')}
                        className={`py-2 px-3 rounded-xl border text-center font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          restaurantDietary === 'Both Veg & Non-Veg'
                            ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-300 shadow-xs'
                            : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                        <span className="w-2 h-2 rounded-full bg-rose-600 inline-block"></span>
                        <span>🟢🔴 Both Veg &amp; Non-Veg</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-600 mb-1 font-semibold">Restaurant / Hotel Name *</label>
                      <input 
                        type="text" 
                        required 
                        value={restaurantName} 
                        onChange={e => setRestaurantName(e.target.value)} 
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 mb-1 font-semibold">Executive Chef / Restaurateur</label>
                      <input 
                        type="text" 
                        value={restaurantOwner} 
                        onChange={e => setRestaurantOwner(e.target.value)} 
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-600 mb-1 font-semibold">Restaurant Category</label>
                      <select 
                        value={restaurantType} 
                        onChange={e => setRestaurantType(e.target.value as any)} 
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                      >
                        <option value="Fine Dine Restaurant">Fine Dine Restaurant</option>
                        <option value="Heritage Haveli & Palace">Heritage Haveli &amp; Palace Hotel</option>
                        <option value="Highway Dhaba">Highway Dhaba</option>
                        <option value="Family Dining & Thali">Family Dining &amp; Thali House</option>
                        <option value="Boutique Hotel & Cafe">Boutique Hotel &amp; Cafe</option>
                        <option value="Traditional Sweet & Chaat House">Traditional Sweet &amp; Chaat House</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-stone-600 mb-1 font-semibold">Approx. Cost for Two</label>
                      <input 
                        type="text" 
                        value={restaurantAvgCost} 
                        onChange={e => setRestaurantAvgCost(e.target.value)} 
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-600 mb-1 font-semibold">Contact Phone Number *</label>
                      <input 
                        type="tel" 
                        required 
                        value={restaurantPhone} 
                        onChange={e => setRestaurantPhone(e.target.value)} 
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 mb-1 font-semibold">WhatsApp Table Booking</label>
                      <input 
                        type="tel" 
                        value={restaurantWhatsapp} 
                        onChange={e => setRestaurantWhatsapp(e.target.value)} 
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-600 mb-1 font-semibold">Restaurant Street Address *</label>
                    <input 
                      type="text" 
                      required 
                      value={restaurantAddress} 
                      onChange={e => setRestaurantAddress(e.target.value)} 
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-stone-600 mb-1 font-semibold">City</label>
                      <input 
                        type="text" 
                        value={restaurantCity} 
                        onChange={e => setRestaurantCity(e.target.value)} 
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 mb-1 font-semibold">State</label>
                      <select 
                        value={restaurantState} 
                        onChange={e => setRestaurantState(e.target.value)} 
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                      >
                        {INDIAN_STATES_AND_UTS.map(st => (
                          <option key={st.id} value={st.name}>{st.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-stone-600 mb-1 font-semibold">Seating Capacity</label>
                      <input 
                        type="text" 
                        value={restaurantCapacity} 
                        onChange={e => setRestaurantCapacity(e.target.value)} 
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-600 mb-1 font-semibold">Operating Timings</label>
                    <input 
                      type="text" 
                      value={restaurantTimings} 
                      onChange={e => setRestaurantTimings(e.target.value)} 
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-600 mb-1 font-semibold">Signature Dishes &amp; Chef Specials</label>
                    <input 
                      type="text" 
                      value={restaurantSpecialities} 
                      onChange={e => setRestaurantSpecialities(e.target.value)} 
                      placeholder="e.g. Sikandari Raan, Dal Makhani, Tandoori Kebabs"
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>

                  {/* Menu Photos for Restaurant */}
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                    <label className="font-bold text-stone-800 flex items-center gap-1.5">
                      <FileImage className="w-4 h-4 text-amber-700" />
                      <span>Restaurant Menu Card Images</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={newRestMenuImageUrl}
                        onChange={e => setNewRestMenuImageUrl(e.target.value)}
                        placeholder="Paste menu card photo URL..."
                        className="flex-1 p-2 bg-white border border-stone-200 rounded-xl text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddRestMenuImage}
                        className="px-3.5 py-2 bg-stone-800 hover:bg-black text-white rounded-xl font-bold flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>

                  {/* Restaurant Video */}
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                    <label className="font-bold text-stone-800 flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-amber-700" />
                      <span>Restaurant Tour / Kitchen Video URL</span>
                    </label>
                    <input
                      type="url"
                      value={restaurantVideoUrl}
                      onChange={e => setRestaurantVideoUrl(e.target.value)}
                      placeholder="e.g. YouTube or MP4 video link"
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#E8590C] hover:bg-[#D9480F] text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{isEditing ? 'Save Changes' : mode === 'catering' ? 'Create Catering Account & Next' : mode === 'homemade' ? 'Create Homemade Account & Next' : 'Create Restaurant Account & Next'}</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
