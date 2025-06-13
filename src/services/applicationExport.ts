import { JobApplication } from '../types/job';
import * as XLSX from 'xlsx';

interface ExportFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  status?: string[];
  industry?: string[];
  salaryRange?: {
    min: number;
    max: number;
  };
  experience?: string[];
  education?: string[];
}

interface ExportProgress {
  current: number;
  total: number;
  message: string;
}

export const exportApplications = async (
  applications: JobApplication[],
  format: 'csv' | 'excel',
  filters?: ExportFilters,
  onProgress?: (progress: ExportProgress) => void
): Promise<void> => {
  let filteredApplications = [...applications];
  let jobDetails: any[] = [];

  // 应用筛选条件
  if (filters) {
    onProgress?.({ current: 0, total: 100, message: '正在应用筛选条件...' });

    if (filters.dateRange?.start && filters.dateRange?.end) {
      filteredApplications = filteredApplications.filter(app => {
        const appliedDate = new Date(app.appliedDate);
        return appliedDate >= new Date(filters.dateRange!.start) && 
               appliedDate <= new Date(filters.dateRange!.end);
      });
    }

    if (filters.status?.length) {
      filteredApplications = filteredApplications.filter(app => 
        filters.status!.includes(app.status)
      );
    }

    onProgress?.({ current: 20, total: 100, message: '正在获取职位详情...' });

    // 由于 JobApplication 接口中没有 job 属性，我们需要从其他地方获取这些信息
    // 这里假设我们有一个获取职位详情的服务
    jobDetails = await Promise.all(
      filteredApplications.map(app => getJobDetails(app.jobId))
    );

    if (filters.industry?.length) {
      filteredApplications = filteredApplications.filter((app, index) => 
        jobDetails[index] && filters.industry!.includes(jobDetails[index].industry)
      );
    }

    if (filters.salaryRange) {
      filteredApplications = filteredApplications.filter((app, index) => 
        jobDetails[index] && 
        jobDetails[index].salary.min >= filters.salaryRange!.min && 
        jobDetails[index].salary.max <= filters.salaryRange!.max
      );
    }

    if (filters.experience?.length) {
      filteredApplications = filteredApplications.filter((app, index) => 
        jobDetails[index] && filters.experience!.includes(jobDetails[index].requirements.experience)
      );
    }

    if (filters.education?.length) {
      filteredApplications = filteredApplications.filter((app, index) => 
        jobDetails[index] && filters.education!.includes(jobDetails[index].requirements.education)
      );
    }
  }

  onProgress?.({ current: 40, total: 100, message: '正在准备导出数据...' });

  // 准备导出数据
  const exportData = filteredApplications.map((app, index) => {
    const jobDetail = jobDetails[index];
    return {
      id: app.id,
      jobTitle: jobDetail?.title || '',
      company: jobDetail?.companyId || '',
      industry: jobDetail?.industry || '',
      location: jobDetail?.location || '',
      salary: jobDetail?.salary ? `${jobDetail.salary.min}-${jobDetail.salary.max} ${jobDetail.salary.currency}` : '',
      experience: jobDetail?.requirements.experience || '',
      education: jobDetail?.requirements.education || '',
      status: app.status,
      appliedDate: app.appliedDate,
      reviewedDate: app.reviewedDate || '',
      notes: app.notes || '',
    };
  });

  onProgress?.({ current: 60, total: 100, message: '正在生成文件...' });

  // 根据格式导出
  if (format === 'csv') {
    await exportToCSV(exportData);
  } else {
    await exportToExcel(exportData);
  }

  onProgress?.({ current: 100, total: 100, message: '导出完成' });
};

const exportToCSV = async (data: any[]): Promise<void> => {
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `applications_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};

const exportToExcel = async (data: any[]): Promise<void> => {
  // 创建工作簿
  const wb = XLSX.utils.book_new();
  
  // 创建工作表
  const ws = XLSX.utils.json_to_sheet(data);
  
  // 设置列宽
  const colWidths = Object.keys(data[0]).map(key => ({
    wch: Math.max(key.length, 15) // 设置最小列宽为15
  }));
  ws['!cols'] = colWidths;
  
  // 添加工作表到工作簿
  XLSX.utils.book_append_sheet(wb, ws, 'Applications');
  
  // 生成Excel文件并下载
  XLSX.writeFile(wb, `applications_${new Date().toISOString().split('T')[0]}.xlsx`);
};

// 获取职位详情的服务函数
const getJobDetails = async (jobId: string) => {
  try {
    const response = await fetch(`/api/jobs/${jobId}`);
    if (!response.ok) {
      throw new Error('获取职位详情失败');
    }
    return await response.json();
  } catch (error) {
    console.error('获取职位详情失败:', error);
    return null;
  }
}; 