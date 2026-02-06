# Backend

FastAPI backend for the portfolio chatbot.

## Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your OPENAI_API_KEY
```

4. Run the server:
```bash
uvicorn app.main:app --reload --port 8000
```

5. **IDE Setup**: Configure your IDE to use the virtual environment's Python interpreter (`backend/venv/bin/python`) to avoid import errors.

## Endpoints

- `GET /health` - Health check
- `POST /api/chat` - Chat with the portfolio bot (streaming response)
- `GET /docs` - OpenAPI documentation

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key (required) | - |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | `http://localhost:3000` |
| `RATE_LIMIT_REQUESTS` | Requests per window | `20` |
| `RATE_LIMIT_WINDOW` | Window in seconds | `3600` |
