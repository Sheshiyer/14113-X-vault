import React from 'react';
import { Activity, History, Download, Settings, User, Menu } from 'lucide-react';
import { MetricsTooltip } from '../UI/MetricsTooltip';

interface HeaderProps {
  isConnected?: boolean;
  onShowMetricsGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isConnected = false, onShowMetricsGuide }) => {
  return (
    <header className="h-14 sm:h-16 px-3 sm:px-6 flex items-center justify-between border-b border-pip-border bg-pip-dark/50 backdrop-blur-md sticky top-0 z-50">
      {/* Left: Brand */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2 text-pip-accent">
          <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
          <h1 className="text-base sm:text-xl font-semibold tracking-tight text-white">Biofield</h1>
        </div>
        <span className="text-pip-text-muted text-sm hidden lg:inline-block border-l border-pip-border pl-4">
          Polycontrast interference imaging analysis
        </span>
      </div>

      {/* Center: Status - visible on tablet+ */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex">
        <div className={`glass-chip px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium ${
          isConnected ? 'text-green-400' : 'text-yellow-400'
        }`}>
          <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-1.5 sm:mr-2 animate-pulse ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}></span>
          {isConnected ? 'ANALYSIS LIVE' : 'ANALYSIS ENGINE OFFLINE'}
        </div>
      </div>

      {/* Mobile: Status pill inline */}
      <div className="flex md:hidden">
        <div className={`glass-chip px-2 py-1 text-[10px] font-medium ${
          isConnected ? 'text-green-400' : 'text-yellow-400'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full mr-1 animate-pulse ${
            isConnected ? 'bg-green-500' : 'bg-yellow-500'
          }`}></span>
          {isConnected ? 'LIVE' : 'LOCAL'}
        </div>
      </div>

      {/* Right: Actions - hide some on mobile */}
      <div className="flex items-center gap-1 sm:gap-2">
        <MetricsTooltip onShowMetricsGuide={onShowMetricsGuide} />
        <button className="glass-button p-1.5 sm:p-2 hidden sm:flex" title="History">
          <History className="w-4 h-4 text-pip-text-secondary" />
        </button>
        <button className="glass-button p-1.5 sm:p-2 hidden sm:flex" title="Export">
          <Download className="w-4 h-4 text-pip-text-secondary" />
        </button>
        <button className="glass-button p-1.5 sm:p-2" title="Settings">
          <Settings className="w-4 h-4 text-pip-text-secondary" />
        </button>
        <div className="w-px h-5 sm:h-6 bg-pip-border mx-0.5 sm:mx-1 hidden sm:block"></div>
        <button className="glass-button p-1.5 sm:p-2 rounded-full hidden sm:flex" title="Profile">
          <User className="w-4 h-4 text-pip-text-secondary" />
        </button>
        {/* Mobile menu button */}
        <button className="glass-button p-1.5 sm:hidden" title="Menu">
          <Menu className="w-4 h-4 text-pip-text-secondary" />
        </button>
      </div>
    </header>
  );
};
