import React, { useState } from 'react';
import { StudentProfile, PersonalityTestResults } from '../types/user';

interface Question {
  id: number;
  text: string;
  trait: keyof PersonalityTestResults;
  options: Array<{
    value: number;
    text: string;
  }>;
}

const questions: Question[] = [
  {
    id: 1,
    text: "在社交場合中，我通常：",
    trait: "extraversion",
    options: [
      { value: 1, text: "感到不自在，希望盡快離開" },
      { value: 2, text: "保持低調，只與認識的人交談" },
      { value: 3, text: "適度參與，但不會太主動" },
      { value: 4, text: "積極參與，樂於認識新朋友" },
      { value: 5, text: "非常活躍，是人群中的焦點" }
    ]
  },
  {
    id: 2,
    text: "當他人需要幫助時，我：",
    trait: "agreeableness",
    options: [
      { value: 1, text: "通常不會主動提供協助" },
      { value: 2, text: "只有在被要求時才會幫忙" },
      { value: 3, text: "會視情況提供適當的協助" },
      { value: 4, text: "經常主動提供幫助" },
      { value: 5, text: "總是樂於幫助他人" }
    ]
  },
  {
    id: 3,
    text: "在完成任務時，我：",
    trait: "conscientiousness",
    options: [
      { value: 1, text: "經常拖延，難以按時完成" },
      { value: 2, text: "有時會拖延，但最終會完成" },
      { value: 3, text: "通常能按時完成任務" },
      { value: 4, text: "總是提前規劃並準時完成" },
      { value: 5, text: "非常注重細節，追求完美" }
    ]
  },
  {
    id: 4,
    text: "面對壓力時，我：",
    trait: "neuroticism",
    options: [
      { value: 1, text: "非常容易感到焦慮和緊張" },
      { value: 2, text: "有時會感到壓力" },
      { value: 3, text: "能保持相對冷靜" },
      { value: 4, text: "通常能很好地處理壓力" },
      { value: 5, text: "幾乎不會被壓力影響" }
    ]
  },
  {
    id: 5,
    text: "對於新事物，我：",
    trait: "openness",
    options: [
      { value: 1, text: "傾向於保持現狀" },
      { value: 2, text: "偶爾願意嘗試新事物" },
      { value: 3, text: "對新事物持開放態度" },
      { value: 4, text: "經常尋求新的體驗" },
      { value: 5, text: "熱衷於探索和嘗試新事物" }
    ]
  }
];

interface PersonalityTestProps {
  onComplete: (results: PersonalityTestResults) => void;
  onSkip: () => void;
}

const PersonalityTest: React.FC<PersonalityTestProps> = ({ onComplete, onSkip }) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const handleAnswer = (trait: string, value: number): void => {
    setAnswers((prev: Record<string, number>) => ({
      ...prev,
      [trait]: value
    }));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev: number) => prev + 1);
    } else {
      const results = calculateResults();
      onComplete(results);
    }
  };

  const calculateResults = (): PersonalityTestResults => {
    const traitScores: Record<string, number[]> = {
      extraversion: [],
      agreeableness: [],
      conscientiousness: [],
      neuroticism: [],
      openness: []
    };

    questions.forEach(question => {
      const score = answers[question.trait] || 0;
      traitScores[question.trait].push(score);
    });

    const results: PersonalityTestResults = {
      extraversion: 0,
      agreeableness: 0,
      conscientiousness: 0,
      neuroticism: 0,
      openness: 0
    };

    Object.entries(traitScores).forEach(([trait, scores]) => {
      results[trait as keyof PersonalityTestResults] = 
        scores.reduce((a, b) => a + b, 0) / scores.length;
    });

    return results;
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">人格測驗</h2>
        <p className="text-gray-600">
          完成測驗將幫助我們更準確地為您推薦適合的工作機會
        </p>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {currentQ.text}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(currentQ.trait, option.value)}
              className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={onSkip}
          className="text-gray-600 hover:text-gray-800"
        >
          稍後再說
        </button>
        <span className="text-sm text-gray-500">
          {currentQuestion + 1} / {questions.length}
        </span>
      </div>
    </div>
  );
};

export default PersonalityTest; 