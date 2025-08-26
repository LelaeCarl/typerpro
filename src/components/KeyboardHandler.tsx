import { useEffect, useRef } from 'react';
import { useTestStore } from '../store/testStore';
import { useAppStore } from '../store';

const KeyboardHandler = () => {
  const { actions } = useTestStore();
  const { toggleCommandPalette } = useAppStore();
  const isComposing = useRef(false);
  const lastKeyWasTab = useRef(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if composing (IME input)
      if (event.isComposing || isComposing.current) {
        return;
      }

      // Handle restart keybinds
      if (event.key === 'Tab') {
        event.preventDefault();
        lastKeyWasTab.current = true;
        actions.resetAndRebuild();
        return;
      }

      if ((event.key === 'Enter' && event.getModifierState('Tab')) || 
          (event.key === 'Enter' && lastKeyWasTab.current)) {
        event.preventDefault();
        lastKeyWasTab.current = false;
        actions.resetAndRebuild();
        return;
      }

      // Handle command palette keybinds
      if ((event.key === 'Escape') || 
          (event.ctrlKey && event.shiftKey && (event.key === 'P' || event.key === 'p')) ||
          (event.metaKey && event.shiftKey && (event.key === 'P' || event.key === 'p'))) {
        event.preventDefault();
        toggleCommandPalette();
        return;
      }

      // Reset tab state for other keys
      if (event.key !== 'Tab') {
        lastKeyWasTab.current = false;
      }
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
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    document.addEventListener('compositionstart', handleCompositionStart);
    document.addEventListener('compositionend', handleCompositionEnd);
    document.addEventListener('paste', handlePaste);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      document.removeEventListener('compositionstart', handleCompositionStart);
      document.removeEventListener('compositionend', handleCompositionEnd);
      document.removeEventListener('paste', handlePaste);
    };
  }, [actions, toggleCommandPalette]);

  return null; // This component doesn't render anything
};

export default KeyboardHandler;
