export type SkillCategoryKey = 'frontend' | 'state' | 'backend' | 'workflow';

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
  category: SkillCategoryKey;
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

export interface ArchitectureBlueprint {
  overview: string;
  separationPrinciple: string;
  layers: ArchitectureLayer[];
  mongoSchemas: MongoSchemaPreview[];
  availableEndpoints: {
    method: 'GET' | 'POST';
    path: string;
    description: string;
  }[];
}

export interface ContactSubmission {
  id: string;
  senderName: string;
  senderEmail: string;
  organization: string;
  topic: string;
  message: string;
  createdAt: string;
}

export interface ContactPayload {
  senderName: string;
  senderEmail: string;
  organization?: string;
  topic: string;
  message: string;
}
