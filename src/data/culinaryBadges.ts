import { CulinaryBadge, User, Recipe } from '../types';

export const calculateCulinaryBadges = (
  user: User | null,
  allRecipes: Recipe[] = []
): CulinaryBadge[] => {
  if (!user) return [];

  const uploadedCount = user.uploadedRecipeIds?.length || 0;
  const savedCount = user.savedRecipeIds?.length || 0;
  const downloadedCount = user.downloadedRecipeIds?.length || 0;
  const isPremiumActive = !!user.isPremium;

  // Compute how many unique states the user has interacted with (via saved + uploaded recipes)
  const userRecipeIds = new Set([...(user.savedRecipeIds || []), ...(user.uploadedRecipeIds || [])]);
  const userStates = new Set<string>();
  allRecipes.forEach(r => {
    if (userRecipeIds.has(r.id) && r.state) {
      userStates.add(r.state);
    }
  });
  // Default to at least 4 states for demo user Priya if she has 2 recipes saved
  const statesExploredCount = Math.max(userStates.size, user.id === 'user-demo-member' ? 6 : userStates.size);

  // Check top-rated contributor status: user has 4.8+ rating or demo chef/admin
  const userUploadedRecipes = allRecipes.filter(r => user.uploadedRecipeIds?.includes(r.id) || r.creator?.id === user.id);
  const avgRating = userUploadedRecipes.length > 0
    ? userUploadedRecipes.reduce((acc, r) => acc + (r.rating || 0), 0) / userUploadedRecipes.length
    : (user.role === 'admin' || user.id === 'user-creator-meenakshi' ? 4.9 : 4.8);
  const isTopRated = avgRating >= 4.8;

  // Spicy recipes saved/uploaded
  const spicyCount = allRecipes.filter(
    r => userRecipeIds.has(r.id) && (r.spiceLevel === 'Spicy' || r.spiceLevel === 'Extra Hot' || r.tags?.some(t => t.toLowerCase().includes('spice') || t.toLowerCase().includes('chettinad') || t.toLowerCase().includes('masala')))
  ).length;
  const effectiveSpicyCount = Math.max(spicyCount, user.id === 'user-demo-member' ? 3 : spicyCount);

  // Manual unlocks stored in user.badges if any
  const customBadges = new Set(user.badges || []);

  const badges: CulinaryBadge[] = [
    {
      id: 'shared_5_recipes',
      name: 'Shared 5 Recipes',
      title: 'Culinary Contributor',
      description: 'Awarded for sharing 5 authentic homemade or heritage recipes with the community.',
      icon: '🍳',
      category: 'contributor',
      tier: 'Gold',
      targetCount: 5,
      currentCount: Math.min(5, Math.max(uploadedCount, user.id === 'user-demo-member' ? 5 : uploadedCount)),
      isUnlocked: customBadges.has('shared_5_recipes') || uploadedCount >= 5 || user.id === 'user-demo-member' || user.role === 'admin',
      unlockedAt: '2026-10-12',
      rewardText: 'Verified Contributor Badge on your recipes and profile'
    },
    {
      id: 'top_rated_contributor',
      name: 'Top-Rated Contributor',
      title: 'Master Chef de Cuisine',
      description: 'Awarded for maintaining an exceptional 4.8+ star rating across shared recipes.',
      icon: '⭐',
      category: 'quality',
      tier: 'Platinum',
      targetCount: 1,
      currentCount: isTopRated ? 1 : 0,
      isUnlocked: customBadges.has('top_rated_contributor') || isTopRated,
      unlockedAt: '2026-10-18',
      rewardText: 'Golden Chef Medallion & Priority Explore placement'
    },
    {
      id: 'indian_cuisines_explorer',
      name: 'Indian Cuisines Explorer',
      title: 'Bharat Gastronomy Voyager',
      description: 'Traversed the length and breadth of India by exploring authentic regional recipes across 5+ states.',
      icon: '🗺️',
      category: 'explorer',
      tier: 'Gold',
      targetCount: 5,
      currentCount: Math.min(5, statesExploredCount),
      isUnlocked: customBadges.has('indian_cuisines_explorer') || statesExploredCount >= 5,
      unlockedAt: '2026-10-25',
      rewardText: 'Special Voyager Seal on your Community card'
    },
    {
      id: 'heritage_preserver',
      name: 'Heritage Preserver',
      title: 'Heirloom Recipe Keeper',
      description: 'Bookmarked and safeguarded 5+ centuries-old heirloom and festive Indian dishes.',
      icon: '🏛️',
      category: 'heritage',
      tier: 'Silver',
      targetCount: 5,
      currentCount: Math.min(5, Math.max(savedCount, user.id === 'user-demo-member' ? 5 : savedCount)),
      isUnlocked: customBadges.has('heritage_preserver') || savedCount >= 5 || user.id === 'user-demo-member',
      unlockedAt: '2026-11-01',
      rewardText: 'Access to Secret Royal Palace archives'
    },
    {
      id: 'heritage_pass_holder',
      name: 'Heritage Explorer Pass Holder',
      title: 'Royal Culinary Patron',
      description: 'Active Premium Subscription holder supporting regional Indian recipe preservation.',
      icon: '👑',
      category: 'collector',
      tier: 'Platinum',
      targetCount: 1,
      currentCount: isPremiumActive ? 1 : 0,
      isUnlocked: isPremiumActive,
      unlockedAt: user.createdAt,
      rewardText: 'Ad-free experience, unlimited PDF downloads & Green Tick verification'
    },
    {
      id: 'spice_master',
      name: 'Spice Master',
      title: 'Masala Connoisseur',
      description: 'Mastered 3+ authentic fiery regional curries and freshly ground spice blends.',
      icon: '🌶️',
      category: 'heritage',
      tier: 'Silver',
      targetCount: 3,
      currentCount: Math.min(3, effectiveSpicyCount),
      isUnlocked: customBadges.has('spice_master') || effectiveSpicyCount >= 3,
      unlockedAt: '2026-11-04',
      rewardText: 'Spice Master insignia & Chettinad Spice blend notes'
    },
    {
      id: 'digital_archivist',
      name: 'Digital Archivist',
      title: 'Culinary Scholar',
      description: 'Downloaded 3+ high-definition PDF recipe cards for offline kitchen preparation.',
      icon: '📜',
      category: 'collector',
      tier: 'Bronze',
      targetCount: 3,
      currentCount: Math.min(3, Math.max(downloadedCount, user.id === 'user-demo-member' ? 3 : downloadedCount)),
      isUnlocked: customBadges.has('digital_archivist') || downloadedCount >= 3 || user.id === 'user-demo-member',
      unlockedAt: '2026-11-05',
      rewardText: 'Offline cooking printable stamp'
    }
  ];

  return badges;
};
