import React, { useMemo } from 'react';
import { JobApplication } from '../types/application';
import { Card } from './Card';
import { Modal } from './Modal';

interface ApplicationStatisticsProps {
  applications: JobApplication[];
  isOpen: boolean;
  onClose: () => void;
}

export const ApplicationStatistics: React.FC<ApplicationStatisticsProps> = ({
  applications,
  isOpen,
  onClose,
}) => {
  const statistics = useMemo(() => {
    const total = applications.length;
    const statusCounts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const industryCounts = applications.reduce((acc, app) => {
      const industry = app.job.industry;
      acc[industry] = (acc[industry] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const experienceCounts = applications.reduce((acc, app) => {
      const experience = app.job.experience;
      acc[experience] = (acc[experience] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const educationCounts = applications.reduce((acc, app) => {
      const education = app.job.education;
      acc[education] = (acc[education] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      statusCounts,
      industryCounts,
      experienceCounts,
      educationCounts,
    };
  }, [applications]);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '待处理';
      case 'interviewing':
        return '面试中';
      case 'offered':
        return '已录用';
      case 'rejected':
        return '已拒绝';
      default:
        return status;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="申请统计"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">总申请数</h3>
            <p className="mt-2 text-3xl font-semibold text-blue-600">
              {statistics.total}
            </p>
          </div>
        </Card>

        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">申请状态分布</h3>
            <div className="space-y-2">
              {Object.entries(statistics.statusCounts).map(([status, count]) => (
                <div key={status} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {getStatusText(status)}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">行业分布</h3>
            <div className="space-y-2">
              {Object.entries(statistics.industryCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([industry, count]) => (
                  <div key={industry} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{industry}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {count}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">经验要求分布</h3>
            <div className="space-y-2">
              {Object.entries(statistics.experienceCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([experience, count]) => (
                  <div key={experience} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{experience}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {count}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">学历要求分布</h3>
            <div className="space-y-2">
              {Object.entries(statistics.educationCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([education, count]) => (
                  <div key={education} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{education}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {count}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </Card>
      </div>
    </Modal>
  );
}; 