import React, { useState } from 'react';
import { JobPosting } from '../types/job';
import { applyForJob } from '../services/jobApplication';
import { useAuth } from '../contexts/AuthContext';

interface JobApplicationFormProps {
  job: JobPosting;
  onSuccess: () => void;
  onCancel: () => void;
}

export const JobApplicationForm: React.FC<JobApplicationFormProps> = ({
  job,
  onSuccess,
  onCancel,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('请先登录');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await applyForJob(job.id, user.id);
      onSuccess();
    } catch (err) {
      setError('申请失败，请稍后重试');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        申请职位: {job.title}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">
            请确认您要申请这个职位。申请后，您的简历将被发送给招聘方。
          </p>
        </div>

        {error && (
          <div className="text-red-500 text-sm">
            <p>{error}</p>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            取消
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? '提交中...' : '确认申请'}
          </button>
        </div>
      </form>
    </div>
  );
}; 