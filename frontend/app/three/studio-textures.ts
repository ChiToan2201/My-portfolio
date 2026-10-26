import * as THREE from 'three';

export interface StudioTextureBundle {
  primaryScreen: THREE.CanvasTexture;
  verticalScreen: THREE.CanvasTexture;
  contactShadow: THREE.CanvasTexture;
  floorGrid: THREE.CanvasTexture;
  towerBadges: THREE.CanvasTexture[];
  disposeAll: () => void;
}

function createPrimaryScreenCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Crisp matte light architectural UI screen (Zero AI gradients)
  ctx.fillStyle = '#F6F5F1';
  ctx.fillRect(0, 0, 1024, 512);

  // Top Header Bar
  ctx.fillStyle = '#141517';
  ctx.fillRect(0, 0, 1024, 54);

  ctx.fillStyle = '#D9381E';
  ctx.fillRect(28, 19, 16, 16);

  ctx.fillStyle = '#F6F5F1';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('DANH NGUYEN CHI TOAN  ·  COMPONENT ARCHITECTURE', 58, 34);

  ctx.fillStyle = '#A1A1AA';
  ctx.font = '16px monospace';
  ctx.fillText('TS STRICT · ONPUSH', 815, 33);

  // Left Sidebar - Component Tree
  ctx.fillStyle = '#ECEAE4';
  ctx.fillRect(28, 78, 270, 406);
  ctx.strokeStyle = '#D4D1C7';
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 78, 270, 406);

  ctx.fillStyle = '#141517';
  ctx.font = 'bold 17px sans-serif';
  ctx.fillText('REUSABLE UI TREE', 48, 112);

  const treeNodes = [
    'AppShell (Standalone)',
    '├─ TopNavHeader',
    '├─ ThreeStudioStage',
    '├─ SkillFilterMatrix',
    '├─ ProjectBentoGrid',
    '├─ CaseStudyDialog',
    '└─ ExpressApiInspector',
  ];
  ctx.font = '15px monospace';
  let y = 150;
  for (const node of treeNodes) {
    ctx.fillStyle = node.includes('ThreeStudioStage') ? '#D9381E' : '#27272A';
    ctx.fillText(node, 48, y);
    y += 38;
  }

  // Main Workspace Area - Unidirectional Data Flow Diagram
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(322, 78, 674, 248);
  ctx.strokeStyle = '#D4D1C7';
  ctx.strokeRect(322, 78, 674, 248);

  ctx.fillStyle = '#141517';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('UNIDIRECTIONAL STATE & REACTIVE STREAM', 348, 114);

  const boxes = [
    {x: 348, title: 'UI VIEW', sub: 'Angular · React', accent: '#141517'},
    {x: 556, title: 'STATE STORE', sub: 'RxJS · NgRx', accent: '#D9381E'},
    {x: 764, title: 'REST CLIENT', sub: 'TypeScript DTO', accent: '#141517'},
  ];

  for (const box of boxes) {
    ctx.fillStyle = '#F6F5F1';
    ctx.fillRect(box.x, 142, 184, 112);
    ctx.strokeStyle = box.accent;
    ctx.lineWidth = 3;
    ctx.strokeRect(box.x, 142, 184, 112);

    ctx.fillStyle = box.accent;
    ctx.fillRect(box.x, 142, 184, 28);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(box.title, box.x + 14, 161);

    ctx.fillStyle = '#141517';
    ctx.font = 'bold 17px sans-serif';
    ctx.fillText(box.sub, box.x + 14, 206);

    ctx.fillStyle = '#52525B';
    ctx.font = '13px monospace';
    ctx.fillText('immutable · typed', box.x + 14, 234);
  }

  // Arrows between state boxes
  ctx.strokeStyle = '#D9381E';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(532, 198);
  ctx.lineTo(556, 198);
  ctx.moveTo(740, 198);
  ctx.lineTo(764, 198);
  ctx.stroke();

  // Bottom Metrics Strip
  ctx.fillStyle = '#141517';
  ctx.fillRect(322, 348, 674, 136);

  const stats = [
    {x: 350, k: 'FPT POLYTECHNIC', v: 'IT Foundation'},
    {x: 575, k: 'STYLING ENGINE', v: 'Tailwind CSS v4'},
    {x: 800, k: 'SOURCE CONTROL', v: 'Git · GitHub'},
  ];

  for (const st of stats) {
    ctx.fillStyle = '#D9381E';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(st.k, st.x, 392);

    ctx.fillStyle = '#F6F5F1';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(st.v, st.x, 432);
  }

  return canvas;
}

function createVerticalApiCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 896;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.fillStyle = '#141517';
  ctx.fillRect(0, 0, 512, 896);

  // Header
  ctx.fillStyle = '#D9381E';
  ctx.fillRect(0, 0, 512, 64);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 20px monospace';
  ctx.fillText('EXPRESS.JS BACKEND · REST API', 28, 40);

  const routes = [
    {method: 'GET', path: '/api/profile', status: '200 OK'},
    {method: 'GET', path: '/api/skills', status: '200 OK'},
    {method: 'GET', path: '/api/projects', status: '200 OK'},
    {method: 'GET', path: '/api/architecture', status: '200 OK'},
    {method: 'POST', path: '/api/contact', status: '201 CREATED'},
  ];

  let y = 116;
  for (const r of routes) {
    ctx.fillStyle = '#1E2024';
    ctx.fillRect(28, y, 456, 84);
    ctx.strokeStyle = '#2E3238';
    ctx.lineWidth = 2;
    ctx.strokeRect(28, y, 456, 84);

    ctx.fillStyle = r.method === 'POST' ? '#D9381E' : '#F6F5F1';
    ctx.font = 'bold 17px monospace';
    ctx.fillText(r.method, 48, y + 36);

    ctx.fillStyle = '#E4E4E7';
    ctx.font = '18px monospace';
    ctx.fillText(r.path, 118, y + 36);

    ctx.fillStyle = '#A1A1AA';
    ctx.font = '14px monospace';
    ctx.fillText(`HTTP ${r.status} · JSON`, 48, y + 66);

    y += 102;
  }

  // MongoDB Schema block
  ctx.fillStyle = '#1E2024';
  ctx.fillRect(28, 644, 456, 216);
  ctx.strokeStyle = '#D9381E';
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 644, 456, 216);

  ctx.fillStyle = '#D9381E';
  ctx.font = 'bold 16px monospace';
  ctx.fillText('MONGODB DOCUMENT STORE', 48, 682);

  const schemaLines = [
    '{',
    '  collection: "projects",',
    '  backend: "/backend/server.ts",',
    '  frontend: "/frontend/app/app.ts",',
    '  separatedArchitecture: true',
    '}',
  ];
  ctx.fillStyle = '#F6F5F1';
  ctx.font = '16px monospace';
  let sy = 718;
  for (const line of schemaLines) {
    ctx.fillText(line, 48, sy);
    sy += 24;
  }

  return canvas;
}

function createTowerBadgeCanvas(
  code: string,
  title: string,
  accentHex: string,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.fillStyle = '#F6F5F1';
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = '#141517';
  ctx.lineWidth = 10;
  ctx.strokeRect(24, 24, 464, 464);

  ctx.fillStyle = accentHex;
  ctx.fillRect(48, 48, 92, 48);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 26px monospace';
  ctx.fillText(code, 68, 82);

  ctx.fillStyle = '#141517';
  ctx.font = 'bold 34px sans-serif';
  ctx.fillText(title, 48, 270);

  ctx.fillStyle = '#52525B';
  ctx.font = '22px monospace';
  ctx.fillText('MODULAR ARCHITECTURE LAYER', 48, 322);

  return canvas;
}

function createContactShadowCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 124);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
  grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.24)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  return canvas;
}

function createFloorGridCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.fillStyle = '#16181B';
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = '#23262B';
  ctx.lineWidth = 2;

  for (let i = 0; i <= 512; i += 64) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }

  // Subtle architectural crosshairs at intersections
  ctx.strokeStyle = '#343840';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(248, 256);
  ctx.lineTo(264, 256);
  ctx.moveTo(256, 248);
  ctx.lineTo(256, 264);
  ctx.stroke();

  return canvas;
}

export function buildStudioTextures(maxAnisotropy: number): StudioTextureBundle {
  const primaryScreen = new THREE.CanvasTexture(createPrimaryScreenCanvas());
  primaryScreen.colorSpace = THREE.SRGBColorSpace;
  primaryScreen.anisotropy = maxAnisotropy;

  const verticalScreen = new THREE.CanvasTexture(createVerticalApiCanvas());
  verticalScreen.colorSpace = THREE.SRGBColorSpace;
  verticalScreen.anisotropy = maxAnisotropy;

  const contactShadow = new THREE.CanvasTexture(createContactShadowCanvas());
  // Data/alpha shadow map stays in linear NoColorSpace

  const floorGrid = new THREE.CanvasTexture(createFloorGridCanvas());
  floorGrid.colorSpace = THREE.SRGBColorSpace;
  floorGrid.wrapS = THREE.RepeatWrapping;
  floorGrid.wrapT = THREE.RepeatWrapping;
  floorGrid.repeat.set(18, 18);
  floorGrid.anisotropy = maxAnisotropy;

  const towerSpecs = [
    {code: 'L4', title: 'UI COMPONENTS', accent: '#141517'},
    {code: 'L3', title: 'RXJS · NGRX', accent: '#D9381E'},
    {code: 'L2', title: 'EXPRESS REST', accent: '#141517'},
    {code: 'L1', title: 'MONGODB DATA', accent: '#52525B'},
  ];

  const towerBadges = towerSpecs.map((spec) => {
    const tex = new THREE.CanvasTexture(
      createTowerBadgeCanvas(spec.code, spec.title, spec.accent),
    );
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = maxAnisotropy;
    return tex;
  });

  return {
    primaryScreen,
    verticalScreen,
    contactShadow,
    floorGrid,
    towerBadges,
    disposeAll: () => {
      primaryScreen.dispose();
      verticalScreen.dispose();
      contactShadow.dispose();
      floorGrid.dispose();
      for (const tex of towerBadges) {
        tex.dispose();
      }
    },
  };
}
