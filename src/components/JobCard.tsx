import React from 'react';
import { JobPosting } from '../types/job';

interface JobCardProps {
  job: JobPosting;
  matchPercentage?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  matchPercentage,
  onSwipeLeft,
  onSwipeRight,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
            <p className="text-gray-600">{job.location}</p>
          </div>
          {matchPercentage !== undefined && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              匹配度: {Math.round(matchPercentage * 100)}%
            </div>
          )}
        </div>

        <div className="mt-4">
          <h4 className="font-medium text-gray-900">职位描述</h4>
          <p className="mt-2 text-gray-600">{job.description}</p>
        </div>

        <div className="mt-4">
          <h4 className="font-medium text-gray-900">技能要求</h4>
          <div className="mt-2">
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-600">技术技能:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {job.requirements.technical.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">软技能:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {job.requirements.soft.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-medium text-gray-900">薪资待遇</h4>
          <p className="mt-2 text-gray-600">
            {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
          </p>
        </div>

        <div className="mt-4">
          <h4 className="font-medium text-gray-900">福利待遇</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {job.benefits.map((benefit, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm"
              >
                {benefit}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onSwipeLeft}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            不感兴趣
          </button>
          <button
            onClick={onSwipeRight}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            申请职位
          </button>
        </div>
      </div>
    </div>
  );
}; 