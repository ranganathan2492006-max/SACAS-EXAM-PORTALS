import React from 'react';

export default function Card({ children, className = '', variant = 'default', onClick }) {
  const baseStyle = "rounded-2xl transition-all duration-300";
  
  const variants = {
    default: "glass-panel p-6 shadow-xl shadow-black/30",
    accent: "glass-panel-accent p-6 shadow-xl shadow-black/20",
    flat: "bg-slate-900/60 border border-slate-800/80 p-6 rounded-xl"
  };

  return (
    <div 
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${onClick ? 'cursor-pointer hover:border-violet-500/40 hover:shadow-violet-950/20' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
