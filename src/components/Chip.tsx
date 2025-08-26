import React from 'react';

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Chip({ active, children, className = '', ...rest }: ChipProps) {
  const base = "px-3 h-7 rounded-full text-sm transition-colors touch-manipulation";
  const cls = active ? "bg-accent text-bg" : "bg-white/5 text-text2 hover:bg-white/10 active:bg-white/15";
  return (
    <button 
      className={`${base} ${cls} ${className}`} 
      {...rest}
    >
      {children}
    </button>
  );
}
