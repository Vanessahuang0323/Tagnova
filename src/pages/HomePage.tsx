import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import Logo from '../components/Logo';
import { Search, FileText, Lightbulb, Mic } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full space-y-8">
        <div className="text-center mb-8">
          <div className="w-48 mx-auto mb-4">
            <Logo size="large" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800 mb-2">AI Talent Matching Platform</h1>
          <p className="text-gray-600 text-sm">
            AI-powered semantic analysis and CRM matching to connect talents with the right opportunities.
          </p>
        </div>

        <Card className="bg-gradient-to-r from-purple-200 to-pink-200 p-6 rounded-lg shadow-md flex flex-col items-center text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Quick start</h2>
          <p className="text-gray-600 text-sm mb-4">
            Upload your resume and get job recommendations immediately !
          </p>
          <button
            onClick={() => navigate('/upload')}
            className="flex items-center px-6 py-3 bg-white rounded-full text-purple-600 font-bold shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Search className="w-5 h-5 mr-2" />
            Find Matching Jobs
          </button>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          <Card
            className="bg-white/90 backdrop-blur-sm hover:bg-white/95 transition-all duration-300 cursor-pointer"
            onClick={() => navigate('/resume')}
          >
            <div className="flex items-center p-4">
              <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full mr-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Resume Analysis</h2>
                <p className="text-gray-600 text-sm">Extract skills and potential using AI</p>
              </div>
            </div>
          </Card>
          <Card
            className="bg-white/90 backdrop-blur-sm hover:bg-white/95 transition-all duration-300 cursor-pointer"
            onClick={() => navigate('/jobs')}
          >
            <div className="flex items-center p-4">
              <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-full mr-4">
                <Lightbulb className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Smart Matching</h2>
                <p className="text-gray-600 text-sm">Precisely match jobs with tags</p>
              </div>
            </div>
          </Card>
          <Card
            className="bg-white/90 backdrop-blur-sm hover:bg-white/95 transition-all duration-300 cursor-pointer"
            onClick={() => navigate('/interview')}
          >
            <div className="flex items-center p-4">
              <div className="w-12 h-12 flex items-center justify-center bg-yellow-100 rounded-full mr-4">
                <Mic className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Mock interviews</h2>
                <p className="text-gray-600 text-sm">Generate interview questions and feedback</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-4">
          <Card
            className="bg-purple-100 p-4 rounded-lg shadow-md flex items-center justify-between cursor-pointer hover:bg-purple-200 transition-colors duration-300"
            onClick={() => navigate('/company/dashboard')}
          >
            <h2 className="text-lg font-semibold text-purple-800">I'm a Company</h2>
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Card>
          <Card
            className="bg-pink-100 p-4 rounded-lg shadow-md flex items-center justify-between cursor-pointer hover:bg-pink-200 transition-colors duration-300"
            onClick={() => navigate('/student/dashboard')}
          >
            <h2 className="text-lg font-semibold text-pink-800">I'm a Student</h2>
            <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;