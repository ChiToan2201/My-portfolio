import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {
  ApiInspectionResult,
  ArchitectureBlueprint,
} from '../../models/portfolio.types';
import {PortfolioApi} from '../../services/portfolio-api';

interface ProbeOption {
  label: string;
  endpoint: string;
}

@Component({
  selector: 'app-api-sandbox',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-12 items-stretch">
      <!-- Left Column: Separated Frontend / Backend Source Tree & MongoDB Blueprint -->
      <div class="lg:col-span-6 flex flex-col justify-between rounded-2xl border border-[#DCD9D0] bg-white p-6 sm:p-8">
        <div class="space-y-6">
          <div>
            <p class="text-xs font-mono text-[#52525B]">Cấu trúc Mã nguồn Tách biệt</p>
            <h3 class="mt-1 font-display text-xl font-bold text-[#141517]">
              Phân tách Rõ ràng /frontend và /backend
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-[#52525B]">
              {{ blueprint().overview }}
            </p>
          </div>

          <div class="space-y-4">
            @for (layer of blueprint().layers; track layer.layerIndex) {
              <div class="rounded-xl border border-[#E5E3DC] bg-[#F6F5F1] p-4">
                <div class="flex flex-wrap items-baseline justify-between gap-2">
                  <span class="font-display text-base font-bold text-[#141517]">
                    {{ layer.layerIndex }}. {{ layer.layerName }}
                  </span>
                  <code class="font-mono text-xs font-medium text-[#D9381E]">
                    {{ layer.directory }}
                  </code>
                </div>
                <p class="mt-1 text-xs text-[#52525B]">
                  {{ layer.runtime }}
                </p>
                <ul class="mt-3 space-y-1.5 text-xs leading-relaxed text-[#3F3F46]">
                  @for (resp of layer.responsibilities; track resp) {
                    <li>— {{ resp }}</li>
                  }
                </ul>
                <p class="mt-3 pt-2.5 border-t border-[#DCD9D0] font-mono text-[11px] text-[#52525B] break-words">
                  {{ layer.keyFiles.join(' · ') }}
                </p>
              </div>
            }
          </div>
        </div>

        <!-- MongoDB Document Design -->
        <div class="mt-6 pt-6 border-t border-[#E5E3DC]">
          <h4 class="text-sm font-semibold text-[#141517]">
            Thiết kế Lược đồ Tài liệu MongoDB (NoSQL Modeling)
          </h4>
          <div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            @for (schema of blueprint().mongoSchemas; track schema.collection) {
              <div class="rounded-xl border border-[#E5E3DC] bg-[#F6F5F1] p-3.5">
                <div class="font-mono text-xs font-semibold text-[#141517]">
                  db.{{ schema.collection }}
                </div>
                <p class="mt-1 text-xs text-[#52525B] leading-relaxed">
                  {{ schema.description }}
                </p>
                <p class="mt-2 font-mono text-[11px] text-[#3F3F46]">
                  Indexes: {{ schema.indexes.join(' · ') }}
                </p>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Right Column: Live Interactive Express.js REST API Tester -->
      <div class="lg:col-span-6 flex flex-col justify-between rounded-2xl border border-[#141517] bg-[#141517] p-6 sm:p-8 text-[#F6F5F1]">
        <div>
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p class="font-mono text-xs text-[#A1A1AA]">Express.js 5 Live Endpoint Inspector</p>
              <h3 class="mt-1 font-display text-xl font-bold text-white">
                Kiểm thử Trực tiếp REST API Thực tế
              </h3>
            </div>

            <button
              type="button"
              (click)="runProbe(activeEndpoint())"
              [disabled]="loading()"
              class="inline-flex items-center gap-1.5 rounded-lg bg-[#D9381E] px-4 py-2 text-xs font-semibold text-white transition-colors duration-150 hover:bg-[#B82D16] disabled:opacity-50 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <mat-icon class="!text-base !w-4 !h-4">play_arrow</mat-icon>
              <span>{{ loading() ? 'Đang gọi API...' : 'Gửi Request' }}</span>
            </button>
          </div>

          <p class="mt-2 text-xs leading-relaxed text-[#A1A1AA]">
            Chọn một endpoint bên dưới để gửi HTTP GET thực tế tới máy chủ Express.js tại thư mục <code class="text-white">/backend</code> và kiểm tra dữ liệu JSON trả về.
          </p>

          <!-- Segmented Endpoint Selector -->
          <div class="mt-5 flex flex-wrap gap-1.5 rounded-xl bg-[#1E2024] p-1.5 border border-[#2B2E33]">
            @for (opt of probeOptions; track opt.endpoint) {
              <button
                type="button"
                (click)="runProbe(opt.endpoint)"
                [class.bg-[#F6F5F1]]="activeEndpoint() === opt.endpoint"
                [class.text-[#141517]]="activeEndpoint() === opt.endpoint"
                [class.text-[#D4D4D8]]="activeEndpoint() !== opt.endpoint"
                class="rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-colors duration-150 hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
                [class.hover:text-[#141517]]="activeEndpoint() === opt.endpoint"
              >
                {{ opt.label }}
              </button>
            }
          </div>

          <!-- Response Telemetry Header (Real HTTP response numbers, tabular-nums) -->
          @if (inspectionResult(); as res) {
            <div class="mt-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#2B2E33] pb-3 font-mono text-xs tabular-nums">
              <div class="flex items-center gap-2 text-[#E4E4E7]">
                <span class="font-semibold text-[#D9381E]">{{ res.method }}</span>
                <span>{{ res.endpoint }}</span>
              </div>
              <div class="flex items-center gap-3 text-[#A1A1AA]">
                <span>HTTP {{ res.status }}</span>
                <span aria-hidden="true">·</span>
                <span>Server: {{ res.serverDurationMs }} ms</span>
                <span aria-hidden="true">·</span>
                <span>Round-trip: {{ res.clientDurationMs }} ms</span>
              </div>
            </div>

            <pre
              class="mt-4 max-h-80 overflow-auto rounded-xl border border-[#2B2E33] bg-[#0D0E10] p-4 font-mono text-xs leading-relaxed text-[#E4E4E7]"
            ><code>{{ res.payloadPreview }}</code></pre>
          } @else if (errorMessage()) {
            <div class="mt-5 rounded-xl border border-[#D9381E] bg-[#1E2024] p-4 text-xs text-[#F6F5F1]">
              {{ errorMessage() }}
            </div>
          } @else {
            <div class="mt-5 rounded-xl border border-[#2B2E33] bg-[#0D0E10] p-6 text-xs text-[#A1A1AA] font-mono">
              Nhấn "Gửi Request" hoặc chọn một endpoint để xem phản hồi trực tiếp từ Express.js Backend.
            </div>
          }
        </div>

        <div class="mt-6 pt-4 border-t border-[#2B2E33] flex flex-wrap items-center justify-between gap-2 text-xs text-[#A1A1AA] font-mono tabular-nums">
          <span>Engine: Node.js · Express 5</span>
          <span>Lời nhắn đã ghi nhận trong phiên: {{ contactsCount() }}</span>
        </div>
      </div>
    </div>
  `,
})
export class ApiSandbox {
  private readonly api = inject(PortfolioApi);

  readonly blueprint = input.required<ArchitectureBlueprint>();
  readonly contactsCount = input<number>(0);

  readonly probeOptions: ProbeOption[] = [
    {label: 'GET /api/profile', endpoint: '/api/profile'},
    {label: 'GET /api/skills?category=frontend', endpoint: '/api/skills?category=frontend'},
    {label: 'GET /api/projects', endpoint: '/api/projects'},
    {label: 'GET /api/architecture', endpoint: '/api/architecture'},
  ];

  readonly activeEndpoint = signal<string>('/api/profile');
  readonly loading = signal<boolean>(false);
  readonly errorMessage = signal<string>('');
  readonly inspectionResult = signal<ApiInspectionResult | null>(null);

  runProbe(endpoint: string): void {
    this.activeEndpoint.set(endpoint);
    this.loading.set(true);
    this.errorMessage.set('');

    this.api.inspectEndpoint(endpoint).subscribe({
      next: (result) => {
        this.inspectionResult.set(result);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Không thể kết nối tới endpoint Express.js lúc này. Vui lòng thử lại.');
        this.loading.set(false);
      },
    });
  }
}
