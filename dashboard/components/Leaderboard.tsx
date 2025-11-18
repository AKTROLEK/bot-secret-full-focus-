'use client';

import { useState, useEffect } from 'react';

export default function Leaderboard() {
  const [topStreamers, setTopStreamers] = useState([
    { rank: 1, username: 'StreamerPro', videos: 25, streamHours: 48, credits: 2500 },
    { rank: 2, username: 'GamingKing', videos: 22, streamHours: 45, credits: 2200 },
    { rank: 3, username: 'LiveMaster', videos: 20, streamHours: 42, credits: 2000 },
  ]);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-4">Top Streamers 🏆</h2>
      <div className="space-y-3">
        {topStreamers.map((streamer) => (
          <div
            key={streamer.rank}
            className="bg-white/5 rounded-lg p-4 flex items-center justify-between hover:bg-white/10 transition"
          >
            <div className="flex items-center space-x-4">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                ${streamer.rank === 1 ? 'bg-yellow-500' : ''}
                ${streamer.rank === 2 ? 'bg-gray-400' : ''}
                ${streamer.rank === 3 ? 'bg-orange-600' : ''}
                ${streamer.rank > 3 ? 'bg-gray-600' : ''}
              `}>
                {streamer.rank}
              </div>
              <div>
                <p className="text-white font-semibold">{streamer.username}</p>
                <p className="text-gray-300 text-sm">
                  📹 {streamer.videos} videos | ⏱️ {streamer.streamHours}h
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-green-400 font-bold">{streamer.credits}</p>
              <p className="text-gray-400 text-xs">credits</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
