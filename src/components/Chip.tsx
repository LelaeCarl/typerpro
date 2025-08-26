import React from 'react';

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Chip({ active, children, className = '', ...rest }: ChipProps) {
  const base = "rounded-full text-sm font-medium transition-all duration-120 ease-out touch-manipulation focus:outline-none focus:ring-2 focus:ring-accent/30";
  
  const cls = active 
    ? "bg-accent text-bg hover:bg-accent/90 active:scale-98" 
    : "bg-white/6 text-text2 hover:bg-white/10 active:scale-98";
    
  return (
    <button 
      className={`${base} ${cls} ${className}`} 
      {...rest}
    >
      {children}
    </button>
  );
}
