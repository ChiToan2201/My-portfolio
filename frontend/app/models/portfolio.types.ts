export type SkillFilter = 'all' | 'frontend' | 'state' | 'backend' | 'workflow';
export type ProjectFilter = 'all' | 'angular' | 'react' | 'fullstack';

export interface EducationInfo {
  institution: string;
  program: string;
  focus: string;
  location: string;
}

export interface ProfileMetric {
  value: string;
  label: string;
  detail: string;
}

export interface DeveloperProfile {
  fullName: string;
  role: string;
  headline: string;
  summary: string;
  philosophy: string[];
  email: string;
  github: string;
  location: string;
  education: EducationInfo;
  workspaceImage: string;
  metrics: ProfileMetric[];
}

export interface SkillGroup {
  id: string;
  index: string;
  category: 'frontend' | 'state' | 'backend' | 'workflow';
  categoryLabel: string;
  title: string;
  technologies: string[];
  practicalApplication: string;
  architecturalFocus: string;
}

export interface ProjectCaseStudy {
  id: string;
  index: string;
  slug: string;
  title: string;
  category: 'angular' | 'react' | 'fullstack';
  categoryLabel: string;
  year: string;
  featured: boolean;
  image: string;
  summary: string;
  problem: string;
  componentStrategy: string;
  stateAndApiFlow: string;
  highlights: string[];
  stack: string[];
  endpoints: string[];
}

export interface ArchitectureLayer {
  layerIndex: string;
  layerName: string;
  directory: string;
  runtime: string;
  responsibilities: string[];
  keyFiles: string[];
}

export interface MongoSchemaPreview {
  collection: string;
  description: string;
  indexes: string[];
  documentSample: Record<string, string | string[]>;
}

export interface EndpointDescriptor {
  method: 'GET' | 'POST';
  path: string;
  description: string;
}

export interface ArchitectureBlueprint {
  overview: string;
  separationPrinciple: string;
  layers: ArchitectureLayer[];
  mongoSchemas: MongoSchemaPreview[];
  availableEndpoints: EndpointDescriptor[];
}

export interface ContactRequestPayload {
  senderName: string;
  senderEmail: string;
  organization: string;
  topic: string;
  message: string;
}

export interface ContactResponseRecord {
  id: string;
  senderName: string;
  senderEmail: string;
  organization: string;
  topic: string;
  message: string;
  createdAt: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  source?: string;
  message?: string;
  error?: string;
  count?: number;
  receivedContactsCount?: number;
  data: T;
}

export interface ApiInspectionResult {
  endpoint: string;
  method: string;
  status: number;
  clientDurationMs: number;
  serverDurationMs: string;
  payloadPreview: string;
}

export type StudioCameraPreset = 'overview' | 'frontend' | 'state' | 'backend';
export type StudioFinishTheme = 'architect' | 'carbon' | 'brass';

export interface StudioStationInfo {
  id: StudioCameraPreset;
  code: string;
  title: string;
  subtitle: string;
  detail: string;
}

export const STUDIO_STATIONS: Record<StudioCameraPreset, StudioStationInfo> = {
  overview: {
    id: 'overview',
    code: '00',
    title: 'Không gian Kỹ thuật Front-end & Web',
    subtitle: 'Danh Nguyễn Chí Toàn · FPT Polytechnic',
    detail:
      'Xoay chuột để quan sát toàn cảnh mô hình 3D bàn làm việc, nhấp vào màn hình hoặc tháp kiến trúc 4 tầng để xem chi tiết từng mảng kỹ năng.',
  },
  frontend: {
    id: 'frontend',
    code: '01',
    title: 'Giao diện Component Tái sử dụng',
    subtitle: 'HTML · CSS · JS · TypeScript · Angular · React · Tailwind CSS',
    detail:
      'Màn hình chính minh họa cách chia nhỏ giao diện thành các Component độc lập, kiểm soát kiểu dữ liệu chặt chẽ và tối ưu khả năng bảo trì.',
  },
  state: {
    id: 'state',
    code: '02',
    title: 'Quản lý Trạng thái & Luồng Phản ứng',
    subtitle: 'RxJS · NgRx · Signals · Unidirectional Data Flow',
    detail:
      'Tháp kiến trúc 4 tầng bên phải thể hiện cách đồng bộ trạng thái giữa UI Component, kho lưu trữ RxJS/NgRx, REST API và cơ sở dữ liệu.',
  },
  backend: {
    id: 'backend',
    code: '03',
    title: 'Kết nối Backend REST API & Triển khai',
    subtitle: 'Node.js · Express.js · MongoDB · Git & GitHub',
    detail:
      'Màn hình dọc bên trái hiển thị cấu trúc định tuyến Express.js tách biệt hoàn toàn với Frontend cùng mô hình tài liệu MongoDB.',
  },
};

export const INITIAL_PROFILE_FALLBACK: DeveloperProfile = {
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
