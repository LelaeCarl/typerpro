import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../store';

interface CommandPaletteProps { 
  onClose: () => void; 
}

const CommandPalette = ({ onClose }: CommandPaletteProps) => {
  const { updateSettings, settings } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const commands = [
    {
      id: 'restart',
      title: 'Restart Test',
      description: 'Start a new typing test',
      action: () => {
        // This will be handled by the global keyboard handler
        onClose();
      }
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Open settings panel',
      action: () => {
        // TODO: Implement settings
        onClose();
      }
    },
    {
      id: 'theme',
      title: 'Toggle Theme',
      description: 'Switch between light and dark themes',
      action: () => {
        updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
        onClose();
      }
    },
    {
      id: 'about',
      title: 'About TyperPro',
      description: 'Learn more about the application',
      action: () => {
        // TODO: Implement about dialog
        onClose();
      }
    }
  ];

  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    command.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      style={{
        paddingTop: 'env(safe-area-inset-top, 1rem)',
        paddingBottom: 'env(safe-area-inset-bottom, 1rem)',
        paddingLeft: 'env(safe-area-inset-left, 1rem)',
        paddingRight: 'env(safe-area-inset-right, 1rem)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-panel rounded-lg shadow-panel w-full max-w-2xl mx-auto max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-text2/20">
          <input 
            ref={inputRef} 
            type="text" 
            placeholder="Search commands..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full bg-transparent text-text placeholder-text2 outline-none text-lg min-h-[44px]"
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredCommands.map((command) => (
            <button 
              key={command.id} 
              onClick={command.action} 
              className="w-full p-4 text-left hover:bg-white/5 transition-colors border-b border-text2/10 last:border-b-0 min-h-[60px] flex flex-col justify-center"
            >
              <div className="text-text font-medium">{command.title}</div>
              <div className="text-text2 text-sm mt-1">{command.description}</div>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-text2/20 text-text2 text-sm">
          <div className="flex items-center justify-between">
            <span>Press Esc to close</span>
            <span>{filteredCommands.length} command{filteredCommands.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
