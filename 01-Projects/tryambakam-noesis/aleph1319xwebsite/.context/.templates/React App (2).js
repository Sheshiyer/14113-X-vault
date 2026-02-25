import React, { useState, useRef, useEffect } from 'react';

const App = () => {
  const [buttonBackground, setButtonBackground] = useState('#000');
  const buttonRef = useRef(null);

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      :root {
        --bg-void: #050505;
        --bg-panel: #0a0a0a;
        --fg-primary: #ffffff;
        --fg-secondary: #666666;
        --fg-tertiary: #333333;
        --border-color: rgba(255, 255, 255, 0.15);
        --accent-glow: rgba(0, 255, 65, 0.4);
        --accent-solid: #00ff41;
        --font-display: 'Inter', sans-serif;
        --font-mono: 'JetBrains Mono', monospace;
      }

      body {
        background-color: var(--bg-void);
        color: var(--fg-primary);
        font-family: var(--font-display);
        margin: 0;
        -webkit-font-smoothing: antialiased;
      }

      .cta-surface {
        width: 1200px;
        height: 800px;
        background: var(--bg-void);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        display: grid;
        grid-template-rows: 1fr auto;
        position: relative;
        overflow: hidden;
      }

      .scanlines-global {
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
          0deg,
          rgba(0, 0, 0, 0) 0px,
          rgba(0, 0, 0, 0.1) 1px,
          transparent 2px
        );
        pointer-events: none;
        z-index: 10;
      }

      .cta-content-top {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 80px;
        border-bottom: 1px solid var(--border-color);
      }

      .cta-label {
        font-family: var(--font-mono);
        color: var(--fg-secondary);
        font-size: 12px;
        letter-spacing: 2px;
        text-transform: uppercase;
        margin-bottom: 16px;
      }

      .cta-headline {
        font-size: 72px;
        line-height: 0.9;
        font-weight: 400;
        text-transform: uppercase;
        letter-spacing: -2px;
        max-width: 600px;
      }

      .interactive-cta-zone {
        padding: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bg-panel);
        position: relative;
      }

      .action-button {
        width: 100%;
        height: 200px;
        border: 1px solid var(--border-color);
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 60px;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        overflow: hidden;
      }

      .action-button:hover {
        border-color: var(--fg-primary);
        box-shadow: 0 0 30px rgba(255, 255, 255, 0.05);
      }

      .btn-scanlines {
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
          0deg,
          rgba(255, 255, 255, 0.03) 0px,
          rgba(255, 255, 255, 0.03) 1px,
          transparent 2px,
          transparent 4px
        );
        opacity: 0.5;
        pointer-events: none;
        z-index: 1;
      }

      .btn-glitch-line {
        position: absolute;
        left: 0;
        width: 100%;
        height: 1px;
        background: var(--fg-primary);
        opacity: 0.2;
        z-index: 2;
        animation: scan-move 4s linear infinite;
      }

      @keyframes scan-move {
        0% { top: 0%; }
        100% { top: 100%; }
      }

      .btn-main-text {
        font-size: 32px;
        font-weight: 500;
        letter-spacing: -0.02em;
        position: relative;
        z-index: 5;
        transition: transform 0.3s ease;
      }

      .action-button:hover .btn-main-text {
        transform: translateX(10px);
      }

      .status-cluster {
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: flex-end;
        position: relative;
        z-index: 5;
      }

      .status-row {
        display: flex;
        align-items: center;
        gap: 12px;
        font-family: var(--font-mono);
        font-size: 10px;
        color: var(--fg-secondary);
      }

      .status-glow-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--accent-solid);
        box-shadow: 0 0 10px var(--accent-glow), 0 0 20px var(--accent-glow);
        animation: pulse-glow 2s infinite ease-in-out;
      }

      @keyframes pulse-glow {
        0%, 100% { opacity: 0.4; box-shadow: 0 0 5px var(--accent-glow); }
        50% { opacity: 1; box-shadow: 0 0 15px var(--accent-glow); }
      }

      .deco-grid {
        position: absolute;
        inset: 0;
        background-image: linear-gradient(var(--border-color) 1px, transparent 1px),
                          linear-gradient(90deg, var(--border-color) 1px, transparent 1px);
        background-size: 40px 40px;
        opacity: 0.05;
        pointer-events: none;
      }

      .crosshair {
        position: absolute;
        width: 20px;
        height: 20px;
        border: 1px solid var(--fg-secondary);
        opacity: 0.3;
      }

      .ch-tl { top: 20px; left: 20px; border-right: 0; border-bottom: 0; }
      .ch-tr { top: 20px; right: 20px; border-left: 0; border-bottom: 0; }
      .ch-bl { bottom: 20px; left: 20px; border-right: 0; border-top: 0; }
      .ch-br { bottom: 20px; right: 20px; border-left: 0; border-top: 0; }
    `;
    document.head.appendChild(styleElement);

    const linkElement = document.createElement('link');
    linkElement.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;700&display=swap';
    linkElement.rel = 'stylesheet';
    document.head.appendChild(linkElement);

    return () => {
      document.head.removeChild(styleElement);
      document.head.removeChild(linkElement);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setButtonBackground(`radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.05) 0%, #000 70%)`);
    }
  };

  const handleMouseLeave = () => {
    setButtonBackground('#000');
  };

  const handleButtonClick = () => {
    console.log('Core Engine Initialized');
  };

  return (
    <div className="flex items-center justify-center min-h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-void)' }}>
      <div className="cta-surface">
        <div className="scanlines-global"></div>
        <div className="deco-grid"></div>
        
        <div className="crosshair ch-tl"></div>
        <div className="crosshair ch-tr"></div>
        <div className="crosshair ch-bl"></div>
        <div className="crosshair ch-br"></div>

        <div className="cta-content-top">
          <span className="cta-label">System Ready // Module 04</span>
          <h1 className="cta-headline">
            Execute Mesh<br />Integration
          </h1>
          <p className="mt-6 text-neutral-500 font-mono text-sm max-w-md leading-relaxed">
            Finalize topology processing and export production-ready assets to your workspace. Current pipeline health: OPTIMAL.
          </p>
        </div>

        <div className="interactive-cta-zone">
          <div 
            ref={buttonRef}
            className="action-button"
            style={{ background: buttonBackground }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleButtonClick}
          >
            <div className="btn-scanlines"></div>
            <div className="btn-glitch-line"></div>
            
            <div className="flex items-center gap-6">
              <span className="btn-main-text">INITIALIZE CORE ENGINE</span>
              <span className="text-white/20 font-mono text-xl">01-001</span>
            </div>

            <div className="status-cluster">
              <div className="status-row">
                <span>LIVE LINK</span>
                <div className="status-glow-dot"></div>
              </div>
              <div className="status-row">
                <span>SYNC: 100%</span>
                <div className="status-glow-dot" style={{ animationDelay: '0.5s' }}></div>
              </div>
              <div className="status-row">
                <span>BUFFER: CLR</span>
                <div className="status-glow-dot" style={{ animationDelay: '1.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;