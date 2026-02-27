# GitHub Copilot Instructions

## Project

AI QA Playground — a FastAPI + Next.js chatbot app used as a Playwright and Pytest test automation target.

- Backend: FastAPI, Python 3.11+, runs on `http://localhost:8000`
- Frontend: Next.js 14+, TypeScript, TailwindCSS, runs on `http://localhost:3000`

See [CLAUDE.md](../CLAUDE.md) for full project setup, API spec, and environment variables.

## Playwright Testing

All Playwright tests live in `frontend/tests/`. Follow the coding standards and patterns defined in:

**[frontend/tests/CLAUDE.md](../frontend/tests/CLAUDE.md)**

When asked to create a test plan, follow the planning workflow in:

**[frontend/tests/TEST_PLANNING.md](../frontend/tests/TEST_PLANNING.md)**

## Python Testing

All Pytest tests live in `backend/tests/`. Use the backend virtualenv at `backend/venv/`.

## Browser Automation

`playwright-cli` is installed globally. Use it for exploring the app and generating test plans:

```bash
playwright-cli open http://localhost:3000
playwright-cli snapshot
playwright-cli goto http://localhost:3000/blog
```

Skills reference: [.claude/skills/playwright-cli/SKILL.md](../.claude/skills/playwright-cli/SKILL.md)
