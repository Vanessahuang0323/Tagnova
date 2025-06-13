import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { ChatMessage } from '../types/chat';

const ChatInterface: React.FC = () => {
  const { currentSession, chatbotState, sendMessage, getNextStep } = useChat();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() && selectedOptions.length === 0) return;

    const messageToSend = selectedOptions.length > 0
      ? selectedOptions.join(', ')
      : inputValue;

    await sendMessage(messageToSend);
    setInputValue('');
    setSelectedOptions([]);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOptions(prev => {
      if (prev.includes(option)) {
        return prev.filter(o => o !== option);
      }
      return [...prev, option];
    });
  };

  const currentStep = getNextStep();

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentSession?.messages.map((message: ChatMessage) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'system' ? 'justify-center' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'system'
                  ? 'bg-gray-100 text-gray-700'
                  : message.role === currentSession.userType
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {currentStep && (
        <div className="border-t p-4">
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700">{currentStep.question}</p>
            {currentStep.type === 'multiple-choice' && currentStep.options && (
              <div className="mt-2 flex flex-wrap gap-2">
                {currentStep.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionSelect(option)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedOptions.includes(option)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            {currentStep.type === 'text' && (
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="輸入訊息..."
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            )}
            <button
              type="submit"
              disabled={!inputValue.trim() && selectedOptions.length === 0}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              發送
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatInterface; 