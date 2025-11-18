# Contributing to Full Streamer System

## 🤝 Welcome Contributors!

Thank you for your interest in contributing to the Full Streamer System! This document provides guidelines for contributing to the project.

## 📋 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## 📜 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn and grow

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Git
- Discord Developer Account

### Setup Development Environment
```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/bot-secret-full-focus-.git
cd bot-secret-full-focus-

# Install dependencies
npm install
cd dashboard && npm install && cd ..

# Set up environment variables
cp .env.example .env
# Edit .env with your test credentials

# Initialize database
npm run db:push
npm run db:seed

# Start development bot
npm run dev
```

## 🔄 Development Workflow

### 1. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 2. Make Changes
- Write clean, documented code
- Follow existing code style
- Add tests if applicable
- Update documentation

### 3. Test Your Changes
```bash
# Test bot commands
npm run dev

# Test dashboard
cd dashboard && npm run dev

# Run linter (if configured)
npm run lint
```

### 4. Commit Changes
```bash
git add .
git commit -m "feat: add new feature description"
```

## 💻 Coding Standards

### JavaScript/Node.js
- Use ES6+ features
- Use `const` and `let`, avoid `var`
- Use async/await instead of callbacks
- Add JSDoc comments for functions
- Handle errors properly

### Example
```javascript
/**
 * Get streamer by Discord ID
 * @param {string} discordId - Discord user ID
 * @returns {Promise<Object>} Streamer object
 */
async function getStreamer(discordId) {
  try {
    const streamer = await prisma.streamer.findUnique({
      where: { discordId },
    });
    return streamer;
  } catch (error) {
    console.error('Error fetching streamer:', error);
    throw error;
  }
}
```

### Discord.js Commands
- Use SlashCommandBuilder
- Add name localizations for Arabic
- Include both English and Arabic descriptions
- Handle errors gracefully
- Use ephemeral messages for private responses

### React/Next.js
- Use functional components
- Use hooks appropriately
- Keep components small and focused
- Add PropTypes or TypeScript types
- Follow Tailwind CSS conventions

## 📝 Commit Guidelines

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples
```bash
feat(credits): add credit transfer cooldown

Add a 24-hour cooldown between credit transfers to prevent abuse.

Closes #123

fix(tickets): resolve ticket channel creation error

Fixed an issue where ticket channels were not being created
for certain ticket types.

docs(readme): update installation instructions

Added clarification about PostgreSQL setup requirements.
```

## 🔍 Pull Request Process

### Before Submitting
1. ✅ Update documentation if needed
2. ✅ Test all changes thoroughly
3. ✅ Ensure code follows style guidelines
4. ✅ Update CHANGELOG if applicable
5. ✅ Rebase on latest main branch

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring

## Testing
How were these changes tested?

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests pass
```

### Review Process
1. Maintainers will review your PR
2. Address any feedback
3. Once approved, PR will be merged
4. Thank you for contributing! 🎉

## 🐛 Reporting Bugs

### Bug Report Template
```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Run command '...'
2. Click on '....'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment**
- OS: [e.g., Ubuntu 22.04]
- Node.js version: [e.g., 18.17.0]
- Bot version: [e.g., 1.0.0]

**Additional context**
Any other information
```

## 💡 Feature Requests

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
Description of the problem

**Describe the solution you'd like**
Clear description of desired feature

**Describe alternatives you've considered**
Alternative solutions

**Additional context**
Mockups, examples, etc.
```

## 📂 Project Structure

```
bot-secret-full-focus-/
├── src/bot/
│   ├── commands/       # Add new commands here
│   ├── events/         # Discord event handlers
│   ├── services/       # External service integrations
│   └── utils/          # Utility functions
├── dashboard/
│   ├── pages/          # Next.js pages
│   ├── components/     # React components
│   └── styles/         # CSS/Tailwind styles
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── seed.js         # Seed data
└── docs/               # Documentation
```

## 🎨 Adding New Features

### Adding a New Command
1. Create file in `src/bot/commands/[category]/commandname.js`
2. Use existing commands as template
3. Add Arabic localization
4. Update help command if needed
5. Document in FEATURES.md

### Adding Dashboard Page
1. Create file in `dashboard/pages/dashboard/pagename.js`
2. Add bilingual support
3. Use existing components
4. Update navigation if needed

### Adding Database Model
1. Update `prisma/schema.prisma`
2. Run `npm run db:push`
3. Update seed.js if needed
4. Document the model

## 🌍 Internationalization

### Adding Translations
Edit `src/bot/utils/language.js`:
```javascript
export const translations = {
  en: {
    your_key: 'English text',
  },
  ar: {
    your_key: 'النص العربي',
  },
};
```

### Using Translations
```javascript
import { t } from '../utils/language.js';

const text = t(lang, 'your_key');
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Bot starts without errors
- [ ] Commands execute correctly
- [ ] Database operations work
- [ ] Dashboard loads properly
- [ ] Error handling works
- [ ] Both languages work

### Test Commands
```bash
# In Discord
/help
/apply
/ticket create
/credits balance
/analytics view
```

## 📚 Resources

- [Discord.js Guide](https://discordjs.guide/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🆘 Getting Help

- 📖 Check documentation first
- 💬 Ask in GitHub Discussions
- 🐛 Create an issue for bugs
- 📧 Contact maintainers

## 🙏 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Appreciated in community

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Full Streamer System! 🎉**

<div dir="rtl">

## شكراً لمساهمتك!

نقدر وقتك وجهدك في تحسين نظام الستريمر الشامل.

</div>
