# Streamer Dashboard

A modern Next.js dashboard for the Full Streamer Management System.

## 🌟 Features

- 📊 **Real-time Statistics** - View streaming analytics and performance metrics
- 💰 **Credit Wallet** - Manage credits and view transaction history
- 🏆 **Leaderboard** - See top performers and rankings
- 🌐 **Bilingual Support** - Full English and Arabic support with RTL
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Built with Tailwind CSS and optimized for dark mode

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- Access to the bot's API endpoint

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Create environment file:**
```bash
cp .env.local.example .env.local
```

Or create `.env.local` manually:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

3. **Run development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

4. **Build for production:**
```bash
npm run build
npm start
```

## 📦 Deployment

### Deploy to Vercel (Recommended)

#### Option 1: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy
```

#### Option 2: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set the **Root Directory** to `dashboard`
4. Add environment variables:
   - `NEXT_PUBLIC_API_URL` - Your bot API endpoint
5. Deploy!

### Deploy to Other Platforms

The dashboard is a standard Next.js app and can be deployed to:
- **Netlify** - Set build directory to `dashboard`
- **AWS Amplify** - Configure with Next.js preset
- **Railway** - Deploy with Node.js environment
- **Self-hosted** - Use `npm run build && npm start`

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Optional: Enable analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

### API Integration

The dashboard communicates with the bot's Express API. Ensure:
1. Bot API server is running
2. CORS is configured to allow dashboard origin
3. API URL is correctly set in environment variables

## 📁 Project Structure

```
dashboard/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Home page with stats
├── components/            # React components
│   ├── StatsCard.tsx      # Statistics display
│   ├── CreditWallet.tsx   # Credit management
│   ├── Leaderboard.tsx    # Rankings display
│   └── LanguageSwitcher.tsx  # EN/AR toggle
├── styles/
│   └── globals.css        # Global styles + Tailwind
├── public/
│   └── locales/           # Translation files
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS config
└── package.json           # Dependencies
```

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.js`:
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
        secondary: '#your-color',
      }
    }
  }
}
```

### Adding New Components

Create components in `components/`:
```tsx
// components/MyComponent.tsx
export default function MyComponent() {
  return <div>My Custom Component</div>
}
```

Import in pages:
```tsx
import MyComponent from '../components/MyComponent'
```

## 🌐 Multi-Language Support

The dashboard supports English and Arabic with RTL layout.

### Adding Translations

Edit translation files:
- `public/locales/en/common.json` - English
- `public/locales/ar/common.json` - Arabic (if needed)

Use in components:
```tsx
import { useTranslation } from 'next-i18next'

export default function Component() {
  const { t } = useTranslation('common')
  return <h1>{t('welcome')}</h1>
}
```

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Hot Reload

The development server supports hot reload. Changes to files will automatically update the browser.

## 📊 Analytics Integration

To add analytics (e.g., Google Analytics):

1. Add environment variable:
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

2. Add analytics script in `app/layout.tsx`

## 🔐 Security

- API calls use environment variables
- No sensitive data stored in client
- CORS configured on bot API
- Secure headers configured in `next.config.js`

## 🐛 Troubleshooting

### Dashboard shows "Cannot connect to API"
- Verify API URL in `.env.local`
- Check bot API server is running
- Verify CORS settings on bot

### Styles not loading
- Run `npm install` to ensure Tailwind is installed
- Check `tailwind.config.js` configuration
- Verify `globals.css` imports Tailwind directives

### Build errors
- Clear Next.js cache: `rm -rf .next`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues or questions:
- Open a GitHub issue
- Check the main README.md
- Review the documentation

---

**Built with Next.js 14, React 18, and Tailwind CSS** 🚀
