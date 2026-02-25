/**
 * MetricsTooltip - Button to navigate to the metrics guide page
 */
import React from 'react';
import { HelpCircle } from 'lucide-react';

interface MetricsTooltipProps {
  className?: string;
  onShowMetricsGuide?: () => void;
}

export const MetricsTooltip: React.FC<MetricsTooltipProps> = ({ className = '', onShowMetricsGuide }) => {
  return (
    <button
      onClick={onShowMetricsGuide}
      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-pip-text-secondary hover:text-white ${className}`}
      title="View metrics definitions"
    >
      <HelpCircle className="w-4 h-4" />
      <span className="text-xs font-medium">Metrics Guide</span>
    </button>
  );
};
