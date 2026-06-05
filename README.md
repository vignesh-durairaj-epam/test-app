# README.md

# test-app
A small Node.js interactive CLI quiz game. It loads quiz categories and questions from a JSON file, prompts the user to choose a category and number of questions, runs the quiz, and prints results with colored terminal output.

## 🚀 Key Features
- **Interactive CLI**: Category selection, configurable number of questions, and play-again loop.
- **Extensible content**: Questions are stored in a JSON file (data/questions.json) and can be edited/extended easily.
- **Zero external dependencies**: Runs with Node.js (built-ins only).
- **Colored output**: Small ANSI color helper for better UX in terminals.

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
- **index.js**: Application entrypoint. Loads questions, shows the banner, handles category/quantity selection, runs the quiz loop, and prints results.
- **src/quiz.js**: Core quiz logic — selecting questions, validating answers, scoring, and presenting explanations.
- **src/input.js**: CLI input utilities built on Node's readline for synchronous-like prompts.
- **src/colors.js**: Small ANSI color helper used to colorize terminal output.
- **data/questions.json**: Quiz content source. Contains categories with question arrays.

## 🛠️ Setup Instructions
### Prerequisites
- Node.js >= 18.0.0 (required by package.json engines)
- npm (optional, used for scripts; no external packages required)

### Install dependencies
1. Clone the repository
```bash
git clone https://github.com/vignesh-durairaj-epam/test-app.git
cd test-app
```
2. Install (keeps workflow consistent — no production dependencies)
```bash
npm install
```

3. (Optional) Verify Node version
```bash
node -v
# Should be v18.0.0 or higher
```

## 🚀 How to Run the Project
Start the CLI quiz:
```bash
npm start
# or
node index.js
```
Follow the on-screen prompts to:
- Choose a category
- Choose how many questions to attempt
- Answer questions (select option numbers as prompted)
- View results and explanations, then choose to play again or exit

## ✏️ How to Add / Edit Questions
Questions are stored at data/questions.json. The JSON follows this schema:

- Top-level: { "categories": { "<categoryId>": { "name": string, "questions": [ ... ] } } }
- Each question object:
  - question: string
  - options: string[] (array of option strings)
  - answer: number (0-based index into options)
  - explanation: string (optional)

Example snippet:
```json
{
  "categories": {
    "general": {
      "name": "General Knowledge",
      "questions": [
        {
          "question": "What is the capital of France?",
          "options": ["Paris", "Berlin", "Rome", "Madrid"],
          "answer": 0,
          "explanation": "Paris is the capital city of France."
        }
      ]
    }
  }
}
```

Notes:
- answer is a 0-based index: 0 corresponds to the first option.
- Ensure the JSON remains valid (commas, brackets).
- Restart the app (or re-run) after editing data/questions.json to load changes.

## Available npm scripts
- Start the app:
```bash
npm start
# runs: node index.js
```
- Run tests (Node built-in test runner; no tests present yet):
```bash
npm test
# runs: node --test
```

## 🧪 Testing
The project is set up to use Node's built-in test runner via `node --test`, but there are currently no test files in the repository. Add tests under a descriptive filename (e.g., test/quiz.test.js) and run:
```bash
npm test
```

## Troubleshooting
- Node version errors:
  - Error: unsupported engine — ensure Node >= 18.0.0 (use nvm if needed).
- JSON parse errors when loading questions:
  - Validate data/questions.json (use a JSON linter or run `node -e "console.log(require('./data/questions.json'))"`).
- Missing data/questions.json:
  - Ensure the file exists. The app expects `data/questions.json` relative to index.js.
- Terminal display issues (garbled color codes):
  - Some terminals or Windows consoles may require configuration; try a different terminal emulator.
- Permission errors:
  - Verify file permissions for repository files and that you have read access.

## Contributing
Contributions are welcome. Suggested workflow:
1. Fork the repo and create a feature branch:
```bash
git checkout -b feat/add-questions
```
2. Make changes (add questions, fix bugs, add tests).
3. Run and test locally.
4. Commit and push, then open a Pull Request with a clear description.

Recommended improvements to contribute:
- Add a LICENSE file matching package.json (MIT).
- Add automated tests (unit tests for quiz logic).
- Add linting/formatting config and CI workflow.

## License
The package.json declares the project license as MIT, but there is no LICENSE file in the repository root. If you are the repository owner or maintainer, add a LICENSE file with the full MIT text to make the license explicit. Until then, note that license metadata exists but a LICENSE file is missing.

**Other relevant Info**
* Contact/Support information
  * developer_ai@epam.com
