/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FlashSale, Dish } from '../types';
import { Clock, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface FlashSalesProps {
  sales: FlashSale[];
  dishes: Dish[];
}

export default function FlashSales({ sales, dishes }: FlashSalesProps) {
  return (
    <div className="flex flex-col gap-6 p-6 font-sans h-full overflow-y-auto pb-32">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-bold text-white tracking-tighter uppercase italic">Flash Drops</h2>
        <p className="text-gray-500 text-sm tracking-wide leading-tight">Hyper-local deals expiring soon.</p>
      </div>

      <div className="grid gap-6">
        {sales.map((sale, idx) => {
          const dish = dishes.find(d => d.id === sale.dishId);
          if (!dish) return null;

          return (
            <motion.div
              key={sale.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="relative rounded-[32px] overflow-hidden bg-zinc-900 border border-white/5"
            >
              <div className="h-48 relative">
                <img 
                  src={dish.imageUrl} 
                  alt={dish.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 py-1 px-3 bg-orange-500 text-white rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-orange-500/40">
                  <Zap className="w-3 h-3 fill-white" /> {sale.discount}% OFF
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 tracking-tight">{dish.name}</h3>
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">{dish.restaurant}</p>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                    <Clock className="w-3 h-3" />
                    <span className="text-[10px] font-bold">14m left</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white">${(dish.price * (1 - sale.discount / 100)).toFixed(2)}</span>
                    <span className="text-sm text-gray-500 line-through">${dish.price}</span>
                  </div>
                  <button className="px-6 py-3 bg-white text-black rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform">
                    Claim <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
