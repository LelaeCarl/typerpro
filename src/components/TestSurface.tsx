import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTestStore } from '../store/testStore';
import { useAppStore } from '../store';
import { Letter } from './Letter';

export function TestSurface() {
  const { target, cursor, status, mode, remainingTime, startIfIdle, typeChar, commitSpace, backspace } = useTestStore(s => ({ 
    target: s.current.target, 
    cursor: s.current.cursor, 
    status: s.current.status,
    mode: s.current.mode,
    remainingTime: s.current.remainingTime,
    startIfIdle: s.actions.startIfIdle, 
    typeChar: s.actions.typeChar, 
    commitSpace: s.actions.commitSpace, 
    backspace: s.actions.backspace 
  }));
  const { commandPaletteOpen } = useAppStore();
  
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(isMobileDevice || isTouchDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [status]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleBlur = () => {
      // Only refocus if command palette isn't open
      if (!commandPaletteOpen) {
        setTimeout(() => input.focus(), 0);
      }
    };

    input.addEventListener('blur', handleBlur);
    return () => input.removeEventListener('blur', handleBlur);
  }, [commandPaletteOpen]);

  const handleTestAreaClick = () => {
    inputRef.current?.focus();
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    // Handle special keys on mobile
    if (e.key === 'Backspace') {
      e.preventDefault();
      startIfIdle();
      backspace();
      return;
    }
    
    if (e.key === ' ') {
      e.preventDefault();
      startIfIdle();
      commitSpace();
      return;
    }
    
    if (e.key === 'Enter') {
      e.preventDefault();
      startIfIdle();
      commitSpace();
      return;
    }

    // Don't process during IME composition
    if (e.isComposing) return;
  };

  const onBeforeInput: React.FormEventHandler<HTMLInputElement> = (e) => {
    const input = e.currentTarget;
    const data = (e as any).data;
    
    if (!data) return;
    
    e.preventDefault();
    startIfIdle();
    
    // Handle each character
    for (const char of data) {
      if (char === ' ') {
        commitSpace();
      } else if (char.length === 1) {
        typeChar(char);
      }
    }
    
    // Clear input value to prevent accumulation
    setTimeout(() => {
      input.value = '';
    }, 0);
  };

  const onInput: React.FormEventHandler<HTMLInputElement> = (e) => {
    // Fallback for browsers that don't support beforeinput
    const input = e.currentTarget;
    const value = input.value;
    
    if (!value) return;
    
    e.preventDefault();
    startIfIdle();
    
    // Handle each character
    for (const char of value) {
      if (char === ' ') {
        commitSpace();
      } else if (char.length === 1) {
        typeChar(char);
      }
    }
    
    // Clear input value
    input.value = '';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative min-h-[100svh] flex flex-col justify-center">
      {/* Mobile input field - tiny but visible to summon keyboard */}
      <input 
        ref={inputRef} 
        className={`absolute top-0 left-0 w-[1px] h-[1px] opacity-0 pointer-events-none ${
          isMobile ? 'w-[1px] h-[1px] opacity-0' : 'w-0 h-0'
        }`}
        autoFocus 
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
        inputMode="text"
        onKeyDown={onKeyDown}
        onBeforeInput={onBeforeInput}
        onInput={onInput}
        onChange={() => { /* noop: we handle input via beforeinput/input */ }}
      />
      
      <div 
        aria-hidden 
        className="select-none px-4 py-8"
        onClick={handleTestAreaClick}
        style={{ 
          paddingTop: 'env(safe-area-inset-top, 1rem)',
          paddingBottom: 'env(safe-area-inset-bottom, 1rem)',
          paddingLeft: 'env(safe-area-inset-left, 1rem)',
          paddingRight: 'env(safe-area-inset-right, 1rem)',
        }}
      >
        {/* Language indicator */}
        <div className="text-center text-text2 text-sm mb-4">
          <span>english</span>
        </div>

        {/* Time display for time mode */}
        {mode === 'time' && remainingTime !== undefined && (
          <div className="text-center text-accent text-lg font-mono mb-4">
            {formatTime(remainingTime)}
          </div>
        )}

        {/* Test surface */}
        <div 
          data-testid="test-surface" 
          className="font-mono text-center leading-relaxed max-w-4xl mx-auto" 
          style={{ 
            fontSize: isMobile ? '24px' : '32px', 
            lineHeight: '1.35',
            minHeight: isMobile ? '60vh' : 'auto'
          }}
        >
          {target.map((word, index) => {
            const isCurrentWord = index === cursor.wordIndex;
            return (
              <motion.span 
                key={index} 
                className="inline-block mr-3"
                layout
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12, ease: 'easeOut' }}
              >
                {word.target.split('').map((letter, letterIndex) => {
                  const isCurrentLetter = isCurrentWord && letterIndex === cursor.letterIndex;
                  const state = word.letters[letterIndex] || 'pending';
                  return (
                    <span key={letterIndex} className="relative">
                      <Letter ch={letter} state={state} />
                      {isCurrentLetter && (
                        <motion.span 
                          className="absolute inset-0 bg-accent opacity-30"
                          animate={{ opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      )}
                    </span>
                  );
                })}
                {/* Extra characters */}
                {word.typed.length > word.target.length && 
                  word.typed.slice(word.target.length).split('').map((char, index) => (
                    <Letter key={`extra-${index}`} ch={char} state="extra" />
                  ))
                }
                <span className="text-text2">&nbsp;</span>
              </motion.span>
            );
          })}
        </div>

        {/* Restart button */}
        <div className="text-center mt-8">
          <button 
            onClick={() => {
              // This will be handled by the global keyboard handler
            }}
            className="text-text2 hover:text-text transition-colors text-sm min-h-[44px] px-4 py-2"
          >
            tab + enter - restart
          </button>
        </div>
      </div>
    </div>
  );
}
