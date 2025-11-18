import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const router = useRouter()
  const { locale } = router
  const [activeTab, setActiveTab] = useState('overview')

  const t = {
    en: {
      title: 'Dashboard',
      overview: 'Overview',
      analytics: 'Analytics',
      credits: 'Credits',
      rewards: 'Rewards',
      schedule: 'Schedule',
      settings: 'Settings',
      totalVideos: 'Total Videos',
      totalHours: 'Total Stream Hours',
      creditBalance: 'Credit Balance',
      weeklyGoal: 'Weekly Goal',
      platformsConnected: 'Platforms Connected',
      recentActivity: 'Recent Activity',
      noData: 'No data available. Connect your platforms to see analytics.',
      connect: 'Connect Platforms',
    },
    ar: {
      title: 'لوحة التحكم',
      overview: 'نظرة عامة',
      analytics: 'التحليلات',
      credits: 'الكريدت',
      rewards: 'المكافآت',
      schedule: 'الجدول',
      settings: 'الإعدادات',
      totalVideos: 'إجمالي المقاطع',
      totalHours: 'إجمالي ساعات البث',
      creditBalance: 'رصيد الكريدت',
      weeklyGoal: 'الهدف الأسبوعي',
      platformsConnected: 'المنصات المتصلة',
      recentActivity: 'النشاط الأخير',
      noData: 'لا توجد بيانات. قم بربط منصاتك لعرض التحليلات.',
      connect: 'ربط المنصات',
    },
  }

  const text = t[locale]

  const stats = [
    { label: text.totalVideos, value: '0', icon: '🎥', color: 'bg-blue-500' },
    { label: text.totalHours, value: '0', icon: '⏱️', color: 'bg-purple-500' },
    { label: text.creditBalance, value: '0', icon: '💰', color: 'bg-green-500' },
    { label: text.weeklyGoal, value: '0%', icon: '🎯', color: 'bg-orange-500' },
  ]

  const tabs = [
    { id: 'overview', label: text.overview, icon: '📊' },
    { id: 'analytics', label: text.analytics, icon: '📈' },
    { id: 'credits', label: text.credits, icon: '💰' },
    { id: 'rewards', label: text.rewards, icon: '🏪' },
    { id: 'schedule', label: text.schedule, icon: '📅' },
    { id: 'settings', label: text.settings, icon: '⚙️' },
  ]

  return (
    <>
      <Head>
        <title>{text.title} - Full Streamer System</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">{text.title}</h1>
              <button
                onClick={() => {
                  const newLocale = locale === 'en' ? 'ar' : 'en'
                  router.push(router.pathname, router.asPath, { locale: newLocale })
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {locale === 'en' ? 'العربية' : 'English'}
              </button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} text-white text-3xl p-3 rounded-lg`}>
                    {stat.icon}
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.label}</h3>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎮</div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {text.platformsConnected}
                  </h2>
                  <p className="text-gray-600 mb-6">{text.noData}</p>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    {text.connect}
                  </button>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {text.analytics}
                  </h2>
                  <p className="text-gray-600">{text.noData}</p>
                </div>
              )}

              {activeTab === 'credits' && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💰</div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {text.credits}
                  </h2>
                  <p className="text-gray-600">{text.noData}</p>
                </div>
              )}

              {activeTab === 'rewards' && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏪</div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {text.rewards}
                  </h2>
                  <p className="text-gray-600">{text.noData}</p>
                </div>
              )}

              {activeTab === 'schedule' && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📅</div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {text.schedule}
                  </h2>
                  <p className="text-gray-600">{text.noData}</p>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">⚙️</div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {text.settings}
                  </h2>
                  <p className="text-gray-600">{text.noData}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
