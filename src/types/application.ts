export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  requirements: string;
  industry: string;
  experience: string;
  education: string;
  tags: string[];
}

export interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  status: 'pending' | 'interviewing' | 'offered' | 'rejected';
  appliedAt: string;
  job: Job;
  interviewDate?: string;
  interviewType?: 'online' | 'onsite' | 'phone';
  interviewFeedback?: string;
  offerDetails?: {
    salary: string;
    benefits: string[];
    startDate: string;
  };
} 