import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // 秒
}

interface InterviewFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  detailedFeedback: string;
}

export const MockInterviewPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('technical');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { id: 'technical', name: '技术问题' },
    { id: 'behavioral', name: '行为问题' },
    { id: 'system-design', name: '系统设计' },
    { id: 'problem-solving', name: '问题解决' },
  ];

  const difficulties = [
    { id: 'easy', name: '初级' },
    { id: 'medium', name: '中级' },
    { id: 'hard', name: '高级' },
  ];

  const handleStartInterview = async () => {
    setIsLoading(true);
    try {
      // 模拟获取面试题
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentQuestion({
        id: '1',
        question: '请详细描述一下你在项目中遇到的最大挑战，以及你是如何克服的？',
        category: selectedCategory,
        difficulty: selectedDifficulty,
        timeLimit: 180
      });
    } catch (error) {
      console.error('获取面试题失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return;

    setIsLoading(true);
    try {
      // 模拟获取反馈
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setFeedback({
        score: 85,
        strengths: [
          '回答结构清晰',
          '举例具体',
          '解决方案合理'
        ],
        improvements: [
          '可以更详细地说明技术细节',
          '建议补充更多数据支持',
          '可以加入更多个人思考过程'
        ],
        detailedFeedback: '整体表现不错，回答结构清晰，举例恰当。建议在技术细节方面可以更深入一些，同时可以补充一些具体的数据来支持你的观点。在描述解决问题的过程中，可以更多地展示你的思考过程，这样可以让面试官更好地了解你的思维方式。'
      });
    } catch (error) {
      console.error('获取反馈失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">模拟面试</h1>

      {!currentQuestion ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">选择面试类型</h2>
            <div className="grid grid-cols-2 gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-lg border ${
                    selectedCategory === category.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <span className="font-medium">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">选择难度</h2>
            <div className="flex space-x-4">
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty.id}
                  onClick={() => setSelectedDifficulty(difficulty.id as 'easy' | 'medium' | 'hard')}
                  className={`px-4 py-2 rounded-md ${
                    selectedDifficulty === difficulty.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {difficulty.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleStartInterview}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isLoading ? '准备中...' : '开始面试'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">面试问题</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {currentQuestion.difficulty === 'easy' ? '初级' : 
                 currentQuestion.difficulty === 'medium' ? '中级' : '高级'}
              </span>
            </div>
            <p className="text-gray-700 mb-6">{currentQuestion.question}</p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                你的回答
              </label>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入你的回答..."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setCurrentQuestion(null);
                  setUserAnswer('');
                  setFeedback(null);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                返回
              </button>
              <button
                onClick={handleSubmitAnswer}
                disabled={!userAnswer.trim() || isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isLoading ? '提交中...' : '提交回答'}
              </button>
            </div>
          </div>

          {feedback && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">面试反馈</h2>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">总体评分</span>
                  <span className="text-2xl font-bold text-blue-600">{feedback.score}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${feedback.score}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">优点</h3>
                  <ul className="space-y-2">
                    {feedback.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">改进建议</h3>
                  <ul className="space-y-2">
                    {feedback.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-yellow-500 mr-2">•</span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">详细反馈</h3>
                <p className="text-gray-700">{feedback.detailedFeedback}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 