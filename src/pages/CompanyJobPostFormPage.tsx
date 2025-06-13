import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { ChevronLeft } from 'lucide-react';

const CompanyJobPostFormPage: React.FC = () => {
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

        {/* Form Fields */}
        <div className="space-y-6">
          <div>
            <label htmlFor="talents" className="block text-gray-700 text-base font-medium mb-2">Your company is looking for talents in:</label>
            <input
              type="text"
              id="talents"
              className="w-full px-4 py-3 rounded-lg bg-purple-100 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder=""
            />
          </div>
          <div>
            <label htmlFor="responsibilities" className="block text-gray-700 text-base font-medium mb-2">Main responsibilities:</label>
            <input
              type="text"
              id="responsibilities"
              className="w-full px-4 py-3 rounded-lg bg-purple-100 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder=""
            />
          </div>
          <div>
            <label htmlFor="requirements" className="block text-gray-700 text-base font-medium mb-2">Requirements:</label>
            <input
              type="text"
              id="requirements"
              className="w-full px-4 py-3 rounded-lg bg-purple-100 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder=""
            />
          </div>
          <div>
            <label htmlFor="interviewTask" className="block text-gray-700 text-base font-medium mb-2">Preliminary interview task:</label>
            <textarea
              id="interviewTask"
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-purple-100 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder=""
            ></textarea>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-4 pt-8">
          <button
            className="w-full flex items-center justify-center px-6 py-4 bg-pink-200 rounded-full text-lg font-semibold text-pink-800 shadow-md hover:bg-pink-300 transition-colors duration-300"
            onClick={() => navigate('/company/recommended-candidates')}
          >
            GO!
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            className="w-full flex items-center justify-center px-6 py-4 bg-purple-200 rounded-full text-lg font-semibold text-purple-800 shadow-md hover:bg-purple-300 transition-colors duration-300"
            onClick={() => console.log('Edit')}
          >
            Edit
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyJobPostFormPage; 