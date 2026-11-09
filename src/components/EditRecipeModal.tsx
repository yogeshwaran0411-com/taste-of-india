import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Recipe, DietaryType, DifficultyLevel, SpiceLevel, Ingredient } from '../types';
import { INDIAN_STATES_AND_UTS } from '../data/states';
import { FOOD_CATEGORIES } from '../data/categories';
import { FoodImagePickerModal } from './FoodImagePickerModal';
import { 
  X, 
  Trash2, 
  Plus, 
  Sparkles, 
  Upload, 
  Image as ImageIcon, 
  Save, 
  AlertTriangle,
  Flame,
  Wheat,
  Clock,
  Users,
  ChefHat
} from 'lucide-react';

interface EditRecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
}

export const EditRecipeModal: React.FC<EditRecipeModalProps> = ({ recipe, onClose }) => {
  const { updateRecipe, deleteRecipe, currentUser, showToast } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Lunch');
  const [state, setState] = useState('Tamil Nadu');
  const [district, setDistrict] = useState('');
  const [dietary, setDietary] = useState<DietaryType>('Vegetarian');
  const [isGlutenFree, setIsGlutenFree] = useState(false);
  const [spiceLevel, setSpiceLevel] = useState<SpiceLevel>('Medium');
  const [prepTime, setPrepTime] = useState(20);
  const [cookTime, setCookTime] = useState(30);
  const [servings, setServings] = useState(4);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');
  const [image, setImage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [culturalStory, setCulturalStory] = useState('');
  const [allergensText, setAllergensText] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [tips, setTips] = useState<string[]>([]);

  // Image Picker Modal
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title || '');
      setDescription(recipe.description || '');
      setCategory(recipe.category || 'Lunch');
      setState(recipe.state || 'Tamil Nadu');
      setDistrict(recipe.district || '');
      setDietary(recipe.dietary || 'Vegetarian');
      setIsGlutenFree(!!recipe.isGlutenFree);
      setSpiceLevel(recipe.spiceLevel || 'Medium');
      setPrepTime(recipe.prepTime || 20);
      setCookTime(recipe.cookTime || 30);
      setServings(recipe.servings || 4);
      setDifficulty(recipe.difficulty || 'Medium');
      setImage(recipe.image || '');
      setVideoUrl(recipe.videoUrl || '');
      setCulturalStory(recipe.culturalStory || '');
      setAllergensText(Array.isArray(recipe.allergens) ? recipe.allergens.join(', ') : '');
      setIngredients(recipe.ingredients?.length ? [...recipe.ingredients] : [{ item: '', quantity: '', notes: '' }]);
      setInstructions(recipe.instructions?.length ? [...recipe.instructions] : ['']);
      setTips(recipe.tips?.length ? [...recipe.tips] : ['']);
      setShowDeleteConfirm(false);
    }
  }, [recipe]);

  if (!recipe) return null;

  // Ingredient Handlers
  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
    setIngredients(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddIngredient = () => {
    setIngredients(prev => [...prev, { item: '', quantity: '', notes: '' }]);
  };

  const handleRemoveIngredient = (index: number) => {
    if (ingredients.length <= 1) {
      showToast('At least one ingredient is required.');
      return;
    }
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  // Instruction Handlers
  const handleInstructionChange = (index: number, value: string) => {
    setInstructions(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleAddInstruction = () => {
    setInstructions(prev => [...prev, '']);
  };

  const handleRemoveInstruction = (index: number) => {
    if (instructions.length <= 1) {
      showToast('At least one cooking step is required.');
      return;
    }
    setInstructions(prev => prev.filter((_, i) => i !== index));
  };

  // Tip Handlers
  const handleTipChange = (index: number, value: string) => {
    setTips(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleAddTip = () => {
    setTips(prev => [...prev, '']);
  };

  const handleRemoveTip = (index: number) => {
    setTips(prev => prev.filter((_, i) => i !== index));
  };

  // Form Submit
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter a recipe title.');
      return;
    }

    const cleanIngredients = ingredients.filter(ing => ing.item.trim() !== '');
    if (cleanIngredients.length === 0) {
      showToast('Please provide at least one valid ingredient with measurement.');
      return;
    }

    const cleanInstructions = instructions.filter(step => step.trim() !== '');
    if (cleanInstructions.length === 0) {
      showToast('Please provide at least one cooking step instruction.');
      return;
    }

    const allergensList = allergensText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const updatedData: Partial<Recipe> = {
      title: title.trim(),
      description: description.trim(),
      category,
      state,
      district: district.trim(),
      dietary,
      isGlutenFree,
      spiceLevel,
      prepTime: Number(prepTime) || 15,
      cookTime: Number(cookTime) || 20,
      totalTime: (Number(prepTime) || 15) + (Number(cookTime) || 20),
      servings: Number(servings) || 4,
      difficulty,
      image: image.trim(),
      videoUrl: videoUrl.trim(),
      culturalStory: culturalStory.trim(),
      allergens: allergensList,
      ingredients: cleanIngredients,
      instructions: cleanInstructions,
      tips: tips.filter(t => t.trim() !== ''),
      status: 'approved' // Automatically live for creator
    };

    updateRecipe(recipe.id, updatedData);
    onClose();
  };

  const handleDelete = () => {
    if (currentUser?.isBanned && currentUser?.role !== 'admin') {
      showToast('Action Blocked: Your account is restricted by Admin from deleting recipes.');
      return;
    }
    deleteRecipe(recipe.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#FAF6F0] w-full max-w-4xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-[#2B1B17] text-white px-6 py-4 flex items-center justify-between shrink-0 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#E8590C]/20 border border-[#E8590C]/40 rounded-xl text-[#E8590C]">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-title text-lg sm:text-xl font-bold">
                Edit Recipe: {recipe.title}
              </h2>
              <p className="text-xs text-stone-300">
                Update measurements, cooking steps, images, or delete recipe
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="overflow-y-auto p-4 sm:p-6 space-y-6 text-xs grow">
          
          {/* Main Recipe Info */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4 shadow-xs">
            <h3 className="font-serif-title text-sm font-bold text-[#2B1B17] border-b border-stone-100 pb-2">
              General Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Recipe Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Traditional Chettinad Pepper Chicken"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/40 text-stone-900 font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Aromatic, slow-cooked heritage recipe..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/40 text-stone-900"
                />
              </div>

              {/* State & District */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">State / UT</label>
                <select
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/40"
                >
                  {INDIAN_STATES_AND_UTS.map(st => (
                    <option key={st.id} value={st.name}>{st.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">District / Region</label>
                <input
                  type="text"
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  placeholder="e.g. Sivaganga / Karaikudi"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/40"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/40"
                >
                  {FOOD_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Dietary */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Dietary Type</label>
                <select
                  value={dietary}
                  onChange={e => setDietary(e.target.value as DietaryType)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/40 font-semibold"
                >
                  <option value="Vegetarian">🟢 Vegetarian</option>
                  <option value="Non-Vegetarian">🔴 Non-Vegetarian</option>
                  <option value="Vegan">🌱 Vegan (100% Plant-Based)</option>
                </select>
              </div>
            </div>

            {/* Granular Attributes: Gluten-Free & Spice Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
              
              {/* Spice Level */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#E8590C]" />
                  <span>Spice Level</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['Mild', 'Medium', 'Spicy', 'Extra Hot'] as SpiceLevel[]).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSpiceLevel(lvl)}
                      className={`py-1.5 px-2 rounded-lg text-center font-bold text-[11px] transition-all cursor-pointer ${
                        spiceLevel === lvl
                          ? lvl === 'Mild'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : lvl === 'Medium'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : lvl === 'Spicy'
                            ? 'bg-orange-600 text-white shadow-xs'
                            : 'bg-red-600 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {lvl === 'Mild' && '🌶️ Mild'}
                      {lvl === 'Medium' && '🌶️🌶️ Med'}
                      {lvl === 'Spicy' && '🌶️🌶️🌶️ Hot'}
                      {lvl === 'Extra Hot' && '🔥 Fiery'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gluten Free Toggle */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <Wheat className="w-3.5 h-3.5 text-amber-600" />
                  <span>Dietary Preference</span>
                </label>
                <label className="flex items-center gap-2.5 p-2 rounded-xl border border-stone-200 bg-[#FAF6F0]/50 cursor-pointer hover:bg-stone-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={isGlutenFree}
                    onChange={e => setIsGlutenFree(e.target.checked)}
                    className="w-4 h-4 text-[#E8590C] rounded focus:ring-[#E8590C]"
                  />
                  <div>
                    <div className="font-bold text-stone-800 text-xs">Gluten-Free Recipe</div>
                    <div className="text-[10px] text-stone-500">Free of wheat, maida, sooji, or atta</div>
                  </div>
                </label>
              </div>

            </div>

            {/* Timings, Servings, Difficulty */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">Prep Time (min)</label>
                <input
                  type="number"
                  min="1"
                  value={prepTime}
                  onChange={e => setPrepTime(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-[#FAF6F0]/40 text-center font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">Cook Time (min)</label>
                <input
                  type="number"
                  min="1"
                  value={cookTime}
                  onChange={e => setCookTime(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-[#FAF6F0]/40 text-center font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">Servings</label>
                <input
                  type="number"
                  min="1"
                  value={servings}
                  onChange={e => setServings(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-[#FAF6F0]/40 text-center font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full px-2 py-2 rounded-xl border border-stone-300 bg-[#FAF6F0]/40 text-center font-bold"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                  <option value="Master">Master</option>
                </select>
              </div>
            </div>

          </div>

          {/* Recipe Food Image Section with AI & Gallery Options */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2">
              <div>
                <h3 className="font-serif-title text-sm font-bold text-[#2B1B17]">
                  Recipe Food Photo & Media
                </h3>
                <p className="text-[11px] text-stone-500">
                  Generate with Food AI, upload from your phone gallery/camera, or pick authentic food photography
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsImagePickerOpen(true)}
                className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-[#E8590C] hover:opacity-95 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Google Gemini Food AI & Gallery</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div className="sm:col-span-1">
                <div className="relative aspect-4/3 rounded-xl overflow-hidden border-2 border-amber-300 shadow-sm bg-stone-100">
                  <img
                    src={image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80'}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    Current Dish Photo
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2 space-y-2">
                <label className="block text-xs font-bold text-stone-700">
                  Image Direct URL / Source
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-[#FAF6F0]/40 text-stone-800"
                />

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsImagePickerOpen(true)}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-[#E8590C]" />
                    <span>Generate AI Food Image</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsImagePickerOpen(true)}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3 text-stone-600" />
                    <span>Upload from Device Gallery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsImagePickerOpen(true)}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <ImageIcon className="w-3 h-3 text-stone-600" />
                    <span>Curated Gallery</span>
                  </button>
                </div>

                <div className="pt-2">
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    Optional Cooking Video URL (YouTube, MP4, etc.)
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={e => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3.5 py-1.5 rounded-xl border border-stone-300 bg-[#FAF6F0]/40 text-stone-800 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Exact Ingredients with Quantities */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div>
                <h3 className="font-serif-title text-sm font-bold text-[#2B1B17]">
                  Ingredients with Exact Measurements <span className="text-red-500">*</span>
                </h3>
                <p className="text-[11px] text-stone-500">
                  Every recipe must have exact measurements (grams, cups, spoons)
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddIngredient}
                className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Ingredient</span>
              </button>
            </div>

            <div className="space-y-2">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-6 text-center text-stone-400 font-bold text-[11px]">
                    {idx + 1}.
                  </div>
                  <input
                    type="text"
                    required
                    value={ing.item}
                    onChange={e => handleIngredientChange(idx, 'item', e.target.value)}
                    placeholder="Ingredient item (e.g. Toor Dal)"
                    className="flex-2 px-3 py-1.5 rounded-xl border border-stone-300 bg-[#FAF6F0]/40"
                  />
                  <input
                    type="text"
                    required
                    value={ing.quantity}
                    onChange={e => handleIngredientChange(idx, 'quantity', e.target.value)}
                    placeholder="Exact quantity (e.g. 1 cup / 200g)"
                    className="flex-1.5 px-3 py-1.5 rounded-xl border border-stone-300 bg-[#FAF6F0]/40"
                  />
                  <input
                    type="text"
                    value={ing.notes || ''}
                    onChange={e => handleIngredientChange(idx, 'notes', e.target.value)}
                    placeholder="Notes (e.g. soaked for 20m)"
                    className="hidden sm:block flex-1.5 px-3 py-1.5 rounded-xl border border-stone-300 bg-[#FAF6F0]/40 text-stone-600"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(idx)}
                    className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div>
                <h3 className="font-serif-title text-sm font-bold text-[#2B1B17]">
                  Step-by-Step Cooking Instructions <span className="text-red-500">*</span>
                </h3>
                <p className="text-[11px] text-stone-500">
                  Numbered sequential steps guiding home cooks through the preparation
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddInstruction}
                className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Step</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {instructions.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-6 pt-2 text-center text-[#E8590C] font-black text-xs">
                    {idx + 1}.
                  </div>
                  <textarea
                    rows={2}
                    required
                    value={step}
                    onChange={e => handleInstructionChange(idx, e.target.value)}
                    placeholder={`Step ${idx + 1} instruction...`}
                    className="grow px-3.5 py-2 rounded-xl border border-stone-300 bg-[#FAF6F0]/40 text-stone-900"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveInstruction(idx)}
                    className="p-1.5 mt-1 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    title="Remove step"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cultural Story, Tips & Allergens */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4 shadow-xs">
            <h3 className="font-serif-title text-sm font-bold text-[#2B1B17] border-b border-stone-100 pb-2">
              Heritage Story, Chef Tips & Allergens
            </h3>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Cultural Story & Regional Heritage Intro
              </label>
              <textarea
                rows={2}
                value={culturalStory}
                onChange={e => setCulturalStory(e.target.value)}
                placeholder="Family history, cultural significance or festive origins..."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-[#FAF6F0]/40"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  Special Cooking Tips & Secrets
                </label>
                <button
                  type="button"
                  onClick={handleAddTip}
                  className="text-[11px] font-bold text-[#E8590C] hover:underline"
                >
                  + Add Tip
                </button>
              </div>
              <div className="space-y-2">
                {tips.map((tip, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tip}
                      onChange={e => handleTipChange(idx, e.target.value)}
                      placeholder="e.g. Roast whole spices on low flame for optimal fragrance"
                      className="grow px-3 py-1.5 rounded-xl border border-stone-300 bg-[#FAF6F0]/40"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveTip(idx)}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Allergen Information (comma separated)
              </label>
              <input
                type="text"
                value={allergensText}
                onChange={e => setAllergensText(e.target.value)}
                placeholder="e.g. Dairy, Mustard, Peanuts"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-[#FAF6F0]/40"
              />
            </div>
          </div>

          {/* Delete Danger Zone */}
          <div className="bg-red-50/60 p-4 rounded-2xl border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-red-900">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <div className="font-bold text-xs">Delete this recipe</div>
                <div className="text-[11px] text-red-700">Once deleted, this recipe will be permanently removed.</div>
              </div>
            </div>

            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3.5 py-1.5 bg-white border border-red-300 hover:bg-red-100 text-red-700 font-bold rounded-xl text-xs transition-colors cursor-pointer self-start sm:self-auto"
              >
                Delete Recipe
              </button>
            ) : (
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
                >
                  Confirm Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-2.5 py-1.5 bg-stone-200 text-stone-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 sticky bottom-0 bg-[#FAF6F0] py-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded-xl font-bold text-xs cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#E8590C] hover:bg-[#D9480F] text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>

        </form>

        {/* Food Image Picker Modal (AI + Device Gallery + Curated Gallery) */}
        <FoodImagePickerModal
          isOpen={isImagePickerOpen}
          onClose={() => setIsImagePickerOpen(false)}
          onSelectImage={(newUrl) => setImage(newUrl)}
          currentImage={image}
          defaultPrompt={title ? `${title} authentic traditional Indian dish` : ''}
        />

      </div>
    </div>
  );
};
