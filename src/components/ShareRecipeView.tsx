import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INDIAN_STATES_AND_UTS } from '../data/states';
import { FOOD_CATEGORIES } from '../data/categories';
import { Ingredient, DietaryType, DifficultyLevel } from '../types';
import { DISH_IMAGE_PRESETS, getAccurateRecipeImage } from '../utils/recipeImageHelper';
import { FoodImagePickerModal } from './FoodImagePickerModal';
import { 
  PlusCircle, 
  Trash2, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  Clock, 
  Users, 
  FileText,
  Camera,
  Image as ImageIcon,
  Check,
  Flame,
  Cake,
  GlassWater,
  Salad,
  Link as LinkIcon,
  RefreshCw,
  X,
  HeartPulse,
  ArrowRight,
  Phone,
  MapPin,
  Store,
  Home,
  UtensilsCrossed,
  Building2,
  ShieldCheck,
  ChefHat,
  Film
} from 'lucide-react';
import { VideoGalleryModal } from './VideoGalleryModal';

const QUICK_CATEGORY_OPTIONS = [
  { id: 'sweets-desserts', categoryName: 'Sweets & Desserts', label: 'Sweet (Mithai)', icon: Cake, color: 'bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100', defaultPreset: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80' },
  { id: 'street-food', categoryName: 'Street Food', label: 'Street Food', icon: Flame, color: 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100', defaultPreset: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&auto=format&fit=crop&q=80' },
  { id: 'drinks-juices', categoryName: 'Drinks & Juices', label: 'Juice & Drinks', icon: GlassWater, color: 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100', defaultPreset: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&auto=format&fit=crop&q=80' },
  { id: 'diet-food', categoryName: 'Diet Food', label: 'Diet Food (Healthy)', icon: Salad, color: 'bg-lime-50 border-lime-200 text-lime-800 hover:bg-lime-100', defaultPreset: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80' },
  { id: 'curry-gravy', categoryName: 'Curry & Gravy', label: 'Curry & Gravy', icon: Flame, color: 'bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100', defaultPreset: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80' },
  { id: 'biryani', categoryName: 'Biryani', label: 'Biryani', icon: Flame, color: 'bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100', defaultPreset: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80' }
];

const DIET_GOAL_OPTIONS = [
  { id: 'Standard', label: 'Standard Balanced', badge: 'Traditional', desc: 'Authentic traditional household recipe' },
  { id: 'Diet Food', label: 'Diet Food & Weight Loss', badge: 'Low Calorie', desc: 'Low-calorie, low-oil, nutrient dense for weight management' },
  { id: 'High Protein', label: 'High Protein Fitness Diet', badge: 'Muscle Build', desc: 'Rich in paneer, lentils, sprouts, chicken, or eggs' },
  { id: 'Diabetic Friendly', label: 'Diabetic-Friendly Diet', badge: 'Low Glycemic', desc: 'Sugar-free, whole grains, high fiber, blood-sugar stable' },
  { id: 'Keto Diet', label: 'Keto / Low-Carb Diet', badge: 'Low Carb', desc: 'High healthy fats, zero grain, minimal carbohydrates' },
  { id: 'Gluten Free', label: 'Gluten-Free & Millet Diet', badge: 'Millet Grain', desc: 'Ragi, jowar, bajra, or naturally gluten-free ingredients' }
];

export const ShareRecipeView: React.FC = () => {
  const { 
    currentUser, 
    addNewRecipe, 
    setIsAuthModalOpen, 
    setCurrentView, 
    showToast, 
    recipes,
    activeUploadBusinessType,
    setActiveUploadBusinessType,
    prefilledBusinessData,
    openCreateBusinessAccount
  } = useApp();

  const [businessType, setBusinessType] = useState<'standard' | 'catering' | 'homemade' | 'hotel_restaurant'>(
    activeUploadBusinessType || 'standard'
  );

  // Catering Service Specific Details with Logo Option
  const [cateringBusinessName, setCateringBusinessName] = useState(currentUser?.name ? `${currentUser.name} Catering Services` : 'Sri Annapoorna Catering');
  const [cateringLogo, setCateringLogo] = useState('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=250&auto=format&fit=crop&q=80');
  const [cateringContactNumber, setCateringContactNumber] = useState('+91 98401 22334');
  const [cateringWhatsappNumber, setCateringWhatsappNumber] = useState('+91 98401 22334');
  const [cateringAddress, setCateringAddress] = useState('12/4, North Usman Road, T. Nagar');
  const [cateringCity, setCateringCity] = useState('Chennai');
  const [cateringMenuTitle, setCateringMenuTitle] = useState('Royal South Indian Wedding Feast');
  const [cateringPricePerPlate, setCateringPricePerPlate] = useState<number>(450);
  const [cateringMinGuests, setCateringMinGuests] = useState<number>(50);
  const [cateringItemsText, setCateringItemsText] = useState('Welcome Drink, Ghee Mysore Pak, Medu Vada, Sambhar Rice, Curd Rice, Payasam');
  const [cateringDietaryType, setCateringDietaryType] = useState<'Pure Veg' | 'Non-Veg' | 'Both Veg & Non-Veg'>('Both Veg & Non-Veg');

  // Homemade Food Business Specific Details with Logo Option
  const [homemadeKitchenName, setHomemadeKitchenName] = useState(currentUser?.name ? `${currentUser.name}'s Home Kitchen` : "Maa Ki Rasoi Tiffins");
  const [homemadeLogo, setHomemadeLogo] = useState('https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=250&auto=format&fit=crop&q=80');
  const [homemadeChefName, setHomemadeChefName] = useState(currentUser?.name || 'Chef Sunita');
  const [homemadeContactNumber, setHomemadeContactNumber] = useState('+91 98112 34567');
  const [homemadeWhatsappNumber, setHomemadeWhatsappNumber] = useState('+91 98112 34567');
  const [homemadeAddress, setHomemadeAddress] = useState('Flat 304, Green Glen Layout, Bellandur');
  const [homemadeLocality, setHomemadeLocality] = useState('Bellandur & HSR Layout');
  const [homemadeCity, setHomemadeCity] = useState('Bengaluru');
  const [homemadeDeliveryRadius, setHomemadeDeliveryRadius] = useState('Within 5 km radius');
  const [homemadeTiffinPrice, setHomemadeTiffinPrice] = useState<number>(120);
  const [homemadeTimings, setHomemadeTimings] = useState('Lunch: 12:00 PM - 2:00 PM | Dinner: 7:30 PM - 9:30 PM');

  // Hotel & Restaurant Specific Details with Logo Option
  const [restaurantName, setRestaurantName] = useState(currentUser?.name ? `${currentUser.name}'s Heritage Grand` : 'Bukhara & Peshawri Grand');
  const [restaurantLogo, setRestaurantLogo] = useState('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=250&auto=format&fit=crop&q=80');
  const [restaurantPhone, setRestaurantPhone] = useState('+91 11 2611 2233');
  const [restaurantWhatsapp, setRestaurantWhatsapp] = useState('+91 11 2611 2233');
  const [restaurantAddress, setRestaurantAddress] = useState('Diplomatic Enclave, Sardar Patel Marg');
  const [restaurantCity, setRestaurantCity] = useState('New Delhi');
  const [restaurantType, setRestaurantType] = useState('Fine Dine Restaurant');
  const [restaurantCostForTwo, setRestaurantCostForTwo] = useState('₹2,400 for two');
  const [restaurantTimings, setRestaurantTimings] = useState('12:30 PM - 3:30 PM | 7:00 PM - 11:30 PM');
  const [restaurantDietaryType, setRestaurantDietaryType] = useState<'Pure Veg' | 'Non-Veg' | 'Both Veg & Non-Veg'>('Both Veg & Non-Veg');

  // Sync if opened after creating catering/homemade/hotel account
  React.useEffect(() => {
    if (prefilledBusinessData) {
      if (activeUploadBusinessType === 'catering' || prefilledBusinessData.type === 'catering') {
        setBusinessType('catering');
        if (prefilledBusinessData.businessName) setCateringBusinessName(prefilledBusinessData.businessName);
        if (prefilledBusinessData.logo) setCateringLogo(prefilledBusinessData.logo);
        if (prefilledBusinessData.contactNumber) setCateringContactNumber(prefilledBusinessData.contactNumber);
        if (prefilledBusinessData.whatsappNumber) setCateringWhatsappNumber(prefilledBusinessData.whatsappNumber);
        if (prefilledBusinessData.address) setCateringAddress(prefilledBusinessData.address);
        if (prefilledBusinessData.city) setCateringCity(prefilledBusinessData.city);
        if (prefilledBusinessData.pricePerPlate) setCateringPricePerPlate(prefilledBusinessData.pricePerPlate);
        if (prefilledBusinessData.menuTitle) setCateringMenuTitle(prefilledBusinessData.menuTitle);
        if (prefilledBusinessData.dietaryType) setCateringDietaryType(prefilledBusinessData.dietaryType);
      } else if (activeUploadBusinessType === 'homemade' || prefilledBusinessData.type === 'homemade') {
        setBusinessType('homemade');
        if (prefilledBusinessData.businessName) setHomemadeKitchenName(prefilledBusinessData.businessName);
        if (prefilledBusinessData.logo) setHomemadeLogo(prefilledBusinessData.logo);
        if (prefilledBusinessData.contactNumber) setHomemadeContactNumber(prefilledBusinessData.contactNumber);
        if (prefilledBusinessData.whatsappNumber) setHomemadeWhatsappNumber(prefilledBusinessData.whatsappNumber);
        if (prefilledBusinessData.address) setHomemadeAddress(prefilledBusinessData.address);
        if (prefilledBusinessData.city) setHomemadeCity(prefilledBusinessData.city);
        if (prefilledBusinessData.tiffinPrice) setHomemadeTiffinPrice(prefilledBusinessData.tiffinPrice);
      } else if (activeUploadBusinessType === 'hotel_restaurant' || prefilledBusinessData.type === 'hotel_restaurant') {
        setBusinessType('hotel_restaurant');
        if (prefilledBusinessData.businessName) setRestaurantName(prefilledBusinessData.businessName);
        if (prefilledBusinessData.logo) setRestaurantLogo(prefilledBusinessData.logo);
        if (prefilledBusinessData.phone) setRestaurantPhone(prefilledBusinessData.phone);
        if (prefilledBusinessData.whatsappNumber) setRestaurantWhatsapp(prefilledBusinessData.whatsappNumber);
        if (prefilledBusinessData.address) setRestaurantAddress(prefilledBusinessData.address);
        if (prefilledBusinessData.city) setRestaurantCity(prefilledBusinessData.city);
        if (prefilledBusinessData.dietaryType) setRestaurantDietaryType(prefilledBusinessData.dietaryType);
      }
    } else if (activeUploadBusinessType) {
      setBusinessType(activeUploadBusinessType);
    }
  }, [prefilledBusinessData, activeUploadBusinessType]);

  const handleCateringLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setCateringLogo(ev.target.result as string);
          showToast('Catering business logo updated!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHomemadeLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setHomemadeLogo(ev.target.result as string);
          showToast('Homemade kitchen logo updated!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 17 Form Fields
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80');
  const [imageSource, setImageSource] = useState<'preset' | 'device' | 'url'>('preset');
  const [imageFileName, setImageFileName] = useState('');
  const [isFoodImagePickerOpen, setIsFoodImagePickerOpen] = useState(false);
  const [isVideoGalleryOpen, setIsVideoGalleryOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [state, setState] = useState('Tamil Nadu');
  const [district, setDistrict] = useState('');
  const [category, setCategory] = useState('Lunch');
  const [dietary, setDietary] = useState<DietaryType>('Vegetarian');
  const [dietGoal, setDietGoal] = useState<string>('Standard');
  
  // Dynamic ingredients
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { item: 'Toor Dal (Pigeon Pea)', quantity: '1 cup', notes: 'washed and rinsed' },
    { item: 'Mustard seeds & Curry leaves', quantity: '1 tsp & 2 sprigs', notes: 'for tadka' },
    { item: 'Cold-pressed Sesame Oil or Ghee', quantity: '2 tbsp' }
  ]);

  const [prepTime, setPrepTime] = useState<number>(20);
  const [cookTime, setCookTime] = useState<number>(30);
  const [servings, setServings] = useState<number>(4);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');
  
  // Dynamic Instructions
  const [instructions, setInstructions] = useState<string[]>([
    'Pressure cook the dal with turmeric and 3 cups of water until soft.',
    'Heat oil in a kadai and splutter mustard seeds and curry leaves until fragrant.',
    'Combine and simmer on low heat for 10 minutes.'
  ]);

  // Tips
  const [tips, setTips] = useState<string[]>([
    'Add a pinch of hing (asafoetida) while boiling dal for gut digestion.'
  ]);

  const [description, setDescription] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Gallery modal / drawer state
  const [showPresetGallery, setShowPresetGallery] = useState(false);
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState<'All' | 'Sweet' | 'Street Food' | 'Juice' | 'Diet Food' | 'Main Course'>('All');
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');

  // Handle local image file upload (Base64)
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be less than 5MB.');
      return;
    }

    setImageUploadLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setImage(dataUrl);
        setImageSource('device');
        setImageFileName(file.name);
        showToast('Photo uploaded from device successfully!');
      }
      setImageUploadLoading(false);
    };
    reader.onerror = () => {
      showToast('Failed to read image file.');
      setImageUploadLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const autoPickImage = () => {
    const accurateUrl = getAccurateRecipeImage(title || category, category);
    setImage(accurateUrl);
    setImageSource('preset');
    setImageFileName('');
    showToast(`Accurate photo applied for ${title || category}!`);
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim().startsWith('http')) {
      showToast('Please provide a valid image URL starting with http:// or https://');
      return;
    }
    setImage(customUrlInput.trim());
    setImageSource('url');
    setImageFileName('');
    showToast('Custom image URL applied!');
  };

  // Quick category click handler
  const handleSelectQuickCategory = (catName: string, defaultPreset: string) => {
    setCategory(catName);
    
    // Set matching gallery filter
    if (catName === 'Sweets & Desserts') setGalleryCategoryFilter('Sweet');
    else if (catName === 'Street Food') setGalleryCategoryFilter('Street Food');
    else if (catName === 'Drinks & Juices') setGalleryCategoryFilter('Juice');
    else if (catName === 'Diet Food') {
      setGalleryCategoryFilter('Diet Food');
      setDietGoal('Diet Food');
    }
    
    // If user hasn't uploaded their own device photo, apply the verified preset
    if (imageSource !== 'device') {
      setImage(defaultPreset);
      setImageSource('preset');
    }

    showToast(`Selected Category: ${catName}`);
  };

  // Filtered preset gallery items
  const filteredPresets = DISH_IMAGE_PRESETS.filter(preset => {
    if (galleryCategoryFilter === 'All') return true;
    if (galleryCategoryFilter === 'Sweet') return preset.category === 'Sweets & Desserts';
    if (galleryCategoryFilter === 'Street Food') return preset.category === 'Street Food' || preset.category === 'Evening Snacks';
    if (galleryCategoryFilter === 'Juice') return preset.category === 'Drinks & Juices';
    if (galleryCategoryFilter === 'Diet Food') return preset.category === 'Diet Food';
    if (galleryCategoryFilter === 'Main Course') {
      return ['Biryani', 'Dosa', 'Idli', 'Chicken Recipes', 'Curry & Gravy', 'Mutton Recipes', 'Fish Recipes', 'Lunch', 'Chapati & Roti'].includes(preset.category);
    }
    return true;
  });

  // Ingredient Helpers
  const addIngredientRow = () => {
    setIngredients([...ingredients, { item: '', quantity: '' }]);
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  // Instruction Helpers
  const addInstructionRow = () => {
    setInstructions([...instructions, '']);
  };

  const updateInstruction = (index: number, val: string) => {
    const updated = [...instructions];
    updated[index] = val;
    setInstructions(updated);
  };

  const removeInstruction = (index: number) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index));
    }
  };

  // Tip Helpers
  const addTipRow = () => setTips([...tips, '']);
  const updateTip = (idx: number, val: string) => {
    const updated = [...tips];
    updated[idx] = val;
    setTips(updated);
  };
  const removeTip = (idx: number) => setTips(tips.filter((_, i) => i !== idx));

  // Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!title.trim() || ingredients.length === 0 || instructions.length === 0) {
      showToast('Please fill all required recipe details.');
      return;
    }

    // Build smart tags incorporating Category, Sweet, Street Food, Juice, Diet Food
    const customTags = [
      state,
      category,
      dietary,
      ...(category === 'Sweets & Desserts' ? ['Sweet', 'Mithai', 'Dessert'] : []),
      ...(category === 'Street Food' ? ['Street Food', 'Chaat', 'Evening Snack'] : []),
      ...(category === 'Drinks & Juices' ? ['Juice', 'Drinks', 'Cooler'] : []),
      ...(category === 'Diet Food' || dietGoal === 'Diet Food' ? ['Diet Food', 'Weight Loss', 'Low Calorie'] : []),
      ...(dietGoal !== 'Standard' ? [dietGoal, 'Health & Fitness'] : [])
    ];

    // Estimated nutrition based on diet goal & category
    let estimatedNutrition = { calories: 340, protein: '12g', carbs: '45g', fat: '14g', fiber: '4g' };
    if (category === 'Diet Food' || dietGoal === 'Diet Food') {
      estimatedNutrition = { calories: 175, protein: '14g', carbs: '20g', fat: '4g', fiber: '8g' };
    } else if (dietGoal === 'High Protein') {
      estimatedNutrition = { calories: 360, protein: '34g', carbs: '18g', fat: '12g', fiber: '6g' };
    } else if (dietGoal === 'Keto Diet') {
      estimatedNutrition = { calories: 320, protein: '19g', carbs: '7g', fat: '25g', fiber: '4g' };
    } else if (category === 'Drinks & Juices') {
      estimatedNutrition = { calories: 120, protein: '2g', carbs: '28g', fat: '1g', fiber: '2g' };
    } else if (category === 'Sweets & Desserts') {
      estimatedNutrition = { calories: 320, protein: '6g', carbs: '52g', fat: '11g', fiber: '1g' };
    }

    let cateringPayload = undefined;
    if (businessType === 'catering') {
      cateringPayload = {
        businessName: cateringBusinessName.trim() || `${currentUser.name} Catering Services`,
        logo: cateringLogo,
        contactNumber: cateringContactNumber.trim() || '+91 98401 22334',
        whatsappNumber: cateringWhatsappNumber.trim() || cateringContactNumber.trim() || '+91 98401 22334',
        address: cateringAddress.trim() || `${district ? district + ', ' : ''}${state}`,
        city: cateringCity.trim() || district || state,
        menuTitle: cateringMenuTitle.trim() || `${title.trim()} Special Event Feast`,
        pricePerPlate: Number(cateringPricePerPlate) || 450,
        minGuests: Number(cateringMinGuests) || 50,
        dietaryType: cateringDietaryType,
        cateringDietary: cateringDietaryType,
        menuItems: cateringItemsText.split(',').map(s => s.trim()).filter(Boolean)
      };
    }

    let homemadePayload = undefined;
    if (businessType === 'homemade') {
      homemadePayload = {
        businessName: homemadeKitchenName.trim() || `${currentUser.name}'s Home Kitchen`,
        logo: homemadeLogo,
        kitchenName: homemadeKitchenName.trim() || `${currentUser.name}'s Home Kitchen`,
        chefName: homemadeChefName.trim() || currentUser.name,
        contactNumber: homemadeContactNumber.trim() || '+91 98112 34567',
        whatsappNumber: homemadeWhatsappNumber.trim() || homemadeContactNumber.trim() || '+91 98112 34567',
        address: homemadeAddress.trim() || `${district ? district + ', ' : ''}${state}`,
        locality: homemadeLocality.trim() || district || 'City Locality',
        city: homemadeCity.trim() || district || state,
        dailyTiffinPrice: Number(homemadeTiffinPrice) || 120,
        tiffinPrice: Number(homemadeTiffinPrice) || 120,
        deliveryRadius: homemadeDeliveryRadius.trim() || 'Within 5 km radius',
        deliveryTimings: homemadeTimings.trim() || 'Lunch: 12:00 PM - 2:00 PM | Dinner: 7:30 PM - 9:30 PM'
      };
    }

    let restaurantPayload = undefined;
    if (businessType === 'hotel_restaurant') {
      restaurantPayload = {
        restaurantName: restaurantName.trim() || `${currentUser.name}'s Heritage Grand`,
        logo: restaurantLogo,
        contactNumber: restaurantPhone.trim() || '+91 11 2611 2233',
        whatsappNumber: restaurantWhatsapp.trim() || restaurantPhone.trim(),
        address: restaurantAddress.trim() || `${district ? district + ', ' : ''}${state}`,
        city: restaurantCity.trim() || district || state,
        restaurantType,
        dietaryType: restaurantDietaryType,
        averageCostForTwo: restaurantCostForTwo,
        timings: restaurantTimings,
        tableBookingAvailable: true,
        specialities: [title.trim()]
      };
    }

    if (currentUser?.isBanned) {
      showToast(`Action Blocked: Your account is restricted by Admin from submitting recipes. Reason: ${currentUser.bannedReason || 'Account restricted.'}`);
      return;
    }

    addNewRecipe({
      title: title.trim(),
      description: description.trim() || `Authentic ${category} recipe from ${state}. Handed down through generations of home cooks.`,
      image,
      videoUrl,
      state,
      district,
      category,
      dietary,
      prepTime: Number(prepTime),
      cookTime: Number(cookTime),
      servings: Number(servings),
      difficulty,
      budgetTier: 'under100',
      costPerServing: category === 'Drinks & Juices' ? 35 : category === 'Diet Food' ? 45 : 65,
      ingredients: ingredients.filter(i => i.item.trim()),
      instructions: instructions.filter(s => s.trim()),
      tips: tips.filter(t => t.trim()),
      nutrition: estimatedNutrition,
      tags: Array.from(new Set([
        ...customTags,
        ...(businessType === 'catering' ? ['Catering Menu', 'Bulk Event Catering', 'Party Food'] : []),
        ...(businessType === 'homemade' ? ['Homemade Food', 'Ghar Ka Khana', 'Daily Tiffin'] : []),
        ...(businessType === 'hotel_restaurant' ? ['Hotel & Restaurant', 'Chef Signature Dish', 'Heritage Haveli'] : [])
      ])),
      businessType,
      cateringDetails: cateringPayload,
      homemadeDetails: homemadePayload,
      restaurantDetails: restaurantPayload
    });

    setSubmittedSuccess(true);
  };

  if (submittedSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="font-serif-title text-3xl font-black text-[#2B1B17]">
          Recipe Published Live!
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
          Thank you for sharing your culinary heritage with TASTE OF INDIA. Your recipe is now published live for the whole community to discover, cook, like, and download in People's Recipes!
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <button
            onClick={() => setCurrentView('peoples-recipes')}
            className="px-6 py-2.5 bg-[#E8590C] hover:bg-[#D9480F] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>See Your Recipe in People's Recipes →</span>
          </button>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="px-5 py-2.5 bg-stone-100 text-stone-800 text-xs font-bold rounded-xl hover:bg-stone-200 transition-colors"
          >
            My Dashboard
          </button>
          <button
            onClick={() => setSubmittedSuccess(false)}
            className="px-5 py-2.5 border border-stone-300 text-stone-700 text-xs font-bold rounded-xl hover:bg-stone-50 transition-colors"
          >
            Submit Another Recipe
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#2B1B17] via-[#3B2219] to-[#2B1B17] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8590C]/20 text-[#E8590C] text-xs font-bold border border-[#E8590C]/30">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Community Recipe Portal</span>
          </div>
          <h1 className="font-serif-title text-2xl sm:text-3xl md:text-4xl font-black">
            Share Your Authentic Recipe
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Every household across Bharat holds centuries of culinary wisdom. Share your traditional family recipes, sweets, street food, fresh juices, and healthy diet food with food lovers worldwide.
          </p>
        </div>
      </div>

      {/* Quick Link to View People's Uploaded Recipes */}
      <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-[#E8590C]/10 text-[#E8590C] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif-title font-bold text-sm text-[#2B1B17]">
              Want to see recipes uploaded by other people?
            </h3>
            <p className="text-xs text-stone-600">
              Discover authentic home recipes, family secrets, and regional specialties uploaded by community cooks.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setCurrentView('peoples-recipes')}
          className="shrink-0 px-4 py-2 bg-white border border-amber-300 text-stone-800 text-xs font-bold rounded-xl hover:bg-amber-100 hover:text-[#E8590C] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <span>See People's Uploaded Recipes</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#E8590C]" />
        </button>
      </div>

      {/* Banned User Restriction Warning */}
      {currentUser?.isBanned && (
        <div className="bg-rose-50 border-2 border-rose-400 p-4 rounded-2xl flex items-start gap-3.5 text-rose-950 shadow-xs animate-fadeIn">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-xl shrink-0">
            🚫
          </div>
          <div className="text-xs space-y-1">
            <h4 className="font-bold text-sm text-rose-900">
              Account Restricted: Recipe Submissions Suspended
            </h4>
            <p className="text-rose-800 leading-relaxed">
              Your account has been restricted by Editorial Administration. You are <strong>blocked from submitting new recipes</strong> to the platform.
              {currentUser.bannedReason && (
                <span className="block mt-1 font-semibold text-rose-950">Reason: {currentUser.bannedReason}</span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* 17-Field Submission Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Creator / Business Type Slot Selector */}
        <div className="bg-stone-50 border-2 border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#E8590C] uppercase tracking-wider block">
                Creator Profile &amp; Upload Category Slot
              </span>
              <h3 className="font-serif-title font-bold text-sm sm:text-base text-[#2B1B17]">
                Are you uploading as a Home Cook, Catering Service, or Homemade Food Business?
              </h3>
            </div>
            <span className="text-xs text-stone-500 hidden sm:inline">Select your slot</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={() => {
                setBusinessType('standard');
                if (setActiveUploadBusinessType) setActiveUploadBusinessType('standard');
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                businessType === 'standard'
                  ? 'border-[#E8590C] bg-amber-50 text-[#2B1B17] font-bold shadow-xs ring-2 ring-orange-300'
                  : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <ChefHat className="w-4 h-4 text-[#E8590C]" />
                <span className="text-xs font-bold">Standard Home Cook</span>
              </div>
              <p className="text-[11px] text-stone-500 font-normal">
                Share authentic family recipes for the community to cook at home.
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setBusinessType('catering');
                if (setActiveUploadBusinessType) setActiveUploadBusinessType('catering');
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                businessType === 'catering'
                  ? 'border-purple-600 bg-purple-50 text-purple-950 font-bold shadow-xs ring-2 ring-purple-300'
                  : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Store className="w-4 h-4 text-purple-700" />
                <span className="text-xs font-bold text-purple-900">Catering Service</span>
              </div>
              <p className="text-[11px] text-stone-500 font-normal">
                Upload catering recipes &amp; menu packages with Contact Number &amp; Address.
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setBusinessType('homemade');
                if (setActiveUploadBusinessType) setActiveUploadBusinessType('homemade');
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                businessType === 'homemade'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs ring-2 ring-emerald-300'
                  : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Home className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold text-emerald-900">Homemade Food</span>
              </div>
              <p className="text-[11px] text-stone-500 font-normal">
                Upload Ghar Ka Khana &amp; tiffin menus with Contact Number &amp; Kitchen Address.
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setBusinessType('hotel_restaurant');
                if (setActiveUploadBusinessType) setActiveUploadBusinessType('hotel_restaurant');
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                businessType === 'hotel_restaurant'
                  ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold shadow-xs ring-2 ring-amber-400'
                  : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-bold text-amber-900">Hotel / Dhaba / Dine</span>
              </div>
              <p className="text-[11px] text-stone-500 font-normal">
                Upload Chef's signature hotel recipes with Dining Address &amp; Reservation Phone.
              </p>
            </button>
          </div>

          {/* Conditional Catering Input Section */}
          {businessType === 'catering' && (
            <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4 mt-3 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-200 pb-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-900">
                  <Store className="w-4 h-4 text-purple-700" />
                  <span>Catering Service Profile, Logo &amp; Menu Package Details</span>
                </div>
                <button
                  type="button"
                  onClick={() => openCreateBusinessAccount('catering')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-[11px] font-bold shadow-xs transition-all cursor-pointer self-start sm:self-auto"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Create Account &amp; Logo Wizard</span>
                </button>
              </div>

              {/* Catering Logo Option Studio */}
              <div className="bg-white p-3.5 rounded-xl border border-purple-200 space-y-2.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-900">
                  Catering Brand Logo Option <span className="text-purple-600 font-normal">(Display on recipes, packages &amp; caterer directory)</span>
                </label>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Current Logo Preview */}
                  <div className="relative shrink-0 w-16 h-16 rounded-xl border-2 border-purple-300 overflow-hidden bg-purple-50 flex items-center justify-center shadow-xs">
                    {cateringLogo ? (
                      <img src={cateringLogo} alt="Catering Logo Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Store className="w-7 h-7 text-purple-400" />
                    )}
                    <span className="absolute bottom-0 inset-x-0 bg-purple-900/80 text-[8px] text-white font-bold text-center py-0.5">
                      Logo
                    </span>
                  </div>

                  {/* Upload from Device & Presets */}
                  <div className="space-y-2 grow">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg text-xs font-bold cursor-pointer border border-purple-300 transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Logo from Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCateringLogoUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-stone-500">or pick curated catering emblem:</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { name: 'Royal Degh', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=250&auto=format&fit=crop&q=80' },
                        { name: 'Brass Handi', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=250&auto=format&fit=crop&q=80' },
                        { name: 'Chef Crown', url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=250&auto=format&fit=crop&q=80' },
                        { name: 'Shahi Feast', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=250&auto=format&fit=crop&q=80' }
                      ].map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            setCateringLogo(preset.url);
                            showToast(`Applied ${preset.name} logo!`);
                          }}
                          className={`text-[10px] font-semibold px-2 py-1 rounded-md border transition-all cursor-pointer ${
                            cateringLogo === preset.url
                              ? 'bg-purple-700 text-white border-purple-700 font-bold'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-purple-50'
                          }`}
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Catering Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={cateringBusinessName}
                    onChange={e => setCateringBusinessName(e.target.value)}
                    placeholder="e.g. Sri Annapoorna Catering Services"
                    className="w-full p-2.5 bg-white border border-purple-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Direct Contact Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={cateringContactNumber}
                    onChange={e => setCateringContactNumber(e.target.value)}
                    placeholder="e.g. +91 98401 22334"
                    className="w-full p-2.5 bg-white border border-purple-200 rounded-lg text-xs font-mono font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Catering Kitchen Operational Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={cateringAddress}
                    onChange={e => setCateringAddress(e.target.value)}
                    placeholder="e.g. 12/4, North Usman Road, T. Nagar, Chennai"
                    className="w-full p-2.5 bg-white border border-purple-200 rounded-lg text-xs"
                  />
                </div>

                {/* Catering Creator Veg / Non-Veg Option */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-stone-700 mb-1 flex items-center justify-between">
                    <span>Catering Dietary Category <span className="text-red-500">*</span></span>
                    <span className="text-[10px] text-stone-500">Pure Veg or Non-Veg catering</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setCateringDietaryType('Pure Veg')}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        cateringDietaryType === 'Pure Veg'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                          : 'border-purple-200 bg-white text-stone-700 hover:bg-purple-50/50'
                      }`}
                    >
                      <span className="inline-flex items-center justify-center w-4 h-4 border-2 border-emerald-600 rounded p-0.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      </span>
                      <span className="text-xs">Pure Veg</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCateringDietaryType('Non-Veg')}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        cateringDietaryType === 'Non-Veg'
                          ? 'border-red-500 bg-red-50 text-red-900 font-bold shadow-xs'
                          : 'border-purple-200 bg-white text-stone-700 hover:bg-purple-50/50'
                      }`}
                    >
                      <span className="inline-flex items-center justify-center w-4 h-4 border-2 border-red-600 rounded p-0.5">
                        <span className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[7px] border-b-red-600" />
                      </span>
                      <span className="text-xs">Non-Veg</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCateringDietaryType('Both Veg & Non-Veg')}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        cateringDietaryType === 'Both Veg & Non-Veg'
                          ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold shadow-xs'
                          : 'border-purple-200 bg-white text-stone-700 hover:bg-purple-50/50'
                      }`}
                    >
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        <span className="w-2 h-2 rounded-full bg-red-600" />
                      </span>
                      <span className="text-xs">Both</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Catering Menu Package Name
                  </label>
                  <input
                    type="text"
                    value={cateringMenuTitle}
                    onChange={e => setCateringMenuTitle(e.target.value)}
                    placeholder="e.g. Royal Wedding Feast / Birthday Party Buffet"
                    className="w-full p-2.5 bg-white border border-purple-200 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Price / Plate (₹)
                    </label>
                    <input
                      type="number"
                      min={100}
                      value={cateringPricePerPlate}
                      onChange={e => setCateringPricePerPlate(Number(e.target.value))}
                      className="w-full p-2.5 bg-white border border-purple-200 rounded-lg text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Min Guests
                    </label>
                    <input
                      type="number"
                      min={10}
                      value={cateringMinGuests}
                      onChange={e => setCateringMinGuests(Number(e.target.value))}
                      className="w-full p-2.5 bg-white border border-purple-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Catering Menu Items (Comma-separated items included in package)
                  </label>
                  <input
                    type="text"
                    value={cateringItemsText}
                    onChange={e => setCateringItemsText(e.target.value)}
                    placeholder="Welcome Drink, Veg Biryani, Paneer Butter Masala, Butter Naan, Gulab Jamun..."
                    className="w-full p-2.5 bg-white border border-purple-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Conditional Homemade Food Input Section */}
          {businessType === 'homemade' && (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 mt-3 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200 pb-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <Home className="w-4 h-4 text-emerald-700" />
                  <span>Ghar Ka Khana Kitchen Profile, Logo, Address &amp; Tiffin Menu</span>
                </div>
                <button
                  type="button"
                  onClick={() => openCreateBusinessAccount('homemade')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold shadow-xs transition-all cursor-pointer self-start sm:self-auto"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Create Account &amp; Logo Wizard</span>
                </button>
              </div>

              {/* Homemade Kitchen Logo Option Studio */}
              <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-2.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-900">
                  Home Kitchen Brand Logo Option <span className="text-emerald-600 font-normal">(Display on recipes, tiffin cards &amp; home chef directory)</span>
                </label>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Current Logo Preview */}
                  <div className="relative shrink-0 w-16 h-16 rounded-xl border-2 border-emerald-300 overflow-hidden bg-emerald-50 flex items-center justify-center shadow-xs">
                    {homemadeLogo ? (
                      <img src={homemadeLogo} alt="Homemade Kitchen Logo Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Home className="w-7 h-7 text-emerald-400" />
                    )}
                    <span className="absolute bottom-0 inset-x-0 bg-emerald-900/80 text-[8px] text-white font-bold text-center py-0.5">
                      Logo
                    </span>
                  </div>

                  {/* Upload from Device & Presets */}
                  <div className="space-y-2 grow">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-xs font-bold cursor-pointer border border-emerald-300 transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Kitchen Logo from Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleHomemadeLogoUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-stone-500">or pick homestyle emblem:</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { name: 'Maa Ki Rasoi', url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=250&auto=format&fit=crop&q=80' },
                        { name: 'Amma Kitchen', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=250&auto=format&fit=crop&q=80' },
                        { name: 'Pure Sattvic', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=250&auto=format&fit=crop&q=80' },
                        { name: 'Tiffin Dabba', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=250&auto=format&fit=crop&q=80' }
                      ].map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            setHomemadeLogo(preset.url);
                            showToast(`Applied ${preset.name} logo!`);
                          }}
                          className={`text-[10px] font-semibold px-2 py-1 rounded-md border transition-all cursor-pointer ${
                            homemadeLogo === preset.url
                              ? 'bg-emerald-700 text-white border-emerald-700 font-bold'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-emerald-50'
                          }`}
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Home Kitchen Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={homemadeKitchenName}
                    onChange={e => setHomemadeKitchenName(e.target.value)}
                    placeholder="e.g. Maa Ki Rasoi Homemade Tiffins"
                    className="w-full p-2.5 bg-white border border-emerald-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Direct Contact / WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={homemadeContactNumber}
                    onChange={e => setHomemadeContactNumber(e.target.value)}
                    placeholder="e.g. +91 98112 34567"
                    className="w-full p-2.5 bg-white border border-emerald-200 rounded-lg text-xs font-mono font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Home Kitchen Address &amp; Locality <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={homemadeAddress}
                    onChange={e => setHomemadeAddress(e.target.value)}
                    placeholder="e.g. Flat 304, Green Glen Layout, Bellandur, Bangalore"
                    className="w-full p-2.5 bg-white border border-emerald-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Delivery Area / Radius
                  </label>
                  <input
                    type="text"
                    value={homemadeDeliveryRadius}
                    onChange={e => setHomemadeDeliveryRadius(e.target.value)}
                    placeholder="e.g. Within 5 km radius (Bellandur, HSR, Sarjapur)"
                    className="w-full p-2.5 bg-white border border-emerald-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Daily Tiffin / Meal Box Price (₹)
                  </label>
                  <input
                    type="number"
                    min={40}
                    value={homemadeTiffinPrice}
                    onChange={e => setHomemadeTiffinPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-emerald-200 rounded-lg text-xs font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Daily Fresh Meal Delivery Timings
                  </label>
                  <input
                    type="text"
                    value={homemadeTimings}
                    onChange={e => setHomemadeTimings(e.target.value)}
                    placeholder="e.g. Lunch: 12:00 PM - 2:00 PM | Dinner: 7:30 PM - 9:30 PM"
                    className="w-full p-2.5 bg-white border border-emerald-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Conditional Hotel & Restaurant Input Section */}
          {businessType === 'hotel_restaurant' && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 mt-3 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200 pb-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                  <Building2 className="w-4 h-4 text-amber-700" />
                  <span>Hotel, Dhaba &amp; Restaurant Details (Attached to Recipe)</span>
                </div>
                <button
                  type="button"
                  onClick={() => openCreateBusinessAccount('hotel_restaurant')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E8590C] hover:bg-[#D9480F] text-white rounded-lg text-[11px] font-bold shadow-xs transition-all cursor-pointer self-start sm:self-auto"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>Register Hotel / Dhaba Wizard</span>
                </button>
              </div>

              {/* Restaurant Details Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Hotel / Restaurant / Dhaba Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={restaurantName}
                    onChange={e => setRestaurantName(e.target.value)}
                    placeholder="e.g. Bukhara & Peshawri Heritage Grand"
                    className="w-full p-2.5 bg-white border border-amber-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Establishment Type
                  </label>
                  <select
                    value={restaurantType}
                    onChange={e => setRestaurantType(e.target.value)}
                    className="w-full p-2.5 bg-white border border-amber-200 rounded-lg text-xs"
                  >
                    <option value="Fine Dine Restaurant">Fine Dine Restaurant</option>
                    <option value="Heritage Haveli & Palace">Heritage Haveli &amp; Palace</option>
                    <option value="Highway Dhaba">Highway Dhaba (Grand 24x7)</option>
                    <option value="Family Dining & Thali">Family Dining &amp; Thali</option>
                    <option value="Boutique Hotel & Cafe">Boutique Hotel &amp; Cafe</option>
                    <option value="Traditional Sweet & Chaat House">Traditional Sweet &amp; Chaat House</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Table Booking &amp; Reservation Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={restaurantPhone}
                    onChange={e => setRestaurantPhone(e.target.value)}
                    placeholder="+91 11 2611 2233"
                    className="w-full p-2.5 bg-white border border-amber-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    WhatsApp Reservation Number
                  </label>
                  <input
                    type="tel"
                    value={restaurantWhatsapp}
                    onChange={e => setRestaurantWhatsapp(e.target.value)}
                    placeholder="+91 11 2611 2233"
                    className="w-full p-2.5 bg-white border border-amber-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Restaurant Address / Highway Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={restaurantAddress}
                    onChange={e => setRestaurantAddress(e.target.value)}
                    placeholder="e.g. Sardar Patel Marg, Diplomatic Enclave"
                    className="w-full p-2.5 bg-white border border-amber-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    City / Highway Stretch
                  </label>
                  <input
                    type="text"
                    value={restaurantCity}
                    onChange={e => setRestaurantCity(e.target.value)}
                    placeholder="e.g. New Delhi / Murthal (NH-44)"
                    className="w-full p-2.5 bg-white border border-amber-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Average Cost for Two
                  </label>
                  <input
                    type="text"
                    value={restaurantCostForTwo}
                    onChange={e => setRestaurantCostForTwo(e.target.value)}
                    placeholder="e.g. ₹2,400 for two"
                    className="w-full p-2.5 bg-white border border-amber-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Operating Timings
                  </label>
                  <input
                    type="text"
                    value={restaurantTimings}
                    onChange={e => setRestaurantTimings(e.target.value)}
                    placeholder="e.g. 12:30 PM - 3:30 PM, 7:00 PM - 11:30 PM"
                    className="w-full p-2.5 bg-white border border-amber-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Field 1: Recipe Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
            1. Recipe Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g., Kaju Katli Mithai, Mumbai Vada Pav, Fresh Sugarcane Juice, Sprouted Moong Diet Salad..."
            className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#E8590C]"
          />
        </div>

        {/* Field 2: Food Recipe Image Add Option Studio */}
        <div className="space-y-4 pt-2 border-t border-stone-100">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-800">
                  2. Food Recipe Image Add Option <span className="text-red-500">*</span>
                </label>
                <p className="text-[11px] text-stone-500">
                  Attach your dish photo via device upload, verified gallery preset, or auto-matcher.
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsFoodImagePickerOpen(true)}
                  className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-[#E8590C] hover:from-amber-600 hover:to-[#D9480F] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  title="Generate realistic food image using Google Gemini AI or upload from device gallery"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Google Gemini Food AI / Gallery</span>
                </button>

                <button
                  type="button"
                  onClick={autoPickImage}
                  className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-[#E8590C] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-amber-200/60 cursor-pointer"
                  title="Automatically finds an authentic matching photo"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto-Match</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPresetGallery(!showPresetGallery)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border cursor-pointer ${
                    showPresetGallery 
                      ? 'bg-[#E8590C] text-white border-[#E8590C]' 
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{showPresetGallery ? 'Close Presets' : 'Curated Gallery'}</span>
                </button>
              </div>
            </div>

            {/* Current Selected Image Preview & Upload Controls */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                
                {/* Visual Image Preview Card */}
                <div className="md:col-span-5 relative aspect-4/3 rounded-xl overflow-hidden shadow-xs border border-stone-200 bg-stone-900 group">
                  <img
                    src={image}
                    alt="Recipe Food Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>Selected Photo</span>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <span className="bg-[#2B1B17]/90 backdrop-blur-xs text-white text-[9px] font-semibold px-2 py-0.5 rounded truncate max-w-[140px]">
                      {imageSource === 'device' ? `Device: ${imageFileName || 'Uploaded Photo'}` : imageSource === 'url' ? 'Web URL Photo' : 'Authentic Preset Photo'}
                    </span>
                    <button
                      type="button"
                      onClick={() => autoPickImage()}
                      className="bg-white/90 hover:bg-white text-stone-800 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>

                {/* Interactive Multi-Option Upload Controls */}
                <div className="md:col-span-7 space-y-3">
                  
                  {/* Option A: Upload from Device / Drag-and-Drop Zone */}
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                      isDragging 
                        ? 'border-[#E8590C] bg-orange-50' 
                        : 'border-stone-300 bg-white hover:border-stone-400'
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <div className="w-10 h-10 rounded-full bg-orange-50 text-[#E8590C] flex items-center justify-center">
                        {imageUploadLoading ? (
                          <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                          <Camera className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <label className="cursor-pointer text-xs font-bold text-[#E8590C] hover:text-[#D9480F] underline">
                          <span>Click to Upload from Device / Camera</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileUpload}
                            className="hidden"
                          />
                        </label>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          or drag and drop your photo here (JPG, PNG, WebP up to 5MB)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Option B: Direct Image URL Option */}
                  <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1.5">
                    <label className="block text-[11px] font-bold text-stone-700 flex items-center gap-1">
                      <LinkIcon className="w-3 h-3 text-stone-500" />
                      <span>Or paste direct Web Image URL:</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={customUrlInput}
                        onChange={e => setCustomUrlInput(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="grow p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-[#E8590C]"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCustomUrl}
                        className="px-3 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-bold shrink-0 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  {/* Quick Preset Shortcuts */}
                  <div className="flex items-center flex-wrap gap-2 text-xs">
                    <span className="text-[11px] text-stone-500 font-semibold">Quick Photo Presets:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setImage('https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80');
                        setImageSource('preset');
                        showToast('Applied Sweet Mithai photo!');
                      }}
                      className="px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 text-[11px] font-semibold border border-pink-200 hover:bg-pink-100"
                    >
                      🍬 Sweet Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImage('https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&auto=format&fit=crop&q=80');
                        setImageSource('preset');
                        showToast('Applied Street Food photo!');
                      }}
                      className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200 hover:bg-amber-100"
                    >
                      🍢 Street Food Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImage('https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&auto=format&fit=crop&q=80');
                        setImageSource('preset');
                        showToast('Applied Fresh Juice photo!');
                      }}
                      className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200 hover:bg-emerald-100"
                    >
                      🥤 Juice Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImage('https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80');
                        setImageSource('preset');
                        showToast('Applied Diet Food photo!');
                      }}
                      className="px-2 py-0.5 rounded-full bg-lime-50 text-lime-800 text-[11px] font-semibold border border-lime-200 hover:bg-lime-100"
                    >
                      🥗 Diet Food Photo
                    </button>
                  </div>

                </div>
              </div>

              {/* Expandable Verified Preset Gallery Drawer */}
              {showPresetGallery && (
                <div className="pt-3 border-t border-stone-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-bold text-stone-800">
                      Browse Verified Indian Dish Photography:
                    </span>

                    {/* Filter tabs */}
                    <div className="flex items-center flex-wrap gap-1.5">
                      {(['All', 'Sweet', 'Street Food', 'Juice', 'Diet Food', 'Main Course'] as const).map(tab => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setGalleryCategoryFilter(tab)}
                          className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-colors ${
                            galleryCategoryFilter === tab
                              ? 'bg-[#E8590C] text-white'
                              : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200'
                          }`}
                        >
                          {tab === 'Sweet' ? '🍬 Sweet' : tab === 'Street Food' ? '🍢 Street Food' : tab === 'Juice' ? '🥤 Juice' : tab === 'Diet Food' ? '🥗 Diet Food' : tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 max-h-72 overflow-y-auto p-1">
                    {filteredPresets.map((preset) => {
                      const isSelected = image === preset.url;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            setImage(preset.url);
                            setImageSource('preset');
                            setImageFileName('');
                            showToast(`Selected ${preset.name}!`);
                          }}
                          className={`group relative rounded-xl overflow-hidden border text-left transition-all aspect-4/3 shadow-2xs ${
                            isSelected ? 'ring-2 ring-[#E8590C] border-transparent scale-98' : 'border-stone-200 hover:border-stone-400'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent p-1.5 flex flex-col justify-end">
                            <span className="text-[10px] font-bold text-white line-clamp-1 leading-tight">
                              {preset.name}
                            </span>
                            <span className="text-[9px] text-amber-300">
                              {preset.category}
                            </span>
                          </div>
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 bg-[#E8590C] text-white p-1 rounded-full shadow-xs">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Field 3: Cooking Video Link */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                3. Cooking Video Link (Optional)
              </label>
              <button
                type="button"
                onClick={() => setIsVideoGalleryOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 hover:bg-amber-100 text-[#E8590C] text-xs font-bold rounded-lg border border-amber-200 transition-all cursor-pointer shadow-2xs"
              >
                <Film className="w-3.5 h-3.5 text-[#E8590C]" />
                <span>Browse Video Upload Gallery</span>
              </button>
            </div>
            <input
              type="url"
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              placeholder="YouTube or Vimeo step-by-step video URL or choose from gallery above"
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#E8590C]"
            />
          </div>
        </div>

        {/* Quick Category Selection Row (Highlighting Sweet, Street food, Juice, Diet Food) */}
        <div className="space-y-2 pt-2 border-t border-stone-100">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-800">
              Quick Pick Category: <span className="text-stone-500 font-normal">One-click options for Sweet, Street food, Juice & Diet food</span>
            </label>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {QUICK_CATEGORY_OPTIONS.map((q) => {
              const IconComp = q.icon;
              const isSelected = category === q.categoryName;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => handleSelectQuickCategory(q.categoryName, q.defaultPreset)}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                    isSelected 
                      ? 'ring-2 ring-[#E8590C] bg-[#E8590C]/10 border-[#E8590C] font-bold text-[#E8590C]' 
                      : `${q.color}`
                  }`}
                >
                  <IconComp className="w-4 h-4 shrink-0" />
                  <span className="text-xs truncate">{q.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Fields 4, 5, 6, 7: State, District, Category, Dietary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              4. Indian State <span className="text-red-500">*</span>
            </label>
            <select
              value={state}
              onChange={e => setState(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#E8590C]"
            >
              {INDIAN_STATES_AND_UTS.map(st => (
                <option key={st.id} value={st.name}>{st.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              5. District (Optional)
            </label>
            <input
              type="text"
              value={district}
              onChange={e => setDistrict(e.target.value)}
              placeholder="e.g. Karaikudi, Surat, Amritsar"
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#E8590C]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              6. Food Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#E8590C]"
            >
              {FOOD_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              7. Dietary Type <span className="text-red-500">*</span>
            </label>
            <select
              value={dietary}
              onChange={e => setDietary(e.target.value as DietaryType)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#E8590C]"
            >
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Vegan">Vegan</option>
            </select>
          </div>
        </div>

        {/* Diet Food & Nutrition Lifestyle Selector ("dite food" Option) */}
        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-[#E8590C]" />
              <label className="text-xs font-bold uppercase tracking-wider text-stone-800">
                Diet Food & Health Option (Weight Loss, Low Cal, Keto, Diabetic)
              </label>
            </div>
            <span className="text-[11px] text-stone-500">Helps health-conscious food lovers discover your dish</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {DIET_GOAL_OPTIONS.map((goal) => {
              const isSelected = dietGoal === goal.id;
              return (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => {
                    setDietGoal(goal.id);
                    if (goal.id === 'Diet Food') {
                      setCategory('Diet Food');
                    }
                    showToast(`Diet goal set to: ${goal.label}`);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-stone-800">
                      {goal.label}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                      isSelected ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {goal.badge}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500 leading-tight">
                    {goal.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Fields 8 & 9: Ingredients and Quantities */}
        <div className="space-y-3 pt-2 border-t border-stone-100">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
              8 & 9. Ingredients and Quantities <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={addIngredientRow}
              className="text-xs text-[#E8590C] hover:text-[#D9480F] font-bold flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Ingredient</span>
            </button>
          </div>

          <div className="space-y-2">
            {ingredients.map((ing, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  value={ing.item}
                  onChange={e => updateIngredient(idx, 'item', e.target.value)}
                  placeholder="Ingredient name (e.g., Kaju/Cashews, Boiled Potatoes, Fresh Oranges, Sprouted Moong)"
                  className="grow p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#E8590C]"
                />
                <input
                  type="text"
                  required
                  value={ing.quantity}
                  onChange={e => updateIngredient(idx, 'quantity', e.target.value)}
                  placeholder="Qty (e.g., 200g, 1 glass, 2 cups)"
                  className="w-32 sm:w-44 p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#E8590C]"
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(idx)}
                    className="p-2 text-stone-400 hover:text-red-500 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Fields 10, 11, 12, 13: Times, Servings, Difficulty */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-stone-100">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              10. Prep Time (mins)
            </label>
            <input
              type="number"
              min={1}
              value={prepTime}
              onChange={e => setPrepTime(Number(e.target.value))}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              11. Cook Time (mins)
            </label>
            <input
              type="number"
              min={0}
              value={cookTime}
              onChange={e => setCookTime(Number(e.target.value))}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              12. Serving Size
            </label>
            <input
              type="number"
              min={1}
              value={servings}
              onChange={e => setServings(Number(e.target.value))}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              13. Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value as DifficultyLevel)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
              <option value="Master">Master</option>
            </select>
          </div>
        </div>

        {/* Field 14: Step-by-Step Instructions */}
        <div className="space-y-3 pt-2 border-t border-stone-100">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
              14. Step-by-Step Cooking Instructions <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={addInstructionRow}
              className="text-xs text-[#E8590C] hover:text-[#D9480F] font-bold flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Step</span>
            </button>
          </div>

          <div className="space-y-2">
            {instructions.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center text-xs font-bold shrink-0 mt-2">
                  {idx + 1}
                </span>
                <textarea
                  required
                  rows={2}
                  value={step}
                  onChange={e => updateInstruction(idx, e.target.value)}
                  placeholder={`Detail for step ${idx + 1}...`}
                  className="grow p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#E8590C]"
                />
                {instructions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeInstruction(idx)}
                    className="p-2 text-stone-400 hover:text-red-500 rounded-lg mt-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Field 15: Special Cooking Tips */}
        <div className="space-y-3 pt-2 border-t border-stone-100">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
              15. Special Cooking Tips & Secrets
            </label>
            <button
              type="button"
              onClick={addTipRow}
              className="text-xs text-[#E8590C] hover:text-[#D9480F] font-bold flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Tip</span>
            </button>
          </div>

          <div className="space-y-2">
            {tips.map((tip, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={tip}
                  onChange={e => updateTip(idx, e.target.value)}
                  placeholder="Pro tip to enhance flavour, crispiness, or nutrition..."
                  className="grow p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                />
                {tips.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTip(idx)}
                    className="p-2 text-stone-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Field 16: Recipe Description */}
        <div className="pt-2 border-t border-stone-100">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
            16. Recipe Cultural Story & Introduction
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Share the history, regional background, special memories, or health benefits associated with this dish..."
            className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#E8590C]"
          />
        </div>

        {/* Field 17: Submit */}
        <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-stone-500 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Recipe will be published live immediately to our community archive!</span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-[#E8590C] hover:bg-[#D9480F] active:scale-95 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
          >
            17. Publish Recipe Live
          </button>
        </div>

      </form>

      {/* Food Image Picker Modal */}
      <FoodImagePickerModal
        isOpen={isFoodImagePickerOpen}
        onClose={() => setIsFoodImagePickerOpen(false)}
        onSelectImage={(url) => {
          setImage(url);
          setImageSource('preset');
          showToast('Recipe image updated!');
        }}
        currentImage={image}
        defaultPrompt={title ? `${title} authentic regional Indian dish fresh appetizing food photography` : undefined}
      />

      {/* Video Gallery Modal */}
      <VideoGalleryModal
        isOpen={isVideoGalleryOpen}
        onClose={() => setIsVideoGalleryOpen(false)}
        defaultFilter="normal"
        onSelectVideo={(v) => {
          setVideoUrl(v.videoUrl);
          if (image.includes('unsplash.com/photo-1546833999-b9f581a1996d') || !image) {
            setImage(v.thumbnail);
            setImageSource('preset');
          }
          showToast(`Video "${v.title}" linked to recipe!`);
        }}
      />
    </div>
  );
};
