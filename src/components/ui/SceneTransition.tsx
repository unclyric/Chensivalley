/* ============================================
   大辟谷 - Scene Transition Overlay
   Shows big location name when entering area
   ============================================ */

import React, { useEffect, useState } from 'react';
import { LOCATION_NAMES, LOCATION_DESCRIPTIONS } from '../../utils/constants';
import { FishingLocation } from '../../utils/types';

interface SceneTransitionProps {
  location: FishingLocation;
  onComplete: () => void;
}

export const SceneTransition: React.FC<SceneTransitionProps> = ({ location, onComplete }) => {
  const [phase, setPhase] = useState<'enter' | 'show' | 'exit'>('enter');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('show'), 500);
    const t2 = setTimeout(() => setPhase('exit'), 2500);
    const t3 = setTimeout(() => onComplete(), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  const name = LOCATION_NAMES[location] || '未知之地';
  const desc = LOCATION_DESCRIPTIONS[location] || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      style={{ backgroundColor: phase === 'exit' ? 'transparent' : 'rgba(0,0,0,0.85)' }}>
      <div className={`text-center transition-all duration-700
        ${phase === 'enter' ? 'scale-150 opacity-0' : ''}
        ${phase === 'show' ? 'scale-100 opacity-100' : ''}
        ${phase === 'exit' ? 'scale-90 opacity-0' : ''}
      `}>
        {/* Big location name */}
        <h1 className="font-pixel text-5xl text-white mb-4 tracking-widest"
          style={{ textShadow: '0 0 40px rgba(126,181,166,0.8), 0 4px 8px rgba(0,0,0,0.8)' }}>
          {name}
        </h1>
        {/* Divider */}
        <div className="w-64 h-1 bg-game-accent mx-auto mb-4 rounded opacity-70" />
        {/* Description */}
        <p className="font-pixel text-sm text-game-text max-w-lg mx-auto leading-relaxed"
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
          {desc}
        </p>
      </div>
    </div>
  );
};
