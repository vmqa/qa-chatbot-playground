.PHONY: start stop restart start-backend start-frontend test test-backend test-frontend

start: ## Start both backend and frontend
	@make start-backend
	@make start-frontend

start-backend: ## Start backend server
	@echo "Starting backend..."
	@cd backend && source venv/bin/activate && uvicorn app.main:app --reload --port 8000 &

start-frontend: ## Start frontend dev server
	@echo "Starting frontend..."
	@cd frontend && npm run dev &

stop: ## Stop both backend and frontend
	@echo "Stopping backend..."
	@lsof -ti:8000 | xargs kill -9 2>/dev/null || true
	@echo "Stopping frontend..."
	@lsof -ti:3000 | xargs kill -9 2>/dev/null || true
	@echo "Done."

restart: ## Restart both backend and frontend
	@make stop
	@sleep 1
	@make start

test: ## Run all tests (backend + frontend)
	@make test-backend
	@make test-frontend

test-backend: ## Run backend Pytest tests
	@echo "Running backend tests..."
	@cd backend && source venv/bin/activate && pytest tests/ -v

test-frontend: ## Run frontend Playwright tests
	@echo "Running frontend tests..."
	@cd frontend && npm test
