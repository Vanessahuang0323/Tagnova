import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { ChevronLeft, MessageCircle, Bookmark } from 'lucide-react';

const CompanyRecommendedCandidatesPage: React.FC = () => {
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

        {/* Recommendation message */}
        <div className="bg-purple-100 p-4 rounded-lg shadow-md mb-6">
          <p className="text-purple-800 text-base font-semibold">Here are 10 recommended candidates for your consideration:</p>
        </div>

        {/* Candidate Card - Example (You will likely map over an array of candidates here) */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden relative border border-gray-200">
          <div className="flex">
            {/* Candidate Image */}
            <div className="w-2/5">
              <img src="https://via.placeholder.com/150" alt="Candidate" className="w-full h-full object-cover" />
            </div>

            {/* Candidate Details */}
            <div className="w-3/5 p-4 flex flex-col justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Department of Chinese Literature</p>
                <p className="text-gray-600 text-sm mb-2">Fu Jen Catholic University</p>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Ophelia Zhang</h3>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-purple-200 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">#SkilledWordsmith</span>
                  <span className="bg-purple-200 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">#SharpEyeForContent</span>
                  <span className="bg-purple-200 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">#A patient and detail-oriented executor</span>
                  <span className="bg-purple-200 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">#Communicates with kindness and clarity</span>
                </div>
              </div>

              {/* Action Icons */}
              <div className="flex justify-end space-x-4">
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  <MessageCircle className="w-6 h-6 text-gray-600" />
                </button>
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  <Bookmark className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add more expectations input */}
        <div className="relative mt-8">
          <input
            type="text"
            placeholder="Add more expectations"
            className="w-full px-4 py-3 pr-12 rounded-full bg-purple-100 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300 text-purple-800 placeholder-purple-500"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-purple-300 hover:bg-purple-400 transition-colors">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
};

export default CompanyRecommendedCandidatesPage; 