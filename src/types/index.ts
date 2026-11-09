export type DietaryType = 'Vegetarian' | 'Non-Vegetarian' | 'Vegan';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | 'Master';

export type RecipeStatus = 'approved' | 'pending' | 'rejected';

export type BudgetTier = 'under50' | 'under100' | 'under150' | 'under200' | 'luxury';

export interface Ingredient {
  item: string;
  quantity: string;
  notes?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  fiber?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  rating?: number;
  createdAt: string;
}

export interface Creator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  location: string;
  bio: string;
  isVerified?: boolean;
  verifiedReason?: string;
  recipesCount?: number;
  followersCount?: number;
  channelId?: string;
}

export interface CreatorChannel {
  id: string;
  userId: string;
  name: string;
  username: string; // e.g. "chef-arun" (unique URL handle)
  avatar: string;
  coverImage: string;
  description: string;
  state: string;
  district: string;
  speciality: string;
  preferredLanguage: string;
  socialLinks: {
    youtube?: string;
    instagram?: string;
    facebook?: string;
    website?: string;
  };
  isVerified: boolean;
  verifiedReason?: string;
  isSuspended?: boolean;
  followersCount: number;
  viewsCount: number;
  totalRecipeViews: number;
  totalVideoViews: number;
  createdAt: string;
}

export interface CookingVideo {
  id: string;
  channelId: string;
  creatorId: string;
  creatorName: string;
  creatorUsername: string;
  creatorAvatar: string;
  isVerified?: boolean;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: string; // e.g. "12:45"
  isShort?: boolean;
  category: string;
  state: string;
  language: string;
  likes: number;
  views: number;
  status: RecipeStatus; // 'approved' | 'pending' | 'rejected'
  rejectionReason?: string;
  isPremium?: boolean;
  comments: Comment[];
  createdAt: string;
}

export interface CreatorNotification {
  id: string;
  userId: string;
  type: 'follow' | 'approval' | 'rejection' | 'comment' | 'like' | 'admin_message' | 'announcement';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
  senderName?: string;
  category?: string;
}

export interface AdminSentMessage {
  id: string;
  recipientUserId: string; // 'all' or specific user id
  recipientName: string;
  recipientEmail?: string;
  title: string;
  message: string;
  category: string;
  createdAt: string;
  delivered: boolean;
}

export type SpiceLevel = 'Mild' | 'Medium' | 'Spicy' | 'Extra Hot';

export interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  videoUrl?: string;
  state: string;
  district?: string;
  category: string;
  dietary: DietaryType;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  totalTime: number; // in minutes
  servings: number;
  difficulty: DifficultyLevel;
  budgetTier: BudgetTier;
  costPerServing?: number; // in INR
  ingredients: Ingredient[];
  instructions: string[];
  tips: string[];
  nutrition: NutritionInfo;
  creator: Creator;
  status: RecipeStatus;
  rejectionReason?: string;
  isUserUploaded?: boolean;
  isFeatured?: boolean;
  isSpecialToday?: boolean;
  festival?: string;
  likes: number;
  saves: number;
  rating: number;
  ratingCount: number;
  createdAt: string;
  comments: Comment[];
  tags: string[];
  culturalStory?: string;
  allergens?: string[];
  isPremiumOnly?: boolean;
  additionalImages?: string[];
  channelId?: string;
  videoDuration?: string;
  spiceLevel?: SpiceLevel;
  isGlutenFree?: boolean;
  businessType?: 'standard' | 'catering' | 'homemade' | 'hotel_restaurant';
  cateringDetails?: {
    businessName: string;
    logo?: string;
    contactNumber: string;
    whatsappNumber?: string;
    address: string;
    city: string;
    menuTitle?: string;
    pricePerPlate?: number;
    minGuests?: number;
    menuHighlights?: string[];
    menuItems?: string[];
    dietaryType?: 'Pure Veg' | 'Non-Veg' | 'Both Veg & Non-Veg';
    cateringDietary?: 'Pure Veg' | 'Non-Veg' | 'Both Veg & Non-Veg';
    menuImages?: string[];
    videoUrl?: string;
    bookedDates?: string[];
  };
  homemadeDetails?: {
    businessName: string;
    logo?: string;
    kitchenName?: string;
    chefName: string;
    contactNumber: string;
    whatsappNumber?: string;
    address: string;
    city: string;
    locality?: string;
    deliveryArea?: string;
    deliveryRadius?: string;
    tiffinPrice?: number;
    dailyTiffinPrice?: number;
    deliveryTimings?: string;
    menuHighlights?: string[];
    preOrderNotice?: string;
  };
  restaurantDetails?: {
    restaurantName: string;
    logo?: string;
    contactNumber: string;
    whatsappNumber?: string;
    address: string;
    city: string;
    restaurantType?: 'Fine Dine Restaurant' | 'Heritage Haveli & Palace' | 'Highway Dhaba' | 'Family Dining & Thali' | 'Boutique Hotel & Cafe' | 'Traditional Sweet & Chaat House' | string;
    dietaryType?: 'Pure Veg' | 'Non-Veg' | 'Both Veg & Non-Veg';
    averageCostForTwo?: number | string;
    timings?: string;
    menuImages?: string[];
    videoUrl?: string;
    tableBookingAvailable?: boolean;
    specialities?: string[];
  };
}

export interface CateringMenuPackage {
  id: string;
  packageName: string;
  pricePerPlate: number; // in INR
  minGuests: number;
  maxGuests?: number;
  dietary: DietaryType;
  itemsIncluded: string[];
  description?: string;
}

export interface CateringProfile {
  id: string;
  userId?: string;
  businessName: string;
  logo?: string;
  ownerName: string;
  phone: string;
  whatsappNumber: string;
  address: string;
  city: string;
  state: string;
  speciality: string;
  experienceYears: number;
  pricePerPlateRange: string;
  capacityRange: string;
  servicesOffered: string[];
  dietaryType?: 'Pure Veg' | 'Non-Veg' | 'Both Veg & Non-Veg';
  menuImages?: string[];
  videoUrl?: string;
  bookedDates?: string[];
  verified: boolean;
  rating: number;
  reviewsCount: number;
  coverImage: string;
  avatar: string;
  menuPackages: CateringMenuPackage[];
  uploadedRecipeIds: string[];
  createdAt: string;
}

export interface HotelRestaurantProfile {
  id: string;
  userId?: string;
  businessName: string;
  logo?: string;
  ownerOrChefName: string;
  restaurantType: 'Fine Dine Restaurant' | 'Heritage Haveli & Palace' | 'Highway Dhaba' | 'Family Dining & Thali' | 'Boutique Hotel & Cafe' | 'Traditional Sweet & Chaat House';
  dietaryType: 'Pure Veg' | 'Non-Veg' | 'Both Veg & Non-Veg';
  phone: string;
  whatsappNumber?: string;
  address: string;
  city: string;
  state: string;
  timings: string;
  seatingCapacity: number | string;
  averageCostForTwo: number | string;
  specialities: string[];
  menuImages?: string[];
  videoUrl?: string;
  verified: boolean;
  rating: number;
  reviewsCount: number;
  coverImage: string;
  avatar: string;
  uploadedRecipeIds: string[];
  tableBookingAvailable?: boolean;
  createdAt: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerEmail: string;
  planName: string;
  durationText: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  validUntil: string;
  status: 'PAID' | 'VERIFIED';
  supportEmail: string;
  editorialOffice: string;
}

export interface HomemadeMenuItem {
  id: string;
  dishName: string;
  price: number; // in INR
  portionSize: string;
  dietary: DietaryType;
  availability: string;
  description?: string;
}

export interface HomemadeFoodProfile {
  id: string;
  userId?: string;
  businessName: string;
  logo?: string;
  chefName: string;
  phone: string;
  whatsappNumber: string;
  address: string;
  city: string;
  state: string;
  deliveryArea: string;
  speciality: string;
  serviceType: 'Daily Tiffin Service' | 'Home Kitchen Pre-orders' | 'Homemade Sweets & Pickles' | 'Regional Bakery & Snacks';
  dietaryType: '100% Pure Veg' | 'Pure Veg & Jain' | 'Veg & Non-Veg' | 'Halal Certified';
  operatingHours: string;
  verified: boolean;
  rating: number;
  reviewsCount: number;
  coverImage: string;
  avatar: string;
  videoUrl?: string;
  menuItems: HomemadeMenuItem[];
  uploadedRecipeIds: string[];
  createdAt: string;
}

export interface IndianState {
  id: string;
  name: string;
  type: 'state' | 'ut';
  capital: string;
  region: 'North' | 'South' | 'East' | 'West' | 'Central' | 'Northeast';
  description: string;
  famousDishes: string[];
  heroImage: string;
  popularCategories: string[];
}

export type SubscriptionPlanId = 'monthly' | 'quarterly' | 'halfyearly' | 'yearly';

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  price: number;
  durationMonths: number;
  durationText: string;
  badge?: string;
  savings?: string;
  popular?: boolean;
  features: string[];
}

export type BadgeTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface CulinaryBadge {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  category: 'contributor' | 'explorer' | 'quality' | 'heritage' | 'collector';
  tier: BadgeTier;
  targetCount: number;
  currentCount: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  rewardText: string;
}

export interface User {
  id: string;
  customUserId?: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  role: 'user' | 'admin';
  isPremium: boolean;
  premiumExpiry?: string;
  plan?: SubscriptionPlanId;
  followers: number;
  following: number;
  savedRecipeIds: string[];
  uploadedRecipeIds: string[];
  downloadedRecipeIds: string[];
  followingCreatorIds: string[];
  badges?: string[];
  channelId?: string;
  channelUsername?: string;
  hasChannel?: boolean;
  isCreator?: boolean;
  isBanned?: boolean;
  bannedReason?: string;
  bannedAt?: string;
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  paymentId: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: SubscriptionPlanId;
  planName: string;
  amount: number;
  currency: string;
  method: 'UPI' | 'Card' | 'Netbanking' | 'Wallet';
  upiApp?: string;
  bankName?: string;
  status: 'captured' | 'failed' | 'refunded';
  createdAt: string;
  expiryDate: string;
}

export interface ActiveSubscriptionRecord {
  subscriptionId: string;
  userEmail: string;
  userId: string;
  userName: string;
  planId: SubscriptionPlanId;
  planName: string;
  durationMonths: number;
  amount: number;
  startDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'cancelled';
  paymentRef: string;
  lastVerifiedAt: string;
}

export interface RecipeReport {
  id: string;
  recipeId: string;
  recipeTitle: string;
  reporterUserId: string;
  reason: string;
  details: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  createdAt: string;
}

export interface MealPlanDay {
  day: number;
  dayName: string;
  breakfastId: string;
  lunchId: string;
  dinnerId: string;
  snackId?: string;
}

export type LanguageCode = 'en' | 'ta' | 'hi' | 'te' | 'ml' | 'kn';

export interface TranslationStrings {
  home: string;
  exploreRecipes: string;
  indianStates: string;
  foodCategories: string;
  community: string;
  peoplesRecipes: string;
  premium: string;
  shareRecipe: string;
  login: string;
  register: string;
  searchPlaceholder: string;
  heroHeadline: string;
  heroSubheading: string;
  todaysSpecial: string;
  popularRecipes: string;
  whatsInMyKitchen: string;
  budgetCooking: string;
  mealPlanner: string;
  festivalCollection: string;
  topCreators: string;
  downloadPdf: string;
  printRecipe: string;
  servings: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  ingredients: string;
  instructions: string;
  chefTips: string;
  nutrition: string;
}
