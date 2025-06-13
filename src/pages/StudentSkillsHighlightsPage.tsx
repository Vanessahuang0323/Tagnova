import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { ChevronLeft, Briefcase, Star, X, Plus } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  type: 'professional' | 'strength';
}

const StudentSkillsHighlightsPage: React.FC = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<Skill[]>([
    { id: '1', name: 'JavaScript', type: 'professional' },
    { id: '2', name: 'React', type: 'professional' },
    { id: '3', name: '團隊合作', type: 'strength' },
    { id: '4', name: '問題解決', type: 'strength' }
  ]);
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = (type: 'professional' | 'strength') => {
    if (newSkill.trim()) {
      const newId = Date.now().toString();
      setSkills([...skills, { id: newId, name: newSkill.trim(), type }]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent, type: 'professional' | 'strength') => {
    if (e.key === 'Enter') {
      handleAddSkill(type);
    }
  };

  const professionalSkills = skills.filter(skill => skill.type === 'professional');
  const coreStrengths = skills.filter(skill => skill.type === 'strength');

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-white">
      <div className="max-w-xl w-full space-y-6">
        {/* Header with back arrow and logo */}
        <div className="flex items-center justify-between w-full mb-8">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex-grow flex justify-center">
            <Logo size="medium" />
          </div>
          <div className="w-6 h-6" /> {/* Placeholder for alignment */}
        </div>

        {/* Resume Highlights Summary */}
        <button className="w-full px-6 py-4 bg-purple-200 rounded-full text-lg font-semibold text-purple-800 shadow-md hover:bg-purple-300 transition-colors duration-300 text-center">
          履歷重點摘要
        </button>

        {/* Professional Skills */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex items-center mb-4">
            <Briefcase className="w-6 h-6 text-gray-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">專業技能</h2>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {professionalSkills.map(skill => (
              <div
                key={skill.id}
                className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 text-sm flex items-center gap-2"
              >
                {skill.name}
                <button
                  onClick={() => handleRemoveSkill(skill.id)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'professional')}
              placeholder="添加專業技能"
              className="flex-grow px-4 py-2 rounded-full bg-purple-100 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300 text-purple-800 placeholder-purple-500"
            />
            <button
              onClick={() => handleAddSkill('professional')}
              className="p-2 bg-purple-200 rounded-full hover:bg-purple-300 transition-colors"
            >
              <Plus className="w-5 h-5 text-purple-800" />
            </button>
          </div>
        </div>

        {/* Core Strengths */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex items-center mb-4">
            <Star className="w-6 h-6 text-gray-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">核心優勢</h2>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {coreStrengths.map(skill => (
              <div
                key={skill.id}
                className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 text-sm flex items-center gap-2"
              >
                {skill.name}
                <button
                  onClick={() => handleRemoveSkill(skill.id)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'strength')}
              placeholder="添加核心優勢"
              className="flex-grow px-4 py-2 rounded-full bg-purple-100 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300 text-purple-800 placeholder-purple-500"
            />
            <button
              onClick={() => handleAddSkill('strength')}
              className="p-2 bg-purple-200 rounded-full hover:bg-purple-300 transition-colors"
            >
              <Plus className="w-5 h-5 text-purple-800" />
            </button>
          </div>
        </div>

        {/* Next Button */}
        <div className="pt-8">
          <button
            className="w-full flex items-center justify-center px-6 py-4 bg-purple-200 rounded-full text-lg font-semibold text-purple-800 shadow-md hover:bg-purple-300 transition-colors duration-300"
            onClick={() => navigate('/student/internship-preferences')}
          >
            下一步
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentSkillsHighlightsPage; 