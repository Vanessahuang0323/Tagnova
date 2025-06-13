export type ChatRole = 'student' | 'company' | 'system';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  userId: string;
  userType: 'student' | 'company';
  messages: ChatMessage[];
  status: 'active' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatbotState {
  currentStep: number;
  context: {
    jobPreferences?: {
      industries: string[];
      positions: string[];
    };
    companyRequirements?: {
      positions: string[];
      responsibilities: string[];
      softSkills: string[];
    };
    hasPortfolio?: boolean;
    hasClubExperience?: boolean;
  };
}

export type ChatbotStep = {
  id: number;
  question: string;
  type: 'text' | 'multiple-choice' | 'file-upload';
  options?: string[];
  required: boolean;
  nextStep: number | ((context: ChatbotState['context']) => number);
}; 