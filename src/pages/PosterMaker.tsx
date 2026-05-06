import React from 'react';
import { useNavigate } from 'react-router-dom';

const PosterMaker: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-6">🚧</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            🎨 Poster Maker · पोस्टर बनाने वाला
          </h1>
          <p className="text-gray-600 mb-6">
            Premium members को WhatsApp pe professional poster भेजा जाएगा
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-blue-800 font-semibold mb-2">संपर्क करें:</p>
            <p className="text-blue-600 text-xl font-bold">9304870703</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            वापस जाएं · Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export { PosterMaker };
