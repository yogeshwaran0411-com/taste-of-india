import { CateringProfile, HomemadeFoodProfile, HotelRestaurantProfile } from '../types';

export const INITIAL_CATERING_PROFILES: CateringProfile[] = [
  {
    id: 'caterer-annapoorna',
    businessName: 'Sri Annapoorna Grand Heritage Catering',
    ownerName: 'Chef S. Ramanathan & Sons',
    phone: '+91 98401 23456',
    whatsappNumber: '+919840123456',
    address: '42, North Mada Street, Mylapore',
    city: 'Chennai',
    state: 'Tamil Nadu',
    speciality: 'Authentic South Indian Banana Leaf Weddings, Brahmin Sambar & Palada Payasam',
    experienceYears: 28,
    pricePerPlateRange: '₹350 - ₹650 / Plate',
    capacityRange: '100 - 3,000 Guests',
    servicesOffered: ['Traditional Sit-down Banana Leaf', 'Live Dosa & Appam Counters', 'Elai Sappadu Buffet', 'Filter Coffee Stalls'],
    dietaryType: 'Pure Veg',
    menuImages: [
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    bookedDates: ['2026-11-12', '2026-11-15', '2026-11-20', '2026-11-28', '2026-12-05', '2026-12-12'],
    verified: true,
    rating: 4.9,
    reviewsCount: 142,
    coverImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1200&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    menuPackages: [
      {
        id: 'pkg-annapoorna-wedding',
        packageName: 'Grand Muhurtham Kalyana Sappadu (32 Items)',
        pricePerPlate: 499,
        minGuests: 150,
        maxGuests: 2500,
        dietary: 'Vegetarian',
        itemsIncluded: [
          'Welcome Tender Coconut & Rose Milk',
          'Madurai Malli Idli with 3 Chutneys',
          'Ghee Pongal & Medu Vada',
          'Mysore Pak & Paal Payasam',
          'Mylapore Mor Kuzhambu & Bisibelebath',
          'Poriyal, Kootu, Appalam & Curd Rice'
        ],
        description: 'Complete royal wedding banquet served on fresh plantain leaves following centuries-old Vedic traditions.'
      },
      {
        id: 'pkg-annapoorna-reception',
        packageName: 'South-North Fusion Gala Buffet',
        pricePerPlate: 599,
        minGuests: 100,
        dietary: 'Vegetarian',
        itemsIncluded: [
          'Live Tawa Parotta Counter',
          'Chettinad Paneer Masala & Malai Kofta',
          'Hyderabadi Veg Dum Biryani & Raitha',
          'Hot Jalebi with Rabri & Elaneer Payasam'
        ],
        description: 'Spectacular multi-cuisine vegetarian spread with interactive live culinary stations.'
      }
    ],
    uploadedRecipeIds: ['recipe-2', 'recipe-6'],
    createdAt: '2026-01-15'
  },
  {
    id: 'caterer-dilli-darbar',
    businessName: 'Royal Dilli Darbar & Awadhi Caterers',
    ownerName: 'Ustad Mohammed Irfan Qureshi',
    phone: '+91 98112 34567',
    whatsappNumber: '+919811234567',
    address: '18/4, Netaji Subhash Marg, Daryaganj',
    city: 'New Delhi',
    state: 'Delhi',
    speciality: 'Purani Dilli Shahi Biryani, Dum Pukht Rogan Josh & Slow-Cooked Dal Makhani',
    experienceYears: 34,
    pricePerPlateRange: '₹550 - ₹1,100 / Plate',
    capacityRange: '80 - 2,500 Guests',
    servicesOffered: ['Live Sigri & Charcoal Tandoor', 'Shahi Handi Dastarkhwan', 'Chaat Chowk Live Stalls', 'Butler Service'],
    dietaryType: 'Both Veg & Non-Veg',
    menuImages: [
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=800&auto=format&fit=crop&q=80'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    bookedDates: ['2026-11-14', '2026-11-21', '2026-12-04', '2026-12-18'],
    verified: true,
    rating: 4.95,
    reviewsCount: 188,
    coverImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    menuPackages: [
      {
        id: 'pkg-dilli-shahi',
        packageName: 'Nawabi Awadhi Shahi Dastarkhwan',
        pricePerPlate: 850,
        minGuests: 100,
        maxGuests: 2000,
        dietary: 'Non-Vegetarian',
        itemsIncluded: [
          'Mutton Galouti Kebabs with Sheermal',
          'Purani Dilli Mutton Dum Biryani',
          'Murgh Awadhi Korma & Roomali Roti',
          '24-Hour Slow-Cooked Dal Bukhara',
          'Shahi Tukda with Kesar Rabri & Phirni'
        ],
        description: 'Authentic royal banquet cooked in sealed brass deghs over low charcoal fire.'
      },
      {
        id: 'pkg-dilli-veg-delight',
        packageName: 'Delhi Grand Vegetarian Banquet',
        pricePerPlate: 620,
        minGuests: 80,
        dietary: 'Vegetarian',
        itemsIncluded: [
          'Chandni Chowk Live Dahi Bhalla & Golgappa',
          'Paneer Lababdar & Dum Aloo Kashmiri',
          'Amritsari Chole Kulche Live Counter',
          'Pista Kulfi Falooda & Hot Moong Dal Halwa'
        ],
        description: 'Flavours of Old Delhi in a lavish banquet for weddings and grand receptions.'
      }
    ],
    uploadedRecipeIds: ['recipe-1', 'recipe-3'],
    createdAt: '2026-02-10'
  },
  {
    id: 'caterer-rajasthani-parampara',
    businessName: 'Parampara Rajasthani & Marwari Catering',
    ownerName: 'Maharaj Kailash Sharma',
    phone: '+91 94140 88765',
    whatsappNumber: '+919414088765',
    address: '12, Johari Bazar, Pink City',
    city: 'Jaipur',
    state: 'Rajasthan',
    speciality: '100% Pure Ghee Dal Baati Churma, Ker Sangri, Gatte ki Sabzi & Royal Thalis',
    experienceYears: 22,
    pricePerPlateRange: '₹400 - ₹750 / Plate',
    capacityRange: '50 - 1,800 Guests',
    servicesOffered: ['Traditional Chokhi Dhani Sit-down', 'Brass Urli Buffet', 'Live Bati Kadhai', 'Paan Stalls'],
    dietaryType: 'Pure Veg',
    verified: true,
    rating: 4.88,
    reviewsCount: 115,
    coverImage: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=1200&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    menuPackages: [
      {
        id: 'pkg-marwari-royal',
        packageName: 'Royal Marwari Shahi Thali (28 Items)',
        pricePerPlate: 520,
        minGuests: 60,
        dietary: 'Vegetarian',
        itemsIncluded: [
          'Welcome Kesar Thandai & Jaljeera',
          'Panchmel Dal with Bati & 3 Varieties of Churma',
          'Jodhpuri Gatte ki Sabzi & Rajasthani Kadhi',
          'Ker Sangri with Bajre ki Roti & White Butter',
          'Ghevar with Malai & Mawa Kachori'
        ],
        description: 'Pure Desi Ghee traditional feast celebrating the rich royal desert heritage.'
      }
    ],
    uploadedRecipeIds: ['recipe-4'],
    createdAt: '2026-03-01'
  },
  {
    id: 'caterer-hyderabad-nizami',
    businessName: 'Nizami Shahi Caterers & Dastarkhwan',
    ownerName: 'Nawabzada Zafar Khan',
    phone: '+91 98490 11223',
    whatsappNumber: '+919849011223',
    address: 'Opp. Salar Jung Museum, Darulshifa',
    city: 'Hyderabad',
    state: 'Telangana',
    speciality: 'Zaffrani Hyderabadi Dum Biryani, Mirchi ka Salan, Baghara Baingan & Double ka Meetha',
    experienceYears: 30,
    pricePerPlateRange: '₹480 - ₹950 / Plate',
    capacityRange: '100 - 3,500 Guests',
    servicesOffered: ['Royal Nizami Dastarkhwan', 'Live Degh Counter', 'Haleem Live Stall', 'Qawwali Ambiance Setup'],
    dietaryType: 'Both Veg & Non-Veg',
    verified: true,
    rating: 4.96,
    reviewsCount: 220,
    coverImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    menuPackages: [
      {
        id: 'pkg-hyderabad-dawat',
        packageName: 'Grand Shahi Dawat-e-Khaas',
        pricePerPlate: 780,
        minGuests: 150,
        maxGuests: 3500,
        dietary: 'Non-Vegetarian',
        itemsIncluded: [
          'Welcome Irani Chai with Osmania Biscuits',
          'Authentic Mutton Hyderabadi Dum Biryani',
          'Mirchi Ka Salan & Dahi ki Chutney',
          'Tala Hua Gosht & Shikampuri Kebabs',
          'Double Ka Meetha & Khubani Ka Meetha with Cream'
        ],
        description: 'Authentic Hyderabadi wedding banquet made with long-grain basmati, pure saffron, and aged mutton.'
      }
    ],
    uploadedRecipeIds: ['recipe-1'],
    createdAt: '2026-03-15'
  }
];

export const INITIAL_HOMEMADE_PROFILES: HomemadeFoodProfile[] = [
  {
    id: 'homemade-maa-ki-rasoi',
    businessName: 'Maa Ki Rasoi Daily Ghar Ka Khana',
    chefName: 'Sunita Sharma (Home Chef)',
    phone: '+91 98710 44556',
    whatsappNumber: '+919871044556',
    address: 'B-4/12, Sector 8, Rohini',
    city: 'New Delhi',
    state: 'Delhi',
    deliveryArea: 'Rohini, Pitampura, Shalimar Bagh & Prashant Vihar (Up to 6 km)',
    speciality: 'Soft Ghee Phulkas, Arhar Dal Tadka, Seasonal Subzis, Zero Soda, Low-Oil Homestyle',
    serviceType: 'Daily Tiffin Service',
    dietaryType: '100% Pure Veg',
    operatingHours: 'Lunch: 11:30 AM - 2:30 PM | Dinner: 7:00 PM - 9:30 PM',
    verified: true,
    rating: 4.92,
    reviewsCount: 86,
    coverImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1200&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    menuItems: [
      {
        id: 'dish-thali-standard',
        dishName: 'Maa Ki Thali (4 Phulkas + Dal + Sabzi + Rice + Salad)',
        price: 120,
        portionSize: 'Standard Full Meal Box',
        dietary: 'Vegetarian',
        availability: 'Daily Lunch & Dinner',
        description: 'Wholesome North Indian home meal cooked fresh 30 minutes before delivery.'
      },
      {
        id: 'dish-paratha-box',
        dishName: 'Stuffed Aloo-Gobhi Parathas with Home Churned White Butter',
        price: 90,
        portionSize: '2 Big Parathas + Dahi + Pickle',
        dietary: 'Vegetarian',
        availability: 'Breakfast & Morning Orders (Order by 9 AM)',
        description: 'Crisp whole wheat parathas stuffed with spiced potatoes and cauliflower.'
      },
      {
        id: 'dish-monthly-dabba',
        dishName: 'Monthly 26-Day Lunch Subscription',
        price: 2800,
        portionSize: '26 Delivery Days',
        dietary: 'Vegetarian',
        availability: 'Monthly Subscription Pass',
        description: 'Doorstep daily lunch delivery for students, working professionals, and seniors.'
      }
    ],
    uploadedRecipeIds: ['recipe-5', 'recipe-3'],
    createdAt: '2026-02-01'
  },
  {
    id: 'homemade-ammas-chettinad',
    businessName: "Amma's Chettinad Home Kitchen",
    chefName: 'Kavitha Muthiah',
    phone: '+91 99001 88776',
    whatsappNumber: '+919900188776',
    address: '5th Cross, 6th Block, Koramangala',
    city: 'Bengaluru',
    state: 'Karnataka',
    deliveryArea: 'Koramangala, Indiranagar, HSR Layout, BTM Layout (Within 8 km)',
    speciality: 'Fresh Stone-Ground Chettinad Curries, Seeraga Samba Biryani, Idiyappam & Kuzhambu',
    serviceType: 'Home Kitchen Pre-orders',
    dietaryType: 'Veg & Non-Veg',
    operatingHours: 'Order 3 hrs prior: 11:00 AM - 10:00 PM (Closed Tuesdays)',
    verified: true,
    rating: 4.96,
    reviewsCount: 112,
    coverImage: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1200&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    menuItems: [
      {
        id: 'dish-chettinad-chicken',
        dishName: 'Traditional Pepper Chicken Masala with 3 Parottas',
        price: 220,
        portionSize: 'Serves 1-2',
        dietary: 'Non-Vegetarian',
        availability: 'Daily Lunch & Dinner',
        description: 'Country chicken slow-simmered with crushed black pepper, fennel, and shallots.'
      },
      {
        id: 'dish-seeraga-biryani',
        dishName: 'Chettinad Seeraga Samba Mutton Biryani Pot',
        price: 340,
        portionSize: 'Serves 1-2 (Clay Handi)',
        dietary: 'Non-Vegetarian',
        availability: 'Friday, Saturday & Sunday Specials',
        description: 'Aromatic short-grain Seeraga samba biryani packed in earthen pot with onion pachadi.'
      },
      {
        id: 'dish-idli-podi',
        dishName: 'Homemade Gunpowder Podi Bottle (250g)',
        price: 150,
        portionSize: '250g Glass Jar',
        dietary: 'Vegetarian',
        availability: 'Always in stock',
        description: 'Heirloom roasted lentils, red chilies, garlic, and curry leaves podi.'
      }
    ],
    uploadedRecipeIds: ['recipe-2'],
    createdAt: '2026-02-15'
  },
  {
    id: 'homemade-vaishnav-shuddha',
    businessName: 'Vaishnav Shuddha Shakahari Tiffin & Dabba',
    chefName: 'Bhavna Ben Patel',
    phone: '+91 98200 99881',
    whatsappNumber: '+919820099881',
    address: 'Tilak Road, Ghatkopar East',
    city: 'Mumbai',
    state: 'Maharashtra',
    deliveryArea: 'Ghatkopar, Vidyavihar, Kurla, Vikhroli, Chembur (Central Mumbai)',
    speciality: '100% Pure Jain & Vaishnav Dabba, Phulke, Gujarati Sweet-Sour Kadhi, Undhiyu & Dhokla',
    serviceType: 'Daily Tiffin Service',
    dietaryType: 'Pure Veg & Jain',
    operatingHours: 'Lunch: 11:00 AM - 1:30 PM | Dinner: 6:30 PM - 8:30 PM',
    verified: true,
    rating: 4.89,
    reviewsCount: 94,
    coverImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1200&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    menuItems: [
      {
        id: 'dish-jain-dabba',
        dishName: 'Shuddha Jain Executive Dabba (Zero Onion & Garlic)',
        price: 130,
        portionSize: '5 Roti + Jain Dal + Jain Sabzi + Rice + Chaas',
        dietary: 'Vegetarian',
        availability: 'Daily (Mon - Sat)',
        description: 'Strict Jain preparation adhering to traditional dietary rules with supreme hygiene.'
      },
      {
        id: 'dish-undhiyu-puri',
        dishName: 'Surti Undhiyu with Methi Puri & Shrikhand',
        price: 190,
        portionSize: 'Serves 1',
        dietary: 'Vegetarian',
        availability: 'Wednesday & Sunday Specials',
        description: 'Slow-simmered winter greens, root veggies, and methi muthias with warm puris.'
      }
    ],
    uploadedRecipeIds: ['recipe-6'],
    createdAt: '2026-02-20'
  },
  {
    id: 'homemade-kolkata-baithak',
    businessName: 'Kolkata Baithak Home Kitchen & Sweets',
    chefName: 'Rupa Sen (Home Chef)',
    phone: '+91 98301 55667',
    whatsappNumber: '+919830155667',
    address: 'Block CD, Sector 1, Salt Lake',
    city: 'Kolkata',
    state: 'West Bengal',
    deliveryArea: 'Salt Lake, New Town, Lake Town & Ultadanga (Within 7 km)',
    speciality: 'Heirloom Shorshe Ilish, Kosha Mangsho with Luchi, Nolen Gur Sandesh & Mishti Doi',
    serviceType: 'Home Kitchen Pre-orders',
    dietaryType: 'Veg & Non-Veg',
    operatingHours: '12:00 PM - 9:00 PM (Pre-order 4 hours prior)',
    verified: true,
    rating: 4.94,
    reviewsCount: 78,
    coverImage: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1200&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    menuItems: [
      {
        id: 'dish-luchi-kosha',
        dishName: 'Kosha Mangsho with 6 Fluffy Hot Luchis',
        price: 260,
        portionSize: 'Serves 1-2',
        dietary: 'Non-Vegetarian',
        availability: 'Weekend Pre-order',
        description: 'Tender mutton cooked in deep rich mustard oil and caramelised onion gravy.'
      },
      {
        id: 'dish-nolen-gur-sweets',
        dishName: 'Handcrafted Nolen Gur Sandesh Box (6 Pcs)',
        price: 180,
        portionSize: 'Box of 6',
        dietary: 'Vegetarian',
        availability: 'Seasonal Fresh Delivery',
        description: 'Fresh cow milk chenna kneaded with authentic date palm jaggery.'
      }
    ],
    uploadedRecipeIds: ['recipe-3'],
    createdAt: '2026-03-05'
  }
];

export const INITIAL_HOTEL_RESTAURANT_PROFILES: HotelRestaurantProfile[] = [
  {
    id: 'rest-bukhara-heritage',
    businessName: 'Bukhara & Peshawri Heritage Grand Hotel',
    ownerOrChefName: 'Executive Chef JP Singh',
    restaurantType: 'Fine Dine Restaurant',
    dietaryType: 'Both Veg & Non-Veg',
    phone: '+91 11 2611 2233',
    whatsappNumber: '+911126112233',
    address: 'Diplomatic Enclave, Sardar Patel Marg',
    city: 'New Delhi',
    state: 'Delhi',
    timings: '12:30 PM - 3:00 PM, 7:00 PM - 11:45 PM',
    seatingCapacity: '180 Seats',
    averageCostForTwo: '₹2,800 for two',
    specialities: ['Dal Bukhara (Simmered 18 Hours)', 'Sikandari Raan', 'Barrah Kebab', 'Naan Bukhara'],
    menuImages: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    verified: true,
    rating: 4.96,
    reviewsCount: 310,
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80',
    uploadedRecipeIds: ['recipe-1', 'recipe-3'],
    tableBookingAvailable: true,
    createdAt: '2026-01-10'
  },
  {
    id: 'rest-dakshin-chennai',
    businessName: 'Dakshin Grand Heritage Restaurant',
    ownerOrChefName: 'Master Chef Natarajan',
    restaurantType: 'Heritage Haveli & Palace',
    dietaryType: 'Both Veg & Non-Veg',
    phone: '+91 44 2811 0022',
    whatsappNumber: '+914428110022',
    address: 'TTK Road, Alwarpet',
    city: 'Chennai',
    state: 'Tamil Nadu',
    timings: '12:00 PM - 3:30 PM, 6:30 PM - 11:30 PM',
    seatingCapacity: '140 Seats',
    averageCostForTwo: '₹2,200 for two',
    specialities: ['Chettinad Meen Varuval', 'Vasantha Neer', 'Yera Thokku', 'Elaneer Payasam'],
    menuImages: [
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    verified: true,
    rating: 4.92,
    reviewsCount: 220,
    coverImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    uploadedRecipeIds: ['recipe-2', 'recipe-6'],
    tableBookingAvailable: true,
    createdAt: '2026-01-20'
  },
  {
    id: 'rest-sagar-ratna-pureveg',
    businessName: 'Sagar Ratna Pure Veg Family Restaurant',
    ownerOrChefName: 'Jayaram Banan',
    restaurantType: 'Family Dining & Thali',
    dietaryType: 'Pure Veg',
    phone: '+91 80 4122 8899',
    whatsappNumber: '+918041228899',
    address: '100ft Road, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    timings: '7:30 AM - 11:00 PM (All Day Dining)',
    seatingCapacity: '200 Seats',
    averageCostForTwo: '₹750 for two',
    specialities: ['Ghee Roast Dosa', 'Bisi Bele Bath', 'Paneer Butter Masala', 'Filter Kaapi'],
    menuImages: [
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80'
    ],
    verified: true,
    rating: 4.86,
    reviewsCount: 450,
    coverImage: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1200&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    uploadedRecipeIds: ['recipe-5', 'recipe-7'],
    tableBookingAvailable: true,
    createdAt: '2026-02-01'
  },
  {
    id: 'rest-amrik-sukhdev-dhaba',
    businessName: 'Amrik Sukhdev Grand Highway Dhaba',
    ownerOrChefName: 'Sukhdev Singh',
    restaurantType: 'Highway Dhaba',
    dietaryType: 'Pure Veg',
    phone: '+91 130 247 5500',
    whatsappNumber: '+911302475500',
    address: '52.250 KM Stone, G.T. Road, Murthal',
    city: 'Murthal',
    state: 'Haryana',
    timings: 'Open 24 Hours · 7 Days',
    seatingCapacity: '800 Seats',
    averageCostForTwo: '₹550 for two',
    specialities: ['Tandoori Aloo Pyaaz Paratha with White Butter', 'Dal Makhani', 'Shahi Paneer', 'Matka Kulfi & Kulhad Chai'],
    menuImages: [
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    verified: true,
    rating: 4.93,
    reviewsCount: 980,
    coverImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1200&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    uploadedRecipeIds: ['recipe-4'],
    tableBookingAvailable: false,
    createdAt: '2026-02-15'
  }
];
