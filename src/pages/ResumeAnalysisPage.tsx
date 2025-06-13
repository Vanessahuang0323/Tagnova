import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useToast } from '../contexts/ToastContext';

export const ResumeAnalysisPage: React.FC = () => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<{
    skills: string[];
    experience: string[];
    education: string[];
    suggestions: string[];
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf' && file.type !== 'application/msword') {
        showToast('请上传PDF或Word格式的简历', 'error');
        return;
      }
      setResumeFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeFile) {
      showToast('请先上传简历', 'error');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: 实现实际的简历分析逻辑
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setAnalysis({
        skills: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
        experience: [
          '3年前端开发经验',
          '2年全栈开发经验',
          '1年团队管理经验',
        ],
        education: ['计算机科学学士学位', '前端开发认证'],
        suggestions: [
          '建议增加更多项目经验',
          '可以补充一些开源项目贡献',
          '建议加强算法和数据结构的学习',
        ],
      });
      
      showToast('简历分析完成', 'success');
    } catch (error) {
      showToast('简历分析失败，请重试', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">简历分析</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="上传简历" className="h-fit">
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="cursor-pointer text-blue-600 hover:text-blue-500"
              >
                {resumeFile ? resumeFile.name : '点击上传简历'}
              </label>
              <p className="text-sm text-gray-500 mt-2">
                支持PDF和Word格式
              </p>
            </div>

            <Button
              variant="primary"
              fullWidth
              onClick={handleAnalyze}
              isLoading={isLoading}
              disabled={!resumeFile}
            >
              开始分析
            </Button>
          </div>
        </Card>

        {analysis && (
          <div className="space-y-6">
            <Card title="技能分析">
              <ul className="list-disc list-inside space-y-2">
                {analysis.skills.map((skill, index) => (
                  <li key={index} className="text-gray-700">
                    {skill}
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="经验分析">
              <ul className="list-disc list-inside space-y-2">
                {analysis.experience.map((exp, index) => (
                  <li key={index} className="text-gray-700">
                    {exp}
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="教育背景">
              <ul className="list-disc list-inside space-y-2">
                {analysis.education.map((edu, index) => (
                  <li key={index} className="text-gray-700">
                    {edu}
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="改进建议">
              <ul className="list-disc list-inside space-y-2">
                {analysis.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-gray-700">
                    {suggestion}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}; 