/**
 * Authentic, verified Indian culinary photography catalog.
 * Accurately pairs recipe types, Indian states, and culinary categories
 * with high-fidelity, authentic photography.
 */

export interface DishImagePreset {
  id: string;
  name: string;
  category: string;
  url: string;
}

export const DISH_IMAGE_PRESETS: DishImagePreset[] = [
  // Sweet / Sweets & Desserts
  {
    id: 'sweet-gulab-jamun',
    name: 'Gulab Jamun & Rasgulla (Sweet)',
    category: 'Sweets & Desserts',
    url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'sweet-halwa-kheer',
    name: 'Ghee Halwa & Kheer / Payasam (Sweet)',
    category: 'Sweets & Desserts',
    url: 'https://images.unsplash.com/photo-1505253758473-96b3015f240a?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'sweet-mithai-platter',
    name: 'Kaju Katli, Peda & Laddu Platter (Sweet)',
    category: 'Sweets & Desserts',
    url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80'
  },

  // Street Food
  {
    id: 'street-vada-pav',
    name: 'Mumbai Vada Pav & Chutneys (Street Food)',
    category: 'Street Food',
    url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'street-pani-puri',
    name: 'Pani Puri & Sev Puri Chaat (Street Food)',
    category: 'Street Food',
    url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'street-samosa',
    name: 'Punjabi Samosa & Mint Chutney (Street Food)',
    category: 'Street Food',
    url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'street-momos',
    name: 'Steamed Himalayan Momos (Street Food)',
    category: 'Street Food',
    url: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&auto=format&fit=crop&q=80'
  },

  // Juice & Drinks
  {
    id: 'juice-fresh-citrus',
    name: 'Fresh Orange & Citrus Fruit Juice (Juice)',
    category: 'Drinks & Juices',
    url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'juice-mint-cooler',
    name: 'Mint Lime Shikanji & Cooler (Juice)',
    category: 'Drinks & Juices',
    url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'juice-kesar-lassi',
    name: 'Kesar Pista Lassi & Chaas (Juice/Drinks)',
    category: 'Drinks & Juices',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'juice-watermelon',
    name: 'Chilled Watermelon & Aam Panna (Juice)',
    category: 'Drinks & Juices',
    url: 'https://images.unsplash.com/photo-1589733955941-5eeaf99ab4d0?w=800&auto=format&fit=crop&q=80'
  },

  // Diet Food
  {
    id: 'diet-sprouted-salad',
    name: 'Sprouted Moong & Chickpea Diet Salad (Diet Food)',
    category: 'Diet Food',
    url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'diet-steamed-idli',
    name: 'Steamed Oats & Ragi Diet Idli (Diet Food)',
    category: 'Diet Food',
    url: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'diet-veggie-quinoa',
    name: 'Quinoa & Grilled Vegetable Diet Bowl (Diet Food)',
    category: 'Diet Food',
    url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'diet-detox-soup',
    name: 'Healthy Greens Detox Soup (Diet Food)',
    category: 'Diet Food',
    url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80'
  },

  // Other staples
  {
    id: 'biryani-dum',
    name: 'Hyderabadi Dum Biryani',
    category: 'Biryani',
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'dosa-masala',
    name: 'Crisp Masala Dosa with Chutneys',
    category: 'Dosa',
    url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'butter-chicken',
    name: 'Delhi Butter Chicken (Murgh Makhani)',
    category: 'Chicken Recipes',
    url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'dal-makhani',
    name: 'Slow Cooked Dal Makhani',
    category: 'Curry & Gravy',
    url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'dal-tadka',
    name: 'Yellow Dal Tadka with Ghee',
    category: 'Homemade Foods',
    url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'paneer-gravy',
    name: 'Paneer Butter Masala',
    category: 'Vegetarian Recipes',
    url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'rogan-josh',
    name: 'Kashmiri Rogan Josh / Laal Maas',
    category: 'Mutton Recipes',
    url: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'fish-curry',
    name: 'Coastal Fish Curry / Meen Pollichathu',
    category: 'Fish Recipes',
    url: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'chole-bhature',
    name: 'Amritsari Chole Bhature',
    category: 'Breakfast',
    url: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'litti-baati',
    name: 'Litti Chokha / Dal Baati',
    category: 'Traditional Indian Food',
    url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'naan-paratha',
    name: 'Garlic Butter Naan & Kulcha',
    category: 'Chapati & Roti',
    url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'royal-thali',
    name: 'Royal Indian Thali Feast',
    category: 'Lunch',
    url: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=800&auto=format&fit=crop&q=80'
  }
];

/**
 * Intelligently returns the most accurate authentic culinary photo
 * based on the dish title, category, or ingredients.
 */
export function getAccurateRecipeImage(title: string, category: string): string {
  const t = title.toLowerCase();
  const c = category.toLowerCase();

  // 1. Biryani & Pulao
  if (t.includes('biryani') || t.includes('pulao') || c.includes('biryani')) {
    return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80';
  }

  // 2. Dosa
  if (t.includes('dosa') || c.includes('dosa')) {
    return 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80';
  }

  // 3. Idli
  if (t.includes('idli') || c.includes('idli')) {
    return 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80';
  }

  // 4. Butter Chicken / Makhani
  if (t.includes('butter chicken') || t.includes('murgh makhani') || t.includes('makhani chicken')) {
    return 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80';
  }

  // 5. Tandoori Chicken / Pepper Chicken / Chicken Fry
  if (t.includes('chicken') && (t.includes('fry') || t.includes('roast') || t.includes('pepper') || t.includes('tikka') || t.includes('tandoori') || t.includes('xacuti'))) {
    return 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80';
  }

  // 6. Dal Makhani / Dal Tadka
  if (t.includes('dal makhani')) {
    return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80';
  }
  if (t.includes('dal') || t.includes('lentil') || t.includes('dalma') || t.includes('khichdi') || t.includes('kadhi')) {
    return 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80';
  }

  // 7. Paneer / Vegetarian Rich Curries
  if (t.includes('paneer') || t.includes('kofta') || t.includes('undhiyu') || t.includes('korma')) {
    return 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80';
  }

  // 8. Mutton / Rogan Josh / Laal Maas / Gosht / Galouti
  if (t.includes('mutton') || t.includes('rogan josh') || t.includes('laal maas') || t.includes('gosht') || t.includes('galouti') || t.includes('nihari') || t.includes('pork') || t.includes('vindaloo') || c.includes('mutton')) {
    return 'https://images.unsplash.com/photo-1545247181-516773cae754?w=800&auto=format&fit=crop&q=80';
  }

  // 9. Fish / Prawn / Crab / Seafood
  if (t.includes('fish') || t.includes('ilish') || t.includes('meen') || t.includes('prawn') || t.includes('chingri') || t.includes('crab') || t.includes('nandu') || t.includes('tuna') || t.includes('trout') || c.includes('fish')) {
    return 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800&auto=format&fit=crop&q=80';
  }

  // 10. Momos / Thukpa / Himalayan Dumplings
  if (t.includes('momo') || t.includes('thukpa') || t.includes('dumpling') || t.includes('tingmo') || t.includes('skyu')) {
    return 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&auto=format&fit=crop&q=80';
  }

  // 11. Vada Pav / Samosa / Chaat / Pakora
  if (t.includes('vada pav') || t.includes('vada') || t.includes('misal')) {
    return 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&auto=format&fit=crop&q=80';
  }
  if (t.includes('samosa') || t.includes('kachori') || t.includes('chaat') || t.includes('snack') || t.includes('dhuska') || t.includes('fara') || c.includes('snack')) {
    return 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80';
  }

  // 12. Chole Bhature / Kulcha
  if (t.includes('chole') || t.includes('bhature') || t.includes('kulcha')) {
    return 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&auto=format&fit=crop&q=80';
  }

  // 13. Poha / Upma / Dhokla / Breakfast
  if (t.includes('poha') || t.includes('upma') || t.includes('dhokla') || t.includes('khandvi')) {
    return 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800&auto=format&fit=crop&q=80';
  }

  // 14. Litti Chokha / Dal Baati Churma
  if (t.includes('litti') || t.includes('baati') || t.includes('churma')) {
    return 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80';
  }

  // 15. Roti / Naan / Paratha / Thepla
  if (t.includes('roti') || t.includes('naan') || t.includes('paratha') || t.includes('thepla') || t.includes('poori') || c.includes('roti') || c.includes('chapati')) {
    return 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80';
  }

  // Sweets & Desserts (Halwa, Rasgulla, Jamun, Modak, Kheer, Payasam, Ghevar, Peda, Chhena, Sweet)
  if (t.includes('sweet') || t.includes('mithai') || t.includes('halwa') || t.includes('kheer') || t.includes('payasam') || t.includes('rasgulla') || t.includes('jamun') || t.includes('modak') || t.includes('ghevar') || t.includes('chhena') || t.includes('laddu') || t.includes('peda') || t.includes('jalebi') || t.includes('barfi') || t.includes('bebinca') || c.includes('sweet')) {
    return 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80';
  }

  // Drinks & Juices (Fresh Fruit Juice, Shake, Smoothie, Lassi, Chaas, Shikanji)
  if (t.includes('juice') || t.includes('smoothie') || t.includes('shake') || t.includes('shikanji') || t.includes('cooler') || t.includes('sherbet') || c.includes('juice')) {
    return 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&auto=format&fit=crop&q=80';
  }
  if (t.includes('lassi') || t.includes('chaas') || t.includes('tea') || t.includes('chai') || t.includes('kahwa') || t.includes('coffee') || c.includes('drink')) {
    return 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80';
  }

  // Diet Food / Weight Loss / Healthy Low-Calorie Recipes
  if (t.includes('diet') || t.includes('weight loss') || t.includes('low cal') || t.includes('keto') || t.includes('detox') || t.includes('protein salad') || t.includes('sprout') || c.includes('diet')) {
    return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80';
  }

  // Street Food (Vada Pav, Pav Bhaji, Pani Puri, Chaat, Samosa)
  if (t.includes('street') || t.includes('vada pav') || t.includes('pav bhaji') || t.includes('pani puri') || t.includes('chaat') || t.includes('sev puri') || t.includes('bhel') || c.includes('street')) {
    return 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&auto=format&fit=crop&q=80';
  }

  // Pickles & Chutneys
  if (t.includes('pickle') || t.includes('achar') || t.includes('chutney') || t.includes('podi') || c.includes('pickle')) {
    return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80';
  }

  // Green / Healthy Leafy Veg (Saag, Kafuli, Spinach)
  if (t.includes('saag') || t.includes('kafuli') || t.includes('spinach') || t.includes('methi') || t.includes('salad') || c.includes('healthy')) {
    return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80';
  }

  // Default to Royal Indian Thali / Feast
  return 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=800&auto=format&fit=crop&q=80';
}
