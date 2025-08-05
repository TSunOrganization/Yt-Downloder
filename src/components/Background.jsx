import React from 'react';

export const Background = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-muted/30 dark:bg-muted/20">
      <div className="absolute inset-0 w-full h-full animate-move-lines" style={{ backgroundSize: '40px 40px', backgroundImage: 'linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)' }}>
      </div>
    </div>
  );
};