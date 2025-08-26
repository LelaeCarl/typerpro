import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import TopToolbar from '../components/TopToolbar';
import TestSurface from '../components/TestSurface';
import HudFooter from '../components/HudFooter';

const TestPage = () => {
  const { currentTest } = useAppStore();
  const navigate = useNavigate();

  // Navigate to results when test is completed
  useEffect(() => {
    if (currentTest?.status === 'done') {
      navigate('/results');
    }
  }, [currentTest?.status, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <TopToolbar />
      
      <div className="flex-1 flex items-center justify-center pb-20">
        <TestSurface />
      </div>
      
      <HudFooter />
    </div>
  );
};

export default TestPage;
