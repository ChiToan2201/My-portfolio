import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {RectAreaLightUniformsLib} from 'three/addons/lights/RectAreaLightUniformsLib.js';
import {StudioCameraPreset} from '../../models/portfolio.types';
import {
  WorkstationAssembly,
  createWorkstationAssembly,
} from '../../three/workstation-builder';

interface CameraWaypoint {
  position: [number, number, number];
  target: [number, number, number];
}

const CAMERA_PRESETS: Record<StudioCameraPreset, CameraWaypoint> = {
  overview: {
    position: [0.35, 2.55, 4.35],
    target: [0, 0.98, -0.05],
  },
  frontend: {
    position: [-0.15, 1.42, 1.95],
    target: [-0.15, 1.24, -0.32],
  },
  state: {
    position: [2.55, 1.85, 2.15],
    target: [1.48, 0.95, 0.05],
  },
  backend: {
    position: [-2.72, 1.48, 1.72],
    target: [-1.66, 1.15, -0.05],
  },
};

const _desiredPos = new THREE.Vector3();
const _desiredTarget = new THREE.Vector3();
const _pointerNdc = new THREE.Vector2();

@Component({
  selector: 'app-three-studio',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      id="studio-3d"
      aria-label="Không gian 3D bàn làm việc kỹ thuật Front-end"
      class="relative h-screen w-full overflow-hidden bg-[#111214] text-[#F6F5F1] select-none"
    >
      <!-- Dedicated Isolated WebGL Canvas Mount Container -->
      <div
        #canvasMount
        class="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing"
      ></div>

      <!-- Graceful Static Architectural Fallback if WebGL is unavailable -->
      @if (webglUnavailable()) {
        <div class="absolute inset-0 flex items-center justify-center bg-[#111214] p-8 text-center">
          <div class="max-w-lg rounded-2xl border border-[#2B2E33] bg-[#181A1E] p-8">
            <p class="font-mono text-xs text-[#A1A1AA]">Chế độ Hiển thị Tĩnh</p>
            <h2 class="mt-2 font-display text-2xl font-bold text-white">
              Danh Nguyễn Chí Toàn — Front-end Developer
            </h2>
            <p class="mt-3 text-sm leading-relaxed text-[#D4D4D8]">
              Trình duyệt hiện tại đang tắt tăng tốc WebGL. Bạn vẫn có thể khám phá đầy đủ hồ sơ kỹ năng, dự án thực tế và hệ thống Express.js REST API ngay bên dưới.
            </p>
          </div>
        </div>
      }

      <!-- Minimal Unobstructed Top-Left Identity Overlay -->
      <div class="pointer-events-none absolute top-20 left-6 right-6 z-10 mx-auto max-w-[1360px]">
        <div class="max-w-md space-y-2.5">
          <p class="font-mono text-xs tracking-wide text-[#D4D4D8]">
            FPT Polytechnic · Công nghệ thông tin
          </p>
          <h1 class="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
            Danh Nguyễn Chí Toàn
          </h1>
          <p class="text-sm leading-relaxed text-[#D4D4D8]">
            Định hướng phát triển Front-end Development chuyên sâu với TypeScript, Angular, React, Tailwind CSS và kiến trúc quản lý trạng thái RxJS · NgRx.
          </p>
          <div class="pointer-events-auto pt-1.5 flex items-center gap-3">
            <button
              type="button"
              (click)="scrollToProfile.emit()"
              class="inline-flex items-center gap-2 rounded-lg bg-[#D9381E] px-4 py-2 text-xs font-semibold text-white transition-colors duration-150 hover:bg-[#B82D16] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <mat-icon class="!text-base !w-4 !h-4">south</mat-icon>
              <span>Xem Hồ sơ Chi tiết</span>
            </button>

            <button
              type="button"
              (click)="scrollToProjects.emit()"
              class="inline-flex items-center gap-2 rounded-lg border border-[#383C44] bg-[#181A1E] px-4 py-2 text-xs font-semibold text-[#F6F5F1] transition-colors duration-150 hover:border-[#F6F5F1] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <mat-icon class="!text-base !w-4 !h-4">grid_view</mat-icon>
              <span>Dự án Thực hiện</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ThreeStudio {
  private readonly destroyRef = inject(DestroyRef);
  private readonly canvasMount = viewChild.required<ElementRef<HTMLDivElement>>('canvasMount');

  readonly scrollToProfile = output<void>();
  readonly scrollToProjects = output<void>();

  readonly webglUnavailable = signal<boolean>(false);

  private startCameraTransitionFn: ((preset: StudioCameraPreset) => void) | null = null;

  constructor() {
    afterNextRender(() => {
      this.initStudioScene();
    });
  }

  selectPreset(preset: StudioCameraPreset): void {
    this.startCameraTransitionFn?.(preset);
  }

  private initStudioScene(): void {
    const container = this.canvasMount().nativeElement;

    const isSoftwareGl = (() => {
      const probeCanvas = document.createElement('canvas');
      const gl = probeCanvas.getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      this.webglUnavailable.set(true);
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2),
    );
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const canvas = renderer.domElement;
    container.appendChild(canvas);

    const bgHex = 0x111214;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.045);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 80);
    const initialPreset = CAMERA_PRESETS.overview;
    camera.position.set(...initialPreset.position);

    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x23252a, 0.72);
    hemiLight.position.set(0, 12, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1de, 2.2);
    keyLight.position.set(4.2, 6.4, 4.5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    const d = 4.6;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.camera.near = 0.8;
    keyLight.shadow.camera.far = 18;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x93c5fd, 0.95);
    rimLight.position.set(-4.5, 4.2, -4.2);
    scene.add(rimLight);

    if (!isSoftwareGl) {
      RectAreaLightUniformsLib.init();
      const softbox = new THREE.RectAreaLight(0xfffaf0, 3.2, 3.2, 1.8);
      softbox.position.set(-2.2, 3.8, 2.6);
      softbox.lookAt(0, 1.0, 0);
      scene.add(softbox);
    }

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const workstation: WorkstationAssembly =
      createWorkstationAssembly(maxAnisotropy);
    scene.add(workstation.floor);
    scene.add(workstation.root);

    workstation.applyExplode(0.18);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(...initialPreset.target);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.065;
    controls.enablePan = false;
    controls.minDistance = 1.65;
    controls.maxDistance = 7.5;
    controls.minPolarAngle = 0.25;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.update();

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let cameraAnimating = false;
    _desiredPos.set(...initialPreset.position);
    _desiredTarget.set(...initialPreset.target);

    let lastFrameTime = performance.now();
    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    let disposed = false;

    const afterDraw = (cb: () => void): void => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = (): void => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    };

    const requestRender = (): void => {
      if (disposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame((now) => {
        if (disposed) return;
        renderDirty = false;
        const dt = Math.min(0.05, Math.max(0.001, (now - lastFrameTime) / 1000));
        lastFrameTime = now;

        let stillMoving = false;

        if (cameraAnimating) {
          if (isSoftwareGl) {
            camera.position.copy(_desiredPos);
            controls.target.copy(_desiredTarget);
            cameraAnimating = false;
          } else {
            const alpha = 1 - Math.exp(-6.5 * dt);
            camera.position.lerp(_desiredPos, alpha);
            controls.target.lerp(_desiredTarget, alpha);
            if (
              camera.position.distanceToSquared(_desiredPos) < 0.0004 &&
              controls.target.distanceToSquared(_desiredTarget) < 0.0004
            ) {
              camera.position.copy(_desiredPos);
              controls.target.copy(_desiredTarget);
              cameraAnimating = false;
            } else {
              stillMoving = true;
            }
          }
        }

        const controlsChanged = controls.update();
        if (controlsChanged && !isSoftwareGl) {
          stillMoving = true;
        }

        renderer.render(scene, camera);

        const done = (): void => {
          renderBusy = false;
          if (renderDirty || stillMoving) {
            requestRender();
          }
        };

        if (isSoftwareGl) {
          afterDraw(done);
        } else {
          done();
        }
      });
    };

    this.startCameraTransitionFn = (preset: StudioCameraPreset) => {
      const wp = CAMERA_PRESETS[preset];
      _desiredPos.set(...wp.position);
      _desiredTarget.set(...wp.target);
      cameraAnimating = true;
      lastFrameTime = performance.now();
      requestRender();
    };

    const onControlStart = (): void => {
      cameraAnimating = false;
    };
    const onControlChange = (): void => {
      requestRender();
    };
    controls.addEventListener('start', onControlStart);
    controls.addEventListener('change', onControlChange);

    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);

    let pointerDownX = 0;
    let pointerDownY = 0;
    let lastHoverTime = 0;

    const onPointerDown = (e: PointerEvent): void => {
      pointerDownX = e.clientX;
      pointerDownY = e.clientY;
    };

    const onPointerUp = (e: PointerEvent): void => {
      const dx = e.clientX - pointerDownX;
      const dy = e.clientY - pointerDownY;
      if (dx * dx + dy * dy > 36) return;

      const rect = canvas.getBoundingClientRect();
      _pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(_pointerNdc, camera);
      const hits = raycaster.intersectObjects(workstation.hitProxies, false);
      if (hits.length > 0) {
        const station = hits[0].object.userData['station'] as
          | StudioCameraPreset
          | undefined;
        if (station) {
          this.selectPreset(station);
        }
      }
    };

    const onPointerMove = (e: PointerEvent): void => {
      const now = performance.now();
      if (now - lastHoverTime < 60) return;
      lastHoverTime = now;

      const rect = canvas.getBoundingClientRect();
      _pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(_pointerNdc, camera);
      const hits = raycaster.intersectObjects(workstation.hitProxies, false);
      canvas.style.cursor = hits.length > 0 ? 'pointer' : '';
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointermove', onPointerMove);

    const onContextLost = (event: Event): void => {
      event.preventDefault();
      this.webglUnavailable.set(true);
    };
    const onContextRestored = (): void => {
      this.webglUnavailable.set(false);
      requestRender();
    };
    canvas.addEventListener('webglcontextlost', onContextLost);
    canvas.addEventListener('webglcontextrestored', onContextRestored);

    const onResize = (): void => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };
    window.addEventListener('resize', onResize);

    requestRender();

    this.destroyRef.onDestroy(() => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
      controls.removeEventListener('start', onControlStart);
      controls.removeEventListener('change', onControlChange);
      controls.dispose();
      envTarget.dispose();
      workstation.dispose();
      renderer.dispose();
      canvas.remove();
    });
  }
}
