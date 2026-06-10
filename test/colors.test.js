/**
 * Unit tests for colors.js
 * Tests the color utility functions
 */

import { test } from 'node:test';
import assert from 'node:assert';
import {
  colorize,
  red,
  green,
  yellow,
  blue,
  cyan,
  magenta,
  bold,
  dim,
  success,
  error,
  warning,
  info,
  highlight,
} from '../src/colors.js';

test('colors - colorize function', async (t) => {
  await t.test('should apply single style', () => {
    const result = colorize('test', 'red');
    assert(result.includes('test'));
    assert(result.includes('\x1b['));
    assert(result.includes('\x1b[0m'));
  });

  await t.test('should apply multiple styles', () => {
    const result = colorize('test', 'red', 'bold');
    assert(result.includes('test'));
    assert(result.includes('\x1b['));
  });

  await t.test('should include reset code', () => {
    const result = colorize('test', 'green');
    assert(result.endsWith('\x1b[0m'));
  });

  await t.test('should handle unknown styles gracefully', () => {
    const result = colorize('test', 'unknownStyle');
    assert(result.includes('test'));
  });

  await t.test('should preserve original text', () => {
    const text = 'hello world';
    const result = colorize(text, 'cyan');
    assert(result.includes(text));
  });
});

test('colors - convenience functions', async (t) => {
  await t.test('red() should colorize with red', () => {
    const result = red('text');
    assert(result.includes('\x1b[31m'));
    assert(result.includes('text'));
  });

  await t.test('green() should colorize with green', () => {
    const result = green('text');
    assert(result.includes('\x1b[32m'));
    assert(result.includes('text'));
  });

  await t.test('yellow() should colorize with yellow', () => {
    const result = yellow('text');
    assert(result.includes('\x1b[33m'));
    assert(result.includes('text'));
  });

  await t.test('blue() should colorize with blue', () => {
    const result = blue('text');
    assert(result.includes('\x1b[34m'));
    assert(result.includes('text'));
  });

  await t.test('cyan() should colorize with cyan', () => {
    const result = cyan('text');
    assert(result.includes('\x1b[36m'));
    assert(result.includes('text'));
  });

  await t.test('magenta() should colorize with magenta', () => {
    const result = magenta('text');
    assert(result.includes('\x1b[35m'));
    assert(result.includes('text'));
  });

  await t.test('bold() should apply bold style', () => {
    const result = bold('text');
    assert(result.includes('\x1b[1m'));
    assert(result.includes('text'));
  });

  await t.test('dim() should apply dim style', () => {
    const result = dim('text');
    assert(result.includes('\x1b[2m'));
    assert(result.includes('text'));
  });
});

test('colors - combined style functions', async (t) => {
  await t.test('success() should combine green and bold', () => {
    const result = success('text');
    assert(result.includes('\x1b['));
    assert(result.includes('text'));
  });

  await t.test('error() should combine red and bold', () => {
    const result = error('text');
    assert(result.includes('\x1b['));
    assert(result.includes('text'));
  });

  await t.test('warning() should apply yellow', () => {
    const result = warning('text');
    assert(result.includes('\x1b[33m'));
    assert(result.includes('text'));
  });

  await t.test('info() should apply cyan', () => {
    const result = info('text');
    assert(result.includes('\x1b[36m'));
    assert(result.includes('text'));
  });

  await t.test('highlight() should combine magenta and bold', () => {
    const result = highlight('text');
    assert(result.includes('\x1b['));
    assert(result.includes('text'));
  });
});

test('colors - edge cases', async (t) => {
  await t.test('should handle empty string', () => {
    const result = colorize('', 'red');
    assert(result.includes('\x1b[0m'));
  });

  await t.test('should handle string with special characters', () => {
    const result = colorize('hello\nworld', 'cyan');
    assert(result.includes('hello\nworld'));
  });

  await t.test('should handle string with ANSI codes', () => {
    const result = colorize('\x1b[31mred\x1b[0m', 'green');
    assert(result.includes('red'));
  });

  await t.test('should handle multiple consecutive colorize calls', () => {
    const result = colorize(red('text'), 'blue');
    assert(result.includes('text'));
  });
});
