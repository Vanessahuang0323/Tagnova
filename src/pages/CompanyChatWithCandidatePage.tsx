import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { ChevronLeft, Send, CheckCircle, Edit2 } from 'lucide-react';

const CompanyChatWithCandidatePage: React.FC = () => {
  const navigate = useNavigate();

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

        {/* Chat Bubbles */}
        <div className="flex flex-col space-y-4">
          {/* AI Agent Message */}
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
              <img src="https://via.placeholder.com/32" alt="AI Agent" className="rounded-full" /> {/* Replace with actual AI icon */}
            </div>
            <div className="bg-purple-100 p-3 rounded-lg max-w-[80%] text-purple-800 shadow-md" style={{ borderBottomLeftRadius: '0.25rem' }}>
              <p>Hello, after reviewing your resume, we believe you are a great fit for this position. We'd like to schedule an interview with you. May I ask when you would be available?</p>
            </div>
          </div>

          {/* User Message */}
          <div className="flex justify-end items-start">
            <div className="bg-pink-100 p-3 rounded-lg max-w-[80%] text-pink-800 shadow-md" style={{ borderBottomRightRadius: '0.25rem' }}>
              <p>I'm available for an interview any morning this week.</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center ml-2">
              <img src="https://via.placeholder.com/32" alt="User" className="rounded-full" /> {/* Replace with actual User icon */}
            </div>
          </div>

          {/* AI Agent Message 2 */}
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
              <img src="https://via.placeholder.com/32" alt="AI Agent" className="rounded-full" />
            </div>
            <div className="bg-purple-100 p-3 rounded-lg max-w-[80%] text-purple-800 shadow-md" style={{ borderBottomLeftRadius: '0.25rem' }}>
              <p>Great! Would Tuesday, June 24th work for you?</p>
            </div>
          </div>

          {/* User Message 2 */}
          <div className="flex justify-end items-start">
            <div className="bg-pink-100 p-3 rounded-lg max-w-[80%] text-pink-800 shadow-md" style={{ borderBottomRightRadius: '0.25rem' }}>
              <p>No problem. Thank you!</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center ml-2">
              <img src="https://via.placeholder.com/32" alt="User" className="rounded-full" />
            </div>
          </div>
        </div>

        {/* Confirmed Interview Information */}
        <div className="bg-purple-100 p-4 rounded-lg shadow-md mt-6 text-purple-800">
          <p className="font-semibold mb-2">The following is the confirmed Interview information:</p>
          <p>Location: ABC Company</p>
          <p>Time: Tuesday, June 24, 10:00 AM</p>
          <div className="flex justify-end space-x-4 mt-4">
            <button className="p-2 rounded-full bg-purple-200 hover:bg-purple-300 transition-colors">
              <CheckCircle className="w-6 h-6 text-purple-700" />
            </button>
            <button className="p-2 rounded-full bg-purple-200 hover:bg-purple-300 transition-colors">
              <Edit2 className="w-6 h-6 text-purple-700" />
            </button>
          </div>
        </div>

        {/* Message Input */}
        <div className="relative mt-8">
          <input
            type="text"
            placeholder="Type some words......"
            className="w-full px-4 py-3 pr-12 rounded-full bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-800 placeholder-gray-500"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-purple-300 hover:bg-purple-400 transition-colors">
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyChatWithCandidatePage; 