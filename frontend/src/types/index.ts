// Tenant types
export interface Tenant {
  _id: string;
  name: string;
  logo?: string;
  primaryColor?: string;
  defaultLanguage: 'pt' | 'en' | 'es';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Collaborator types
export type Role = 'manager' | 'employee';

export interface Collaborator {
  _id: string;
  tenantId: string | Tenant;
  firebaseUid: string;
  name: string;
  email: string;
  role: Role;
  managerId?: string | Collaborator;
  preferredLanguage: 'pt' | 'en' | 'es';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Meeting types
export type ActionItemStatus = 'done' | 'pending' | 'blocked';
export type BlockersLevel = 'green' | 'yellow' | 'red';
export type Recognition = 'low' | 'medium' | 'high';

export interface ActionItem {
  description: string;
  status: ActionItemStatus;
}

export interface PulseHistoryItem {
  week: number;
  value: number; // 1-5
}

export interface TimeDistribution {
  execution: number; // 0-100%
  meetings: number; // 0-100%
  resolution: number; // 0-100%
}

export interface Blockers {
  level: BlockersLevel;
  tags: string[];
}

export interface BlockA {
  timeDistribution: TimeDistribution;
  blockers: Blockers;
  toolAdequacy: number; // 1-5
  priorityClarity: number; // 1-10
}

export interface BlockB {
  goalConnection: number; // 1-5
  autonomy: number; // 0-100%
  innovation: boolean;
}

export interface BlockC {
  psychologicalSafety: number; // 1-5
  collaborationFriction: number; // 1-10
  recognition: Recognition;
}

export interface IntellectualChallenge {
  skill: number; // 1-10
  challenge: number; // 1-10
}

export interface BlockD {
  intellectualChallenge: IntellectualChallenge;
  strengthsUtilization: number; // 0-100%
  activeLearning: string[];
  mentalHealth: number; // 1-5
  biweeklyFocus: string; // max 200 chars
}

export interface Meeting {
  meetingNumber: number;
  date: Date | string;
  actionItems: ActionItem[];
  pulseHistory: PulseHistoryItem[];
  blockA?: BlockA;
  blockB?: BlockB;
  blockC?: BlockC;
  blockD?: BlockD;
}

export interface MeetingJourney {
  _id: string;
  tenantId: string | Tenant;
  collaboratorId: string | Collaborator;
  managerId: string | Collaborator;
  year: number;
  meetings: Meeting[];
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface AuthState {
  user: User | null;
  collaborator: Collaborator | null;
  loading: boolean;
  error: string | null;
}

// Analytics types
export interface PulseTrend {
  average: number;
  trajectory: 'improving' | 'declining' | 'stable';
  recentValues: number[];
}

export interface BlockAverage {
  blockA: {
    toolAdequacy: number;
    priorityClarity: number;
  };
  blockB: {
    goalConnection: number;
    autonomy: number;
    innovationRate: number;
  };
  blockC: {
    psychologicalSafety: number;
    collaborationFriction: number;
  };
  blockD: {
    mentalHealth: number;
    strengthsUtilization: number;
  };
}

export interface FlowState {
  averageSkill: number;
  averageChallenge: number;
  state: 'flow' | 'anxiety' | 'boredom' | 'apathy';
}

export interface ActionItemsStats {
  total: number;
  done: number;
  pending: number;
  blocked: number;
  completionRate: number;
}

export interface AnnualReport {
  collaboratorId: string;
  year: number;
  totalMeetings: number;
  pulseTrend: PulseTrend;
  blockAverages: BlockAverage;
  flowState: FlowState;
  actionItems: ActionItemsStats;
  topBlockers: Array<{ tag: string; count: number }>;
  learningAreas: string[];
}
