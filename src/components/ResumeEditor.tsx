import React, { useState } from 'react';
import { StudentProfile } from '../types/user';

interface ResumeEditorProps {
  initialData: {
    education: StudentProfile['education'];
    experience: StudentProfile['experience'];
    skills: StudentProfile['skills'];
  };
  onSave: (data: {
    education: StudentProfile['education'];
    experience: StudentProfile['experience'];
    skills: StudentProfile['skills'];
  }) => void;
  onCancel: () => void;
}

const ResumeEditor: React.FC<ResumeEditorProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [education, setEducation] = useState(initialData.education);
  const [experience, setExperience] = useState(initialData.experience);
  const [skills, setSkills] = useState(initialData.skills);
  const [newSkill, setNewSkill] = useState({ technical: '', soft: '' });

  const handleEducationChange = (field: keyof typeof education, value: string | number) => {
    setEducation(prev => ({ ...prev, [field]: value }));
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
    setExperience(prev => {
      const newExp = [...prev];
      newExp[index] = { ...newExp[index], [field]: value };
      return newExp;
    });
  };

  const addExperience = () => {
    setExperience(prev => [
      ...prev,
      {
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        description: '',
      },
    ]);
  };

  const removeExperience = (index: number) => {
    setExperience(prev => prev.filter((_, i) => i !== index));
  };

  const addSkill = (type: 'technical' | 'soft') => {
    if (newSkill[type].trim()) {
      setSkills(prev => ({
        ...prev,
        [type]: [...prev[type], newSkill[type].trim()],
      }));
      setNewSkill(prev => ({ ...prev, [type]: '' }));
    }
  };

  const removeSkill = (type: 'technical' | 'soft', index: number) => {
    setSkills(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ education, experience, skills });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">编辑简历</h2>
        <p className="text-gray-600">
          请修改以下信息，确保信息准确无误
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 教育经历 */}
        <section className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">教育经历</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">学校</label>
              <input
                type="text"
                value={education.school}
                onChange={e => handleEducationChange('school', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">专业</label>
              <input
                type="text"
                value={education.major}
                onChange={e => handleEducationChange('major', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">毕业年份</label>
              <input
                type="number"
                value={education.graduationYear}
                onChange={e => handleEducationChange('graduationYear', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">GPA</label>
              <input
                type="number"
                step="0.01"
                value={education.gpa || ''}
                onChange={e => handleEducationChange('gpa', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </section>

        {/* 工作经验 */}
        <section className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">工作经验</h3>
            <button
              type="button"
              onClick={addExperience}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              添加经历
            </button>
          </div>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index} className="border-l-4 border-indigo-500 pl-4">
                <div className="flex justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900">经历 {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    删除
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">职位</label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={e => handleExperienceChange(index, 'title', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">公司</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={e => handleExperienceChange(index, 'company', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">开始日期</label>
                      <input
                        type="month"
                        value={exp.startDate}
                        onChange={e => handleExperienceChange(index, 'startDate', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">结束日期</label>
                      <input
                        type="month"
                        value={exp.endDate}
                        onChange={e => handleExperienceChange(index, 'endDate', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">工作描述</label>
                    <textarea
                      value={exp.description}
                      onChange={e => handleExperienceChange(index, 'description', e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 技能 */}
        <section className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">技能</h3>
          <div className="space-y-6">
            {/* 技术技能 */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">技术技能</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.technical.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm flex items-center"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill('technical', index)}
                      className="ml-2 text-indigo-600 hover:text-indigo-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill.technical}
                  onChange={e => setNewSkill(prev => ({ ...prev, technical: e.target.value }))}
                  placeholder="添加技术技能"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => addSkill('technical')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  添加
                </button>
              </div>
            </div>

            {/* 软技能 */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">软技能</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.soft.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill('soft', index)}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill.soft}
                  onChange={e => setNewSkill(prev => ({ ...prev, soft: e.target.value }))}
                  placeholder="添加软技能"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => addSkill('soft')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  添加
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            取消
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            保存修改
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResumeEditor; 