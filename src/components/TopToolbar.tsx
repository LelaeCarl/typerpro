import { useAppStore } from '../store';
import type { TestMode } from '../types';

const TopToolbar = () => {
  const { currentTest, startNewTest } = useAppStore();

  const modes: { mode: TestMode; label: string }[] = [
    { mode: 'words', label: 'words' },
    { mode: 'time', label: 'time' },
    { mode: 'quote', label: 'quote' },
    { mode: 'zen', label: 'zen' },
  ];

  const timeOptions = [15, 30, 60, 120];

  const handleModeChange = (mode: TestMode) => {
    startNewTest(mode);
  };

  const handleTimeChange = (seconds: number) => {
    startNewTest('time', seconds);
  };

  return (
    <div className="flex items-center justify-center space-x-3 py-4">
      {/* Mode chips */}
      {modes.map(({ mode, label }) => (
        <button
          key={mode}
          onClick={() => handleModeChange(mode)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            currentTest?.mode === mode
              ? 'bg-accent-yellow text-background-base'
              : 'bg-white/6 text-text-secondary hover:text-text-primary'
          }`}
        >
          {label}
        </button>
      ))}

      {/* Time options (only show for time mode) */}
      {currentTest?.mode === 'time' && (
        <div className="flex items-center space-x-2 ml-4">
          {timeOptions.map((seconds) => (
            <button
              key={seconds}
              onClick={() => handleTimeChange(seconds)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                currentTest?.mode === 'time'
                  ? 'bg-accent-yellow text-background-base'
                  : 'bg-white/6 text-text-secondary hover:text-text-primary'
              }`}
            >
              {seconds}
            </button>
          ))}
        </div>
      )}

      {/* Settings button */}
      <button className="ml-4 p-1 text-text-secondary hover:text-text-primary transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default TopToolbar;
