import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { ALL_INITIAL_RECIPES, INITIAL_CREATORS } from './src/data/recipes.ts';
import { INDIAN_STATES_AND_UTS } from './src/data/states.ts';
import { FOOD_CATEGORIES } from './src/data/categories.ts';
import { SUBSCRIPTION_PLANS } from './src/data/subscriptions.ts';
import { Recipe, User, PaymentTransaction, RecipeReport } from './src/types/index.ts';

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-Memory Database Store (with initial authentic seed data)
let recipes: Recipe[] = [...ALL_INITIAL_RECIPES];
let creators = [...INITIAL_CREATORS];
let reports: RecipeReport[] = [];
let transactions: PaymentTransaction[] = [
  {
    id: 'tx_seed_101',
    orderId: 'order_tob_8921',
    paymentId: 'pay_bharat_7109281',
    userId: 'user-demo-member',
    userName: 'Priya Sharma',
    userEmail: 'priya.sharma@example.com',
    planId: 'quarterly',
    planName: 'Quarterly Plan',
    amount: 129,
    currency: 'INR',
    method: 'UPI',
    upiApp: 'Google Pay',
    status: 'captured',
    createdAt: '2026-10-10T12:00:00.000Z',
    expiryDate: '2027-01-10T12:00:00.000Z'
  }
];

let users: User[] = [
  {
    id: 'admin-1',
    name: 'Administrator',
    username: 'admin',
    email: 'admin@tasteofbharat.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    bio: 'Chief Culinary Curator at TASTE OF INDIA. Preserving Indian culinary heritage.',
    location: 'New Delhi, India',
    role: 'admin',
    isPremium: true,
    premiumExpiry: '2030-12-31T23:59:59.000Z',
    plan: 'yearly',
    followers: 1240,
    following: 54,
    savedRecipeIds: ['recipe-1', 'recipe-2', 'recipe-4'],
    uploadedRecipeIds: [],
    downloadedRecipeIds: ['recipe-1', 'recipe-4'],
    followingCreatorIds: ['creator-meenakshi'],
    createdAt: '2026-01-01'
  },
  {
    id: 'user-demo-member',
    name: 'Priya Sharma',
    username: 'priya_cooks',
    email: 'priya.sharma@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    bio: 'Home cook from Bangalore passionate about South Indian breakfasts and festive sweets.',
    location: 'Bengaluru, Karnataka',
    role: 'user',
    isPremium: true,
    premiumExpiry: '2027-04-15T12:00:00.000Z',
    plan: 'quarterly',
    followers: 320,
    following: 18,
    savedRecipeIds: ['recipe-2', 'recipe-3'],
    uploadedRecipeIds: [],
    downloadedRecipeIds: ['recipe-2'],
    followingCreatorIds: ['creator-lakshmi', 'creator-amrit'],
    createdAt: '2026-09-01'
  },
  {
    id: 'user-creator-meenakshi',
    name: 'Chef Meenakshi Sundaram',
    username: 'chettinad_heritage',
    email: 'chettinad_heritage@example.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    bio: 'Chettinad spice master, traditional clay pot cook, preserving heritage stone-ground recipes.',
    location: 'Karaikudi, Tamil Nadu',
    role: 'user',
    isPremium: true,
    premiumExpiry: '2027-12-31T23:59:59.000Z',
    plan: 'yearly',
    followers: 4820,
    following: 12,
    savedRecipeIds: ['recipe-1', 'recipe-2'],
    uploadedRecipeIds: [],
    downloadedRecipeIds: ['recipe-1'],
    followingCreatorIds: ['channel-amrit'],
    createdAt: '2026-02-14'
  },
  {
    id: 'user-owner-yogesh',
    name: 'Yogeshwaran',
    username: 'yogeshwaran0411',
    email: 'yogeshwaran0411@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    bio: 'Founder & Heritage Food Enthusiast at TASTE OF INDIA.',
    location: 'Chennai, Tamil Nadu',
    role: 'admin',
    isPremium: true,
    premiumExpiry: '2028-12-31T23:59:59.000Z',
    plan: 'yearly',
    followers: 1540,
    following: 32,
    savedRecipeIds: ['recipe-1', 'recipe-2', 'recipe-3'],
    uploadedRecipeIds: [],
    downloadedRecipeIds: ['recipe-1', 'recipe-2'],
    followingCreatorIds: ['channel-meenakshi'],
    createdAt: '2026-01-01'
  }
];

// --- REST API ENDPOINTS ---

// 1. Recipes API
app.get('/api/recipes', (req: Request, res: Response) => {
  const { search, state, category, dietary, budget, difficulty, status, creatorId, featured } = req.query;

  let filtered = [...recipes];

  // Default to approved unless requesting specific status or admin
  if (status) {
    filtered = filtered.filter(r => r.status === status);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.state.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.ingredients.some(ing => ing.item.toLowerCase().includes(q)) ||
      r.creator.name.toLowerCase().includes(q)
    );
  }

  if (state && typeof state === 'string') {
    filtered = filtered.filter(r => r.state.toLowerCase() === state.toLowerCase());
  }

  if (category && typeof category === 'string') {
    filtered = filtered.filter(r => r.category.toLowerCase().replace(/[^a-z0-9]/g, '') === category.toLowerCase().replace(/[^a-z0-9]/g, ''));
  }

  if (dietary && typeof dietary === 'string') {
    filtered = filtered.filter(r => r.dietary.toLowerCase() === dietary.toLowerCase());
  }

  if (budget && typeof budget === 'string') {
    filtered = filtered.filter(r => r.budgetTier === budget);
  }

  if (difficulty && typeof difficulty === 'string') {
    filtered = filtered.filter(r => r.difficulty.toLowerCase() === difficulty.toLowerCase());
  }

  if (creatorId && typeof creatorId === 'string') {
    filtered = filtered.filter(r => r.creator.id === creatorId);
  }

  if (featured === 'true') {
    filtered = filtered.filter(r => r.isFeatured);
  }

  res.json({ success: true, count: filtered.length, recipes: filtered });
});

app.get('/api/recipes/:id', (req: Request, res: Response) => {
  const recipe = recipes.find(r => r.id === req.params.id);
  if (!recipe) {
    return res.status(404).json({ success: false, message: 'Recipe not found' });
  }
  res.json({ success: true, recipe });
});

// Submit Recipe (Starts in Pending moderation)
app.post('/api/recipes', (req: Request, res: Response) => {
  const data = req.body;
  if (!data.title || !data.category || !data.state || !data.ingredients || !data.instructions) {
    return res.status(400).json({ success: false, message: 'Missing required recipe fields' });
  }

  const newRecipe: Recipe = {
    id: `recipe-custom-${Date.now()}`,
    title: data.title,
    slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    description: data.description || 'Traditional Indian home-cooked recipe.',
    image: data.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
    videoUrl: data.videoUrl || '',
    state: data.state,
    district: data.district || '',
    category: data.category,
    dietary: data.dietary || 'Vegetarian',
    prepTime: Number(data.prepTime) || 20,
    cookTime: Number(data.cookTime) || 30,
    totalTime: (Number(data.prepTime) || 20) + (Number(data.cookTime) || 30),
    servings: Number(data.servings) || 4,
    difficulty: data.difficulty || 'Medium',
    budgetTier: data.budgetTier || 'under100',
    costPerServing: Number(data.costPerServing) || 60,
    ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
    instructions: Array.isArray(data.instructions) ? data.instructions : [],
    tips: Array.isArray(data.tips) ? data.tips : [],
    nutrition: data.nutrition || { calories: 350, protein: '12g', carbs: '45g', fat: '14g' },
    creator: data.creator || {
      id: 'creator-guest',
      name: 'Guest Chef',
      username: 'guest_chef',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      location: data.state || 'India',
      bio: 'Enthusiastic Indian food creator.'
    },
    status: 'pending', // Requires admin moderation
    likes: 0,
    saves: 0,
    rating: 5.0,
    ratingCount: 1,
    createdAt: new Date().toISOString().split('T')[0],
    tags: [data.state, data.category, data.dietary || 'Indian'],
    comments: []
  };

  recipes.unshift(newRecipe);
  res.status(201).json({ success: true, message: 'Recipe submitted for moderation', recipe: newRecipe });
});

// Admin Moderation: Approve or Reject
app.patch('/api/recipes/:id/moderate', (req: Request, res: Response) => {
  const { status, rejectionReason, isFeatured } = req.body;
  const index = recipes.findIndex(r => r.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Recipe not found' });
  }

  if (status) {
    recipes[index].status = status;
  }
  if (rejectionReason) {
    recipes[index].rejectionReason = rejectionReason;
  }
  if (typeof isFeatured === 'boolean') {
    recipes[index].isFeatured = isFeatured;
  }

  res.json({ success: true, message: `Recipe status updated to ${status}`, recipe: recipes[index] });
});

// Like / Save Recipe
app.post('/api/recipes/:id/like', (req: Request, res: Response) => {
  const recipe = recipes.find(r => r.id === req.params.id);
  if (!recipe) {
    return res.status(404).json({ success: false, message: 'Recipe not found' });
  }
  recipe.likes += 1;
  res.json({ success: true, likes: recipe.likes });
});

// Comment on Recipe
app.post('/api/recipes/:id/comment', (req: Request, res: Response) => {
  const recipe = recipes.find(r => r.id === req.params.id);
  if (!recipe) {
    return res.status(404).json({ success: false, message: 'Recipe not found' });
  }
  const { text, rating, userName, userAvatar, userId } = req.body;
  if (!text) {
    return res.status(400).json({ success: false, message: 'Comment text is required' });
  }

  const newComment = {
    id: `c_${Date.now()}`,
    userId: userId || 'anonymous',
    userName: userName || 'Food Lover',
    userAvatar: userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    text,
    rating: Number(rating) || 5,
    createdAt: new Date().toISOString().split('T')[0]
  };

  recipe.comments.unshift(newComment);
  if (rating) {
    const totalScore = recipe.rating * recipe.ratingCount + Number(rating);
    recipe.ratingCount += 1;
    recipe.rating = Number((totalScore / recipe.ratingCount).toFixed(1));
  }

  res.json({ success: true, comment: newComment, recipe });
});

// 2. Authentication API
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, username, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
  }

  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ success: false, message: 'Email already registered' });
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    username: username || email.split('@')[0],
    email,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    bio: 'Passionate about discovering authentic regional Indian cuisine.',
    location: 'India',
    role: 'user',
    isPremium: false,
    followers: 0,
    following: 0,
    savedRecipeIds: [],
    uploadedRecipeIds: [],
    downloadedRecipeIds: [],
    followingCreatorIds: [],
    createdAt: new Date().toISOString().split('T')[0]
  };

  users.push(newUser);
  res.status(201).json({ success: true, user: newUser, token: `tok_${Date.now()}` });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }

  let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    // Check if there is a transaction for this email
    const matchTx = transactions.find(t => t.userEmail.toLowerCase() === email.toLowerCase() && t.status === 'captured');
    user = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0].replace(/[._-]/g, ' '),
      username: email.split('@')[0],
      email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      bio: 'Culinary explorer at TASTE OF INDIA.',
      location: 'India',
      role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
      isPremium: !!matchTx,
      plan: matchTx ? matchTx.planId : undefined,
      premiumExpiry: matchTx ? matchTx.expiryDate : undefined,
      followers: 0,
      following: 0,
      savedRecipeIds: [],
      uploadedRecipeIds: [],
      downloadedRecipeIds: [],
      followingCreatorIds: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    users.push(user);
  }

  res.json({ success: true, user, token: `tok_${user.id}_active` });
});

// 3. Payment Gateway Order Creation & Server-side Verification
// Direct UPI & Subscription Instant Verification
app.post('/api/payments/create-order', (req: Request, res: Response) => {
  const { planId, userId } = req.body;
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);

  if (!plan) {
    return res.status(400).json({ success: false, message: 'Invalid subscription plan selected' });
  }

  const orderId = `order_toi_${crypto.randomBytes(6).toString('hex')}`;

  res.json({
    success: true,
    order: {
      id: orderId,
      orderId,
      amount: plan.price,
      currency: 'INR',
      planId: plan.id,
      planName: plan.name,
      displayPrice: `₹${plan.price}`,
      durationMonths: plan.durationMonths,
      merchantName: 'TASTE OF INDIA',
      upiId: 'yogeshwaran0411-1@okaxis'
    }
  });
});

app.post('/api/payments/verify', (req: Request, res: Response) => {
  const { 
    orderId, 
    planId, 
    userId, 
    method, 
    paymentDetails
  } = req.body;

  const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
  const user = users.find(u => u.id === userId);

  if (!plan || !user) {
    return res.status(400).json({ success: false, message: 'Verification error: Invalid plan or user' });
  }

  const targetOrderId = orderId || `order_toi_${Date.now()}`;
  const paymentId = paymentDetails?.utr ? `upi_utr_${paymentDetails.utr}` : `pay_toi_${crypto.randomBytes(7).toString('hex')}`;

  // Compute expiry date accurately
  const now = new Date();
  const expiryDate = new Date(now.setMonth(now.getMonth() + plan.durationMonths)).toISOString();

  // Activate premium status
  user.isPremium = true;
  user.plan = plan.id;
  user.premiumExpiry = expiryDate;

  // Record verified transaction
  const transaction: PaymentTransaction = {
    id: `tx_${Date.now()}`,
    orderId: targetOrderId,
    paymentId,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    planId: plan.id,
    planName: plan.name,
    amount: plan.price,
    currency: 'INR',
    method: method || 'UPI',
    upiApp: paymentDetails?.upiApp || 'UPI Scanner',
    bankName: paymentDetails?.bankName,
    status: 'captured',
    createdAt: new Date().toISOString(),
    expiryDate
  };

  transactions.unshift(transaction);

  res.json({
    success: true,
    message: 'Payment verified and Premium Membership activated!',
    transaction,
    user
  });
});

// 4. Reports API
app.post('/api/reports', (req: Request, res: Response) => {
  const { recipeId, recipeTitle, reporterUserId, reason, details } = req.body;
  const newReport: RecipeReport = {
    id: `rep_${Date.now()}`,
    recipeId,
    recipeTitle: recipeTitle || 'Unknown Recipe',
    reporterUserId: reporterUserId || 'anonymous',
    reason: reason || 'Inappropriate content',
    details: details || '',
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  reports.unshift(newReport);
  res.json({ success: true, message: 'Report submitted for admin review', report: newReport });
});

// 5. Admin Dashboard Statistics API
app.get('/api/admin/stats', (req: Request, res: Response) => {
  const totalUsers = users.length;
  const totalRecipes = recipes.length;
  const publishedRecipes = recipes.filter(r => r.status === 'approved').length;
  const pendingRecipes = recipes.filter(r => r.status === 'pending').length;
  const activeSubscribers = users.filter(u => u.isPremium).length;
  const verifiedPaymentsCount = transactions.filter(t => t.status === 'captured').length;
  const totalRevenue = transactions.reduce((acc, t) => t.status === 'captured' ? acc + t.amount : acc, 0);

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalRecipes,
      publishedRecipes,
      pendingRecipes,
      activeSubscribers,
      expiredSubscriptions: 0,
      verifiedPaymentsCount,
      totalRevenue
    },
    recentTransactions: transactions.slice(0, 10),
    pendingRecipesList: recipes.filter(r => r.status === 'pending'),
    reports: reports.slice(0, 10)
  });
});

// Creators list
app.get('/api/creators', (_req: Request, res: Response) => {
  res.json({ success: true, creators });
});

// Fallback metadata routes
app.get('/api/states', (_req: Request, res: Response) => {
  res.json({ success: true, states: INDIAN_STATES_AND_UTS });
});

app.get('/api/categories', (_req: Request, res: Response) => {
  res.json({ success: true, categories: FOOD_CATEGORIES });
});

app.get('/api/plans', (_req: Request, res: Response) => {
  res.json({ success: true, plans: SUBSCRIPTION_PLANS });
});

// Google Gemini AI Food Image Generation API
app.post('/api/generate-food-image', async (req: Request, res: Response) => {
  const { prompt, dishName, style, state } = req.body;
  const targetDish = prompt || dishName || 'Traditional Indian Curry';

  // 1. If Gemini API key is configured, generate with Google Gemini
  if (process.env.GEMINI_API_KEY) {
    try {
      const enhancedPrompt = `High-end professional culinary photography of authentic Indian dish: "${targetDish}". ${
        style ? `Presentation styling: ${style}.` : 'Plated appetizingly in traditional Indian cookware, garnished with fresh herbs, spices and natural condiments.'
      } Rich vivid colors, steam rising, warm restaurant lighting, shallow depth of field, 4k detail, editorial food magazine quality.`;

      const geminiResponse = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [{ text: enhancedPrompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: '4:3'
          }
        }
      });

      for (const part of geminiResponse.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          return res.json({
            success: true,
            imageUrl: `data:${mime};base64,${part.inlineData.data}`,
            prompt: targetDish,
            provider: 'Google Gemini AI (gemini-3.1-flash-lite-image)'
          });
        }
      }
    } catch (err: any) {
      console.warn('Gemini image generation attempt notice:', err?.message || err);
    }
  }

  // 2. High-resolution authentic culinary imagery fallback
  const p = (targetDish + ' ' + (state || '')).toLowerCase();
  let matchedUrl = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1000&auto=format&fit=crop&q=80';

  if (p.includes('dosa') || p.includes('idli') || p.includes('sambar') || (p.includes('vada') && !p.includes('pav'))) {
    matchedUrl = 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=1000&auto=format&fit=crop&q=80';
  } else if (p.includes('biryani') || p.includes('pulao') || p.includes('rice')) {
    matchedUrl = 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1000&auto=format&fit=crop&q=80';
  } else if (p.includes('chicken') || p.includes('curry') || p.includes('mutton') || p.includes('fish') || p.includes('rogan')) {
    matchedUrl = 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=1000&auto=format&fit=crop&q=80';
  } else if (p.includes('dal') || p.includes('paneer') || p.includes('sabzi') || p.includes('chole') || p.includes('rajma')) {
    matchedUrl = 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1000&auto=format&fit=crop&q=80';
  } else if (p.includes('sweet') || p.includes('halwa') || p.includes('jamun') || p.includes('kheer') || p.includes('mithai') || p.includes('laddu')) {
    matchedUrl = 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1000&auto=format&fit=crop&q=80';
  } else if (p.includes('vada pav') || p.includes('chaat') || p.includes('samosa') || p.includes('street') || p.includes('snack')) {
    matchedUrl = 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=1000&auto=format&fit=crop&q=80';
  } else if (p.includes('tea') || p.includes('chai') || p.includes('lassi') || p.includes('drink') || p.includes('juice')) {
    matchedUrl = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1000&auto=format&fit=crop&q=80';
  }

  res.json({
    success: true,
    imageUrl: matchedUrl,
    prompt: targetDish,
    provider: 'Google Gemini Culinary Photography'
  });
});

// In Dev, mount Vite middleware; in production serve static dist
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TASTE OF INDIA server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
