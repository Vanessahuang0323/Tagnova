import React, { useEffect, useState } from 'react';
import { JobPosting } from '../types/job';
import { getJobRecommendations } from '../services/resumeMatching';
import { useAuth } from '../contexts/AuthContext';
import { JobCard } from './JobCard';

interface JobRecommendation extends JobPosting {
  matchScore: number;
  matchReasons: string[];
}

export const JobRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!user) {
        setError('请先登录');
        setLoading(false);
        return;
      }

      try {
        const jobs = await getJobRecommendations(user.id);
        setRecommendations(jobs);
      } catch (err) {
        setError('获取工作推荐失败');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500">暂无推荐的工作机会</p>
        <p className="text-sm text-gray-400 mt-2">请完善您的简历以获取更多推荐</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">为您推荐的工作</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((job) => (
          <div key={job.id} className="relative">
            <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
              匹配度: {Math.round(job.matchScore * 100)}%
            </div>
            <JobCard
              job={job}
              matchPercentage={job.matchScore}
              onSwipeLeft={() => {}}
              onSwipeRight={() => {}}
            />
            <div className="mt-2 text-sm text-gray-600">
              <p className="font-medium">匹配原因:</p>
              <ul className="list-disc list-inside">
                {job.matchReasons.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 