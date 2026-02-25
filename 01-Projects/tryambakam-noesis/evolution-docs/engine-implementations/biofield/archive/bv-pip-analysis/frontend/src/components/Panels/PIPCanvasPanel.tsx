import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GlassCard } from '../Cards/GlassCard';
import { Camera, Pause, Play, Layers, User, Users } from 'lucide-react';
import { PIPShader, type AnalysisRegion, type PIPShaderHandle } from '../PIPCanvas/PIPShader';

interface PIPCanvasPanelProps {
  onCapture?: (imageUrl: string | null) => void;
  onMetricsUpdate?: (metrics: {
    brightness: number;
    colorEntropy: number;
    horizontalSymmetry?: number;
    verticalSymmetry?: number;
    saturationMean?: number;
  }) => void;
}

export const PIPCanvasPanel: React.FC<PIPCanvasPanelProps> = ({ onCapture, onMetricsUpdate }) => {
  const [isLive, setIsLive] = useState(true);
  const [fps, setFps] = useState(30);
  const [analysisRegion, setAnalysisRegion] = useState<AnalysisRegion>('full');
  const [showOverlay, setShowOverlay] = useState(true);
  const pipShaderRef = useRef<PIPShaderHandle>(null);

  const handleCapture = useCallback(() => {
    const imageUrl = pipShaderRef.current?.captureImage() ?? null;
    console.log('Capture called, imageUrl:', imageUrl ? `${imageUrl.substring(0, 50)}...` : 'null');
    onCapture?.(imageUrl);
  }, [onCapture]);

  // Get display mode label
  const getModeLabel = (region: AnalysisRegion): string => {
    switch (region) {
      case 'face': return 'FACE';
      case 'body': return 'BODY';
      default: return 'FULL';
    }
  };

  // FPS counter
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const countFps = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }
      if (isLive) {
        requestAnimationFrame(countFps);
      }
    };
    
    if (isLive) {
      requestAnimationFrame(countFps);
    }
    
    return () => { frameCount = 0; };
  }, [isLive]);

  const handleFrameData = useCallback((data: {
    brightness: number;
    colorEntropy: number;
    horizontalSymmetry?: number;
    verticalSymmetry?: number;
    saturationMean?: number;
  }) => {
    onMetricsUpdate?.(data);
  }, [onMetricsUpdate]);

  return (
    <GlassCard className="lg:col-span-7 xl:col-span-8 flex flex-col min-h-[280px] sm:min-h-[360px] lg:h-full relative overflow-hidden group">
      {/* Canvas Area - maintains 4:3 aspect ratio */}
      <div className="flex-1 bg-black rounded-lg sm:rounded-xl relative overflow-hidden border border-white/5" style={{ aspectRatio: '4/3' }}>
        {/* Live PIP Shader Feed */}
        {isLive ? (
          <PIPShader
            ref={pipShaderRef}
            className="w-full h-full"
            analysisRegion={analysisRegion}
            onFrameData={handleFrameData}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-pip-text-muted">
            <div className="text-center">
              <Pause className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-4 opacity-50" />
              <p className="text-xs sm:text-base">Paused</p>
            </div>
          </div>
        )}
        
        {/* Overlays */}
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex flex-wrap gap-1 sm:gap-2 z-10">
          <div className={`backdrop-blur-md px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[8px] sm:text-[10px] font-mono border ${isLive ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-black/50 text-pip-text-secondary border-white/10'}`}>
            FPS: {fps}
          </div>
          <div className="bg-black/50 backdrop-blur-md px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[8px] sm:text-[10px] font-mono text-pip-text-secondary border border-white/10 hidden xs:block">
            640x480
          </div>
          <div className="bg-pip-accent/20 backdrop-blur-md px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[8px] sm:text-[10px] font-bold text-pip-accent border border-pip-accent/30">
            {getModeLabel(analysisRegion)}
          </div>
        </div>

        {/* Legend - hidden on very small screens */}
        {showOverlay && (
          <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 hidden sm:flex flex-col gap-1 bg-black/40 backdrop-blur-md p-1.5 sm:p-2 rounded-lg border border-white/5 z-10">
              <div className="flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[10px] text-pip-text-secondary">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500"></div> Body
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[10px] text-pip-text-secondary">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-500"></div> Proximal
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[10px] text-pip-text-secondary">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-orange-500"></div> Distal
              </div>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="h-12 sm:h-16 mt-2 sm:mt-4 flex items-center justify-between px-1 sm:px-2">
         <div className="flex items-center gap-1.5 sm:gap-3">
            <button
                onClick={handleCapture}
                className="glass-button px-2 sm:px-4 py-1.5 sm:py-2 hover:bg-pip-accent/20 hover:border-pip-accent/50 text-white"
            >
                <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-medium hidden xs:inline">Capture</span>
            </button>
            <button 
                onClick={() => setIsLive(!isLive)}
                className={`glass-button px-2 sm:px-4 py-1.5 sm:py-2 ${!isLive ? 'bg-pip-accent/20 border-pip-accent/50' : ''}`}
            >
                {isLive ? (
                  <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
                <span className="text-xs sm:text-sm font-medium hidden xs:inline">
                  {isLive ? 'Pause' : 'Resume'}
                </span>
            </button>
         </div>

         <div className="flex items-center gap-1.5 sm:gap-3">
             {/* Region Toggle Switch */}
             <div className="flex items-center bg-black/30 backdrop-blur-md rounded-lg border border-white/10 p-0.5">
               <button
                 onClick={() => setAnalysisRegion('full')}
                 className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-[10px] sm:text-xs font-medium transition-all ${
                   analysisRegion === 'full'
                     ? 'bg-pip-accent text-white shadow-lg'
                     : 'text-pip-text-secondary hover:text-white'
                 }`}
               >
                 Full
               </button>
               <button
                 onClick={() => setAnalysisRegion('face')}
                 className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-[10px] sm:text-xs font-medium transition-all flex items-center gap-1 ${
                   analysisRegion === 'face'
                     ? 'bg-pip-accent text-white shadow-lg'
                     : 'text-pip-text-secondary hover:text-white'
                 }`}
               >
                 <User className="w-3 h-3" />
                 <span className="hidden sm:inline">Face</span>
               </button>
               <button
                 onClick={() => setAnalysisRegion('body')}
                 className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-[10px] sm:text-xs font-medium transition-all flex items-center gap-1 ${
                   analysisRegion === 'body'
                     ? 'bg-pip-accent text-white shadow-lg'
                     : 'text-pip-text-secondary hover:text-white'
                 }`}
               >
                 <Users className="w-3 h-3" />
                 <span className="hidden sm:inline">Body</span>
               </button>
             </div>
             <button 
                 onClick={() => setShowOverlay(!showOverlay)}
                 className={`glass-button px-2 sm:px-3 py-1.5 sm:py-2 ${showOverlay ? 'bg-pip-accent/20 border-pip-accent/50' : ''}`}
             >
                 <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
                 <span className="text-xs sm:text-sm hidden sm:inline">Overlay</span>
             </button>
         </div>
      </div>
    </GlassCard>
  );
};
