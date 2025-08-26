import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import ResultsGraph from '../components/ResultsGraph';
import HudFooter from '../components/HudFooter';

const ResultsPage = () => {
  const { currentTest, startNewTest } = useAppStore();
  const navigate = useNavigate();

  if (!currentTest?.displayStats) {
    navigate('/');
    return null;
  }

  const { displayStats } = currentTest;
  const charStats = { correct: 129, wrong: 4, extra: 1, missed: 0 }; // Fake stats

  const handleRestart = () => {
    startNewTest(displayStats.testMode);
    navigate('/');
  };

  const handleNextTest = () => {
    startNewTest(displayStats.testMode);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {/* Main results layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left column - Metrics */}
          <div className="space-y-8">
            {/* WPM and Accuracy */}
            <div className="space-y-6">
              <div>
                <div className="text-text-secondary text-sm mb-2">wpm</div>
                <div className="text-accent-yellow text-display-lg font-bold">
                  {Math.round(displayStats.wpm)}
                </div>
              </div>
              
              <div>
                <div className="text-text-secondary text-sm mb-2">acc</div>
                <div className="text-accent-yellow text-display-lg font-bold">
                  {displayStats.accuracy.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Test info */}
            <div className="text-text-secondary text-sm space-y-1">
              <div>{displayStats.testMode} {displayStats.durationSec}</div>
              <div>english</div>
            </div>
          </div>

          {/* Right column - Graph */}
          <div>
            <ResultsGraph displayStats={displayStats} />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div>
            <div className="text-text-secondary text-sm mb-1">raw</div>
            <div className="text-text-primary text-xl font-medium">
              {displayStats.rawWpm ? Math.round(displayStats.rawWpm) : '-'}
            </div>
          </div>
          
          <div>
            <div className="text-text-secondary text-sm mb-1">characters</div>
            <div className="text-text-primary text-xl font-medium">
              {charStats.correct}/{charStats.wrong}/{charStats.extra}/{charStats.missed}
            </div>
          </div>
          
          <div>
            <div className="text-text-secondary text-sm mb-1">consistency</div>
            <div className="text-text-primary text-xl font-medium">
              {displayStats.consistency ? `${displayStats.consistency.toFixed(0)}%` : '-'}
            </div>
          </div>
          
          <div>
            <div className="text-text-secondary text-sm mb-1">time</div>
            <div className="text-text-primary text-xl font-medium">
              {displayStats.durationSec}s
            </div>
            <div className="text-text-secondary text-xs">
              00:00:{Math.floor(displayStats.durationSec).toString().padStart(2, '0')} session
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <button
            onClick={handleNextTest}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors"
            title="Next test"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          
          <button
            onClick={handleRestart}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors"
            title="Restart test"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          
          <button className="p-2 text-text-secondary hover:text-text-primary transition-colors" title="Report">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </button>
          
          <button className="p-2 text-text-secondary hover:text-text-primary transition-colors" title="Menu">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <button className="p-2 text-text-secondary hover:text-text-primary transition-colors" title="Previous test">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
          
          <button className="p-2 text-text-secondary hover:text-text-primary transition-colors" title="Save image">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        {/* Sign in prompt */}
        <div className="text-center text-text-secondary text-sm mb-8">
          Sign in to save your result
        </div>
      </div>
      
      <HudFooter />
    </div>
  );
};

export default ResultsPage;
