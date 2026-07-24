const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { isToolNew, checkLevelAccess, LEVEL_ORDER, pick } = require('../middleware/helpers');

describe('pick', () => {
    it('returns only allowed keys', () => {
        const input = { name: 'Test', evil: 'drop', url: 'http://x.com' };
        const result = pick(input, ['name', 'url']);
        assert.deepEqual(result, { name: 'Test', url: 'http://x.com' });
    });

    it('ignores undefined keys', () => {
        const result = pick({ a: 1 }, ['a', 'b']);
        assert.deepEqual(result, { a: 1 });
    });

    it('returns empty object for no matches', () => {
        const result = pick({ x: 1 }, ['y']);
        assert.deepEqual(result, {});
    });
});

describe('isToolNew', () => {
    it('returns true for tool added within 14 days', () => {
        const recent = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
        assert.equal(isToolNew(null, recent), true);
    });

    it('returns false for tool added over 14 days ago', () => {
        const old = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString();
        assert.equal(isToolNew(null, old), false);
    });

    it('returns false for null dates', () => {
        assert.equal(isToolNew(null, null), false);
    });
});

describe('LEVEL_ORDER', () => {
    it('has 4 levels in correct order', () => {
        assert.deepEqual(LEVEL_ORDER, ['beginner', 'intermediate', 'advanced', 'expert']);
    });
});
