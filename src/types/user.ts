export type Gender = 'male' | 'female' | 'other';

export interface PersonalityTestResults {
  extraversion: number;
  agreeableness: number;
  conscientiousness: number;
  neuroticism: number;
  openness: number;
}

export interface PersonalityTest {
  completed: boolean;
  results?: PersonalityTestResults;
}

export interface Education {
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
  gpa?: number;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Skills {
  technical: string[];
  soft: string[];
}

export interface StudentProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  education: Education[];
  experience: Experience[];
  skills: Skills;
  interests: string[];
  preferredLocations: string[];
  preferredJobTypes: string[];
  expectedSalary?: {
    min: number;
    max: number;
    currency: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CompanyProfile {
  id: string;
  email: string;
  name: string;
  description: string;
  industry: string;
  size: string;
  location: string;
  website?: string;
  logo?: string;
  foundedYear?: number;
  benefits: string[];
  createdAt: string;
  updatedAt: string;
}

export interface JobPosting {
  id: string;
  companyId: string;
  title: string;
  description: string;
  requirements: {
    technical: string[];
    soft: string[];
    experience: string;
    education: string;
  };
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  benefits: string[];
  location: string;
  type: string;
  postedDate: string;
  deadline?: string;
  status: 'active' | 'closed';
}

export type UserType = 'student' | 'company'; 