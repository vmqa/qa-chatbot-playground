# AI QA Playground - Test Automation Sandbox with Chatbot

## Project Overview

Interactive web application with chatbot functionality.

**Primary Goals:**
- Serve as a Playwright automation testing target
- Serve as a Pytest AI automation testing target

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | FastAPI, Python 3.11+, OpenAI SDK, Pydantic, slowapi |
| Frontend | Next.js 14+, TypeScript, Vercel AI SDK, TailwindCSS |
| AI Model | gpt-4o-mini |

## Repository Structure

## Development Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- OpenAI API key

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your OPENAI_API_KEY
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

### Verify Setup
- Backend health: http://localhost:8000/health
- Backend docs: http://localhost:8000/docs
- Frontend: http://localhost:3000

## Environment Variables

### Backend (.env)
```
OPENAI_API_KEY=sk-...
ALLOWED_ORIGINS=http://localhost:3000
RATE_LIMIT_REQUESTS=20
RATE_LIMIT_WINDOW=3600
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Coding Standards

### Python (Backend)
- Follow PEP 8
- Type hints on all functions
- Docstrings with purpose, args, returns
- No bare `except` clauses
- Use Pydantic for validation

### TypeScript (Frontend)
- Strict mode enabled (`"strict": true`)
- No `any` types
- Interface over type where possible
- ESLint + Prettier configured

### Git Conventions
- Conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`
- Feature branches: `feature/chat-interface`
- Atomic commits (one logical change per commit)

## Security Requirements

| Requirement | Implementation |
|-------------|----------------|
| API Keys | Server-side only, never in frontend |
| CORS | Specific origins, no wildcards |
| Rate Limiting | 20 requests/hour per IP using slowapi |
| Input Validation | Max 1000 chars, Pydantic models |
| Error Messages | Generic messages, no internal details |
| HTTPS | Enforced in production |

## API Specification

### POST /api/chat
Request:
```json
{
  "message": "string (max 1000 chars)"
}
```

Response: Server-Sent Events (streaming)
```
data: {"content": "Hello"}
data: {"content": "!"}
data: [DONE]
```

Errors:
- 400: Invalid message format
- 429: Rate limit exceeded (include Retry-After header)
- 500: Internal server error

### GET /health
Response:
```json
{
  "status": "healthy"
}
```

## System Prompt

tbd

## UI Components

### Color Palette (Blue Tones)
```css
--primary: #2563eb;       /* Blue 600 */
--primary-hover: #1d4ed8; /* Blue 700 */
--secondary: #64748b;     /* Slate 500 */
--background: #f8fafc;    /* Slate 50 */
--surface: #ffffff;
--text-primary: #0f172a;  /* Slate 900 */
--text-secondary: #64748b; /* Slate 500 */
```

### Component Requirements

**Header**: Sticky, professional nav with name/logo, future page links

## Testing Guidelines (Playwright-Ready)

### Required data-testid Attributes
```
data-testid="chat-input"
data-testid="chat-submit"
data-testid="chat-messages"
data-testid="message-user"
data-testid="message-assistant"
data-testid="example-question"
data-testid="start-chat-button"
data-testid="loading-indicator"
data-testid="error-message"
```

### Test Scenarios
1. Send message, verify streaming response
2. Click example question, verify input populated
3. Trigger rate limit (21 rapid requests), verify 429 response
4. Disconnect backend, verify error handling
5. Mobile viewport responsiveness (320px-1920px)
6. Keyboard navigation (tab through elements)

## Common Commands

```bash
# Backend
cd backend && uvicorn app.main:app --reload --port 8000
cd backend && pip install -r requirements.txt
cd backend && python -m pytest tests/

# Frontend
cd frontend && npm run dev
cd frontend && npm run build
cd frontend && npm run lint

# Git
git add -p                    # Stage interactively
git commit -m "feat: message" # Conventional commit
```
