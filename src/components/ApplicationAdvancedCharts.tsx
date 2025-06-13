import React, { useMemo } from 'react';
import { JobApplication } from '../types/job';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ApplicationAdvancedChartsProps {
  applications: JobApplication[];
}

export const ApplicationAdvancedCharts: React.FC<ApplicationAdvancedChartsProps> = ({ applications }) => {
  // 计算技能匹配度雷达图数据
  const skillMatchData = useMemo(() => {
    const skillMatches = applications.map(app => ({
      name: app.job.title,
      '技能匹配度': app.matchPercentage || 0,
      '经验匹配度': Math.min(100, (app.job.requiredExperience || 0) * 20),
      '教育匹配度': app.job.requiredEducation === '本科' ? 80 : 100,
      '软技能匹配度': 70,
      '综合匹配度': 75,
    }));

    return skillMatches.slice(0, 5); // 只显示前5个职位
  }, [applications]);

  // 计算薪资分布数据
  const salaryDistribution = useMemo(() => {
    const salaryRanges = new Map<string, number>();
    applications.forEach(app => {
      const range = `${app.job.salaryRange.min}-${app.job.salaryRange.max}`;
      salaryRanges.set(range, (salaryRanges.get(range) || 0) + 1);
    });

    return Array.from(salaryRanges.entries())
      .map(([range, count]) => ({ range, count }))
      .sort((a, b) => {
        const [aMin] = a.range.split('-').map(Number);
        const [bMin] = b.range.split('-').map(Number);
        return aMin - bMin;
      });
  }, [applications]);

  // 计算处理时间趋势
  const processingTimeTrend = useMemo(() => {
    const processedApps = applications.filter(app => app.status !== 'pending');
    const timeData = new Map<string, number>();

    processedApps.forEach(app => {
      const appliedDate = new Date(app.appliedAt);
      const processedDate = new Date(app.updatedAt);
      const processingTime = Math.round(
        (processedDate.getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const date = appliedDate.toLocaleDateString();
      timeData.set(date, (timeData.get(date) || 0) + processingTime);
    });

    return Array.from(timeData.entries())
      .map(([date, totalTime]) => ({
        date,
        averageTime: Math.round(totalTime / processedApps.length),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [applications]);

  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-8">
      <h3 className="text-lg font-medium text-gray-900">高级数据分析</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 技能匹配度雷达图 */}
        <div className="h-80">
          <h4 className="text-sm font-medium text-gray-700 mb-4">职位匹配度分析</h4>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={90} data={skillMatchData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="匹配度"
                dataKey="技能匹配度"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Radar
                name="匹配度"
                dataKey="经验匹配度"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.6}
              />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* 薪资分布图 */}
        <div className="h-80">
          <h4 className="text-sm font-medium text-gray-700 mb-4">薪资分布</h4>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salaryDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} 份`, '申请数量']} />
              <Legend />
              <Area
                type="monotone"
                dataKey="count"
                name="申请数量"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 处理时间趋势图 */}
        <div className="h-80 lg:col-span-2">
          <h4 className="text-sm font-medium text-gray-700 mb-4">平均处理时间趋势</h4>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={processingTimeTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => new Date(date).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                formatter={(value) => [`${value} 天`, '平均处理时间']}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="averageTime"
                name="平均处理时间"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}; 