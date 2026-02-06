# Ask Marco - Frontend

Next.js frontend for the portfolio chatbot.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.local.example .env.local
# Edit .env.local with your backend URL
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |

## Components

- `Header` - Sticky navigation bar
- `Hero` - Landing section with introduction
- `ChatInterface` - Main chat component with streaming
- `ExampleQuestions` - Suggested question chips

## Testing Selectors

All interactive elements have `data-testid` attributes for Playwright:
- `start-chat-button` - Hero CTA button
- `chat-input` - Message input field
- `chat-submit` - Send button
- `chat-messages` - Messages container
- `message-user` - User message bubbles
- `message-assistant` - Assistant message bubbles
- `example-question` - Example question chips
- `loading-indicator` - Loading animation
- `error-message` - Error display
