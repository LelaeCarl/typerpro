const HudFooter = () => {
  return (
    <footer 
      className="fixed bottom-0 left-0 right-0 bg-bg border-t border-text2/20 px-6 py-3"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0.75rem)',
        paddingLeft: 'env(safe-area-inset-left, 1.5rem)',
        paddingRight: 'env(safe-area-inset-right, 1.5rem)',
      }}
    >
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="text-accent">
          {/* Logo/icon */}
          <div className="w-6 h-6 bg-accent rounded-sm flex items-center justify-center">
            <span className="text-bg text-xs font-mono font-bold">T</span>
          </div>
        </div>
        
        {/* Keybind hints - hidden on mobile */}
        <div className="hidden md:flex items-center space-x-6 text-text2 text-sm">
          <div className="flex items-center space-x-2">
            <kbd className="px-2 py-1 bg-panel rounded text-xs">tab</kbd>
            <span>+</span>
            <kbd className="px-2 py-1 bg-panel rounded text-xs">enter</kbd>
            <span>- restart test</span>
          </div>
          <div className="flex items-center space-x-2">
            <kbd className="px-2 py-1 bg-panel rounded text-xs">esc</kbd>
            <span>or</span>
            <kbd className="px-2 py-1 bg-panel rounded text-xs">ctrl</kbd>
            <span>+</span>
            <kbd className="px-2 py-1 bg-panel rounded text-xs">shift</kbd>
            <span>+</span>
            <kbd className="px-2 py-1 bg-panel rounded text-xs">p</kbd>
            <span>- command line</span>
          </div>
        </div>
        
        {/* Mobile restart hint */}
        <div className="md:hidden text-text2 text-sm">
          <span>tap to restart</span>
        </div>
        
        <div className="flex items-center space-x-4 text-text2 text-sm">
          <div className="hidden sm:flex items-center space-x-3">
            <a href="#" className="hover:text-text transition-colors min-h-[44px] flex items-center">contact</a>
            <a href="#" className="hover:text-text transition-colors min-h-[44px] flex items-center">about</a>
            <a href="#" className="hover:text-text transition-colors min-h-[44px] flex items-center">support</a>
          </div>
          <div className="hidden sm:flex items-center space-x-3 ml-4">
            <a href="#" className="hover:text-text transition-colors min-h-[44px] flex items-center">terms</a>
            <a href="#" className="hover:text-text transition-colors min-h-[44px] flex items-center">privacy</a>
            <a href="#" className="hover:text-text transition-colors min-h-[44px] flex items-center">cookies</a>
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
