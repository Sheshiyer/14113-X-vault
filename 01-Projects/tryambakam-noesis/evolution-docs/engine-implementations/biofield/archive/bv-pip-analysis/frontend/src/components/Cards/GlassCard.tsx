import React, { type ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hoverEffect = false 
}) => {
  return (
    <div 
      className={`
        glass-panel 
        p-4 
        ${hoverEffect ? 'glass-card' : ''} 
        ${className}
      `}
    >
      {children}
    </div>
  );
};
