import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ResumeUpload from '../components/ResumeUpload';
import ResumePreview from '../components/ResumePreview';
import ResumeEditor from '../components/ResumeEditor';
import { parseResume, validateResume } from '../services/resumeParser';
import { saveResume, getResume, uploadResumeFile } from '../services/resumeService';
import { StudentProfile } from '../types/user';

const ResumeManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<'upload' | 'preview' | 'edit'>('upload');
  const [resumeData, setResumeData] = useState<{
    education: StudentProfile['education'];
    experience: StudentProfile['experience'];
    skills: StudentProfile['skills'];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExistingResume = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const data = await getResume(user.id);
        setResumeData(data);
        setStep('preview');
      } catch (error) {
        console.error('加载现有简历失败:', error);
        setStep('upload');
      } finally {
        setLoading(false);
      }
    };

    loadExistingResume();
  }, [user?.id]);

  const handleUpload = async (file: File) => {
    if (!user?.id) {
      setError('請先登入');
      return;
    }

    if (!validateResume(file)) {
      setError('請上傳有效的履歷文件（PDF 或 Word 格式，大小不超過 5MB）');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 上传文件
      await uploadResumeFile(user.id, file);

      // 解析简历
      const parsedData = await parseResume(file);
      setResumeData(parsedData);
      setStep('preview');
    } catch (error) {
      setError('解析履歷時發生錯誤，請稍後再試');
      console.error('上传或解析简历失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewConfirm = async () => {
    if (!user?.id || !resumeData) return;

    try {
      setLoading(true);
      setError(null);
      await saveResume(user.id, resumeData);
      navigate('/profile');
    } catch (error) {
      setError('保存履歷失敗，請稍後再試');
      console.error('保存简历失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewEdit = () => {
    setStep('edit');
  };

  const handleEditSave = (data: {
    education: StudentProfile['education'];
    experience: StudentProfile['experience'];
    skills: StudentProfile['skills'];
  }) => {
    setResumeData(data);
    setStep('preview');
  };

  const handleEditCancel = () => {
    setStep('preview');
  };

  const handleUploadCancel = () => {
    navigate('/profile');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">處理中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="h-12 w-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-900 font-medium">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            重試
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {step === 'upload' && (
        <ResumeUpload
          onUpload={handleUpload}
          onCancel={handleUploadCancel}
        />
      )}

      {step === 'preview' && resumeData && (
        <ResumePreview
          resume={resumeData}
          onConfirm={handlePreviewConfirm}
          onEdit={handlePreviewEdit}
        />
      )}

      {step === 'edit' && resumeData && (
        <ResumeEditor
          initialData={resumeData}
          onSave={handleEditSave}
          onCancel={handleEditCancel}
        />
      )}
    </div>
  );
};

export default ResumeManagement; 