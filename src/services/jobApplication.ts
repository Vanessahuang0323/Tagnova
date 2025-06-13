import { JobApplication } from '../types/job';

export const applyForJob = async (
  jobId: string,
  userId: string
): Promise<JobApplication> => {
  try {
    const response = await fetch('/api/applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobId,
        userId,
        status: 'pending',
        appliedDate: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error('申请失败');
    }

    return await response.json();
  } catch (error) {
    console.error('申请工作失败:', error);
    throw error;
  }
};

export const getApplications = async (userId: string): Promise<JobApplication[]> => {
  try {
    const response = await fetch(`/api/applications?userId=${userId}`);
    if (!response.ok) {
      throw new Error('获取申请记录失败');
    }

    return await response.json();
  } catch (error) {
    console.error('获取申请记录失败:', error);
    throw error;
  }
};

export const updateApplicationStatus = async (
  applicationId: string,
  status: JobApplication['status'],
  notes?: string
): Promise<JobApplication> => {
  try {
    const response = await fetch(`/api/applications/${applicationId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status,
        notes,
        reviewedDate: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error('更新申请状态失败');
    }

    return await response.json();
  } catch (error) {
    console.error('更新申请状态失败:', error);
    throw error;
  }
};

export const withdrawApplication = async (applicationId: string): Promise<void> => {
  try {
    const response = await fetch(`/api/applications/${applicationId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('撤回申请失败');
    }
  } catch (error) {
    console.error('撤回申请失败:', error);
    throw error;
  }
}; 