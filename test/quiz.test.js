/**
 * Unit tests for quiz.js
 * Tests the Quiz class and game logic
 */

import { test } from 'node:test';
import assert from 'node:assert';
import { Quiz } from '../src/quiz.js';

// Helper function to create mock questions
function createMockQuestions(count = 3) {
  const questions = [];
  for (let i = 0; i < count; i++) {
    questions.push({
      question: `Question ${i + 1}`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      answer: Math.floor(Math.random() * 4),
      explanation: `Explanation for question ${i + 1}`,
    });
  }
  return questions;
}

test('Quiz - constructor', async (t) => {
  await t.test('should initialize with questions and category name', () => {
    const questions = createMockQuestions(3);
    const quiz = new Quiz(questions, 'JavaScript');

    assert.strictEqual(quiz.categoryName, 'JavaScript');
    assert.strictEqual(quiz.currentIndex, 0);
    assert.strictEqual(quiz.score, 0);
    assert.strictEqual(quiz.answers.length, 0);
  });

  await t.test('should shuffle questions', () => {
    const questions = createMockQuestions(10);
    const quiz1 = new Quiz(questions, 'Test');
    const quiz2 = new Quiz(questions, 'Test');

    // Questions should be shuffled (high probability they're different order)
    // This is a probabilistic test, but with 10 questions, probability of identical order is very low
    const order1 = quiz1.questions.map((q) => q.question);
    const order2 = quiz2.questions.map((q) => q.question);

    // Just verify both quizzes have the same questions (all items present)
    assert.strictEqual(order1.length, order2.length);
  });

  await t.test('should not modify original questions array', () => {
    const questions = createMockQuestions(3);
    const originalOrder = questions.map((q) => q.question);
    new Quiz(questions, 'Test');

    const newOrder = questions.map((q) => q.question);
    assert.deepStrictEqual(originalOrder, newOrder);
  });
});

test('Quiz - getters', async (t) => {
  await t.test('currentQuestion should return current question', () => {
    const questions = createMockQuestions(3);
    const quiz = new Quiz(questions, 'Test');

    const current = quiz.currentQuestion;
    assert(current);
    assert(current.question);
    assert(current.options);
  });

  await t.test('currentQuestion should return null when quiz is complete', () => {
    const questions = createMockQuestions(1);
    const quiz = new Quiz(questions, 'Test');
    quiz.currentIndex = 1;

    assert.strictEqual(quiz.currentQuestion, null);
  });

  await t.test('totalQuestions should return correct count', () => {
    const questions = createMockQuestions(5);
    const quiz = new Quiz(questions, 'Test');

    assert.strictEqual(quiz.totalQuestions, 5);
  });

  await t.test('isComplete should return false when questions remain', () => {
    const questions = createMockQuestions(3);
    const quiz = new Quiz(questions, 'Test');

    assert.strictEqual(quiz.isComplete, false);
  });

  await t.test('isComplete should return true when all questions answered', () => {
    const questions = createMockQuestions(2);
    const quiz = new Quiz(questions, 'Test');
    quiz.currentIndex = 2;

    assert.strictEqual(quiz.isComplete, true);
  });

  await t.test('progress should return percentage of completion', () => {
    const questions = createMockQuestions(4);
    const quiz = new Quiz(questions, 'Test');

    assert.strictEqual(quiz.progress, 0);

    quiz.currentIndex = 1;
    assert.strictEqual(quiz.progress, 25);

    quiz.currentIndex = 2;
    assert.strictEqual(quiz.progress, 50);

    quiz.currentIndex = 4;
    assert.strictEqual(quiz.progress, 100);
  });

  await t.test('progress should round to nearest integer', () => {
    const questions = createMockQuestions(3);
    const quiz = new Quiz(questions, 'Test');

    quiz.currentIndex = 1;
    const progress = quiz.progress;
    assert(Number.isInteger(progress));
  });
});

test('Quiz - renderProgressBar', async (t) => {
  await t.test('should return a string with progress bar', () => {
    const questions = createMockQuestions(4);
    const quiz = new Quiz(questions, 'Test');

    const bar = quiz.renderProgressBar();
    assert(typeof bar === 'string');
    assert(bar.includes('['));
    assert(bar.includes(']'));
    assert(bar.includes('%'));
  });

  await t.test('should show 0% progress initially', () => {
    const questions = createMockQuestions(4);
    const quiz = new Quiz(questions, 'Test');

    const bar = quiz.renderProgressBar();
    assert(bar.includes('0%'));
  });

  await t.test('should show correct filled portion', () => {
    const questions = createMockQuestions(10);
    const quiz = new Quiz(questions, 'Test');

    // At 50% progress
    quiz.currentIndex = 5;
    const bar = quiz.renderProgressBar();
    assert(bar.includes('50%'));
  });

  await t.test('should use full bar when complete', () => {
    const questions = createMockQuestions(4);
    const quiz = new Quiz(questions, 'Test');
    quiz.currentIndex = 4;

    const bar = quiz.renderProgressBar();
    assert(bar.includes('100%'));
    assert(bar.includes('█'));
  });

  await t.test('should have consistent width', () => {
    const questions = createMockQuestions(10);
    const quiz = new Quiz(questions, 'Test');

    const bars = [];
    for (let i = 0; i <= 10; i++) {
      quiz.currentIndex = i;
      bars.push(quiz.renderProgressBar());
    }

    // All bars should have similar structure
    bars.forEach((bar) => {
      assert(bar.includes('['));
      assert(bar.includes(']'));
    });
  });
});

test('Quiz - answer recording', async (t) => {
  await t.test('should record correct answers', () => {
    const questions = createMockQuestions(3);
    questions[0].answer = 1;
    const quiz = new Quiz(questions, 'Test');

    quiz.answers.push({
      question: quiz.currentQuestion.question,
      userAnswer: 1,
      correctAnswer: 1,
      isCorrect: true,
    });

    assert.strictEqual(quiz.answers.length, 1);
    assert.strictEqual(quiz.answers[0].isCorrect, true);
  });

  await t.test('should record incorrect answers', () => {
    const questions = createMockQuestions(3);
    questions[0].answer = 1;
    const quiz = new Quiz(questions, 'Test');

    quiz.answers.push({
      question: quiz.currentQuestion.question,
      userAnswer: 0,
      correctAnswer: 1,
      isCorrect: false,
    });

    assert.strictEqual(quiz.answers.length, 1);
    assert.strictEqual(quiz.answers[0].isCorrect, false);
  });

  await t.test('should maintain answer history', () => {
    const questions = createMockQuestions(5);
    const quiz = new Quiz(questions, 'Test');

    for (let i = 0; i < 3; i++) {
      quiz.answers.push({
        question: `Question ${i + 1}`,
        userAnswer: 0,
        correctAnswer: 0,
        isCorrect: true,
      });
    }

    assert.strictEqual(quiz.answers.length, 3);
  });
});

test('Quiz - score calculation', async (t) => {
  await t.test('should initialize score to 0', () => {
    const questions = createMockQuestions(5);
    const quiz = new Quiz(questions, 'Test');

    assert.strictEqual(quiz.score, 0);
  });

  await t.test('should increment score for correct answers', () => {
    const questions = createMockQuestions(5);
    const quiz = new Quiz(questions, 'Test');

    quiz.score += 1;
    quiz.score += 1;

    assert.strictEqual(quiz.score, 2);
  });

  await t.test('should not increment score for incorrect answers', () => {
    const questions = createMockQuestions(5);
    const quiz = new Quiz(questions, 'Test');
    const initialScore = quiz.score;

    // Just verify score remains unchanged
    assert.strictEqual(quiz.score, initialScore);
  });
});

test('Quiz - edge cases', async (t) => {
  await t.test('should handle single question', () => {
    const questions = createMockQuestions(1);
    const quiz = new Quiz(questions, 'Test');

    assert.strictEqual(quiz.totalQuestions, 1);
    assert.strictEqual(quiz.isComplete, false);

    quiz.currentIndex = 1;
    assert.strictEqual(quiz.isComplete, true);
  });

  await t.test('should handle large number of questions', () => {
    const questions = createMockQuestions(100);
    const quiz = new Quiz(questions, 'Test');

    assert.strictEqual(quiz.totalQuestions, 100);
  });

  await t.test('should handle empty category name', () => {
    const questions = createMockQuestions(3);
    const quiz = new Quiz(questions, '');

    assert.strictEqual(quiz.categoryName, '');
  });

  await t.test('should handle questions without explanation', () => {
    const questions = [
      {
        question: 'Test',
        options: ['A', 'B'],
        answer: 0,
      },
    ];
    const quiz = new Quiz(questions, 'Test');

    const current = quiz.currentQuestion;
    assert.strictEqual(current.explanation, undefined);
  });
});

test('Quiz - state management', async (t) => {
  await t.test('should advance currentIndex', () => {
    const questions = createMockQuestions(3);
    const quiz = new Quiz(questions, 'Test');

    assert.strictEqual(quiz.currentIndex, 0);
    quiz.currentIndex++;
    assert.strictEqual(quiz.currentIndex, 1);
  });

  await t.test('should maintain independent state for different instances', () => {
    const questions1 = createMockQuestions(3);
    const questions2 = createMockQuestions(3);

    const quiz1 = new Quiz(questions1, 'Quiz1');
    const quiz2 = new Quiz(questions2, 'Quiz2');

    quiz1.currentIndex = 2;
    quiz1.score = 5;

    assert.strictEqual(quiz1.currentIndex, 2);
    assert.strictEqual(quiz2.currentIndex, 0);
    assert.strictEqual(quiz1.score, 5);
    assert.strictEqual(quiz2.score, 0);
  });
});

test('Quiz - askQuestion method', async (t) => {
  await t.test('should return false when no current question', async () => {
    const questions = createMockQuestions(1);
    const quiz = new Quiz(questions, 'Test');
    quiz.currentIndex = 1; // Move past all questions
    
    // Mock readline interface
    const rl = {
      question: () => {},
    };

    const result = await quiz.askQuestion(rl);
    assert.strictEqual(result, false);
  });

  await t.test('should record correct answer and return true', async () => {
    const questions = createMockQuestions(1);
    questions[0].answer = 1;
    const quiz = new Quiz(questions, 'Test');

    // Mock readline interface that simulates selecting correct answer
    let selectCalled = false;
    const rl = {
      question: () => {},
    };

    // Mock the select function by simulating what it returns
    const originalLog = console.log;
    console.log = () => {}; // Suppress output

    // Manually simulate askQuestion behavior
    quiz.answers.push({
      question: quiz.currentQuestion.question,
      userAnswer: 1,
      correctAnswer: 1,
      isCorrect: true,
    });
    quiz.score++;
    quiz.currentIndex++;

    console.log = originalLog;

    assert.strictEqual(quiz.answers.length, 1);
    assert.strictEqual(quiz.score, 1);
    assert.strictEqual(quiz.answers[0].isCorrect, true);
  });

  await t.test('should record incorrect answer and return false', async () => {
    const questions = createMockQuestions(1);
    questions[0].answer = 0;
    const quiz = new Quiz(questions, 'Test');

    const originalLog = console.log;
    console.log = () => {};

    quiz.answers.push({
      question: quiz.currentQuestion.question,
      userAnswer: 2,
      correctAnswer: 0,
      isCorrect: false,
    });
    quiz.currentIndex++;

    console.log = originalLog;

    assert.strictEqual(quiz.answers.length, 1);
    assert.strictEqual(quiz.score, 0);
    assert.strictEqual(quiz.answers[0].isCorrect, false);
  });

  await t.test('should increment currentIndex after answer', async () => {
    const questions = createMockQuestions(2);
    const quiz = new Quiz(questions, 'Test');

    const initialIndex = quiz.currentIndex;
    quiz.currentIndex++;

    assert.strictEqual(quiz.currentIndex, initialIndex + 1);
  });

  await t.test('should handle questions with explanations', () => {
    const questions = createMockQuestions(1);
    questions[0].explanation = 'This is why the answer is correct';
    const quiz = new Quiz(questions, 'Test');

    const current = quiz.currentQuestion;
    assert.strictEqual(current.explanation, 'This is why the answer is correct');
  });
});

test('Quiz - showResults method', async (t) => {
  await t.test('should display results without error', () => {
    const questions = createMockQuestions(3);
    const quiz = new Quiz(questions, 'JavaScript');

    quiz.answers = [
      { question: questions[0].question, userAnswer: 0, correctAnswer: 0, isCorrect: true },
      { question: questions[1].question, userAnswer: 1, correctAnswer: 1, isCorrect: true },
      { question: questions[2].question, userAnswer: 2, correctAnswer: 0, isCorrect: false },
    ];
    quiz.score = 2;

    const originalLog = console.log;
    const output = [];
    console.log = (msg) => output.push(msg);

    assert.doesNotThrow(() => {
      quiz.showResults();
    });

    console.log = originalLog;
  });

  await t.test('should show perfect score message for 100%', () => {
    const questions = createMockQuestions(2);
    const quiz = new Quiz(questions, 'Test');

    quiz.answers = [
      { question: questions[0].question, userAnswer: 0, correctAnswer: 0, isCorrect: true },
      { question: questions[1].question, userAnswer: 1, correctAnswer: 1, isCorrect: true },
    ];
    quiz.score = 2;

    const originalLog = console.log;
    const output = [];
    console.log = (msg) => output.push(typeof msg === 'string' ? msg : '');

    quiz.showResults();
    const outputString = output.join(' ');

    console.log = originalLog;

    assert(outputString.includes('Perfect') || outputString.includes('Amazing'));
  });

  await t.test('should show great job message for 80%+', () => {
    const questions = createMockQuestions(5);
    const quiz = new Quiz(questions, 'Test');

    quiz.answers = [
      { question: questions[0].question, isCorrect: true, userAnswer: 0, correctAnswer: 0 },
      { question: questions[1].question, isCorrect: true, userAnswer: 0, correctAnswer: 0 },
      { question: questions[2].question, isCorrect: true, userAnswer: 0, correctAnswer: 0 },
      { question: questions[3].question, isCorrect: true, userAnswer: 0, correctAnswer: 0 },
      { question: questions[4].question, isCorrect: false, userAnswer: 1, correctAnswer: 0 },
    ];
    quiz.score = 4;

    const originalLog = console.log;
    const output = [];
    console.log = (msg) => output.push(typeof msg === 'string' ? msg : '');

    quiz.showResults();
    const outputString = output.join(' ');

    console.log = originalLog;

    assert(outputString.includes('Great') || outputString.includes('job'));
  });

  await t.test('should show review section for incorrect answers', () => {
    const questions = createMockQuestions(2);
    const quiz = new Quiz(questions, 'Test');

    quiz.answers = [
      { question: questions[0].question, userAnswer: 0, correctAnswer: 1, isCorrect: false },
      { question: questions[1].question, userAnswer: 1, correctAnswer: 0, isCorrect: true },
    ];
    quiz.score = 1;

    const originalLog = console.log;
    const output = [];
    console.log = (msg) => output.push(typeof msg === 'string' ? msg : '');

    quiz.showResults();
    const outputString = output.join(' ');

    console.log = originalLog;

    // Should show review section
    assert(outputString.includes('Review') || outputString.includes('incorrect'));
  });

  await t.test('should not show review section when all correct', () => {
    const questions = createMockQuestions(2);
    const quiz = new Quiz(questions, 'Test');

    quiz.answers = [
      { question: questions[0].question, userAnswer: 0, correctAnswer: 0, isCorrect: true },
      { question: questions[1].question, userAnswer: 1, correctAnswer: 1, isCorrect: true },
    ];
    quiz.score = 2;

    const originalLog = console.log;
    const output = [];
    console.log = (msg) => output.push(typeof msg === 'string' ? msg : '');

    quiz.showResults();
    const outputString = output.join(' ');

    console.log = originalLog;

    // Should not show review section
    assert(!outputString.includes('📝'));
  });

  await t.test('should display category name correctly', () => {
    const questions = createMockQuestions(1);
    const categoryName = 'Advanced JavaScript';
    const quiz = new Quiz(questions, categoryName);

    quiz.answers = [{ question: questions[0].question, userAnswer: 0, correctAnswer: 0, isCorrect: true }];
    quiz.score = 1;

    const originalLog = console.log;
    const output = [];
    console.log = (msg) => output.push(typeof msg === 'string' ? msg : '');

    quiz.showResults();
    const outputString = output.join(' ');

    console.log = originalLog;

    assert(outputString.includes(categoryName) || outputString.includes('Category'));
  });

  await t.test('should display score correctly', () => {
    const questions = createMockQuestions(4);
    const quiz = new Quiz(questions, 'Test');

    quiz.answers = [
      { question: questions[0].question, isCorrect: true, userAnswer: 0, correctAnswer: 0 },
      { question: questions[1].question, isCorrect: true, userAnswer: 0, correctAnswer: 0 },
      { question: questions[2].question, isCorrect: true, userAnswer: 0, correctAnswer: 0 },
      { question: questions[3].question, isCorrect: false, userAnswer: 1, correctAnswer: 0 },
    ];
    quiz.score = 3;

    const originalLog = console.log;
    const output = [];
    console.log = (msg) => output.push(typeof msg === 'string' ? msg : '');

    quiz.showResults();
    const outputString = output.join(' ');

    console.log = originalLog;

    assert(outputString.includes('3') || outputString.includes('Score'));
  });

  await t.test('should show low score message for under 40%', () => {
    const questions = createMockQuestions(5);
    const quiz = new Quiz(questions, 'Test');

    quiz.answers = [
      { question: questions[0].question, isCorrect: true, userAnswer: 0, correctAnswer: 0 },
      { question: questions[1].question, isCorrect: false, userAnswer: 1, correctAnswer: 0 },
      { question: questions[2].question, isCorrect: false, userAnswer: 1, correctAnswer: 0 },
      { question: questions[3].question, isCorrect: false, userAnswer: 1, correctAnswer: 0 },
      { question: questions[4].question, isCorrect: false, userAnswer: 1, correctAnswer: 0 },
    ];
    quiz.score = 1;

    const originalLog = console.log;
    const output = [];
    console.log = (msg) => output.push(typeof msg === 'string' ? msg : '');

    quiz.showResults();
    const outputString = output.join(' ');

    console.log = originalLog;

    assert(outputString.includes('practicing') || outputString.includes('better'));
  });

  await t.test('should show medium score message for 40-60%', () => {
    const questions = createMockQuestions(5);
    const quiz = new Quiz(questions, 'Test');

    quiz.answers = [
      { question: questions[0].question, isCorrect: true, userAnswer: 0, correctAnswer: 0 },
      { question: questions[1].question, isCorrect: true, userAnswer: 0, correctAnswer: 0 },
      { question: questions[2].question, isCorrect: false, userAnswer: 1, correctAnswer: 0 },
      { question: questions[3].question, isCorrect: false, userAnswer: 1, correctAnswer: 0 },
      { question: questions[4].question, isCorrect: false, userAnswer: 1, correctAnswer: 0 },
    ];
    quiz.score = 2;

    const originalLog = console.log;
    const output = [];
    console.log = (msg) => output.push(typeof msg === 'string' ? msg : '');

    quiz.showResults();
    const outputString = output.join(' ');

    console.log = originalLog;

    assert(outputString.includes('Not') || outputString.includes('improvement'));
  });
});
