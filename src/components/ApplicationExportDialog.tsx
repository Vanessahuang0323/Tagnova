import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Select } from './Select';
import { Input } from './Input';

interface ApplicationExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => void;
}

interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  dateRange: {
    start: string;
    end: string;
  };
  fields: string[];
}

export const ApplicationExportDialog: React.FC<ApplicationExportDialogProps> = ({
  isOpen,
  onClose,
  onExport,
}) => {
  const [options, setOptions] = useState<ExportOptions>({
    format: 'excel',
    dateRange: {
      start: '',
      end: '',
    },
    fields: ['jobTitle', 'company', 'status', 'appliedAt'],
  });

  const formatOptions = [
    { value: 'csv', label: 'CSV' },
    { value: 'excel', label: 'Excel' },
    { value: 'pdf', label: 'PDF' },
  ];

  const fieldOptions = [
    { value: 'jobTitle', label: '职位名称' },
    { value: 'company', label: '公司名称' },
    { value: 'status', label: '申请状态' },
    { value: 'appliedAt', label: '申请日期' },
    { value: 'location', label: '工作地点' },
    { value: 'salary', label: '薪资' },
    { value: 'industry', label: '行业' },
    { value: 'experience', label: '经验要求' },
    { value: 'education', label: '学历要求' },
  ];

  const handleFormatChange = (value: string) => {
    setOptions(prev => ({
      ...prev,
      format: value as 'csv' | 'excel' | 'pdf',
    }));
  };

  const handleDateChange = (name: string, value: string) => {
    setOptions(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [name]: value,
      },
    }));
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFields = Array.from(e.target.selectedOptions, option => option.value);
    setOptions(prev => ({
      ...prev,
      fields: selectedFields,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExport(options);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="导出申请记录"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="导出格式"
          options={formatOptions}
          value={options.format}
          onChange={(e) => handleFormatChange(e.target.value)}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            日期范围
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={options.dateRange.start}
              onChange={(e) => handleDateChange('start', e.target.value)}
            />
            <Input
              type="date"
              value={options.dateRange.end}
              onChange={(e) => handleDateChange('end', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            导出字段
          </label>
          <select
            multiple
            value={options.fields}
            onChange={handleFieldChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            size={5}
          >
            {fieldOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500">
            按住 Ctrl 键（Windows）或 Command 键（Mac）可以选择多个字段
          </p>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            取消
          </Button>
          <Button
            type="submit"
            variant="primary"
          >
            导出
          </Button>
        </div>
      </form>
    </Modal>
  );
}; 