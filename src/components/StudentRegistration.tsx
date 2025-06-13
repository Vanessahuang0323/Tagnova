import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StudentProfile } from '../types/user';

interface FormData {
  name: string;
  gender: 'male' | 'female' | 'other';
  phone: string;
  school: string;
  department: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePhoto: File | null;
  lifestylePhotos: File[];
  skills: string[];
  portfolio: {
    projects: Array<{
      title: string;
      description: string;
      link?: string;
    }>;
  };
}

const StudentRegistration: React.FC = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    gender: 'other',
    phone: '',
    school: '',
    department: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePhoto: null,
    lifestylePhotos: [],
    skills: [],
    portfolio: {
      projects: []
    }
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [showPersonalityTest, setShowPersonalityTest] = useState(false);

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    switch (step) {
      case 1:
        if (!formData.name) newErrors.name = '姓名為必填';
        if (!formData.phone) newErrors.phone = '電話為必填';
        if (!formData.school) newErrors.school = '學校為必填';
        if (!formData.department) newErrors.department = '科系為必填';
        if (!formData.email) newErrors.email = '電子郵件為必填';
        if (!formData.password) newErrors.password = '密碼為必填';
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = '密碼不一致';
        }
        break;
      case 2:
        if (!formData.profilePhoto) newErrors.profilePhoto = '請上傳大頭照';
        if (formData.lifestylePhotos.length === 0) {
          newErrors.lifestylePhotos = '請上傳至少一張生活照';
        }
        break;
      case 3:
        if (formData.skills.length === 0) newErrors.skills = '請至少填寫一項技能';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files) return;

    if (name === 'profilePhoto') {
      setFormData(prev => ({ ...prev, profilePhoto: files[0] }));
    } else if (name === 'lifestylePhotos') {
      setFormData(prev => ({
        ...prev,
        lifestylePhotos: [...prev.lifestylePhotos, ...Array.from(files)]
      }));
    }
  };

  const handleSkillAdd = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const handleProjectAdd = (project: { title: string; description: string; link?: string }) => {
    setFormData(prev => ({
      ...prev,
      portfolio: {
        projects: [...prev.portfolio.projects, project]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
      return;
    }

    try {
      // Convert files to base64 or upload to server
      const profilePhotoBase64 = formData.profilePhoto 
        ? await fileToBase64(formData.profilePhoto)
        : '';
      
      const lifestylePhotosBase64 = await Promise.all(
        formData.lifestylePhotos.map(file => fileToBase64(file))
      );

      const studentData: Partial<StudentProfile> = {
        name: formData.name,
        gender: formData.gender,
        phone: formData.phone,
        school: formData.school,
        department: formData.department,
        email: formData.email,
        password: formData.password,
        profilePhoto: profilePhotoBase64,
        lifestylePhotos: lifestylePhotosBase64,
        skills: formData.skills,
        portfolio: formData.portfolio
      };

      await register(studentData, 'student');
      setShowPersonalityTest(true);
    } catch (error) {
      console.error('Registration error:', error);
      setErrors(prev => ({
        ...prev,
        submit: '註冊失敗，請稍後再試'
      }));
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">學生註冊</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">姓名</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">性別</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="male">男</option>
                <option value="female">女</option>
                <option value="other">其他</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">電話</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">學校</label>
              <input
                type="text"
                name="school"
                value={formData.school}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.school && <p className="text-red-500 text-sm">{errors.school}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">科系</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">電子郵件</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">密碼</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">確認密碼</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">大頭照</label>
              <input
                type="file"
                name="profilePhoto"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full"
              />
              {errors.profilePhoto && (
                <p className="text-red-500 text-sm">{errors.profilePhoto}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">生活照 (1-2張)</label>
              <input
                type="file"
                name="lifestylePhotos"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="mt-1 block w-full"
              />
              {errors.lifestylePhotos && (
                <p className="text-red-500 text-sm">{errors.lifestylePhotos}</p>
              )}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">技能專長</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="輸入技能"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      handleSkillAdd(input.value);
                      input.value = '';
                    }
                  }}
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          skills: prev.skills.filter((_, i) => i !== index)
                        }));
                      }}
                      className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-indigo-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              {errors.skills && <p className="text-red-500 text-sm">{errors.skills}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">作品集與專案經驗 (選填)</label>
              <div className="space-y-4">
                {formData.portfolio.projects.map((project, index) => (
                  <div key={index} className="p-4 border rounded-md">
                    <h4 className="font-medium">{project.title}</h4>
                    <p className="text-sm text-gray-600">{project.description}</p>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 hover:text-indigo-500"
                      >
                        查看連結
                      </a>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const title = prompt('專案名稱');
                    const description = prompt('專案描述');
                    const link = prompt('專案連結 (選填)');
                    if (title && description) {
                      handleProjectAdd({ title, description, link });
                    }
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                  新增專案
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              上一步
            </button>
          )}
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {currentStep === 3 ? '完成註冊' : '下一步'}
          </button>
        </div>
      </form>

      {showPersonalityTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">人格測驗</h2>
            <p className="mb-4">測驗完成將提高媒合準確度</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowPersonalityTest(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                稍後再說
              </button>
              <button
                onClick={() => {
                  // TODO: Navigate to personality test
                  setShowPersonalityTest(false);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                開始測驗
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentRegistration; 