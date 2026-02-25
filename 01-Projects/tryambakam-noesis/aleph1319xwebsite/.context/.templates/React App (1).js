import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import * as THREE from 'three';

const customStyles = {
  root: {
    '--bg-void': '#050505',
    '--bg-panel': 'rgba(10, 10, 10, 0.85)',
    '--fg-primary': '#ffffff',
    '--fg-secondary': '#666666',
    '--fg-tertiary': '#333333',
    '--border-color': 'rgba(255, 255, 255, 0.15)',
    '--accent-active': '#00ff41',
    '--font-mono': "'JetBrains Mono', 'Fira Code', monospace",
    '--font-display': "'Inter', sans-serif"
  },
  body: {
    margin: 0,
    padding: 0,
    width: '1200px',
    height: '800px',
    backgroundColor: 'var(--bg-void)',
    color: 'var(--fg-primary)',
    fontFamily: 'var(--font-display)',
    overflow: 'hidden',
    borderRadius: '8px'
  }
};

const ToolButton = ({ active, title, children, onClick }) => (
  <div
    className={`w-10 h-10 flex items-center justify-center cursor-pointer transition-all duration-200 border ${
      active ? 'bg-white bg-opacity-10 border-white' : 'border-transparent hover:bg-white hover:bg-opacity-10'
    }`}
    title={title}
    onClick={onClick}
  >
    {children}
  </div>
);

const Slider = ({ label, value, onChange, min = 0, max = 100 }) => (
  <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
    <div className="flex justify-between font-mono text-[10px] mb-2" style={{ color: 'var(--fg-secondary)' }}>
      <span>{label}</span>
      <span>{(value / 100).toFixed(2)}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      style={{
        width: '100%',
        appearance: 'none',
        height: '1px',
        background: 'var(--fg-tertiary)',
        outline: 'none'
      }}
    />
  </div>
);

const HistoryNode = ({ label, active, onClick, opacity = 1 }) => (
  <div
    className={`w-15 h-6 flex items-center justify-center font-mono text-[8px] cursor-pointer border ${
      active ? 'bg-white text-black' : 'bg-[#333] hover:border-white'
    }`}
    style={{
      borderColor: active ? 'var(--border-color)' : 'var(--border-color)',
      color: active ? 'var(--bg-void)' : 'var(--fg-secondary)',
      opacity
    }}
    onClick={onClick}
  >
    {label}
  </div>
);

const WorkspacePage = () => {
  const [activeTool, setActiveTool] = useState(0);
  const [densityValue, setDensityValue] = useState(75);
  const [biasValue, setBiasValue] = useState(124);
  const [scaleValue, setScaleValue] = useState(42);
  const [activeHistoryNode, setActiveHistoryNode] = useState(3);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const groupRef = useRef(null);
  const pointMatRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const container = canvasRef.current;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.01);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, 1200 / 800, 1, 1000);
    camera.position.set(25, 15, 25);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(1200, 800);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const group = new THREE.Group();
    groupRef.current = group;

    const mainGeo = new THREE.IcosahedronGeometry(10, 2);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });

    const pointMat = new THREE.PointsMaterial({
      color: 0x00ff41,
      size: 0.15,
      transparent: true,
      opacity: 0.8
    });
    pointMatRef.current = pointMat;

    const mainMesh = new THREE.Mesh(mainGeo, wireframeMat);
    const mainPoints = new THREE.Points(mainGeo, pointMat);

    group.add(mainMesh);
    group.add(mainPoints);

    const highlightGeo = new THREE.BoxGeometry(12, 1, 12);
    const highlightMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.05
    });
    const highlight = new THREE.Mesh(highlightGeo, highlightMat);
    group.add(highlight);

    const grid = new THREE.GridHelper(100, 40, 0x111111, 0x111111);
    scene.add(grid);
    scene.add(group);

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      group.rotation.y += 0.002;

      const time = Date.now() * 0.002;
      if (pointMatRef.current) {
        pointMatRef.current.opacity = 0.5 + Math.sin(time) * 0.3;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (groupRef.current) {
      const s = 0.5 + (scaleValue / 100);
      groupRef.current.scale.set(s, s, s);
    }
  }, [scaleValue]);

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      input[type="range"]::-webkit-slider-thumb {
        appearance: none;
        width: 8px;
        height: 8px;
        background: var(--fg-primary);
        cursor: pointer;
      }
      input[type="range"]::-moz-range-thumb {
        width: 8px;
        height: 8px;
        background: var(--fg-primary);
        cursor: pointer;
        border: none;
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col" style={customStyles.body}>
      <header
        className="relative z-10 grid h-[50px] items-center border-b backdrop-blur-[10px]"
        style={{
          gridTemplateColumns: '240px 1fr 240px',
          borderColor: 'var(--border-color)',
          background: 'rgba(0,0,0,0.5)',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}
      >
        <div
          className="px-5 h-full flex items-center border-r"
          style={{ color: 'var(--fg-secondary)', borderColor: 'var(--border-color)' }}
        >
          <span style={{ color: 'white', marginRight: '10px' }}>FORMA</span> SESSION: 0X82F
        </div>
        <div
          className="px-5 h-full flex items-center justify-center border-r"
          style={{ color: 'var(--fg-secondary)', borderColor: 'var(--border-color)' }}
        >
          MODEL_REFINEMENT_BETA_V2
        </div>
        <div
          className="px-5 h-full flex items-center justify-end gap-[15px]"
          style={{ color: 'var(--fg-secondary)' }}
        >
          <span style={{ color: 'var(--accent-active)' }}>● SYNCED</span>
          <span>FPS: 144</span>
        </div>
      </header>

      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 3px)'
        }}
      />

      <div ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-[1]" />

      <div
        className="absolute top-[70px] left-5 w-[50px] flex flex-col gap-1 p-1 z-10 backdrop-blur-[12px] border"
        style={{
          background: 'var(--bg-panel)',
          borderColor: 'var(--border-color)'
        }}
      >
        <ToolButton active={activeTool === 0} title="Transform" onClick={() => setActiveTool(0)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 5l14 14m0-14L5 19" />
          </svg>
        </ToolButton>
        <ToolButton active={activeTool === 1} title="Extrude" onClick={() => setActiveTool(1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="4" y="4" width="16" height="16" rx="2" />
          </svg>
        </ToolButton>
        <ToolButton active={activeTool === 2} title="Subdivide" onClick={() => setActiveTool(2)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 3h18v18H3zM12 3v18M3 12h18" />
          </svg>
        </ToolButton>
        <ToolButton active={activeTool === 3} title="Smooth" onClick={() => setActiveTool(3)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
          </svg>
        </ToolButton>
      </div>

      <div
        className="absolute top-[70px] right-5 w-[260px] z-10 backdrop-blur-[12px] border"
        style={{
          background: 'var(--bg-panel)',
          borderColor: 'var(--border-color)'
        }}
      >
        <div
          className="px-3 py-2 border-b font-mono text-[10px] flex justify-between"
          style={{ borderColor: 'var(--border-color)', color: 'var(--fg-secondary)', textTransform: 'uppercase' }}
        >
          <span>Geometry Settings</span>
          <span>01</span>
        </div>
        <Slider
          label="TOPOLOGY DENSITY"
          value={densityValue}
          onChange={(e) => setDensityValue(Number(e.target.value))}
        />
        <Slider
          label="CURVATURE BIAS"
          value={biasValue}
          onChange={(e) => setBiasValue(Number(e.target.value))}
          max={200}
        />
        <Slider
          label="LATENT SCALE"
          value={scaleValue}
          onChange={(e) => setScaleValue(Number(e.target.value))}
        />
        <div
          className="px-3 py-2 border-t font-mono text-[10px]"
          style={{ borderColor: 'var(--border-color)', color: 'var(--fg-secondary)', textTransform: 'uppercase' }}
        >
          <span>Boolean Ops</span>
        </div>
        <div className="p-4 flex gap-2">
          <button className="flex-1 border border-[#333] py-2 text-[10px] font-mono hover:bg-white hover:text-black transition-colors">
            UNION
          </button>
          <button className="flex-1 border border-[#333] py-2 text-[10px] font-mono hover:bg-white hover:text-black transition-colors">
            DIFF
          </button>
        </div>
      </div>

      <div
        className="absolute bottom-[110px] left-5 font-mono text-[10px] z-[5]"
        style={{ color: 'var(--fg-secondary)' }}
      >
        <span
          className="inline-block px-[6px] py-[2px] font-bold text-[9px] mr-2"
          style={{ background: 'var(--accent-active)', color: 'black' }}
        >
          ACTIVE
        </span>
        ISO: 400 | SHUTTER: 1/60 | LENS: 35MM PRIME
      </div>

      <div
        className="absolute bottom-5 left-5 right-5 h-20 z-10 backdrop-blur-[12px] border flex flex-col"
        style={{
          background: 'var(--bg-panel)',
          borderColor: 'var(--border-color)'
        }}
      >
        <div
          className="px-3 py-2 border-b font-mono text-[10px] flex justify-between"
          style={{ borderColor: 'var(--border-color)', color: 'var(--fg-secondary)', textTransform: 'uppercase' }}
        >
          <span>Non-Destructive History</span>
          <span>T-00:42:11</span>
        </div>
        <div className="flex-grow flex items-center px-5 gap-[2px]">
          <HistoryNode label="PRIMITIVE" active={activeHistoryNode === 0} onClick={() => setActiveHistoryNode(0)} />
          <div style={{ width: '20px', height: '1px', background: 'var(--fg-tertiary)' }} />
          <HistoryNode label="SUBDIV_L1" active={activeHistoryNode === 1} onClick={() => setActiveHistoryNode(1)} />
          <div style={{ width: '20px', height: '1px', background: 'var(--fg-tertiary)' }} />
          <HistoryNode label="EXTRUDE_F" active={activeHistoryNode === 2} onClick={() => setActiveHistoryNode(2)} />
          <div style={{ width: '20px', height: '1px', background: 'var(--fg-tertiary)' }} />
          <HistoryNode label="REFINE_L2" active={activeHistoryNode === 3} onClick={() => setActiveHistoryNode(3)} />
          <div style={{ width: '20px', height: '1px', background: 'var(--fg-tertiary)' }} />
          <HistoryNode label="SMOOTH" active={activeHistoryNode === 4} onClick={() => setActiveHistoryNode(4)} opacity={0.4} />
        </div>
      </div>
    </div>
  );
};

const App = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Router basename="/">
      <div style={customStyles.root}>
        <Routes>
          <Route path="/" element={<WorkspacePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;