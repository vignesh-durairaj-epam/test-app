/**
 * Unit tests for input.js
 * Tests the input handling functions
 * 
 * Note: These functions are designed for interactive CLI use and rely on
 * Node's readline module. We test the parts that are unit-testable.
 */

import { test } from 'node:test';
import assert from 'node:assert';
import { Readable, Writable } from 'node:stream';
import * as readline from 'node:readline';
import {
  createInterface,
  prompt,
  select,
  confirm,
  pressEnter,
} from '../src/input.js';

test('input - createInterface', async (t) => {
  await t.test('should return a readline interface', () => {
    const rl = createInterface();
    assert(rl);
    assert(typeof rl.question === 'function');
    assert(typeof rl.close === 'function');
    rl.close();
  });

  await t.test('should have input and output properties', () => {
    const rl = createInterface();
    assert(rl.input);
    assert(rl.output);
    rl.close();
  });

  await t.test('should be able to close interface', () => {
    const rl = createInterface();
    assert.doesNotThrow(() => {
      rl.close();
    });
  });
});

test('input - prompt function', async (t) => {
  await t.test('should be a function', () => {
    assert(typeof prompt === 'function');
  });

  await t.test('should return a Promise', () => {
    const inputStream = new Readable();
    inputStream.push('test\n');
    inputStream.push(null);
    
    const outputStream = new Writable({
      write(chunk, encoding, callback) {
        callback();
      }
    });

    const rl = readline.createInterface({
      input: inputStream,
      output: outputStream,
      terminal: false,
    });

    const result = prompt(rl, 'Test?');
    assert(result instanceof Promise);
    
    return result.then(() => {
      rl.close();
    });
  });

  await t.test('should trim input values', () => {
    const inputStream = new Readable();
    inputStream.push('  answer  \n');
    inputStream.push(null);
    
    const outputStream = new Writable({
      write(chunk, encoding, callback) {
        callback();
      }
    });

    const rl = readline.createInterface({
      input: inputStream,
      output: outputStream,
      terminal: false,
    });

    return prompt(rl, 'Test?').then((answer) => {
      assert.strictEqual(answer, 'answer');
      rl.close();
    });
  });

  await t.test('should handle empty input', () => {
    const inputStream = new Readable();
    inputStream.push('\n');
    inputStream.push(null);
    
    const outputStream = new Writable({
      write(chunk, encoding, callback) {
        callback();
      }
    });

    const rl = readline.createInterface({
      input: inputStream,
      output: outputStream,
      terminal: false,
    });

    return prompt(rl, 'Test?').then((answer) => {
      assert.strictEqual(answer, '');
      rl.close();
    });
  });
});

test('input - select function', async (t) => {
  await t.test('should be a function', () => {
    assert(typeof select === 'function');
  });

  await t.test('should return promise with index and value', () => {
    const inputStream = new Readable();
    inputStream.push('1\n');
    inputStream.push(null);
    
    const outputStream = new Writable({
      write(chunk, encoding, callback) {
        callback();
      }
    });

    const rl = readline.createInterface({
      input: inputStream,
      output: outputStream,
      terminal: false,
    });

    return select(rl, 'Pick one:', ['Option A', 'Option B']).then((result) => {
      assert(typeof result === 'object');
      assert(typeof result.index === 'number');
      assert(typeof result.value === 'string');
      assert.strictEqual(result.index, 0);
      assert.strictEqual(result.value, 'Option A');
      rl.close();
    });
  });

  await t.test('should handle multiple options correctly', () => {
    const inputStream = new Readable();
    inputStream.push('2\n');
    inputStream.push(null);
    
    const outputStream = new Writable({
      write(chunk, encoding, callback) {
        callback();
      }
    });

    const rl = readline.createInterface({
      input: inputStream,
      output: outputStream,
      terminal: false,
    });

    return select(rl, 'Pick:', ['A', 'B', 'C']).then((result) => {
      assert.strictEqual(result.index, 1);
      assert.strictEqual(result.value, 'B');
      rl.close();
    });
  });
});

test('input - confirm function', async (t) => {
  await t.test('should be a function', () => {
    assert(typeof confirm === 'function');
  });

  await t.test('should return true for "y"', () => {
    const inputStream = new Readable();
    inputStream.push('y\n');
    inputStream.push(null);
    
    const outputStream = new Writable({
      write(chunk, encoding, callback) {
        callback();
      }
    });

    const rl = readline.createInterface({
      input: inputStream,
      output: outputStream,
      terminal: false,
    });

    return confirm(rl, 'Continue?').then((result) => {
      assert.strictEqual(result, true);
      rl.close();
    });
  });

  await t.test('should return true for "yes"', () => {
    const inputStream = new Readable();
    inputStream.push('yes\n');
    inputStream.push(null);
    
    const outputStream = new Writable({
      write(chunk, encoding, callback) {
        callback();
      }
    });

    const rl = readline.createInterface({
      input: inputStream,
      output: outputStream,
      terminal: false,
    });

    return confirm(rl, 'Continue?').then((result) => {
      assert.strictEqual(result, true);
      rl.close();
    });
  });

  await t.test('should return true for capital "Y"', () => {
    const inputStream = new Readable();
    inputStream.push('Y\n');
    inputStream.push(null);
    
    const outputStream = new Writable({
      write(chunk, encoding, callback) {
        callback();
      }
    });

    const rl = readline.createInterface({
      input: inputStream,
      output: outputStream,
      terminal: false,
    });

    return confirm(rl, 'Continue?').then((result) => {
      assert.strictEqual(result, true);
      rl.close();
    });
  });

  await t.test('should return false for "n"', () => {
    const inputStream = new Readable();
    inputStream.push('n\n');
    inputStream.push(null);
    
    const outputStream = new Writable({
      write(chunk, encoding, callback) {
        callback();
      }
    });

    const rl = readline.createInterface({
      input: inputStream,
      output: outputStream,
      terminal: false,
    });

    return confirm(rl, 'Continue?').then((result) => {
      assert.strictEqual(result, false);
      rl.close();
    });
  });

  await t.test('should return false for "no"', () => {
    const inputStream = new Readable();
    inputStream.push('no\n');
    inputStream.push(null);
    
    const outputStream = new Writable({
      write(chunk, encoding, callback) {
        callback();
      }
    });

    const rl = readline.createInterface({
      input: inputStream,
      output: outputStream,
      terminal: false,
    });

    return confirm(rl, 'Continue?').then((result) => {
      assert.strictEqual(result, false);
      rl.close();
    });
  });

  await t.test('should return false for empty input', () => {
    const inputStream = new Readable();
    inputStream.push('\n');
    inputStream.push(null);
    
    const outputStream = new Writable({
      write(chunk, encoding, callback) {
        callback();
      }
    });

    const rl = readline.createInterface({
      input: inputStream,
      output: outputStream,
      terminal: false,
    });

    return confirm(rl, 'Continue?').then((result) => {
      assert.strictEqual(result, false);
      rl.close();
    });
  });

  await t.test('should be case-insensitive', () => {
    const inputStream = new Readable();
    inputStream.push('YeS\n');
    inputStream.push(null);
    
    const outputStream = new Writable({
      write(chunk, encoding, callback) {
        callback();
      }
    });

    const rl = readline.createInterface({
      input: inputStream,
      output: outputStream,
      terminal: false,
    });

    return confirm(rl, 'Continue?').then((result) => {
      assert.strictEqual(result, true);
      rl.close();
    });
  });
});

test('input - pressEnter function', async (t) => {
  await t.test('should be a function', () => {
    assert(typeof pressEnter === 'function');
  });

  await t.test('should resolve after user input', () => {
    const inputStream = new Readable();
    inputStream.push('\n');
    inputStream.push(null);
    
    const outputStream = new Writable({
      write(chunk, encoding, callback) {
        callback();
      }
    });

    const rl = readline.createInterface({
      input: inputStream,
      output: outputStream,
      terminal: false,
    });

    return pressEnter(rl).then(() => {
      rl.close();
    });
  });

  await t.test('should accept custom message', () => {
    const inputStream = new Readable();
    inputStream.push('\n');
    inputStream.push(null);
    
    const outputStream = new Writable({
      write(chunk, encoding, callback) {
        callback();
      }
    });

    const rl = readline.createInterface({
      input: inputStream,
      output: outputStream,
      terminal: false,
    });

    return pressEnter(rl, 'Custom message').then(() => {
      rl.close();
    });
  });

  await t.test('should use default message when none provided', () => {
    const inputStream = new Readable();
    inputStream.push('\n');
    inputStream.push(null);
    
    const outputStream = new Writable({
      write(chunk, encoding, callback) {
        callback();
      }
    });

    const rl = readline.createInterface({
      input: inputStream,
      output: outputStream,
      terminal: false,
    });

    return pressEnter(rl).then(() => {
      rl.close();
    });
  });
});
