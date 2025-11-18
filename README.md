# 🎥 Full Streamer System - نظام الستريمر الشامل

<div dir="rtl">

## ✨ نظام متكامل لإدارة الستريمرز على Discord

نظام احترافي شامل لإدارة فريق الستريمرز مع دعم كامل للغة العربية والإنجليزية، متكامل مع جميع منصات البث الرئيسية، ومزود بذكاء اصطناعي متقدم.

</div>

## 🌟 Features | المميزات

### 1. 📝 Application & Ticket System | نظام التقديم والتذاكر
- Streamer application system with modal forms
- Multiple ticket types (Application, Issues, Credit Requests, Promotion, Support)
- Role-based ticket viewing permissions
- Automated ticket channel creation

### 2. 📜 Platform Rules System | قوانين المنصات
- Custom rules for each platform (YouTube, TikTok, Twitch, Kick, Instagram, Facebook Gaming)
- Weekly video/stream hour requirements
- Automated compliance notifications
- Content guidelines per platform

### 3. 📊 Analytics System | نظام التحليلات
- Weekly and monthly performance reports
- Top 3 streamers leaderboard
- Platform comparison analytics
- Engagement tracking and metrics

### 4. 💰 Credit System | نظام الكريدت
- Automatic credit rewards for:
  - Video uploads
  - Stream sessions
  - Weekly goals achievement
  - High engagement content
- Admin-only credit modification
- Credit transfer between members
- Complete transaction history
- Digital wallet system

### 5. 🏪 Rewards Store | متجر المكافآت
- Rank upgrades
- Content promotion services
- Video editing services
- Gift cards and physical rewards
- Streaming tools and software
- Personal coaching sessions

### 6. 📅 Streaming Schedule | جدول البث
- Custom schedule per streamer
- 1-hour pre-stream reminders
- Missed stream alerts
- Multi-platform schedule support

### 7. 🔔 Smart Alerts | الإشعارات الذكية
- New video upload notifications
- Live stream start/stop notifications
- Inactivity warnings (7 days)
- Rule violation alerts

### 8. 🔗 Platform Integration | ربط المنصات
Full API integration with:
- ✅ YouTube (Videos, Analytics, Live Streams)
- ✅ Twitch (Streams, Followers, VODs)
- ✅ TikTok (Videos, Analytics)
- ✅ Kick (Streams, Channel Info)
- ✅ Instagram (Reels, Stories, Insights)
- ✅ Facebook Gaming (Streams, Videos)

### 9. 👥 Community Management | إدارة المجتمع
- Weekly workshops and training
- Personalized tips for each streamer
- Advisory channels
- Community events

### 10. 💬 Direct Support | الدعم المباشر
- Ticket-based communication
- Real-time staff support
- Multi-language support

### 11. 📱 Interactive Dashboard | لوحة التحكم التفاعلية
Built with Next.js and deployed on Vercel:
- Stream hours tracking
- Video count display
- Credit balance overview
- Performance ratings
- Platform analytics visualization
- Streamer profile management

### 12. 🌐 Multi-Language Support | دعم متعدد اللغات
- Arabic (العربية) - Primary
- English - Full support
- Easy language switching

### 13. 🤖 AI Integration | الذكاء الاصطناعي
Powered by OpenAI GPT-4:
- Smart responses to queries
- Content analysis and improvement suggestions
- Optimal streaming time recommendations
- Video title/description generation
- Automatic violation detection
- Script outlines for videos
- Personalized performance tips

### 14. 🎁 Additional Rewards | المكافآت الإضافية
- Weekly challenges
- Seasonal rewards
- Savings wallet with interest
- Milestone achievements (100 videos, 100 hours, etc.)

### 15. 👥 Multi-Streamer Support | دعم ستريمرز متعددين
- Unlimited streamers
- Individual profiles per streamer
- Separate credit wallets
- Custom rules per streamer
- Individual schedules
- Independent analytics

## 🚀 Installation | التثبيت

### Prerequisites | المتطلبات
- Node.js 18+ 
- PostgreSQL database
- Discord Bot Token
- API Keys for platforms (YouTube, Twitch, TikTok, etc.)
- OpenAI API Key
- Vercel account (for dashboard deployment)

### Setup Steps | خطوات الإعداد

1. **Clone the repository | استنساخ المشروع**
```bash
git clone https://github.com/AKTROLEK/bot-secret-full-focus-.git
cd bot-secret-full-focus-
```

2. **Install dependencies | تثبيت المكتبات**
```bash
npm install
```

3. **Configure environment variables | إعداد المتغيرات البيئية**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Set up database | إعداد قاعدة البيانات**
```bash
npm run db:push
npm run db:generate
```

5. **Start the bot | تشغيل البوت**
```bash
npm start
# or for development with auto-reload
npm run dev
```

6. **Deploy dashboard to Vercel | نشر اللوحة على Vercel**
```bash
cd dashboard
vercel --prod
```

## 📋 Environment Variables | المتغيرات البيئية

See `.env.example` for all required environment variables including:
- Discord configuration
- Database URL
- Platform API keys
- OpenAI API key
- Role and channel IDs

## 🎮 Commands | الأوامر

### General Commands | الأوامر العامة
- `/help` - Show all commands | عرض جميع الأوامر
- `/apply` - Apply as streamer | التقديم كـ ستريمر

### Ticket Commands | أوامر التذاكر
- `/ticket create` - Create ticket | إنشاء تذكرة
- `/ticket close` - Close ticket | إغلاق تذكرة
- `/ticket list` - List tickets | عرض التذاكر

### Credit Commands | أوامر الكريدت
- `/credits balance` - Check balance | عرض الرصيد
- `/credits transfer` - Transfer credits | تحويل كريدت
- `/credits history` - View history | عرض السجل

### Rewards Commands | أوامر المكافآت
- `/rewards list` - Browse rewards | عرض المكافآت
- `/rewards buy` - Purchase reward | شراء مكافأة

### Analytics Commands | أوامر التحليلات
- `/analytics view` - View analytics | عرض التحليلات
- `/analytics weekly` - Weekly report | تقرير أسبوعي
- `/analytics monthly` - Monthly report | تقرير شهري
- `/analytics leaderboard` - Top streamers | المتصدرين

### Schedule Commands | أوامر الجدول
- `/schedule add` - Add schedule | إضافة جدول
- `/schedule view` - View schedule | عرض الجدول
- `/schedule remove` - Remove schedule | إزالة جدول

### Admin Commands | أوامر الإدارة
- `/admin credit add` - Add credits | إضافة كريدت
- `/admin credit remove` - Remove credits | خصم كريدت
- `/admin streamer approve` - Approve application | قبول طلب
- `/admin streamer reject` - Reject application | رفض طلب
- `/admin streamer suspend` - Suspend streamer | إيقاف ستريمر
- `/admin reward create` - Create reward | إنشاء مكافأة

## 🏗️ Project Structure | هيكل المشروع

```
bot-secret-full-focus-/
├── src/
│   ├── bot/
│   │   ├── commands/         # Slash commands
│   │   │   ├── application/  # Application commands
│   │   │   ├── ticket/       # Ticket system
│   │   │   ├── credit/       # Credit system
│   │   │   ├── rewards/      # Rewards store
│   │   │   ├── analytics/    # Analytics
│   │   │   ├── schedule/     # Schedules
│   │   │   ├── admin/        # Admin commands
│   │   │   └── general/      # General commands
│   │   ├── events/           # Discord events
│   │   ├── services/         # External services
│   │   │   ├── ai.service.js       # OpenAI integration
│   │   │   └── platform.service.js # Platform APIs
│   │   ├── utils/            # Utilities
│   │   │   └── language.js   # i18n translations
│   │   └── index.js          # Bot entry point
│   └── api/                  # REST API (optional)
├── dashboard/                # Next.js dashboard
├── prisma/
│   └── schema.prisma         # Database schema
├── package.json
├── .env.example
└── README.md
```

## 🗄️ Database Schema | مخطط قاعدة البيانات

The system uses PostgreSQL with Prisma ORM. Main models:
- Streamer
- StreamerPlatform
- Application
- Ticket
- CreditTransaction
- Reward
- RewardPurchase
- StreamSchedule
- Analytics
- Achievement
- PlatformRule
- SystemSetting

## 🌐 Dashboard | لوحة التحكم

The dashboard is built with:
- **Next.js 14** - React framework
- **React** - UI library
- **Tailwind CSS** - Styling
- **Prisma** - Database ORM
- **Vercel** - Hosting platform

### Dashboard Features:
- User authentication
- Streamer profiles
- Credit wallet
- Analytics visualization
- Rewards store UI
- Schedule management
- Admin panel

## 🔒 Security | الأمان

- Environment variables for sensitive data
- Role-based permissions
- Admin-only command restrictions
- Secure API integrations
- Database encryption
- Input validation

## 🤝 Contributing | المساهمة

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📄 License | الترخيص

MIT License - See LICENSE file for details

## 📞 Support | الدعم

For support and questions:
- Create an issue on GitHub
- Contact: [Your Contact Info]

## 🙏 Credits | الشكر

- Discord.js - Discord bot framework
- Prisma - Database ORM
- OpenAI - AI integration
- Next.js - Dashboard framework
- Vercel - Hosting platform

---

<div dir="rtl">

## 🎯 ملاحظات مهمة

### متطلبات التشغيل
- خادم Discord
- قاعدة بيانات PostgreSQL
- مفاتيح API للمنصات
- حساب OpenAI
- حساب Vercel للنشر

### الإعداد الأولي
1. إنشاء بوت Discord والحصول على التوكن
2. إنشاء قاعدة بيانات PostgreSQL
3. الحصول على مفاتيح API من جميع المنصات
4. إعداد ملف .env بجميع المعلومات
5. تشغيل البوت والتأكد من عمله بشكل صحيح

### الدعم الفني
البوت يدعم جميع الميزات المطلوبة بشكل كامل مع دعم اللغتين العربية والإنجليزية.

</div>

**Built with ❤️ for the streaming community**