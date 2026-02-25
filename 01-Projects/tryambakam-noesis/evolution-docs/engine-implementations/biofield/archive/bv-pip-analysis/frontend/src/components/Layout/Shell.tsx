import React, { type ReactNode } from 'react';
import { Header } from './Header';
import { TimelineStrip, type TimelineDataPoint } from './TimelineStrip';

interface ShellProps {
  children: ReactNode;
  timelineData?: TimelineDataPoint[];
  sessionDuration?: number;
  isConnected?: boolean;
  onShowMetricsGuide?: () => void;
}

export const Shell: React.FC<ShellProps> = ({
  children,
  timelineData = [],
  sessionDuration = 0,
  isConnected = false,
  onShowMetricsGuide,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-pip-bg text-pip-text-primary font-sans selection:bg-pip-accent selection:text-white overflow-hidden">
      <Header isConnected={isConnected} onShowMetricsGuide={onShowMetricsGuide} />
      
      <main className="flex-1 flex overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-radial from-pip-accent/5 to-transparent opacity-40 pointer-events-none" />
        
        <div className="w-full h-full max-w-[1920px] mx-auto p-2 sm:p-4 pb-28 sm:pb-36 lg:pb-40 flex flex-col lg:grid lg:grid-cols-12 gap-3 sm:gap-4 overflow-y-auto">
           {children}
        </div>
      </main>

      <TimelineStrip data={timelineData} sessionDuration={sessionDuration} />
    </div>
  );
};
