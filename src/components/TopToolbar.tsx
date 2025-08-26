import { Chip } from './Chip';
import { useConfigStore } from '../store/configStore';
import { useTestStore } from '../store/testStore';

export function TopToolbar() {
  const { mode, setMode, durations, durationSec, setDuration } = useConfigStore();
  const { actions } = useTestStore();

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
    <div className="flex justify-center py-4 px-4">
      <div 
        className="flex items-center gap-3 max-w-[960px] h-12 px-3 py-2 rounded-xl bg-panel border border-panel-border"
        style={{
          paddingTop: 'env(safe-area-inset-top, 0.5rem)',
          paddingLeft: 'env(safe-area-inset-left, 0.75rem)',
          paddingRight: 'env(safe-area-inset-right, 0.75rem)',
        }}
      >
        {/* Mode chips */}
        <div className="flex items-center gap-3">
          <Chip 
            active={mode === 'time'} 
            onClick={() => onChangeMode('time')}
            className="h-8 px-3 text-sm font-medium"
          >
            time
          </Chip>
          <Chip 
            active={mode === 'quote'} 
            onClick={() => onChangeMode('quote')}
            className="h-8 px-3 text-sm font-medium"
          >
            quote
          </Chip>
          <Chip 
            active={mode === 'zen'} 
            onClick={() => onChangeMode('zen')}
            className="h-8 px-3 text-sm font-medium"
          >
            zen
          </Chip>
          <Chip 
            active={mode === 'custom'} 
            onClick={() => onChangeMode('custom')}
            className="h-8 px-3 text-sm font-medium"
          >
            custom
          </Chip>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-white/8"></div>

        {/* Duration chips - only show for time mode */}
        {mode === 'time' && (
          <div className="flex items-center gap-3">
            {durations.map(s => (
              <Chip 
                key={s} 
                active={s === durationSec} 
                onClick={() => onChangeDur(s)}
                className="h-8 px-3 text-sm font-medium"
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
