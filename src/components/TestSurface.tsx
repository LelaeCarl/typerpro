import { useTestStore } from '../store';
import { useConfigStore } from '../store/configStore';

export function TestSurface() {
  const { current } = useTestStore();
  const { mode } = useConfigStore();

  if (current.status === 'done') {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Test Complete!</h2>
          {current.displayStats && (
            <div className="space-y-2">
              <p>WPM: {current.displayStats.wpm}</p>
              <p>Accuracy: {current.displayStats.accuracy}%</p>
              <p>Time: {current.displayStats.time}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const formatTime = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!current.remainingMs || mode !== 'time') return 0;
    const configStore = useConfigStore.getState();
    const totalMs = configStore.durationSec * 1000;
    return Math.max(0, Math.min(100, ((totalMs - current.remainingMs) / totalMs) * 100));
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        {/* Language indicator */}
        <div className="text-center mb-4">
          <span className="text-text2">english</span>
        </div>

        {/* Timer for time mode */}
        {mode === 'time' && current.remainingMs !== undefined && current.status === 'running' && (
          <div className="text-center mb-4">
            <div className="text-accent text-lg font-mono mb-2">
              {formatTime(current.remainingMs)}
            </div>
            {/* Progress bar */}
            <div className="w-48 mx-auto h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-100 ease-out"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        )}

        {/* Words display */}
        <div className="text-xl leading-relaxed text-center">
          {current.target.map((word, wordIndex) => (
            <span key={wordIndex} className="mr-2">
              {word.target.split('').map((letter, letterIndex) => {
                const state = word.letters[letterIndex] || 'pending';
                const isCurrent = wordIndex === current.cursor.wordIndex && letterIndex === current.cursor.letterIndex;
                
                let className = '';
                if (state === 'correct') {
                  className = 'text-text';
                } else if (state === 'wrong') {
                  className = 'text-error underline';
                } else if (state === 'extra') {
                  className = 'text-errorExtra';
                } else {
                  className = 'text-text2';
                }

                if (isCurrent) {
                  className += ' bg-accent text-bg';
                }

                return (
                  <span key={letterIndex} className={className}>
                    {letter}
                  </span>
                );
              })}
              {wordIndex < current.target.length - 1 && <span className="text-text2"> </span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
