import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { HomeSections } from './components/HomeSections';
import { ExploreRecipesView } from './components/ExploreRecipesView';
import { PeoplesRecipesView } from './components/PeoplesRecipesView';
import { StatesView } from './components/StatesView';
import { CategoriesView } from './components/CategoriesView';
import { CommunityView } from './components/CommunityView';
import { ShareRecipeView } from './components/ShareRecipeView';
import { WhatsInMyKitchen } from './components/WhatsInMyKitchen';
import { BudgetCooking } from './components/BudgetCooking';
import { MealPlanner } from './components/MealPlanner';
import { FestivalCollection } from './components/FestivalCollection';
import { UserDashboard } from './components/UserDashboard';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { EditRecipeModal } from './components/EditRecipeModal';
import { PremiumModal } from './components/PremiumModal';
import { PaymentGatewayModal } from './components/PaymentGatewayModal';
import { AuthModal } from './components/AuthModal';
import { StaticPagesModal } from './components/StaticPagesModal';
import { SponsoredPartnerAd } from './components/SponsoredPartnerAd';
import { CreatorChannelPage } from './components/CreatorChannelPage';
import { CreatorStudio } from './components/CreatorStudio';
import { TopFoodCreatorsSection } from './components/TopFoodCreatorsSection';
import { FollowingFeedView } from './components/FollowingFeedView';
import { CreateChannelModal } from './components/CreateChannelModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { CateringSlotView } from './components/CateringSlotView';
import { HomemadeFoodSlotView } from './components/HomemadeFoodSlotView';
import { HotelRestaurantSlotView } from './components/HotelRestaurantSlotView';
import { CreateBusinessAccountModal } from './components/CreateBusinessAccountModal';
import { PaymentInvoiceModal } from './components/PaymentInvoiceModal';
import { AdminPanel } from './components/AdminPanel';
import { OnboardingFlowGate } from './components/OnboardingFlowGate';

const MainAppContent: React.FC = () => {
  const { 
    currentUser,
    currentView, 
    selectedRecipe, 
    setSelectedRecipe, 
    editingRecipe,
    setEditingRecipe,
    isPremiumModalOpen, 
    setIsPremiumModalOpen, 
    isPaymentModalOpen, 
    setIsPaymentModalOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    staticPageId,
    setStaticPageId,
    openChannel,
    toastMessage,
    setSelectedPaymentPlan
  } = useApp();

  // Check if user has completed Step 1 (Login/Sign In) and Step 2 (Subscription)
  const isSubscribed = currentUser?.role === 'admin' || (
    currentUser?.isPremium && 
    currentUser?.premiumExpiry && 
    new Date(currentUser.premiumExpiry).getTime() > Date.now()
  );

  const isAllViewUnlocked = !!currentUser && isSubscribed;

  React.useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/channel\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      openChannel(match[1]);
    }
  }, []);

  // If user has not completed Step 1 (Login/Sign in) and Step 2 (Subscription), show onboarding flow gate
  if (!isAllViewUnlocked) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#2B1B17]">
        {/* Toast Notification Alert */}
        {toastMessage && (
          <div className="fixed top-6 right-4 z-70 bg-[#2B1B17] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl border border-stone-700 animate-slideDown flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E8590C]" />
            <span>{toastMessage}</span>
          </div>
        )}

        <OnboardingFlowGate 
          onPlanSelected={(planId) => {
            setSelectedPaymentPlan(planId);
            setIsPaymentModalOpen(true);
          }}
        />

        {isPaymentModalOpen && (
          <PaymentGatewayModal onClose={() => setIsPaymentModalOpen(false)} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#2B1B17]">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#2B1B17] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl border border-stone-700 animate-slideDown flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E8590C]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar />

      {/* Main View Router */}
      <main className="grow">
        {currentView === 'home' && (
          <>
            <Hero />
            <SponsoredPartnerAd />
            <HomeSections />
          </>
        )}

        {currentView === 'explore' && <ExploreRecipesView />}
        {currentView === 'peoples-recipes' && <PeoplesRecipesView />}
        {currentView === 'catering' && <CateringSlotView />}
        {currentView === 'homemade' && <HomemadeFoodSlotView />}
        {currentView === 'hotel-restaurant' && <HotelRestaurantSlotView />}
        {(currentView === 'states' || currentView === 'state-detail') && <StatesView />}
        {(currentView === 'categories' || currentView === 'category-detail') && <CategoriesView />}
        {currentView === 'community' && <CommunityView />}
        {currentView === 'creators' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <TopFoodCreatorsSection isFullView={true} />
          </div>
        )}
        {currentView === 'channel' && <CreatorChannelPage />}
        {currentView === 'creator-studio' && <CreatorStudio />}
        {currentView === 'following-feed' && <FollowingFeedView />}
        {currentView === 'share-recipe' && <ShareRecipeView />}
        {currentView === 'kitchen-finder' && <WhatsInMyKitchen />}
        {currentView === 'budget' && <BudgetCooking />}
        {currentView === 'meal-planner' && <MealPlanner />}
        {currentView === 'festivals' && <FestivalCollection />}
        {currentView === 'dashboard' && <UserDashboard />}
        {currentView === 'admin' && <AdminPanel />}
        
        {currentView === 'premium' && (
          <div className="py-8">
            <PremiumModal onClose={() => {}} />
          </div>
        )}
      </main>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}

      {/* Edit Recipe Modal */}
      {editingRecipe && (
        <EditRecipeModal
          recipe={editingRecipe}
          onClose={() => setEditingRecipe(null)}
        />
      )}

      {/* Creator System Modals */}
      <CreateChannelModal />
      <CreateBusinessAccountModal />
      <VideoPlayerModal />
      <PaymentInvoiceModal />

      {isPremiumModalOpen && (
        <PremiumModal onClose={() => setIsPremiumModalOpen(false)} />
      )}

      {isPaymentModalOpen && (
        <PaymentGatewayModal onClose={() => setIsPaymentModalOpen(false)} />
      )}

      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}

      {staticPageId && (
        <StaticPagesModal
          pageId={staticPageId}
          onClose={() => setStaticPageId(null)}
        />
      )}

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
