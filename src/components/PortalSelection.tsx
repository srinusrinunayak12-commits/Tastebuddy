/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { UserRole } from '../types';
import { Utensils, Store, ChevronRight } from 'lucide-react';

interface PortalSelectionProps {
  onSelect: (role: UserRole) => void;
}

export default function PortalSelection({ onSelect }: PortalSelectionProps) {
  return (
    <div className="h-screen w-full bg-black flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Customer Path */}
      <motion.button
        whileHover={{ flex: 1.2 }}
        onClick={() => onSelect(UserRole.CUSTOMER)}
        className="relative flex-1 group overflow-hidden border-b md:border-b-0 md:border-r border-white/10"
      >
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
          alt="Diner"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="relative h-full flex flex-col items-center justify-end p-12 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-2xl">
            <Utensils className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter mb-2">I want to Eat</h2>
          <p className="text-gray-300 text-sm mb-8 max-w-xs">Discover your next favorite meal through a sensory discovery experience.</p>
          <div className="px-8 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 group-hover:bg-white group-hover:text-black transition-all">
            Enter Diner Portal <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </motion.button>

      {/* Merchant Path */}
      <motion.button
        whileHover={{ flex: 1.2 }}
        onClick={() => onSelect(UserRole.MERCHANT)}
        className="relative flex-1 group overflow-hidden"
      >
        <img 
          src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
          alt="Chef"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="relative h-full flex flex-col items-center justify-end p-12 text-center">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-6 shadow-2xl">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter mb-2">I want to Feed</h2>
          <p className="text-gray-300 text-sm mb-8 max-w-xs">Grow your business, manage orders, and reach high-intent foodies.</p>
          <div className="px-8 py-3 bg-orange-500 rounded-full text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 group-hover:bg-orange-400 transition-all">
            Enter Merchant Portal <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </motion.button>
    </div>
  );
}
