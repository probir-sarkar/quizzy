import React from 'react';
import { Send } from 'lucide-react';

const TelegramCTA = () => {
  const handleJoinTelegram = () => {
    // Replace with your actual Telegram channel/group link
    window.open('https://t.me/your_channel_name', '_blank');
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      {/* Main CTA Card */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 shadow-2xl transform transition-all hover:scale-105">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-white rounded-full p-3">
            <Send className="w-8 h-8 text-blue-500" />
          </div>
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
            500+ Members
          </span>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">
          Join Our Telegram Community! 🧠
        </h2>
        
        <p className="text-white/90 mb-6 text-sm">
          Get daily quiz challenges, instant results, exclusive brain teasers, and compete with thousands of quiz enthusiasts!
        </p>
        
        <button
          onClick={handleJoinTelegram}
          className="w-full bg-white text-blue-600 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 shadow-lg"
        >
          <Send className="w-5 h-5" />
          Join Telegram Now
        </button>
        
        <div className="mt-4 flex items-center justify-center gap-4 text-white/80 text-xs">
          <span>✓ Daily Updates</span>
          <span>✓ Exclusive Quizzes</span>
          <span>✓ Instant Alerts</span>
        </div>
      </div>

      {/* Alternative: Compact Banner Style */}
      <div className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-full p-2">
              <Send className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">
                Never miss a quiz!
              </p>
              <p className="text-white/80 text-xs">
                Daily challenges on Telegram
              </p>
            </div>
          </div>
          <button
            onClick={handleJoinTelegram}
            className="bg-white text-purple-600 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors text-sm whitespace-nowrap"
          >
            Join Now
          </button>
        </div>
      </div>

      {/* Alternative: Minimal Style */}
      <div className="mt-8 border-2 border-blue-500 rounded-xl p-4 hover:bg-blue-50 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Send className="w-6 h-6 text-blue-500" />
            <div>
              <p className="font-semibold text-gray-800">
                Get Daily Quiz Updates
              </p>
              <p className="text-gray-600 text-sm">
                Join our Telegram community
              </p>
            </div>
          </div>
          <button
            onClick={handleJoinTelegram}
            className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Join
          </button>
        </div>
      </div>

      {/* Floating Action Button Style */}
      <button
        onClick={handleJoinTelegram}
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-2xl hover:bg-blue-600 transition-all hover:scale-110 flex items-center gap-2 group"
      >
        <Send className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-semibold">
          Join Telegram
        </span>
      </button>
    </div>
  );
};

