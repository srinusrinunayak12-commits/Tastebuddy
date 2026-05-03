/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Home, Zap, Users, User, Search, Repeat, Heart, ShoppingBag, Bell } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import DishFeed from './components/DishFeed';
import Onboarding from './components/Onboarding';
import SocialGroups from './components/SocialGroups';
import FlashSales from './components/FlashSales';
import ProfilePage from './components/ProfilePage';
import PortalSelection from './components/PortalSelection';
import MerchantDashboard from './components/MerchantDashboard';
import OrderPage from './components/OrderPage';
import HomePage from './components/HomePage';
import { PalateProfile, TastePreference, FlashSale, UserRole, MerchantData, Order, OrderStatus, OrderOptions } from './types';
import { MOCK_DISHES, MOCK_SOCIAL_TABLES } from './constants';
import { motion, AnimatePresence } from 'motion/react';

// Socket initialization
let socket: Socket;

const MOCK_SALES: FlashSale[] = [
  { id: 'f1', dishId: '1', discount: 40, expiresAt: Date.now() + 1000 * 60 * 15 },
  { id: 'f2', dishId: '3', discount: 30, expiresAt: Date.now() + 1000 * 60 * 45 },
];

const INITIAL_MERCHANT_DATA: MerchantData = {
  businessName: "The Curry House",
  status: 'Open',
  activeOrders: 5,
  dailyEarnings: 12450.00
};

type Tab = 'home' | 'feed' | 'liked' | 'orders' | 'profile';

export default function App() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [profile, setProfile] = useState<PalateProfile | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [merchantData, setMerchantData] = useState<MerchantData>(INITIAL_MERCHANT_DATA);
  const [orders, setOrders] = useState<Order[]>([]);
  const [outOfStockItems, setOutOfStockItems] = useState<string[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    socket = io(window.location.origin);

    socket.on('inventory-sync', (items: string[]) => {
      setOutOfStockItems(items);
    });

    socket.on('order-error', (error: { message: string }) => {
      setNotification(`Error: ${error.message}`);
      setTimeout(() => setNotification(null), 5000);
    });

    socket.on('new-order', (newOrder: Order) => {
      setOrders(prev => [newOrder, ...prev]);
      if (role === UserRole.MERCHANT) {
        setNotification(`New Order: ${newOrder.dishName} from ${newOrder.customerName}`);
        setTimeout(() => setNotification(null), 5000);
      }
    });

    socket.on('order-status-changed', (updatedOrder: { orderId: string, status: OrderStatus }) => {
      setOrders(prev => prev.map(o => o.id === updatedOrder.orderId ? { ...o, status: updatedOrder.status } : o));
    });

    return () => {
      socket.disconnect();
    };
  }, [role]);

  const placeOrder = (dish: any, options?: OrderOptions) => {
    const orderData = {
      customerName: profile?.persona || 'Guest',
      dishName: dish.name,
      price: dish.price,
      options: options || {
        spiceLevel: 'Medium',
        addons: [],
        instructions: '',
        quantity: 1
      }
    };
    socket.emit('place-order', orderData);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    socket.emit('update-order-status', { orderId, status });
  };

  const toggleInventory = (dishName: string, outOfStock: boolean) => {
    socket.emit('toggle-inventory', { dishName, outOfStock });
  };

  const toggleMerchantStatus = () => {
    setMerchantData(prev => ({
      ...prev,
      status: prev.status === 'Open' ? 'Closed' : 'Open'
    }));
  };

  const handleLogout = () => {
    setRole(null);
    setProfile(null);
    setActiveTab('home');
  };

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === UserRole.CUSTOMER) {
      // Direct pass to home page with a default profile as requested
      setProfile({ 
        preferences: [TastePreference.SPICY, TastePreference.UMAMI, TastePreference.SAVORY], 
        persona: "Flavor Enthusiast", 
        matchScore: 0 
      });
    }
  };

  if (!role) {
    return <PortalSelection onSelect={handleRoleSelect} />;
  }

  if (role === UserRole.MERCHANT) {
    return (
      <div className="h-screen w-full bg-black flex flex-col overflow-hidden">
        <Notification notification={notification} />
        <MerchantDashboard 
          data={merchantData} 
          onToggleStatus={toggleMerchantStatus} 
          orders={orders}
          onUpdateStatus={updateOrderStatus}
          outOfStockItems={outOfStockItems}
          onToggleInventory={toggleInventory}
        />
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-3xl border-t border-white/5 flex justify-around items-center px-6 z-50">
          <NavButton active={true} onClick={() => {}} icon={Zap} label="Console" />
          <NavButton active={false} onClick={handleLogout} icon={Repeat} label="Switch" />
        </nav>
      </div>
    );
  }

  if (!profile) {
    return <div className="h-screen bg-black" />; // Hidden state while role is set but profile initializing
  }

  return (
    <div className="h-screen w-full bg-black flex flex-col font-sans overflow-hidden">
      {/* Top Header */}
      <header className="px-6 py-4 flex justify-between items-center z-[60]">
        <h1 className="text-2xl font-black italic tracking-tighter text-white">TasteBuddy</h1>
        <div className="p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <HomePage 
                profile={profile} 
                onExploreFeed={() => setActiveTab('feed')} 
                outOfStockItems={outOfStockItems}
                onPlaceOrder={placeOrder}
              />
            </motion.div>
          )}

          {activeTab === 'feed' && (
            <motion.div key="feed" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DishFeed 
                dishes={MOCK_DISHES} 
                profile={profile} 
                onPlaceOrder={placeOrder} 
                outOfStockItems={outOfStockItems}
              />
            </motion.div>
          )}

          {activeTab === 'liked' && (
            <motion.div key="liked" className="absolute inset-0 flex items-center justify-center flex-col gap-4 p-8 text-center bg-black" initial={{ opacity: 0 }}>
              <Heart className="w-12 h-12 text-pink-500 mb-4" />
              <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">Your Favorites</h2>
              <p className="text-gray-500 text-sm tracking-wide">Dishes you've swiped right on will appear here.</p>
            </motion.div>
          )}
          
          {activeTab === 'orders' && (
            <motion.div key="orders" className="absolute inset-0" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}>
              <OrderPage orders={orders} />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div key="profile" className="absolute inset-0" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}>
              <ProfilePage profile={profile} onLogout={handleLogout} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-3xl border-t border-white/5 flex justify-around items-center px-6 z-50">
        <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={Home} label="homepage" />
        <NavButton active={activeTab === 'liked'} onClick={() => setActiveTab('liked')} icon={Heart} label="liked dishes page" />
        <NavButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={ShoppingBag} label="order page" />
        <NavButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={User} label="profile page" />
      </nav>
    </div>
  );
}

function NavButton({ active, icon: Icon, label, onClick }: { active: boolean, icon: any, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? 'text-white' : 'text-zinc-600'}`}
    >
      <div className={`relative px-4 py-1.5 rounded-full transition-all ${active ? 'bg-orange-500/10' : ''}`}>
        <Icon className={`w-6 h-6 ${active ? 'text-orange-500' : ''}`} strokeWidth={active ? 2.5 : 2} />
        {active && (
          <motion.div 
            layoutId="nav-glow" 
            className="absolute inset-0 bg-orange-500/20 blur-md rounded-full -z-10"
          />
        )}
      </div>
      <span className={`text-[10px] font-black uppercase tracking-[0.15em] transition-opacity ${active ? 'opacity-100' : 'opacity-60'}`}>
        {label}
      </span>
    </button>
  );
}

function Notification({ notification }: { notification: string | null }) {
  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 20, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-4 left-6 right-6 z-[200] bg-zinc-900 border border-orange-500/30 p-4 rounded-2xl flex items-center gap-3 shadow-2xl shadow-orange-500/20"
        >
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center animate-pulse">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase text-orange-500 tracking-widest">Live Alert</h4>
            <p className="text-white text-xs font-bold leading-tight">{notification}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
