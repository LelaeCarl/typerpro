import { useState, useEffect } from 'react';
import { Chip } from './Chip';
import { useConfigStore } from '../store/configStore';
import { useTestStore } from '../store/testStore';

export function TopToolbar() {
  const { mode, setMode, durations, durationSec, setDuration } = useConfigStore();
  const { actions } = useTestStore();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(isMobileDevice || isTouchDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const onChangeMode = (m: any) => { 
    setMode(m); 
    if (m === 'time') {
      actions.initTimeMode(durationSec);
    } else {
      actions.resetAndRebuild();
    }
  };
  
  const onChangeDur = (s: number) => { 
    setDuration(s); 
    if (mode === 'time') {
      actions.initTimeMode(s);
    } else {
      actions.resetAndRebuild();
    }
  };

  return (
    <div 
      className="flex items-center gap-3 justify-center py-4 px-4 overflow-x-auto"
      style={{
        paddingTop: 'env(safe-area-inset-top, 1rem)',
        paddingLeft: 'env(safe-area-inset-left, 1rem)',
        paddingRight: 'env(safe-area-inset-right, 1rem)',
      }}
    >
      <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-center">
        {(['words', 'time', 'quote', 'zen'] as const).map(m => (
          <Chip 
            key={m} 
            active={m === mode} 
            onClick={() => onChangeMode(m)}
            className={isMobile ? 'min-h-[44px] min-w-[60px] text-sm' : ''}
          >
            {m}
          </Chip>
        ))}
        {mode === 'time' && (
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            {durations.map(s => (
              <Chip 
                key={s} 
                active={s === durationSec} 
                onClick={() => onChangeDur(s)}
                className={isMobile ? 'min-h-[44px] min-w-[50px] text-sm' : ''}
              >
                {s}
              </Chip>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
