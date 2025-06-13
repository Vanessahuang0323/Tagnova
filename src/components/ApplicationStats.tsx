import React from 'react';
import { JobApplication } from '../types/job';

interface ApplicationStatsProps {
  applications: JobApplication[];
}

export const ApplicationStats: React.FC<ApplicationStatsProps> = ({
  applications,
}) => {
  const stats = React.useMemo(() => {
    const total = applications.length;
    const pending = applications.filter((app) => app.status === 'pending').length;
    const reviewed = applications.filter((app) => app.status === 'reviewed').length;
    const accepted = applications.filter((app) => app.status === 'accepted').length;
    const rejected = applications.filter((app) => app.status === 'rejected').length;

    const acceptanceRate = total > 0 ? (accepted / total) * 100 : 0;
    const rejectionRate = total > 0 ? (rejected / total) * 100 : 0;
    const reviewRate = total > 0 ? (reviewed / total) * 100 : 0;

    // 计算最近30天的申请趋势
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentApplications = applications.filter(
      app => new Date(app.appliedAt) >= thirtyDaysAgo
    );
    const recentCount = recentApplications.length;

    // 计算平均处理时间（仅考虑已处理的申请）
    const processedApplications = applications.filter(
      app => app.status !== 'pending'
    );
    const avgProcessingTime = processedApplications.length > 0
      ? processedApplications.reduce((acc, app) => {
          const appliedDate = new Date(app.appliedAt);
          const processedDate = new Date(app.updatedAt);
          return acc + (processedDate.getTime() - appliedDate.getTime());
        }, 0) / processedApplications.length
      : 0;

    return {
      total,
      pending,
      reviewed,
      accepted,
      rejected,
      acceptanceRate,
      rejectionRate,
      reviewRate,
      recentCount,
      avgProcessingTime
    };
  }, [applications]);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">申请统计</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-blue-600">总申请数</div>
          <div className="mt-1 text-3xl font-semibold text-blue-900">{stats.total}</div>
          <div className="mt-2 text-sm text-blue-600">
            最近30天: {stats.recentCount}
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-yellow-600">待处理</div>
          <div className="mt-1 text-3xl font-semibold text-yellow-900">{stats.pending}</div>
          <div className="mt-2 text-sm text-yellow-600">
            占比: {((stats.pending / stats.total) * 100).toFixed(1)}%
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-green-600">已接受</div>
          <div className="mt-1 text-3xl font-semibold text-green-900">{stats.accepted}</div>
          <div className="mt-2 text-sm text-green-600">
            接受率: {stats.acceptanceRate.toFixed(1)}%
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-red-600">已拒绝</div>
          <div className="mt-1 text-3xl font-semibold text-red-900">{stats.rejected}</div>
          <div className="mt-2 text-sm text-red-600">
            拒绝率: {stats.rejectionRate.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-gray-600">平均处理时间</div>
          <div className="mt-1 text-2xl font-semibold text-gray-900">
            {stats.avgProcessingTime > 0
              ? `${Math.round(stats.avgProcessingTime / (1000 * 60 * 60 * 24))} 天`
              : '暂无数据'}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-gray-600">审核率</div>
          <div className="mt-1 text-2xl font-semibold text-gray-900">
            {stats.reviewRate.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}; 