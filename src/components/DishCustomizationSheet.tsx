/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ShoppingBag, Flame, ChevronRight } from 'lucide-react';
import { Dish, OrderOptions } from '../types';

interface DishCustomizationSheetProps {
  dish: Dish;
  onClose: () => void;
  onConfirm: (options: OrderOptions) => void;
}

const SPICE_LEVELS: OrderOptions['spiceLevel'][] = ['Mild', 'Medium', 'Hot', 'Insane'];
const ADDONS = ['Extra Cheese', 'Add Bacon', 'Side of Chutney', 'Extra Napkins'];

export default function DishCustomizationSheet({ dish, onClose, onConfirm }: DishCustomizationSheetProps) {
  const [quantity, setQuantity] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState<OrderOptions['spiceLevel']>('Medium');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [instructions, setInstructions] = useState('');

  const toggleAddon = (addon: string) => {
    setSelectedAddons(prev => 
      prev.includes(addon) ? prev.filter(a => a !== addon) : [...prev, addon]
    );
  };

  const totalPrice = (dish.price * quantity) + (selectedAddons.length * 20); // Each addon ₹20

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative bg-zinc-950 border-t border-white/10 rounded-t-[40px] px-6 pt-8 pb-12 flex flex-col gap-8 max-h-[90vh] overflow-y-auto no-scrollbar"
      >
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black italic text-white uppercase tracking-tight">{dish.name}</h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">₹{dish.price} base price</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Spice Level */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-[10px] font-black uppercase text-white tracking-widest">Spice Meter</span>
          </div>
          <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-white/5">
            {SPICE_LEVELS.map(level => (
              <button
                key={level}
                onClick={() => setSpiceLevel(level)}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${spiceLevel === level ? 'bg-orange-500 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Add-ons */}
        <div>
          <span className="text-[10px] font-black uppercase text-white tracking-widest mb-4 block">Personalize Dish (+₹20 Each)</span>
          <div className="grid grid-cols-2 gap-3">
            {ADDONS.map(addon => (
              <button
                key={addon}
                onClick={() => toggleAddon(addon)}
                className={`p-4 border rounded-2xl text-left transition-all ${selectedAddons.includes(addon) ? 'bg-orange-500/10 border-orange-500/50' : 'bg-zinc-900 border-white/5'}`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${selectedAddons.includes(addon) ? 'text-orange-500' : 'text-zinc-400'}`}>
                    {addon}
                  </span>
                  {selectedAddons.includes(addon) && <ShoppingBag className="w-3 h-3 text-orange-500" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Special Instructions */}
        <div>
          <span className="text-[10px] font-black uppercase text-white tracking-widest mb-4 block">Special Request</span>
          <textarea 
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="No onions, extra sauce on the side..."
            className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 transition-all min-h-[100px]"
          />
        </div>

        {/* Quantity and CTA */}
        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
          <div className="flex items-center bg-zinc-900 border border-white/5 p-2 rounded-2xl">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-zinc-400">
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-black italic text-white text-lg">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center text-zinc-400">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button 
            onClick={() => onConfirm({ spiceLevel, addons: selectedAddons, instructions, quantity })}
            className="flex-1 bg-orange-500 h-14 rounded-2xl flex items-center justify-between px-6 shadow-xl shadow-orange-500/20 active:scale-[0.98] transition-all"
          >
            <span className="text-xs font-black uppercase tracking-widest text-white">Review Order</span>
            <div className="flex items-center gap-4">
              <span className="text-white font-black italic">₹{totalPrice}</span>
              <ChevronRight className="w-5 h-5 text-white/50" />
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
