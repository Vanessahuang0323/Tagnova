import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { ChevronLeft } from 'lucide-react';

interface FormData {
  name: string;
  currentSchool: string;
  degreeProgram: string;
  department: string;
  yearLevel: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  password: string;
}

const StudentRegistrationFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    currentSchool: '',
    degreeProgram: '',
    department: '',
    yearLevel: '',
    email: '',
    countryCode: '',
    phoneNumber: '',
    password: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const schools = [
    '國立台灣大學',
    '國立清華大學',
    '國立交通大學',
    '國立成功大學',
    '國立政治大學',
    '國立台灣師範大學',
    '國立中央大學',
    '國立中興大學',
    '國立陽明大學',
    '國立中山大學'
  ];

  const degreePrograms = [
    '學士',
    '碩士',
    '博士'
  ];

  const departments = [
    '資訊工程學系',
    '電機工程學系',
    '機械工程學系',
    '化學工程學系',
    '土木工程學系',
    '工業工程學系',
    '材料科學與工程學系',
    '生物科技學系',
    '企業管理學系',
    '財務金融學系'
  ];

  const yearLevels = [
    '一年級',
    '二年級',
    '三年級',
    '四年級',
    '五年級',
    '六年級'
  ];

  const countryCodes = [
    { code: '+886', country: '台灣' },
    { code: '+852', country: '香港' },
    { code: '+853', country: '澳門' },
    { code: '+86', country: '中國' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Clear error when user starts typing
    if (errors[id as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [id]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = '請輸入姓名';
    }

    if (!formData.currentSchool) {
      newErrors.currentSchool = '請選擇學校';
    }

    if (!formData.degreeProgram) {
      newErrors.degreeProgram = '請選擇學位';
    }

    if (!formData.department) {
      newErrors.department = '請選擇科系';
    }

    if (!formData.yearLevel) {
      newErrors.yearLevel = '請選擇年級';
    }

    if (!formData.email) {
      newErrors.email = '請輸入電子郵件';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '請輸入有效的電子郵件地址';
    }

    if (!formData.countryCode) {
      newErrors.countryCode = '請選擇國碼';
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = '請輸入電話號碼';
    }

    if (!formData.password) {
      newErrors.password = '請設定密碼';
    } else if (formData.password.length < 8) {
      newErrors.password = '密碼長度至少需要8個字元';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // TODO: 儲存表單資料到後端
      navigate('/student/profile-upload');
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

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 text-base font-medium mb-2">姓名</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg bg-purple-100 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="請輸入您的姓名"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="currentSchool" className="block text-gray-700 text-base font-medium mb-2">就讀學校</label>
            <select
              id="currentSchool"
              value={formData.currentSchool}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg bg-purple-100 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              <option value="">請選擇學校</option>
              {schools.map(school => (
                <option key={school} value={school}>{school}</option>
              ))}
            </select>
            {errors.currentSchool && <p className="text-red-500 text-sm mt-1">{errors.currentSchool}</p>}
          </div>

          <div>
            <label htmlFor="degreeProgram" className="block text-gray-700 text-base font-medium mb-2">學位</label>
            <select
              id="degreeProgram"
              value={formData.degreeProgram}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg bg-purple-100 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              <option value="">請選擇學位</option>
              {degreePrograms.map(program => (
                <option key={program} value={program}>{program}</option>
              ))}
            </select>
            {errors.degreeProgram && <p className="text-red-500 text-sm mt-1">{errors.degreeProgram}</p>}
          </div>

          <div>
            <label htmlFor="department" className="block text-gray-700 text-base font-medium mb-2">科系</label>
            <select
              id="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg bg-purple-100 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              <option value="">請選擇科系</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
          </div>

          <div>
            <label htmlFor="yearLevel" className="block text-gray-700 text-base font-medium mb-2">年級</label>
            <select
              id="yearLevel"
              value={formData.yearLevel}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg bg-purple-100 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              <option value="">請選擇年級</option>
              {yearLevels.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            {errors.yearLevel && <p className="text-red-500 text-sm mt-1">{errors.yearLevel}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 text-base font-medium mb-2">電子郵件</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg bg-purple-100 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="請輸入您的電子郵件"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-gray-700 text-base font-medium mb-2">電話號碼</label>
            <div className="flex space-x-2">
              <select
                id="countryCode"
                value={formData.countryCode}
                onChange={handleInputChange}
                className="px-4 py-3 rounded-lg bg-purple-100 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300 w-1/3"
              >
                <option value="">國碼</option>
                {countryCodes.map(({ code, country }) => (
                  <option key={code} value={code}>{code} ({country})</option>
                ))}
              </select>
              <input
                type="tel"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-2/3 px-4 py-3 rounded-lg bg-purple-100 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
                placeholder="請輸入電話號碼"
              />
            </div>
            {(errors.countryCode || errors.phoneNumber) && (
              <p className="text-red-500 text-sm mt-1">{errors.countryCode || errors.phoneNumber}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 text-base font-medium mb-2">設定密碼</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg bg-purple-100 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="請設定密碼"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
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
          <div className="text-center mt-4">
            <a href="#" className="text-sm text-gray-600 hover:underline">第三方登入</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistrationFormPage; 