const HudFooter = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background-base border-t border-text-secondary/20 px-6 py-3">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {/* Left - Terminal icon */}
        <div className="text-accent-yellow">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        {/* Center - Keybind hints */}
        <div className="flex items-center space-x-6 text-text-secondary text-sm">
          <div className="flex items-center space-x-2">
            <kbd className="px-2 py-1 bg-surface-panel rounded text-xs">tab</kbd>
            <span>+</span>
            <kbd className="px-2 py-1 bg-surface-panel rounded text-xs">enter</kbd>
            <span>- restart test</span>
          </div>
          <div className="flex items-center space-x-2">
            <kbd className="px-2 py-1 bg-surface-panel rounded text-xs">esc</kbd>
            <span>or</span>
            <kbd className="px-2 py-1 bg-surface-panel rounded text-xs">ctrl</kbd>
            <span>+</span>
            <kbd className="px-2 py-1 bg-surface-panel rounded text-xs">shift</kbd>
            <span>+</span>
            <kbd className="px-2 py-1 bg-surface-panel rounded text-xs">p</kbd>
            <span>- command line</span>
          </div>
        </div>

        {/* Right - Links and version */}
        <div className="flex items-center space-x-4 text-text-secondary text-sm">
          <div className="flex items-center space-x-3">
            <a href="#" className="hover:text-text-primary transition-colors">contact</a>
            <a href="#" className="hover:text-text-primary transition-colors">support</a>
            <a href="#" className="hover:text-text-primary transition-colors">github</a>
            <a href="#" className="hover:text-text-primary transition-colors">discord</a>
            <a href="#" className="hover:text-text-primary transition-colors">twitter</a>
          </div>
          <div className="flex items-center space-x-3 ml-4">
            <a href="#" className="hover:text-text-primary transition-colors">terms</a>
            <a href="#" className="hover:text-text-primary transition-colors">security</a>
            <a href="#" className="hover:text-text-primary transition-colors">privacy</a>
          </div>
          <div className="ml-4 text-xs">
            <span>serika dark</span>
            <span className="mx-2">•</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HudFooter;
