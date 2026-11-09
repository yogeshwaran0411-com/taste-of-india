import { IndianState } from '../types';

export const INDIAN_STATES_AND_UTS: IndianState[] = [
  // 28 States
  {
    id: 'tamil-nadu',
    name: 'Tamil Nadu',
    type: 'state',
    capital: 'Chennai',
    region: 'South',
    description: 'Renowned for fragrant Chettinad spices, crisp fermented dosas, piping hot filter coffee, and iconic Pongal simmered in earthen pots.',
    famousDishes: ['Chettinad Chicken', 'Masala Dosa', 'Medu Vada', 'Ven Pongal', 'Kothu Parotta', 'Filter Coffee', 'Tirunelveli Halwa'],
    heroImage: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Dosa', 'Idli', 'Breakfast', 'Chicken Recipes', 'Sweets & Desserts']
  },
  {
    id: 'kerala',
    name: 'Kerala',
    type: 'state',
    capital: 'Thiruvananthapuram',
    region: 'South',
    description: "God's Own Country presents coconut-infused delicacies, Appam with stew, Malabar Dum Biryani, and grand Onam Sadya served on emerald plantain leaves.",
    famousDishes: ['Malabar Biryani', 'Appam with Stew', 'Karimeen Pollichathu', 'Kerala Beef Fry', 'Puttu and Kadala Curry', 'Palada Payasam'],
    heroImage: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Fish Recipes', 'Biryani', 'Breakfast', 'Curry & Gravy', 'Festival Special']
  },
  {
    id: 'karnataka',
    name: 'Karnataka',
    type: 'state',
    capital: 'Bengaluru',
    region: 'South',
    description: 'Home to the legendary Bisi Bele Bath, Mysore Pak steeped in pure ghee, crisp Mangalore buns, and aromatic Kundapura fish curry.',
    famousDishes: ['Bisi Bele Bath', 'Mysore Pak', 'Neer Dosa', 'Mangalore Fish Curry', 'Ragi Mudde', 'Kundapura Chicken'],
    heroImage: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Rice Recipes', 'Dosa', 'Sweets & Desserts', 'Fish Recipes', 'Breakfast']
  },
  {
    id: 'andhra-pradesh',
    name: 'Andhra Pradesh',
    type: 'state',
    capital: 'Amaravati',
    region: 'South',
    description: 'Celebrated worldwide for fiery Guntur chillies, tangy Gongura mutton, Pesarattu with ginger chutney, and zesty Royyala Iguru.',
    famousDishes: ['Gongura Mutton', 'Andhra Royyala Iguru', 'Pesarattu Upma', 'Pootharekulu', 'Ulava Charu', 'Chepala Pulusu'],
    heroImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Mutton Recipes', 'Curry & Gravy', 'Breakfast', 'Pickles & Chutneys']
  },
  {
    id: 'telangana',
    name: 'Telangana',
    type: 'state',
    capital: 'Hyderabad',
    region: 'South',
    description: 'The royal crucible of Nizami gastronomy: authentic slow-cooked dum biryani, Haleem during Ramadan, Mirchi ka Salan, and Sarva Pindi.',
    famousDishes: ['Hyderabadi Dum Biryani', 'Hyderabadi Haleem', 'Mirchi Ka Salan', 'Double Ka Meetha', 'Sarva Pindi', 'Telangana Mutton Curry'],
    heroImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Biryani', 'Mutton Recipes', 'Evening Snacks', 'Sweets & Desserts']
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    type: 'state',
    capital: 'Mumbai',
    region: 'West',
    description: 'Bustling Mumbai street food like Vada Pav and Pav Bhaji to coastal Malvani crab curries and divine saffron Modaks for Ganesh Chaturthi.',
    famousDishes: ['Vada Pav', 'Pav Bhaji', 'Misal Pav', 'Ukadiche Modak', 'Puran Poli', 'Malvani Fish Curry', 'Kolhapuri Tambda Rassa'],
    heroImage: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Street Food', 'Evening Snacks', 'Curry & Gravy', 'Sweets & Desserts']
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    type: 'state',
    capital: 'Gandhinagar',
    region: 'West',
    description: 'Mastery of sweet-tangy vegetarian flavours: steamed spongy Dhokla, winter festive Undhiyu, crisp Khandvi, and flaky Fafda with Jalebi.',
    famousDishes: ['Khaman Dhokla', 'Gujarati Undhiyu', 'Khandvi', 'Thepla', 'Fafda Jalebi', 'Handvo', 'Dal Dhokli'],
    heroImage: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Vegetarian Recipes', 'Breakfast', 'Evening Snacks', 'Healthy Recipes']
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    type: 'state',
    capital: 'Jaipur',
    region: 'West',
    description: 'Regal Rajput feasts born of royal desert camps: Dal Baati Churma, fiery red Laal Maas, melt-in-mouth Ghevar, and spicy Pyaaz Kachori.',
    famousDishes: ['Dal Baati Churma', 'Laal Maas', 'Ghevar', 'Gatte Ki Sabzi', 'Ker Sangri', 'Pyaaz Kachori', 'Mawa Kachori'],
    heroImage: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Mutton Recipes', 'Vegetarian Recipes', 'Traditional Indian Food', 'Sweets & Desserts']
  },
  {
    id: 'punjab',
    name: 'Punjab',
    type: 'state',
    capital: 'Chandigarh',
    region: 'North',
    description: 'Hearty dhabas, golden mustard fields: smokey Sarson ka Saag with Makki di Roti, tandoori butter chicken, Dal Makhani, and tall glasses of Lassi.',
    famousDishes: ['Sarson Ka Saag & Makki Di Roti', 'Amritsari Kulcha', 'Butter Chicken', 'Dal Makhani', 'Pindi Chole', 'Sweet Lassi'],
    heroImage: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Curry & Gravy', 'Chicken Recipes', 'Drinks & Juices', 'Chapati & Roti']
  },
  {
    id: 'haryana',
    name: 'Haryana',
    type: 'state',
    capital: 'Chandigarh',
    region: 'North',
    description: 'Wholesome rustic rural cuisine high on fresh dairy and farm grains: Bajra Khichdi, Hara Dhania Cholia, Kachri ki Sabzi, and Malpua.',
    famousDishes: ['Bajra Aloo Roti', 'Hara Cholia', 'Kachri Ki Chutney', 'Bathua Ka Raita', 'Singri Ki Sabzi', 'Mithe Chawal'],
    heroImage: 'https://images.unsplash.com/photo-1505253758473-96b3015f240a?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Vegetarian Recipes', 'Healthy Recipes', 'Pickles & Chutneys']
  },
  {
    id: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    type: 'state',
    capital: 'Lucknow',
    region: 'North',
    description: 'Imperial Awadhi nawabi heritage: melt-in-the-mouth Galouti kebabs, Dum Biryani, Banarasi kachori jalebi, and rich Shahi Tukda.',
    famousDishes: ['Lucknowi Galouti Kebab', 'Awadhi Dum Biryani', 'Banarasi Chaat', 'Bedmi Poori Aloo', 'Peda of Mathura', 'Shahi Tukda'],
    heroImage: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Mutton Recipes', 'Biryani', 'Street Food', 'Sweets & Desserts']
  },
  {
    id: 'bihar',
    name: 'Bihar',
    type: 'state',
    capital: 'Patna',
    region: 'East',
    description: 'Smokey earthen-baked Litti Chokha roasted over cow-dung cakes, Champaran Ahuna handi mutton, crisp Thekua, and sweet Khaja.',
    famousDishes: ['Litti Chokha', 'Champaran Handi Mutton', 'Bihari Kabab', 'Thekua', 'Khaja of Silao', 'Sattu Paratha'],
    heroImage: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Traditional Indian Food', 'Mutton Recipes', 'Festival Special', 'Breakfast']
  },
  {
    id: 'west-bengal',
    name: 'West Bengal',
    type: 'state',
    capital: 'Kolkata',
    region: 'East',
    description: 'Quintessential passion for fish and sweets: Ilish Macher Jhol, Kosha Mangsho, Kolkata Kathi Rolls, spongy Rasgulla, and Mishti Doi.',
    famousDishes: ['Shorshe Ilish', 'Kosha Mangsho', 'Kolkata Biryani with Aloo', 'Chingri Malai Curry', 'Rasgulla', 'Mishti Doi'],
    heroImage: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Fish Recipes', 'Mutton Recipes', 'Sweets & Desserts', 'Biryani']
  },
  {
    id: 'odisha',
    name: 'Odisha',
    type: 'state',
    capital: 'Bhubaneswar',
    region: 'East',
    description: 'Sacred temple offerings of Jagannath Puri: Dalma, Pakhala Bhata, crab curry, Chhena Poda caramelised cottage cheese, and Rasabali.',
    famousDishes: ['Chhena Poda', 'Odia Dalma', 'Pakhala Bhata', 'Kankada Jhola (Crab Curry)', 'Rasabali', 'Santula'],
    heroImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Traditional Indian Food', 'Fish Recipes', 'Sweets & Desserts', 'Healthy Recipes']
  },
  {
    id: 'assam',
    name: 'Assam',
    type: 'state',
    capital: 'Dispur',
    region: 'Northeast',
    description: 'Gentle, aromatic cuisine accented with indigenous herbs: Masor Tenga sour fish curry, duck curry with ash gourd, and sticky rice Pitha.',
    famousDishes: ['Masor Tenga', 'Khaar', 'Duck Meat with Ash Gourd', 'Aloo Pitika', 'Til Pitha', 'Assam Tea Smoked Chicken'],
    heroImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Fish Recipes', 'Healthy Recipes', 'Traditional Indian Food', 'Festival Special']
  },
  {
    id: 'meghalaya',
    name: 'Meghalaya',
    type: 'state',
    capital: 'Shillong',
    region: 'Northeast',
    description: 'Abode of clouds with Khasi & Garo flavors: Jadoh red rice cooked with pork, Dohkhlieh salad, Tungrymbai fermented soya, and Pumaloi.',
    famousDishes: ['Jadoh Rice', 'Dohneiiong (Pork with Black Sesame)', 'Dohkhlieh', 'Tungrymbai', 'Pumaloi Steamed Rice'],
    heroImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Rice Recipes', 'Traditional Indian Food', 'Healthy Recipes']
  },
  {
    id: 'manipur',
    name: 'Manipur',
    type: 'state',
    capital: 'Imphal',
    region: 'Northeast',
    description: 'Clean organic cooking with fragrant bamboo shoot and lotus stems: Kangshoi vegetable stew, Eromba mash with ghost pepper, and Singju salad.',
    famousDishes: ['Kangshoi Stew', 'Eromba', 'Singju Herb Salad', 'Chak-Hao Black Rice Kheer', 'Nga Thongba Fish Curry'],
    heroImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Healthy Recipes', 'Vegan Recipes', 'Sweets & Desserts', 'Fish Recipes']
  },
  {
    id: 'mizoram',
    name: 'Mizoram',
    type: 'state',
    capital: 'Aizawl',
    region: 'Northeast',
    description: 'Subtle, nutrient-dense boiled and steamed delicacies: Bai seasonal vegetable stew with bamboo shoots, Vawksa Rep smoked pork, and Koat Pitha.',
    famousDishes: ['Mizo Bai', 'Vawksa Rep', 'Sanpiau Rice Porridge', 'Koat Pitha', 'Panch Phoran Tarka'],
    heroImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Healthy Recipes', 'Vegan Recipes', 'Evening Snacks']
  },
  {
    id: 'nagaland',
    name: 'Nagaland',
    type: 'state',
    capital: 'Kohima',
    region: 'Northeast',
    description: 'World-famous Naga cuisine featuring King Chilli (Bhut Jolokia), smoked meats, fermented bamboo shoots (Bastenga), and Axone soya bean.',
    famousDishes: ['Smoked Pork with Axone', 'Naga Ghost Pepper Chicken', 'Bamboo Shoot Stew', 'Galho Rice Stew', 'Rosep Aon'],
    heroImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Chicken Recipes', 'Traditional Indian Food', 'Curry & Gravy']
  },
  {
    id: 'tripura',
    name: 'Tripura',
    type: 'state',
    capital: 'Agartala',
    region: 'Northeast',
    description: 'Indigenous Tripuri culinary tradition known as Mui Borok: Berma fermented dried fish, spicy Mosdeng saang, and Bangui rice dumplings.',
    famousDishes: ['Mui Borok Fish Stew', 'Mosdeng Chicken Mash', 'Chakhwi Herb Broth', 'Bangui Rice Cake', 'Kosoi Bwtwi'],
    heroImage: 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Fish Recipes', 'Healthy Recipes', 'Rice Recipes']
  },
  {
    id: 'sikkim',
    name: 'Sikkim',
    type: 'state',
    capital: 'Gangtok',
    region: 'Northeast',
    description: 'High Himalayan organic bounty: steaming Momo dumplings with red fiery Dalle chilli dip, warming Thukpa noodle soup, and Gundruk broth.',
    famousDishes: ['Steamed Momos with Dalle Dip', 'Thukpa Noodle Soup', 'Gundruk Fermented Leaf Stew', 'Kinema Curry', 'Sel Roti'],
    heroImage: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Street Food', 'Evening Snacks', 'Healthy Recipes', 'Vegan Recipes']
  },
  {
    id: 'arunachal-pradesh',
    name: 'Arunachal Pradesh',
    type: 'state',
    capital: 'Itanagar',
    region: 'Northeast',
    description: 'Land of the Dawn-lit Mountains: Lukter smoked beef with king chillies, Pika Pila bamboo shoot pickle, and boiled rice in banana leaf.',
    famousDishes: ['Pika Pila Pickle', 'Lukter Dry Meat with Bhut Jolokia', 'Chura Sabzi (Yak Cheese Stew)', 'Zan Millet Porridge', 'Marua Porridge'],
    heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Pickles & Chutneys', 'Healthy Recipes', 'Traditional Indian Food']
  },
  {
    id: 'madhya-pradesh',
    name: 'Madhya Pradesh',
    type: 'state',
    capital: 'Bhopal',
    region: 'Central',
    description: 'The culinary heart of India: Indori Poha topped with Ratlami Sev and pomegranate, Bhutte ka Kees, and royal Bhopal Biryani.',
    famousDishes: ['Indori Poha with Sev', 'Bhutte Ka Kees', 'Bhopali Gosht Korma', 'Dal Bafla', 'Mawa Bati', 'Chakki Ki Shaak'],
    heroImage: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Breakfast', 'Street Food', 'Vegetarian Recipes', 'Mutton Recipes']
  },
  {
    id: 'chhattisgarh',
    name: 'Chhattisgarh',
    type: 'state',
    capital: 'Raipur',
    region: 'Central',
    description: 'The rice bowl of India: Chila fermented rice crepes, Fara steamed rice rolls with green chilli tadka, and tangy Dubki Kadhi.',
    famousDishes: ['Chhattisgarhi Fara', 'Chila Crepes', 'Dubki Kadhi', 'Muthia Dumplings', 'Bafauri Gram Flour Dumplings', 'Dehrori Sweet'],
    heroImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Rice Recipes', 'Evening Snacks', 'Healthy Recipes']
  },
  {
    id: 'jharkhand',
    name: 'Jharkhand',
    type: 'state',
    capital: 'Ranchi',
    region: 'East',
    description: 'Tribal culinary traditions rich with wild sal leaves and forest greens: Dhuska with chana aloo, Rugra mushroom curry, and Chilka Roti.',
    famousDishes: ['Dhuska with Ghugni', 'Rugra Wild Mushroom Curry', 'Chilka Roti', 'Arsa Roti Sweet', 'Bamboo Shoot Achar'],
    heroImage: 'https://images.unsplash.com/photo-1505253758473-96b3015f240a?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Breakfast', 'Street Food', 'Vegetarian Recipes', 'Pickles & Chutneys']
  },
  {
    id: 'goa',
    name: 'Goa',
    type: 'state',
    capital: 'Panaji',
    region: 'West',
    description: 'Vibrant Indo-Portuguese fusion: tangy Goan Fish Curry with kokum, fiery Pork Vindaloo, Bebinca layer cake, and prawn balchão.',
    famousDishes: ['Goan Fish Curry with Rice', 'Goan Pork Vindaloo', 'Chicken Xacuti', 'Bebinca Layer Cake', 'Prawn Balchão', 'Goan Poee'],
    heroImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Fish Recipes', 'Curry & Gravy', 'Sweets & Desserts', 'Chicken Recipes']
  },
  {
    id: 'himachal-pradesh',
    name: 'Himachal Pradesh',
    type: 'state',
    capital: 'Shimla',
    region: 'North',
    description: 'Mountain celebratory feast (Dham) cooked in brass pots: Madra chickpeas in yogurt sauce, Babru stuffed kachoris, and Chha Gosht.',
    famousDishes: ['Himachali Dham (Madra)', 'Babru (Stuffed Bread)', 'Chha Gosht', 'Kullu Trout Fish', 'Siddu Steamed Bread with Ghee'],
    heroImage: 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Traditional Indian Food', 'Vegetarian Recipes', 'Mutton Recipes', 'Breakfast']
  },
  {
    id: 'uttarakhand',
    name: 'Uttarakhand',
    type: 'state',
    capital: 'Dehradun',
    region: 'North',
    description: 'Garhwali and Kumaoni mountain nutrition: Kafuli spinach and fenugreek gravy, Chainsoo black gram paste, and Bal Mithai coated in sugar beads.',
    famousDishes: ['Kafuli Gravy', 'Chainsoo (Black Gram Stew)', 'Aloo Ke Gutke', 'Kumaoni Raita with Mustard', 'Almora Bal Mithai', 'Singori'],
    heroImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Healthy Recipes', 'Vegetarian Recipes', 'Sweets & Desserts']
  },

  // 8 Union Territories
  {
    id: 'delhi',
    name: 'Delhi',
    type: 'ut',
    capital: 'New Delhi',
    region: 'North',
    description: 'The street food capital of the world: Old Delhi Butter Chicken, Chandni Chowk Paranthe Wali Gali, crispy Chole Bhature, and rich Rabri Falooda.',
    famousDishes: ['Old Delhi Butter Chicken', 'Chole Bhature', 'Chandni Chowk Stuffed Paranthas', 'Nihari Gosht', 'Dahi Bhalla Chaat', 'Rabri Falooda'],
    heroImage: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Chicken Recipes', 'Street Food', 'Breakfast', 'Chapati & Roti', 'Sweets & Desserts']
  },
  {
    id: 'jammu-and-kashmir',
    name: 'Jammu and Kashmir',
    type: 'ut',
    capital: 'Srinagar / Jammu',
    region: 'North',
    description: 'The legendary multi-course royal Wazwan: fragrant Rogan Josh with Kashmiri chillies, velvety Yakhni, Modur Pulao, and saffron Kahwa tea.',
    famousDishes: ['Kashmiri Rogan Josh', 'Gushtaba (Meatballs in Gravy)', 'Yakhni Pulao', 'Kashmiri Dum Aloo', 'Haakh Saag', 'Saffron Kahwa Tea'],
    heroImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Mutton Recipes', 'Drinks & Juices', 'Traditional Indian Food', 'Curry & Gravy']
  },
  {
    id: 'ladakh',
    name: 'Ladakh',
    type: 'ut',
    capital: 'Leh',
    region: 'North',
    description: 'High-altitude cold desert resilience: Skyu pasta stew, butter tea (Gur Gur Chai), roasted barley Tsampa, and steaming hot Tingmo bread.',
    famousDishes: ['Ladakhi Skyu Stew', 'Tingmo Steamed Flower Buns', 'Gur Gur Salt Butter Tea', 'Chhurpi Yak Cheese Soup', 'Tsampa Porridge'],
    heroImage: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Healthy Recipes', 'Drinks & Juices', 'Traditional Indian Food']
  },
  {
    id: 'puducherry',
    name: 'Puducherry',
    type: 'ut',
    capital: 'Puducherry',
    region: 'South',
    description: 'French colonial charm meets Tamil spice: Creole fish curry, Baguette with mutton roast, Crab masala, and French-style croissants.',
    famousDishes: ['Puducherry Creole Fish Curry', 'Mouton Salé (Salted Mutton)', 'Assad Coconut Curry', 'Crab Chettinad Fry', 'Pineapple Jam Tarts'],
    heroImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Fish Recipes', 'Curry & Gravy', 'Breakfast']
  },
  {
    id: 'chandigarh',
    name: 'Chandigarh',
    type: 'ut',
    capital: 'Chandigarh',
    region: 'North',
    description: 'Modern planned elegance with robust Punjabi zest: buttery tandoori platters, crisp stuffed kulchas, and luscious kulfi falooda.',
    famousDishes: ['Tandoori Chicken Platter', 'Amritsari Paneer Kulcha', 'Dal Makhani Tadka', 'Matka Kulfi', 'Goli Soda'],
    heroImage: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Street Food', 'Chicken Recipes', 'Sweets & Desserts']
  },
  {
    id: 'lakshadweep',
    name: 'Lakshadweep',
    type: 'ut',
    capital: 'Kavaratti',
    region: 'South',
    description: 'Pristine coral atolls where fresh tuna reigns supreme: Mus Kavaab spiced tuna skewers, Rayereha red coconut tuna curry, and Appam.',
    famousDishes: ['Mus Kavaab (Tuna Skewers)', 'Rayereha Tuna Curry', 'Sannas Rice Cakes', 'Batla Appam', 'Kadalakka Coconut Sweet'],
    heroImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Fish Recipes', 'Curry & Gravy', 'Evening Snacks']
  },
  {
    id: 'andaman-and-nicobar-islands',
    name: 'Andaman and Nicobar Islands',
    type: 'ut',
    capital: 'Port Blair',
    region: 'South',
    description: 'Tropical coastal paradise with fresh ocean catch: Andaman Fish Curry, grilled lobster with crushed island spices, and coconut prawn curry.',
    famousDishes: ['Andaman Fish Curry', 'Coconut Prawn Curry', 'Grilled Lobster in Island Butter', 'Chilli Crab Masala', 'Banana Flower Curry'],
    heroImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Fish Recipes', 'Curry & Gravy', 'Healthy Recipes']
  },
  {
    id: 'dadra-and-nagar-haveli-and-daman-and-diu',
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    type: 'ut',
    capital: 'Daman',
    region: 'West',
    description: 'Portuguese maritime legacy mingled with Gujarati tribal flavours: Ubadiyu earthen pot roasted tubers, Crab Xec Xec, and Cozido fish stew.',
    famousDishes: ['Ubadiyu Pot Roast', 'Daman Crab Xec Xec', 'Val Fish Curry', 'Pau Com Chouriço', 'Khatta Dhokla'],
    heroImage: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=1200&auto=format&fit=crop&q=80',
    popularCategories: ['Fish Recipes', 'Vegetarian Recipes', 'Traditional Indian Food']
  }
];
