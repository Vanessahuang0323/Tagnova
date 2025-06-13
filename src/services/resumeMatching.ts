import { StudentProfile } from '../types/user';
import { JobPosting, JobRequirements } from '../types/job';

interface MatchScore {
  jobId: string;
  score: number;
  reasons: string[];
}

const calculateSkillMatch = (
  resumeSkills: StudentProfile['skills'],
  jobRequirements: JobRequirements
): { score: number; reasons: string[] } => {
  const reasons: string[] = [];
  let score = 0;

  // 计算技术技能匹配度
  const technicalMatch = resumeSkills.technical.filter(skill =>
    jobRequirements.technical.some((req: string) =>
      req.toLowerCase().includes(skill.toLowerCase())
    )
  );

  const technicalScore = (technicalMatch.length / jobRequirements.technical.length) * 0.4;
  score += technicalScore;

  if (technicalMatch.length > 0) {
    reasons.push(`匹配技术技能: ${technicalMatch.join(', ')}`);
  }

  // 计算软技能匹配度
  const softMatch = resumeSkills.soft.filter(skill =>
    jobRequirements.soft.some((req: string) =>
      req.toLowerCase().includes(skill.toLowerCase())
    )
  );

  const softScore = (softMatch.length / jobRequirements.soft.length) * 0.3;
  score += softScore;

  if (softMatch.length > 0) {
    reasons.push(`匹配软技能: ${softMatch.join(', ')}`);
  }

  return { score, reasons };
};

const calculateExperienceMatch = (
  resumeExperience: StudentProfile['experience'],
  jobRequirements: JobPosting['requirements']
): { score: number; reasons: string[] } => {
  const reasons: string[] = [];
  let score = 0;

  // 检查工作经验要求
  const requiredExperience = jobRequirements.experience;
  const hasRequiredExperience = resumeExperience.some(exp =>
    exp.description.toLowerCase().includes(requiredExperience.toLowerCase())
  );

  if (hasRequiredExperience) {
    score += 0.2;
    reasons.push('符合工作经验要求');
  }

  // 检查教育背景要求
  const requiredEducation = jobRequirements.education;
  const hasRequiredEducation = resumeExperience.some(exp =>
    exp.description.toLowerCase().includes(requiredEducation.toLowerCase())
  );

  if (hasRequiredEducation) {
    score += 0.1;
    reasons.push('符合教育背景要求');
  }

  return { score, reasons };
};

export const findMatchingJobs = async (
  resume: StudentProfile,
  jobs: JobPosting[]
): Promise<MatchScore[]> => {
  const matchScores: MatchScore[] = [];

  for (const job of jobs) {
    const skillMatch = calculateSkillMatch(resume.skills, job.requirements);
    const experienceMatch = calculateExperienceMatch(resume.experience, job.requirements);

    const totalScore = skillMatch.score + experienceMatch.score;
    const allReasons = [...skillMatch.reasons, ...experienceMatch.reasons];

    matchScores.push({
      jobId: job.id,
      score: totalScore,
      reasons: allReasons,
    });
  }

  // 按匹配分数降序排序
  return matchScores.sort((a, b) => b.score - a.score);
};

export const getJobRecommendations = async (
  userId: string,
  limit: number = 5
): Promise<Array<JobPosting & { matchScore: number; matchReasons: string[] }>> => {
  try {
    // 获取用户简历
    const response = await fetch(`/api/resumes/${userId}`);
    if (!response.ok) {
      throw new Error('获取简历失败');
    }
    const resume: StudentProfile = await response.json();

    // 获取所有工作机会
    const jobsResponse = await fetch('/api/jobs');
    if (!jobsResponse.ok) {
      throw new Error('获取工作机会失败');
    }
    const jobs: JobPosting[] = await jobsResponse.json();

    // 计算匹配度
    const matchScores = await findMatchingJobs(resume, jobs);

    // 返回推荐的工作机会
    return matchScores
      .slice(0, limit)
      .map(match => {
        const job = jobs.find(j => j.id === match.jobId);
        if (!job) return null;
        return {
          ...job,
          matchScore: match.score,
          matchReasons: match.reasons,
        };
      })
      .filter((job): job is JobPosting & { matchScore: number; matchReasons: string[] } => job !== null);
  } catch (error) {
    console.error('获取工作推荐失败:', error);
    throw error;
  }
}; 