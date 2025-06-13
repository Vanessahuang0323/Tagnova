import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  matchScore: number;
  matchReasons: string[];
  requirements: {
    skills: string[];
    experience: string;
    education: string;
  };
}

export const JobRecommendationPage: React.FC = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // 模拟获取推荐数据
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setRecommendations([
          {
            id: '1',
            title: '高级前端开发工程师',
            company: '科技公司A',
            location: '台北市',
            salary: {
              min: 80000,
              max: 120000,
              currency: 'TWD'
            },
            matchScore: 0.92,
            matchReasons: [
              '技能匹配度高达95%',
              '经验要求完全符合',
              '教育背景符合要求'
            ],
            requirements: {
              skills: ['React', 'TypeScript', 'Node.js'],
              experience: '3年以上',
              education: '本科及以上'
            }
          },
          {
            id: '2',
            title: '全栈开发工程师',
            company: '科技公司B',
            location: '新北市',
            salary: {
              min: 70000,
              max: 100000,
              currency: 'TWD'
            },
            matchScore: 0.85,
            matchReasons: [
              '技能匹配度达85%',
              '经验要求符合',
              '教育背景符合要求'
            ],
            requirements: {
              skills: ['JavaScript', 'Python', 'Django'],
              experience: '2年以上',
              education: '本科及以上'
            }
          },
          {
            id: '3',
            title: '前端开发工程师',
            company: '科技公司C',
            location: '台中市',
            salary: {
              min: 60000,
              max: 90000,
              currency: 'TWD'
            },
            matchScore: 0.78,
            matchReasons: [
              '技能匹配度达80%',
              '经验要求基本符合',
              '教育背景符合要求'
            ],
            requirements: {
              skills: ['Vue.js', 'JavaScript', 'CSS'],
              experience: '1年以上',
              education: '本科及以上'
            }
          }
        ]);
      } catch (error) {
        console.error('获取推荐失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const handleApply = (jobId: string) => {
    // 处理申请逻辑
    console.log('申请职位:', jobId);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">智能职位推荐</h1>
      
      <div className="space-y-6">
        {recommendations.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                <p className="text-gray-600">{job.company} · {job.location}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-blue-600">
                  {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()} {job.salary.currency}
                </div>
                <div className="text-sm text-gray-500">
                  匹配度: {(job.matchScore * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">匹配原因</h3>
              <ul className="space-y-1">
                {job.matchReasons.map((reason, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">职位要求</h3>
              <div className="flex flex-wrap gap-2">
                {job.requirements.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <p>经验要求: {job.requirements.experience}</p>
                <p>教育要求: {job.requirements.education}</p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => handleApply(job.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                立即申请
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 