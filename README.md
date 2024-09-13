## Using Playwright for Testing Sisense

### Introduction

Playwright is a modern automation library for testing web applications. It provides powerful tools to simulate user interactions and verify the functionality of web applications, including Sisense. k6 is a modern library for performance testing. This project is include both to provide you full testing cicle. This documentation will guide you through setting up a test project with Playwright and k6 for testing your Sisense dashboards and widgets.

### Prerequisites

Before you begin, ensure you have the following installed:

- Git
- Node.js (version 18.16.0 or higher)
- npm (Node Package Manager)
- Docker
- A Sisense environment to test against

### Setting up a test project with Playwright

Clone the Playwright test project with tests.

### Install/Update all project dependancies

`npm install`

### Install Playwright with browser engines (Chromium, Firefox, WebKit)

`npx playwright-core install`

### Specify Sisense user credentials and Sisense base url in the env.config.ts file

![Sisense credentials](/screenshots/63bc92c3-684a-4443-bebf-926d8a7d7290.png)

### Run with VS Code

[Getting started with Playwright and VS Code](https://www.youtube.com/watch?v=Xz6lhEzgI5I)

### Run the whole test project

`npx playwright test --project=example --headed`

### Run tests by file name

`npx playwright test addUser.test.ts --project=example`

### Run a test by its name

`npx playwright test -g "X-RAY-00001" --project=all`

### Run k6 tests

`npm run k6 /dist/tests-k6/createUsers.test.js`

### Tests examples description

API test examples can be found in the tests/api folder, which contains:

- Add user test (addUser.test.ts)
- Add dashboard and share it test (dashboard.test.ts)
- Restart pods test (pod.test.ts)

UI test examples can be found in the tests/ui folder, which contains:

- Build cube test (build.test.ts)
- Create cube with database connector (connectors.test.ts)
- Create dashboard test (dashboard.test.ts)
- Navigate through application test (navigation.test.ts)
- Create pulse alert (pulse.test.ts)

Performance test examples can be found in the tests-k6 folder, which contains:

- Users and groups creation test and getting randomly group and user (createUsers.test.ts)

### Create your own tests

You can choose any way to implement your test: **Layer1 > Layer2 > Layer3** or vice versa. Each test case consists of several actions (UI or API) = STEPS.

UI: **Locator** (\src\pages) → **UIStep** (**UIStepClass** \src\steps\ui) → **Test** (\tests)
API: **Controller** (\src\api\controllers) → **ApiStep** (\src\steps\api) → **Test** (\tests)
Performance: **PerformanceStep** (\tests-k6\steps\) → **Test** (\tests-k6)

![Tests structure](/screenshots/fcee388d-2f30-4f3a-9274-baa154cad6b3.png)

First, search for existing UI/API/Performance steps. If the step already exists, you can just add it to your test case. If the step doesn’t exist yet, you can create it using the map above.

To implement a new step:

- UI: PageObject locator + primitive action (e.g. `click()`, `fill()`, `innerText()`, etc.)
- API: Controller (`get`, `post`, `patch`, etc.)
- Performance: (`login`, `createUsers`, `createGroups`, etc.)

**Each new UI Steps Class should be added to the Page fixtures (src\fixtures\pages.fixtures.ts) and fixtures you need should be added to your test.**

### Best Practices

- **Use Page Object Model:** Organize your tests using the Page Object Model pattern to improve maintainability and readability.
- **Handle Dynamic Content:** Use appropriate waiting strategies to handle dynamic content that may take time to load.
- **Use Environment Variables:** Store sensitive information like usernames and passwords in environment variables instead of hardcoding them in your tests.

### Performance tests

- **How it works:** The command to execute performance tests does the following things:

Transpilates the Typescript files from ./tests-k6 to Javascript test files in the ./dist folder using Babel and Webpack. Runs the provided test with k6 using the Dockerfile and docker-compose, which will mount the ./dist folder to /dist, making the tests in there available for the container. Runs executed with option `--insecure-skip-tls-verify` insecure skip TLS verify. Please make sure docker is running on your system before execute performance tests.
