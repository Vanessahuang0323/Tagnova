import React, { useMemo } from 'react';
import { JobApplication } from '../types/job';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ApplicationTimeAnalysisProps {
  applications: JobApplication[];
}

export const ApplicationTimeAnalysis: React.FC<ApplicationTimeAnalysisProps> = ({ applications }) => {
  // 计算每日申请数量
  const dailyApplications = useMemo(() => {
    const dailyStats = new Map<string, number>();

    applications.forEach(app => {
      const date = new Date(app.appliedDate).toLocaleDateString();
      dailyStats.set(date, (dailyStats.get(date) || 0) + 1);
    });

    return Array.from(dailyStats.entries())
      .map(([date, count]) => ({
        date,
        count,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [applications]);

  // 计算每周申请数量
  const weeklyApplications = useMemo(() => {
    const weeklyStats = new Map<string, number>();

    applications.forEach(app => {
      const date = new Date(app.appliedDate);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toLocaleDateString();
      weeklyStats.set(weekKey, (weeklyStats.get(weekKey) || 0) + 1);
    });

    return Array.from(weeklyStats.entries())
      .map(([week, count]) => ({
        week,
        count,
      }))
      .sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime());
  }, [applications]);

  // 计算每月申请数量
  const monthlyApplications = useMemo(() => {
    const monthlyStats = new Map<string, number>();

    applications.forEach(app => {
      const date = new Date(app.appliedDate);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      monthlyStats.set(monthKey, (monthlyStats.get(monthKey) || 0) + 1);
    });

    return Array.from(monthlyStats.entries())
      .map(([month, count]) => ({
        month,
        count,
      }))
      .sort((a, b) => {
        const [aYear, aMonth] = a.month.split('-').map(Number);
        const [bYear, bMonth] = b.month.split('-').map(Number);
        return aYear === bYear ? aMonth - bMonth : aYear - bYear;
      });
  }, [applications]);

  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-8">
      <h3 className="text-lg font-medium text-gray-900">申请时间分析</h3>

      <div className="grid grid-cols-1 gap-8">
        {/* 每日申请趋势 */}
        <div className="h-80">
          <h4 className="text-sm font-medium text-gray-700 mb-4">每日申请趋势</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyApplications}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => new Date(date).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                formatter={(value) => [`${value} 份`, '申请数量']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                name="申请数量"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 每周申请趋势 */}
        <div className="h-80">
          <h4 className="text-sm font-medium text-gray-700 mb-4">每周申请趋势</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyApplications}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="week"
                tickFormatter={(date) => new Date(date).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                formatter={(value) => [`${value} 份`, '申请数量']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                name="申请数量"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 每月申请趋势 */}
        <div className="h-80">
          <h4 className="text-sm font-medium text-gray-700 mb-4">每月申请趋势</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyApplications}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickFormatter={(month) => {
                  const [year, monthNum] = month.split('-');
                  return `${year}年${monthNum}月`;
                }}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(month) => {
                  const [year, monthNum] = month.split('-');
                  return `${year}年${monthNum}月`;
                }}
                formatter={(value) => [`${value} 份`, '申请数量']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                name="申请数量"
                stroke="#ffc658"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}; 