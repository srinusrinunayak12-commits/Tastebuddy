/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { PalateProfile, Badge } from '../types';
import { Settings, LogOut, Award, ChevronRight, TrendingUp, Menu, X, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_BADGES } from '../constants';

interface ProfilePageProps {
  profile: PalateProfile;
  onLogout: () => void;
}

export default function ProfilePage({ profile, onLogout }: ProfilePageProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="flex flex-col p-6 font-sans h-full overflow-y-auto pb-32 bg-black relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-white tracking-tighter uppercase italic">Foodie Profile</h2>
        <button onClick={() => setShowMenu(true)} className="p-2 bg-white/5 rounded-xl border border-white/10">
          <Menu className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Profile Menu Overlay */}
      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-white/10 rounded-t-[40px] p-8 z-[101] shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-white uppercase italic tracking-tight">Account Options</h3>
                <button onClick={() => setShowMenu(false)} className="p-2 bg-white/5 rounded-full">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <MenuOption icon={Settings} label="settings" onClick={() => setShowMenu(false)} />
                <MenuOption icon={UserIcon} label="personal details" onClick={() => setShowMenu(false)} />
                <MenuOption 
                  icon={LogOut} 
                  label="logout" 
                  onClick={() => {
                    setShowMenu(false);
                    onLogout();
                  }} 
                  danger 
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Profile Header */}
      <div className="bg-zinc-900 rounded-[32px] p-8 border border-white/5 mb-8 text-center">
        <div className="w-24 h-24 bg-orange-500 rounded-full mx-auto mb-4 border-4 border-white/10 flex items-center justify-center text-4xl">
          😋
        </div>
        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Taste Master Srinivas</h3>
        <div className="inline-block px-4 py-1 bg-white/5 rounded-full border border-white/10 text-orange-500 text-xs font-black uppercase tracking-widest italic mb-6">
          {profile.persona}
        </div>
        
        <div className="flex justify-around border-t border-white/5 pt-6">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-white">42</span>
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Dishes Swiped</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-white">12</span>
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Tables Joined</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-white">LVL 4</span>
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Gourmet Tier</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-3">
          <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-white">Next Tier Progress</h4>
          <span className="text-xs text-orange-500 font-bold">850 / 1000 XP</span>
        </div>
        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-orange-500 w-[85%] rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
        </div>
      </div>

      {/* Badges Collection */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-bold text-white tracking-tight">Taste Badges</h4>
          <span className="text-orange-500 text-xs font-bold uppercase tracking-widest flex items-center gap-1">View All <ChevronRight className="w-4 h-4" /></span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {MOCK_BADGES.map((badge) => (
            <div 
              key={badge.id}
              className={`p-4 rounded-[24px] border transition-all ${badge.unlocked ? 'bg-zinc-900 border-white/10' : 'bg-black border-dashed border-zinc-800 opacity-50'}`}
            >
              <div className="text-4xl mb-3">{badge.unlocked ? badge.icon : '🔒'}</div>
              <h5 className="text-sm font-bold text-white mb-1">{badge.name}</h5>
              <p className="text-[10px] text-gray-500 leading-tight">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MenuOption({ icon: Icon, label, onClick, danger }: { icon: any, label: string, onClick: () => void, danger?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all text-left ${danger ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-white/5 border-white/5 text-white hover:bg-white/10'}`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-bold uppercase tracking-widest text-[10px]">{label}</span>
      <ChevronRight className={`ml-auto w-4 h-4 ${danger ? 'text-red-500/40' : 'text-white/20'}`} />
    </button>
  );
}
