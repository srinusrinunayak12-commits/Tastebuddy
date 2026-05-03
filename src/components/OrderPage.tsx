/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Package, Clock, ChevronRight, CheckCircle2, Wind } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrderPageProps {
  orders: Order[];
}

export default function OrderPage({ orders }: OrderPageProps) {
  return (
    <div className="flex flex-col p-6 font-sans h-full overflow-y-auto pb-32 bg-black">
      <div className="flex flex-col gap-2 mb-8">
        <h2 className="text-4xl font-bold text-white tracking-tighter uppercase italic">My orders</h2>
        <p className="text-gray-500 text-sm tracking-wide leading-tight">Track your cravings in real-time.</p>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-white/5 rounded-[32px]">
            <Wind className="w-8 h-8 text-zinc-800 mb-4" />
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">No active orders yet.</p>
          </div>
        ) : (
          orders.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 bg-zinc-900 rounded-[32px] border border-white/5 flex flex-col gap-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white uppercase tracking-tight">{order.id}</h3>
                    <p className="text-xs text-gray-400">{order.dishName}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === OrderStatus.DELIVERED ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-orange-500/10 text-orange-500 border border-orange-500/20 animate-pulse'}`}>
                  {order.status.replace(/_/g, ' ')}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-zinc-400">
                  {order.status === OrderStatus.DELIVERED ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Clock className="w-4 h-4" />}
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {order.status === OrderStatus.DELIVERED ? 'Arrived' : 'Status Updated'}
                  </span>
                </div>
                <button className="flex items-center gap-1 text-[10px] font-black text-white px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors uppercase tracking-widest">
                  Details <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
