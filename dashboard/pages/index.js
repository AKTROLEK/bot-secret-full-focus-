import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  const { locale } = router

  const t = {
    en: {
      title: 'Full Streamer System',
      subtitle: 'Professional Streamer Management System',
      dashboard: 'Go to Dashboard',
      features: 'Features',
      feature1: 'Application & Ticket System',
      feature2: 'Credit System with Wallet',
      feature3: 'Analytics & Reports',
      feature4: 'Rewards Store',
      feature5: 'Platform Integration',
      feature6: 'AI-Powered Insights',
      switchLang: 'التبديل إلى العربية',
    },
    ar: {
      title: 'نظام الستريمر الشامل',
      subtitle: 'نظام احترافي لإدارة الستريمرز',
      dashboard: 'الذهاب إلى لوحة التحكم',
      features: 'المميزات',
      feature1: 'نظام التقديم والتذاكر',
      feature2: 'نظام الكريدت مع المحفظة',
      feature3: 'التحليلات والتقارير',
      feature4: 'متجر المكافآت',
      feature5: 'ربط المنصات',
      feature6: 'رؤى مدعومة بالذكاء الاصطناعي',
      switchLang: 'Switch to English',
    },
  }

  const text = t[locale]

  const switchLanguage = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en'
    router.push(router.pathname, router.asPath, { locale: newLocale })
  }

  return (
    <>
      <Head>
        <title>{text.title}</title>
        <meta name="description" content={text.subtitle} />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-end mb-4">
              <button
                onClick={switchLanguage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {text.switchLang}
              </button>
            </div>
            
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              {text.title}
            </h1>
            <p className="text-2xl text-gray-600 mb-8">{text.subtitle}</p>
            
            <Link
              href="/dashboard"
              className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg"
            >
              {text.dashboard} →
            </Link>
          </div>

          {/* Features Grid */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              {text.features}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: '📝', text: text.feature1 },
                { icon: '💰', text: text.feature2 },
                { icon: '📊', text: text.feature3 },
                { icon: '🏪', text: text.feature4 },
                { icon: '🔗', text: text.feature5 },
                { icon: '🤖', text: text.feature6 },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition"
                >
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {feature.text}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-16 text-gray-600">
            <p>Built with ❤️ for the streaming community</p>
          </div>
        </div>
      </main>
    </>
  )
}
