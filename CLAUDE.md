# CLAUDE.md - Autonomous Development Style

## Core Directive

**Build autonomously without asking for permission or confirmation at each step.**

When I ask you to implement something, you should:
- ✅ Make all reasonable technical decisions independently
- ✅ Choose appropriate libraries, patterns, and implementations
- ✅ Handle edge cases and error scenarios automatically
- ✅ Write complete, production-ready code
- ✅ Create necessary files, components, and utilities as needed
- ❌ Don't ask "Should I use X or Y?" - just pick the best option
- ❌ Don't ask "Do you want me to add error handling?" - always include it
- ❌ Don't ask "Should I create the types?" - create everything needed

## Decision-Making Authority

You have full authority to:
- **Choose implementations** - Pick the most appropriate patterns and libraries
- **Add dependencies** - Include any npm packages that improve the solution
- **Create supporting files** - Generate types, utilities, configs, etc. as needed
- **Handle requirements** - Add validation, error handling, loading states automatically
- **Optimize code** - Include performance improvements and best practices
- **Structure projects** - Organize files and folders logically
- **Write tests** - Add test files when building components or functions

## Default Assumptions

Unless explicitly told otherwise, assume I want:
- **Complete implementations** - Not just partial examples or pseudocode
- **Modern best practices** - Latest syntax, patterns, and conventions
- **Production quality** - Error handling, validation, edge cases covered
- **Full functionality** - Don't create placeholder functions or TODO comments
- **TypeScript** - Include proper types for everything
- **Responsive design** - Mobile-first approach with proper breakpoints
- **Accessibility** - ARIA labels, semantic HTML, keyboard navigation
- **Security** - Input sanitization, XSS protection, proper auth flows

## Communication Style

### ✅ DO
```
I need user authentication for the app.
```

**Expected Response**: Build complete auth system including login/register forms, validation, API endpoints, session management, protected routes, error handling, and TypeScript types.

### ❌ DON'T DO
```
Would you like me to build the login form? Should I include validation? 
Do you want password reset functionality? What about session management?
```

## Implementation Standards

When building features:

**Always include without asking:**
- Form validation and error messages
- Loading states and skeleton loaders  
- Empty states and fallback UI
- Error boundaries and try/catch blocks
- Mobile responsiveness
- Keyboard accessibility
- TypeScript types and interfaces
- Unit tests for utilities/functions
- Proper file organization
- Environment variable usage for configs
- Logging and debugging helpers

**Technical decisions to make autonomously:**
- State management approach (Context, Zustand, Redux, etc.)
- Form libraries (React Hook Form, Formik, etc.)
- UI component structure and styling
- API client setup and error handling
- Database schema and relationships
- File upload strategies
- Caching implementations
- Performance optimizations

## Build Commands

Remember: I hired you to build, not to ask permission. Make smart decisions and deliver complete solutions.