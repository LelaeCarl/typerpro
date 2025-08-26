import React from 'react';

interface LetterProps {
  ch: string;
  state: 'pending' | 'correct' | 'wrong' | 'extra';
}

export function Letter({ ch, state }: LetterProps) {
  const baseClasses = "transition-all duration-120 ease-out";
  
  if (state === 'pending') {
    return <span className={`${baseClasses} opacity-60 text-text`}>{ch}</span>;
  }
  if (state === 'correct') {
    return <span className={`${baseClasses} text-text`}>{ch}</span>;
  }
  if (state === 'wrong') {
    return <span className={`${baseClasses} text-error underline underline-offset-4`}>{ch}</span>;
  }
  return <span className={`${baseClasses} text-errorExtra`}>{ch}</span>; // extra
}
