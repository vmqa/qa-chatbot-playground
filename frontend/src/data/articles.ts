export interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: ArticleContent[];
  author: string;
  createdAt: string;
  tags: string[];
  thumbnail: string;
  readTime: number;
}

export interface ArticleContent {
  type: "paragraph" | "heading" | "code" | "image" | "collapsible";
  content?: string;
  language?: string;
  title?: string;
  items?: string[];
}

export const articles: Article[] = [
  {
    id: "1",
    title: "Getting Started with Playwright: A Complete Guide",
    slug: "getting-started-with-playwright",
    description: "Learn the fundamentals of Playwright test automation framework and write your first end-to-end test.",
    author: "Marco",
    createdAt: "2024-01-15",
    tags: ["Playwright", "Automation", "Tutorial"],
    thumbnail: "/blog/playwright-intro.svg",
    readTime: 8,
    content: [
      {
        type: "paragraph",
        content: "Playwright is a powerful end-to-end testing framework developed by Microsoft. It allows you to write reliable tests for modern web applications across all browsers."
      },
      {
        type: "heading",
        content: "Why Choose Playwright?"
      },
      {
        type: "paragraph",
        content: "Playwright offers several advantages over traditional testing frameworks: cross-browser support, auto-waiting mechanisms, and powerful debugging tools."
      },
      {
        type: "collapsible",
        title: "Key Features",
        items: [
          "Cross-browser testing (Chrome, Firefox, Safari)",
          "Auto-wait for elements to be ready",
          "Network interception and mocking",
          "Screenshots and video recording",
          "Parallel test execution"
        ]
      },
      {
        type: "heading",
        content: "Installation"
      },
      {
        type: "code",
        language: "bash",
        content: "npm init playwright@latest\n# Follow the prompts to set up your project"
      },
      {
        type: "heading",
        content: "Your First Test"
      },
      {
        type: "code",
        language: "typescript",
        content: `import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});`
      },
      {
        type: "paragraph",
        content: "This simple test navigates to the Playwright homepage and verifies the page title. Run it with 'npx playwright test' to see it in action."
      }
    ]
  },
  {
    id: "2",
    title: "API Testing Best Practices with Pytest",
    slug: "api-testing-best-practices-pytest",
    description: "Master API testing with Pytest framework including fixtures, parametrization, and assertion strategies.",
    author: "Marco",
    createdAt: "2024-01-20",
    tags: ["API Testing", "Pytest", "Python"],
    thumbnail: "/blog/api-testing.svg",
    readTime: 10,
    content: [
      {
        type: "paragraph",
        content: "API testing is crucial for ensuring your backend services work correctly. Pytest provides an excellent framework for writing maintainable API tests."
      },
      {
        type: "heading",
        content: "Setting Up Pytest for API Testing"
      },
      {
        type: "code",
        language: "bash",
        content: "pip install pytest requests\npip install pytest-html  # For HTML reports"
      },
      {
        type: "collapsible",
        title: "Best Practices",
        items: [
          "Use fixtures for reusable test data and setup",
          "Implement proper error handling and assertions",
          "Separate test data from test logic",
          "Use parametrize for data-driven tests",
          "Mock external dependencies when appropriate"
        ]
      },
      {
        type: "heading",
        content: "Example API Test"
      },
      {
        type: "code",
        language: "python",
        content: `import pytest
import requests

@pytest.fixture
def base_url():
    return "https://api.example.com"

def test_get_user(base_url):
    response = requests.get(f"{base_url}/users/1")
    assert response.status_code == 200
    assert "name" in response.json()`
      }
    ]
  },
  {
    id: "3",
    title: "Page Object Model Pattern in Playwright",
    slug: "page-object-model-playwright",
    description: "Learn how to implement the Page Object Model pattern to create maintainable and scalable test suites.",
    author: "Marco",
    createdAt: "2024-01-25",
    tags: ["Playwright", "Design Patterns", "Best Practices"],
    thumbnail: "/blog/pom-pattern.svg",
    readTime: 12,
    content: [
      {
        type: "paragraph",
        content: "The Page Object Model (POM) is a design pattern that creates an object repository for web elements, making tests more maintainable and reducing code duplication."
      },
      {
        type: "heading",
        content: "Benefits of POM"
      },
      {
        type: "collapsible",
        title: "Why Use Page Objects?",
        items: [
          "Reduces code duplication across tests",
          "Easier maintenance when UI changes",
          "Improves test readability",
          "Enables reusable components",
          "Better separation of concerns"
        ]
      },
      {
        type: "heading",
        content: "Implementation Example"
      },
      {
        type: "code",
        language: "typescript",
        content: `export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.fill('[data-testid="email"]', email);
    await this.page.fill('[data-testid="password"]', password);
    await this.page.click('[data-testid="submit"]');
  }

  async getErrorMessage() {
    return await this.page.textContent('[data-testid="error"]');
  }
}`
      }
    ]
  },
  {
    id: "4",
    title: "AI-Powered Test Generation: The Future of QA",
    slug: "ai-powered-test-generation",
    description: "Explore how artificial intelligence is revolutionizing test automation and improving test coverage.",
    author: "Marco",
    createdAt: "2024-02-01",
    tags: ["AI", "Automation", "Innovation"],
    thumbnail: "/blog/ai-testing.svg",
    readTime: 15,
    content: [
      {
        type: "paragraph",
        content: "Artificial Intelligence is transforming the QA landscape by automating test creation, improving test coverage, and identifying edge cases that humans might miss."
      },
      {
        type: "heading",
        content: "AI Applications in Testing"
      },
      {
        type: "collapsible",
        title: "Current Use Cases",
        items: [
          "Automatic test case generation from requirements",
          "Visual regression testing with ML",
          "Intelligent test data generation",
          "Self-healing tests that adapt to UI changes",
          "Predictive analytics for test prioritization"
        ]
      },
      {
        type: "paragraph",
        content: "Tools like Testim, Applitools, and Mabl are leading the charge in AI-powered testing, offering features that significantly reduce manual effort."
      }
    ]
  },
  {
    id: "5",
    title: "Mastering Playwright Selectors",
    slug: "mastering-playwright-selectors",
    description: "Deep dive into Playwright's selector strategies and learn how to write robust, maintainable locators.",
    author: "Marco",
    createdAt: "2024-02-05",
    tags: ["Playwright", "Selectors", "Tutorial"],
    thumbnail: "/blog/selectors.svg",
    readTime: 9,
    content: [
      {
        type: "paragraph",
        content: "Choosing the right selectors is crucial for creating reliable tests. Playwright offers multiple selector strategies to handle different scenarios."
      },
      {
        type: "heading",
        content: "Selector Priority"
      },
      {
        type: "collapsible",
        title: "Recommended Order",
        items: [
          "1. data-testid attributes (most reliable)",
          "2. Role-based selectors (accessibility-friendly)",
          "3. Text content (for unique text)",
          "4. CSS selectors (when necessary)",
          "5. XPath (last resort)"
        ]
      },
      {
        type: "code",
        language: "typescript",
        content: `// Good - Using data-testid
await page.click('[data-testid="submit-button"]');

// Better - Using role
await page.getByRole('button', { name: 'Submit' }).click();

// Also good - Using text
await page.getByText('Submit').click();`
      }
    ]
  },
  {
    id: "6",
    title: "Continuous Testing in CI/CD Pipelines",
    slug: "continuous-testing-cicd",
    description: "Implement effective continuous testing strategies in your CI/CD pipeline with GitHub Actions and Jenkins.",
    author: "Marco",
    createdAt: "2024-02-10",
    tags: ["CI/CD", "DevOps", "Automation"],
    thumbnail: "/blog/cicd.svg",
    readTime: 11,
    content: [
      {
        type: "paragraph",
        content: "Integrating automated tests into CI/CD pipelines ensures that every code change is validated before deployment, reducing bugs in production."
      },
      {
        type: "heading",
        content: "GitHub Actions Example"
      },
      {
        type: "code",
        language: "yaml",
        content: `name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install
      - run: npx playwright test`
      },
      {
        type: "collapsible",
        title: "CI/CD Best Practices",
        items: [
          "Run tests in parallel to save time",
          "Use test result caching",
          "Implement flaky test detection",
          "Generate and store test reports",
          "Set up notifications for failures"
        ]
      }
    ]
  },
  {
    id: "7",
    title: "Visual Regression Testing with Playwright",
    slug: "visual-regression-testing-playwright",
    description: "Catch visual bugs before they reach production using Playwright's screenshot comparison features.",
    author: "Marco",
    createdAt: "2024-02-15",
    tags: ["Playwright", "Visual Testing", "Regression"],
    thumbnail: "/blog/visual-testing.svg",
    readTime: 8,
    content: [
      {
        type: "paragraph",
        content: "Visual regression testing helps catch unintended UI changes by comparing screenshots of your application across different versions."
      },
      {
        type: "code",
        language: "typescript",
        content: `test('visual regression test', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveScreenshot('dashboard.png');
});`
      },
      {
        type: "collapsible",
        title: "Configuration Tips",
        items: [
          "Use consistent viewport sizes",
          "Disable animations for stable screenshots",
          "Mask dynamic content (dates, random IDs)",
          "Set appropriate threshold for differences",
          "Organize screenshots by feature"
        ]
      }
    ]
  },
  {
    id: "8",
    title: "Performance Testing Fundamentals",
    slug: "performance-testing-fundamentals",
    description: "Learn the basics of performance testing including load testing, stress testing, and monitoring strategies.",
    author: "Marco",
    createdAt: "2024-02-20",
    tags: ["Performance", "Load Testing", "Monitoring"],
    thumbnail: "/blog/performance.svg",
    readTime: 13,
    content: [
      {
        type: "paragraph",
        content: "Performance testing ensures your application can handle expected user loads and identifies bottlenecks before they impact users."
      },
      {
        type: "heading",
        content: "Types of Performance Testing"
      },
      {
        type: "collapsible",
        title: "Testing Categories",
        items: [
          "Load Testing - Normal expected usage",
          "Stress Testing - Beyond normal capacity",
          "Spike Testing - Sudden traffic increases",
          "Endurance Testing - Sustained load over time",
          "Scalability Testing - System growth capacity"
        ]
      },
      {
        type: "paragraph",
        content: "Tools like K6, JMeter, and Gatling provide powerful frameworks for implementing performance tests."
      }
    ]
  },
  {
    id: "9",
    title: "Mobile Testing with Playwright",
    slug: "mobile-testing-playwright",
    description: "Test mobile web applications and responsive designs using Playwright's device emulation capabilities.",
    author: "Marco",
    createdAt: "2024-02-25",
    tags: ["Playwright", "Mobile", "Responsive"],
    thumbnail: "/blog/mobile-testing.svg",
    readTime: 10,
    content: [
      {
        type: "paragraph",
        content: "Playwright's device emulation allows you to test mobile viewports without needing physical devices or emulators."
      },
      {
        type: "code",
        language: "typescript",
        content: `import { devices } from '@playwright/test';

test.use({
  ...devices['iPhone 13']
});

test('mobile responsive test', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.mobile-menu')).toBeVisible();
});`
      },
      {
        type: "collapsible",
        title: "Mobile Testing Checklist",
        items: [
          "Test multiple device sizes",
          "Verify touch interactions",
          "Check mobile-specific features",
          "Test landscape and portrait modes",
          "Validate responsive breakpoints"
        ]
      }
    ]
  },
  {
    id: "10",
    title: "Test Data Management Strategies",
    slug: "test-data-management-strategies",
    description: "Effective approaches for managing test data in automated testing environments.",
    author: "Marco",
    createdAt: "2024-03-01",
    tags: ["Test Data", "Best Practices", "Strategy"],
    thumbnail: "/blog/test-data.svg",
    readTime: 9,
    content: [
      {
        type: "paragraph",
        content: "Proper test data management is essential for creating reliable, maintainable automated tests. Poor data management leads to flaky tests and maintenance nightmares."
      },
      {
        type: "collapsible",
        title: "Data Management Approaches",
        items: [
          "Static test data files (JSON, CSV)",
          "Database seeding scripts",
          "API-based data creation",
          "Faker libraries for random data",
          "Test data factories and builders"
        ]
      },
      {
        type: "code",
        language: "typescript",
        content: `// Test data factory example
export const createUser = (overrides = {}) => ({
  email: faker.internet.email(),
  name: faker.person.fullName(),
  role: 'user',
  ...overrides
});`
      }
    ]
  },
  {
    id: "11",
    title: "Debugging Playwright Tests Like a Pro",
    slug: "debugging-playwright-tests",
    description: "Master debugging techniques including trace viewer, inspector, and common troubleshooting strategies.",
    author: "Marco",
    createdAt: "2024-03-05",
    tags: ["Playwright", "Debugging", "Troubleshooting"],
    thumbnail: "/blog/debugging.svg",
    readTime: 11,
    content: [
      {
        type: "paragraph",
        content: "Effective debugging is a critical skill for test automation engineers. Playwright provides excellent debugging tools to quickly identify and fix test failures."
      },
      {
        type: "heading",
        content: "Debug Mode"
      },
      {
        type: "code",
        language: "bash",
        content: "# Run tests in debug mode\nnpx playwright test --debug\n\n# Debug specific test\nnpx playwright test example.spec.ts:10 --debug"
      },
      {
        type: "collapsible",
        title: "Debugging Tools",
        items: [
          "Playwright Inspector - Step through tests",
          "Trace Viewer - Analyze test recordings",
          "Screenshots on failure",
          "Video recordings",
          "Console logs and network activity"
        ]
      }
    ]
  },
  {
    id: "12",
    title: "API Authentication Testing Patterns",
    slug: "api-authentication-testing",
    description: "Test various authentication mechanisms including JWT, OAuth, and API keys effectively.",
    author: "Marco",
    createdAt: "2024-03-10",
    tags: ["API Testing", "Security", "Authentication"],
    thumbnail: "/blog/auth-testing.svg",
    readTime: 12,
    content: [
      {
        type: "paragraph",
        content: "Authentication is a critical aspect of API testing. Understanding different auth mechanisms helps you write comprehensive security tests."
      },
      {
        type: "code",
        language: "python",
        content: `def test_jwt_authentication(base_url, auth_token):
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = requests.get(f"{base_url}/protected", headers=headers)
    assert response.status_code == 200`
      },
      {
        type: "collapsible",
        title: "Authentication Types to Test",
        items: [
          "Basic Authentication",
          "Bearer Token (JWT)",
          "OAuth 2.0 flows",
          "API Key authentication",
          "Session-based auth"
        ]
      }
    ]
  },
  {
    id: "13",
    title: "Accessibility Testing in Automated Tests",
    slug: "accessibility-testing-automated",
    description: "Integrate accessibility testing into your automation suite using axe-core and Playwright.",
    author: "Marco",
    createdAt: "2024-03-15",
    tags: ["Accessibility", "A11y", "Playwright"],
    thumbnail: "/blog/accessibility.svg",
    readTime: 10,
    content: [
      {
        type: "paragraph",
        content: "Accessibility testing ensures your application is usable by everyone. Automated tools can catch many common accessibility issues."
      },
      {
        type: "code",
        language: "typescript",
        content: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('should not have accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});`
      },
      {
        type: "collapsible",
        title: "Key Areas to Test",
        items: [
          "Keyboard navigation",
          "Screen reader compatibility",
          "Color contrast ratios",
          "ARIA labels and roles",
          "Form accessibility"
        ]
      }
    ]
  },
  {
    id: "14",
    title: "Parallel Test Execution Strategies",
    slug: "parallel-test-execution",
    description: "Speed up your test suite by running tests in parallel effectively and safely.",
    author: "Marco",
    createdAt: "2024-03-20",
    tags: ["Performance", "Optimization", "Playwright"],
    thumbnail: "/blog/parallel-testing.svg",
    readTime: 8,
    content: [
      {
        type: "paragraph",
        content: "Running tests in parallel can dramatically reduce execution time, but requires careful planning to avoid conflicts and flaky tests."
      },
      {
        type: "code",
        language: "typescript",
        content: `// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 4 : 2,
  fullyParallel: true,
});`
      },
      {
        type: "collapsible",
        title: "Parallelization Tips",
        items: [
          "Ensure tests are independent",
          "Use isolated test data",
          "Avoid shared state",
          "Set appropriate worker count",
          "Handle test conflicts properly"
        ]
      }
    ]
  },
  {
    id: "15",
    title: "Contract Testing for Microservices",
    slug: "contract-testing-microservices",
    description: "Implement consumer-driven contract testing to ensure microservices work together seamlessly.",
    author: "Marco",
    createdAt: "2024-03-25",
    tags: ["API Testing", "Microservices", "Contract Testing"],
    thumbnail: "/blog/contract-testing.svg",
    readTime: 14,
    content: [
      {
        type: "paragraph",
        content: "Contract testing ensures that services can communicate correctly by verifying the contracts between consumers and providers."
      },
      {
        type: "heading",
        content: "Why Contract Testing?"
      },
      {
        type: "collapsible",
        title: "Benefits",
        items: [
          "Catch integration issues early",
          "Enable independent service deployment",
          "Faster than end-to-end tests",
          "Clear documentation of service contracts",
          "Reduce need for integration environments"
        ]
      },
      {
        type: "paragraph",
        content: "Tools like Pact and Spring Cloud Contract provide frameworks for implementing contract tests in various languages."
      }
    ]
  },
  {
    id: "16",
    title: "Test Reporting and Metrics That Matter",
    slug: "test-reporting-metrics",
    description: "Create meaningful test reports and track metrics that provide real value to your team.",
    author: "Marco",
    createdAt: "2024-03-30",
    tags: ["Reporting", "Metrics", "Best Practices"],
    thumbnail: "/blog/reporting.svg",
    readTime: 9,
    content: [
      {
        type: "paragraph",
        content: "Good test reporting goes beyond pass/fail rates. It provides insights into test health, coverage, and areas needing attention."
      },
      {
        type: "collapsible",
        title: "Key Metrics to Track",
        items: [
          "Test execution time trends",
          "Flaky test detection",
          "Code coverage percentages",
          "Test failure patterns",
          "Time to fix failed tests"
        ]
      },
      {
        type: "paragraph",
        content: "Tools like Allure, ReportPortal, and Playwright's HTML reporter provide rich, actionable test reports."
      }
    ]
  },
  {
    id: "17",
    title: "Testing WebSockets and Real-Time Features",
    slug: "testing-websockets-realtime",
    description: "Strategies for testing WebSocket connections and real-time application features.",
    author: "Marco",
    createdAt: "2024-04-01",
    tags: ["WebSockets", "Real-Time", "Advanced"],
    thumbnail: "/blog/websockets.svg",
    readTime: 11,
    content: [
      {
        type: "paragraph",
        content: "Testing real-time features requires different approaches than traditional HTTP-based testing. WebSockets present unique challenges."
      },
      {
        type: "code",
        language: "typescript",
        content: `test('websocket connection', async ({ page }) => {
  let messages: string[] = [];

  page.on('websocket', ws => {
    ws.on('framereceived', event => {
      messages.push(event.payload);
    });
  });

  await page.goto('/chat');
  await page.fill('[data-testid="message"]', 'Hello');
  await page.click('[data-testid="send"]');

  await expect.poll(() => messages).toContain('Hello');
});`
      }
    ]
  },
  {
    id: "18",
    title: "Security Testing in Automation",
    slug: "security-testing-automation",
    description: "Integrate security testing into your automated test suites to catch vulnerabilities early.",
    author: "Marco",
    createdAt: "2024-04-05",
    tags: ["Security", "Testing", "DevSecOps"],
    thumbnail: "/blog/security.svg",
    readTime: 13,
    content: [
      {
        type: "paragraph",
        content: "Security testing should be part of every automated test suite. Catching vulnerabilities early saves time and prevents security incidents."
      },
      {
        type: "collapsible",
        title: "Security Test Categories",
        items: [
          "SQL injection testing",
          "XSS vulnerability checks",
          "Authentication bypass attempts",
          "Authorization boundary tests",
          "CSRF protection validation"
        ]
      },
      {
        type: "paragraph",
        content: "Tools like OWASP ZAP can be integrated into CI/CD pipelines for automated security scanning."
      }
    ]
  },
  {
    id: "19",
    title: "Database Testing Best Practices",
    slug: "database-testing-best-practices",
    description: "Effective strategies for testing database operations, migrations, and data integrity.",
    author: "Marco",
    createdAt: "2024-04-10",
    tags: ["Database", "Testing", "SQL"],
    thumbnail: "/blog/database.svg",
    readTime: 10,
    content: [
      {
        type: "paragraph",
        content: "Database testing ensures data integrity, validates migrations, and verifies that database operations perform correctly."
      },
      {
        type: "collapsible",
        title: "What to Test",
        items: [
          "CRUD operations",
          "Database migrations",
          "Data validation and constraints",
          "Stored procedures and triggers",
          "Query performance"
        ]
      },
      {
        type: "code",
        language: "python",
        content: `def test_user_creation(db_session):
    user = User(email="test@example.com", name="Test")
    db_session.add(user)
    db_session.commit()

    assert user.id is not None
    assert user.created_at is not None`
      }
    ]
  },
  {
    id: "20",
    title: "Building a Scalable Test Automation Framework",
    slug: "scalable-test-automation-framework",
    description: "Design principles and architecture patterns for building maintainable test automation frameworks.",
    author: "Marco",
    createdAt: "2024-04-15",
    tags: ["Framework", "Architecture", "Best Practices"],
    thumbnail: "/blog/framework.svg",
    readTime: 15,
    content: [
      {
        type: "paragraph",
        content: "A well-designed test automation framework is the foundation of successful test automation. It should be maintainable, scalable, and easy to extend."
      },
      {
        type: "heading",
        content: "Framework Design Principles"
      },
      {
        type: "collapsible",
        title: "Key Components",
        items: [
          "Page Object Model for UI tests",
          "Reusable utility functions",
          "Configuration management",
          "Test data management",
          "Reporting and logging",
          "CI/CD integration"
        ]
      },
      {
        type: "paragraph",
        content: "Consider using design patterns like Factory, Builder, and Singleton to create flexible, reusable components."
      },
      {
        type: "collapsible",
        title: "Best Practices",
        items: [
          "Keep tests independent and isolated",
          "Use meaningful test names",
          "Implement proper error handling",
          "Follow DRY (Don't Repeat Yourself)",
          "Document your framework",
          "Regular refactoring and maintenance"
        ]
      }
    ]
  }
];
