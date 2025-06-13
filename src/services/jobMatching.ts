import { Job, JobMatch } from '../types/job';
import { StudentProfile, CompanyProfile } from '../types/user';

export class JobMatchingService {
  private static calculateSkillMatch(studentSkills: string[], jobSkills: string[]): number {
    const matchingSkills = studentSkills.filter(skill => jobSkills.includes(skill));
    return (matchingSkills.length / jobSkills.length) * 100;
  }

  private static calculatePersonalityMatch(
    studentPersonality: Record<string, number> | undefined,
    jobSoftSkills: string[]
  ): number {
    if (!studentPersonality) return 0;

    // Map personality traits to soft skills
    const personalityToSoftSkills: Record<string, string[]> = {
      extraversion: ['溝通能力', '團隊合作', '領導力'],
      agreeableness: ['團隊合作', '溝通能力'],
      conscientiousness: ['抗壓性', '責任感'],
      neuroticism: ['抗壓性'],
      openness: ['創意', '學習能力']
    };

    let matchScore = 0;
    for (const softSkill of jobSoftSkills) {
      for (const [trait, skills] of Object.entries(personalityToSoftSkills)) {
        if (skills.includes(softSkill)) {
          matchScore += studentPersonality[trait] || 0;
        }
      }
    }

    return (matchScore / jobSoftSkills.length) * 100;
  }

  private static calculateExperienceMatch(
    student: StudentProfile,
    job: Job
  ): number {
    let score = 0;

    // Check portfolio
    if (student.portfolio?.projects.length) {
      score += 30;
    }

    // Check club experience
    if (student.clubExperience) {
      score += 20;
    }

    // Check other experience
    if (student.otherExperience) {
      score += 20;
    }

    // Check if student's department matches job requirements
    if (job.requirements.education && 
        student.department.toLowerCase().includes(job.requirements.education.toLowerCase())) {
      score += 30;
    }

    return score;
  }

  public static calculateJobMatch(
    student: StudentProfile,
    job: Job
  ): JobMatch {
    const skillMatch = this.calculateSkillMatch(student.skills, job.requirements.skills);
    const personalityMatch = this.calculatePersonalityMatch(
      student.personalityTest?.results,
      job.requirements.softSkills
    );
    const experienceMatch = this.calculateExperienceMatch(student, job);

    const totalMatch = (skillMatch * 0.5) + (personalityMatch * 0.3) + (experienceMatch * 0.2);

    return {
      jobId: job.id,
      studentId: student.id,
      matchPercentage: Math.round(totalMatch),
      matchDetails: {
        skillMatch: Math.round(skillMatch),
        personalityMatch: Math.round(personalityMatch),
        experienceMatch: Math.round(experienceMatch)
      }
    };
  }

  public static findMatchingJobs(
    student: StudentProfile,
    jobs: Job[],
    minMatchPercentage: number = 50
  ): JobMatch[] {
    return jobs
      .map(job => this.calculateJobMatch(student, job))
      .filter(match => match.matchPercentage >= minMatchPercentage)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  }

  public static findMatchingStudents(
    job: Job,
    students: StudentProfile[],
    minMatchPercentage: number = 50
  ): JobMatch[] {
    return students
      .map(student => this.calculateJobMatch(student, job))
      .filter(match => match.matchPercentage >= minMatchPercentage)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  }
} 