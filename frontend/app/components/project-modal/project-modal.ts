import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {ProjectCaseStudy} from '../../models/portfolio.types';

@Component({
  selector: 'app-project-modal',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'closeModal()',
  },
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-[#141517]/80 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      [attr.aria-labelledby]="'modal-title-' + project().id"
    >
      <div
        class="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-[#DCD9D0] bg-[#F6F5F1] text-[#141517] shadow-md"
      >
        <!-- Sticky Top Bar -->
        <div
          class="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-[#DCD9D0] bg-[#F6F5F1] px-6 py-4"
        >
          <div class="flex items-center gap-2 text-xs text-[#52525B] font-mono tabular-nums">
            <span>Dự án {{ project().index }}</span>
            <span aria-hidden="true">·</span>
            <span>{{ project().categoryLabel }}</span>
            <span aria-hidden="true">·</span>
            <span>{{ project().year }}</span>
          </div>

          <button
            type="button"
            (click)="closeModal()"
            class="inline-flex items-center gap-1.5 rounded-lg border border-[#141517] bg-[#141517] px-3.5 py-2 text-xs font-medium text-white transition-colors duration-150 hover:bg-[#D9381E] hover:border-[#D9381E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9381E] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <mat-icon class="!text-base !w-4 !h-4">close</mat-icon>
            <span>Đóng [ESC]</span>
          </button>
        </div>

        <!-- Visual Showcase -->
        <div class="border-b border-[#DCD9D0] bg-[#ECEAE4]">
          @if (!imageFailed()) {
            <img
              [src]="project().image"
              [alt]="project().title"
              referrerpolicy="no-referrer"
              (error)="onImageError()"
              class="h-64 w-full object-cover sm:h-80"
            />
          } @else {
            <div class="flex h-64 w-full flex-col items-center justify-center bg-[#ECEAE4] p-8 text-center sm:h-80">
              <span class="font-mono text-xs text-[#52525B] tabular-nums">{{ project().index }} · {{ project().categoryLabel }}</span>
              <p class="mt-2 font-display text-xl font-semibold text-[#141517]">{{ project().title }}</p>
            </div>
          }
        </div>

        <!-- Detailed Case Study Content -->
        <div class="p-6 sm:p-8 space-y-8">
          <div>
            <h2
              [id]="'modal-title-' + project().id"
              class="font-display text-2xl font-bold tracking-tight text-[#141517] sm:text-3xl text-balance"
            >
              {{ project().title }}
            </h2>
            <p class="mt-3 text-base leading-relaxed text-[#3F3F46] max-w-3xl">
              {{ project().summary }}
            </p>
          </div>

          <!-- 3-Column Architectural Breakdown -->
          <div class="grid grid-cols-1 gap-6 border-t border-b border-[#DCD9D0] py-6 md:grid-cols-3">
            <div>
              <h3 class="text-sm font-semibold text-[#141517]">01. Bài toán Thực tế</h3>
              <p class="mt-2 text-sm leading-relaxed text-[#52525B]">
                {{ project().problem }}
              </p>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-[#141517]">02. Kiến trúc Component</h3>
              <p class="mt-2 text-sm leading-relaxed text-[#52525B]">
                {{ project().componentStrategy }}
              </p>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-[#141517]">03. Trạng thái & REST API</h3>
              <p class="mt-2 text-sm leading-relaxed text-[#52525B]">
                {{ project().stateAndApiFlow }}
              </p>
            </div>
          </div>

          <!-- Key Technical Highlights & Stack -->
          <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h3 class="text-sm font-semibold text-[#141517]">Điểm nhấn Kỹ thuật</h3>
              <ul class="mt-3 space-y-2.5 text-sm text-[#3F3F46]">
                @for (item of project().highlights; track item; let idx = $index) {
                  <li class="flex items-start gap-2.5">
                    <span class="font-mono text-xs font-medium text-[#D9381E] tabular-nums mt-0.5">0{{ idx + 1 }}.</span>
                    <span>{{ item }}</span>
                  </li>
                }
              </ul>
            </div>

            <div class="space-y-5">
              <div>
                <h3 class="text-sm font-semibold text-[#141517]">Công nghệ Sử dụng</h3>
                <p class="mt-2 text-sm text-[#52525B]">
                  {{ project().stack.join(' · ') }}
                </p>
              </div>

              <div>
                <h3 class="text-sm font-semibold text-[#141517]">Giao thức REST Endpoints</h3>
                <div class="mt-2 space-y-1.5 font-mono text-xs text-[#27272A]">
                  @for (ep of project().endpoints; track ep) {
                    <div class="rounded-lg border border-[#DCD9D0] bg-white px-3 py-2">
                      {{ ep }}
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProjectModal {
  readonly project = input.required<ProjectCaseStudy>();
  readonly closed = output<void>();
  readonly imageFailed = signal(false);

  onImageError(): void {
    this.imageFailed.set(true);
  }

  closeModal(): void {
    this.closed.emit();
  }
}
