import { useAppStore } from '../store';
import type { LetterState } from '../types';
import clsx from 'clsx';

const TestSurface = () => {
  const { currentTest, settings } = useAppStore();

  if (!currentTest) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-secondary">Loading test...</div>
      </div>
    );
  }

  const { target, cursor, status } = currentTest;

  const getLetterClass = (letter: string, state: LetterState, isCurrent: boolean) => {
    return clsx(
      'transition-colors duration-75',
      {
        'text-white/60': state === 'pending',
        'text-text-primary': state === 'correct',
        'text-semantic-error underline decoration-semantic-error': state === 'wrong',
        'text-semantic-errorExtra': state === 'extra',
        'bg-ui-caret text-background-base': isCurrent && settings.caretStyle === 'block',
        'border-l-2 border-ui-caret': isCurrent && settings.caretStyle === 'line',
        'underline decoration-ui-caret': isCurrent && settings.caretStyle === 'underline',
      }
    );
  };

  const renderWord = (word: typeof target[0], wordIndex: number) => {
    const isCurrentWord = wordIndex === cursor.wordIndex;
    
    return (
      <span key={wordIndex} className="inline-block mr-3">
        {word.target.split('').map((letter, letterIndex) => {
          const isCurrentLetter = isCurrentWord && letterIndex === cursor.letterIndex;
          const state = word.letters[letterIndex] || 'pending';
          
          return (
            <span
              key={letterIndex}
              className={getLetterClass(letter, state, isCurrentLetter)}
            >
              {letter}
            </span>
          );
        })}
        
        {/* Render extra characters */}
        {word.typed.length > word.target.length && 
          word.typed.slice(word.target.length).split('').map((char, index) => (
            <span
              key={`extra-${index}`}
              className="text-semantic-errorExtra"
            >
              {char}
            </span>
          ))
        }
        
        {/* Space after word */}
        <span className="text-white/60">&nbsp;</span>
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Language indicator */}
      <div className="flex items-center justify-center mb-8">
        <svg className="w-4 h-4 mr-2 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-text-secondary text-sm">english</span>
      </div>

      {/* Test surface */}
      <div 
        data-testid="test-surface"
        className={clsx(
          'font-mono text-center leading-relaxed select-none',
          'max-w-4xl mx-auto px-4'
        )}
        style={{
          fontSize: `${settings.fontSize}px`,
          lineHeight: '1.35',
        }}
      >
        {target.map((word, index) => renderWord(word, index))}
      </div>

      {/* Restart button */}
      {status === 'idle' && (
        <div className="flex justify-center mt-8">
          <button className="p-2 text-text-secondary hover:text-text-primary transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default TestSurface;
