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
        // Restart logic handled by keyboard handler
        onClose();
      },
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Open settings panel',
      action: () => {
        // TODO: Open settings
        onClose();
      },
    },
    {
      id: 'theme',
      title: 'Toggle Theme',
      description: 'Switch between light and dark themes',
      action: () => {
        updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
        onClose();
      },
    },
    {
      id: 'font-size',
      title: 'Font Size',
      description: 'Adjust font size',
      action: () => {
        // TODO: Font size adjustment
        onClose();
      },
    },
  ];

  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    command.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface-panel rounded-lg shadow-panel w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="p-4 border-b border-text-secondary/20">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-text-primary placeholder-text-secondary outline-none text-lg"
          />
        </div>

        {/* Commands list */}
        <div className="max-h-96 overflow-y-auto">
          {filteredCommands.map((command) => (
            <button
              key={command.id}
              onClick={command.action}
              className="w-full p-4 text-left hover:bg-white/5 transition-colors border-b border-text-secondary/10 last:border-b-0"
            >
              <div className="text-text-primary font-medium">{command.title}</div>
              <div className="text-text-secondary text-sm mt-1">{command.description}</div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-text-secondary/20 text-text-secondary text-sm">
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
