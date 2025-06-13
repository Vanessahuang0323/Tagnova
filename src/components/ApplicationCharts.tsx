import React, { useMemo } from 'react';
import { JobApplication } from '../types/job';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ApplicationChartsProps {
  applications: JobApplication[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const ApplicationCharts: React.FC<ApplicationChartsProps> = ({ applications }) => {
  // 计算每日申请数量
  const dailyApplications = useMemo(() => {
    const dailyData = new Map<string, number>();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    applications.forEach(app => {
      const date = new Date(app.appliedAt).toLocaleDateString();
      if (new Date(app.appliedAt) >= thirtyDaysAgo) {
        dailyData.set(date, (dailyData.get(date) || 0) + 1);
      }
    });

    return Array.from(dailyData.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [applications]);

  // 计算状态分布
  const statusDistribution = useMemo(() => {
    const statusCount = {
      pending: 0,
      reviewed: 0,
      accepted: 0,
      rejected: 0,
    };

    applications.forEach(app => {
      statusCount[app.status]++;
    });

    return Object.entries(statusCount).map(([status, count]) => ({
      name: status === 'pending' ? '待处理' :
            status === 'reviewed' ? '已审核' :
            status === 'accepted' ? '已接受' : '已拒绝',
      value: count,
    }));
  }, [applications]);

  // 计算行业分布
  const industryDistribution = useMemo(() => {
    const industryCount = new Map<string, number>();
    applications.forEach(app => {
      const industry = app.job.industry;
      industryCount.set(industry, (industryCount.get(industry) || 0) + 1);
    });

    return Array.from(industryCount.entries())
      .map(([industry, count]) => ({ industry, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // 只显示前5个行业
  }, [applications]);

  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-8">
      <h3 className="text-lg font-medium text-gray-900">申请数据分析</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 每日申请趋势 */}
        <div className="h-80">
          <h4 className="text-sm font-medium text-gray-700 mb-4">最近30天申请趋势</h4>
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
                stroke="#0088FE"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 申请状态分布 */}
        <div className="h-80">
          <h4 className="text-sm font-medium text-gray-700 mb-4">申请状态分布</h4>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} 份`, '申请数量']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 行业分布 */}
        <div className="h-80 lg:col-span-2">
          <h4 className="text-sm font-medium text-gray-700 mb-4">热门行业分布</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={industryDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="industry" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} 份`, '申请数量']} />
              <Legend />
              <Bar dataKey="count" name="申请数量" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}; 