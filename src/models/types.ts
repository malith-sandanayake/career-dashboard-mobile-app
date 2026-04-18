export interface AssessmentItem {
  label: string;
  percentage: number;
}

export interface ContentTopic {
  title: string;
  subtopics: string[];
}

export interface Module {
  code: string;
  name: string;
  credits: number;
  gpaIncluded: boolean;
  semester: number;
  year: number;
  content?: ContentTopic[];
  assessment?: AssessmentItem[];
  preRequisites?: string;
  aim?: string;
}

export interface GradeEntry {
  moduleCode: string;
  grade: string | null;
}

export type ModuleStatus = 'Completed' | 'InProgress' | 'Planned';

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  targetGPA: number;
}
