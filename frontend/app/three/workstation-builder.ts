import * as THREE from 'three';
import {
  StudioCameraPreset,
  StudioFinishTheme,
} from '../models/portfolio.types';
import {
  StudioTextureBundle,
  buildStudioTextures,
} from './studio-textures';

export interface WorkstationAssembly {
  root: THREE.Group;
  floor: THREE.Mesh;
  hitProxies: THREE.Mesh[];
  applyExplode: (amount: number) => void;
  applyFinishTheme: (theme: StudioFinishTheme) => void;
  dispose: () => void;
}

function createRoundedRectShape(
  width: number,
  height: number,
  radius: number,
): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  const r = Math.min(radius, width / 2, height / 2);

  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + r);
  shape.lineTo(x + width, y + height - r);
  shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  shape.lineTo(x + r, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  return shape;
}

export function createWorkstationAssembly(
  maxAnisotropy: number,
): WorkstationAssembly {
  const textures: StudioTextureBundle = buildStudioTextures(maxAnisotropy);
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    geometries.push(geo);
    return geo;
  };
  const trackMat = <T extends THREE.Material>(mat: T): T => {
    materials.push(mat);
    return mat;
  };

  // Shared calibrated PBR materials (varied roughness >= 0.25 across adjacent surfaces)
  const deskSlabMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xe6e2d8,
      roughness: 0.72,
      metalness: 0.08,
    }),
  );

  const aluminumChassisMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xc8ccd2,
      roughness: 0.26,
      metalness: 0.88,
      anisotropy: 0.65,
      clearcoat: 0.2,
    }),
  );

  const darkMatteMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x1b1d21,
      roughness: 0.84,
      metalness: 0.12,
    }),
  );

  const brassAccentMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xc89d54,
      roughness: 0.18,
      metalness: 0.94,
      anisotropy: 0.7,
    }),
  );

  const vermilionAccentMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xd9381e,
      roughness: 0.38,
      metalness: 0.15,
    }),
  );

  const ceramicMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xf4f2ec,
      roughness: 0.22,
      metalness: 0.04,
      clearcoat: 0.75,
      clearcoatRoughness: 0.12,
    }),
  );

  const contactShadowMat = trackMat(
    new THREE.MeshBasicMaterial({
      map: textures.contactShadow,
      transparent: true,
      opacity: 0.52,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    }),
  );

  const root = new THREE.Group();

  // Studio Architectural Floor (y = 0)
  const floorGeo = trackGeo(new THREE.PlaneGeometry(36, 36));
  const floorMat = trackMat(
    new THREE.MeshStandardMaterial({
      map: textures.floorGrid,
      roughness: 0.88,
      metalness: 0.08,
    }),
  );
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  floor.receiveShadow = true;

  const makeShadowDisc = (
    radiusX: number,
    radiusZ: number,
    x: number,
    y: number,
    z: number,
  ): THREE.Mesh => {
    const plane = new THREE.Mesh(
      trackGeo(new THREE.PlaneGeometry(radiusX * 2, radiusZ * 2)),
      contactShadowMat,
    );
    plane.rotation.x = -Math.PI / 2;
    plane.position.set(x, y, z);
    plane.renderOrder = 1;
    return plane;
  };

  // =========================================================================
  // PART 1: Stepped Machined Studio Plinth (LatheGeometry, grounded at y = 0)
  // =========================================================================
  const plinthPoints = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(3.15, 0),
    new THREE.Vector2(3.15, 0.08),
    new THREE.Vector2(2.96, 0.12),
    new THREE.Vector2(2.96, 0.2),
    new THREE.Vector2(0, 0.2),
  ];
  const plinthGeo = trackGeo(new THREE.LatheGeometry(plinthPoints, 64));
  const plinthMesh = new THREE.Mesh(plinthGeo, darkMatteMat);
  plinthMesh.castShadow = true;
  plinthMesh.receiveShadow = true;
  root.add(plinthMesh);

  // Brass collar trim around plinth step
  const collarGeo = trackGeo(new THREE.TorusGeometry(3.04, 0.018, 12, 72));
  const collarMesh = new THREE.Mesh(collarGeo, brassAccentMat);
  collarMesh.rotation.x = Math.PI / 2;
  collarMesh.position.y = 0.11;
  root.add(collarMesh);

  root.add(makeShadowDisc(3.55, 3.55, 0, 0.004, 0));

  // =========================================================================
  // PART 2: Architectural Desk Platform & Matte Desk Mat (y = 0.20 .. 0.34)
  // =========================================================================
  const deskShape = createRoundedRectShape(4.5, 2.35, 0.18);
  const deskGeo = trackGeo(
    new THREE.ExtrudeGeometry(deskShape, {
      depth: 0.11,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3,
    }),
  );
  deskGeo.rotateX(-Math.PI / 2);
  const deskMesh = new THREE.Mesh(deskGeo, deskSlabMat);
  deskMesh.position.set(0, 0.22, 0);
  deskMesh.castShadow = true;
  deskMesh.receiveShadow = true;
  root.add(deskMesh);

  const deskTopY = 0.35;

  // Matte Desk Pad (offset cleanly above deskTopY so zero coplanar Z-fighting)
  const padShape = createRoundedRectShape(2.45, 1.05, 0.08);
  const padGeo = trackGeo(
    new THREE.ExtrudeGeometry(padShape, {
      depth: 0.014,
      bevelEnabled: true,
      bevelThickness: 0.004,
      bevelSize: 0.004,
      bevelSegments: 2,
    }),
  );
  padGeo.rotateX(-Math.PI / 2);
  const padMesh = new THREE.Mesh(padGeo, darkMatteMat);
  padMesh.position.set(-0.15, deskTopY + 0.004, 0.36);
  padMesh.receiveShadow = true;
  root.add(padMesh);

  // =========================================================================
  // PART 3: Ultrawide Primary Studio Monitor (Component Architecture Display)
  // =========================================================================
  const primaryMonitorGroup = new THREE.Group();
  primaryMonitorGroup.position.set(-0.15, deskTopY, -0.35);
  root.add(primaryMonitorGroup);

  // Stand Base
  const standBaseShape = createRoundedRectShape(0.68, 0.42, 0.05);
  const standBaseGeo = trackGeo(
    new THREE.ExtrudeGeometry(standBaseShape, {
      depth: 0.025,
      bevelEnabled: true,
      bevelThickness: 0.006,
      bevelSize: 0.006,
      bevelSegments: 2,
    }),
  );
  standBaseGeo.rotateX(-Math.PI / 2);
  const standBase = new THREE.Mesh(standBaseGeo, aluminumChassisMat);
  standBase.position.y = 0.006;
  standBase.castShadow = true;
  standBase.receiveShadow = true;
  primaryMonitorGroup.add(standBase);

  primaryMonitorGroup.add(makeShadowDisc(0.5, 0.32, 0, 0.003, 0));

  // Cantilevered Neck
  const neckShape = createRoundedRectShape(0.16, 0.06, 0.015);
  const neckGeo = trackGeo(
    new THREE.ExtrudeGeometry(neckShape, {
      depth: 0.86,
      bevelEnabled: true,
      bevelThickness: 0.006,
      bevelSize: 0.006,
      bevelSegments: 2,
    }),
  );
  neckGeo.rotateX(-Math.PI / 2);
  const neckMesh = new THREE.Mesh(neckGeo, aluminumChassisMat);
  neckMesh.position.set(0, 0.03, -0.08);
  neckMesh.rotation.x = -0.1;
  neckMesh.castShadow = true;
  primaryMonitorGroup.add(neckMesh);

  // Beveled Aluminum Monitor Housing
  const monitorHeadGroup = new THREE.Group();
  monitorHeadGroup.position.set(0, 0.92, 0.02);
  primaryMonitorGroup.add(monitorHeadGroup);

  const monWidth = 2.18;
  const monHeight = 1.12;
  const monHousingShape = createRoundedRectShape(monWidth, monHeight, 0.05);
  const monHousingGeo = trackGeo(
    new THREE.ExtrudeGeometry(monHousingShape, {
      depth: 0.055,
      bevelEnabled: true,
      bevelThickness: 0.014,
      bevelSize: 0.014,
      bevelSegments: 3,
    }),
  );
  const monHousing = new THREE.Mesh(monHousingGeo, aluminumChassisMat);
  monHousing.position.z = -0.04;
  monHousing.castShadow = true;
  monHousing.receiveShadow = true;
  monitorHeadGroup.add(monHousing);

  // Dark Inner Bezel
  const bezelGeo = trackGeo(new THREE.PlaneGeometry(monWidth - 0.05, monHeight - 0.05));
  const bezelMesh = new THREE.Mesh(bezelGeo, darkMatteMat);
  bezelMesh.position.z = 0.031;
  monitorHeadGroup.add(bezelMesh);

  // High-DPI Procedural Screen Plane (Explodable forward!)
  const screenMat = trackMat(
    new THREE.MeshStandardMaterial({
      map: textures.primaryScreen,
      roughness: 0.24,
      metalness: 0.05,
      emissive: new THREE.Color(0xffffff),
      emissiveMap: textures.primaryScreen,
      emissiveIntensity: 0.22,
    }),
  );
  const screenMesh = new THREE.Mesh(
    trackGeo(new THREE.PlaneGeometry(monWidth - 0.12, monHeight - 0.12)),
    screenMat,
  );
  screenMesh.position.z = 0.035;
  monitorHeadGroup.add(screenMesh);

  // Studio Webcam Module on top of monitor
  const camBody = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.18, 0.045, 0.055)),
    darkMatteMat,
  );
  camBody.position.set(0, monHeight / 2 + 0.032, 0.01);
  camBody.castShadow = true;
  monitorHeadGroup.add(camBody);

  const camLens = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.014, 0.014, 0.02, 20)),
    brassAccentMat,
  );
  camLens.rotation.x = Math.PI / 2;
  camLens.position.set(0, monHeight / 2 + 0.032, 0.04);
  monitorHeadGroup.add(camLens);

  // =========================================================================
  // PART 4: Vertical Secondary Monitor (Express.js REST API & MongoDB)
  // =========================================================================
  const secondaryMonitorGroup = new THREE.Group();
  secondaryMonitorGroup.position.set(-1.66, deskTopY, -0.05);
  secondaryMonitorGroup.rotation.y = 0.42;
  root.add(secondaryMonitorGroup);

  const secBase = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.22, 0.24, 0.025, 32)),
    aluminumChassisMat,
  );
  secBase.position.y = 0.013;
  secBase.castShadow = true;
  secondaryMonitorGroup.add(secBase);

  secondaryMonitorGroup.add(makeShadowDisc(0.32, 0.32, 0, 0.003, 0));

  const secPillar = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.032, 0.038, 0.78, 24)),
    aluminumChassisMat,
  );
  secPillar.position.set(0, 0.4, -0.06);
  secPillar.castShadow = true;
  secondaryMonitorGroup.add(secPillar);

  const vMonShape = createRoundedRectShape(0.76, 1.28, 0.04);
  const vMonGeo = trackGeo(
    new THREE.ExtrudeGeometry(vMonShape, {
      depth: 0.045,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelSegments: 2,
    }),
  );
  const vMonHousing = new THREE.Mesh(vMonGeo, aluminumChassisMat);
  vMonHousing.position.set(0, 0.82, -0.02);
  vMonHousing.castShadow = true;
  secondaryMonitorGroup.add(vMonHousing);

  const vScreenMat = trackMat(
    new THREE.MeshStandardMaterial({
      map: textures.verticalScreen,
      roughness: 0.25,
      metalness: 0.06,
      emissive: new THREE.Color(0xffffff),
      emissiveMap: textures.verticalScreen,
      emissiveIntensity: 0.28,
    }),
  );
  const vScreenMesh = new THREE.Mesh(
    trackGeo(new THREE.PlaneGeometry(0.68, 1.2)),
    vScreenMat,
  );
  vScreenMesh.position.set(0, 0.82, 0.038);
  secondaryMonitorGroup.add(vScreenMesh);

  // =========================================================================
  // PART 5: Custom 65% Mechanical Keyboard + 65 Instanced Keycaps + Rotary Knob
  // =========================================================================
  const keyboardGroup = new THREE.Group();
  keyboardGroup.position.set(-0.15, deskTopY + 0.022, 0.42);
  root.add(keyboardGroup);

  const kbCaseShape = createRoundedRectShape(1.12, 0.42, 0.035);
  const kbCaseGeo = trackGeo(
    new THREE.ExtrudeGeometry(kbCaseShape, {
      depth: 0.042,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.008,
      bevelSegments: 2,
    }),
  );
  kbCaseGeo.rotateX(-Math.PI / 2);
  const kbCase = new THREE.Mesh(kbCaseGeo, aluminumChassisMat);
  kbCase.rotation.x = 0.06;
  kbCase.castShadow = true;
  kbCase.receiveShadow = true;
  keyboardGroup.add(kbCase);

  // Internal Brass Switch Plate (revealed when Exploded View slider increases!)
  const switchPlate = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(1.04, 0.008, 0.35)),
    brassAccentMat,
  );
  switchPlate.position.set(0, 0.048, 0);
  switchPlate.rotation.x = 0.06;
  keyboardGroup.add(switchPlate);

  // InstancedMesh of 65 Sculpted Keycaps (>20 repeated items!)
  const keycapGeo = trackGeo(new THREE.BoxGeometry(0.056, 0.024, 0.056));
  const keycapMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.62,
      metalness: 0.05,
    }),
  );
  const rows = 5;
  const cols = 13;
  const totalKeys = rows * cols; // 65 instances
  const keycapsInstanced = new THREE.InstancedMesh(
    keycapGeo,
    keycapMat,
    totalKeys,
  );
  keycapsInstanced.castShadow = true;
  keycapsInstanced.receiveShadow = true;

  const dummy = new THREE.Object3D();
  const cIvory = new THREE.Color(0xf3f0e8);
  const cCharcoal = new THREE.Color(0x2a2d34);
  const cVermilion = new THREE.Color(0xd9381e);

  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Leave top-right corner for the rotary encoder knob
      const isKnobSlot = r === 0 && c === cols - 1;
      const x = -0.45 + c * 0.074;
      const z = -0.135 + r * 0.068;
      dummy.position.set(x, isKnobSlot ? -0.02 : 0.064 - r * 0.003, z);
      dummy.rotation.set(0.06, 0, 0);
      dummy.scale.set(isKnobSlot ? 0.01 : 1, 1, 1);
      dummy.updateMatrix();
      keycapsInstanced.setMatrixAt(idx, dummy.matrix);

      if (r === 0 && c === 0) {
        keycapsInstanced.setColorAt(idx, cVermilion); // ESC key
      } else if (r === 2 && c === cols - 1) {
        keycapsInstanced.setColorAt(idx, cVermilion); // Enter accent
      } else if (c === 0 || c === cols - 1 || r === rows - 1) {
        keycapsInstanced.setColorAt(idx, cCharcoal); // Modifiers
      } else {
        keycapsInstanced.setColorAt(idx, cIvory); // Alphas
      }
      idx++;
    }
  }
  keycapsInstanced.instanceMatrix.needsUpdate = true;
  if (keycapsInstanced.instanceColor) {
    keycapsInstanced.instanceColor.needsUpdate = true;
  }
  keycapsInstanced.computeBoundingSphere();

  const keycapLayerGroup = new THREE.Group();
  keycapLayerGroup.add(keycapsInstanced);
  keyboardGroup.add(keycapLayerGroup);

  // Knurled Brass Rotary Encoder Knob (LatheGeometry) at top-right of keyboard
  const knobPoints = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.028, 0),
    new THREE.Vector2(0.028, 0.032),
    new THREE.Vector2(0.024, 0.036),
    new THREE.Vector2(0, 0.036),
  ];
  const knobMesh = new THREE.Mesh(
    trackGeo(new THREE.LatheGeometry(knobPoints, 28)),
    brassAccentMat,
  );
  knobMesh.position.set(0.438, 0.055, -0.135);
  knobMesh.castShadow = true;
  keyboardGroup.add(knobMesh);

  // =========================================================================
  // PART 6: 4-Tier Explodable Component & Full-Stack Architecture Sculpture
  // =========================================================================
  const towerGroup = new THREE.Group();
  towerGroup.position.set(1.48, deskTopY, 0.05);
  root.add(towerGroup);

  // Tower Base Dock
  const towerBase = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.48, 0.52, 0.05, 40)),
    darkMatteMat,
  );
  towerBase.position.y = 0.025;
  towerBase.castShadow = true;
  towerBase.receiveShadow = true;
  towerGroup.add(towerBase);

  towerGroup.add(makeShadowDisc(0.62, 0.62, 0, 0.003, 0));

  // Precision Brass Guide Pillars
  for (const px of [-0.32, 0.32]) {
    const rod = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.016, 0.016, 1.32, 20)),
      brassAccentMat,
    );
    rod.position.set(px, 0.68, -0.22);
    rod.castShadow = true;
    towerGroup.add(rod);
  }

  // 4 Modular Architecture Plates (L1 MongoDB -> L4 UI Components)
  const plateShape = createRoundedRectShape(0.76, 0.68, 0.06);
  const plateGeo = trackGeo(
    new THREE.ExtrudeGeometry(plateShape, {
      depth: 0.065,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.012,
      bevelSegments: 2,
    }),
  );
  plateGeo.rotateX(-Math.PI / 2);

  const towerPlates: THREE.Group[] = [];
  const basePlateHeights = [0.14, 0.32, 0.5, 0.68];

  for (let i = 0; i < 4; i++) {
    const layerNode = new THREE.Group();
    layerNode.position.y = basePlateHeights[i];

    const plateMat =
      i === 2
        ? vermilionAccentMat
        : i % 2 === 0
          ? aluminumChassisMat
          : deskSlabMat;

    const plateMesh = new THREE.Mesh(plateGeo, plateMat);
    plateMesh.castShadow = true;
    plateMesh.receiveShadow = true;
    layerNode.add(plateMesh);

    // Top Engraved Badge Texture (index 3-i so top is L4 UI Components)
    const badgeTex = textures.towerBadges[3 - i];
    const badgeMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: badgeTex,
        roughness: 0.35,
        metalness: 0.08,
      }),
    );
    const badgePlane = new THREE.Mesh(
      trackGeo(new THREE.PlaneGeometry(0.58, 0.52)),
      badgeMat,
    );
    badgePlane.rotation.x = -Math.PI / 2;
    badgePlane.position.y = 0.079;
    layerNode.add(badgePlane);

    towerGroup.add(layerNode);
    towerPlates.push(layerNode);
  }

  // Curved TubeGeometry Data Bus Conduits linking Tower to Primary Monitor
  const conduitCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(1.12, deskTopY + 0.04, -0.08),
    new THREE.Vector3(0.72, deskTopY + 0.02, -0.26),
    new THREE.Vector3(0.12, deskTopY + 0.04, -0.34),
  ]);
  const conduitMesh = new THREE.Mesh(
    trackGeo(new THREE.TubeGeometry(conduitCurve, 36, 0.016, 12, false)),
    vermilionAccentMat,
  );
  conduitMesh.castShadow = true;
  root.add(conduitMesh);

  // =========================================================================
  // PART 7: Articulated Studio Architect Lamp (LatheGeometry + TubeGeometry)
  // =========================================================================
  const lampGroup = new THREE.Group();
  lampGroup.position.set(1.55, deskTopY, -0.78);
  root.add(lampGroup);

  const lampBasePoints = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.22, 0),
    new THREE.Vector2(0.2, 0.045),
    new THREE.Vector2(0.06, 0.06),
    new THREE.Vector2(0, 0.06),
  ];
  const lampBase = new THREE.Mesh(
    trackGeo(new THREE.LatheGeometry(lampBasePoints, 32)),
    darkMatteMat,
  );
  lampBase.castShadow = true;
  lampGroup.add(lampBase);

  lampGroup.add(makeShadowDisc(0.28, 0.28, 0, 0.003, 0));

  const armCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.05, 0),
    new THREE.Vector3(0.06, 0.72, -0.06),
    new THREE.Vector3(-0.22, 1.28, 0.14),
    new THREE.Vector3(-0.48, 1.34, 0.28),
  ]);
  const lampArm = new THREE.Mesh(
    trackGeo(new THREE.TubeGeometry(armCurve, 40, 0.02, 14, false)),
    brassAccentMat,
  );
  lampArm.castShadow = true;
  lampGroup.add(lampArm);

  const shadePoints = [
    new THREE.Vector2(0.03, 0.24),
    new THREE.Vector2(0.08, 0.22),
    new THREE.Vector2(0.22, 0),
    new THREE.Vector2(0.205, 0),
    new THREE.Vector2(0.07, 0.2),
  ];
  const lampShade = new THREE.Mesh(
    trackGeo(new THREE.LatheGeometry(shadePoints, 36)),
    darkMatteMat,
  );
  lampShade.position.set(-0.52, 1.12, 0.32);
  lampShade.rotation.z = 0.36;
  lampShade.castShadow = true;
  lampGroup.add(lampShade);

  const bulbMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xfff3d6,
      emissive: 0xffd28a,
      emissiveIntensity: 1.6,
      roughness: 0.2,
    }),
  );
  const bulbMesh = new THREE.Mesh(
    trackGeo(new THREE.SphereGeometry(0.055, 16, 16)),
    bulbMat,
  );
  bulbMesh.position.set(-0.48, 1.19, 0.31);
  lampGroup.add(bulbMesh);

  // =========================================================================
  // PART 8: Ceramic Pour-Over Coffee Mug (LatheGeometry + TubeGeometry Handle)
  // =========================================================================
  const mugGroup = new THREE.Group();
  mugGroup.position.set(0.76, deskTopY + 0.018, 0.56);
  root.add(mugGroup);

  const mugPoints = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.095, 0),
    new THREE.Vector2(0.105, 0.21),
    new THREE.Vector2(0.092, 0.21),
    new THREE.Vector2(0.084, 0.02),
    new THREE.Vector2(0, 0.02),
  ];
  const mugVessel = new THREE.Mesh(
    trackGeo(new THREE.LatheGeometry(mugPoints, 32)),
    ceramicMat,
  );
  mugVessel.castShadow = true;
  mugVessel.receiveShadow = true;
  mugGroup.add(mugVessel);

  const handleCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.095, 0.17, 0),
    new THREE.Vector3(0.165, 0.155, 0),
    new THREE.Vector3(0.165, 0.065, 0),
    new THREE.Vector3(0.092, 0.05, 0),
  ]);
  const mugHandle = new THREE.Mesh(
    trackGeo(new THREE.TubeGeometry(handleCurve, 24, 0.014, 10, false)),
    ceramicMat,
  );
  mugHandle.castShadow = true;
  mugGroup.add(mugHandle);

  const coffeeDisc = new THREE.Mesh(
    trackGeo(new THREE.CircleGeometry(0.088, 24)),
    trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x24150e,
        roughness: 0.14,
        metalness: 0.05,
      }),
    ),
  );
  coffeeDisc.rotation.x = -Math.PI / 2;
  coffeeDisc.position.y = 0.175;
  mugGroup.add(coffeeDisc);

  mugGroup.add(makeShadowDisc(0.16, 0.16, 0, 0.002, 0));

  // =========================================================================
  // PART 9: Studio Acoustic Pegboard Backdrop + 36 Instanced Pins
  // =========================================================================
  const pegboardGroup = new THREE.Group();
  pegboardGroup.position.set(-0.15, deskTopY + 0.88, -0.96);
  root.add(pegboardGroup);

  const boardShape = createRoundedRectShape(3.6, 1.35, 0.06);
  const boardGeo = trackGeo(
    new THREE.ExtrudeGeometry(boardShape, {
      depth: 0.035,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.008,
      bevelSegments: 2,
    }),
  );
  const boardMesh = new THREE.Mesh(boardGeo, darkMatteMat);
  boardMesh.receiveShadow = true;
  boardMesh.castShadow = true;
  pegboardGroup.add(boardMesh);

  const pinGeo = trackGeo(new THREE.CylinderGeometry(0.014, 0.014, 0.05, 12));
  pinGeo.rotateX(Math.PI / 2);
  const pinCount = 36;
  const pinsInstanced = new THREE.InstancedMesh(pinGeo, brassAccentMat, pinCount);
  let pIdx = 0;
  for (let pr = 0; pr < 3; pr++) {
    for (let pc = 0; pc < 12; pc++) {
      dummy.position.set(-1.48 + pc * 0.27, -0.42 + pr * 0.42, 0.045);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      pinsInstanced.setMatrixAt(pIdx++, dummy.matrix);
    }
  }
  pinsInstanced.instanceMatrix.needsUpdate = true;
  pinsInstanced.computeBoundingSphere();
  pegboardGroup.add(pinsInstanced);

  // =========================================================================
  // PART 10: Simplified Raycast Proxy Collision Boxes (Dedicated Layer 1)
  // =========================================================================
  const proxyMat = trackMat(new THREE.MeshBasicMaterial({visible: false}));
  const hitProxies: THREE.Mesh[] = [];

  const registerProxy = (
    station: StudioCameraPreset,
    size: [number, number, number],
    pos: [number, number, number],
  ): void => {
    const proxy = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(size[0], size[1], size[2])),
      proxyMat,
    );
    proxy.position.set(pos[0], pos[1], pos[2]);
    proxy.layers.set(1);
    proxy.userData['station'] = station;
    root.add(proxy);
    hitProxies.push(proxy);
  };

  registerProxy('frontend', [2.25, 1.25, 0.35], [-0.15, deskTopY + 0.92, -0.33]);
  registerProxy('frontend', [1.2, 0.22, 0.48], [-0.15, deskTopY + 0.08, 0.42]);
  registerProxy('state', [0.95, 1.35, 0.9], [1.48, deskTopY + 0.65, 0.05]);
  registerProxy('backend', [0.88, 1.38, 0.38], [-1.66, deskTopY + 0.82, -0.05]);

  // Smooth Exploded-View kinematic updater (zero allocations)
  const applyExplode = (amount: number): void => {
    const t = THREE.MathUtils.clamp(amount, 0, 1);

    // Separate the 4 modular architecture plates along the vertical brass rails
    for (let i = 0; i < towerPlates.length; i++) {
      towerPlates[i].position.y = basePlateHeights[i] + i * 0.21 * t;
    }

    // Float keycaps upward to reveal the internal CNC brass switch plate
    keycapLayerGroup.position.y = t * 0.14;

    // Separate primary display LCD layer slightly forward from aluminum chassis
    screenMesh.position.z = 0.035 + t * 0.16;
    vScreenMesh.position.z = 0.038 + t * 0.12;
  };

  const applyFinishTheme = (theme: StudioFinishTheme): void => {
    if (theme === 'architect') {
      deskSlabMat.color.setHex(0xe6e2d8);
      aluminumChassisMat.color.setHex(0xc8ccd2);
      brassAccentMat.color.setHex(0xc89d54);
    } else if (theme === 'carbon') {
      deskSlabMat.color.setHex(0x23262b);
      aluminumChassisMat.color.setHex(0x3a3f47);
      brassAccentMat.color.setHex(0xd9381e);
    } else {
      deskSlabMat.color.setHex(0xded6c8);
      aluminumChassisMat.color.setHex(0xb89668);
      brassAccentMat.color.setHex(0xe0b36a);
    }
  };

  const dispose = (): void => {
    textures.disposeAll();
    for (const geo of geometries) {
      geo.dispose();
    }
    for (const mat of materials) {
      mat.dispose();
    }
  };

  return {
    root,
    floor,
    hitProxies,
    applyExplode,
    applyFinishTheme,
    dispose,
  };
}
