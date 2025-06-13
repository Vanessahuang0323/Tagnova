import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { ChevronLeft, UploadCloud, X } from 'lucide-react';

interface FormData {
  profilePhoto: File | null;
  lifestylePhotos: File[];
  selfIntro: string;
  resumeFiles: File[];
}

const StudentProfileUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    profilePhoto: null,
    lifestylePhotos: [],
    selfIntro: '',
    resumeFiles: []
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const profilePhotoRef = useRef<HTMLInputElement>(null);
  const lifestylePhotosRef = useRef<HTMLInputElement>(null);
  const resumeFilesRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: keyof FormData) => {
    const files = e.target.files;
    if (!files) return;

    if (type === 'profilePhoto') {
      setFormData(prev => ({ ...prev, profilePhoto: files[0] }));
    } else if (type === 'lifestylePhotos') {
      const newPhotos = Array.from(files);
      setFormData(prev => ({
        ...prev,
        lifestylePhotos: [...prev.lifestylePhotos, ...newPhotos].slice(0, 3)
      }));
    } else if (type === 'resumeFiles') {
      const newFiles = Array.from(files);
      setFormData(prev => ({
        ...prev,
        resumeFiles: [...prev.resumeFiles, ...newFiles].slice(0, 3)
      }));
    }
  };

  const handleRemoveFile = (type: keyof FormData, index?: number) => {
    if (type === 'profilePhoto') {
      setFormData(prev => ({ ...prev, profilePhoto: null }));
    } else if (type === 'lifestylePhotos' && index !== undefined) {
      setFormData(prev => ({
        ...prev,
        lifestylePhotos: prev.lifestylePhotos.filter((_, i) => i !== index)
      }));
    } else if (type === 'resumeFiles' && index !== undefined) {
      setFormData(prev => ({
        ...prev,
        resumeFiles: prev.resumeFiles.filter((_, i) => i !== index)
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, selfIntro: value }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.profilePhoto) {
      newErrors.profilePhoto = '請上傳大頭照';
    }

    if (formData.lifestylePhotos.length === 0) {
      newErrors.lifestylePhotos = '請上傳至少一張生活照';
    }

    if (!formData.selfIntro.trim()) {
      newErrors.selfIntro = '請填寫自我介紹';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // TODO: 儲存檔案到後端
      navigate('/student/skills-highlights');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-white">
      <div className="max-w-xl w-full space-y-6">
        {/* Header with back arrow and logo */}
        <div className="flex items-center justify-between w-full mb-8">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex-grow flex justify-center">
            <Logo size="medium" />
          </div>
          <div className="w-6 h-6" /> {/* Placeholder for alignment */}
        </div>

        {/* Profile Photo */}
        <div>
          <label htmlFor="profilePhoto" className="block text-gray-700 text-base font-medium mb-2">大頭照</label>
          <div 
            className="w-full h-40 bg-purple-100 rounded-lg flex flex-col items-center justify-center border border-purple-200 cursor-pointer relative"
            onClick={() => profilePhotoRef.current?.click()}
          >
            {formData.profilePhoto ? (
              <>
                <img
                  src={URL.createObjectURL(formData.profilePhoto)}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile('profilePhoto');
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <UploadCloud className="w-10 h-10 text-purple-400 mb-2" />
                <span className="text-purple-600">上傳照片</span>
              </>
            )}
          </div>
          <input
            type="file"
            id="profilePhoto"
            ref={profilePhotoRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'profilePhoto')}
          />
          {errors.profilePhoto && <p className="text-red-500 text-sm mt-1">{errors.profilePhoto}</p>}
        </div>

        {/* Lifestyle Photos */}
        <div>
          <label htmlFor="lifestylePhotos" className="block text-gray-700 text-base font-medium mb-2">生活照（1-3張）</label>
          <div 
            className="w-full h-40 bg-purple-100 rounded-lg flex flex-col items-center justify-center border border-purple-200 cursor-pointer"
            onClick={() => lifestylePhotosRef.current?.click()}
          >
            {formData.lifestylePhotos.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 w-full h-full p-2">
                {formData.lifestylePhotos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Lifestyle ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile('lifestylePhotos', index);
                      }}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <UploadCloud className="w-10 h-10 text-purple-400 mb-2" />
                <span className="text-purple-600">上傳照片</span>
              </>
            )}
          </div>
          <input
            type="file"
            id="lifestylePhotos"
            ref={lifestylePhotosRef}
            className="hidden"
            accept="image/*"
            multiple
            onChange={(e) => handleFileChange(e, 'lifestylePhotos')}
          />
          {errors.lifestylePhotos && <p className="text-red-500 text-sm mt-1">{errors.lifestylePhotos}</p>}
        </div>

        {/* Self-Introduction */}
        <div>
          <label htmlFor="selfIntro" className="block text-gray-700 text-base font-medium mb-2">自我介紹</label>
          <textarea
            id="selfIntro"
            value={formData.selfIntro}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 rounded-lg bg-purple-100 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
            placeholder="請簡單介紹自己，包括興趣、專長等"
          />
          {errors.selfIntro && <p className="text-red-500 text-sm mt-1">{errors.selfIntro}</p>}
        </div>

        {/* Resume Upload */}
        <div>
          <label htmlFor="resumeFiles" className="block text-gray-700 text-base font-medium mb-2">履歷上傳（選填，最多3個檔案）</label>
          <div 
            className="w-full h-40 bg-purple-100 rounded-lg flex flex-col items-center justify-center border border-purple-200 cursor-pointer"
            onClick={() => resumeFilesRef.current?.click()}
          >
            {formData.resumeFiles.length > 0 ? (
              <div className="w-full p-4">
                {formData.resumeFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-2 rounded mb-2">
                    <span className="text-sm text-gray-600 truncate">{file.name}</span>
                    <button
                      className="p-1 text-red-500 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile('resumeFiles', index);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <UploadCloud className="w-10 h-10 text-purple-400 mb-2" />
                <span className="text-purple-600">上傳履歷</span>
                <p className="text-gray-500 text-sm mt-1">支援格式：PDF（最多3個檔案）</p>
              </>
            )}
          </div>
          <input
            type="file"
            id="resumeFiles"
            ref={resumeFilesRef}
            className="hidden"
            accept=".pdf"
            multiple
            onChange={(e) => handleFileChange(e, 'resumeFiles')}
          />
        </div>

        {/* Next Button */}
        <div className="pt-8">
          <button
            className="w-full flex items-center justify-center px-6 py-4 bg-purple-200 rounded-full text-lg font-semibold text-purple-800 shadow-md hover:bg-purple-300 transition-colors duration-300"
            onClick={handleSubmit}
          >
            下一步
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileUploadPage; 