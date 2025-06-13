import React, { useState } from 'react';
import { Input } from './Input';
import { Select } from './Select';
import { Button } from './Button';

interface ApplicationFilterPanelProps {
  onFilter: (filters: any) => void;
  onReset: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ApplicationFilterPanel: React.FC<ApplicationFilterPanelProps> = ({
  onFilter,
  onReset,
  isOpen,
  onClose,
}) => {
  const [filters, setFilters] = useState({
    status: '',
    dateRange: {
      start: '',
      end: '',
    },
    industry: '',
    experience: '',
    education: '',
  });

  const handleInputChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({
      status: '',
      dateRange: {
        start: '',
        end: '',
      },
      industry: '',
      experience: '',
      education: '',
    });
    onReset();
  };

  const statusOptions = [
    { value: '', label: '全部状态' },
    { value: 'pending', label: '待处理' },
    { value: 'interviewing', label: '面试中' },
    { value: 'offered', label: '已录用' },
    { value: 'rejected', label: '已拒绝' },
  ];

  const industryOptions = [
    { value: '', label: '全部行业' },
    { value: '互联网', label: '互联网' },
    { value: '金融', label: '金融' },
    { value: '教育', label: '教育' },
    { value: '医疗', label: '医疗' },
    { value: '制造业', label: '制造业' },
  ];

  const experienceOptions = [
    { value: '', label: '全部经验' },
    { value: '应届生', label: '应届生' },
    { value: '1-3年', label: '1-3年' },
    { value: '3-5年', label: '3-5年' },
    { value: '5-10年', label: '5-10年' },
    { value: '10年以上', label: '10年以上' },
  ];

  const educationOptions = [
    { value: '', label: '全部学历' },
    { value: '大专', label: '大专' },
    { value: '本科', label: '本科' },
    { value: '硕士', label: '硕士' },
    { value: '博士', label: '博士' },
  ];

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto relative">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">筛选申请</h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="申请状态"
              options={statusOptions}
              value={filters.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                申请日期范围
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => handleDateChange('start', e.target.value)}
                />
                <Input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => handleDateChange('end', e.target.value)}
                />
              </div>
            </div>

            <Select
              label="行业"
              options={industryOptions}
              value={filters.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
            />

            <Select
              label="经验要求"
              options={experienceOptions}
              value={filters.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
            />

            <Select
              label="学历要求"
              options={educationOptions}
              value={filters.education}
              onChange={(e) => handleInputChange('education', e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleReset}
            >
              重置
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              应用筛选
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}; 