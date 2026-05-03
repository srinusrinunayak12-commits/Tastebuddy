/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'motion/react';
import { Dish, PalateProfile, MoodFilter, OrderOptions } from '../types';
import { MapPin, Info, Heart, X, ShoppingBag, Wind, Flame } from 'lucide-react';
import DishCustomizationSheet from './DishCustomizationSheet';
import { getSensoryMatch } from '../services/geminiService';

interface DishFeedProps {
  dishes: Dish[];
  profile: PalateProfile;
  onPlaceOrder: (dish: Dish, options: OrderOptions) => void;
  outOfStockItems: string[];
}

const MOODS: MoodFilter[] = ['Date Night', 'Quick Bite', 'Post-Gym', 'Hangover Cure', 'Cheat Day'];

export default function DishFeed({ dishes, profile, onPlaceOrder, outOfStockItems }: DishFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [activeMood, setActiveMood] = useState<MoodFilter | 'All'>('All');
  const [showCustomizer, setShowCustomizer] = useState(false);

  const filteredDishes = activeMood === 'All' 
    ? dishes 
    : dishes.filter(d => d.moods.includes(activeMood));

  const currentDish = filteredDishes[currentIndex] || filteredDishes[0];
  const isOutOfStock = currentDish ? outOfStockItems.includes(currentDish.name) : false;

  useEffect(() => {
    if (currentDish) {
      setMatchScore(null);
      getSensoryMatch(currentDish, profile).then(setMatchScore);
    }
  }, [currentIndex, currentDish, profile]);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentIndex < filteredDishes.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden flex flex-col">
      {/* Mood Horizontal Filter */}
      <div className="absolute top-16 left-0 right-0 z-50 px-6 pointer-events-auto">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4">
          <button 
            onClick={() => { setActiveMood('All'); setCurrentIndex(0); }}
            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap border transition-all ${activeMood === 'All' ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-400 border-white/5'}`}
          >
            All Moods
          </button>
          {MOODS.map(mood => (
            <button 
              key={mood}
              onClick={() => { setActiveMood(mood); setCurrentIndex(0); }}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap border transition-all ${activeMood === mood ? 'bg-orange-500 text-white border-orange-500' : 'bg-white/5 text-gray-400 border-white/5'}`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentDish ? (
          <DishCard 
            key={currentDish.id}
            dish={currentDish} 
            matchScore={matchScore}
            onSwipe={handleSwipe}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center flex-col gap-4 text-center p-8">
            <Wind className="w-12 h-12 text-zinc-800" />
            <h3 className="text-xl font-bold text-white">No matches for this mood</h3>
            <p className="text-gray-500 text-sm">Try a different mood or broaden your search.</p>
          </div>
        ) }
      </AnimatePresence>
      
      {/* Bottom Overlay Controls */}
      {currentDish && (
        <div className="absolute bottom-24 left-0 right-0 p-6 flex flex-col gap-4 pointer-events-none">
          <div className="flex justify-between items-end">
            <div className="pointer-events-auto max-w-[70%]">
              <h2 className="text-3xl font-bold text-white drop-shadow-md tracking-tight leading-none mb-1 uppercase">
                {currentDish.name}
              </h2>
              <div className="flex items-center gap-1 text-orange-400 font-medium text-xs mb-2 uppercase tracking-widest">
                <MapPin className="w-3 h-3" /> {currentDish.restaurant} • {currentDish.distance}
              </div>
              <p className="text-white/80 text-sm line-clamp-2 drop-shadow-sm mb-4 leading-snug">
                 {currentDish.description}
              </p>
            </div>
            
            <div className="flex flex-col gap-6 pointer-events-auto">
              <button className="flex flex-col items-center gap-1 group">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:bg-pink-500/20 group-hover:border-pink-500/50 transition-all">
                  <Heart className="w-6 h-6 text-white fill-white/20 group-hover:fill-pink-500 group-hover:text-pink-500 transition-all" />
                </div>
                <span className="text-[10px] uppercase font-bold text-white tracking-widest group-hover:text-pink-500 transition-all">Love</span>
              </button>
              <button className="flex flex-col items-center gap-1">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 text-orange-500 font-black text-xl italic">
                  {matchScore !== null ? `${matchScore}%` : '...'}
                </div>
                <span className="text-[10px] uppercase font-bold text-white tracking-widest">Match</span>
              </button>
              <button 
                onClick={() => !isOutOfStock && setShowCustomizer(true)}
                disabled={isOutOfStock}
                className={`flex flex-col items-center gap-1 group ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center border shadow-xl transition-all ${isOutOfStock ? 'bg-zinc-800 border-zinc-700' : 'bg-orange-500 border-orange-400 shadow-orange-500/20 group-active:scale-95 group-hover:scale-110'}`}>
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <span className="text-[10px] uppercase font-bold text-white tracking-widest">{isOutOfStock ? 'Stock Out' : 'Order'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Customization Sheet */}
      <AnimatePresence>
        {showCustomizer && (
          <DishCustomizationSheet 
            dish={currentDish} 
            onClose={() => setShowCustomizer(false)}
            onConfirm={(opts) => {
              onPlaceOrder(currentDish, opts);
              setShowCustomizer(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface DishCardProps {
  key?: string | number;
  dish: Dish;
  matchScore: number | null;
  onSwipe: (dir: 'left' | 'right') => void;
}

function DishCard({ dish, matchScore, onSwipe }: DishCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const colorRight = useTransform(x, [0, 150], ["rgba(255, 255, 255, 0)", "rgba(34, 197, 94, 0.5)"]);
  const colorLeft = useTransform(x, [-150, 0], ["rgba(239, 68, 68, 0.5)", "rgba(255, 255, 255, 0)"]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
      onSwipe('right');
    } else if (info.offset.x < -100) {
      onSwipe('left');
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 1.1, opacity: 0 }}
      className="absolute inset-0 z-10 w-full h-full flex items-center justify-center p-4"
    >
      <div className="relative w-full h-[85vh] rounded-[40px] overflow-hidden bg-zinc-900 shadow-2xl flex flex-col touch-none">
        <img 
          src={dish.imageUrl} 
          alt={dish.name} 
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        
        {/* Visual Cues for Swiping */}
        <motion.div style={{ backgroundColor: colorRight }} className="absolute inset-0 pointer-events-none" />
        <motion.div style={{ backgroundColor: colorLeft }} className="absolute inset-0 pointer-events-none" />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />

        {/* Sensory Tags */}
        <div className="absolute top-6 left-6 flex flex-wrap gap-2 pointer-events-none">
          {dish.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">
              {tag}
            </span>
          ))}
        </div>
        <motion.div
          whileTap={{ scale: 0.95 }}
          onClick={onSwipe ? () => onSwipe('left') : undefined}
          className="absolute bottom-6 left-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 z-20"
        >
          <X className="w-6 h-6 text-white" />
        </motion.div>
        
        <motion.div
          whileTap={{ scale: 0.95 }}
          onClick={onSwipe ? () => onSwipe('right') : undefined}
          className="absolute bottom-6 right-6 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center border border-orange-400 shadow-xl shadow-orange-500/20 z-20"
        >
          <Heart className="w-6 h-6 text-white fill-white/20" />
        </motion.div>
      </div>
    </motion.div>
  );
}
