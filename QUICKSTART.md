# Quick Start Guide - دليل البدء السريع

<div dir="rtl">

## 🚀 البدء السريع

### المتطلبات الأساسية
قبل البدء، تأكد من توفر:
- Node.js 18 أو أحدث
- حساب Discord Developer
- قاعدة بيانات PostgreSQL (أو استخدم Vercel Postgres)
- حساب OpenAI API (للذكاء الاصطناعي)
- مفاتيح API للمنصات (YouTube، Twitch، إلخ)

</div>

## ⚡ 5-Minute Setup

### 1. Clone & Install
```bash
git clone https://github.com/AKTROLEK/bot-secret-full-focus-.git
cd bot-secret-full-focus-
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your credentials
```

**Minimum Required Variables:**
```env
DISCORD_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_client_id
DISCORD_GUILD_ID=your_server_id
DATABASE_URL=postgresql://...
```

### 3. Setup Database
```bash
npm run db:push
npm run db:generate
```

### 4. Start Bot
```bash
npm start
```

### 5. Deploy Dashboard (Optional)
```bash
cd dashboard
npm install
npm run dev  # For local testing
# OR
vercel --prod  # For production
```

## 🎮 First Commands to Try

After inviting the bot to your server:

1. **Check Help**
   ```
   /help
   ```

2. **Apply as Streamer**
   ```
   /apply
   ```

3. **Create a Ticket**
   ```
   /ticket create
   ```

4. **Check Credits**
   ```
   /credits balance
   ```

5. **View Analytics (Admin)**
   ```
   /analytics view
   ```

## 📋 Essential Configuration

### Discord Bot Permissions
When inviting the bot, ensure these permissions:
- ✅ Read Messages/View Channels
- ✅ Send Messages
- ✅ Embed Links
- ✅ Attach Files
- ✅ Use Slash Commands
- ✅ Manage Roles (for auto-role assignment)
- ✅ Manage Channels (for ticket creation)

### Required Discord Setup
1. Create these roles (or configure in .env):
   - Social Media Manager
   - Social Team
   - Streamer Management
   - Streamer

2. Create these channels:
   - #tickets (for ticket system)
   - #announcements (for bot notifications)
   - #analytics (for performance reports)

3. Copy their IDs and add to `.env`

## 🎯 Testing the Bot

### Test Application System
1. Use `/apply` command
2. Fill out the modal
3. Check #tickets channel for the ticket
4. Admin can approve with `/admin streamer approve @user`

### Test Credit System
1. Admin adds credits: `/admin credit add @user 100 "Welcome bonus"`
2. User checks: `/credits balance`
3. User transfers: `/credits transfer @friend 50`

### Test Rewards
1. Admin creates reward: `/admin reward create`
2. Users browse: `/rewards list`
3. Users buy: `/rewards buy [reward-id]`

## 🔧 Troubleshooting

### Bot Not Responding
```bash
# Check if bot is running
ps aux | grep node

# Check logs for errors
npm start
```

### Database Connection Error
```bash
# Test database connection
npx prisma studio

# Reset database (CAUTION: Deletes data)
npx prisma migrate reset
```

### Commands Not Showing in Discord
1. Wait a few minutes (Discord caches commands)
2. Kick and re-invite the bot
3. Check CLIENT_ID and GUILD_ID are correct

## 📚 Next Steps

1. **Customize Rewards**
   - Add rewards using `/admin reward create`
   - Set appropriate credit costs
   - Add descriptions in both languages

2. **Set Platform Rules**
   - Configure weekly requirements per platform
   - Set content guidelines
   - Enable automated compliance checks

3. **Configure Analytics**
   - Connect platform APIs
   - Set up automated data collection
   - Enable weekly reports

4. **Customize Dashboard**
   - Edit branding in `dashboard/pages/index.js`
   - Add custom pages
   - Configure authentication

## 🎨 Customization

### Change Bot Status
Edit `src/bot/events/ready.js`:
```javascript
client.user.setPresence({
  activities: [{ 
    name: 'Your Custom Status',
    type: 3 // 0=Playing, 1=Streaming, 2=Listening, 3=Watching
  }],
  status: 'online', // online, idle, dnd, invisible
});
```

### Add New Commands
1. Create file in `src/bot/commands/[category]/yourcommand.js`
2. Use existing commands as template
3. Restart bot

### Modify Translations
Edit `src/bot/utils/language.js` to add/modify translations.

## 🆘 Common Issues

### "Missing Access" Error
→ Check bot has admin permissions or required roles

### "Database Error"
→ Verify DATABASE_URL is correct and database is running

### "Invalid Token"
→ Regenerate token in Discord Developer Portal

### Commands in Wrong Language
→ Check locale settings in command files (default is 'ar')

## 📖 Full Documentation

- [README.md](README.md) - Complete feature list
- [DEPLOYMENT.md](DEPLOYMENT.md) - Detailed deployment guide
- [Prisma Schema](prisma/schema.prisma) - Database structure

## 💬 Support

Need help? 
- Check documentation files
- Review error messages in console
- Verify all environment variables
- Test with `/help` command

---

<div dir="rtl">

## ✨ نصائح مهمة

### للحصول على أفضل تجربة:
1. استخدم قاعدة بيانات PostgreSQL موثوقة
2. راجع السجلات (logs) بانتظام
3. احفظ نسخة احتياطية من قاعدة البيانات
4. حدّث المكتبات بانتظام
5. اختبر التغييرات على سيرفر تجريبي أولاً

### الأمان:
- لا تشارك ملف `.env` أبداً
- فعّل المصادقة الثنائية على جميع الحسابات
- راجع صلاحيات البوت بانتظام
- احفظ مفاتيح API في مكان آمن

</div>

**Ready to stream! 🎮✨**
