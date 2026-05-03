/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SocialTable } from '../types';
import { Users, Clock, Hash, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

interface SocialGroupsProps {
  tables: SocialTable[];
}

export default function SocialGroups({ tables }: SocialGroupsProps) {
  return (
    <div className="flex flex-col gap-6 p-6 font-sans h-full overflow-y-auto pb-32">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-bold text-white tracking-tighter uppercase italic">Table for 4</h2>
        <p className="text-gray-500 text-sm tracking-wide leading-tight">Matched by interests, powered by shared cravings.</p>
      </div>

      <div className="grid gap-4">
        {tables.map((table, idx) => (
          <motion.div
            key={table.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative p-6 bg-zinc-900 rounded-[32px] border border-white/5 hover:border-white/20 transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-orange-500">Meeting at</span>
                <h3 className="text-xl font-bold text-white">{table.restaurantName}</h3>
              </div>
              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <Users className="w-4 h-4 text-white/40" />
                <span className="font-medium">{table.membersCount}/{table.membersMax} joined</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <Clock className="w-4 h-4 text-white/40" />
                <span className="font-medium">{table.time}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {table.interests.map(interest => (
                <span key={interest} className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                  <Hash className="w-2.5 h-2.5 text-white/20" /> {interest}
                </span>
              ))}
            </div>
            
            <button className="mt-6 w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold text-xs uppercase tracking-widest border border-white/5 transition-all">
              Join Table
            </button>
          </motion.div>
        ))}
      </div>
      
      <button className="fixed bottom-24 right-6 w-16 h-16 bg-white text-black rounded-full shadow-2xl shadow-white/20 flex items-center justify-center group">
        <Users className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
}
