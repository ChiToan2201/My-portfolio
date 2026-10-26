import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {animate, inView} from 'motion';
import {ApiSandbox} from './components/api-sandbox/api-sandbox';
import {ProjectModal} from './components/project-modal/project-modal';
import {ThreeStudio} from './components/three-studio/three-studio';
import {
  ArchitectureBlueprint,
  ContactResponseRecord,
  DeveloperProfile,
  INITIAL_PROFILE_FALLBACK,
  ProjectCaseStudy,
  ProjectFilter,
  SkillFilter,
  SkillGroup,
} from './models/portfolio.types';
import {PortfolioApi} from './services/portfolio-api';

const INITIAL_SKILLS_SEED: SkillGroup[] = [
  {
    id: 'fe-core-languages',
    index: '01',
    category: 'frontend',
    categoryLabel: 'Front-end Cốt lõi',
    title: 'Nền tảng Ngôn ngữ & Cấu trúc Giao diện Chuẩn Semantic',
    technologies: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'TypeScript'],
    practicalApplication:
      'Xây dựng cấu trúc DOM ngữ nghĩa chuẩn tiếp cận (a11y), kiểm soát kiểu dữ liệu chặt chẽ ở cấp độ biên dịch với TypeScript Strict Mode giúp giảm thiểu lỗi runtime khi mở rộng dự án.',
    architecturalFocus: 'Semantic HTML · Responsive Layout · Strict Type-Safety',
  },
  {
    id: 'fe-frameworks-ui',
    index: '02',
    category: 'frontend',
    categoryLabel: 'Framework & Styling',
    title: 'Phát triển Ứng dụng SPA/SSR với Angular, React & Tailwind CSS',
    technologies: ['Angular', 'React', 'Tailwind CSS', 'Component Design'],
    practicalApplication:
      'Thiết kế hệ thống giao diện theo hướng chia nhỏ Component độc lập, tái sử dụng cao, tách biệt rõ ràng giữa Smart Container và Presentational UI cùng hệ thống thiết kế nhất quán bằng Tailwind CSS.',
    architecturalFocus: 'Standalone Components · Reusable UI Primitives · Design Tokens',
  },
  {
    id: 'state-reactive-architecture',
    index: '03',
    category: 'state',
    categoryLabel: 'Quản lý Trạng thái',
    title: 'Luồng Dữ liệu Bất đồng bộ & Quản lý Trạng thái Tập trung',
    technologies: ['RxJS', 'NgRx', 'Signals', 'State Management'],
    practicalApplication:
      'X xử lý các luồng sự kiện phức tạp, tìm kiếm thời gian thực, đồng bộ hóa dữ liệu từ REST API bằng toán tử RxJS và quản lý vòng đời trạng thái một chiều minh bạch thông qua NgRx Store / Signals.',
    architecturalFocus: 'Observable Streams · Immutable Store · Predictable State Transitions',
  },
  {
    id: 'backend-rest-api',
    index: '04',
    category: 'backend',
    categoryLabel: 'Backend & Cơ sở dữ liệu',
    title: 'Xây dựng Dịch vụ Web RESTful với Node.js, Express.js & MongoDB',
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'REST API'],
    practicalApplication:
      'Tổ chức tầng Backend tách biệt theo mô hình Routes - Controllers - Data Models, thiết kế RESTful API rõ ràng, kiểm tra dữ liệu đầu vào và mô hình hóa tài liệu NoSQL linh hoạt trên MongoDB.',
    architecturalFocus: 'Layered Express Routing · JSON Schema Validation · Document Modeling',
  },
  {
    id: 'workflow-git-deploy',
    index: '05',
    category: 'workflow',
    categoryLabel: 'Quy trình & Triển khai',
    title: 'Quản lý Mã nguồn, Làm việc Nhóm & Triển khai Ứng dụng Web',
    technologies: ['Git', 'GitHub', 'REST Client Testing', 'Web Deployment'],
    practicalApplication:
      'Quản lý lịch sử phiên bản sạch sẽ theo nhánh tính năng (feature branch), thực hiện Pull Request có cấu trúc trên GitHub, kiểm thử tích hợp Frontend - Backend và đưa ứng dụng lên môi trường vận hành thực tế.',
    architecturalFocus: 'Branching Workflow · Clean Commits · Production Build Optimization',
  },
];

const INITIAL_PROJECTS_SEED: ProjectCaseStudy[] = [
  {
    id: 'modular-ui-state-platform',
    index: '01',
    slug: 'he-thong-quan-tri-component-ngrx',
    title: 'Hệ thống Quản trị Đơn hàng & Thư viện Component Tái sử dụng',
    category: 'angular',
    categoryLabel: 'Angular · RxJS · NgRx',
    year: '2026',
    featured: true,
    image: '/assets/images/project_component_system_1792849480442.jpg',
    summary:
      'Ứng dụng quản trị dữ liệu tập trung xây dựng trên Angular và TypeScript, áp dụng kiến trúc Component tái sử dụng kết hợp RxJS và NgRx để đồng bộ bộ lọc đa chiều, phân trang và trạng thái giỏ hàng/đơn hàng mượt mà.',
    problem:
      'Các màn hình quản lý dữ liệu nhiều bộ lọc thường gặp tình trạng gọi API trùng lặp, rò rỉ bộ nhớ subscription và khó bảo trì khi logic giao diện trộn lẫn với logic nghiệp vụ.',
    componentStrategy:
      'Tách biệt hệ thống thành các Presentational Components thuần túy (Data Table, Filter Segmented Bar, Status Drawer, Modal Dialog) giao tiếp qua Input/Output rõ ràng, cho phép tái sử dụng xuyên suốt các phân hệ.',
    stateAndApiFlow:
      'Sử dụng RxJS (debounceTime, distinctUntilChanged, switchMap) kết hợp kho trạng thái một chiều NgRx/Signals để đồng bộ dữ liệu bất đồng bộ với Express REST API mà không gây giật giao diện.',
    highlights: [
      'Chuẩn hóa hơn 15 UI Component độc lập với kiểm tra kiểu dữ liệu TypeScript nghiêm ngặt',
      'Tối ưu luồng tìm kiếm & lọc dữ liệu bất đồng bộ bằng RxJS, loại bỏ hoàn toàn race-condition',
      'Kiến trúc phân tầng rõ ràng giữa giao diện người dùng và dịch vụ gọi REST API',
    ],
    stack: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'Tailwind CSS', 'REST API'],
    endpoints: ['GET /api/orders?status=active', 'PATCH /api/orders/:id/state'],
  },
  {
    id: 'editorial-commerce-spa',
    index: '02',
    slug: 'nen-tang-thuong-mai-component-react',
    title: 'Giao diện Thương mại Điện tử Tối giản & Quản lý Giỏ hàng',
    category: 'react',
    categoryLabel: 'React · TypeScript · Tailwind',
    year: '2026',
    featured: false,
    image: '/assets/images/project_reactive_commerce_1792849481297.jpg',
    summary:
      'Ứng dụng web thương mại điện tử phát triển bằng React, TypeScript và Tailwind CSS với trọng tâm là tốc độ phản hồi tức thì, bộ lọc danh mục mượt mà và cấu trúc component dễ mở rộng.',
    problem:
      'Người dùng cần tra cứu sản phẩm nhanh theo nhiều thuộc tính và cập nhật giỏ hàng liên tục trên cả máy tính lẫn thiết bị di động mà không phải tải lại trang.',
    componentStrategy:
      'Xây dựng bộ khung Product Card, Spec Comparison Drawer và Cart Summary theo mô hình hợp thành (composition), đảm bảo tính đồng nhất thị giác và khả năng truy cập bàn phím đầy đủ.',
    stateAndApiFlow:
      'Quản lý trạng thái giỏ hàng và bộ lọc đồng bộ với URL query parameters, kết nối tới dịch vụ Node.js/Express và lưu trữ dữ liệu sản phẩm trên MongoDB.',
    highlights: [
      'Giao diện chuẩn Responsive từ màn hình 1440px xuống thiết bị di động cảm ứng',
      'Tách biệt Custom Hooks quản lý dữ liệu API khỏi tầng hiển thị JSX',
      'Triển khai quy trình quản lý mã nguồn qua Git/GitHub với cấu trúc thư mục rõ ràng',
    ],
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'MongoDB'],
    endpoints: ['GET /api/catalog', 'POST /api/cart/checkout'],
  },
  {
    id: 'fullstack-task-api-workspace',
    index: '03',
    slug: 'khong-gian-quan-ly-cong-viec-express',
    title: 'Không gian Quản lý Tiến độ Dự án & Cổng Tích hợp REST API',
    category: 'fullstack',
    categoryLabel: 'Full-Stack · Express.js · MongoDB',
    year: '2025',
    featured: false,
    image: '/assets/images/project_api_workflow_hub_1792849481275.jpg',
    summary:
      'Giải pháp quản lý đầu việc nhóm tích hợp hoàn chỉnh giữa giao diện Front-end hiện đại và máy chủ Backend Express.js/MongoDB, hỗ trợ phân loại trạng thái công việc và nhật ký hoạt động.',
    problem:
      'Các nhóm sinh viên làm dự án thực tế cần một công cụ trực quan để theo dõi tiến độ từng module Front-end, Back-end và tài liệu hóa các điểm cuối REST API đang phát triển.',
    componentStrategy:
      'Thiết kế bảng tiến độ dạng thẻ (Board & List View) cùng trình xem chi tiết đặc tả API ngay trong một giao diện làm việc tập trung, không gây rối mắt.',
    stateAndApiFlow:
      'Backend Express.js xử lý định tuyến, xác thực dữ liệu đầu vào ở tầng Controller và tương tác với các Collection trên MongoDB; Frontend cập nhật giao diện phản hồi nhanh.',
    highlights: [
      'Tách biệt hoàn toàn mã nguồn thư mục /frontend và /backend theo chuẩn thực tế',
      'Thiết kế RESTful API nhất quán mã trạng thái HTTP và định dạng phản hồi JSON',
      'Tích hợp kiểm tra biểu mẫu Reactive Forms và thông báo trạng thái rõ ràng',
    ],
    stack: ['TypeScript', 'Express.js', 'Node.js', 'MongoDB', 'HTML5', 'CSS3', 'Git'],
    endpoints: ['GET /api/tasks', 'POST /api/tasks', 'PUT /api/tasks/:id'],
  },
];

const INITIAL_ARCHITECTURE_SEED: ArchitectureBlueprint = {
  overview:
    'Ngay trên chính trang Portfolio này, mã nguồn được tách biệt hoàn toàn thành 2 phân hệ độc lập: /frontend (Angular 21 + Three.js WebGL) và /backend (Node.js + Express.js REST API).',
  separationPrinciple:
    'Mọi thông tin hồ sơ, danh mục kỹ năng, dự án tiêu biểu và biểu mẫu liên hệ đều giao tiếp qua giao thức HTTP/JSON chuẩn mực giữa trình duyệt và máy chủ Express.js.',
  layers: [
    {
      layerIndex: '01',
      layerName: 'Tầng Giao diện & Không gian 3D (Frontend)',
      directory: '/frontend',
      runtime: 'Angular 21 Zoneless · TypeScript · Tailwind CSS · Three.js',
      responsibilities: [
        'Hiển thị giao diện theo kiến trúc Standalone Component tái sử dụng với OnPush Change Detection',
        'Quản lý trạng thái giao diện phản ứng bằng Angular Signals & RxJS HttpClient',
        'Dựng mô hình 3D bàn làm việc kỹ sư đa chi tiết bằng Three.js PBR theo thời gian thực',
      ],
      keyFiles: [
        'frontend/app/app.ts',
        'frontend/app/services/portfolio-api.ts',
        'frontend/app/components/three-studio/three-studio.ts',
        'frontend/app/three/workstation-builder.ts',
      ],
    },
    {
      layerIndex: '02',
      layerName: 'Tầng Dịch vụ & Định tuyến API (Backend)',
      directory: '/backend',
      runtime: 'Node.js · Express.js 5 · TypeScript',
      responsibilities: [
        'Cung cấp hệ thống REST API độc lập dưới tiền tố /api/* với định dạng phản hồi chuẩn hóa',
        'Kiểm tra tính hợp lệ của dữ liệu biểu mẫu liên hệ ở phía máy chủ (Server-side Validation)',
        'Đo lường độ trễ xử lý thực tế (X-Response-Time) và phục vụ ứng dụng web hợp nhất',
      ],
      keyFiles: [
        'backend/server.ts',
        'backend/app.ts',
        'backend/routes/portfolio.routes.ts',
        'backend/controllers/portfolio.controller.ts',
      ],
    },
  ],
  mongoSchemas: [
    {
      collection: 'projects',
      description: 'Mô hình tài liệu MongoDB lưu trữ thông tin dự án và kiến trúc kỹ thuật.',
      indexes: ['{ slug: 1 } (unique)', '{ category: 1, featured: -1 }'],
      documentSample: {
        _id: 'ObjectId("671a9c02e4b0f81294a10101")',
        slug: 'he-thong-quan-tri-component-ngrx',
        category: 'angular',
      },
    },
    {
      collection: 'contact_messages',
      description: 'Mô hình lưu trữ lời nhắn tuyển dụng và trao đổi hợp tác gửi qua POST /api/contact.',
      indexes: ['{ createdAt: -1 }', '{ senderEmail: 1 }'],
      documentSample: {
        _id: 'ObjectId("671a9c88e4b0f81294a10209")',
        senderName: 'Nhà tuyển dụng Front-end',
        status: 'received',
      },
    },
  ],
  availableEndpoints: [
    {
      method: 'GET',
      path: '/api/profile',
      description: 'Lấy thông tin giới thiệu, học vấn FPT Polytechnic và định hướng của Danh Nguyễn Chí Toàn.',
    },
    {
      method: 'GET',
      path: '/api/skills',
      description: 'Truy vấn danh sách nhóm năng lực kỹ thuật.',
    },
    {
      method: 'GET',
      path: '/api/projects',
      description: 'Truy vấn danh sách dự án thực hành.',
    },
    {
      method: 'GET',
      path: '/api/architecture',
      description: 'Xem cấu trúc tách biệt thư mục /backend - /frontend.',
    },
  ],
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    ThreeStudio,
    ProjectModal,
    ApiSandbox,
  ],
  templateUrl: './app.html',
})
export class App {
  private readonly api = inject(PortfolioApi);

  readonly profile = signal<DeveloperProfile>(INITIAL_PROFILE_FALLBACK);
  readonly skills = signal<SkillGroup[]>(INITIAL_SKILLS_SEED);
  readonly projects = signal<ProjectCaseStudy[]>(INITIAL_PROJECTS_SEED);
  readonly architecture = signal<ArchitectureBlueprint>(INITIAL_ARCHITECTURE_SEED);
  readonly receivedContactsCount = signal<number>(0);

  readonly activeSkillFilter = signal<SkillFilter>('all');
  readonly activeProjectFilter = signal<ProjectFilter>('all');
  readonly selectedProject = signal<ProjectCaseStudy | null>(null);

  readonly workspaceImgFailed = signal<boolean>(false);
  readonly failedProjectImages = signal<Record<string, boolean>>({});
  readonly emailCopied = signal<boolean>(false);

  readonly skillFilterTabs: {id: SkillFilter; label: string}[] = [
    {id: 'all', label: 'Tất cả năng lực'},
    {id: 'frontend', label: 'Front-end Cốt lõi'},
    {id: 'state', label: 'RxJS & NgRx'},
    {id: 'backend', label: 'Node.js & Express'},
    {id: 'workflow', label: 'Git & Triển khai'},
  ];

  readonly projectFilterTabs: {id: ProjectFilter; label: string}[] = [
    {id: 'all', label: 'Tất cả dự án'},
    {id: 'angular', label: 'Angular · NgRx'},
    {id: 'react', label: 'React · Tailwind'},
    {id: 'fullstack', label: 'Full-Stack Express'},
  ];

  readonly contactForm = new FormGroup({
    senderName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    senderEmail: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    organization: new FormControl('', {nonNullable: true}),
    topic: new FormControl('Cơ hội Thực tập / Fresher Front-end Developer', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    message: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),
  });

  readonly submittingContact = signal<boolean>(false);
  readonly contactSuccessRecord = signal<ContactResponseRecord | null>(null);
  readonly contactSuccessMessage = signal<string>('');
  readonly contactErrorMessage = signal<string>('');

  constructor() {
    afterNextRender(() => {
      this.syncInitialBackendData();

      // Smooth scroll reveal animations across sections using motion library
      const sections = document.querySelectorAll('section');
      for (const sec of sections) {
        if (sec.id === 'studio-3d') continue;
        const el = sec as HTMLElement;
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';

        inView(
          el,
          () => {
            animate(
              el,
              {opacity: [0, 1], transform: ['translateY(40px)', 'translateY(0px)']},
              {duration: 0.8, ease: [0.16, 1, 0.3, 1]}
            );
          },
          {amount: 0.1}
        );
      }
    });
  }

  private syncInitialBackendData(): void {
    this.api.getProfile().subscribe({
      next: (data) => this.profile.set(data),
    });
    this.api.getSkills('all').subscribe({
      next: (items) => this.skills.set(items),
    });
    this.api.getProjects('all').subscribe({
      next: (items) => this.projects.set(items),
    });
    this.api.getArchitecture().subscribe({
      next: ({blueprint, receivedContactsCount}) => {
        this.architecture.set(blueprint);
        this.receivedContactsCount.set(receivedContactsCount);
      },
    });
  }

  filterSkills(category: SkillFilter): void {
    this.activeSkillFilter.set(category);
    this.api.getSkills(category).subscribe({
      next: (items) => this.skills.set(items),
    });
  }

  filterProjects(category: ProjectFilter): void {
    this.activeProjectFilter.set(category);
    this.api.getProjects(category).subscribe({
      next: (items) => this.projects.set(items),
    });
  }

  openProjectModal(project: ProjectCaseStudy): void {
    this.selectedProject.set(project);
  }

  closeProjectModal(): void {
    this.selectedProject.set(null);
  }

  onWorkspaceImageError(): void {
    this.workspaceImgFailed.set(true);
  }

  onProjectImageError(projectId: string): void {
    this.failedProjectImages.update((prev) => ({...prev, [projectId]: true}));
  }

  isProjectImageFailed(projectId: string): boolean {
    return Boolean(this.failedProjectImages()[projectId]);
  }

  scrollToSection(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  }

  copyEmailAddress(): void {
    const email = this.profile().email;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(email).then(() => {
        this.emailCopied.set(true);
        window.setTimeout(() => this.emailCopied.set(false), 2400);
      });
    }
  }

  submitContactForm(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.submittingContact.set(true);
    this.contactErrorMessage.set('');
    this.contactSuccessMessage.set('');

    const raw = this.contactForm.getRawValue();
    this.api.submitContact(raw).subscribe({
      next: ({message, record}) => {
        this.submittingContact.set(false);
        this.contactSuccessMessage.set(message);
        this.contactSuccessRecord.set(record);
        this.receivedContactsCount.update((c) => c + 1);
        this.contactForm.reset({
          senderName: '',
          senderEmail: '',
          organization: '',
          topic: 'Cơ hội Thực tập / Fresher Front-end Developer',
          message: '',
        });
      },
      error: (err: {error?: {error?: string}}) => {
        this.submittingContact.set(false);
        this.contactErrorMessage.set(
          err?.error?.error ??
            'Không thể gửi lời nhắn lúc này. Vui lòng kiểm tra lại thông tin.',
        );
      },
    });
  }
}
