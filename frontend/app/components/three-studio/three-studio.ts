import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
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
import {
  STUDIO_STATIONS,
  StudioCameraPreset,
  StudioFinishTheme,
} from '../../models/portfolio.types';
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

// Module-scope reusable scratch math vectors (Zero GC inside render loop)
const _desiredPos = new THREE.Vector3();
const _desiredTarget = new THREE.Vector3();
const _pointerNdc = new THREE.Vector2();

@Component({
  selector: 'app-three-studio',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown)': 'onGlobalKeydown($event)',
  },
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

      <!-- Unified Collapsible Bottom Control Dock (Zero Side-Panel Clutter, Solid RGBA Surface) -->
      <div
        class="pointer-events-auto absolute bottom-5 left-1/2 z-20 w-[min(920px,94vw)] -translate-x-1/2 transition-transform duration-200 ease-out"
        [style.transform]="dockCollapsed() ? 'translate(-50%, calc(100% - 34px))' : 'translate(-50%, 0)'"
      >
        <!-- Collapse / Zen Mode Drawer Handle -->
        <div class="flex justify-center">
          <button
            type="button"
            (click)="toggleDock()"
            class="inline-flex items-center gap-1.5 rounded-t-lg border border-b-0 border-[#2E3239] bg-[#16181C] px-3.5 py-1.5 font-mono text-[11px] font-medium text-[#D4D4D8] transition-colors duration-150 hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
          >
            <mat-icon class="!text-sm !w-3.5 !h-3.5">
              {{ dockCollapsed() ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}
            </mat-icon>
            <span>{{ dockCollapsed() ? 'Mở bảng điều khiển 3D [H]' : 'Thu gọn điều khiển [H]' }}</span>
          </button>
        </div>

        <!-- Solid Dock Body (Strictly no backdrop-filter over WebGL) -->
        <div class="rounded-2xl border border-[#2E3239] bg-[#16181C]/96 p-4 shadow-md">
          <!-- Selected Station Readout -->
          <div class="flex flex-col justify-between gap-2 border-b border-[#262930] pb-3 sm:flex-row sm:items-center">
            <div class="min-w-0">
              <div class="flex items-center gap-2 text-xs font-mono text-[#A1A1AA] tabular-nums">
                <span class="text-[#D9381E] font-semibold">{{ activeStation().code }}.</span>
                <span class="font-semibold text-white truncate">{{ activeStation().title }}</span>
                <span aria-hidden="true" class="hidden md:inline">·</span>
                <span class="hidden md:inline truncate">{{ activeStation().subtitle }}</span>
              </div>
              <p class="mt-1 text-xs text-[#A1A1AA] truncate">
                {{ activeStation().detail }}
              </p>
            </div>
          </div>

          <!-- Controls Row: Camera Presets | Explode Slider | Material Finishes -->
          <div class="mt-3 flex flex-wrap items-center justify-between gap-4">
            <!-- Camera View Presets -->
            <div class="flex items-center gap-1 rounded-lg bg-[#101114] p-1 border border-[#25282E]">
              @for (preset of presetButtons; track preset.id) {
                <button
                  type="button"
                  (click)="selectPreset(preset.id)"
                  [class.bg-[#F6F5F1]]="activePreset() === preset.id"
                  [class.text-[#141517]]="activePreset() === preset.id"
                  [class.text-[#D4D4D8]]="activePreset() !== preset.id"
                  class="rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
                  [class.hover:text-[#141517]]="activePreset() === preset.id"
                >
                  {{ preset.label }}
                </button>
              }
            </div>

            <!-- Exploded Architecture Slider -->
            <div class="flex items-center gap-3">
              <label
                for="studio-explode-slider"
                class="font-mono text-xs text-[#D4D4D8] whitespace-nowrap shrink-0 tabular-nums"
              >
                Tách lớp: {{ explodePercent() }}%
              </label>
              <input
                id="studio-explode-slider"
                type="range"
                min="0"
                max="100"
                [value]="explodePercent()"
                (input)="onExplodeInput($event)"
                class="studio-slider w-28 sm:w-36"
              />
            </div>

            <!-- Material Finish Theme Selector -->
            <div class="flex items-center gap-1 rounded-lg bg-[#101114] p-1 border border-[#25282E]">
              @for (finish of finishButtons; track finish.id) {
                <button
                  type="button"
                  (click)="selectFinish(finish.id)"
                  [class.bg-[#D9381E]]="activeFinish() === finish.id"
                  [class.text-white]="activeFinish() === finish.id"
                  [class.text-[#A1A1AA]]="activeFinish() !== finish.id"
                  class="rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {{ finish.label }}
                </button>
              }
            </div>
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

  readonly activePreset = signal<StudioCameraPreset>('overview');
  readonly activeFinish = signal<StudioFinishTheme>('architect');
  readonly explodePercent = signal<number>(18);
  readonly dockCollapsed = signal<boolean>(false);
  readonly webglUnavailable = signal<boolean>(false);

  readonly activeStation = computed(() => STUDIO_STATIONS[this.activePreset()]);

  readonly presetButtons: {id: StudioCameraPreset; label: string}[] = [
    {id: 'overview', label: 'Toàn cảnh'},
    {id: 'frontend', label: 'Front-end UI'},
    {id: 'state', label: 'RxJS · NgRx'},
    {id: 'backend', label: 'Express API'},
  ];

  readonly finishButtons: {id: StudioFinishTheme; label: string}[] = [
    {id: 'architect', label: 'Titanium'},
    {id: 'carbon', label: 'Carbon'},
    {id: 'brass', label: 'Đồng'},
  ];

  private requestRenderFn: (() => void) | null = null;
  private startCameraTransitionFn: ((preset: StudioCameraPreset) => void) | null = null;
  private setTargetExplodeFn: ((ratio: number) => void) | null = null;
  private setFinishThemeFn: ((theme: StudioFinishTheme) => void) | null = null;

  constructor() {
    afterNextRender(() => {
      this.initStudioScene();
    });
  }

  onGlobalKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    if (
      target &&
      (target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable)
    ) {
      return;
    }
    if (event.key === 'h' || event.key === 'H') {
      this.toggleDock();
    }
  }

  toggleDock(): void {
    this.dockCollapsed.update((v) => !v);
  }

  selectPreset(preset: StudioCameraPreset): void {
    this.activePreset.set(preset);
    this.startCameraTransitionFn?.(preset);
  }

  onExplodeInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const val = Number(inputEl.value);
    this.explodePercent.set(val);
    this.setTargetExplodeFn?.(val / 100);
  }

  selectFinish(theme: StudioFinishTheme): void {
    this.activeFinish.set(theme);
    this.setFinishThemeFn?.(theme);
  }

  private initStudioScene(): void {
    const container = this.canvasMount().nativeElement;

    // Detect Software WebGL strictly from GPU renderer string (never user agent)
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

    // Scene & Horizon-matched Atmosphere
    const bgHex = 0x111214;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.045);

    // Studio Environment Map via RoomEnvironment + PMREMGenerator on every device
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    // Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 80);
    const initialPreset = CAMERA_PRESETS.overview;
    camera.position.set(...initialPreset.position);

    // Balanced 3-Point Studio Lighting Rig + Softbox
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

    // Build Procedural 10-Part Developer Workstation Assembly
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const workstation: WorkstationAssembly =
      createWorkstationAssembly(maxAnisotropy);
    scene.add(workstation.floor);
    scene.add(workstation.root);

    let currentExplode = this.explodePercent() / 100;
    let targetExplode = currentExplode;
    workstation.applyExplode(currentExplode);

    // OrbitControls with damping
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

    // Camera glide & kinematic state
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

        // Exponential damping for camera preset transition
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

        // Exponential damping for exploded-view separation
        if (Math.abs(currentExplode - targetExplode) > 0.001) {
          if (isSoftwareGl) {
            currentExplode = targetExplode;
          } else {
            currentExplode = THREE.MathUtils.damp(
              currentExplode,
              targetExplode,
              8.0,
              dt,
            );
            stillMoving = true;
          }
          workstation.applyExplode(currentExplode);
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

    this.requestRenderFn = requestRender;
    this.startCameraTransitionFn = (preset: StudioCameraPreset) => {
      const wp = CAMERA_PRESETS[preset];
      _desiredPos.set(...wp.position);
      _desiredTarget.set(...wp.target);
      cameraAnimating = true;
      lastFrameTime = performance.now();
      requestRender();
    };
    this.setTargetExplodeFn = (ratio: number) => {
      targetExplode = ratio;
      lastFrameTime = performance.now();
      requestRender();
    };
    this.setFinishThemeFn = (theme: StudioFinishTheme) => {
      workstation.applyFinishTheme(theme);
      requestRender();
    };

    // Cancel scripted camera transition immediately when user interacts manually
    const onControlStart = (): void => {
      cameraAnimating = false;
    };
    const onControlChange = (): void => {
      requestRender();
    };
    controls.addEventListener('start', onControlStart);
    controls.addEventListener('change', onControlChange);

    // High-Performance Raycasting on Dedicated Layer 1
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
      if (dx * dx + dy * dy > 36) return; // Ignore orbit drags

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
      if (now - lastHoverTime < 60) return; // Throttled hover check
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

    // WebGL Context Safety Listeners
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

    // Responsive Resize Observer
    const onResize = (): void => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };
    window.addEventListener('resize', onResize);

    // Trigger initial render frame
    requestRender();

    // Clean disposal on component teardown
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
