import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { JobApplication } from '../types/application';
import { ApplicationList } from '../components/ApplicationList';
import { ApplicationFilter } from '../components/ApplicationFilter';
import { ApplicationStats } from '../components/ApplicationStats';
import { ApplicationCharts } from '../components/ApplicationCharts';
import { ApplicationAdvancedCharts } from '../components/ApplicationAdvancedCharts';
import { ApplicationSuccessAnalysis } from '../components/ApplicationSuccessAnalysis';
import { ApplicationTimeAnalysis } from '../components/ApplicationTimeAnalysis';
import { ApplicationSkillAnalysis } from '../components/ApplicationSkillAnalysis';
import { ApplicationSalaryAnalysis } from '../components/ApplicationSalaryAnalysis';
import { ApplicationDataTools } from '../components/ApplicationDataTools';
import { ApplicationExportDialog } from '../components/ApplicationExportDialog';
import { ApplicationFilterPanel } from '../components/ApplicationFilterPanel';
import { ApplicationStatistics } from '../components/ApplicationStatistics';
import { useAuth } from '../contexts/AuthContext';
import { getApplications, withdrawApplication } from '../services/jobApplication';
import { applicationWebSocket } from '../services/applicationWebSocket';
import { exportApplications } from '../services/applicationExport';
import { useWebSocket } from '../services/applicationWebSocket';
import { useToast } from '../contexts/ToastContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Pagination } from '../components/Pagination';
import { LoadingSpinner } from '../components/LoadingSpinner';

const ITEMS_PER_PAGE = 10;

export const ApplicationListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCharts, setShowCharts] = useState(false);
  const [showAdvancedCharts, setShowAdvancedCharts] = useState(false);
  const [showSuccessAnalysis, setShowSuccessAnalysis] = useState(false);
  const [showTimeAnalysis, setShowTimeAnalysis] = useState(false);
  const [showSkillAnalysis, setShowSkillAnalysis] = useState(false);
  const [showSalaryAnalysis, setShowSalaryAnalysis] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // 使用WebSocket获取实时更新
  const { lastMessage } = useWebSocket();

  useEffect(() => {
    if (lastMessage) {
      const updatedApplication = JSON.parse(lastMessage.data);
      setApplications(prev => 
        prev.map(app => 
          app.id === updatedApplication.id ? updatedApplication : app
        )
      );
    }
  }, [lastMessage]);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getApplications(user!.id);
      setApplications(data);
      setFilteredApplications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取申请列表失败');
      showToast('获取申请列表失败', 'error');
    } finally {
      setLoading(false);
    }
  }, [user, showToast]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchApplications();
  }, [user, navigate, fetchApplications]);

  const handleFilterChange = (filtered: JobApplication[]) => {
    setFilteredApplications(filtered);
  };

  const handleWithdraw = async (applicationId: string) => {
    try {
      await withdrawApplication(applicationId);
      setApplications(applications.filter(app => app.id !== applicationId));
      setFilteredApplications(filteredApplications.filter(app => app.id !== applicationId));
    } catch (err) {
      setError('撤回申请失败');
      console.error(err);
    }
  };

  const handleExport = async (format: 'csv' | 'excel', filters: any) => {
    try {
      await exportApplications(filteredApplications, format, filters);
      setShowExportDialog(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '导出失败');
    }
  };

  const handleFilter = (filters: any) => {
    let filtered = [...applications];
    
    if (filters.status) {
      filtered = filtered.filter(app => app.status === filters.status);
    }
    if (filters.dateRange?.start) {
      filtered = filtered.filter(app => new Date(app.appliedAt) >= new Date(filters.dateRange.start));
    }
    if (filters.dateRange?.end) {
      filtered = filtered.filter(app => new Date(app.appliedAt) <= new Date(filters.dateRange.end));
    }
    if (filters.industry) {
      filtered = filtered.filter(app => app.job && app.job.industry === filters.industry);
    }
    if (filters.experience) {
      filtered = filtered.filter(app => app.job && app.job.experience === filters.experience);
    }
    if (filters.education) {
      filtered = filtered.filter(app => app.job && app.job.education === filters.education);
    }
    
    setFilteredApplications(filtered);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilteredApplications(applications);
    setCurrentPage(1);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'interviewing':
        return 'info';
      case 'offered':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '待处理';
      case 'interviewing':
        return '面试中';
      case 'offered':
        return '已录用';
      case 'rejected':
        return '已拒绝';
      default:
        return status;
    }
  };

  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">请先登录</h2>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            去登录
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <Button
          variant="primary"
          onClick={() => {
            setError(null);
            fetchApplications();
          }}
          className="mt-4"
        >
          重试
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">我的申请</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowCharts(!showCharts)}
              className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
            >
              {showCharts ? '隐藏基础图表' : '显示基础图表'}
            </button>
            <button
              onClick={() => setShowAdvancedCharts(!showAdvancedCharts)}
              className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
            >
              {showAdvancedCharts ? '隐藏高级图表' : '显示高级图表'}
            </button>
            <button
              onClick={() => setShowSuccessAnalysis(!showSuccessAnalysis)}
              className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
            >
              {showSuccessAnalysis ? '隐藏成功率分析' : '显示成功率分析'}
            </button>
            <button
              onClick={() => setShowTimeAnalysis(!showTimeAnalysis)}
              className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
            >
              {showTimeAnalysis ? '隐藏时间分析' : '显示时间分析'}
            </button>
            <button
              onClick={() => setShowSkillAnalysis(!showSkillAnalysis)}
              className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
            >
              {showSkillAnalysis ? '隐藏技能分析' : '显示技能分析'}
            </button>
            <button
              onClick={() => setShowSalaryAnalysis(!showSalaryAnalysis)}
              className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
            >
              {showSalaryAnalysis ? '隐藏薪资分析' : '显示薪资分析'}
            </button>
            <button
              onClick={() => setShowExportDialog(true)}
              className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
            >
              导出数据
            </button>
            <button
              onClick={() => setShowFilterPanel(true)}
              className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
            >
              筛选
            </button>
            <button
              onClick={() => setShowStatistics(true)}
              className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
            >
              显示统计
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <ApplicationStats applications={filteredApplications} />
          
          <div className="bg-white shadow rounded-lg p-6">
            <ApplicationDataTools
              applications={applications}
              onFilterChange={handleFilterChange}
            />
          </div>

          {showFilterPanel && (
            <div className="bg-white shadow rounded-lg p-6">
              <ApplicationFilterPanel
                isOpen={showFilterPanel}
                onClose={() => setShowFilterPanel(false)}
                onFilter={handleFilter}
                onReset={handleResetFilters}
              />
            </div>
          )}
          
          {showStatistics && (
            <ApplicationStatistics
              isOpen={showStatistics}
              onClose={() => setShowStatistics(false)}
              applications={filteredApplications}
            />
          )}
          
          {showCharts && (
            <ApplicationCharts applications={filteredApplications} />
          )}

          {showAdvancedCharts && (
            <ApplicationAdvancedCharts applications={filteredApplications} />
          )}

          {showSuccessAnalysis && (
            <ApplicationSuccessAnalysis applications={filteredApplications} />
          )}

          {showTimeAnalysis && (
            <ApplicationTimeAnalysis applications={filteredApplications} />
          )}

          {showSkillAnalysis && (
            <ApplicationSkillAnalysis applications={filteredApplications} />
          )}

          {showSalaryAnalysis && (
            <ApplicationSalaryAnalysis applications={filteredApplications} />
          )}

          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              <ApplicationFilter
                applications={applications}
                onFilterChange={handleFilterChange}
              />
            </div>
            <div className="border-t border-gray-200">
              <ApplicationList
                applications={paginatedApplications}
                onWithdraw={handleWithdraw}
              />
            </div>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <ApplicationExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExport={handleExport}
      />
    </div>
  );
}; 