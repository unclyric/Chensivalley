/* ============================================
   沉思谷物鱼 - Notification Toast
   Meditation Valley Fish
   ============================================ */

import React, { useEffect } from 'react';

interface NotificationProps {
  message: string;
  onDismiss: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ message, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss, message]);

  // Split multi-line messages
  const lines = message.split('\n');

  return (
    <div
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slide-in cursor-pointer"
      onClick={onDismiss}
    >
      <div className="pixel-panel max-w-md">
        {lines.map((line, i) => (
          <p key={i} className="font-pixel text-[9px] text-game-text leading-relaxed">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
};
