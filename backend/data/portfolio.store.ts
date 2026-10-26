import {
  ArchitectureBlueprint,
  ContactPayload,
  ContactSubmission,
  DeveloperProfile,
  ProjectCaseStudy,
  SkillGroup,
} from '../models/portfolio.model';

export const DEVELOPER_PROFILE: DeveloperProfile = {
  fullName: 'Danh Nguyễn Chí Toàn',
  role: 'Front-end Developer',
  headline:
    'Xây dựng giao diện web chuẩn mực theo tư duy Component tái sử dụng và quản lý trạng thái phản ứng.',
  summary:
    'Tôi có nền tảng kiến thức về Công nghệ thông tin tại FPT Polytechnic, định hướng phát triển chuyên sâu theo lĩnh vực Front-end Development. Tập trung vào việc kết hợp nền tảng TypeScript vững chắc cùng hệ sinh thái Angular, React và Tailwind CSS để kiến tạo những giao diện mạch lạc, dễ mở rộng và tối ưu trải nghiệm người dùng.',
  philosophy: [
    'Tôi có kiến thức về HTML, CSS, JavaScript, TypeScript, Angular, React và Tailwind CSS, đồng thời tìm hiểu chuyên sâu về RxJS, NgRx, quản lý trạng thái bất đồng bộ và xây dựng giao diện theo hướng component tái sử dụng.',
    'Bên cạnh mảng giao diện, tôi trang bị kiến thức về Node.js, Express.js, MongoDB và thiết kế REST API chuẩn mực, cùng kinh nghiệm làm việc nhóm với Git, GitHub và quy trình triển khai ứng dụng web thực tế.',
    'Tôi luôn chủ động học hỏi công nghệ mới, rèn luyện tư duy lập trình có hệ thống, khả năng phân tích giải quyết vấn đề và mong muốn phát triển chuyên môn lâu dài trong môi trường làm việc thực tế.',
  ],
  email: 'toandncps39584@gmail.com',
  github: 'https://github.com',
  location: 'TP. Hồ Chí Minh, Việt Nam',
  education: {
    institution: 'FPT Polytechnic',
    program: 'Chuyên ngành Công nghệ thông tin',
    focus: 'Định hướng phát triển Front-end Development & Web Engineering',
    location: 'Việt Nam',
  },
  workspaceImage: '/assets/images/workspace_editorial_desk_1792849479333.jpg',
  metrics: [
    {
      value: 'FPT Polytechnic',
      label: 'Nền tảng đào tạo thực chiến',
      detail: 'Công nghệ thông tin · Tư duy lập trình & giải quyết vấn đề',
    },
    {
      value: '07 Công nghệ UI',
      label: 'Hệ sinh thái Front-end cốt lõi',
      detail: 'HTML · CSS · JavaScript · TypeScript · Angular · React · Tailwind CSS',
    },
    {
      value: 'RxJS · NgRx',
      label: 'Quản lý trạng thái & Luồng dữ liệu',
      detail: 'Reactive Streams · Unidirectional State · Reusable Components',
    },
    {
      value: 'REST · Express',
      label: 'Kết nối Full-Stack & Triển khai',
      detail: 'Node.js · Express.js · MongoDB · Git · GitHub · Web Deployment',
    },
  ],
};

export const SKILL_GROUPS: SkillGroup[] = [
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
      'Xử lý các luồng sự kiện phức tạp, tìm kiếm thời gian thực, đồng bộ hóa dữ liệu từ REST API bằng toán tử RxJS và quản lý vòng đời trạng thái một chiều minh bạch thông qua NgRx Store / Signals.',
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

export const PROJECT_CASE_STUDIES: ProjectCaseStudy[] = [
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

export const ARCHITECTURE_BLUEPRINT: ArchitectureBlueprint = {
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
        stack: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'Tailwind CSS'],
      },
    },
    {
      collection: 'contact_messages',
      description: 'Mô hình lưu trữ lời nhắn tuyển dụng và trao đổi hợp tác gửi qua POST /api/contact.',
      indexes: ['{ createdAt: -1 }', '{ senderEmail: 1 }'],
      documentSample: {
        _id: 'ObjectId("671a9c88e4b0f81294a10209")',
        senderName: 'Nhà tuyển dụng Front-end',
        topic: 'Trao đổi cơ hội thực tập / làm việc Front-end',
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
      description: 'Truy vấn danh sách nhóm năng lực kỹ thuật (hỗ trợ lọc ?category=frontend|state|backend|workflow).',
    },
    {
      method: 'GET',
      path: '/api/projects',
      description: 'Truy vấn danh sách dự án thực hành (hỗ trợ lọc ?category=angular|react|fullstack).',
    },
    {
      method: 'GET',
      path: '/api/architecture',
      description: 'Xem cấu trúc tách biệt thư mục /backend - /frontend và lược đồ dữ liệu MongoDB.',
    },
  ],
};

class PortfolioStore {
  private readonly messages: ContactSubmission[] = [];

  getProfile(): DeveloperProfile {
    return DEVELOPER_PROFILE;
  }

  getSkills(category?: string): SkillGroup[] {
    if (!category || category === 'all') {
      return SKILL_GROUPS;
    }
    return SKILL_GROUPS.filter((item) => item.category === category);
  }

  getProjects(category?: string): ProjectCaseStudy[] {
    if (!category || category === 'all') {
      return PROJECT_CASE_STUDIES;
    }
    return PROJECT_CASE_STUDIES.filter((project) => project.category === category);
  }

  getProjectBySlug(slug: string): ProjectCaseStudy | undefined {
    return PROJECT_CASE_STUDIES.find((project) => project.slug === slug);
  }

  getArchitecture(): ArchitectureBlueprint {
    return ARCHITECTURE_BLUEPRINT;
  }

  saveContactMessage(payload: ContactPayload): ContactSubmission {
    const record: ContactSubmission = {
      id: `msg_${Date.now().toString(36)}`,
      senderName: payload.senderName.trim(),
      senderEmail: payload.senderEmail.trim(),
      organization: (payload.organization ?? '').trim() || 'Cá nhân / Doanh nghiệp',
      topic: payload.topic.trim(),
      message: payload.message.trim(),
      createdAt: new Date().toISOString(),
    };
    this.messages.unshift(record);
    return record;
  }

  getRecentMessagesCount(): number {
    return this.messages.length;
  }
}

export const portfolioStore = new PortfolioStore();
