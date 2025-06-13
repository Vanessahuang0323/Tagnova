import React, { useState, useEffect } from 'react';
import { JobApplication } from '../types/job';

interface ApplicationFilterProps {
  applications: JobApplication[];
  onFilterChange: (filtered: JobApplication[]) => void;
}

type SortOption = 'newest' | 'oldest' | 'status';

export const ApplicationFilter: React.FC<ApplicationFilterProps> = ({
  applications,
  onFilterChange,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let filtered = [...applications];

    // 状态筛选
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // 日期筛选
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

      filtered = filtered.filter(app => {
        const appliedDate = new Date(app.appliedAt);
        switch (dateFilter) {
          case 'today':
            return appliedDate >= today;
          case 'week':
            return appliedDate >= lastWeek;
          case 'month':
            return appliedDate >= lastMonth;
          default:
            return true;
        }
      });
    }

    // 搜索筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app =>
        app.job.title.toLowerCase().includes(query) ||
        app.job.company.toLowerCase().includes(query) ||
        app.job.industry.toLowerCase().includes(query)
      );
    }

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime();
        case 'oldest':
          return new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime();
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    onFilterChange(filtered);
  }, [applications, statusFilter, dateFilter, sortBy, searchQuery, onFilterChange]);

  return (
    <div className="bg-white shadow rounded-lg p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            申请状态
          </label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="all">全部状态</option>
            <option value="pending">待处理</option>
            <option value="reviewed">已审核</option>
            <option value="accepted">已接受</option>
            <option value="rejected">已拒绝</option>
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            申请时间
          </label>
          <select
            id="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="all">全部时间</option>
            <option value="today">今天</option>
            <option value="week">最近一周</option>
            <option value="month">最近一个月</option>
          </select>
        </div>

        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700">
            排序方式
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="newest">最新申请</option>
            <option value="oldest">最早申请</option>
            <option value="status">按状态</option>
          </select>
        </div>

        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            搜索
          </label>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索职位、公司或行业..."
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          />
        </div>
      </div>
    </div>
  );
}; 