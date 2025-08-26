import { useEffect, useRef } from 'react';
import { useAppStore } from '../store';

const KeyboardHandler = () => {
  const { processKeystroke, toggleCommandPalette, restartTest, finishTest } = useAppStore();
  const isComposing = useRef(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if composing (IME input)
      if (event.isComposing || isComposing.current) {
        return;
      }

      // Prevent default for most keys to avoid browser shortcuts
      if (!event.ctrlKey && !event.metaKey) {
        event.preventDefault();
      }

      const { key, code, timestamp } = event;

      // Handle special keybinds
      if (event.ctrlKey || event.metaKey) {
        if (event.shiftKey && (key === 'p' || key === 'P')) {
          event.preventDefault();
          toggleCommandPalette();
          return;
        }
      }

      // Handle restart keybinds
      if (key === 'Tab' && event.shiftKey) {
        event.preventDefault();
        restartTest();
        return;
      }

      if (key === 'Escape') {
        event.preventDefault();
        toggleCommandPalette();
        return;
      }

      // Handle test completion
      if (key === 'Enter' && event.ctrlKey) {
        event.preventDefault();
        finishTest();
        return;
      }

      // Process regular keystrokes
      processKeystroke(key, code, timestamp);
    };

    const handleCompositionStart = () => {
      isComposing.current = true;
    };

    const handleCompositionEnd = () => {
      isComposing.current = false;
    };

    const handlePaste = (event: ClipboardEvent) => {
      // Prevent pasting into the test area
      event.preventDefault();
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('compositionstart', handleCompositionStart);
    document.addEventListener('compositionend', handleCompositionEnd);
    document.addEventListener('paste', handlePaste);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('compositionstart', handleCompositionStart);
      document.removeEventListener('compositionend', handleCompositionEnd);
      document.removeEventListener('paste', handlePaste);
    };
  }, [processKeystroke, toggleCommandPalette, restartTest, finishTest]);

  return null; // This component doesn't render anything
};

export default KeyboardHandler;
