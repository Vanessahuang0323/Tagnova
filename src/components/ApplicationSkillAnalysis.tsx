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

interface ApplicationSkillAnalysisProps {
  applications: JobApplication[];
}

export const ApplicationSkillAnalysis: React.FC<ApplicationSkillAnalysisProps> = ({ applications }) => {
  // 计算技能匹配度分布
  const skillMatchDistribution = useMemo(() => {
    const matchRanges = new Map<string, number>();
    const rangeSize = 10; // 每10%一个区间

    applications.forEach(app => {
      const matchPercentage = app.matchPercentage || 0;
      const range = `${Math.floor(matchPercentage / rangeSize) * rangeSize}-${Math.floor(matchPercentage / rangeSize) * rangeSize + rangeSize}`;
      matchRanges.set(range, (matchRanges.get(range) || 0) + 1);
    });

    return Array.from(matchRanges.entries())
      .map(([range, count]) => ({
        range,
        count,
      }))
      .sort((a, b) => {
        const [aMin] = a.range.split('-').map(Number);
        const [bMin] = b.range.split('-').map(Number);
        return aMin - bMin;
      });
  }, [applications]);

  // 计算最常要求的技能
  const requiredSkills = useMemo(() => {
    const skillCounts = new Map<string, number>();

    applications.forEach(app => {
      app.job.requiredSkills.forEach(skill => {
        skillCounts.set(skill, (skillCounts.get(skill) || 0) + 1);
      });
    });

    return Array.from(skillCounts.entries())
      .map(([skill, count]) => ({
        skill,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // 只显示前10个技能
  }, [applications]);

  // 计算技能匹配度与成功率的关系
  const skillMatchSuccessRate = useMemo(() => {
    const matchRanges = new Map<string, { total: number; accepted: number }>();
    const rangeSize = 10;

    applications.forEach(app => {
      const matchPercentage = app.matchPercentage || 0;
      const range = `${Math.floor(matchPercentage / rangeSize) * rangeSize}-${Math.floor(matchPercentage / rangeSize) * rangeSize + rangeSize}`;
      const stats = matchRanges.get(range) || { total: 0, accepted: 0 };
      stats.total += 1;
      if (app.status === 'accepted') {
        stats.accepted += 1;
      }
      matchRanges.set(range, stats);
    });

    return Array.from(matchRanges.entries())
      .map(([range, stats]) => ({
        range,
        successRate: (stats.accepted / stats.total) * 100,
        totalApplications: stats.total,
      }))
      .sort((a, b) => {
        const [aMin] = a.range.split('-').map(Number);
        const [bMin] = b.range.split('-').map(Number);
        return aMin - bMin;
      });
  }, [applications]);

  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-8">
      <h3 className="text-lg font-medium text-gray-900">技能分析</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 技能匹配度分布 */}
        <div className="h-80">
          <h4 className="text-sm font-medium text-gray-700 mb-4">技能匹配度分布</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={skillMatchDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip
                formatter={(value) => [`${value} 份`, '申请数量']}
                labelFormatter={(label) => `${label}% 匹配度`}
              />
              <Legend />
              <Bar
                dataKey="count"
                name="申请数量"
                fill="#8884d8"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 最常要求的技能 */}
        <div className="h-80">
          <h4 className="text-sm font-medium text-gray-700 mb-4">最常要求的技能</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={requiredSkills}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="skill" />
              <YAxis />
              <Tooltip
                formatter={(value) => [`${value} 次`, '出现次数']}
              />
              <Legend />
              <Bar
                dataKey="count"
                name="出现次数"
                fill="#82ca9d"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 技能匹配度与成功率关系 */}
        <div className="h-80 lg:col-span-2">
          <h4 className="text-sm font-medium text-gray-700 mb-4">技能匹配度与成功率关系</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={skillMatchSuccessRate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip
                formatter={(value) => [`${value.toFixed(1)}%`, '成功率']}
                labelFormatter={(label) => `${label}% 匹配度 (${skillMatchSuccessRate.find(item => item.range === label)?.totalApplications}份申请)`}
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