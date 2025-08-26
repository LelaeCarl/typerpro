import { useEffect, useRef } from 'react';
import { useTestStore } from '../store';

export function KeyboardHandler() {
  const { current, actions } = useTestStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for all keys to avoid browser shortcuts
      e.preventDefault();
      
      // Focus the hidden input
      if (inputRef.current) {
        inputRef.current.focus();
      }

      // Start test on first keystroke
      if (current.status === 'idle') {
        actions.startIfIdle();
      }

      // Handle different key types
      if (e.key === 'Backspace') {
        actions.backspace();
      } else if (e.key === ' ') {
        actions.commitSpace();
      } else if (e.key.length === 1) {
        actions.typeChar(e.key);
      }
    };

    // Focus the input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [current.status, actions]);

  return (
    <input
      ref={inputRef}
      type="text"
      className="sr-only"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      tabIndex={-1}
    />
  );
}
