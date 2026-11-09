export interface FoodCategory {
  id: string;
  name: string;
  description: string;
  iconName: string;
  count?: number;
  popularDish: string;
  image: string;
}

export const FOOD_CATEGORIES: FoodCategory[] = [
  {
    id: 'breakfast',
    name: 'Breakfast',
    description: 'Energizing morning staples: steaming idlis, golden dosas, stuffed parathas, and spiced poha.',
    iconName: 'SunMedium',
    popularDish: 'Masala Dosa with Chutneys',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'lunch',
    name: 'Lunch',
    description: 'Hearty midday thalis, fragrant rice varieties, dal tadka, and seasonal subzis.',
    iconName: 'UtensilsCrossed',
    popularDish: 'South & North Royal Thali',
    image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'dinner',
    name: 'Dinner',
    description: 'Comforting evening curries, piping hot tawa rotis, aromatic pulao, and soothing khichdi.',
    iconName: 'Moon',
    popularDish: 'Dal Makhani & Butter Naan',
    image: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'evening-snacks',
    name: 'Evening Snacks',
    description: 'Crisp samosas, piping hot pakoras, spicy mirchi bajji, and mathri for chai time.',
    iconName: 'Coffee',
    popularDish: 'Punjabi Samosa with Mint Chutney',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'street-food',
    name: 'Street Food',
    description: 'Iconic street flavours of Chowpatty, Chandni Chowk, and Kolkata lanes.',
    iconName: 'Flame',
    popularDish: 'Mumbai Vada Pav & Pani Puri',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'traditional-indian-food',
    name: 'Traditional Indian Food',
    description: 'Heritage recipes handed down across grandmothers and royal palace kitchens.',
    iconName: 'Crown',
    popularDish: 'Rajasthani Dal Baati Churma',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'sweets-desserts',
    name: 'Sweets & Desserts',
    description: 'Rich mithai infused with saffron, cardamom, pure desi ghee, and pistachios.',
    iconName: 'Cake',
    popularDish: 'Gulab Jamun & Rasgulla',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'biryani',
    name: 'Biryani',
    description: 'Royal slow-cooked dum biryani with long basmati grain, aromatic spices, and tender meat or paneer.',
    iconName: 'CookingPot',
    popularDish: 'Hyderabadi Dum Biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'rice-recipes',
    name: 'Rice Recipes',
    description: 'Bisi Bele Bath, Lemon Rice, curd rice, fragrant Kashmiri Pulao, and Jeera Rice.',
    iconName: 'Soup',
    popularDish: 'Karnataka Bisi Bele Bath',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'dosa',
    name: 'Dosa',
    description: 'Fermented golden crepes: Masala, Ghee Roast, Mysore Dosa, Rava Dosa, and Neer Dosa.',
    iconName: 'Layers',
    popularDish: 'Mysore Masala Ghee Roast',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'idli',
    name: 'Idli',
    description: 'Soft pillow-like steamed fermented rice and black gram cakes with piping hot sambar.',
    iconName: 'Sparkles',
    popularDish: 'Guntur Podi Thatte Idli',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'chapati-roti',
    name: 'Chapati & Roti',
    description: 'Phulkas, tandoori rotis, flaky parathas, stuffed kulchas, and rustic bajra rotis.',
    iconName: 'Circle',
    popularDish: 'Amritsari Aloo Kulcha',
    image: 'https://images.unsplash.com/photo-1505253758473-96b3015f240a?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'curry-gravy',
    name: 'Curry & Gravy',
    description: 'Velvety makhani, rich kormas, coastal coconut curries, and spicy chettinad gravies.',
    iconName: 'Flame',
    popularDish: 'Paneer Butter Masala',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'chicken-recipes',
    name: 'Chicken Recipes',
    description: 'Tandoori chicken, Butter Chicken, Chettinad Pepper Chicken, and Chicken Xacuti.',
    iconName: 'Drumstick',
    popularDish: 'Old Delhi Butter Chicken',
    image: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'mutton-recipes',
    name: 'Mutton Recipes',
    description: 'Slow-simmered Laal Maas, Awadhi Galouti, Kashmiri Rogan Josh, and Champaran Handi.',
    iconName: 'Beef',
    popularDish: 'Kashmiri Rogan Josh',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'fish-recipes',
    name: 'Fish Recipes',
    description: 'Bengali Shorshe Ilish, Goan Fish Curry, Malabar Fish Curry, and Karimeen Pollichathu.',
    iconName: 'Fish',
    popularDish: 'Bengali Shorshe Ilish',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'egg-recipes',
    name: 'Egg Recipes',
    description: 'Spicy egg roasts, Kolhapuri Anda curry, Dhaba style egg curry, and egg bhurji.',
    iconName: 'Egg',
    popularDish: 'Kerala Spicy Egg Roast',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'vegetarian-recipes',
    name: 'Vegetarian Recipes',
    description: 'Shahi Paneer, Chole Bhature, Gujarati Undhiyu, Baingan Bharta, and Dal Tadka.',
    iconName: 'Leaf',
    popularDish: 'Gujarati Undhiyu',
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'vegan-recipes',
    name: 'Vegan Recipes',
    description: 'Naturally plant-based Indian classics cooked in cold-pressed mustard, sesame, or peanut oil.',
    iconName: 'Sprout',
    popularDish: 'Aloo Gobi Matar & Chana Masala',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'healthy-recipes',
    name: 'Healthy Recipes',
    description: 'High-protein sprouted salads, millet rotis, steamed dalia, and low-oil detox curries.',
    iconName: 'HeartPulse',
    popularDish: 'Sprouted Moong Salad & Ragi Roti',
    image: 'https://images.unsplash.com/photo-1505253758473-96b3015f240a?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'diet-food',
    name: 'Diet Food',
    description: 'Low-calorie, weight-loss, keto, diabetic-friendly and high-protein guilt-free Indian diet recipes.',
    iconName: 'Salad',
    popularDish: 'Sprouted Moong Diet Salad & Detox Greens',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'kids-recipes',
    name: 'Kids Recipes',
    description: 'Mild, fun, and nutritious meals: cheese dosas, mini uttapams, paneer rolls, and fruit custard.',
    iconName: 'Smile',
    popularDish: 'Mini Paneer Frankie & Cheese Dosa',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'festival-special',
    name: 'Festival Special',
    description: 'Sacred delicacies for Diwali, Pongal, Onam, Eid, Durga Puja, Navratri, and Christmas.',
    iconName: 'Sparkles',
    popularDish: 'Sweet Ven Pongal & Modak',
    image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'drinks-juices',
    name: 'Drinks & Juices',
    description: 'Cooling Amritsari Lassi, Masala Chaas, Filter Coffee, Thandai, and Aam Panna.',
    iconName: 'GlassWater',
    popularDish: 'Kesar Pista Lassi & Masala Chaas',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'pickles-chutneys',
    name: 'Pickles & Chutneys',
    description: 'Sun-matured Mango Achar, Andhra Avakaya, fresh Coconut chutney, and tangy Imli chutney.',
    iconName: 'Jar',
    popularDish: 'Andhra Spicy Avakaya Mango Pickle',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'homemade-foods',
    name: 'Homemade Foods',
    description: 'Simple everyday comfort food: comforting Khichdi with ghee, yellow dal tadka, and aloo bhujia.',
    iconName: 'Home',
    popularDish: 'Moong Dal Khichdi with Desi Ghee',
    image: 'https://images.unsplash.com/photo-1505253758473-96b3015f240a?w=600&auto=format&fit=crop&q=80'
  }
];
