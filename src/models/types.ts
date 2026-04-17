export interface Module {
  code: string;
  name: string;
  credits: number;
  gpaIncluded: boolean;
  semester: number;
  year: number;
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
