/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TastePreference } from '../types';
import { ChevronRight, Flame, Snowflake, Waves, Zap, Heart, Star } from 'lucide-react';

interface OnboardingProps {
  onComplete: (preferences: TastePreference[], persona: string) => void;
}

const PREFERENCE_OPTIONS = [
  { id: TastePreference.SPICY, label: 'Spicy', icon: Flame, color: 'text-red-500', bg: 'bg-red-500/10' },
  { id: TastePreference.MILD, label: 'Mild', icon: Snowflake, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: TastePreference.CRUNCHY, label: 'Crunchy', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { id: TastePreference.SOFT, label: 'Soft', icon: Waves, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  { id: TastePreference.UMAMI, label: 'Umami', icon: Heart, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: TastePreference.SWEET, label: 'Sweet', icon: Star, color: 'text-pink-400', bg: 'bg-pink-400/10' },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [selected, setSelected] = useState<TastePreference[]>([]);

  const togglePreference = (pref: TastePreference) => {
    setSelected(prev => 
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  const handleComplete = () => {
    let persona = "Flavor Adventurer";
    if (selected.includes(TastePreference.SPICY) && selected.includes(TastePreference.UMAMI)) {
      persona = "Heat-Seeking Umami Specialist";
    } else if (selected.includes(TastePreference.SWEET) && selected.includes(TastePreference.SOFT)) {
      persona = "Sensory Sweetness Curator";
    } else if (selected.includes(TastePreference.CRUNCHY)) {
      persona = "Texture Enthusiast";
    }

    onComplete(selected, persona);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <h1 className="text-5xl font-bold mb-4 tracking-tighter leading-none">
          What's your <span className="text-orange-500 italic">Palate DNA?</span>
        </h1>
        <p className="text-gray-400 mb-12 text-sm uppercase tracking-widest font-medium">
          Choose at least 3 preferences to start swiping.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-12">
          {PREFERENCE_OPTIONS.map((opt) => {
            const isSelected = selected.includes(opt.id);
            const Icon = opt.icon;
            return (
              <motion.button
                key={opt.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => togglePreference(opt.id)}
                className={`
                  p-6 rounded-3xl border transition-all flex flex-col items-center justify-center gap-3
                  ${isSelected 
                    ? `border-white ${opt.bg}` 
                    : 'border-white/10 bg-white/5 hover:border-white/30'}
                `}
              >
                <Icon className={`w-8 h-8 ${opt.color}`} />
                <span className="font-semibold">{opt.label}</span>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {selected.length >= 3 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={handleComplete}
              className="w-full py-5 bg-white text-black rounded-full font-bold text-lg flex items-center justify-center gap-2"
            >
              Next <ChevronRight className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
