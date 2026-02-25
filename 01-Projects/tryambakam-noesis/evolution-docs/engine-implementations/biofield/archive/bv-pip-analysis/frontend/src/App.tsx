/**
 * PIP Analysis System - Main Application
 */
import { useState, useCallback } from 'react';
import { AppProvider } from './context/AppContext';
import { Shell } from './components/Layout/Shell';
import { PIPCanvasPanel } from './components/Panels/PIPCanvasPanel';
import { MetricsScoresPanel } from './components/Panels/MetricsScoresPanel';
import { DetailedAnalysis, type CapturedAnalysisData } from './pages/DetailedAnalysis';
import { MetricsGuide } from './pages/MetricsGuide';
import { useRealTimeMetrics } from './hooks/useRealTimeMetrics';

type AppView = 'dashboard' | 'analysis' | 'metricsGuide';

function AppContent() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [capturedAnalysis, setCapturedAnalysis] = useState<CapturedAnalysisData | null>(null);

  // Use the real-time metrics hook for actual score computation
  const {
    scores,
    metrics,
    timeline,
    sessionDuration,
    isConnected,
    processFrameData,
  } = useRealTimeMetrics();

  const handleMetricsUpdate = useCallback((data: {
    brightness: number;
    colorEntropy: number;
    horizontalSymmetry?: number;
    verticalSymmetry?: number;
    saturationMean?: number;
  }) => {
    processFrameData(data);
  }, [processFrameData]);

  const handleCapture = useCallback((imageUrl: string | null) => {
    // Capture the current scores, metrics, timeline, and image at the moment of capture
    setCapturedAnalysis({
      timestamp: new Date(),
      scores: { ...scores },
      metrics: { ...metrics },
      timeline: [...timeline],
      sessionDuration,
      imageUrl: imageUrl ?? undefined,
    });
    setCurrentView('analysis');
  }, [scores, metrics, timeline, sessionDuration]);

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setCapturedAnalysis(null);
  };

  const handleShowMetricsGuide = () => {
    setCurrentView('metricsGuide');
  };

  if (currentView === 'metricsGuide') {
    return <MetricsGuide onBack={handleBackToDashboard} />;
  }

  if (currentView === 'analysis' && capturedAnalysis) {
    return (
      <DetailedAnalysis
        onBack={handleBackToDashboard}
        capturedData={capturedAnalysis}
      />
    );
  }

  return (
    <Shell
      timelineData={timeline}
      sessionDuration={sessionDuration}
      isConnected={isConnected}
      onShowMetricsGuide={handleShowMetricsGuide}
    >
      <PIPCanvasPanel onCapture={handleCapture} onMetricsUpdate={handleMetricsUpdate} />
      <MetricsScoresPanel scores={scores} metrics={metrics} isBackendConnected={isConnected} />
    </Shell>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
