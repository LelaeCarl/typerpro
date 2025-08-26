import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTestStore } from '../store/testStore';
import { TopToolbar } from '../components/TopToolbar';
import { TestSurface } from '../components/TestSurface';
import HudFooter from '../components/HudFooter';

const TestPage = () => {
  const { status, displayStats } = useTestStore(s => ({ 
    status: s.current.status, 
    displayStats: s.current.displayStats 
  }));
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'done' && displayStats) {
      navigate('/results');
    }
  }, [status, displayStats, navigate]);

  return (
    <div className="min-h-[100svh] flex flex-col">
      <TopToolbar />
      <div className="flex-1 flex flex-col">
        <TestSurface />
      </div>
      <HudFooter />
    </div>
  );
};

export default TestPage;
