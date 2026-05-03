/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, MapPin, Star, Flame, Trophy, ChevronRight } from 'lucide-react';
import { Dish, PalateProfile, MoodFilter, OrderOptions } from '../types';
import { MOCK_DISHES } from '../constants';
import { useState } from 'react';
import DishCustomizationSheet from './DishCustomizationSheet';

interface HomePageProps {
  profile: PalateProfile;
  onExploreFeed: () => void;
  outOfStockItems: string[];
  onPlaceOrder: (dish: Dish, options: OrderOptions) => void;
}

const MOODS: MoodFilter[] = ['Date Night', 'Quick Bite', 'Post-Gym', 'Hangover Cure', 'Cheat Day'];

export default function HomePage({ profile, onExploreFeed, outOfStockItems, onPlaceOrder }: HomePageProps) {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-black font-sans pb-32">
      {/* Search Header */}
      <div className="px-6 pt-12 pb-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          <input 
            type="text" 
            placeholder="Craving something specific?" 
            className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-all"
          />
        </div>
      </div>

      {/* Palate DNA Card */}
      <section className="px-6 mb-8 mt-2">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-br from-orange-500 to-red-600 rounded-[32px] p-6 overflow-hidden shadow-2xl shadow-orange-500/20"
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-white/80 text-[10px] font-black uppercase tracking-widest mb-2">
              <Sparkles className="w-3 h-3 fill-white/20" /> Your Current DNA
            </div>
            <h3 className="text-3xl font-black italic text-white leading-none mb-1 uppercase tracking-tight">
              {profile.persona}
            </h3>
            <div className="flex gap-2 mt-4">
              {profile.preferences.map(pref => (
                <span key={pref} className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[9px] font-bold text-white uppercase tracking-widest border border-white/10">
                  {pref}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Mood Filters */}
      <section className="mb-8">
        <div className="px-6 flex justify-between items-end mb-4">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Pick a Vibe</h4>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-6">
          {MOODS.map((mood, idx) => (
            <motion.button
              key={mood}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex-shrink-0 px-6 py-3 bg-zinc-900 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:border-orange-500/30 transition-all"
            >
              {mood}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Discovery Banner */}
      <section className="px-6 mb-10">
        <button 
          onClick={onExploreFeed}
          className="w-full relative h-40 rounded-[32px] overflow-hidden group border border-white/10"
        >
          <img 
            src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            alt="Discovery"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
          <div className="absolute inset-0 p-6 flex flex-col justify-center">
             <div className="flex items-center gap-2 text-white font-black text-2xl uppercase tracking-tighter italic">
               Sensory Feed <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
             </div>
             <p className="text-white/80 text-xs mt-1 font-medium">Swipe through HD dish shorts curated for you.</p>
             <div className="mt-4 inline-flex items-center gap-1 text-[10px] font-black text-white uppercase tracking-widest px-4 py-2 bg-orange-500 rounded-xl w-fit group-hover:gap-3 transition-all">
               Start Swiping <ChevronRight className="w-3 h-3" />
             </div>
          </div>
        </button>
      </section>

      {/* Trending Section */}
      <section className="px-6 mb-8">
        <div className="flex justify-between items-end mb-6">
          <h4 className="text-lg font-bold text-white tracking-tight italic uppercase">Top DNA Matches</h4>
          <span className="text-orange-500 text-[10px] font-bold uppercase tracking-widest">See all</span>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {MOCK_DISHES.map((dish, idx) => (
            <motion.div 
              key={dish.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => !outOfStockItems.includes(dish.name) && setSelectedDish(dish)}
              className={`group bg-zinc-900 rounded-[32px] overflow-hidden border border-white/5 cursor-pointer active:scale-[0.98] transition-all ${outOfStockItems.includes(dish.name) ? 'opacity-50 grayscale' : ''}`}
            >
              <div className="h-56 relative">
                <img 
                  src={dish.imageUrl} 
                  alt={dish.name} 
                  className="w-full h-full object-cover"
                />
                {outOfStockItems.includes(dish.name) ? (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl">Out of Stock</span>
                  </div>
                ) : (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-black text-orange-500 uppercase tracking-widest border border-white/10 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-orange-500" /> 98% Match
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="text-xl font-bold text-white tracking-tight uppercase italic">{dish.name}</h5>
                    <div className="flex items-center gap-1 text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-1">
                      <MapPin className="w-3 h-3" /> {dish.restaurant} • {dish.distance}
                    </div>
                  </div>
                  <span className="text-xl font-black text-white">₹{dish.price}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  {dish.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-zinc-500">#{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Gamification Badge Sneak Peak */}
      <section className="px-6">
        <div className="bg-zinc-900 border border-dashed border-white/10 rounded-[32px] p-8 flex flex-col items-center text-center">
          <Trophy className="w-10 h-10 text-yellow-500 mb-4" />
          <h4 className="text-white font-bold tracking-tight uppercase italic">Road to Biryani Badshah</h4>
          <p className="text-gray-500 text-xs mt-2 leading-tight">Order 2 more specialty biryanis to unlock this exclusive badge!</p>
          <div className="mt-4 w-full h-1.5 bg-black rounded-full overflow-hidden">
             <div className="h-full bg-yellow-500 w-[60%]" />
          </div>
        </div>
      </section>
      {/* Customization Sheet */}
      <AnimatePresence>
        {selectedDish && (
          <DishCustomizationSheet 
            dish={selectedDish} 
            onClose={() => setSelectedDish(null)}
            onConfirm={(opts) => {
              onPlaceOrder(selectedDish, opts);
              setSelectedDish(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
