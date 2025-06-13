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

interface ApplicationSalaryAnalysisProps {
  applications: JobApplication[];
}

export const ApplicationSalaryAnalysis: React.FC<ApplicationSalaryAnalysisProps> = ({ applications }) => {
  // 计算薪资范围分布
  const salaryRangeDistribution = useMemo(() => {
    const rangeStats = new Map<string, number>();
    const rangeSize = 5000; // 每5000一个区间

    applications.forEach(app => {
      const minSalary = app.job.salaryRange.min;
      const range = `${Math.floor(minSalary / rangeSize) * rangeSize}-${Math.floor(minSalary / rangeSize) * rangeSize + rangeSize}`;
      rangeStats.set(range, (rangeStats.get(range) || 0) + 1);
    });

    return Array.from(rangeStats.entries())
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

  // 计算不同行业的平均薪资
  const industryAverageSalary = useMemo(() => {
    const industryStats = new Map<string, { total: number; sum: number }>();

    applications.forEach(app => {
      const industry = app.job.industry;
      const avgSalary = (app.job.salaryRange.min + app.job.salaryRange.max) / 2;
      const stats = industryStats.get(industry) || { total: 0, sum: 0 };
      stats.total += 1;
      stats.sum += avgSalary;
      industryStats.set(industry, stats);
    });

    return Array.from(industryStats.entries())
      .map(([industry, stats]) => ({
        industry,
        averageSalary: Math.round(stats.sum / stats.total),
        totalApplications: stats.total,
      }))
      .sort((a, b) => b.averageSalary - a.averageSalary)
      .slice(0, 10); // 只显示前10个行业
  }, [applications]);

  // 计算薪资与成功率的关系
  const salarySuccessRate = useMemo(() => {
    const salaryStats = new Map<string, { total: number; accepted: number }>();
    const rangeSize = 5000;

    applications.forEach(app => {
      const minSalary = app.job.salaryRange.min;
      const range = `${Math.floor(minSalary / rangeSize) * rangeSize}-${Math.floor(minSalary / rangeSize) * rangeSize + rangeSize}`;
      const stats = salaryStats.get(range) || { total: 0, accepted: 0 };
      stats.total += 1;
      if (app.status === 'accepted') {
        stats.accepted += 1;
      }
      salaryStats.set(range, stats);
    });

    return Array.from(salaryStats.entries())
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
      <h3 className="text-lg font-medium text-gray-900">薪资分析</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 薪资范围分布 */}
        <div className="h-80">
          <h4 className="text-sm font-medium text-gray-700 mb-4">薪资范围分布</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salaryRangeDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip
                formatter={(value) => [`${value} 份`, '申请数量']}
                labelFormatter={(label) => `${label}元`}
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

        {/* 行业平均薪资 */}
        <div className="h-80">
          <h4 className="text-sm font-medium text-gray-700 mb-4">行业平均薪资</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={industryAverageSalary}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="industry" />
              <YAxis />
              <Tooltip
                formatter={(value) => [`${value}元`, '平均薪资']}
                labelFormatter={(label) => `${label} (${industryAverageSalary.find(item => item.industry === label)?.totalApplications}份申请)`}
              />
              <Legend />
              <Bar
                dataKey="averageSalary"
                name="平均薪资"
                fill="#82ca9d"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 薪资与成功率关系 */}
        <div className="h-80 lg:col-span-2">
          <h4 className="text-sm font-medium text-gray-700 mb-4">薪资与成功率关系</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salarySuccessRate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip
                formatter={(value) => [`${value.toFixed(1)}%`, '成功率']}
                labelFormatter={(label) => `${label}元 (${salarySuccessRate.find(item => item.range === label)?.totalApplications}份申请)`}
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