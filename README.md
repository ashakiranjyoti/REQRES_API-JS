# ReqRes API Automation with Playwright

![GitHub Actions](https://img.shields.io/badge/CI-GitHub%20Actions-blue?logo=githubactions)
![Playwright](https://img.shields.io/badge/Tested%20with-Playwright-green?logo=playwright)
![Node](https://img.shields.io/badge/Node.js-18%2B-brightgreen?logo=nodedotjs)
![License](https://img.shields.io/badge/License-MIT-yellow)

> A **professional** REST API test automation framework built with [Playwright Test](https://playwright.dev/) for the public [ReqRes API](https://reqres.in/).

---

## 📌 Tech Stack

| Tool | Purpose |
|---|---|
| JavaScript (Node.js) | Language |
| Playwright Test | Test Runner |
| ReqRes API | Target REST API |
| GitHub Actions | CI/CD Pipeline |
| HTML Reporter | Test Reporting |

---

## 📁 Project Structure

```
reqres-api-playwright/
├── api/                        # API helper classes
│   └── reqresClient.js         # Wraps all ReqRes endpoint calls
├── config/                     # Environment configuration
│   └── index.js                # baseURL, envName per environment
├── test-data/                  # JSON payloads and test IDs
│   └── users.json
├── tests/                      # Playwright test specs
│   ├── users.get.spec.js       # GET /users?page=2
│   ├── users.post.spec.js      # POST /users
│   ├── users.put.spec.js       # PUT /users/{id}
│   └── users.delete.spec.js    # DELETE /users/{id}
├── utils/                      # Reusable helpers
│   ├── assertions.js           # Status, body, header, time checks
│   └── logger.js               # Lightweight console logger
├── .github/
│   └── workflows/
│       └── api-tests.yml       # GitHub Actions CI workflow
├── playwright.config.js        # Playwright configuration
├── package.json                # Dependencies and npm scripts
└── README.md
```

---

## ✅ Test Coverage

### Endpoints
- `GET /users?page=2`
- `POST /users`
- `PUT /users/{id}`
- `DELETE /users/{id}`

### Scenarios

| Scenario | Covered |
|---|---|
| Status code validation | ✅ |
| Response body validation | ✅ |
| Header validation (content-type) | ✅ |
| Negative testing (invalid ID, missing fields) | ✅ |
| Response time check (< 2000ms) | ✅ |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org/) (LTS recommended)
- npm (comes with Node)

### Install Dependencies

```bash
npm install
npx playwright install
```

### Run Tests Locally

```bash
# Default environment (dev)
npx playwright test

# Explicit QA environment
npm run test:env:qa

# Open HTML report after test run
npx playwright show-report
```

---

## 🔁 GitHub Actions CI/CD

This project includes `.github/workflows/api-tests.yml` which:

- ✅ Triggers on **push** and **pull requests** to `main`
- ✅ Runs on `ubuntu-latest` with **Node.js 18**
- ✅ Installs dependencies and Playwright
- ✅ Executes `npx playwright test`
- ✅ Uploads **HTML report as artifact**

```yaml
name: API Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npx playwright install
      - run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 🧠 Design Highlights

### 🔄 Dynamic User IDs
No hardcoded IDs — tests fetch a valid user from `GET /users` before running PUT/DELETE, keeping tests reliable and non-brittle.

### ♻️ Reusable Assertions (`utils/assertions.js`)
Centralized helpers for:
- Status code checks (exact, 2xx, or "one of")
- Header checks (e.g. `content-type: application/json`)
- Body field checks (projection + matcher pattern)
- Response time thresholds

### 🌍 Environment-Based Config (`config/index.js`)
Switch between `dev`, `qa`, etc. via `TEST_ENV` — no test code changes needed.

### 📦 Separation of Concerns
| Layer | Responsibility |
|---|---|
| `api/` | HTTP calls |
| `tests/` | Test behavior & expectations |
| `utils/` | Cross-cutting: logging, assertions |

---

## 🔧 Extending the Framework

| Feature | How |
|---|---|
| Add endpoints | Extend `ReqResClient` + add new spec in `tests/` |
| Richer validation | Use `assertBodyField` for nested checks |
| Tag-based suites | Use Playwright `--grep` for smoke/regression/negative |
| UI + API combo | Add UI specs alongside — same Playwright runner! |

---

## 📄 License

MIT © 2024

---

> ⭐ If you found this helpful, give it a star and share it!
