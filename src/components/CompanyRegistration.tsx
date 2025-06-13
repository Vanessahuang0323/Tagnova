import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CompanyProfile } from '../types/user';

interface FormData {
  companyName: string;
  phone: string;
  taxId: string;
  contactPerson: string;
  email: string;
  industry: string;
  workType: string;
  password: string;
  confirmPassword: string;
  companyCulture: {
    values: string[];
    environment: string;
  };
  companyDescription: string;
  companyPhotos: File[];
  companyLogo: File | null;
}

const CompanyRegistration: React.FC = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    phone: '',
    taxId: '',
    contactPerson: '',
    email: '',
    industry: '',
    workType: '',
    password: '',
    confirmPassword: '',
    companyCulture: {
      values: [],
      environment: ''
    },
    companyDescription: '',
    companyPhotos: [],
    companyLogo: null
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [currentStep, setCurrentStep] = useState(1);

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    switch (step) {
      case 1:
        if (!formData.companyName) newErrors.companyName = '公司名稱為必填';
        if (!formData.phone) newErrors.phone = '電話為必填';
        if (!formData.taxId) newErrors.taxId = '統編為必填';
        if (!formData.contactPerson) newErrors.contactPerson = '聯絡人為必填';
        if (!formData.email) newErrors.email = '電子郵件為必填';
        if (!formData.industry) newErrors.industry = '產業別為必填';
        if (!formData.workType) newErrors.workType = '工作型態為必填';
        if (!formData.password) newErrors.password = '密碼為必填';
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = '密碼不一致';
        }
        break;
      case 2:
        if (formData.companyCulture.values.length === 0) {
          newErrors.companyCulture = '請至少選擇一項公司文化價值';
        }
        if (!formData.companyDescription) {
          newErrors.companyDescription = '公司簡介為必填';
        }
        break;
      case 3:
        if (!formData.companyLogo) newErrors.companyLogo = '請上傳公司LOGO';
        if (formData.companyPhotos.length === 0) {
          newErrors.companyPhotos = '請上傳至少一張公司環境照片';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('companyCulture.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        companyCulture: {
          ...prev.companyCulture,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files) return;

    if (name === 'companyLogo') {
      setFormData(prev => ({ ...prev, companyLogo: files[0] }));
    } else if (name === 'companyPhotos') {
      setFormData(prev => ({
        ...prev,
        companyPhotos: [...prev.companyPhotos, ...Array.from(files)]
      }));
    }
  };

  const handleCultureValueAdd = (value: string) => {
    if (value && !formData.companyCulture.values.includes(value)) {
      setFormData(prev => ({
        ...prev,
        companyCulture: {
          ...prev.companyCulture,
          values: [...prev.companyCulture.values, value]
        }
      }));
    }
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
      const companyLogoBase64 = formData.companyLogo 
        ? await fileToBase64(formData.companyLogo)
        : '';
      
      const companyPhotosBase64 = await Promise.all(
        formData.companyPhotos.map(file => fileToBase64(file))
      );

      const companyData: Partial<CompanyProfile> = {
        companyName: formData.companyName,
        phone: formData.phone,
        taxId: formData.taxId,
        contactPerson: formData.contactPerson,
        email: formData.email,
        industry: formData.industry,
        workType: formData.workType,
        password: formData.password,
        companyCulture: formData.companyCulture,
        companyDescription: formData.companyDescription,
        companyPhotos: companyPhotosBase64,
        companyLogo: companyLogoBase64
      };

      await register(companyData, 'company');
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
      <h1 className="text-2xl font-bold mb-6">企業註冊</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">公司名稱</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">公司電話</label>
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
              <label className="block text-sm font-medium text-gray-700">統一編號</label>
              <input
                type="text"
                name="taxId"
                value={formData.taxId}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.taxId && <p className="text-red-500 text-sm">{errors.taxId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">聯絡人姓名</label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.contactPerson && <p className="text-red-500 text-sm">{errors.contactPerson}</p>}
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
              <label className="block text-sm font-medium text-gray-700">產業別</label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">請選擇產業別</option>
                <option value="tech">科技</option>
                <option value="finance">金融</option>
                <option value="retail">零售</option>
                <option value="manufacturing">製造</option>
                <option value="service">服務</option>
                <option value="other">其他</option>
              </select>
              {errors.industry && <p className="text-red-500 text-sm">{errors.industry}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">工作型態</label>
              <select
                name="workType"
                value={formData.workType}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">請選擇工作型態</option>
                <option value="full-time">全職</option>
                <option value="part-time">兼職</option>
                <option value="internship">實習</option>
                <option value="remote">遠端</option>
                <option value="hybrid">混合</option>
              </select>
              {errors.workType && <p className="text-red-500 text-sm">{errors.workType}</p>}
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
              <label className="block text-sm font-medium text-gray-700">公司文化價值</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="輸入公司文化價值"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      handleCultureValueAdd(input.value);
                      input.value = '';
                    }
                  }}
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.companyCulture.values.map((value, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {value}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          companyCulture: {
                            ...prev.companyCulture,
                            values: prev.companyCulture.values.filter((_, i) => i !== index)
                          }
                        }));
                      }}
                      className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-indigo-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              {errors.companyCulture && (
                <p className="text-red-500 text-sm">{errors.companyCulture}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">公司簡介</label>
              <textarea
                name="companyDescription"
                value={formData.companyDescription}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.companyDescription && (
                <p className="text-red-500 text-sm">{errors.companyDescription}</p>
              )}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">公司LOGO</label>
              <input
                type="file"
                name="companyLogo"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full"
              />
              {errors.companyLogo && (
                <p className="text-red-500 text-sm">{errors.companyLogo}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">公司環境照片</label>
              <input
                type="file"
                name="companyPhotos"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="mt-1 block w-full"
              />
              {errors.companyPhotos && (
                <p className="text-red-500 text-sm">{errors.companyPhotos}</p>
              )}
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
    </div>
  );
};

export default CompanyRegistration; 