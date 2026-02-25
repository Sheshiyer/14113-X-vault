import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface ScoreTileProps {
  title: string;
  score: number;
  trend?: 'up' | 'down' | 'stable';
  label?: string;
}

// Score explanations
const scoreExplanations: Record<string, string> = {
  'Energy': 'Computed from Light Quanta Density (30%), Average Intensity (25%), Total Energy (25%), and Normalized Area (20%). Higher values indicate stronger biofield presence.',
  'Symmetry': 'Based on Body SSIM (50%), Contour Balance (30%), and Color Symmetry (20%). Measures bilateral balance and alignment.',
  'Coherence': 'Derived from Pattern Regularity (35%), Temporal Stability (25%), Hurst Exponent (25%), and Color Coherence (15%). Indicates field organization.',
  'Complexity': 'Calculated from Fractal Dimension (30%), Color Entropy (25%), Correlation Dimension (20%), Contour Complexity (15%), and Noise (10%).',
  'Regulation': 'Based on Lyapunov Exponent (30%), DFA Alpha (25%), Temporal Variance (20%), Recurrence Rate (15%), and Stability (10%). Reflects adaptive capacity.',
  'Color Bal': 'Measures Color Uniformity (30%), Hue Balance (25%), Saturation Consistency (20%), Coherence (15%), and Symmetry (10%).',
  'Color Balance': 'Measures Color Uniformity (30%), Hue Balance (25%), Saturation Consistency (20%), Coherence (15%), and Symmetry (10%).',
};

export const ScoreTile: React.FC<ScoreTileProps> = ({ title, score, trend = 'stable', label }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-3 h-3 text-pip-success" />;
      case 'down': return <ArrowDown className="w-3 h-3 text-pip-danger" />;
      default: return <Minus className="w-3 h-3 text-pip-text-muted" />;
    }
  };

  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-pip-success';
    if (s >= 50) return 'text-pip-warning';
    return 'text-pip-danger';
  };

  const getRingColor = (s: number) => {
    if (s >= 80) return 'stroke-pip-success';
    if (s >= 50) return 'stroke-pip-warning';
    return 'stroke-pip-danger';
  };

  // SVG parameters for progress ring - smaller on mobile
  const radiusMobile = 16;
  const radiusDesktop = 24;
  const circumferenceMobile = 2 * Math.PI * radiusMobile;
  const circumferenceDesktop = 2 * Math.PI * radiusDesktop;
  const offsetMobile = circumferenceMobile - (score / 100) * circumferenceMobile;
  const offsetDesktop = circumferenceDesktop - (score / 100) * circumferenceDesktop;

  const explanation = scoreExplanations[title] || 'Composite score based on multiple metrics.';

  return (
    <div
      className="glass-chip !bg-white/5 !border-white/5 !rounded-lg sm:!rounded-xl !p-2 sm:!p-4 !flex-col !items-start hover:!bg-white/10 transition-all cursor-pointer group h-full justify-between relative perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ perspective: '1000px' }}
    >
      <div
        className="relative w-full h-full transition-transform duration-500 preserve-3d"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front of card */}
        <div
          className="absolute inset-0 backface-hidden flex flex-col justify-between"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-full flex justify-between items-start">
            <span className="text-[10px] sm:text-xs font-medium text-pip-text-secondary uppercase tracking-wider truncate">{title}</span>
            <span className="hidden sm:block">{getTrendIcon()}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4 w-full mt-1 sm:mt-2">
            {/* Progress Ring - Mobile (smaller) */}
            <div className="relative w-10 h-10 sm:hidden flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="20" cy="20" r={radiusMobile} className="stroke-white/5 fill-none" strokeWidth="3" />
                <circle
                  cx="20" cy="20" r={radiusMobile}
                  className={`${getRingColor(score)} fill-none transition-all duration-1000 ease-out`}
                  strokeWidth="3"
                  strokeDasharray={circumferenceMobile}
                  strokeDashoffset={offsetMobile}
                  strokeLinecap="round"
                />
              </svg>
              <span className={`absolute text-xs font-bold ${getScoreColor(score)}`}>{score}</span>
            </div>

            {/* Progress Ring - Desktop */}
            <div className="relative w-14 h-14 hidden sm:flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="28" cy="28" r={radiusDesktop} className="stroke-white/5 fill-none" strokeWidth="4" />
                <circle
                  cx="28" cy="28" r={radiusDesktop}
                  className={`${getRingColor(score)} fill-none transition-all duration-1000 ease-out`}
                  strokeWidth="4"
                  strokeDasharray={circumferenceDesktop}
                  strokeDashoffset={offsetDesktop}
                  strokeLinecap="round"
                />
              </svg>
              <span className={`absolute text-sm font-bold ${getScoreColor(score)}`}>{score}</span>
            </div>

            <div className="flex flex-col items-center sm:items-start">
              <span className="text-[10px] sm:text-sm font-medium text-white group-hover:text-pip-accent transition-colors">
                {label || 'Average'}
              </span>
              <span className="text-[8px] sm:text-[10px] text-pip-text-muted hidden sm:block">Last 30s</span>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 backface-hidden flex items-center justify-center p-2 sm:p-3"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="text-center">
            <h4 className="text-xs sm:text-sm font-semibold text-pip-accent mb-2">{title}</h4>
            <p className="text-[9px] sm:text-[10px] text-pip-text-secondary leading-relaxed">
              {explanation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
