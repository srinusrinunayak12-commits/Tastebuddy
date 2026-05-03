/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Dish, TastePreference, SocialTable, Badge } from "./types";

export const MOCK_DISHES: Dish[] = [
  {
    id: "1",
    name: "Old Delhi Butter Chicken",
    restaurant: "Moti Mahal Deluxe",
    description: "The original recipe. Charcoal-smoked chicken simmered in a rich tomato, butter, and cream gravy with dried fenugreek leaves.",
    imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800&auto=format&fit=crop",
    price: 450,
    tags: [TastePreference.MILD, TastePreference.UMAMI, TastePreference.SOFT],
    moods: ["Date Night", "Cheat Day"],
    distance: "1.2 km"
  },
  {
    id: "2",
    name: "Hyderabadi Dum Biryani",
    restaurant: "Paradise Heritage",
    description: "Fragrant long-grain basmati rice layered with spiced marinated meat, saffron, and fried onions. Slow-cooked to perfection.",
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=800&auto=format&fit=crop",
    price: 320,
    tags: [TastePreference.SPICY, TastePreference.UMAMI, TastePreference.SAVORY],
    moods: ["Cheat Day", "Hangover Cure"],
    distance: "2.5 km"
  },
  {
    id: "3",
    name: "Amritsari Kulcha with Chole",
    restaurant: "Kulcha Land",
    description: "Crispy, flaky tandoori bread stuffed with spiced potatoes and cauliflower, served with spicy chickpea curry and imli chutney.",
    imageUrl: "https://images.unsplash.com/photo-1626132646529-5003375a97dd?q=80&w=800&auto=format&fit=crop",
    price: 180,
    tags: [TastePreference.CRUNCHY, TastePreference.SPICY, TastePreference.SAVORY],
    moods: ["Quick Bite", "Hangover Cure"],
    distance: "0.8 km"
  },
  {
    id: "4",
    name: "Baked Gulab Jamun Jar",
    restaurant: "Mishti Hub",
    description: "Warm, syrup-soaked milk dumplings baked with a thin layer of rabri and topped with crushed pistachios and rose petals.",
    imageUrl: "https://images.unsplash.com/photo-1548943486-a3e3cb89e171?q=80&w=800&auto=format&fit=crop",
    price: 150,
    tags: [TastePreference.SWEET, TastePreference.SOFT, TastePreference.UMAMI],
    moods: ["Cheat Day", "Date Night"],
    distance: "1.5 km"
  }
];

export const MOCK_BADGES: Badge[] = [
  { id: 'b1', name: 'Biryani Badshah', icon: '🥘', description: 'Sampled Biryani from 5 different regions.', unlocked: true },
  { id: 'b2', name: 'Spice Lord', icon: '🌶️', description: 'Conquered 10 "Extra Spicy" rated curries.', unlocked: true },
  { id: 'b3', name: 'Chai Enthusiast', icon: '☕', description: 'Tried every variety of cutting chai in the city.', unlocked: false },
  { id: 'b4', name: 'Lobby Leader', icon: '🥂', description: 'Hosted 3 successful Social Tables.', unlocked: false },
];

export const MOCK_SOCIAL_TABLES: SocialTable[] = [
  {
    id: "s1",
    restaurantId: "1",
    restaurantName: "Moti Mahal Deluxe",
    time: "Today, 8:30 PM",
    membersCount: 2,
    membersMax: 6,
    interests: ["Bollyood", "IPL", "Startup Talk"]
  },
  {
    id: "s2",
    restaurantId: "2",
    restaurantName: "Paradise Heritage",
    time: "Tomorrow, 1:00 PM",
    membersCount: 3,
    membersMax: 4,
    interests: ["Travel", "Food Vlogging", "Cricket"]
  }
];
