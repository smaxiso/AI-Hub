import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('returns initial value when no stored value exists', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    const [value] = result.current;
    expect(value).toBe('initial');
  });

  it('returns stored value when it exists', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'));
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    const [value] = result.current;
    expect(value).toBe('stored-value');
  });

  it('updates localStorage when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    const [, setValue] = result.current;
    setValue('new-value');
    
    const stored = localStorage.getItem('test-key');
    expect(JSON.parse(stored)).toBe('new-value');
  });

  it('handles arrays correctly', () => {
    const { result } = renderHook(() => useLocalStorage('array-key', []));
    
    const [, setValue] = result.current;
    setValue(['item1', 'item2']);
    
    const stored = localStorage.getItem('array-key');
    expect(JSON.parse(stored)).toEqual(['item1', 'item2']);
  });

  it('handles objects correctly', () => {
    const { result } = renderHook(() => useLocalStorage('object-key', {}));
    
    const [, setValue] = result.current;
    setValue({ name: 'test', value: 123 });
    
    const stored = localStorage.getItem('object-key');
    expect(JSON.parse(stored)).toEqual({ name: 'test', value: 123 });
  });

  it('handles errors gracefully', () => {
    // Mock localStorage to throw an error
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = () => {
      throw new Error('QuotaExceededError');
    };

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    const [, setValue] = result.current;
    
    // Should not throw
    expect(() => setValue('new-value')).not.toThrow();
    
    // Restore original method
    Storage.prototype.setItem = originalSetItem;
  });
});
