import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { JobApplication } from '../types/job';
import { ApplicationStatus } from '../components/ApplicationStatus';
import { ApplicationTimeline } from '../components/ApplicationTimeline';
import { useAuth } from '../contexts/AuthContext';

export const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadApplication = async () => {
      if (!user) {
        setError('请先登录');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/applications/${id}`);
        if (!response.ok) {
          throw new Error('获取申请详情失败');
        }

        const data = await response.json();
        setApplication(data);
      } catch (err) {
        setError('获取申请详情失败');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadApplication();
  }, [id, user]);

  const handleWithdraw = async () => {
    if (!application) return;

    try {
      const response = await fetch(`/api/applications/${application.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('撤回申请失败');
      }

      navigate('/applications');
    } catch (err) {
      setError('撤回申请失败');
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              请先登录
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              登录后即可查看申请详情
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-500">
            <p>{error || '申请不存在'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            申请详情
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            查看您的申请状态和进度
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              <ApplicationStatus
                application={application}
                onWithdraw={handleWithdraw}
              />
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  申请进度
                </h3>
                <ApplicationTimeline application={application} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 