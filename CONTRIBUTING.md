# Contributing Guide

Thank you for considering contributing to the Full Streamer Discord Bot System! This guide will help you get started.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Report issues responsibly

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported
2. Create a new issue with:
   - Clear title
   - Detailed description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node version, etc.)
   - Screenshots if applicable

### Suggesting Features

1. Check existing feature requests
2. Create a new issue with:
   - Clear title
   - Detailed description of feature
   - Use cases
   - Potential implementation ideas
   - Benefits to users

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test your changes thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Development Setup

### Prerequisites
- Node.js 18+
- MongoDB
- Git

### Setup Steps
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/bot-secret-full-focus-.git
cd bot-secret-full-focus-

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure .env with your credentials

# Build project
npm run build

# Start development
npm run dev
```

### Dashboard Development
```bash
cd dashboard
npm install
npm run dev
```

## Coding Standards

### TypeScript
- Use TypeScript for all new code
- Enable strict mode
- Avoid `any` type when possible
- Document complex functions

### Code Style
- Use ESLint and Prettier
- 2 spaces for indentation
- Single quotes for strings
- Semicolons required
- Max line length: 100 characters

### Naming Conventions
- `camelCase` for variables and functions
- `PascalCase` for classes and types
- `UPPER_SNAKE_CASE` for constants
- Descriptive names over short names

### File Structure
```
src/
├── commands/      # Slash commands
├── events/        # Event handlers
├── models/        # Database models
├── services/      # Business logic
├── utils/         # Utility functions
├── types/         # TypeScript types
├── locales/       # Translations
└── config/        # Configuration
```

## Testing

### Writing Tests
```typescript
import { describe, test, expect } from 'jest';

describe('CreditService', () => {
  test('should add credits correctly', async () => {
    const result = await CreditService.addCredits('user123', 100, 'Test');
    expect(result).toBeGreaterThan(0);
  });
});
```

### Running Tests
```bash
npm test
```

## Commit Messages

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build/tooling changes

Examples:
```
feat: add reward redemption command
fix: resolve credit transfer bug
docs: update API documentation
```

## Adding New Features

### New Command
1. Create file in `src/commands/[category]/command-name.ts`
2. Follow existing command structure
3. Add translations to `src/locales/en.json` and `ar.json`
4. Test command thoroughly
5. Update documentation

### New Service
1. Create file in `src/services/ServiceName.ts`
2. Use proper TypeScript types
3. Add error handling
4. Include logging
5. Write tests
6. Document public methods

### New Model
1. Create file in `src/models/ModelName.ts`
2. Define Mongoose schema
3. Add TypeScript interface
4. Export model
5. Update types in `src/types/index.ts`

## Localization

### Adding Translations
1. Edit `src/locales/en.json`
2. Edit `src/locales/ar.json`
3. Use descriptive keys
4. Test both languages
5. Ensure RTL works for Arabic

Example:
```json
{
  "commands": {
    "newCommand": {
      "name": "New Command",
      "description": "Command description",
      "success": "Success message"
    }
  }
}
```

## Documentation

### Update Documentation
When adding features:
- Update README.md
- Update FEATURES.md
- Update API.md if adding endpoints
- Add JSDoc comments to code
- Include usage examples

### Documentation Style
- Clear and concise
- Include code examples
- Use proper markdown formatting
- Add screenshots when helpful

## Pull Request Checklist

Before submitting:
- [ ] Code builds without errors
- [ ] All tests pass
- [ ] ESLint passes
- [ ] Code is formatted with Prettier
- [ ] Translations added (EN & AR)
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] Environment variables documented
- [ ] Commit messages follow convention
- [ ] PR description is clear

## Review Process

1. Automated checks run (CI/CD)
2. Code review by maintainers
3. Request changes if needed
4. Approval and merge

## Getting Help

- 💬 Discord Server: [Join Here]
- 📧 Email: support@example.com
- 📖 Documentation: See README.md
- ❓ GitHub Issues: For questions

## Recognition

Contributors will be:
- Added to CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Thank You! 🎉

Your contributions help make this project better for everyone!
