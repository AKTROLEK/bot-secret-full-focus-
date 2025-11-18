'use client';

import { useState, useEffect } from 'react';
import StatsCard from '@/components/StatsCard';
import CreditWallet from '@/components/CreditWallet';
import Leaderboard from '@/components/Leaderboard';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Home() {
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalStreamHours: 0,
    totalViews: 0,
    credits: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user stats from API
    const fetchStats = async () => {
      try {
        // This would be replaced with actual API call
        // const response = await fetch('/api/streamer/USER_ID');
        // const data = await response.json();
        setStats({
          totalVideos: 42,
          totalStreamHours: 156,
          totalViews: 15234,
          credits: 1250,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Streamer Dashboard</h1>
          <LanguageSwitcher />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-white text-xl">Loading...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Total Videos"
                value={stats.totalVideos}
                icon="📹"
                color="bg-blue-500"
              />
              <StatsCard
                title="Stream Hours"
                value={stats.totalStreamHours}
                icon="⏱️"
                color="bg-purple-500"
              />
              <StatsCard
                title="Total Views"
                value={stats.totalViews.toLocaleString()}
                icon="👁️"
                color="bg-pink-500"
              />
              <StatsCard
                title="Credits"
                value={stats.credits}
                icon="💰"
                color="bg-green-500"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CreditWallet balance={stats.credits} />
              <Leaderboard />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
