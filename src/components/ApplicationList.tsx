import React from 'react';
import { Link } from 'react-router-dom';
import { JobApplication } from '../types/application';
import { ApplicationStatus } from './ApplicationStatus';

interface ApplicationListProps {
  applications: JobApplication[];
  onWithdraw: (applicationId: string) => void;
}

export const ApplicationList: React.FC<ApplicationListProps> = ({
  applications,
  onWithdraw,
}) => {
  if (applications.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-lg p-6">
        <div className="text-center text-gray-500">
          暂无申请记录
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-lg overflow-hidden">
      <div className="divide-y divide-gray-200">
        {applications.map((application) => (
          <div
            key={application.id}
            className="p-6 hover:bg-gray-50/50 transition-colors duration-150"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1 min-w-0">
                <Link
                  to={`/applications/${application.id}`}
                  className="text-lg font-medium text-[#2D439B] hover:text-[#00B9F2] truncate"
                >
                  {application.job.title}
                </Link>
                <p className="mt-1 text-sm text-gray-600">
                  {application.status}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#2D439B]/10 text-[#2D439B]">
                    {application.status}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#2D439B]/10 text-[#2D439B]">
                    {new Date(application.appliedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 flex flex-col items-end">
                <ApplicationStatus
                  application={application}
                  onWithdraw={() => onWithdraw(application.id)}
                />
                <div className="mt-2 text-sm text-gray-600">
                  申请时间：{new Date(application.appliedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 