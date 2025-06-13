import React from 'react';
import { JobApplication } from '../types/job';

interface ApplicationStatusProps {
  application: JobApplication;
  onWithdraw?: () => void;
}

export const ApplicationStatus: React.FC<ApplicationStatusProps> = ({
  application,
  onWithdraw,
}) => {
  const getStatusColor = (status: JobApplication['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: JobApplication['status']) => {
    switch (status) {
      case 'pending':
        return '待审核';
      case 'reviewed':
        return '已审核';
      case 'accepted':
        return '已接受';
      case 'rejected':
        return '已拒绝';
      default:
        return '未知状态';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            申请时间: {new Date(application.appliedDate).toLocaleString()}
          </p>
          {application.reviewedDate && (
            <p className="text-sm text-gray-500">
              审核时间: {new Date(application.reviewedDate).toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
              application.status
            )}`}
          >
            {getStatusText(application.status)}
          </span>
          {application.status === 'pending' && onWithdraw && (
            <button
              onClick={onWithdraw}
              className="text-sm text-red-600 hover:text-red-900"
            >
              撤回申请
            </button>
          )}
        </div>
      </div>

      {application.notes && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-900">备注:</p>
          <p className="mt-1 text-sm text-gray-600">{application.notes}</p>
        </div>
      )}
    </div>
  );
}; 