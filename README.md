# Project Name
Test App — Programming Quiz CLI

Brief, compelling description of what the project does and its main purpose.
A small interactive command-line quiz game for learning programming topics (JavaScript, Node.js, general programming). Runs in the terminal, lets the user choose a category and number of questions, collects answers, then shows the score and a review of incorrect answers.

## 🚀 Key Features
- **Interactive CLI**: Runs entirely in the terminal with a friendly question/answer flow.
- **Multiple Categories**: Questions are grouped by category (e.g., javascript, nodejs, general).
- **Adaptive Question Count**: The available question count options adapt to how many questions exist for the chosen category.
- **Answer Review**: After the quiz, results are shown and incorrect answers are reviewed with optional explanations.
- **Zero external dependencies**: Uses only Node.js built-ins (fs/promises, path, url, readline).
- **ES Modules**: Project is written using JavaScript ES Modules ("type": "module").

#Project Documentation
## 📁 Project Structure
test-app/
	├── data/
	│   └── questions.json
	├── src/
	│   ├── colors.js
	│   ├── input.js
	│   └── quiz.js
	├── index.js
	└── package.json

### Key Components
- **index.js**: CLI entrypoint (contains #!/usr/bin/env node shebang). Bootstraps the app, loads questions, and starts the quiz flow.
- **src/quiz.js**: Core quiz logic — selects questions for the chosen category, tracks user answers, computes score, and prepares review of incorrect answers.
- **src/input.js**: Handles user interaction and prompts (uses Node's readline to read input from the terminal).
- **src/colors.js**: Small ANSI color utility used to colorize terminal output for better readability.
- **data/questions.json**: Quiz data store. Categories keyed by id (for example "javascript", "nodejs", "general"). Each category contains an array of questions. Each question object includes:
  - question: string
  - options: array of strings
  - answer: number (0-based index of correct option)
  - explanation: optional string (shown for incorrect answers)

## 🛠️ Setup Instructions
### Prerequisites
- Node.js 18.0.0 or higher (required because the project uses modern Node APIs and ES Modules).
- A POSIX-compatible terminal or Windows terminal that supports Node.js.

### Install dependencies
1. **Clone the repository**
  ```bash
  git clone https://github.com/vignesh-durairaj-epam/test-app.git
  cd test-app
  ```
2. **Install (no external dependencies)**  
   This project uses only Node built-ins. If you want to be safe, run:
  ```bash
  npm install
  ```
   (There are no dependencies to install from npm for this project.)

3. **Configure the application (optional)**  
   No environment variables or additional config files are required. Quiz content is configured in data/questions.json (see "Adding Questions / Configuration" below).

## 🚀 How to Run the Project
- Run via npm:
  ```bash
  npm start
  ```
- Or run the entrypoint directly:
  ```bash
  node index.js
  ```

Expected behavior:
- You will be prompted to choose a category and how many questions to answer (options adapt to the selected category).
- Each question presents multiple-choice options; enter the numeric choice.
- At the end you get a score and a review of any incorrect answers (with explanations if available).

## ✅ Testing
- Run built-in Node test runner command (project currently has no test files):
  ```bash
  npm test
  ```
  This runs: node --test  
  Note: As there are no test files in this branch, the runner may report "0 tests" or complete without executing tests.

## ✏️ Adding Questions / Configuration
- Quiz content is maintained in data/questions.json.
- File structure (conceptual example):
  ```json
  {
    "javascript": [
      {
        "question": "What is the result of `typeof NaN` in JavaScript?",
        "options": ["'number'", "'NaN'", "'undefined'", "'object'"],
        "answer": 0,
        "explanation": "In JavaScript, NaN is of type 'number'."
      }
    ],
    "nodejs": [
      {
        "question": "Which module is commonly used to work with file paths?",
        "options": ["fs", "path", "url", "http"],
        "answer": 1
      }
    ],
    "general": [ /* ... */ ]
  }
  ```
- Guidelines:
  - Each category key maps to an array of question objects.
  - `answer` is the zero-based index into the `options` array.
  - `explanation` is optional but recommended to improve learning during review.
  - When you add more questions to a category, the quiz will automatically adapt the selectable question counts.

## 🧭 Architecture Notes (brief)
- The app uses a simple modular architecture:
  - index.js: orchestrates startup and CLI flow.
  - src/quiz.js: isolates quiz rules, question selection, scoring, and review creation.
  - src/input.js: single responsibility for console prompts and input validation.
  - src/colors.js: utility for ANSI color output, keeping presentation concerns separate.
- No external dependencies simplifies distribution and reduces surface area for compatibility issues.
- Data-driven design: questions.json is the single source of truth for content, making it easy to update or extend categories/questions without changing code.
- ES Modules and modern Node.js APIs are used (fs/promises, path, url) — ensure Node >= 18.0.0.

**Other relevant Info**
* Contact/Support information
  * developer_ai@epam.com
