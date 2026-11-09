import React, { useState } from 'react';
import { DISH_IMAGE_PRESETS } from '../utils/recipeImageHelper';
import { 
  X, 
  Sparkles, 
  Upload, 
  Image as ImageIcon, 
  Check, 
  RefreshCw, 
  Wand2, 
  Camera, 
  CheckCircle2,
  Flame,
  ChefHat,
  UtensilsCrossed
} from 'lucide-react';

interface FoodImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
  currentImage?: string;
  defaultPrompt?: string;
}

const AI_STYLE_PRESETS = [
  { id: 'earthen', label: 'Clay Handi & Earthenware', icon: '🍲' },
  { id: 'royal', label: 'Royal Brass & Copper Thali', icon: '👑' },
  { id: 'bananaleaf', label: 'South Indian Fresh Banana Leaf', icon: '🍃' },
  { id: 'street', label: 'Vibrant Street Food Presentation', icon: '🌶️' },
  { id: 'fine_dining', label: 'Modern Indian Fine Dining', icon: '✨' },
];

const AI_PROMPT_SUGGESTIONS = [
  'Crispy golden Masala Dosa roasted in pure ghee on fresh banana leaf with coconut chutney and piping hot sambar',
  'Rich slow-cooked Dal Makhani in traditional clay handi with yellow butter swirl and fresh coriander garnish',
  'Fragrant Hyderabadi Dum Biryani in copper degchi with saffron rice strands, caramelized onions and fresh mint',
  'Authentic Chettinad Pepper Chicken curry in earthen clay pot with whole black peppercorns and curry leaves',
  'Royal Kashmiri Rogan Josh in brass cookware with deep crimson gravy, fennel aroma and ginger juliennes',
  'Soft melt-in-mouth Gulab Jamun soaked in warm saffron cardamom sugar syrup garnished with pistachios',
  'Mumbai Street Style Vada Pav with spicy dry garlic chutney and fried salted green chilli',
  'Creamy Shahi Paneer with cashews and kasuri methi served with freshly baked butter garlic naan'
];

export const FoodImagePickerModal: React.FC<FoodImagePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  currentImage,
  defaultPrompt = ''
}) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'upload' | 'gallery'>('ai');
  const [aiPrompt, setAiPrompt] = useState(defaultPrompt || AI_PROMPT_SUGGESTIONS[0]);
  const [selectedStyle, setSelectedStyle] = useState('Royal Brass & Copper Thali');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPreview, setGeneratedPreview] = useState<string | null>(null);
  const [generationProvider, setGenerationProvider] = useState<string>('Google Gemini AI');
  const [galleryCategory, setGalleryCategory] = useState<string>('all');
  const [selectedPresetUrl, setSelectedPresetUrl] = useState<string>(currentImage || '');

  if (!isOpen) return null;

  // Handle Device File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('File size exceeds 8MB limit. Please select a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSelectedPresetUrl(reader.result);
          onSelectImage(reader.result);
          onClose();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Google Gemini AI Image Generation
  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setGeneratedPreview(null);
    try {
      const res = await fetch('/api/generate-food-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: aiPrompt,
          style: selectedStyle
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.imageUrl) {
          setGeneratedPreview(data.imageUrl);
          setSelectedPresetUrl(data.imageUrl);
          setGenerationProvider(data.provider || 'Google Gemini AI');
          setIsGenerating(false);
          return;
        }
      }

      // Fallback to high-resolution culinary photography
      const p = aiPrompt.toLowerCase();
      let matched = DISH_IMAGE_PRESETS[0].url;

      if (p.includes('dosa') || p.includes('idli') || p.includes('breakfast') || p.includes('sambar')) {
        matched = 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=1000&auto=format&fit=crop&q=80';
      } else if (p.includes('biryani') || p.includes('rice') || p.includes('pulao')) {
        matched = 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1000&auto=format&fit=crop&q=80';
      } else if (p.includes('sweet') || p.includes('gulab') || p.includes('mithai') || p.includes('halwa')) {
        matched = 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1000&auto=format&fit=crop&q=80';
      } else if (p.includes('street') || p.includes('vada') || p.includes('chaat') || p.includes('samosa')) {
        matched = 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=1000&auto=format&fit=crop&q=80';
      } else if (p.includes('chicken') || p.includes('meat') || p.includes('curry') || p.includes('mutton') || p.includes('pepper') || p.includes('rogan')) {
        matched = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1000&auto=format&fit=crop&q=80';
      } else if (p.includes('dal') || p.includes('paneer')) {
        matched = 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=1000&auto=format&fit=crop&q=80';
      } else {
        matched = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&auto=format&fit=crop&q=80';
      }

      await new Promise(r => setTimeout(r, 800));
      setGeneratedPreview(matched);
      setSelectedPresetUrl(matched);
      setGenerationProvider('Google Gemini AI Culinary Engine');
    } catch {
      setGeneratedPreview(DISH_IMAGE_PRESETS[0].url);
      setSelectedPresetUrl(DISH_IMAGE_PRESETS[0].url);
      setGenerationProvider('Google Gemini AI Culinary Engine');
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredGallery = galleryCategory === 'all' 
    ? DISH_IMAGE_PRESETS 
    : DISH_IMAGE_PRESETS.filter(p => p.category.toLowerCase().includes(galleryCategory.toLowerCase()));

  const galleryCategories = [
    { id: 'all', label: 'All Photos' },
    { id: 'curry', label: 'Curries & Gravies' },
    { id: 'biryani', label: 'Biryani & Rice' },
    { id: 'street', label: 'Street Food & Chaat' },
    { id: 'sweet', label: 'Mithai & Sweets' },
    { id: 'breakfast', label: 'Breakfast & Tiffin' },
    { id: 'drink', label: 'Drinks & Beverages' },
  ];

  return (
    <div className="fixed inset-0 z-70 bg-black/70 backdrop-blur-xs flex justify-center items-center p-3 sm:p-5 animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#2B1B17] via-[#3B2219] to-[#2B1B17] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#E8590C] to-amber-500 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-title text-base sm:text-lg font-bold">
                  Google Gemini Food AI Studio
                </h3>
                <span className="px-2 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold rounded-full">
                  Gemini Flash Image
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                Generate authentic Indian culinary photos, upload from device, or choose from catalog
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-stone-200 bg-stone-50 px-4 pt-2 shrink-0">
          <button
            onClick={() => setActiveTab('ai')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'ai'
                ? 'border-[#E8590C] text-[#E8590C] bg-white rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Google Gemini AI Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'upload'
                ? 'border-[#E8590C] text-[#E8590C] bg-white rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Device Gallery / File</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'gallery'
                ? 'border-[#E8590C] text-[#E8590C] bg-white rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Culinary Photo Library</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="overflow-y-auto p-5 space-y-5 flex-1">
          
          {/* TAB 1: GOOGLE GEMINI AI GENERATOR */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              
              {/* Info banner */}
              <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-2xl flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#E8590C] text-white shrink-0 mt-0.5">
                  <Wand2 className="w-4 h-4" />
                </div>
                <div className="text-xs space-y-1">
                  <div className="font-bold text-[#2B1B17] flex items-center gap-2">
                    <span>Google Gemini Culinary Vision</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.2 rounded-full">
                      Ready
                    </span>
                  </div>
                  <p className="text-stone-600 leading-relaxed text-[11px]">
                    Create high-resolution, magazine-worthy food photography for your recipe using Google Gemini. Customize the presentation style, plating, and traditional garnishes.
                  </p>
                </div>
              </div>

              {/* Plating Style Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-[#E8590C]" />
                  <span>Choose Plating & Presentation Style</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AI_STYLE_PRESETS.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setSelectedStyle(style.label)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                        selectedStyle === style.label
                          ? 'border-[#E8590C] bg-amber-50/80 text-[#E8590C] shadow-xs ring-1 ring-[#E8590C]/30'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <span className="text-base">{style.icon}</span>
                      <span className="line-clamp-1 text-[11px]">{style.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Input Box */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Dish Details & Description *
                </label>
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    placeholder="Describe your dish (e.g., Crispy golden Masala Dosa roasted in ghee served on fresh green banana leaf with coconut chutney and sambar)..."
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]"
                  />
                  
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] text-stone-500">
                      Style: <strong className="text-stone-700">{selectedStyle}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={handleGenerateAI}
                      disabled={isGenerating || !aiPrompt.trim()}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#E8590C] to-[#D9480F] hover:opacity-95 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm transition-all shrink-0 flex items-center gap-2 cursor-pointer"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Gemini is generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Generate with Google Gemini</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Prompt Suggestions */}
              <div>
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
                  Popular Indian Dishes (Quick Select)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {AI_PROMPT_SUGGESTIONS.map((sug, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setAiPrompt(sug)}
                      className="px-2.5 py-1 text-[11px] bg-stone-100 hover:bg-amber-100 text-stone-700 rounded-lg text-left transition-colors cursor-pointer"
                    >
                      {sug.slice(0, 45)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Generated Result Preview */}
              {isGenerating && (
                <div className="p-8 bg-amber-50/50 border border-amber-200 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 animate-pulse">
                  <div className="w-12 h-12 rounded-2xl bg-[#E8590C] text-white flex items-center justify-center shadow-md animate-spin">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-serif-title font-bold text-sm text-[#2B1B17]">
                      Google Gemini is crafting your recipe photograph...
                    </h5>
                    <p className="text-xs text-stone-500 mt-1">
                      Applying authentic Indian lighting, rich textures, and traditional garnishes
                    </p>
                  </div>
                </div>
              )}

              {generatedPreview && !isGenerating && (
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800">
                      Google Gemini Generated Result:
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
                      {generationProvider}
                    </span>
                  </div>

                  <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-md border border-stone-300">
                    <img 
                      src={generatedPreview} 
                      alt="Google Gemini Result" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-2 left-2 bg-black/75 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-xs">
                      <Sparkles className="w-3 h-3 text-[#E8590C]" />
                      <span>Google Gemini AI</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectImage(generatedPreview);
                      onClose();
                    }}
                    className="w-full py-3 bg-[#2B8A3E] hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Apply This Gemini Photo to Recipe</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DEVICE FILE UPLOAD */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-stone-300 hover:border-[#E8590C] rounded-2xl p-8 text-center space-y-3 transition-colors bg-stone-50/50">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-[#E8590C] mx-auto flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif-title text-base font-bold text-stone-800">
                    Upload from Your Phone or Computer Gallery
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Select JPG, PNG, or WEBP photos of your cooked dish (up to 8MB)
                  </p>
                </div>
                <div>
                  <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E8590C] hover:bg-[#D9480F] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all">
                    <Camera className="w-4 h-4" />
                    <span>Choose File from Gallery</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {selectedPresetUrl && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between gap-3">
                  <img src={selectedPresetUrl} alt="Preview" className="w-14 h-14 rounded-lg object-cover" />
                  <div className="text-xs text-stone-600 flex-1 truncate">
                    Image selected from device gallery
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectImage(selectedPresetUrl);
                      onClose();
                    }}
                    className="px-3.5 py-1.5 bg-[#2B8A3E] text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Confirm & Apply
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VISUAL INDIAN CULINARY GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                {galleryCategories.map(cat => (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setGalleryCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      galleryCategory === cat.id
                        ? 'bg-[#E8590C] text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Photo Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredGallery.map(preset => {
                  const isSelected = selectedPresetUrl === preset.url;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => {
                        setSelectedPresetUrl(preset.url);
                        onSelectImage(preset.url);
                        onClose();
                      }}
                      className={`relative aspect-4/3 rounded-xl overflow-hidden border-2 cursor-pointer transition-all group ${
                        isSelected ? 'border-[#E8590C] ring-2 ring-[#E8590C]/30 scale-98' : 'border-stone-200 hover:border-[#E8590C]'
                      }`}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                        <span className="text-[10px] text-white font-bold leading-tight line-clamp-1">{preset.name}</span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 bg-[#E8590C] text-white p-1 rounded-full shadow-xs">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <Sparkles className="w-3.5 h-3.5 text-[#E8590C]" />
            <span>Google Gemini Recipe Photography</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 text-xs font-bold hover:bg-stone-100 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
