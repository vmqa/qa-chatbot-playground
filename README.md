# AI QA Playground

Test Automation Sandbox with Chatbot

## About

- Serve as a Playwright automation testing target
- Serve as a Pytest AI automation testing target

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | Next.js 14, TypeScript, TailwindCSS |
| Backend  | FastAPI, Python 3.11+, OpenAI SDK   |
| AI Model | gpt-4o-mini                         |

## Local Development

### Prerequisites

Install these before starting:

- [Python 3.11+](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org/)
- [VS Code](https://code.visualstudio.com/) (recommended)
- [OpenAI API key](https://platform.openai.com/api-keys) - you'll add this to `.env` file during backend setup

**VS Code Extensions (Recommended):**

When you open this project in VS Code, you'll see a notification to install recommended extensions. Click **"Install All"** to get:

- Python, Black, isort, flake8 (Python formatting/linting)
- Prettier, ESLint (TypeScript/JavaScript formatting/linting)

### Backend

```bash
cd backend
python -m venv venv                    # Step 1: Create virtual environment
source venv/bin/activate               # Step 2: Activate it (Windows: venv\Scripts\activate)
pip install -r requirements.txt        # Step 3: Install dependencies
cp .env.example .env                   # Step 4: Copy .env.example to .env file
# Edit .env and add your OPENAI_API_KEY
uvicorn app.main:app --reload --port 8000       #Start the Backend Server
```

**VS Code Setup SetUp help (after Step 3):**

After running `pip install -r requirements.txt`, select the Python interpreter in VS Code:

1. Open any Python file in the `backend` folder
2. Click on the Python version in the **bottom-right corner** of VS Code (e.g., "3.14.0 64-bit")
3. From the menu, select the interpreter showing `backend/venv` in the path
4. If not listed, choose **"Enter interpreter path..."** and paste:
   ```
   /absolute/path/to/qa-chatbot-playground/backend/venv/bin/python
   ```
5. Reload VS Code: `Cmd/Ctrl + Shift + P` → `Developer: Reload Window`
6. Verify the correct interpreter is selected (bottom-right should show `venv`)

This ensures VS Code uses the correct environment for linting, testing, and auto-completion.

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local  # Optional: only needed if backend runs on different port
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Verify Setup

- Frontend: http://localhost:3000
- Backend health: http://localhost:8000/health
- API docs: http://localhost:8000/docs

## Project Structure

## Features

- Streaming chat responses
- Rate limiting (20 requests/hour per IP) - resets if backend restarted.
- Mobile-responsive design
- Example questions to get started
- Error handling with user-friendly messages

## Running Tests

This project serves as a test automation playground for both UI and API testing.

### Playwright Tests (Frontend UI)

See [frontend/tests/README.md](frontend/tests/README.md) for detailed documentation.

```bash
cd frontend
npm test              # Run tests in headless mode
npm run test:ui       # Run with Playwright UI
npm run test:headed   # Run in headed mode
```

### Pytest Tests (Backend API)

See [backend/tests/README.md](backend/tests/README.md) for detailed documentation.

```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
pytest tests/test_chat.py -v        # Run smoke tests
pytest tests/test_validation.py -v  # Run validation tests
```

## Future Enhancements

Potential features to expand test automation coverage:

- **Database Integration** - PostgreSQL/MongoDB with CRUD operations for API testing scenarios
- **User Authentication** - Sign up/login flows for E2E authentication testing (OAuth, JWT)
- **File Upload/Download** - Test file handling and multipart form data

Contributions welcome! Feel free to open an issue to discuss new features.

## Authors

**Idea by Vadym Marochok** - QA Engineer
Implemented with Claude Code

- LinkedIn: [linkedin.com/in/vadym-m](https://www.linkedin.com/in/vadym-m/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
