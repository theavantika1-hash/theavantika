export const DISHES = [
  {
    id: 1,
    category: 'The Classics',
    image: '/burger.png',
    description: ''
  },
  {
    id: 2,
    category: 'Hot & Fresh',
    image: '/pizza.png',
    description: 'Freshly baked with premium mozzarella, signature herb tomato sauce, and savory pepperoni toppings.'
  },
  {
    id: 3,
    category: 'Spicy Fiesta',
    image: '/tacos.png',
    description: 'Crispy corn shells filled with seasoned beef, fresh cilantro, lime zest, and home-style hot salsa.'
  }
];

export const POPULAR_CATEGORIES = [
  { name: 'North Indian', image: '/pizza.png' },
  { name: 'Chinese / Oriental', image: '/burger.png' },
  { name: 'Thai', image: '/tacos.png' },
  { name: 'Italian', image: '/pizza.png' },
  { name: 'Mexican', image: '/tacos.png' },
  { name: 'Continental / Fusion', image: '/burger.png' },
  { name: 'Soups & Salads', image: '/tacos.png' },
  { name: 'Sizzlers', image: '/pizza.png' },
  { name: 'Desserts', image: '/tacos.png' },
  { name: 'Beverages', image: '/burger.png' }
];

export const INITIAL_ALL_FOODS = [
  // === NORTH INDIAN ===
  // Appetizers
  { name: 'Paneer Tikka', category: 'North Indian', subcategory: 'Appetizers', price: '₹299', cost: 299, rating: 4.6, time: 18, isVeg: true, image: '/tacos.png', description: 'Cottage cheese marinated in hung curd & spices' },
  { name: 'Basil Rajwadi Paneer Tikka', category: 'North Indian', subcategory: 'Appetizers', price: '₹319', cost: 319, rating: 4.8, time: 20, isVeg: true, image: '/burger.png', description: 'Cottage cheese marinated in basil pesto & special creamy rajwadi spice' },
  { name: 'Makhmali Paneer Tikka', category: 'North Indian', subcategory: 'Appetizers', price: '₹319', cost: 319, rating: 4.7, time: 20, isVeg: true, image: '/pizza.png', description: 'Cottage cheese marinated with cream of cashew nuts & cheese' },
  { name: 'Dahi Ke Kebab', category: 'North Indian', subcategory: 'Appetizers', price: '₹269', cost: 269, rating: 4.5, time: 15, isVeg: true, image: '/tacos.png', description: 'Fine chopped vegetables & hung curd kebab' },
  { name: 'Hara Bhara Kebab', category: 'North Indian', subcategory: 'Appetizers', price: '₹249', cost: 249, rating: 4.2, time: 12, isVeg: true, image: '/pizza.png', description: 'Green vegetables kebab' },
  { name: 'Tandoori Soya Chaap', category: 'North Indian', subcategory: 'Appetizers', price: '₹259', cost: 259, rating: 4.4, time: 16, isVeg: true, image: '/burger.png', description: 'Soya chaap marinated in yogurt & spices' },
  { name: 'Malai Soya Chaap', category: 'North Indian', subcategory: 'Appetizers', price: '₹279', cost: 279, rating: 4.7, time: 17, isVeg: true, image: '/pizza.png', description: 'Soya chaap marinated in yogurt, cheese, cashew paste' },
  { name: 'Stuffed Mushroom', category: 'North Indian', subcategory: 'Appetizers', price: '₹299', cost: 299, rating: 4.6, time: 16, isVeg: true, image: '/burger.png', description: 'Bell pepper, cottage cheese stuffed mushroom marinated with tandoori sauce' },
  { name: 'Mushroom Tikka', category: 'North Indian', subcategory: 'Appetizers', price: '₹279', cost: 279, rating: 4.5, time: 15, isVeg: true, image: '/pizza.png', description: 'Mushroom marinated in hung curd & spices' },
  { name: 'Tandoori Bharva Aloo', category: 'North Indian', subcategory: 'Appetizers', price: '₹269', cost: 269, rating: 4.3, time: 17, isVeg: true, image: '/tacos.png', description: 'Roasted cashew, raisins, crushed potato chips with indian spices' },
  { name: 'Peanut Masala / Sweet Corn Masala', category: 'North Indian', subcategory: 'Appetizers', price: '₹199', cost: 199, rating: 4.1, time: 10, isVeg: true, image: '/burger.png', description: 'Classic peanut masala or sweet corn masala' },

  // Curries
  { name: 'Aloo Jeera', category: 'North Indian', subcategory: 'Curries', price: '₹199', cost: 199, rating: 4.0, time: 10, isVeg: true, image: '/tacos.png', description: 'Potatoes and cumin seeds' },
  { name: 'Raseela Rajma', category: 'North Indian', subcategory: 'Curries', price: '₹279', cost: 279, rating: 4.3, time: 15, isVeg: true, image: '/burger.png', description: 'Red gravy authentic kidney beans' },
  { name: 'Chana Masala', category: 'North Indian', subcategory: 'Curries', price: '₹279', cost: 279, rating: 4.4, time: 18, isVeg: true, image: '/pizza.png', description: 'Chickpeas cooked in onion tomato gravy' },
  { name: 'Corn Palak', category: 'North Indian', subcategory: 'Curries', price: '₹289', cost: 289, rating: 4.2, time: 16, isVeg: true, image: '/burger.png', description: 'American corn in smooth spinach gravy' },
  { name: 'Kashmiri Dum Aloo', category: 'North Indian', subcategory: 'Curries', price: '₹319', cost: 319, rating: 4.6, time: 20, isVeg: true, image: '/tacos.png', description: 'Dry fruit stuffed, mashed cottage cheese potato in kashmiri style red gravy' },
  { name: 'Dum Aloo Banarasi', category: 'North Indian', subcategory: 'Curries', price: '₹319', cost: 319, rating: 4.5, time: 20, isVeg: true, image: '/pizza.png', description: 'Dryfruit, mashed cottage cheese & mint stuffed potato in yellow gravy' },
  { name: 'Veg Kohlapuri', category: 'North Indian', subcategory: 'Curries', price: '₹319', cost: 319, rating: 4.4, time: 18, isVeg: true, image: '/burger.png', description: 'Kolhapuri style mixed vegetables' },
  { name: 'Special Mix Vegetable', category: 'North Indian', subcategory: 'Curries', price: '₹319', cost: 319, rating: 4.5, time: 18, isVeg: true, image: '/pizza.png', description: 'Corn, babycorn, mix vegetables, cottage cheese' },
  { name: 'Deewani Handi', category: 'North Indian', subcategory: 'Curries', price: '₹319', cost: 319, rating: 4.5, time: 18, isVeg: true, image: '/pizza.png', description: 'Mixed vegetables in spinach gravy' },
  { name: 'Kadhai Veg', category: 'North Indian', subcategory: 'Curries', price: '₹319', cost: 319, rating: 4.3, time: 17, isVeg: true, image: '/tacos.png', description: 'Mix vegetable in tomato gravy' },
  { name: 'Mushroom Masala', category: 'North Indian', subcategory: 'Curries', price: '₹329', cost: 329, rating: 4.4, time: 16, isVeg: true, image: '/burger.png', description: 'Mushroom in red gravy' },
  { name: 'Bhuna Mushroom Masala', category: 'North Indian', subcategory: 'Curries', price: '₹329', cost: 329, rating: 4.4, time: 16, isVeg: true, image: '/pizza.png', description: 'Saute mushroom in red gravy' },
  { name: 'Kadhai Mushroom Masala', category: 'North Indian', subcategory: 'Curries', price: '₹329', cost: 329, rating: 4.5, time: 18, isVeg: true, image: '/tacos.png', description: 'Mushroom, onion, bell pepper in red gravy' },
  { name: 'Soya Chaap Masala', category: 'North Indian', subcategory: 'Curries', price: '₹329', cost: 329, rating: 4.3, time: 16, isVeg: true, image: '/burger.png', description: 'Soya chaap in red gravy' },
  { name: 'Palak Paneer', category: 'North Indian', subcategory: 'Curries', price: '₹329', cost: 329, rating: 4.5, time: 20, isVeg: true, image: '/tacos.png', description: 'Cottage cheese in smooth spinach gravy' },
  { name: 'Paneer Butter Masala', category: 'North Indian', subcategory: 'Curries', price: '₹349', cost: 349, rating: 4.9, time: 20, isVeg: true, image: '/tacos.png', description: 'Cottage cheese in tomato gravy' },
  { name: 'Paneer Lababdar', category: 'North Indian', subcategory: 'Curries', price: '₹349', cost: 349, rating: 4.6, time: 22, isVeg: true, image: '/burger.png', description: 'Cottage cheese, bell pepper in creamy tomato gravy' },
  { name: 'Handi Paneer', category: 'North Indian', subcategory: 'Curries', price: '₹349', cost: 349, rating: 4.7, time: 22, isVeg: true, image: '/tacos.png', description: 'Cottage cheese, capsicum, onion in red gravy' },
  { name: 'Paneer Khurchan', category: 'North Indian', subcategory: 'Curries', price: '₹379', cost: 379, rating: 4.6, time: 21, isVeg: true, image: '/pizza.png', description: 'Cottage cheese, bell pepper & onion' },
  { name: 'Tandoori Paneer Tikka Masala', category: 'North Indian', subcategory: 'Curries', price: '₹379', cost: 379, rating: 4.7, time: 23, isVeg: true, image: '/burger.png', description: 'Paneer tikka, onion & bell pepper in tomato gravy' },
  { name: 'Angara Smoky Paneer', category: 'North Indian', subcategory: 'Curries', price: '₹379', cost: 379, rating: 4.6, time: 22, isVeg: true, image: '/pizza.png', description: 'Cottage cheese in red gravy' },
  { name: 'Amritsari Paneer', category: 'North Indian', subcategory: 'Curries', price: '₹379', cost: 379, rating: 4.6, time: 22, isVeg: true, image: '/tacos.png', description: 'Cottage cheese in spicy red gravy' },
  { name: 'Shahi Paneer (Red / White)', category: 'North Indian', subcategory: 'Curries', price: '₹349 / ₹379', cost: 349, rating: 4.6, time: 20, isVeg: true, image: '/pizza.png', description: 'Cottage cheese in red & white gravy' },
  { name: 'Paneer Burji', category: 'North Indian', subcategory: 'Curries', price: '₹399', cost: 399, rating: 4.8, time: 15, isVeg: true, image: '/burger.png', description: 'Cottage cheese stuffed in tangy red gravy' },
  { name: "Avantika's Signature Paneer Pasanda", category: 'North Indian', subcategory: 'Curries', price: '₹399', cost: 399, rating: 4.9, time: 28, isVeg: true, image: '/pizza.png', description: 'Cottage cheese stuffed with mava in creamy gravy' },
  { name: "Avantika's Signature Shaam Savera", category: 'North Indian', subcategory: 'Curries', price: '₹399', cost: 399, rating: 4.9, time: 30, isVeg: true, image: '/tacos.png', description: 'Chopped spinach stuffed with cottage cheese, mava & dry fruit in yellow gravy' },
  { name: 'Malai Kofta (Red/White)', category: 'North Indian', subcategory: 'Curries', price: '₹349 / ₹379', cost: 349, rating: 4.7, time: 22, isVeg: true, image: '/burger.png', description: 'Dryfruit stuffed cottage cheese dumpling in red / white gravy' },
  { name: 'Navratan Korma', category: 'North Indian', subcategory: 'Curries', price: '₹379', cost: 379, rating: 4.6, time: 24, isVeg: true, image: '/pizza.png', description: 'Nine-gem curry with an assortment of veggies, fruits and nuts in rich white gravy' },
  { name: 'Kaju Curry', category: 'North Indian', subcategory: 'Curries', price: '₹379', cost: 379, rating: 4.7, time: 18, isVeg: true, image: '/tacos.png', description: 'Cashew nut in brown gravy' },

  // Dal
  { name: 'Dal Makhani', category: 'North Indian', subcategory: 'Dal', price: '₹319', cost: 319, rating: 4.8, time: 22, isVeg: true, image: '/burger.png', description: 'Creamy slow cooked black lentils' },
  { name: 'Dal Panchmel', category: 'North Indian', subcategory: 'Dal', price: '₹269', cost: 269, rating: 4.4, time: 18, isVeg: true, image: '/tacos.png', description: 'Traditional Rajasthani mixture of five lentils' },
  { name: 'Dal Fry', category: 'North Indian', subcategory: 'Dal', price: '₹239', cost: 239, rating: 4.3, time: 14, isVeg: true, image: '/burger.png', description: 'Yellow lentils cooked and fried with spices' },
  { name: 'Dal Tadka', category: 'North Indian', subcategory: 'Dal', price: '₹239', cost: 239, rating: 4.4, time: 15, isVeg: true, image: '/pizza.png', description: 'Yellow lentils tempered with garlic and cumin' },

  // Bread
  { name: 'Tandoori (Plain / Butter)', category: 'North Indian', subcategory: 'Bread', price: '₹35 / ₹39', cost: 35, rating: 4.2, time: 6, isVeg: true, image: '/tacos.png', description: 'Whole wheat flatbread cooked in tandoor' },
  { name: "Avantika's Signature Roti", category: 'North Indian', subcategory: 'Bread', price: '₹59', cost: 59, rating: 4.6, time: 7, isVeg: true, image: '/burger.png', description: 'Special signature flatbread' },
  { name: 'Missi Roti', category: 'North Indian', subcategory: 'Bread', price: '₹69', cost: 69, rating: 4.4, time: 8, isVeg: true, image: '/pizza.png', description: 'Flatbread made with chickpea flour' },
  { name: 'Lachha Paratha (Plain / Mirchi / Ajwain)', category: 'North Indian', subcategory: 'Bread', price: '₹89', cost: 89, rating: 4.5, time: 9, isVeg: true, image: '/tacos.png', description: 'Layered tandoori flatbread' },
  { name: 'Signature Chur Chur Naan', category: 'North Indian', subcategory: 'Bread', price: '₹159', cost: 159, rating: 4.8, time: 18, isVeg: true, image: '/burger.png', description: 'Crispy, layered crushed tandoori bread stuffed with spiced vegetables and cottage cheese' },
  { name: 'Naan (Plain / Butter / Garlic)', category: 'North Indian', subcategory: 'Bread', price: '₹69 / ₹79 / ₹99', cost: 69, rating: 4.5, time: 8, isVeg: true, image: '/pizza.png', description: 'Leavened refined flour bread' },
  { name: 'Stuffed Naan (Aloo / Paneer / Cheese)', category: 'North Indian', subcategory: 'Bread', price: '₹95 / ₹119 / ₹149', cost: 95, rating: 4.6, time: 10, isVeg: true, image: '/tacos.png', description: 'Stuffed leavened refined flour bread' },
  { name: 'Cheese Stuffed Garlic Naan', category: 'North Indian', subcategory: 'Bread', price: '₹159', cost: 159, rating: 4.8, time: 10, isVeg: true, image: '/tacos.png', description: 'Indulgent bread stuffed with cheese and seasoned with garlic' },
  { name: 'Kashmiri Naan', category: 'North Indian', subcategory: 'Bread', price: '₹179', cost: 179, rating: 4.6, time: 10, isVeg: true, image: '/burger.png', description: 'Sweet naan stuffed with nuts and dry fruits' },

  // Rice
  { name: 'Kashmiri Pulao', category: 'North Indian', subcategory: 'Rice', price: '₹319', cost: 319, rating: 4.6, time: 15, isVeg: true, image: '/pizza.png', description: 'Rich sweet pulao loaded with fruits and nuts' },
  { name: 'Veg Biryani', category: 'North Indian', subcategory: 'Rice', price: '₹299', cost: 299, rating: 4.8, time: 25, isVeg: true, image: '/burger.png', description: 'Fragrant long-grain basmati rice cooked with fresh seasonal vegetables and spices' },
  { name: 'Veg Pulao', category: 'North Indian', subcategory: 'Rice', price: '₹229', cost: 229, rating: 4.4, time: 15, isVeg: true, image: '/tacos.png', description: 'Basmati rice cooked with mixed vegetables' },
  { name: 'Jeera Rice', category: 'North Indian', subcategory: 'Rice', price: '₹169', cost: 169, rating: 4.2, time: 10, isVeg: true, image: '/burger.png', description: 'Basmati rice flavored with cumin seeds' },
  { name: 'Steamed Rice', category: 'North Indian', subcategory: 'Rice', price: '₹159', cost: 159, rating: 4.0, time: 8, isVeg: true, image: '/pizza.png', description: 'Plain steamed basmati rice' },

  // Side Orders
  { name: 'Raita (Curd / Boondi / Vegetables / Pineapple)', category: 'North Indian', subcategory: 'Side Orders', price: '₹139 - ₹169', cost: 139, rating: 4.3, time: 6, isVeg: true, image: '/tacos.png', description: 'Chilled spiced yogurt mix' },
  { name: 'Masala Buttermilk', category: 'North Indian', subcategory: 'Side Orders', price: '₹89', cost: 89, rating: 4.4, time: 5, isVeg: true, image: '/burger.png', description: 'Spiced salted buttermilk' },
  { name: 'Lassi (Sweet / Mango / Rose)', category: 'North Indian', subcategory: 'Side Orders', price: '₹119 / ₹139', cost: 119, rating: 4.5, time: 6, isVeg: true, image: '/pizza.png', description: 'Sweet thick yogurt drink' },
  { name: 'Papad (Plain / Masala)', category: 'North Indian', subcategory: 'Side Orders', price: '₹39 / ₹59', cost: 39, rating: 4.1, time: 4, isVeg: true, image: '/tacos.png', description: 'Crispy Indian papad' },
  { name: 'Green Salad', category: 'North Indian', subcategory: 'Side Orders', price: '₹129', cost: 129, rating: 4.1, time: 8, isVeg: true, image: '/tacos.png', description: 'Fresh cucumber, tomato, onion, carrot' },

  // Breakfast
  { name: 'Bread Pakora', category: 'North Indian', subcategory: 'Breakfast', price: '₹79', cost: 79, rating: 4.2, time: 10, isVeg: true, image: '/burger.png', description: 'Spiced potato stuffed bread fritter' },
  { name: 'Poha Masala', category: 'North Indian', subcategory: 'Breakfast', price: '₹119', cost: 119, rating: 4.3, time: 8, isVeg: true, image: '/pizza.png', description: 'Flattened rice cooked with spices & peanuts' },
  { name: 'Masala Oats', category: 'North Indian', subcategory: 'Breakfast', price: '₹129', cost: 129, rating: 4.1, time: 10, isVeg: true, image: '/tacos.png', description: 'Healthy oats cooked with Indian spices' },
  { name: 'Aloo Paratha with Curd', category: 'North Indian', subcategory: 'Breakfast', price: '₹149', cost: 149, rating: 4.5, time: 12, isVeg: true, image: '/pizza.png', description: 'Indian flatbread stuffed with spiced potato' },
  { name: 'Onion Paratha with Curd', category: 'North Indian', subcategory: 'Breakfast', price: '₹149', cost: 149, rating: 4.4, time: 12, isVeg: true, image: '/burger.png', description: 'Flatbread stuffed with spiced onions' },
  { name: 'Puri Bhaji', category: 'North Indian', subcategory: 'Breakfast', price: '₹149', cost: 149, rating: 4.5, time: 14, isVeg: true, image: '/tacos.png', description: 'Deep fried puff bread served with potato curry' },
  { name: 'Paav Bhaji', category: 'North Indian', subcategory: 'Breakfast', price: '₹149', cost: 149, rating: 4.6, time: 12, isVeg: true, image: '/pizza.png', description: 'Spiced mixed vegetable mash with buttered buns' },
  { name: 'Cornflakes with Milk', category: 'North Indian', subcategory: 'Breakfast', price: '₹129', cost: 129, rating: 4.0, time: 5, isVeg: true, image: '/burger.png', description: 'Cornflakes with warm or cold milk' },
  { name: 'Paneer Pakora', category: 'North Indian', subcategory: 'Breakfast', price: '₹249', cost: 249, rating: 4.6, time: 12, isVeg: true, image: '/pizza.png', description: 'Batter fried cottage cheese fritters' },
  { name: 'Mix Veg Pakora', category: 'North Indian', subcategory: 'Breakfast', price: '₹199', cost: 199, rating: 4.3, time: 10, isVeg: true, image: '/tacos.png', description: 'Crispy mixed vegetable fritters' },
  { name: 'Veg Khichadi', category: 'North Indian', subcategory: 'Breakfast', price: '₹269', cost: 269, rating: 4.5, time: 16, isVeg: true, image: '/burger.png', description: 'Healthy mixture of rice and lentils with vegetables' },
  { name: 'Dal Khichadi', category: 'North Indian', subcategory: 'Breakfast', price: '₹269', cost: 269, rating: 4.5, time: 16, isVeg: true, image: '/pizza.png', description: 'Comforting rice and lentil mash' },

  // === CHINESE / INDO-CHINESE (ORIENTAL) ===
  // Appetizers
  { name: 'Chilli Paneer (Dry/Gravy)', category: 'Chinese / Oriental', subcategory: 'Appetizers', price: '₹289', cost: 289, rating: 4.7, time: 16, isVeg: true, image: '/pizza.png', description: 'Crisp batter fried paneer tossed in slightly sweet, spicy, hot and tangy chilli garlic sauce' },
  { name: 'Chilli Mushroom (Dry/Gravy)', category: 'Chinese / Oriental', subcategory: 'Appetizers', price: '₹269', cost: 269, rating: 4.4, time: 15, isVeg: true, image: '/tacos.png', description: 'Crisp batter fried mushrooms tossed in a sweet and spicy chilli sauce' },
  { name: 'Manchurian (Dry/Gravy)', category: 'Chinese / Oriental', subcategory: 'Appetizers', price: '₹249 / ₹259', cost: 249, rating: 4.5, time: 14, isVeg: true, image: '/burger.png', description: 'Mix vegetables dumpling in soya garlic sauce' },
  { name: 'Honey Chilli Potato', category: 'Chinese / Oriental', subcategory: 'Appetizers', price: '₹249', cost: 249, rating: 4.5, time: 14, isVeg: true, image: '/tacos.png', description: 'Crispy potato fingers tossed in honey chilli sauce' },
  { name: 'Spring Roll', category: 'Chinese / Oriental', subcategory: 'Appetizers', price: '₹229', cost: 229, rating: 4.3, time: 12, isVeg: true, image: '/burger.png', description: 'Fried wonton sheet rolls filled with spring vegetables' },
  { name: "Avantika's Signature Spider Roll", category: 'Chinese / Oriental', subcategory: 'Appetizers', price: '₹269', cost: 269, rating: 4.9, time: 25, isVeg: true, image: '/burger.png', description: 'Crispy battered vegetables rolled & fried with noodles served with hot garlic sauce' },
  { name: 'Paneer 65', category: 'Chinese / Oriental', subcategory: 'Appetizers', price: '₹279', cost: 279, rating: 4.6, time: 16, isVeg: true, image: '/pizza.png', description: 'Cottage cheese cubes marinated in Hyderabadi spices, tossed in tangy sauce' },
  { name: 'Crispy Corn Kernels', category: 'Chinese / Oriental', subcategory: 'Appetizers', price: '₹249', cost: 249, rating: 4.4, time: 12, isVeg: true, image: '/burger.png', description: 'Stir fried corn with vegetables' },
  { name: 'Veg Salt & Pepper', category: 'Chinese / Oriental', subcategory: 'Appetizers', price: '₹249', cost: 249, rating: 4.3, time: 13, isVeg: true, image: '/pizza.png', description: 'Exotic vegetables bursting with taste and flavours of seasonings' },
  { name: 'Mushroom Salt & Pepper', category: 'Chinese / Oriental', subcategory: 'Appetizers', price: '₹269', cost: 269, rating: 4.4, time: 14, isVeg: true, image: '/tacos.png', description: 'Mushroom bursting with taste and flavours of seasonings' },
  { name: 'Veg Cutlet', category: 'Chinese / Oriental', subcategory: 'Appetizers', price: '₹229', cost: 229, rating: 4.2, time: 12, isVeg: true, image: '/burger.png', description: 'Golden-crisp cutlets packed with a variety of fresh vegetables and spices' },
  { name: 'American Chop Suey', category: 'Chinese / Oriental', subcategory: 'Appetizers', price: '₹249', cost: 249, rating: 4.4, time: 15, isVeg: true, image: '/pizza.png', description: 'Veggies tossed in a sweet, tangy, spicy sauce poured over crispy fried noodles' },

  // Rice & Noodles
  { name: 'Fried Rice (Veg / Schezwan / Chilli / Butter)', category: 'Chinese / Oriental', subcategory: 'Rice & Noodles', price: '₹249', cost: 249, rating: 4.3, time: 12, isVeg: true, image: '/pizza.png', description: 'Rice stir fried with fresh vegetables and flavorful sauces' },
  { name: 'Noodles (Hakka / Schezwan / Chilli / Singapore)', category: 'Chinese / Oriental', subcategory: 'Rice & Noodles', price: '₹259', cost: 259, rating: 4.4, time: 14, isVeg: true, image: '/tacos.png', description: 'Freshly tossed noodles in a wok with oriental seasonings' },
  { name: 'Pan Fried Noodles', category: 'Chinese / Oriental', subcategory: 'Rice & Noodles', price: '₹259', cost: 259, rating: 4.4, time: 15, isVeg: true, image: '/tacos.png', description: 'Crispy noodles in spiced tangy veggie gravy' },

  // === THAI ===
  { name: 'Pad Thai Noodle', category: 'Thai', price: '₹299', cost: 299, rating: 4.5, time: 16, isVeg: true, image: '/tacos.png', description: 'Thai noodle stir fry with a sweet-savoury-sour sauce scattered with crushed peanuts' },

  // === ITALIAN ===
  // Pasta
  { name: 'Agilo E Olio (Penne/Spaghetti)', category: 'Italian', subcategory: 'Pasta', price: '₹299', cost: 299, rating: 4.4, time: 15, isVeg: true, image: '/pizza.png', description: 'Veggies & parmesan cheese' },
  { name: 'Arrabiata Pasta', category: 'Italian', subcategory: 'Pasta', price: '₹319', cost: 319, rating: 4.4, time: 15, isVeg: true, image: '/pizza.png', description: 'Pasta & veggies in red sauce' },
  { name: 'Alfredo Pasta', category: 'Italian', subcategory: 'Pasta', price: '₹329', cost: 329, rating: 4.5, time: 16, isVeg: true, image: '/tacos.png', description: 'Pasta & veggies in creamy white sauce' },
  { name: 'Roso Pasta', category: 'Italian', subcategory: 'Pasta', price: '₹329', cost: 329, rating: 4.4, time: 16, isVeg: true, image: '/burger.png', description: 'Pasta & veggies in pink sauce' },
  { name: 'Funghi Pasta', category: 'Italian', subcategory: 'Pasta', price: '₹349', cost: 349, rating: 4.5, time: 17, isVeg: true, image: '/tacos.png', description: 'Pasta & mushroom in creamy mushroom sauce' },
  { name: 'Pesto Pasta', category: 'Italian', subcategory: 'Pasta', price: '₹349', cost: 349, rating: 4.5, time: 17, isVeg: true, image: '/burger.png', description: 'Pasta & veggies in creamy basil pesto sauce' },

  // Baked
  { name: 'Baked Lasagna', category: 'Italian', subcategory: 'Baked', price: '₹399', cost: 399, rating: 4.9, time: 22, isVeg: true, image: '/tacos.png', description: 'Layers of fresh pasta sheet, mixed vegetables, loaded with mozzarella and baked' },
  { name: 'Mac N Cheese', category: 'Italian', subcategory: 'Baked', price: '₹299', cost: 299, rating: 4.6, time: 18, isVeg: true, image: '/pizza.png', description: 'Creamy macaroni loaded with triple cheddar cheese' },
  { name: 'Baked Vegetable', category: 'Italian', subcategory: 'Baked', price: '₹329', cost: 329, rating: 4.3, time: 18, isVeg: true, image: '/burger.png', description: 'Mix vegetables in creamy white sauce, baked with cheese' },
  { name: 'Baked Spinach', category: 'Italian', subcategory: 'Baked', price: '₹315', cost: 315, rating: 4.4, time: 16, isVeg: true, image: '/tacos.png', description: 'Spinach and corn baked with rich cheese sauce' },

  // Pizza
  { name: 'Margherita Pizza', category: 'Italian', subcategory: 'Pizza', price: '₹319', cost: 319, rating: 4.6, time: 15, isVeg: true, image: '/pizza.png', description: 'Tomato sauce, fresh mozzarella and basil, a drizzle of olive oil, and a sprinkle of salt' },
  { name: 'OTC Pizza', category: 'Italian', subcategory: 'Pizza', price: '₹329', cost: 329, rating: 4.4, time: 15, isVeg: true, image: '/tacos.png', description: 'Onion, Tomato & Bell Pepper' },
  { name: 'Corn Pizza', category: 'Italian', subcategory: 'Pizza', price: '₹329', cost: 329, rating: 4.3, time: 14, isVeg: true, image: '/burger.png', description: 'Corn & cheese' },
  { name: 'Farm Fresh Pizza', category: 'Italian', subcategory: 'Pizza', price: '₹379', cost: 379, rating: 4.7, time: 18, isVeg: true, image: '/burger.png', description: 'Onion, bell pepper, broccoli, olive, jalapeno, corn' },
  { name: 'Hot Paprika & Paneer Pizza', category: 'Italian', subcategory: 'Pizza', price: '₹379', cost: 379, rating: 4.6, time: 17, isVeg: true, image: '/pizza.png', description: 'Smoked paprika marinated paneer, red pepper & onion' },
  { name: 'Caramelized Pickle Onion & Mushroom Pizza', category: 'Italian', subcategory: 'Pizza', price: '₹369', cost: 369, rating: 4.5, time: 16, isVeg: true, image: '/tacos.png', description: 'Caramelized onion, mushroom & burnt garlic' },
  { name: 'Chipotle Mexican Grill Pizza', category: 'Italian', subcategory: 'Pizza', price: '₹359', cost: 359, rating: 4.5, time: 16, isVeg: true, image: '/burger.png', description: 'Spicy chipotle sauce, onion, red pepper, corn & jalapeno' },
  { name: "Avantika's Signature Pizza", category: 'Italian', subcategory: 'Pizza', price: '₹429', cost: 429, rating: 4.9, time: 24, isVeg: true, image: '/pizza.png', description: 'One of its kind pizza loaded with premium exotic vegetables, burnt garlic, and fresh mozzarella.' },

  // === MEXICAN ===
  { name: 'Corn Cheese Ball', category: 'Mexican', price: '₹229', cost: 229, rating: 4.4, time: 12, isVeg: true, image: '/burger.png', description: 'Crispy corn and cheese snacks' },
  { name: 'Mexican Rice', category: 'Mexican', price: '₹249', cost: 249, rating: 4.3, time: 14, isVeg: true, image: '/pizza.png', description: 'Zesty Mexican style rice' },
  { name: 'Quesadilla', category: 'Mexican', price: '₹189', cost: 189, rating: 4.2, time: 13, isVeg: true, image: '/tacos.png', description: 'Tortilla filled with cheese and vegetables' },
  { name: 'Veg Tacos', category: 'Mexican', price: '₹179', cost: 179, rating: 4.2, time: 12, isVeg: true, image: '/tacos.png', description: 'Crispy shells packed with beans, salsa and cheese' },
  { name: 'Cheese Loaded Tacos', category: 'Mexican', price: '₹229', cost: 229, rating: 4.5, time: 14, isVeg: true, image: '/burger.png', description: 'Tacos loaded with extra cheese' },
  { name: 'Jalapeno Cheese Poppers', category: 'Mexican', price: '₹229', cost: 229, rating: 4.4, time: 10, isVeg: true, image: '/pizza.png', description: 'Crispy jalapeno bites with molten cheese center' },

  // === CONTINENTAL / FUSION ===
  // Sandwich
  { name: 'Veggie Delight Sandwich', category: 'Continental / Fusion', subcategory: 'Sandwich', price: '₹169', cost: 169, rating: 4.2, time: 10, isVeg: true, image: '/tacos.png', description: 'Garden fresh lettuce, tomatoes, cucumis sativus, onions, served on freshly baked bread' },
  { name: 'Veggie Cheese Sandwich', category: 'Continental / Fusion', subcategory: 'Sandwich', price: '₹189', cost: 189, rating: 4.3, time: 11, isVeg: true, image: '/burger.png', description: 'Garden fresh lettuce, tomatoes, cucumis sativus, cheese slice served on freshly baked bread' },
  { name: 'Bombay Masala Sandwich', category: 'Continental / Fusion', subcategory: 'Sandwich', price: '₹199', cost: 199, rating: 4.5, time: 12, isVeg: true, image: '/pizza.png', description: 'Green chutney, potato, tomato, onion, grated cheese, and chaat masala' },
  { name: 'Veg Club Sandwich', category: 'Continental / Fusion', subcategory: 'Sandwich', price: '₹219', cost: 219, rating: 4.4, time: 14, isVeg: true, image: '/tacos.png', description: 'Double decker sandwich with spring veggies marinated with mayo, cucumis sativus & tomato' },
  { name: 'Paneer Tikka Tandoori Sandwich', category: 'Continental / Fusion', subcategory: 'Sandwich', price: '₹249', cost: 249, rating: 4.6, time: 15, isVeg: true, image: '/burger.png', description: 'Loaded with all the goodness of cottage paneer with lip-smacking tikka spices' },

  // Wraps & Rolls
  { name: 'Jalapeno Wrap', category: 'Continental / Fusion', subcategory: 'Wraps', price: '₹169', cost: 169, rating: 4.5, time: 12, isVeg: true, image: '/pizza.png', description: 'Tortilla stuffed with vegetables, cheese, cottage cheese, jalapeno with sauces' },
  { name: 'Fully Loaded Wrap', category: 'Continental / Fusion', subcategory: 'Wraps', price: '₹189', cost: 189, rating: 4.4, time: 13, isVeg: true, image: '/tacos.png', description: 'Tortilla stuffed with vegetables, cheese, cottage cheese with sauces' },
  { name: 'Mexican Wrap', category: 'Continental / Fusion', subcategory: 'Wraps', price: '₹179', cost: 179, rating: 4.3, time: 12, isVeg: true, image: '/burger.png', description: 'Tortilla stuffed with baked rajma, salsa, iceberg with nachos' },
  { name: 'Veg Wrap', category: 'Continental / Fusion', subcategory: 'Wraps', price: '₹159', cost: 159, rating: 4.1, time: 10, isVeg: true, image: '/pizza.png', description: 'Tortilla stuffed with veggies, corn & sauces' },
  { name: 'Veg Kathi Roll', category: 'Continental / Fusion', subcategory: 'Wraps', price: '₹159', cost: 159, rating: 4.2, time: 10, isVeg: true, image: '/tacos.png', description: 'Indian style tortilla stuffed with veggies & sauces' },
  { name: 'Paneer Wrap', category: 'Continental / Fusion', subcategory: 'Wraps', price: '₹189', cost: 189, rating: 4.5, time: 12, isVeg: true, image: '/burger.png', description: 'Tortilla stuffed with cottage cheese, vegetables & sauces' },
  { name: 'Paneer Tikka Roll', category: 'Continental / Fusion', subcategory: 'Wraps', price: '₹199', cost: 199, rating: 4.7, time: 15, isVeg: true, image: '/tacos.png', description: 'Tortilla stuffed with veggies & smoked cottage cheese' },
  { name: 'Cheese Cigar Roll', category: 'Continental / Fusion', subcategory: 'Wraps', price: '₹199', cost: 199, rating: 4.5, time: 12, isVeg: true, image: '/pizza.png', description: 'Phyllo dough filled with spicy szechwan sauce-coated paneer and veggies' },

  // Burger
  { name: 'Veggie Burger', category: 'Continental / Fusion', subcategory: 'Burger', price: '₹89', cost: 89, rating: 4.1, time: 10, isVeg: true, image: '/tacos.png', description: 'Classic vegetable patty burger' },
  { name: 'Veggie Cheese Burger', category: 'Continental / Fusion', subcategory: 'Burger', price: '₹109', cost: 109, rating: 4.3, time: 10, isVeg: true, image: '/burger.png', description: 'Crispy veg patty, fresh greens and cheese slice' },
  { name: 'Paneer Burger', category: 'Continental / Fusion', subcategory: 'Burger', price: '₹129', cost: 129, rating: 4.4, time: 12, isVeg: true, image: '/pizza.png', description: 'Tender paneer patty burger' },
  { name: 'Mexican Burger', category: 'Continental / Fusion', subcategory: 'Burger', price: '₹149', cost: 149, rating: 4.3, time: 11, isVeg: true, image: '/tacos.png', description: 'Mexican spiced bean patty burger' },

  // Fries
  { name: 'French Fries', category: 'Continental / Fusion', subcategory: 'Fries', price: '₹189', cost: 189, rating: 4.2, time: 8, isVeg: true, image: '/tacos.png', description: 'Browned stripes of potatoes' },
  { name: 'Peri Peri Fries', category: 'Continental / Fusion', subcategory: 'Fries', price: '₹199', cost: 199, rating: 4.4, time: 8, isVeg: true, image: '/burger.png', description: 'Browned stripes of potatoes in peri peri masala' },
  { name: 'Cheese Loaded Fries', category: 'Continental / Fusion', subcategory: 'Fries', price: '₹229', cost: 229, rating: 4.5, time: 10, isVeg: true, image: '/pizza.png', description: 'Browned stripes of potatoes loaded with cheese' },
  { name: 'Over Loaded Nachos', category: 'Continental / Fusion', subcategory: 'Fries', price: '₹269', cost: 269, rating: 4.7, time: 14, isVeg: true, image: '/pizza.png', description: 'Corn chips topped with jalapeno, olives, sweet corn, kidney beans & cheese sauce' },

  // Bruschetta
  { name: 'Garlic Bread', category: 'Continental / Fusion', subcategory: 'Bruschetta', price: '₹129', cost: 129, rating: 4.2, time: 8, isVeg: true, image: '/pizza.png', description: 'Toasted bread with garlic butter' },
  { name: 'Cheese Garlic Bread', category: 'Continental / Fusion', subcategory: 'Bruschetta', price: '₹149', cost: 149, rating: 4.4, time: 9, isVeg: true, image: '/tacos.png', description: 'Garlic bread baked with extra mozzarella' },
  { name: 'Exotic Garlic Bread', category: 'Continental / Fusion', subcategory: 'Bruschetta', price: '₹159', cost: 159, rating: 4.5, time: 10, isVeg: true, image: '/burger.png', description: 'Garlic bread loaded with veggies' },
  { name: 'Cheeze Chilli Toast', category: 'Continental / Fusion', subcategory: 'Bruschetta', price: '₹129', cost: 129, rating: 4.3, time: 8, isVeg: true, image: '/pizza.png', description: 'Crispy toast topped with cheese and green chillies' },

  // === SOUPS & SALADS ===
  // Soup
  { name: 'Cream of Tomato', category: 'Soups & Salads', subcategory: 'Soup', price: '₹169', cost: 169, rating: 4.3, time: 12, isVeg: true, image: '/tacos.png', description: 'Thick basil flavored tomato soup with oven roasted croutons' },
  { name: 'Vegetable & Sweet Corn', category: 'Soups & Salads', subcategory: 'Soup', price: '₹169', cost: 169, rating: 4.1, time: 10, isVeg: true, image: '/burger.png', description: 'Chinese style creamy soup with sweet corn & vegetable' },
  { name: 'Hot & Sour', category: 'Soups & Salads', subcategory: 'Soup', price: '₹179', cost: 179, rating: 4.4, time: 14, isVeg: true, image: '/pizza.png', description: 'Spicy chinese soup with vegetables, cottage cheese' },
  { name: 'Manchow', category: 'Soups & Salads', subcategory: 'Soup', price: '₹179', cost: 179, rating: 4.2, time: 13, isVeg: true, image: '/tacos.png', description: 'Spicy garlic flavoured vegetable soup with crispy noodles' },
  { name: 'Vegetable Soup', category: 'Soups & Salads', subcategory: 'Soup', price: '₹179', cost: 179, rating: 4.0, time: 15, isVeg: true, image: '/burger.png', description: 'Loaded with veggies, bell pepper & cottage cheese' },
  { name: 'Minestrone', category: 'Soups & Salads', subcategory: 'Soup', price: '₹179', cost: 179, rating: 4.0, time: 15, isVeg: true, image: '/pizza.png', description: 'Famous indian soup with vegetables & pasta' },
  { name: 'Broccoli Cream', category: 'Soups & Salads', subcategory: 'Soup', price: '₹199', cost: 199, rating: 4.5, time: 14, isVeg: true, image: '/tacos.png', description: 'Creamy broccoli soup' },
  { name: 'Cream of Mushroom', category: 'Soups & Salads', subcategory: 'Soup', price: '₹199', cost: 199, rating: 4.4, time: 13, isVeg: true, image: '/burger.png', description: 'Puree of fresh mushroom flavoured with garlic, onions and herbs' },

  // Salads
  { name: 'Green Salad', category: 'Soups & Salads', subcategory: 'Salads', price: '₹129', cost: 129, rating: 4.1, time: 8, isVeg: true, image: '/tacos.png', description: 'Fresh cucumber, tomato, onion, carrot' },
  { name: 'Kachumbar Salad', category: 'Soups & Salads', subcategory: 'Salads', price: '₹159', cost: 159, rating: 4.3, time: 9, isVeg: true, image: '/burger.png', description: 'Fresh cucumber, tomato, onion, cottage cheese, peanuts' },
  { name: 'Russian Salad', category: 'Soups & Salads', subcategory: 'Salads', price: '₹229', cost: 229, rating: 4.5, time: 10, isVeg: true, image: '/pizza.png', description: 'Fruits & vegetables in mayonnaise dressing' },
  { name: 'Greek Salad', category: 'Soups & Salads', subcategory: 'Salads', price: '₹229', cost: 229, rating: 4.2, time: 11, isVeg: true, image: '/tacos.png', description: 'Salad greens, onion, tomato, olives, bell pepper, in balsamic vinaigrette' },
  { name: 'Saute Vegetable', category: 'Soups & Salads', subcategory: 'Salads', price: '₹249', cost: 249, rating: 4.4, time: 12, isVeg: true, image: '/pizza.png', description: 'Beans, carrot, broccoli, onion, olives, bell pepper' },
  { name: 'Pesto Salad', category: 'Soups & Salads', subcategory: 'Salads', price: '₹229', cost: 229, rating: 4.3, time: 10, isVeg: true, image: '/burger.png', description: 'Cottage cheese, vegetables in creamy basil pesto sauce' },

  // === SIZZLERS ===
  { name: 'Tandoori Sizzler', category: 'Sizzlers', price: '₹589', cost: 589, rating: 4.8, time: 22, isVeg: true, image: '/pizza.png', description: 'Paneer Tikka, Soya Chaap, Dahi Ke Sholey, Hara Bhara & Tandoori Aloo served sizzler style' },
  { name: 'Oriental Sizzler', category: 'Sizzlers', price: '₹589', cost: 589, rating: 4.7, time: 22, isVeg: true, image: '/burger.png', description: 'Chilli paneer, manchurian, Noodles, Fried rice & Spring roll served sizzler style' },
  { name: 'Italian Collection Sizzler', category: 'Sizzlers', price: '₹589', cost: 589, rating: 4.8, time: 24, isVeg: true, image: '/tacos.png', description: 'Pink sauce pasta, spaghetti agilio olio, potato wedges, Jalapeno Wrap & garlic bread served sizzler style' },
  { name: 'Paneer Shashlik Sizzler', category: 'Sizzlers', price: '₹589', cost: 589, rating: 4.9, time: 25, isVeg: true, image: '/pizza.png', description: 'Paneer shashlik, veg patty, boiled vegetable, Butter Rice, potato wedges served sizzler style' },

  // === DESSERTS ===
  { name: 'Sizzling Brownie Icecream', category: 'Desserts', price: '₹199', cost: 199, rating: 4.8, time: 8, isVeg: true, image: '/tacos.png', description: 'Sizzling brownie topped with rich vanilla ice cream and chocolate sauce' },
  { name: 'Brownie', category: 'Desserts', price: '₹139', cost: 139, rating: 4.5, time: 5, isVeg: true, image: '/burger.png', description: 'Rich chocolate brownie' },
  { name: 'Desi Ghee Gajjar Ka Halwa (seasonal)', category: 'Desserts', price: '₹199', cost: 199, rating: 4.8, time: 10, isVeg: true, image: '/pizza.png', description: 'Traditional seasonal carrot pudding cooked in ghee' },
  { name: 'Gulab Jamun with Icecream', category: 'Desserts', price: '₹99', cost: 99, rating: 4.6, time: 6, isVeg: true, image: '/tacos.png', description: 'Warm Gulab Jamun served with cool vanilla ice cream' },
  { name: 'Ice Cream (2 scoop) — Vanilla / Chocolate / Butterscotch / Strawberry', category: 'Desserts', price: '₹99', cost: 99, rating: 4.3, time: 4, isVeg: true, image: '/burger.png', description: 'Two scoops of your favorite ice cream flavor' },
  { name: 'Gulab Jamun (2 pcs)', category: 'Desserts', price: '₹99', cost: 99, rating: 4.4, time: 5, isVeg: true, image: '/pizza.png', description: 'Two pieces of soft warm gulab jamun' },
  { name: 'Croissant', category: 'Desserts', price: '₹79', cost: 79, rating: 4.2, time: 5, isVeg: true, image: '/tacos.png', description: 'Flaky baked French croissant' },

  // === BEVERAGES ===
  // Tea & Coffee
  { name: 'Tea (Ginger / Cardamom / Masala)', category: 'Beverages', subcategory: 'Tea & Coffee', price: '₹39', cost: 39, rating: 4.2, time: 5, isVeg: true, image: '/burger.png', description: 'Fresh hot brewed Indian tea' },
  { name: 'Green Tea', category: 'Beverages', subcategory: 'Tea & Coffee', price: '₹49', cost: 49, rating: 4.1, time: 4, isVeg: true, image: '/pizza.png', description: 'Healthy green tea' },
  { name: 'Black Tea', category: 'Beverages', subcategory: 'Tea & Coffee', price: '₹39', cost: 39, rating: 4.0, time: 4, isVeg: true, image: '/tacos.png', description: 'Hot black tea' },
  { name: 'Hot Coffee', category: 'Beverages', subcategory: 'Tea & Coffee', price: '₹69', cost: 69, rating: 4.3, time: 6, isVeg: true, image: '/burger.png', description: 'Hot brewed coffee' },
  { name: 'Cold Coffee', category: 'Beverages', subcategory: 'Tea & Coffee', price: '₹129', cost: 129, rating: 4.5, time: 6, isVeg: true, image: '/pizza.png', description: 'Blended creamy cold coffee' },

  // Iced Tea
  { name: 'Lemon Mint Iced Tea', category: 'Beverages', subcategory: 'Iced Tea', price: '₹149', cost: 149, rating: 4.4, time: 6, isVeg: true, image: '/tacos.png', description: 'Chilled iced tea flavored with lemon and mint' },
  { name: 'Peach Iced Tea', category: 'Beverages', subcategory: 'Iced Tea', price: '₹149', cost: 149, rating: 4.3, time: 6, isVeg: true, image: '/burger.png', description: 'Chilled peach flavored iced tea' },
  { name: 'Passion Fruit Iced Tea', category: 'Beverages', subcategory: 'Iced Tea', price: '₹149', cost: 149, rating: 4.4, time: 6, isVeg: true, image: '/pizza.png', description: 'Passion fruit iced tea' },
  { name: 'Black Current Iced Tea', category: 'Beverages', subcategory: 'Iced Tea', price: '₹149', cost: 149, rating: 4.2, time: 6, isVeg: true, image: '/tacos.png', description: 'Black current flavored iced tea' },
  { name: 'Watermelon Iced Tea', category: 'Beverages', subcategory: 'Iced Tea', price: '₹149', cost: 149, rating: 4.3, time: 6, isVeg: true, image: '/burger.png', description: 'Refreshing watermelon iced tea' },
  { name: 'Guava Iced Tea', category: 'Beverages', subcategory: 'Iced Tea', price: '₹149', cost: 149, rating: 4.2, time: 6, isVeg: true, image: '/pizza.png', description: 'Chilled guava iced tea' },
  { name: 'Lichi Iced Tea', category: 'Beverages', subcategory: 'Iced Tea', price: '₹149', cost: 149, rating: 4.3, time: 6, isVeg: true, image: '/tacos.png', description: 'Sweet lichi flavored iced tea' },
  { name: 'Blueberry Iced Tea', category: 'Beverages', subcategory: 'Iced Tea', price: '₹149', cost: 149, rating: 4.4, time: 6, isVeg: true, image: '/burger.png', description: 'Blueberry iced tea' },
  { name: 'Red Bull', category: 'Beverages', subcategory: 'Iced Tea', price: '₹249', cost: 249, rating: 4.6, time: 2, isVeg: true, image: '/pizza.png', description: 'Energy drink' },

  // Shakes
  { name: 'Vanilla Shake', category: 'Beverages', subcategory: 'Shakes', price: '₹149', cost: 149, rating: 4.3, time: 8, isVeg: true, image: '/pizza.png', description: 'Thick vanilla flavored milk shake' },
  { name: 'Strawberry Shake', category: 'Beverages', subcategory: 'Shakes', price: '₹149', cost: 149, rating: 4.3, time: 8, isVeg: true, image: '/tacos.png', description: 'Thick strawberry milk shake' },
  { name: 'Banana Shake', category: 'Beverages', subcategory: 'Shakes', price: '₹149', cost: 149, rating: 4.4, time: 8, isVeg: true, image: '/burger.png', description: 'Fresh banana milk shake' },
  { name: 'Mango Shake', category: 'Beverages', subcategory: 'Shakes', price: '₹149', cost: 149, rating: 4.5, time: 8, isVeg: true, image: '/pizza.png', description: 'Sweet thick mango milk shake' },
  { name: 'Oreo Shake', category: 'Beverages', subcategory: 'Shakes', price: '₹169', cost: 169, rating: 4.6, time: 8, isVeg: true, image: '/tacos.png', description: 'Blended Oreo cookie milk shake' },
  { name: 'KitKat Shake', category: 'Beverages', subcategory: 'Shakes', price: '₹169', cost: 169, rating: 4.6, time: 8, isVeg: true, image: '/burger.png', description: 'Chocolaty KitKat milk shake' },
  { name: 'Nutella Blast', category: 'Beverages', subcategory: 'Shakes', price: '₹169', cost: 169, rating: 4.8, time: 8, isVeg: true, image: '/burger.png', description: 'Indulgent shake made with rich Nutella cocoa spread and vanilla ice cream' },
  { name: 'Blueberry Smash Shake', category: 'Beverages', subcategory: 'Shakes', price: '₹169', cost: 169, rating: 4.5, time: 8, isVeg: true, image: '/pizza.png', description: 'Blueberry milk shake' },
  { name: 'Dark Fantasy Shake', category: 'Beverages', subcategory: 'Shakes', price: '₹169', cost: 169, rating: 4.5, time: 8, isVeg: true, image: '/tacos.png', description: 'Dark Fantasy cookie shake' },
  { name: 'Choco Pie Shake', category: 'Beverages', subcategory: 'Shakes', price: '₹169', cost: 169, rating: 4.4, time: 8, isVeg: true, image: '/burger.png', description: 'Blended choco pie milk shake' },
  { name: 'Brownie Blast Shake', category: 'Beverages', subcategory: 'Shakes', price: '₹169', cost: 169, rating: 4.7, time: 8, isVeg: true, image: '/pizza.png', description: 'Rich blended brownie shake' },
  { name: 'Lotus Biscoff Shake', category: 'Beverages', subcategory: 'Shakes', price: '₹169', cost: 169, rating: 4.8, time: 8, isVeg: true, image: '/tacos.png', description: 'Blended Lotus Biscoff cookie shake' },
  { name: 'Black Current Shake', category: 'Beverages', subcategory: 'Shakes', price: '₹169', cost: 169, rating: 4.3, time: 8, isVeg: true, image: '/burger.png', description: 'Black current milk shake' },
  { name: 'Butter Scotch Bliss Shake', category: 'Beverages', subcategory: 'Shakes', price: '₹169', cost: 169, rating: 4.6, time: 8, isVeg: true, image: '/pizza.png', description: 'Butterscotch milk shake' }
];

export const INITIAL_RECOMMENDED_FOODS = [
  { name: 'Basil Rajwadi Paneer Tikka', category: 'North Indian', price: '₹319', cost: 319, rating: 4.8, time: 20, isVeg: true, image: '/burger.png', description: 'Cottage cheese marinated in basil pesto & special creamy rajwadi spice' },
  { name: 'Malai Soya Chaap', category: 'North Indian', price: '₹279', cost: 279, rating: 4.7, time: 17, isVeg: true, image: '/pizza.png', description: 'Soya chaap marinated in yogurt, cheese, cashew paste' },
  { name: 'Paneer Butter Masala', category: 'North Indian', price: '₹349', cost: 349, rating: 4.9, time: 20, isVeg: true, image: '/tacos.png', description: 'Cottage cheese in tomato gravy' },
  { name: 'Veg Biryani', category: 'North Indian', price: '₹299', cost: 299, rating: 4.8, time: 25, isVeg: true, image: '/burger.png', description: 'Fragrant long-grain basmati rice cooked with fresh seasonal vegetables and spices' },
  { name: 'Over Loaded Nachos', category: 'Continental / Fusion', price: '₹269', cost: 269, rating: 4.7, time: 14, isVeg: true, image: '/pizza.png', description: 'Corn chips topped with jalapeno, olives, sweet corn, kidney beans & cheese sauce' },
  { name: 'Baked Lasagna', category: 'Italian', price: '₹399', cost: 399, rating: 4.9, time: 22, isVeg: true, image: '/tacos.png', description: 'Layers of fresh pasta sheet, mixed vegetables, loaded with mozzarella and baked' },
  { name: 'Nutella Blast', category: 'Beverages', price: '₹169', cost: 169, rating: 4.8, time: 8, isVeg: true, image: '/burger.png', description: 'Indulgent shake made with rich Nutella cocoa spread and vanilla ice cream' }
];

export const INITIAL_SPOTLIGHT_FOODS = [
  { name: "Avantika's Signature Spider Roll", category: 'Chinese / Oriental', price: '₹269', cost: 269, rating: 4.9, time: 25, isVeg: true, image: '/burger.png', description: 'Crispy battered vegetables rolled & fried with noodles served with hot garlic sauce' },
  { name: "Avantika's Signature Paneer Pasanda", category: 'North Indian', price: '₹399', cost: 399, rating: 4.9, time: 28, isVeg: true, image: '/pizza.png', description: 'Cottage cheese slices stuffed with rich sweet mava, dry fruits, cooked in sweet-creamy gravy.' },
  { name: "Avantika's Signature Shaam Savera", category: 'North Indian', price: '₹399', cost: 399, rating: 4.9, time: 30, isVeg: true, image: '/tacos.png', description: 'Chopped spinach dumplings stuffed with cottage cheese, mava & dry fruits in smooth yellow gravy.' },
  { name: 'Signature Chur Chur Naan', category: 'North Indian', price: '₹159', cost: 159, rating: 4.8, time: 18, isVeg: true, image: '/burger.png', description: 'Crispy, layered crushed tandoori bread stuffed with spiced vegetables and cottage cheese.' },
  { name: "Avantika's Signature Pizza", category: 'Italian', price: '₹429', cost: 429, rating: 4.9, time: 24, isVeg: true, image: '/pizza.png', description: 'One of its kind pizza loaded with premium exotic vegetables, burnt garlic, and fresh mozzarella.' }
];
