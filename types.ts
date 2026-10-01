
export interface User {
  id: string;
  email: string;
  name: string;
  token: string;
}

export interface AnalysisResult {
  matchPercentage: number;
  jobTitleMatch: string;
  topSkillsFound: string[];
  missingCriticalSkills: string[];
  experienceMatch: 'High' | 'Medium' | 'Low';
  overallSummary: string;
  actionableRecommendations: string[];
  suggestedBulletPoints: string[];
  interviewPrep: {
    technicalQuestions: { question: string; targetAnswer: string }[];
    behavioralQuestions: { question: string; strategy: string }[];
  };
}

export interface ResumeData {
  fileName: string;
  content: string;
  fileSize: number;
}

export interface SavedAnalysis {
  id: string;
  timestamp: number;
  fileName: string;
  jobTitle: string;
  matchPercentage: number;
  result: AnalysisResult;
}

export enum AppState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export enum View {
  HOME = 'HOME',
  SCREENER = 'SCREENER',
  JD_GEN = 'JD_GEN',
  HISTORY = 'HISTORY',
  AUTH = 'AUTH',
  TEAM = 'TEAM'
}
