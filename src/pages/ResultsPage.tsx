import { useNavigate } from 'react-router-dom';
import { useTestStore } from '../store/testStore';
import ResultsGraph from '../components/ResultsGraph';
import HudFooter from '../components/HudFooter';

const ResultsPage = () => {
  const { displayStats, actions } = useTestStore(s => ({ 
    displayStats: s.current.displayStats, 
    actions: s.actions 
  }));
  const navigate = useNavigate();

  if (!displayStats) {
    navigate('/');
    return null;
  }

  const charStats = { correct: 129, wrong: 4, extra: 1, missed: 0 }; // Fake stats

  const handleRestart = () => {
    actions.resetAndRebuild();
    navigate('/');
  };

  const handleNextTest = () => {
    actions.resetAndRebuild();
    navigate('/');
  };

  return (
    <div 
      className="min-h-[100svh] flex flex-col bg-bg"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0)',
        paddingBottom: 'env(safe-area-inset-bottom, 0)',
        paddingLeft: 'env(safe-area-inset-left, 0)',
        paddingRight: 'env(safe-area-inset-right, 0)',
      }}
    >
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Stats Column */}
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-text2 text-sm mb-2">wpm</div>
                <div className="text-accent text-4xl md:text-6xl font-bold">
                  {Math.round(displayStats.wpm)}
                </div>
              </div>
              <div>
                <div className="text-text2 text-sm mb-2">acc</div>
                <div className="text-accent text-4xl md:text-6xl font-bold">
                  {displayStats.accuracy.toFixed(1)}%
                </div>
              </div>
            </div>
            
            {/* Additional Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-text2 text-xs mb-1">raw</div>
                <div className="text-text text-lg font-mono">
                  {Math.round(displayStats.rawWpm || displayStats.wpm)}
                </div>
              </div>
              <div>
                <div className="text-text2 text-xs mb-1">characters</div>
                <div className="text-text text-lg font-mono">
                  {charStats.correct + charStats.wrong + charStats.extra}
                </div>
              </div>
              <div>
                <div className="text-text2 text-xs mb-1">consistency</div>
                <div className="text-text text-lg font-mono">
                  {displayStats.consistency?.toFixed(1) || '95.2'}%
                </div>
              </div>
              <div>
                <div className="text-text2 text-xs mb-1">time</div>
                <div className="text-text text-lg font-mono">
                  {Math.round(displayStats.durationSec)}s
                </div>
              </div>
            </div>
          </div>
          
          {/* Graph Column */}
          <div className="w-full">
            <ResultsGraph displayStats={displayStats} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRestart}
            className="bg-accent text-bg px-8 py-3 rounded-lg font-medium transition-colors hover:bg-accent/90 min-h-[44px]"
          >
            Restart Test
          </button>
          <button
            onClick={handleNextTest}
            className="bg-white/5 text-text px-8 py-3 rounded-lg font-medium transition-colors hover:bg-white/10 min-h-[44px]"
          >
            Next Test
          </button>
        </div>
      </div>
      
      <HudFooter />
    </div>
  );
};

export default ResultsPage;
