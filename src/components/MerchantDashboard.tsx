/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { Store, TrendingUp, ShoppingBag, Clock, Package, Bell, Power, CheckCircle2, XCircle, Plus, UtensilsCrossed, AlertTriangle } from 'lucide-react';
import { MerchantData, Order, OrderStatus } from '../types';
import { MOCK_DISHES } from '../constants';

interface MerchantDashboardProps {
  data: MerchantData;
  onToggleStatus: () => void;
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  outOfStockItems: string[];
  onToggleInventory: (dishName: string, outOfStock: boolean) => void;
}

export default function MerchantDashboard({ 
  data, 
  onToggleStatus, 
  orders, 
  onUpdateStatus,
  outOfStockItems,
  onToggleInventory
}: MerchantDashboardProps) {
  const activeOrders = orders.filter(o => o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED);
  
  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    switch (current) {
      case OrderStatus.PENDING_ACCEPTANCE: return OrderStatus.PREPARING;
      case OrderStatus.PREPARING: return OrderStatus.OUT_FOR_DELIVERY;
      case OrderStatus.OUT_FOR_DELIVERY: return OrderStatus.DELIVERED;
      default: return null;
    }
  };

  const getButtonLabel = (current: OrderStatus): string => {
    switch (current) {
      case OrderStatus.PENDING_ACCEPTANCE: return "Accept Order";
      case OrderStatus.PREPARING: return "Food Ready";
      case OrderStatus.OUT_FOR_DELIVERY: return "Delivered";
      default: return "Complete";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-32 font-sans overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">{data.businessName}</h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">Store Console v1.0</p>
        </div>
        <button 
          onClick={onToggleStatus}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${data.status === 'Open' ? 'bg-green-500/10 border-green-500/50 text-green-500' : 'bg-red-500/10 border-red-500/50 text-red-500'}`}
        >
          <Power className="w-4 h-4" />
          <span className="text-[10px] uppercase font-black tracking-widest">{data.status}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-zinc-900 border border-white/5 p-6 rounded-[32px]">
          <TrendingUp className="w-5 h-5 text-orange-500 mb-4" />
          <span className="text-3xl font-black italic block mb-1">₹{data.dailyEarnings}</span>
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Today's Earnings</span>
        </div>
        <div className="bg-zinc-900 border border-white/5 p-6 rounded-[32px]">
          <ShoppingBag className="w-5 h-5 text-orange-500 mb-4" />
          <span className="text-3xl font-black italic block mb-1">{activeOrders.length}</span>
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Active Orders</span>
        </div>
      </div>

      {/* Live Orders Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold uppercase italic tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-500" /> Active Orders
          </h2>
          {activeOrders.length > 0 && (
            <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-md animate-bounce">
              {activeOrders.length} NEW
            </span>
          )}
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {activeOrders.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-12 text-center border border-dashed border-white/5 rounded-[32px]"
              >
                <ShoppingBag className="w-8 h-8 text-zinc-800 mx-auto mb-4" />
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">All caught up!</p>
              </motion.div>
            ) : (
              activeOrders.map((order) => {
                const nextStatus = getNextStatus(order.status);
                return (
                  <motion.div 
                    key={order.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-zinc-900 border border-white/5 p-6 rounded-[32px] flex flex-col gap-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                          <Package className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                             <h3 className="font-bold text-lg">{order.id}</h3>
                             {order.status === OrderStatus.PENDING_ACCEPTANCE && (
                               <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                             )}
                          </div>
                          <p className="text-xs text-gray-500">{order.dishName} ({order.options?.quantity || 1}x) • {order.customerName}</p>
                          {order.options && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              <span className="bg-zinc-800 text-orange-400 text-[7px] font-black uppercase px-2 py-0.5 rounded border border-white/5">
                                {order.options.spiceLevel} Spice
                              </span>
                              {order.options.addons.map(addon => (
                                <span key={addon} className="bg-zinc-800 text-zinc-400 text-[7px] font-black uppercase px-2 py-0.5 rounded border border-white/5">
                                  + {addon}
                                </span>
                              ))}
                            </div>
                          )}
                          {order.options?.instructions && (
                            <p className="mt-2 text-[9px] text-zinc-500 italic leading-tight max-w-[200px] line-clamp-2">
                              "{order.options.instructions}"
                            </p>
                          )}
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === OrderStatus.PENDING_ACCEPTANCE ? 'bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse' : 'bg-orange-500/10 text-orange-500'}`}>
                        {order.status.replace(/_/g, ' ')}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center border-t border-white/5 pt-4">
                      <div className="flex items-center gap-2 text-zinc-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {order.status === OrderStatus.PENDING_ACCEPTANCE && (
                          <button 
                            onClick={() => onUpdateStatus(order.id, OrderStatus.CANCELLED)}
                            className="p-2 border border-white/10 rounded-xl hover:bg-red-500/10 hover:border-red-500/30 group transition-all"
                          >
                            <XCircle className="w-4 h-4 text-zinc-500 group-hover:text-red-500" />
                          </button>
                        )}
                        {nextStatus && (
                          <button 
                            onClick={() => onUpdateStatus(order.id, nextStatus)}
                            className="px-6 py-2 bg-white text-black rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-lg active:scale-95"
                          >
                            {getButtonLabel(order.status)}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Inventory Management Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold uppercase italic tracking-tight flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-orange-500" /> Kitchen Inventory
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {MOCK_DISHES.map(dish => {
            const isOut = outOfStockItems.includes(dish.name);
            return (
              <div 
                key={dish.id}
                className={`flex items-center justify-between p-4 bg-zinc-900 border rounded-2xl transition-all ${isOut ? 'border-red-500/30' : 'border-white/5'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden grayscale">
                    <img src={dish.imageUrl} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{dish.name}</h4>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${isOut ? 'text-red-500' : 'text-zinc-500'}`}>
                      {isOut ? 'Out of Stock' : 'In Stock'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => onToggleInventory(dish.name, !isOut)}
                  className={`w-12 h-6 rounded-full relative transition-all ${isOut ? 'bg-zinc-800' : 'bg-green-500'}`}
                >
                  <motion.div 
                    animate={{ x: isOut ? 2 : 26 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Menu Toggle */}
      <div className="pb-12">
        <h2 className="text-xl font-bold uppercase italic tracking-tight mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-500" /> Insights & Control
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <button className="p-6 bg-zinc-900 border border-white/5 rounded-[32px] flex flex-col items-center gap-2 group hover:border-white/20 transition-all">
            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-orange-500 transition-colors">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase font-black tracking-widest">Add Item</span>
          </button>
          <button className="p-6 bg-zinc-900 border border-white/5 rounded-[32px] flex flex-col items-center gap-2 group hover:border-white/20 transition-all">
            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-orange-500 transition-colors text-zinc-500">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase font-black tracking-widest">Report Issue</span>
          </button>
        </div>
      </div>
    </div>
  );
}
