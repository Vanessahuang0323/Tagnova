import React from 'react';
import { StudentProfile } from '../types/user';

interface ResumePreviewProps {
  resume: {
    education: StudentProfile['education'];
    experience: StudentProfile['experience'];
    skills: StudentProfile['skills'];
  };
  onConfirm: () => void;
  onEdit: () => void;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({
  resume,
  onConfirm,
  onEdit,
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">简历预览</h2>
        <p className="text-gray-600">
          请确认以下信息是否正确，您可以进行修改或确认使用
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 space-y-8">
        {/* 教育经历 */}
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">教育经历</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">学校</span>
              <span className="text-gray-900">{resume.education.school}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">专业</span>
              <span className="text-gray-900">{resume.education.major}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">毕业年份</span>
              <span className="text-gray-900">{resume.education.graduationYear}</span>
            </div>
            {resume.education.gpa && (
              <div className="flex justify-between">
                <span className="text-gray-600">GPA</span>
                <span className="text-gray-900">{resume.education.gpa}</span>
              </div>
            )}
          </div>
        </section>

        {/* 工作经验 */}
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">工作经验</h3>
          <div className="space-y-6">
            {resume.experience.map((exp, index) => (
              <div key={index} className="border-l-4 border-indigo-500 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{exp.title}</h4>
                    <p className="text-gray-600">{exp.company}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {exp.startDate} - {exp.endDate}
                  </div>
                </div>
                <p className="text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 技能 */}
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">技能</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">技术技能</h4>
              <div className="flex flex-wrap gap-2">
                {resume.skills.technical.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">软技能</h4>
              <div className="flex flex-wrap gap-2">
                {resume.skills.soft.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8 flex justify-end space-x-4">
        <button
          onClick={onEdit}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          修改信息
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          确认使用
        </button>
      </div>
    </div>
  );
};

export default ResumePreview; 