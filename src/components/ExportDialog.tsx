import React, { useState } from 'react';
import { JobApplication } from '../types/job';
import { exportApplications, downloadFile } from '../services/applicationExport';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  applications: JobApplication[];
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  applications,
}) => {
  const [format, setFormat] = useState<'csv' | 'excel'>('csv');
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  }>({
    start: '',
    end: '',
  });
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const options = {
        format,
        dateRange: dateRange.start && dateRange.end
          ? {
              start: new Date(dateRange.start),
              end: new Date(dateRange.end),
            }
          : undefined,
        status: selectedStatus.length > 0 ? selectedStatus : undefined,
      };

      const blob = await exportApplications(applications, options);
      const filename = `applications_${new Date().toISOString().split('T')[0]}.${format}`;
      downloadFile(blob, filename);
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      alert('导出失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          导出申请数据
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              导出格式
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as 'csv' | 'excel')}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              日期范围
            </label>
            <div className="mt-1 grid grid-cols-2 gap-4">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              申请状态
            </label>
            <div className="space-y-2">
              {['pending', 'reviewed', 'accepted', 'rejected'].map((status) => (
                <label key={status} className="inline-flex items-center mr-4">
                  <input
                    type="checkbox"
                    checked={selectedStatus.includes(status)}
                    onChange={() => handleStatusChange(status)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {status === 'pending' && '待处理'}
                    {status === 'reviewed' && '已审核'}
                    {status === 'accepted' && '已接受'}
                    {status === 'rejected' && '已拒绝'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isExporting ? '导出中...' : '导出'}
          </button>
        </div>
      </div>
    </div>
  );
}; 