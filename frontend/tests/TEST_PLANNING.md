# Test Planning Instructions

Use these instructions when asked to create a test plan for a page or feature.
Use `playwright-cli` to explore the app. Do NOT write test code — output is a markdown plan file only.

## Workflow

### 1. Navigate and Explore

```bash
playwright-cli open <url>
playwright-cli snapshot           # examine all interactive elements
playwright-cli click <ref>        # explore navigation, modals, flows
playwright-cli go-back
playwright-cli snapshot
```

- Take a snapshot of every page and state you navigate to
- Identify all interactive elements: inputs, buttons, links, dropdowns, modals
- Map all navigation paths between pages
- Do not take screenshots unless the snapshot is insufficient

### 2. Analyze User Flows

- Map primary user journeys and critical paths
- Identify entry points, happy paths, and exit points
- Note error states, loading states, and edge cases visible in the UI

### 3. Design Scenarios

Cover all of the following:

- **Happy path** — normal user behavior end-to-end
- **Edge cases** — boundary inputs, empty states, long text, special characters
- **Error handling** — invalid input, failed requests, rate limits
- **Navigation** — back/forward, deep links, page refresh

### 4. Output Format

Save the plan as a markdown file in `frontend/tests/test-plan/` named `<feature>.plan.md`.

Each scenario must follow this structure:

```markdown
## Test Cases

### 1. <Test Suite Name>

#### 1.1 <Scenario Title>

**Starting state:** <describe the initial state, e.g. "Fresh navigation to /blog">

**Steps:**

1. <Specific, actionable step>
2. <Specific, actionable step>
3. Verify <expected outcome>

**Expected outcome:** <One sentence summary of what success looks like>
```

## Quality Standards

- Steps must be specific enough for any engineer to implement without guessing
- Each scenario must be independent — assume a fresh browser state
- Include at least one negative/error scenario per feature
- Reference exact visible text, labels, and roles — not implementation details
- Do not include locator strategies (CSS, XPath, testIds) — that is for test code
