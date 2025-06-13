import React, { useMemo } from 'react';
import { JobApplication } from '../types/job';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ApplicationSuccessAnalysisProps {
  applications: JobApplication[];
}

export const ApplicationSuccessAnalysis: React.FC<ApplicationSuccessAnalysisProps> = ({ applications }) => {
  // 计算不同行业的申请成功率
  const industrySuccessRates = useMemo(() => {
    const industryStats = new Map<string, { total: number; accepted: number }>();

    applications.forEach(app => {
      const industry = app.job.industry;
      const stats = industryStats.get(industry) || { total: 0, accepted: 0 };
      stats.total += 1;
      if (app.status === 'accepted') {
        stats.accepted += 1;
      }
      industryStats.set(industry, stats);
    });

    return Array.from(industryStats.entries())
      .map(([industry, stats]) => ({
        industry,
        successRate: (stats.accepted / stats.total) * 100,
        totalApplications: stats.total,
      }))
      .sort((a, b) => b.successRate - a.successRate)
      .slice(0, 5); // 只显示前5个行业
  }, [applications]);

  // 计算不同经验要求的申请成功率
  const experienceSuccessRates = useMemo(() => {
    const experienceStats = new Map<string, { total: number; accepted: number }>();

    applications.forEach(app => {
      const experience = `${app.job.requiredExperience}年`;
      const stats = experienceStats.get(experience) || { total: 0, accepted: 0 };
      stats.total += 1;
      if (app.status === 'accepted') {
        stats.accepted += 1;
      }
      experienceStats.set(experience, stats);
    });

    return Array.from(experienceStats.entries())
      .map(([experience, stats]) => ({
        experience,
        successRate: (stats.accepted / stats.total) * 100,
        totalApplications: stats.total,
      }))
      .sort((a, b) => {
        const aYears = parseInt(a.experience);
        const bYears = parseInt(b.experience);
        return aYears - bYears;
      });
  }, [applications]);

  // 计算不同教育背景的申请成功率
  const educationSuccessRates = useMemo(() => {
    const educationStats = new Map<string, { total: number; accepted: number }>();

    applications.forEach(app => {
      const education = app.job.requiredEducation;
      const stats = educationStats.get(education) || { total: 0, accepted: 0 };
      stats.total += 1;
      if (app.status === 'accepted') {
        stats.accepted += 1;
      }
      educationStats.set(education, stats);
    });

    return Array.from(educationStats.entries())
      .map(([education, stats]) => ({
        education,
        successRate: (stats.accepted / stats.total) * 100,
        totalApplications: stats.total,
      }))
      .sort((a, b) => b.successRate - a.successRate);
  }, [applications]);

  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-8">
      <h3 className="text-lg font-medium text-gray-900">申请成功率分析</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 行业成功率 */}
        <div className="h-80">
          <h4 className="text-sm font-medium text-gray-700 mb-4">行业申请成功率</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={industrySuccessRates}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="industry" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(1)}%`, '成功率']}
                labelFormatter={(label) => `${label} (${industrySuccessRates.find(item => item.industry === label)?.totalApplications}份申请)`}
              />
              <Legend />
              <Bar
                dataKey="successRate"
                name="成功率"
                fill="#8884d8"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 经验要求成功率 */}
        <div className="h-80">
          <h4 className="text-sm font-medium text-gray-700 mb-4">经验要求成功率</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={experienceSuccessRates}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="experience" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(1)}%`, '成功率']}
                labelFormatter={(label) => `${label} (${experienceSuccessRates.find(item => item.experience === label)?.totalApplications}份申请)`}
              />
              <Legend />
              <Bar
                dataKey="successRate"
                name="成功率"
                fill="#82ca9d"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 教育背景成功率 */}
        <div className="h-80 lg:col-span-2">
          <h4 className="text-sm font-medium text-gray-700 mb-4">教育背景成功率</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={educationSuccessRates}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="education" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(1)}%`, '成功率']}
                labelFormatter={(label) => `${label} (${educationSuccessRates.find(item => item.education === label)?.totalApplications}份申请)`}
              />
              <Legend />
              <Bar
                dataKey="successRate"
                name="成功率"
                fill="#ffc658"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}; 