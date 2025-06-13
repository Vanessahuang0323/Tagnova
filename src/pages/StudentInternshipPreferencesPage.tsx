import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { ChevronLeft, Plus, X } from 'lucide-react';

interface Preference {
  id: string;
  name: string;
}

const StudentInternshipPreferencesPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentLookingFor, setCurrentLookingFor] = useState<Preference[]>([
    { id: '1', name: '社群媒體' },
    { id: '2', name: '內容策劃' },
  ]);
  const [industries, setIndustries] = useState<Preference[]>([
    { id: '3', name: '時尚' },
    { id: '4', name: '生活品牌' },
  ]);
  const [skills, setSkills] = useState<Preference[]>([
    { id: '5', name: '寫作' },
    { id: '6', name: '視覺設計' },
    { id: '7', name: '主題策劃' },
  ]);
  const [jobPriorities, setJobPriorities] = useState<Preference[]>([
    { id: '8', name: '創意工作' },
    { id: '9', name: '實際專案經驗' },
  ]);
  const [matchedOpportunitiesFocus, setMatchedOpportunitiesFocus] = useState<Preference[]>([
    { id: '10', name: '時尚相關領域的內容策劃' },
    { id: '11', name: '有導師指導和創作自由的平台' },
  ]);

  const [newPreference, setNewPreference] = useState('');

  const handleAddPreference = (setter: React.Dispatch<React.SetStateAction<Preference[]>>) => {
    if (newPreference.trim()) {
      const newId = Date.now().toString();
      setter(prev => [...prev, { id: newId, name: newPreference.trim() }]);
      setNewPreference('');
    }
  };

  const handleRemovePreference = (
    id: string,
    setter: React.Dispatch<React.SetStateAction<Preference[]>>
  ) => {
    setter(prev => prev.filter(pref => pref.id !== id));
  };

  const handleKeyPress = (
    e: React.KeyboardEvent,
    setter: React.Dispatch<React.SetStateAction<Preference[]>>
  ) => {
    if (e.key === 'Enter') {
      handleAddPreference(setter);
    }
  };

  const renderPreferenceSection = (
    title: string,
    preferences: Preference[],
    setter: React.Dispatch<React.SetStateAction<Preference[]>>,
    placeholder: string
  ) => (
    <div className="space-y-2">
      <h2 className="text-gray-700 text-base font-medium">{title}</h2>
      <div className="bg-purple-100 p-4 rounded-lg shadow-md">
        <div className="flex flex-wrap gap-2 mb-4">
          {preferences.map(pref => (
            <div
              key={pref.id}
              className="bg-purple-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded flex items-center gap-2"
            >
              {pref.name}
              <button
                onClick={() => handleRemovePreference(pref.id, setter)}
                className="text-white hover:text-gray-200"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newPreference}
            onChange={(e) => setNewPreference(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, setter)}
            placeholder={placeholder}
            className="flex-grow px-4 py-2 rounded-full bg-purple-100 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300 text-purple-800 placeholder-purple-500"
          />
          <button
            onClick={() => handleAddPreference(setter)}
            className="p-2 bg-purple-200 rounded-full hover:bg-purple-300 transition-colors"
          >
            <Plus className="w-5 h-5 text-purple-800" />
          </button>
        </div>
      </div>
    </div>
  );

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

        {renderPreferenceSection(
          '您目前正在尋找：',
          currentLookingFor,
          setCurrentLookingFor,
          '添加您正在尋找的實習類型'
        )}

        {renderPreferenceSection(
          '您最感興趣的行業：',
          industries,
          setIndustries,
          '添加您感興趣的行業'
        )}

        {renderPreferenceSection(
          '您希望使用或成長的技能：',
          skills,
          setSkills,
          '添加您希望使用或成長的技能'
        )}

        {renderPreferenceSection(
          '對您而言，工作中最重要的：',
          jobPriorities,
          setJobPriorities,
          '添加對您最重要的工作要素'
        )}

        {renderPreferenceSection(
          '匹配機會將重點關注：',
          matchedOpportunitiesFocus,
          setMatchedOpportunitiesFocus,
          '添加匹配機會的重點'
        )}

        {/* Buttons */}
        <div className="space-y-4 pt-8">
          <button
            className="w-full flex items-center justify-center px-6 py-4 bg-pink-200 rounded-full text-lg font-semibold text-pink-800 shadow-md hover:bg-pink-300 transition-colors duration-300"
            onClick={() => navigate('/student/recommended-internships')}
          >
            GO!
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            className="w-full flex items-center justify-center px-6 py-4 bg-purple-200 rounded-full text-lg font-semibold text-purple-800 shadow-md hover:bg-purple-300 transition-colors duration-300"
            onClick={() => console.log('保存偏好')}
          >
            保存偏好
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentInternshipPreferencesPage; 