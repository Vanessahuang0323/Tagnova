import React, { useState } from 'react';
import { JobApplication } from '../types/job';
import { exportApplications } from '../services/applicationExport';

interface ApplicationDataToolsProps {
  applications: JobApplication[];
  onFilterChange: (filtered: JobApplication[]) => void;
}

export const ApplicationDataTools: React.FC<ApplicationDataToolsProps> = ({
  applications,
  onFilterChange,
}) => {
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel'>('csv');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [industryFilter, setIndustryFilter] = useState<string[]>([]);

  const handleExport = async () => {
    try {
      const filters = {
        dateRange,
        status: statusFilter,
        industry: industryFilter,
      };
      await exportApplications(applications, exportFormat, filters);
      setShowExportDialog(false);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleFilter = () => {
    let filtered = [...applications];

    // 日期范围筛选
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(app => {
        const appliedDate = new Date(app.appliedAt);
        return appliedDate >= new Date(dateRange.start) && 
               appliedDate <= new Date(dateRange.end);
      });
    }

    // 状态筛选
    if (statusFilter.length > 0) {
      filtered = filtered.filter(app => statusFilter.includes(app.status));
    }

    // 行业筛选
    if (industryFilter.length > 0) {
      filtered = filtered.filter(app => 
        app.job && industryFilter.includes(app.job.industry)
      );
    }

    onFilterChange(filtered);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">日期范围</label>
          <div className="mt-1 flex space-x-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">状态</label>
          <select
            multiple
            value={statusFilter}
            onChange={(e) => setStatusFilter(Array.from(e.target.selectedOptions, option => option.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="pending">待处理</option>
            <option value="reviewed">已查看</option>
            <option value="accepted">已接受</option>
            <option value="rejected">已拒绝</option>
            <option value="withdrawn">已撤回</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">行业</label>
          <select
            multiple
            value={industryFilter}
            onChange={(e) => setIndustryFilter(Array.from(e.target.selectedOptions, option => option.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="technology">技术</option>
            <option value="finance">金融</option>
            <option value="healthcare">医疗</option>
            <option value="education">教育</option>
            <option value="retail">零售</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={handleFilter}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          应用筛选
        </button>
        <button
          onClick={() => setShowExportDialog(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          导出数据
        </button>
      </div>

      {showExportDialog && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">导出数据</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">导出格式</label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as 'csv' | 'excel')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="csv">CSV</option>
                  <option value="excel">Excel</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowExportDialog(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  取消
                </button>
                <button
                  onClick={handleExport}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  导出
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 