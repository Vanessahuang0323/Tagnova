import { StudentProfile } from '../types/user';

interface ResumeData {
  education: StudentProfile['education'];
  experience: StudentProfile['experience'];
  skills: StudentProfile['skills'];
}

export const saveResume = async (userId: string, resumeData: ResumeData): Promise<void> => {
  try {
    const response = await fetch(`/api/resumes/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resumeData),
    });

    if (!response.ok) {
      throw new Error('保存履歷失敗');
    }
  } catch (error) {
    console.error('保存履歷時發生錯誤:', error);
    throw error;
  }
};

export const getResume = async (userId: string): Promise<ResumeData> => {
  try {
    const response = await fetch(`/api/resumes/${userId}`);
    
    if (!response.ok) {
      throw new Error('獲取履歷失敗');
    }

    return await response.json();
  } catch (error) {
    console.error('獲取履歷時發生錯誤:', error);
    throw error;
  }
};

export const uploadResumeFile = async (userId: string, file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await fetch(`/api/resumes/${userId}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('上傳履歷文件失敗');
    }

    const data = await response.json();
    return data.fileUrl;
  } catch (error) {
    console.error('上傳履歷文件時發生錯誤:', error);
    throw error;
  }
};

export const deleteResume = async (userId: string): Promise<void> => {
  try {
    const response = await fetch(`/api/resumes/${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('刪除履歷失敗');
    }
  } catch (error) {
    console.error('刪除履歷時發生錯誤:', error);
    throw error;
  }
}; 