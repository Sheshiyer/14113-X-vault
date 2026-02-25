import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import * as THREE from 'three';

const customStyles = {
  root: {
    '--bg-void': '#050505',
    '--bg-panel': '#0a0a0a',
    '--fg-primary': '#ffffff',
    '--fg-secondary': '#666666',
    '--fg-tertiary': '#333333',
    '--border-color': 'rgba(255, 255, 255, 0.15)',
    '--accent-error': '#ff3b3b',
    '--accent-active': '#00ff41',
    '--font-display': "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    '--font-mono': "'JetBrains Mono', 'Fira Code', monospace"
  },
  body: {
    backgroundColor: 'var(--bg-void)',
    color: 'var(--fg-primary)',
    fontFamily: 'var(--font-display)',
    overflow: 'hidden',
    WebkitFontSmoothing: 'antialiased',
    width: '1200px',
    height: '800px',
    borderRadius: '8px',
    margin: 0,
    padding: 0
  }
};

const ErrorPage = () => {
  const canvasContainerRef = useRef(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const container = canvasContainerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(15, 0);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff3b3b,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const pCount = 100;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) pPos[i] = (Math.random() - 0.5) * 60;
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0xff3b3b, size: 0.5 });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    let animationId;
    function animate() {
      animationId = requestAnimationFrame(animate);
      mesh.rotation.y += 0.002;
      mesh.rotation.x += 0.01;

      if (Math.random() > 0.95) {
        mesh.scale.set(1.1, 0.9, 1.1);
        material.opacity = 0.8;
      } else {
        mesh.scale.set(1, 1, 1);
        material.opacity = 0.2 + Math.random() * 0.2;
      }

      points.rotation.y -= 0.01;
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      pGeo.dispose();
      pMat.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.3; }
        100% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleReport = () => {
    console.log('Report issue clicked');
  };

  return (
    <div style={customStyles.root}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '60% 40%',
        height: '100%',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid var(--border-color)',
          position: 'relative',
          background: 'linear-gradient(180deg, rgba(255, 59, 59, 0.03) 0%, transparent 100%)'
        }}>
          <header style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            borderBottom: '1px solid var(--border-color)',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            height: '60px',
            alignItems: 'center'
          }}>
            <div style={{
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '100%',
              borderRight: '1px solid var(--border-color)',
              color: 'var(--fg-secondary)'
            }}>
              <span>FORMA OS</span>
              <span style={{
                width: '6px',
                height: '6px',
                background: 'var(--accent-error)',
                borderRadius: '50%',
                boxShadow: '0 0 10px var(--accent-error)',
                animation: 'pulse 1s infinite'
              }}></span>
            </div>
            <div style={{
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '100%',
              borderRight: '1px solid var(--border-color)',
              color: 'var(--fg-secondary)'
            }}>
              <span>SYS.CRITICAL</span>
            </div>
            <div style={{
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--fg-secondary)'
            }}>
              <span>DIAGNOSTICS</span>
            </div>
          </header>

          <section style={{
            padding: '60px 4vw',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-error)',
              fontSize: '12px',
              marginBottom: '24px',
              display: 'block'
            }}>EXCEPTION_CORE_DUMP: 0x000F291</span>
            <h1 style={{
              fontSize: '80px',
              lineHeight: '0.9',
              letterSpacing: '-0.04em',
              fontWeight: '400',
              marginBottom: '30px',
              textTransform: 'uppercase',
              color: 'var(--accent-error)'
            }}>
              Rendering<br />Failed
            </h1>

            <div style={{
              flexGrow: 1,
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-color)',
              padding: '20px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--fg-secondary)',
              overflowY: 'auto',
              marginBottom: '40px'
            }}>
              <div style={{ marginBottom: '4px', display: 'flex', gap: '15px' }}>
                <span style={{ color: 'var(--fg-tertiary)', minWidth: '80px' }}>[14:02:11]</span>
                <span>Initializing GPU Buffer...</span>
              </div>
              <div style={{ marginBottom: '4px', display: 'flex', gap: '15px' }}>
                <span style={{ color: 'var(--fg-tertiary)', minWidth: '80px' }}>[14:02:11]</span>
                <span>Allocating 4.2GB VRAM...</span>
              </div>
              <div style={{ marginBottom: '4px', display: 'flex', gap: '15px' }}>
                <span style={{ color: 'var(--fg-tertiary)', minWidth: '80px' }}>[14:02:12]</span>
                <span style={{ color: 'var(--accent-error)' }}>CRITICAL: Shader compilation failed at row 452</span>
              </div>
              <div style={{ marginBottom: '4px', display: 'flex', gap: '15px' }}>
                <span style={{ color: 'var(--fg-tertiary)', minWidth: '80px' }}>[14:02:12]</span>
                <span style={{ color: 'var(--accent-error)' }}>ERROR: Buffer overflow in topology_engine.so</span>
              </div>
              <div style={{ marginBottom: '4px', display: 'flex', gap: '15px' }}>
                <span style={{ color: 'var(--fg-tertiary)', minWidth: '80px' }}>[14:02:12]</span>
                <span>Terminating child processes [PID: 4421, 4429]</span>
              </div>
              <div style={{ marginBottom: '4px', display: 'flex', gap: '15px' }}>
                <span style={{ color: 'var(--fg-tertiary)', minWidth: '80px' }}>[14:02:13]</span>
                <span>Attempting memory scrub...</span>
              </div>
              <div style={{ marginBottom: '4px', display: 'flex', gap: '15px' }}>
                <span style={{ color: 'var(--fg-tertiary)', minWidth: '80px' }}>[14:02:13]</span>
                <span style={{ color: 'var(--accent-error)' }}>FATAL: Kernel panic. Interface suspended.</span>
              </div>
              <div style={{ marginBottom: '4px', display: 'flex', gap: '15px' }}>
                <span style={{ color: 'var(--fg-tertiary)', minWidth: '80px' }}>[14:02:13]</span>
                <span>_</span>
              </div>
              {retryCount > 0 && (
                <div style={{ marginBottom: '4px', display: 'flex', gap: '15px' }}>
                  <span style={{ color: 'var(--fg-tertiary)', minWidth: '80px' }}>[14:02:14]</span>
                  <span style={{ color: 'var(--accent-active)' }}>Retry attempt #{retryCount} initiated...</span>
                </div>
              )}
            </div>
          </section>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            borderTop: '1px solid var(--border-color)'
          }}>
            <div style={{
              padding: '20px 24px',
              borderRight: '1px solid var(--border-color)',
              fontFamily: 'var(--font-mono)'
            }}>
              <span style={{
                fontSize: '10px',
                color: 'var(--fg-secondary)',
                textTransform: 'uppercase',
                marginBottom: '8px',
                display: 'block'
              }}>Process ID</span>
              <span style={{ fontSize: '14px', color: 'var(--fg-primary)' }}>#8821-X</span>
            </div>
            <div style={{
              padding: '20px 24px',
              borderRight: '1px solid var(--border-color)',
              fontFamily: 'var(--font-mono)'
            }}>
              <span style={{
                fontSize: '10px',
                color: 'var(--fg-secondary)',
                textTransform: 'uppercase',
                marginBottom: '8px',
                display: 'block'
              }}>Uptime</span>
              <span style={{ fontSize: '14px', color: 'var(--fg-primary)' }}>00:04:12:09</span>
            </div>
            <div style={{
              padding: '20px 24px',
              fontFamily: 'var(--font-mono)'
            }}>
              <span style={{
                fontSize: '10px',
                color: 'var(--fg-secondary)',
                textTransform: 'uppercase',
                marginBottom: '8px',
                display: 'block'
              }}>Memory</span>
              <span style={{ fontSize: '14px', color: 'var(--fg-primary)' }}>Overflow</span>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            borderTop: '1px solid var(--border-color)'
          }}>
            <div
              onClick={handleRetry}
              style={{
                padding: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                borderRight: '1px solid var(--border-color)',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                fontSize: '14px',
                background: 'var(--accent-error)',
                color: 'white',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#ff5252'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--accent-error)'}
            >
              <span>Retry Pipeline</span>
              <span>⟳</span>
            </div>
            <div
              onClick={handleReport}
              style={{
                padding: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span>Report Issue</span>
              <span>↗</span>
            </div>
          </div>
        </div>

        <div style={{
          position: 'relative',
          background: 'radial-gradient(circle at center, #1a0505 0%, #000 100%)',
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'repeating-linear-gradient(0deg, rgba(255, 59, 59, 0.05), rgba(255, 59, 59, 0.05) 1px, transparent 1px, transparent 4px)',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            zIndex: 5
          }}></div>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAE0lEQVQImWNgYGD4D8SogFEWBAAz9QMBA7nByAAAAABJRU5ErkJggg==)',
            opacity: 0.1,
            mixBlendMode: 'overlay',
            pointerEvents: 'none'
          }}></div>
          <div ref={canvasContainerRef} style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1
          }}></div>
          <div style={{
            position: 'absolute',
            zIndex: 6,
            pointerEvents: 'none',
            width: '100%',
            height: '100%',
            padding: '30px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div style={{
              alignSelf: 'flex-start',
              background: 'var(--accent-error)',
              color: 'white',
              padding: '4px 8px',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 'bold'
            }}>SIGNAL LOST</div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--accent-error)',
              textAlign: 'right'
            }}>
              CORE_TEMP: 98°C<br />
              VOLTAGE: ERR<br />
              PARITY: FAILED
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router basename="/">
      <div style={customStyles.body}>
        <Routes>
          <Route path="/" element={<ErrorPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;