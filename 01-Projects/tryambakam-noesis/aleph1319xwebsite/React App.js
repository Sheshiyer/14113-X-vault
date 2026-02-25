import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

const customStyles = {
  root: {
    '--bg-void': '#050505',
    '--bg-panel': '#0a0a0a',
    '--fg-primary': '#ffffff',
    '--fg-secondary': '#666666',
    '--fg-tertiary': '#333333',
    '--border-color': 'rgba(255, 255, 255, 0.15)',
    '--accent-active': '#00ff41',
    '--font-display': "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    '--font-mono': "'JetBrains Mono', 'Fira Code', monospace"
  },
  body: {
    backgroundColor: 'var(--bg-void)',
    color: 'var(--fg-primary)',
    fontFamily: 'var(--font-display)',
    margin: 0,
    overflowX: 'hidden',
    WebkitFontSmoothing: 'antialiased'
  },
  headerHud: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    borderBottom: '1px solid var(--border-color)',
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    height: '60px',
    alignItems: 'center'
  },
  hudItem: {
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    borderRight: '1px solid var(--border-color)',
    color: 'var(--fg-secondary)'
  },
  hudItemLast: {
    borderRight: 'none'
  },
  statusDot: {
    width: '6px',
    height: '6px',
    background: 'var(--accent-active)',
    borderRadius: '50%',
    boxShadow: '0 0 10px var(--accent-active)'
  },
  galleryContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    minHeight: 'calc(100vh - 60px)'
  },
  projectCard: {
    position: 'relative',
    borderRight: '1px solid var(--border-color)',
    borderBottom: '1px solid var(--border-color)',
    height: '400px',
    overflow: 'hidden',
    cursor: 'crosshair',
    transition: 'background 0.4s ease'
  },
  projectCardHover: {
    background: '#0d0d0d'
  },
  previewArea: {
    height: '70%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  wireframeMesh: {
    width: '140px',
    height: '140px',
    border: '1px solid rgba(255,255,255,0.08)',
    transform: 'rotate(45deg)',
    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    position: 'relative'
  },
  wireframeMeshHover: {
    transform: 'rotate(135deg) scale(1.1)',
    borderColor: 'rgba(255,255,255,0.4)'
  },
  projectInfo: {
    padding: '24px',
    fontFamily: 'var(--font-mono)',
    borderTop: '1px solid var(--border-color)',
    height: '30%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'transform 0.4s ease'
  },
  projectName: {
    fontSize: '14px',
    letterSpacing: '1px',
    textTransform: 'uppercase'
  },
  projectMeta: {
    fontSize: '10px',
    color: 'var(--fg-secondary)',
    display: 'flex',
    justifyContent: 'space-between',
    opacity: '0.5',
    transition: 'opacity 0.3s'
  },
  projectMetaHover: {
    opacity: '1'
  },
  hoverDetails: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'var(--bg-void)',
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    opacity: 0,
    pointerEvents: 'none',
    transition: 'opacity 0.3s ease',
    zIndex: 10
  },
  hoverDetailsVisible: {
    opacity: 0.96,
    pointerEvents: 'auto'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid var(--border-color)',
    padding: '12px 0',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px'
  },
  detailLabel: {
    color: 'var(--fg-secondary)',
    textTransform: 'uppercase'
  },
  detailValue: {
    color: 'var(--fg-primary)'
  },
  scanLines: {
    background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.03), rgba(255,255,255,0.03) 1px, transparent 1px, transparent 4px)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 1
  },
  crosshair: {
    position: 'absolute',
    width: '10px',
    height: '10px',
    pointerEvents: 'none'
  },
  crosshairBefore: {
    content: "''",
    position: 'absolute',
    background: 'var(--fg-tertiary)',
    width: '1px',
    height: '100%',
    left: '50%'
  },
  crosshairAfter: {
    content: "''",
    position: 'absolute',
    background: 'var(--fg-tertiary)',
    width: '100%',
    height: '1px',
    top: '50%'
  },
  chTl: {
    top: '10px',
    left: '10px'
  },
  chBr: {
    bottom: '10px',
    right: '10px'
  }
};

const Crosshair = ({ position }) => {
  const positionStyle = position === 'tl' ? customStyles.chTl : customStyles.chBr;
  return (
    <div style={{ ...customStyles.crosshair, ...positionStyle }}>
      <div style={customStyles.crosshairBefore}></div>
      <div style={customStyles.crosshairAfter}></div>
    </div>
  );
};

const ProjectCard = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardStyle = {
    ...customStyles.projectCard,
    ...(isHovered ? customStyles.projectCardHover : {})
  };

  const meshStyle = {
    ...customStyles.wireframeMesh,
    ...project.meshStyle,
    ...(isHovered ? customStyles.wireframeMeshHover : {})
  };

  const metaStyle = {
    ...customStyles.projectMeta,
    ...(isHovered ? customStyles.projectMetaHover : {})
  };

  const detailsStyle = {
    ...customStyles.hoverDetails,
    ...(isHovered ? customStyles.hoverDetailsVisible : {})
  };

  return (
    <div 
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={customStyles.scanLines}></div>
      {project.showCrosshair && <Crosshair position={project.crosshairPosition} />}
      <div style={customStyles.previewArea}>
        <div style={meshStyle}>
          {project.innerMesh && (
            <div style={{
              position: 'absolute',
              top: '20%',
              left: '20%',
              width: '60%',
              height: '60%',
              border: '1px solid rgba(255,255,255,0.2)'
            }}></div>
          )}
        </div>
      </div>
      <div style={detailsStyle}>
        <div style={customStyles.detailRow}>
          <span style={customStyles.detailLabel}>Object ID</span>
          <span style={customStyles.detailValue}>{project.objectId}</span>
        </div>
        <div style={customStyles.detailRow}>
          <span style={customStyles.detailLabel}>Polygons</span>
          <span style={customStyles.detailValue}>{project.polygons}</span>
        </div>
        <div style={customStyles.detailRow}>
          <span style={customStyles.detailLabel}>Export</span>
          <span style={customStyles.detailValue}>{project.exportFormat}</span>
        </div>
        <div style={customStyles.detailRow}>
          <span style={customStyles.detailLabel}>Timestamp</span>
          <span style={customStyles.detailValue}>{project.timestamp}</span>
        </div>
      </div>
      <div style={customStyles.projectInfo}>
        <div style={customStyles.projectName}>{project.name}</div>
        <div style={metaStyle}>
          <span>{project.id}</span>
          <span>{project.status}</span>
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  const navigate = useNavigate();

  return (
    <header style={customStyles.headerHud}>
      <div style={customStyles.hudItem}>
        <span>FORMA // ARCHIVE</span>
        <span style={customStyles.statusDot}></span>
      </div>
      <div style={{ ...customStyles.hudItem }}>
        <span>DATABASE: LOCAL_CORE</span>
      </div>
      <div style={{ ...customStyles.hudItem, ...customStyles.hudItemLast, justifyContent: 'flex-end' }}>
        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>BACK TO ENGINE [-]</span>
      </div>
    </header>
  );
};

const GalleryPage = () => {
  const projects = [
    {
      id: '01',
      name: 'Neural_Core_V1',
      status: 'ACTIVE GEOMETRY',
      objectId: '#992-ALPHA',
      polygons: '1,240,400',
      exportFormat: 'GLTF 2.0',
      timestamp: '2024.05.12',
      meshStyle: { borderRadius: '50%' },
      showCrosshair: true,
      crosshairPosition: 'tl',
      innerMesh: false
    },
    {
      id: '02',
      name: 'Prism_Refraction',
      status: 'BOOLEAN STATE',
      objectId: '#412-DELTA',
      polygons: '842,000',
      exportFormat: 'USDZ',
      timestamp: '2024.05.10',
      meshStyle: { 
        transform: 'rotate(0deg)', 
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' 
      },
      showCrosshair: false,
      innerMesh: false
    },
    {
      id: '03',
      name: 'Void_Expanse_Grid',
      status: 'HI-RES MESH',
      objectId: '#118-OMEGA',
      polygons: '4,102,900',
      exportFormat: 'OBJ / MTL',
      timestamp: '2024.05.08',
      meshStyle: {},
      showCrosshair: true,
      crosshairPosition: 'br',
      innerMesh: true
    },
    {
      id: '04',
      name: 'Proto_Structure_04',
      status: 'LOW POLY BASE',
      objectId: '#004-BETA',
      polygons: '210,500',
      exportFormat: 'STL',
      timestamp: '2024.05.01',
      meshStyle: { transform: 'rotate(25deg)', borderStyle: 'dashed' },
      showCrosshair: false,
      innerMesh: false
    },
    {
      id: '05',
      name: 'Dense_Cloud_Cluster',
      status: 'NEURAL OPTIMIZED',
      objectId: '#555-SIGMA',
      polygons: '12,500,000',
      exportFormat: 'GLTF 2.0',
      timestamp: '2024.04.28',
      meshStyle: { width: '20px', boxShadow: '0 0 20px rgba(255,255,255,0.1)' },
      showCrosshair: false,
      innerMesh: false
    },
    {
      id: '06',
      name: 'Solid_Shell_Frame',
      status: 'STATIC RENDER',
      objectId: '#221-ZETA',
      polygons: '540,000',
      exportFormat: 'USDZ',
      timestamp: '2024.04.22',
      meshStyle: { borderWidth: '3px', opacity: '0.4' },
      showCrosshair: true,
      crosshairPosition: 'tl',
      innerMesh: false
    }
  ];

  return (
    <div style={customStyles.body}>
      <Header />
      <div style={customStyles.galleryContainer}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

const App = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      body {
        margin: 0;
        padding: 0;
      }
      * {
        box-sizing: border-box;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <Router basename="/">
      <div style={customStyles.root}>
        <Routes>
          <Route path="/" element={<GalleryPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;