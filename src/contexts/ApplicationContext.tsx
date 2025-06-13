import React, { createContext, useContext, useState, useCallback } from 'react';
import { JobApplication } from '../types/application';

interface ApplicationContextType {
  applications: JobApplication[];
  loading: boolean;
  error: string | null;
  fetchApplications: () => Promise<void>;
  addApplication: (application: Omit<JobApplication, 'id'>) => Promise<void>;
  updateApplication: (id: string, application: Partial<JobApplication>) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: 实现实际的API调用
      const mockApplications: JobApplication[] = [
        {
          id: '1',
          jobTitle: '前端开发工程师',
          company: '科技有限公司',
          status: 'pending',
          appliedAt: new Date().toISOString(),
          job: {
            id: '1',
            title: '前端开发工程师',
            company: '科技有限公司',
            location: '北京',
            salary: '15k-25k',
            description: '负责公司产品的前端开发工作',
            requirements: ['3年以上前端开发经验', '精通React', '良好的团队协作能力'],
            industry: '互联网',
            experience: '3-5年',
            education: '本科',
            tags: ['React', 'TypeScript', '前端开发'],
          },
        },
        {
          id: '2',
          jobTitle: '后端开发工程师',
          company: '数据科技公司',
          status: 'interviewing',
          appliedAt: new Date().toISOString(),
          interviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          interviewType: '技术面试',
          job: {
            id: '2',
            title: '后端开发工程师',
            company: '数据科技公司',
            location: '上海',
            salary: '20k-35k',
            description: '负责公司核心业务的后端开发',
            requirements: ['5年以上后端开发经验', '精通Java', '熟悉分布式系统'],
            industry: '互联网',
            experience: '5-8年',
            education: '本科',
            tags: ['Java', 'Spring Boot', '后端开发'],
          },
        },
      ];
      
      setApplications(mockApplications);
    } catch (err) {
      setError('获取申请记录失败');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addApplication = useCallback(async (application: Omit<JobApplication, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: 实现实际的API调用
      const newApplication: JobApplication = {
        ...application,
        id: Date.now().toString(),
      };
      
      setApplications((prev) => [...prev, newApplication]);
    } catch (err) {
      setError('添加申请记录失败');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateApplication = useCallback(async (id: string, application: Partial<JobApplication>) => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: 实现实际的API调用
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, ...application } : app))
      );
    } catch (err) {
      setError('更新申请记录失败');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteApplication = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: 实现实际的API调用
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (err) {
      setError('删除申请记录失败');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        loading,
        error,
        fetchApplications,
        addApplication,
        updateApplication,
        deleteApplication,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplication = () => {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error('useApplication must be used within an ApplicationProvider');
  }
  return context;
}; 