import React, { useState, useMemo } from 'react';
import { Recipe } from '../types';
import { useApp } from '../context/AppContext';
import { generateRecipePDF } from '../utils/pdfGenerator';
import { calculateDynamicNutrition, DynamicNutritionResult } from '../utils/nutritionCalculator';
import { 
  X, 
  Clock, 
  Users, 
  Flame, 
  ChefHat, 
  Download, 
  Printer, 
  Share2, 
  Heart, 
  Bookmark, 
  Star, 
  ShieldAlert, 
  Check, 
  Sparkles,
  ArrowRight,
  Copy,
  Edit3,
  Trash2,
  Loader2,
  Phone,
  MapPin,
  MessageSquare,
  UtensilsCrossed,
  Calendar,
  Store,
  Home,
  CheckCircle2,
  Calculator,
  PieChart,
  Activity,
  ChevronDown,
  ChevronUp,
  Scale,
  Plus,
  Minus,
  Info
} from 'lucide-react';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4 fill-current" }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);

const TwitterXIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4 fill-current" }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4 fill-current" }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

interface RecipeDetailModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({ recipe, onClose }) => {
  const { 
    currentUser, 
    likeRecipe, 
    saveRecipe, 
    addComment, 
    setIsPremiumModalOpen, 
    showToast,
    recipes,
    openChannel,
    setSelectedRecipe,
    openEditRecipe,
    deleteRecipe
  } = useApp();

  const isCreatorOwner = currentUser && (
    recipe.creator.id === currentUser.id ||
    currentUser.uploadedRecipeIds?.includes(recipe.id) ||
    recipe.isUserUploaded ||
    recipe.id.startsWith('recipe-custom-')
  );

  const [servingScale, setServingScale] = useState<number>(recipe.servings || 4);
  const [nutritionMode, setNutritionMode] = useState<'perServing' | 'totalBatch'>('perServing');
  const [showBreakdownTable, setShowBreakdownTable] = useState(false);

  // Dynamic nutrition calculation based on ingredient list and current serving scale
  const dynamicNutrition: DynamicNutritionResult = useMemo(() => {
    return calculateDynamicNutrition(
      recipe.ingredients,
      servingScale,
      recipe.nutrition
    );
  }, [recipe.ingredients, servingScale, recipe.nutrition]);

  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [commentRating, setCommentRating] = useState(5);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Inaccurate measurements or ingredients');
  const [reportDetails, setReportDetails] = useState('');

  const isSaved = currentUser?.savedRecipeIds.includes(recipe.id);

  // Scaled ingredients multiplier
  const scaleMultiplier = servingScale / (recipe.servings || 4);

  // Parse and scale ingredient numbers where possible
  const formatQuantity = (origQty: string): string => {
    const match = origQty.match(/^([\d./]+)\s*(.*)$/);
    if (!match) return origQty;
    const numPart = match[1];
    const unitPart = match[2];

    let numericVal = 0;
    if (numPart.includes('/')) {
      const [num, den] = numPart.split('/');
      numericVal = parseFloat(num) / parseFloat(den);
    } else {
      numericVal = parseFloat(numPart);
    }

    if (isNaN(numericVal)) return origQty;

    const scaled = (numericVal * scaleMultiplier).toFixed(1).replace(/\.0$/, '');
    return `${scaled} ${unitPart}`.trim();
  };

  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleDownloadPDF = async () => {
    if (!currentUser?.isPremium) {
      setIsPremiumModalOpen(true);
      return;
    }

    try {
      setIsDownloadingPdf(true);
      showToast(`Generating ${recipe.title} PDF with high-res photo & logo...`);
      await generateRecipePDF(recipe, currentUser.name);
      showToast(`Downloaded ${recipe.title} PDF! Saved in your premium archive.`);
    } catch (e) {
      console.error(e);
      showToast('Downloaded recipe PDF.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Social share destination URLs
  const recipeUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/?recipe=${encodeURIComponent(recipe.slug || recipe.id)}` 
    : 'https://tasteofindia.com';

  const shareText = `Discover authentic "${recipe.title}" (${recipe.state} · ${recipe.category}) on TASTE OF INDIA! Explore traditional and modern recipes, cook and celebrate our rich food heritage:`;

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n\n${recipeUrl}`)}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(recipeUrl)}&hashtags=TasteOfIndia,IndianFood,${encodeURIComponent(recipe.state.replace(/\s+/g, ''))}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(recipeUrl)}&quote=${encodeURIComponent(shareText)}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(recipeUrl);
      setCopiedLink(true);
      showToast('Recipe link copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(recipe.id, commentText.trim(), commentRating);
    setCommentText('');
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Report received. Our culinary compliance team will review within 24 hours.');
    setShowReportModal(false);
    setReportDetails('');
  };

  // Related recipes from same state or category
  const relatedRecipes = recipes
    .filter(r => r.id !== recipe.id && (r.state === recipe.state || r.category === recipe.category))
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="bg-[#FAF6F0] w-full max-w-4xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Sticky Modal Header */}
        <div className="p-4 sm:px-6 bg-white border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#E8590C]">
              {recipe.state}
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-stone-500 font-medium">
              {recipe.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Creator Edit & Delete Options */}
            {isCreatorOwner && (
              <div className="flex items-center gap-1.5 mr-1">
                <button
                  onClick={() => {
                    onClose();
                    openEditRecipe(recipe);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors cursor-pointer"
                  title="Edit Recipe"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#E8590C]" />
                  <span>Edit Recipe</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete "${recipe.title}"? This cannot be undone.`)) {
                      deleteRecipe(recipe.id);
                      onClose();
                    }
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer"
                  title="Delete Recipe"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            )}

            {/* Download PDF Button with Loading State */}
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloadingPdf}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer disabled:opacity-75 ${
                currentUser?.isPremium
                  ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                  : 'bg-[#E8590C] text-white hover:bg-[#D9480F]'
              }`}
            >
              {isDownloadingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E8590C]" />
                  <span>Preparing PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>{currentUser?.isPremium ? 'Download PDF' : 'Download PDF (Premium)'}</span>
                </>
              )}
            </button>

            {/* Print Recipe */}
            <button
              onClick={handlePrint}
              title="Print Recipe"
              className="p-1.5 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Social Media Share Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
                title="Share Recipe to WhatsApp, Twitter, Facebook"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  isShareMenuOpen 
                    ? 'bg-[#E8590C] text-white border-[#E8590C] shadow-xs' 
                    : 'bg-white text-stone-700 hover:text-stone-900 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </button>

              {/* Share Popover Menu */}
              {isShareMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsShareMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-stone-200 p-3.5 z-50 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                      <div>
                        <h4 className="font-bold text-xs text-stone-900">Share This Recipe</h4>
                        <p className="text-[10px] text-stone-500">Share flavours with friends & family</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setIsShareMenuOpen(false)}
                        className="text-stone-400 hover:text-stone-600 p-1 rounded-md"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Social Media Direct Share Links */}
                    <div className="space-y-1.5">
                      {/* WhatsApp Direct Share */}
                      <a
                        href={whatsappShareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          showToast('Opening WhatsApp to share recipe...');
                          setIsShareMenuOpen(false);
                        }}
                        className="flex items-center gap-2.5 w-full p-2 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-bold text-xs transition-colors cursor-pointer"
                      >
                        <div className="w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-2xs">
                          <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                        </div>
                        <span className="grow">Share on WhatsApp</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                      </a>

                      {/* Twitter / X Direct Share */}
                      <a
                        href={twitterShareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          showToast('Opening Twitter / X to share recipe...');
                          setIsShareMenuOpen(false);
                        }}
                        className="flex items-center gap-2.5 w-full p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold text-xs transition-colors cursor-pointer"
                      >
                        <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center shrink-0 shadow-2xs">
                          <TwitterXIcon className="w-3 h-3 fill-current" />
                        </div>
                        <span className="grow">Share on Twitter / X</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                      </a>

                      {/* Facebook Direct Share */}
                      <a
                        href={facebookShareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          showToast('Opening Facebook to share recipe...');
                          setIsShareMenuOpen(false);
                        }}
                        className="flex items-center gap-2.5 w-full p-2 rounded-lg bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] font-bold text-xs transition-colors cursor-pointer"
                      >
                        <div className="w-6 h-6 rounded-full bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-2xs">
                          <FacebookIcon className="w-3.5 h-3.5 fill-current" />
                        </div>
                        <span className="grow">Share on Facebook</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                      </a>
                    </div>

                    {/* Copy Link Row */}
                    <div className="pt-2 border-t border-stone-100 space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          readOnly
                          value={recipeUrl}
                          className="grow p-1.5 bg-stone-50 border border-stone-200 rounded-lg text-[10px] text-stone-600 focus:outline-none select-all font-mono"
                        />
                        <button
                          type="button"
                          onClick={handleCopyLink}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 transition-all cursor-pointer ${
                            copiedLink
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-800 hover:bg-stone-900 text-white'
                          }`}
                        >
                          {copiedLink ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 space-y-8">
          
          {/* Hero Banner Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="relative aspect-4/3 rounded-xl overflow-hidden shadow-sm border border-stone-200">
              <img
                src={recipe.image}
                alt={recipe.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded text-xs font-semibold text-[#2B1B17] shadow-xs flex items-center gap-1.5">
                <ChefHat className="w-3.5 h-3.5 text-[#E8590C]" />
                <span>{recipe.creator.name}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="font-serif-title text-2xl sm:text-3xl font-extrabold text-[#2B1B17] leading-tight">
                {recipe.title}
              </h1>

              <p className="text-sm text-stone-700 leading-relaxed">
                {recipe.description}
              </p>

              {/* Creator Card */}
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-200">
                <img
                  src={recipe.creator.avatar}
                  alt={recipe.creator.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-amber-300 shrink-0"
                />
                <div className="grow text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-stone-900">{recipe.creator.name}</span>
                    {recipe.creator.isVerified && (
                      <span className="text-amber-500 text-[10px]" title="Verified Food Creator">★</span>
                    )}
                  </div>
                  <div className="text-stone-500">{recipe.creator.location}</div>
                  {recipe.creator.username && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        openChannel(recipe.creator.username);
                      }}
                      className="text-[11px] font-bold text-[#E8590C] hover:underline cursor-pointer block mt-0.5"
                    >
                      Visit Creator Channel (@{recipe.creator.username}) →
                    </button>
                  )}
                </div>
                <button
                  onClick={() => {
                    likeRecipe(recipe.id);
                  }}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-stone-100 hover:bg-red-50 hover:text-red-600 text-stone-700 transition-colors"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span className="tabular-nums">{recipe.likes}</span>
                </button>
                <button
                  onClick={() => saveRecipe(recipe.id)}
                  className={`p-1.5 rounded-md border text-xs transition-colors ${
                    isSaved ? 'bg-amber-50 border-amber-300 text-[#E8590C]' : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#E8590C]' : ''}`} />
                </button>
              </div>

              {/* Fast Metrics Row */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                <div className="bg-white p-2.5 rounded-lg border border-stone-200 text-center">
                  <div className="text-[10px] uppercase text-stone-400 font-semibold">Prep</div>
                  <div className="text-sm font-bold text-stone-800 tabular-nums">{recipe.prepTime}m</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-stone-200 text-center">
                  <div className="text-[10px] uppercase text-stone-400 font-semibold">Cook</div>
                  <div className="text-sm font-bold text-stone-800 tabular-nums">{recipe.cookTime}m</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-stone-200 text-center">
                  <div className="text-[10px] uppercase text-stone-400 font-semibold">Difficulty</div>
                  <div className="text-sm font-bold text-stone-800">{recipe.difficulty}</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-stone-200 text-center">
                  <div className="text-[10px] uppercase text-stone-400 font-semibold">Calories</div>
                  <div className="text-sm font-bold text-stone-800 tabular-nums">
                    {dynamicNutrition.perServing.calories} <span className="text-[10px] font-normal text-stone-500">kcal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DEDICATED SLOT 1: Catering Service Provider & Event Menu Details */}
          {(recipe.businessType === 'catering' || recipe.cateringDetails) && (
            <div className="bg-gradient-to-br from-purple-50 via-white to-amber-50/40 rounded-2xl border-2 border-purple-200 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-3">
                <div className="flex items-center gap-2.5">
                  {recipe.cateringDetails?.logo ? (
                    <img 
                      src={recipe.cateringDetails.logo} 
                      alt={recipe.cateringDetails.businessName || 'Catering Logo'} 
                      className="w-12 h-12 rounded-xl object-cover shrink-0 ring-2 ring-purple-300 shadow-xs bg-purple-50" 
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Store className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                        Official Catering Creator Slot
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified Caterer
                      </span>
                      {/* Dietary Type Badge */}
                      {recipe.cateringDetails?.dietaryType === 'Pure Veg' && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 font-black bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
                          <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse"></span>
                          Pure Veg
                        </span>
                      )}
                      {recipe.cateringDetails?.dietaryType === 'Non-Veg' && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-rose-800 font-black bg-rose-100/80 px-2 py-0.5 rounded-full border border-rose-300">
                          <span className="w-2 h-2 rounded-full bg-rose-600 inline-block"></span>
                          Non-Veg
                        </span>
                      )}
                      {(!recipe.cateringDetails?.dietaryType || recipe.cateringDetails?.dietaryType === 'Both Veg & Non-Veg') && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-900 font-black bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 inline-block"></span>
                          Veg &amp; Non-Veg
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#2B1B17]">
                      {recipe.cateringDetails?.businessName || `${recipe.creator.name} Catering Services`}
                    </h3>
                  </div>
                </div>

                {recipe.cateringDetails?.pricePerPlate && (
                  <div className="text-right sm:text-right bg-white p-2 sm:px-3 rounded-xl border border-purple-200 shrink-0">
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-medium">Event Menu Pricing</span>
                    <span className="font-serif-title text-lg font-black text-purple-900">
                      ₹{recipe.cateringDetails.pricePerPlate}
                    </span>
                    <span className="text-xs text-stone-500 font-semibold"> / plate</span>
                  </div>
                )}
              </div>

              {/* Catering Address & Contact Information Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Address Slot */}
                <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-purple-600" />
                    Catering Kitchen Address
                  </span>
                  <p className="font-medium text-stone-800 leading-snug">
                    {recipe.cateringDetails?.address || `${recipe.district ? recipe.district + ', ' : ''}${recipe.state}`}
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Operational Base: {recipe.cateringDetails?.city || recipe.district || recipe.state}
                  </p>
                </div>

                {/* Contact & Capacity Slot */}
                <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1">
                    <Users className="w-3 h-3 text-purple-600" />
                    Event Capacity &amp; Contact
                  </span>
                  <p className="font-bold text-stone-800 text-sm">
                    {recipe.cateringDetails?.contactNumber || '+91 98401 22334'}
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Guest Capacity: Min {recipe.cateringDetails?.minGuests || 50} - 2,500+ guests
                  </p>
                </div>
              </div>

              {/* Menu Package Highlights */}
              {recipe.cateringDetails?.menuTitle && (
                <div className="bg-purple-50/60 p-3 rounded-xl border border-purple-100">
                  <span className="text-[10px] uppercase font-bold text-purple-800 block mb-1">
                    Recommended Catering Package: {recipe.cateringDetails.menuTitle}
                  </span>
                  {recipe.cateringDetails.menuItems && recipe.cateringDetails.menuItems.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {recipe.cateringDetails.menuItems.map((item, i) => (
                        <span key={i} className="text-[11px] bg-white px-2 py-0.5 rounded-md border border-purple-200 text-purple-950 font-medium">
                          • {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Direct Booking & Inquiry CTAs */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <a
                  href={`tel:${recipe.cateringDetails?.contactNumber || '+919840122334'}`}
                  className="grow sm:grow-0 px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Caterer ({recipe.cateringDetails?.contactNumber || '+91 98401 22334'})</span>
                </a>

                <a
                  href={`https://wa.me/${(recipe.cateringDetails?.whatsappNumber || recipe.cateringDetails?.contactNumber || '919840122334').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello, I discovered your recipe "${recipe.title}" and catering profile on Taste of India. I would like to inquire about booking your catering services for an upcoming event.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grow sm:grow-0 px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          )}

          {/* DEDICATED SLOT 2: Homemade Food Business / Ghar Ka Khana Details */}
          {(recipe.businessType === 'homemade' || recipe.homemadeDetails) && (
            <div className="bg-gradient-to-br from-emerald-50 via-white to-amber-50/40 rounded-2xl border-2 border-emerald-200 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-3">
                <div className="flex items-center gap-2.5">
                  {recipe.homemadeDetails?.logo ? (
                    <img 
                      src={recipe.homemadeDetails.logo} 
                      alt={recipe.homemadeDetails.kitchenName || 'Kitchen Logo'} 
                      className="w-12 h-12 rounded-xl object-cover shrink-0 ring-2 ring-emerald-300 shadow-xs bg-emerald-50" 
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Home className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Ghar Ka Khana / Home Chef Slot
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-white px-1.5 py-0.2 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        100% Homemade
                      </span>
                    </div>
                    <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#2B1B17]">
                      {recipe.homemadeDetails?.kitchenName || `${recipe.creator.name}'s Home Kitchen`}
                    </h3>
                    <p className="text-xs text-stone-600 font-medium">
                      Home Chef: {recipe.homemadeDetails?.chefName || recipe.creator.name}
                    </p>
                  </div>
                </div>

                {recipe.homemadeDetails?.dailyTiffinPrice && (
                  <div className="text-right bg-white p-2 sm:px-3 rounded-xl border border-emerald-200 shrink-0">
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-medium">Daily Tiffin Price</span>
                    <span className="font-serif-title text-lg font-black text-emerald-800">
                      ₹{recipe.homemadeDetails.dailyTiffinPrice}
                    </span>
                    <span className="text-xs text-stone-500 font-semibold"> / meal</span>
                  </div>
                )}
              </div>

              {/* Kitchen Address & Contact Information Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Kitchen Address Slot */}
                <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    Home Kitchen Address
                  </span>
                  <p className="font-medium text-stone-800 leading-snug">
                    {recipe.homemadeDetails?.address || `${recipe.district ? recipe.district + ', ' : ''}${recipe.state}`}
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Locality &amp; City: {recipe.homemadeDetails?.locality || recipe.district || 'City Center'}, {recipe.homemadeDetails?.city || recipe.state}
                  </p>
                </div>

                {/* Delivery Area & Contact Slot */}
                <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1">
                    <UtensilsCrossed className="w-3 h-3 text-emerald-600" />
                    Delivery Area &amp; Contact
                  </span>
                  <p className="font-bold text-stone-800 text-sm">
                    {recipe.homemadeDetails?.contactNumber || '+91 98112 34567'}
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Delivery Radius: {recipe.homemadeDetails?.deliveryRadius || 'Within 5 km radius'}
                  </p>
                </div>
              </div>

              {/* Delivery Timings */}
              {recipe.homemadeDetails?.deliveryTimings && (
                <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200 text-xs flex items-center justify-between">
                  <span className="text-emerald-900 font-semibold">Fresh Meal Timings:</span>
                  <span className="font-medium text-emerald-950 bg-white px-2 py-0.5 rounded border border-emerald-200">
                    {recipe.homemadeDetails.deliveryTimings}
                  </span>
                </div>
              )}

              {/* Direct Tiffin Order CTAs */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <a
                  href={`tel:${recipe.homemadeDetails?.contactNumber || '+919811234567'}`}
                  className="grow sm:grow-0 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Home Chef ({recipe.homemadeDetails?.contactNumber || '+91 98112 34567'})</span>
                </a>

                <a
                  href={`https://wa.me/${(recipe.homemadeDetails?.whatsappNumber || recipe.homemadeDetails?.contactNumber || '919811234567').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Namaste Chef! I saw your authentic recipe "${recipe.title}" on Taste of India. I would like to order fresh homemade food / tiffins from your kitchen.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grow sm:grow-0 px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                  <span>Order Tiffin on WhatsApp</span>
                </a>
              </div>
            </div>
          )}

          {/* Servings Adjuster & Ingredients Checklist */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <h2 className="font-serif-title text-lg font-bold text-[#2B1B17]">
                  Ingredients
                </h2>
                <span className="text-xs text-stone-500">
                  Check off items as you cook in your kitchen
                </span>
              </div>

              {/* Dynamic Servings Scaler */}
              <div className="flex items-center gap-2 bg-[#FAF6F0] p-1.5 rounded-lg border border-stone-200 self-start sm:self-auto">
                <Users className="w-4 h-4 text-stone-500 ml-1" />
                <span className="text-xs font-medium text-stone-700">Servings:</span>
                {[2, 4, 6, 8].map(qty => (
                  <button
                    key={qty}
                    onClick={() => setServingScale(qty)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                      servingScale === qty
                        ? 'bg-[#E8590C] text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {qty}
                  </button>
                ))}
              </div>
            </div>

            {/* Ingredients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
              {recipe.ingredients.map((ing, idx) => {
                const isChecked = !!checkedIngredients[idx];
                return (
                  <label
                    key={idx}
                    className={`flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-amber-50/60 border-amber-200 text-stone-400 line-through'
                        : 'bg-stone-50/50 border-stone-200/80 hover:bg-stone-50 text-stone-800'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() =>
                        setCheckedIngredients(prev => ({ ...prev, [idx]: !prev[idx] }))
                      }
                      className="mt-0.5 accent-[#E8590C] rounded-sm"
                    />
                    <div className="text-xs leading-normal">
                      <span className="font-semibold text-[#2B1B17]">
                        {formatQuantity(ing.quantity)}
                      </span>{' '}
                      <span>{ing.item}</span>
                      {ing.notes && (
                        <span className="text-[11px] text-stone-500 block italic">
                          ({ing.notes})
                        </span>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Cooking Instructions with Step-by-Step Focus */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 space-y-4">
            <h2 className="font-serif-title text-lg font-bold text-[#2B1B17]">
              Step-by-Step Cooking Method
            </h2>

            <div className="space-y-3">
              {recipe.instructions.map((step, idx) => {
                const isCurrent = activeStep === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveStep(isCurrent ? null : idx)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-amber-50 border-[#E8590C] shadow-xs'
                        : 'bg-stone-50/40 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isCurrent ? 'bg-[#E8590C] text-white' : 'bg-stone-200 text-stone-700'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="grow">
                        <p className={`text-xs sm:text-sm leading-relaxed ${
                          isCurrent ? 'text-[#2B1B17] font-medium' : 'text-stone-700'
                        }`}>
                          {step}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chef Pro Tips */}
          {recipe.tips && recipe.tips.length > 0 && (
            <div className="bg-amber-50/70 p-5 rounded-xl border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-[#E8590C]">
                <Sparkles className="w-4 h-4" />
                <h3 className="font-serif-title font-bold text-sm uppercase tracking-wider">
                  Chef's Traditional Cooking Secrets
                </h3>
              </div>
              <ul className="space-y-1.5 pl-5 list-disc text-xs text-stone-700 leading-relaxed">
                {recipe.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Dynamic Nutrition Calculator */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
            {/* Header with Title and Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E8590C] to-amber-600 text-white flex items-center justify-center shadow-xs shrink-0">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif-title font-bold text-base text-[#2B1B17] flex items-center gap-2">
                      <span>Dynamic Nutrition Calculator</span>
                      <span className="text-[10px] font-sans font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full">
                        Live from {recipe.ingredients.length} Ingredients
                      </span>
                    </h3>
                    <p className="text-xs text-stone-500">
                      Estimates calories and macronutrients per serving dynamically computed from the ingredient weights &amp; measures.
                    </p>
                  </div>
                </div>
              </div>

              {/* View Mode Toggle: Per Serving vs Total Batch */}
              <div className="flex items-center gap-1 bg-[#FAF6F0] p-1 rounded-xl border border-stone-200 text-xs font-semibold self-start sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setNutritionMode('perServing')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    nutritionMode === 'perServing'
                      ? 'bg-[#E8590C] text-white font-bold shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Per Serving ({servingScale} {servingScale === 1 ? 'person' : 'servings'})
                </button>
                <button
                  type="button"
                  onClick={() => setNutritionMode('totalBatch')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    nutritionMode === 'totalBatch'
                      ? 'bg-[#E8590C] text-white font-bold shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Total Pot (~{dynamicNutrition.totalRecipe.weightGrams}g)
                </button>
              </div>
            </div>

            {/* Quick Interactive Serving Scaler inside Calculator */}
            <div className="bg-[#FAF6F0] p-3 rounded-xl border border-[#E8DFC8]/70 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#E8590C]" />
                <span className="font-bold text-stone-800">Adjust Servings for Nutrition:</span>
                <span className="text-stone-500 text-[11px]">(Modifies per-serving calorie &amp; macro breakdown)</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-white border border-stone-300 rounded-lg shadow-2xs overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setServingScale(prev => Math.max(1, prev - 1))}
                    className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 hover:text-stone-900 font-bold transition-colors cursor-pointer"
                    title="Decrease servings"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 font-mono font-bold text-stone-900 text-xs">
                    {servingScale} {servingScale === 1 ? 'Serving' : 'Servings'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setServingScale(prev => Math.min(24, prev + 1))}
                    className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 hover:text-stone-900 font-bold transition-colors cursor-pointer"
                    title="Increase servings"
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  {[2, 4, 6, 8].map(qty => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setServingScale(qty)}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                        servingScale === qty
                          ? 'bg-[#2B1B17] text-white'
                          : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
                      }`}
                    >
                      {qty}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Primary 5 Macro & Calorie Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {/* Calories */}
              <div className="p-3.5 bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl border border-amber-200/80 text-center space-y-1">
                <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 text-[#E8590C]" />
                  <span>Calories</span>
                </div>
                <div className="text-xl sm:text-2xl font-black font-serif-title text-[#2B1B17] tabular-nums">
                  {nutritionMode === 'perServing' ? dynamicNutrition.perServing.calories : dynamicNutrition.totalRecipe.calories}
                </div>
                <div className="text-[10px] text-stone-500 font-medium">
                  {nutritionMode === 'perServing' ? `${dynamicNutrition.dailyValuePercentages.caloriesPct}% Daily Value` : 'Total in batch'}
                </div>
              </div>

              {/* Protein */}
              <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 text-center space-y-1">
                <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">
                  Protein
                </div>
                <div className="text-xl sm:text-2xl font-black font-serif-title text-emerald-950 tabular-nums">
                  {nutritionMode === 'perServing' ? `${dynamicNutrition.perServing.protein}g` : `${dynamicNutrition.totalRecipe.protein}g`}
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold">
                  {nutritionMode === 'perServing' ? `${dynamicNutrition.dailyValuePercentages.proteinPct}% DV` : '100% of batch'}
                </div>
              </div>

              {/* Carbs */}
              <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/80 text-center space-y-1">
                <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                  Carbohydrates
                </div>
                <div className="text-xl sm:text-2xl font-black font-serif-title text-amber-950 tabular-nums">
                  {nutritionMode === 'perServing' ? `${dynamicNutrition.perServing.carbs}g` : `${dynamicNutrition.totalRecipe.carbs}g`}
                </div>
                <div className="text-[10px] text-amber-700 font-semibold">
                  {nutritionMode === 'perServing' ? `${dynamicNutrition.dailyValuePercentages.carbsPct}% DV` : '100% of batch'}
                </div>
              </div>

              {/* Fats */}
              <div className="p-3.5 bg-rose-50/70 rounded-2xl border border-rose-200/80 text-center space-y-1">
                <div className="text-[11px] font-bold text-rose-900 uppercase tracking-wider">
                  Fats &amp; Lipids
                </div>
                <div className="text-xl sm:text-2xl font-black font-serif-title text-rose-950 tabular-nums">
                  {nutritionMode === 'perServing' ? `${dynamicNutrition.perServing.fat}g` : `${dynamicNutrition.totalRecipe.fat}g`}
                </div>
                <div className="text-[10px] text-rose-700 font-semibold">
                  {nutritionMode === 'perServing' ? `${dynamicNutrition.dailyValuePercentages.fatPct}% DV` : '100% of batch'}
                </div>
              </div>

              {/* Dietary Fiber */}
              <div className="p-3.5 bg-teal-50/70 rounded-2xl border border-teal-200/80 text-center space-y-1 col-span-2 sm:col-span-1">
                <div className="text-[11px] font-bold text-teal-900 uppercase tracking-wider">
                  Dietary Fiber
                </div>
                <div className="text-xl sm:text-2xl font-black font-serif-title text-teal-950 tabular-nums">
                  {nutritionMode === 'perServing' ? `${dynamicNutrition.perServing.fiber}g` : `${dynamicNutrition.totalRecipe.fiber}g`}
                </div>
                <div className="text-[10px] text-teal-700 font-semibold">
                  {nutritionMode === 'perServing' ? `${dynamicNutrition.dailyValuePercentages.fiberPct}% DV` : '100% of batch'}
                </div>
              </div>
            </div>

            {/* Macronutrient Calorie Energy Ratio Bar */}
            <div className="space-y-2 pt-1 border-t border-stone-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-700 flex items-center gap-1.5">
                  <PieChart className="w-3.5 h-3.5 text-[#E8590C]" />
                  <span>Macro Calorie Energy Distribution:</span>
                </span>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                    <span className="font-semibold text-stone-700">Carbs {dynamicNutrition.macroSplitPercentages.carbsPct}%</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                    <span className="font-semibold text-stone-700">Protein {dynamicNutrition.macroSplitPercentages.proteinPct}%</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                    <span className="font-semibold text-stone-700">Fat {dynamicNutrition.macroSplitPercentages.fatPct}%</span>
                  </span>
                </div>
              </div>

              <div className="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden flex shadow-inner">
                <div 
                  className="bg-amber-500 h-full transition-all duration-300"
                  style={{ width: `${dynamicNutrition.macroSplitPercentages.carbsPct}%` }}
                  title={`Carbohydrates: ${dynamicNutrition.macroSplitPercentages.carbsPct}%`}
                />
                <div 
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${dynamicNutrition.macroSplitPercentages.proteinPct}%` }}
                  title={`Protein: ${dynamicNutrition.macroSplitPercentages.proteinPct}%`}
                />
                <div 
                  className="bg-rose-500 h-full transition-all duration-300"
                  style={{ width: `${dynamicNutrition.macroSplitPercentages.fatPct}%` }}
                  title={`Fat: ${dynamicNutrition.macroSplitPercentages.fatPct}%`}
                />
              </div>
            </div>

            {/* Interactive Ingredient-by-Ingredient Breakdown Accordion */}
            <div className="pt-2 border-t border-stone-100 space-y-3">
              <button
                type="button"
                onClick={() => setShowBreakdownTable(!showBreakdownTable)}
                className="w-full py-2 px-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-[#E8590C]" />
                  <span>View Ingredient-by-Ingredient Calorie &amp; Macro Breakdown</span>
                  <span className="px-1.5 py-0.2 rounded bg-stone-200 text-stone-700 font-mono text-[10px]">
                    {dynamicNutrition.items.length} items analyzed
                  </span>
                </div>
                {showBreakdownTable ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
              </button>

              {showBreakdownTable && (
                <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-2xs animate-fadeIn">
                  <div className="overflow-x-auto max-h-72 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF6F0] border-b border-stone-200 text-stone-700 text-[10px] uppercase font-black tracking-wider sticky top-0 z-10">
                        <tr>
                          <th className="p-2.5 pl-3.5">Ingredient Item</th>
                          <th className="p-2.5">Recipe Qty</th>
                          <th className="p-2.5 text-center">Est. Grams</th>
                          <th className="p-2.5 text-right">Calories</th>
                          <th className="p-2.5 text-right">Protein</th>
                          <th className="p-2.5 text-right">Carbs</th>
                          <th className="p-2.5 text-right pr-3.5">Fats</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {dynamicNutrition.items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-amber-50/30 transition-colors">
                            <td className="p-2.5 pl-3.5 font-semibold text-stone-900">
                              <div>{item.originalItem}</div>
                              <div className="text-[10px] text-stone-400 font-normal">{item.matchedName}</div>
                            </td>
                            <td className="p-2.5 font-mono text-stone-600">
                              {formatQuantity(item.originalQuantity)}
                            </td>
                            <td className="p-2.5 text-center font-mono text-stone-500 text-[11px]">
                              {item.weightGrams}g
                            </td>
                            <td className="p-2.5 text-right font-black text-amber-900">
                              {item.calories} <span className="text-[9px] font-normal text-stone-400">kcal</span>
                            </td>
                            <td className="p-2.5 text-right font-mono text-emerald-800 font-bold">
                              {item.protein}g
                            </td>
                            <td className="p-2.5 text-right font-mono text-amber-800">
                              {item.carbs}g
                            </td>
                            <td className="p-2.5 text-right pr-3.5 font-mono text-rose-800">
                              {item.fat}g
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Social Media Direct Sharing Section */}
          <div className="bg-gradient-to-r from-amber-50/90 via-orange-50/60 to-amber-50/90 p-5 sm:p-6 rounded-2xl border border-amber-200/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-[#E8590C]" />
                  <h3 className="font-serif-title font-bold text-base text-[#2B1B17]">
                    Share this Recipe on Social Media
                  </h3>
                </div>
                <p className="text-xs text-stone-600 mt-0.5">
                  Know someone who loves Indian food? Share authentic {recipe.title} with your circles on WhatsApp, Twitter, or Facebook.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* WhatsApp */}
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => showToast('Opening WhatsApp to share recipe...')}
                className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-97 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                <span>WhatsApp</span>
              </a>

              {/* Twitter / X */}
              <a
                href={twitterShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => showToast('Opening Twitter / X to share recipe...')}
                className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-black hover:bg-stone-800 active:scale-97 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <TwitterXIcon className="w-3.5 h-3.5 fill-current shrink-0" />
                <span>Twitter / X</span>
              </a>

              {/* Facebook */}
              <a
                href={facebookShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => showToast('Opening Facebook to share recipe...')}
                className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] active:scale-97 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <FacebookIcon className="w-4 h-4 fill-current shrink-0" />
                <span>Facebook</span>
              </a>

              {/* Copy Link */}
              <button
                type="button"
                onClick={handleCopyLink}
                className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer border ${
                  copiedLink
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white hover:bg-stone-100 text-stone-800 border-stone-300'
                }`}
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-stone-600" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Community Reviews & Ratings */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="font-serif-title text-lg font-bold text-[#2B1B17]">
                Community Reviews & Tips ({recipe.comments.length})
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-stone-600 font-semibold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span className="tabular-nums">{recipe.rating.toFixed(1)}</span>
                <span className="text-stone-400">/ 5.0</span>
              </div>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="space-y-3 bg-[#FAF6F0] p-4 rounded-xl border border-stone-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-700">Leave your review & rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setCommentRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= commentRating ? 'fill-amber-400 text-amber-500' : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Share your experience cooking this dish or your family variations..."
                rows={2}
                className="w-full text-xs p-3 bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-[#E8590C]"
              />

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setShowReportModal(true)}
                  className="text-[11px] text-stone-400 hover:text-red-600 flex items-center gap-1"
                >
                  <ShieldAlert className="w-3 h-3" />
                  <span>Report recipe</span>
                </button>

                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#E8590C] rounded-lg hover:bg-[#D9480F] disabled:opacity-40 transition-colors"
                >
                  Post Review
                </button>
              </div>
            </form>

            {/* Existing Comments List */}
            {recipe.comments.length > 0 ? (
              <div className="space-y-3">
                {recipe.comments.map(c => (
                  <div key={c.id} className="p-3 bg-stone-50 rounded-lg text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={c.userAvatar}
                          alt={c.userName}
                          referrerPolicy="no-referrer"
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="font-semibold text-stone-900">{c.userName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span className="text-[11px] font-semibold text-stone-700">{c.rating || 5}</span>
                      </div>
                    </div>
                    <p className="text-stone-600 pl-7">{c.text}</p>
                    <div className="text-[10px] text-stone-400 pl-7">{c.createdAt}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-stone-400 text-center py-3">
                Be the first to share your cooking experience with this recipe!
              </div>
            )}
          </div>

          {/* Related Dishes */}
          {relatedRecipes.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="font-serif-title font-bold text-base text-[#2B1B17]">
                More from {recipe.state} & {recipe.category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedRecipes.map(r => (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRecipe(r)}
                    className="p-3 bg-white rounded-xl border border-stone-200 hover:border-[#E8590C] cursor-pointer transition-colors flex items-center gap-3"
                  >
                    <img
                      src={r.image}
                      alt={r.title}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="text-xs overflow-hidden">
                      <div className="font-bold text-stone-900 truncate">{r.title}</div>
                      <div className="text-[11px] text-stone-500">{r.totalTime}m · {r.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Report Modal */}
        {showReportModal && (
          <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-stone-900">Report Inappropriate Recipe</h3>
                <button onClick={() => setShowReportModal(false)} className="text-stone-400 hover:text-stone-600">✕</button>
              </div>
              <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-stone-600 mb-1">Reason for report:</label>
                  <select
                    value={reportReason}
                    onChange={e => setReportReason(e.target.value)}
                    className="w-full p-2 border border-stone-200 rounded-lg bg-stone-50"
                  >
                    <option>Inaccurate measurements or ingredients</option>
                    <option>Misleading photograph or title</option>
                    <option>Copyright or duplicate content</option>
                    <option>Harmful or offensive material</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">Additional details (optional):</label>
                  <textarea
                    value={reportDetails}
                    onChange={e => setReportDetails(e.target.value)}
                    rows={3}
                    placeholder="Provide details for our moderator..."
                    className="w-full p-2 border border-stone-200 rounded-lg"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-3 py-1.5 border border-stone-200 rounded-lg text-stone-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
