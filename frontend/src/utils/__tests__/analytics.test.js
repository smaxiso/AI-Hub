import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { 
  trackEvent, 
  trackToolClick, 
  trackSearch,
  trackFilter,
  trackFavorite,
  getAnalyticsEvents,
  clearAnalytics,
  getToolStats
} from '../analytics';

describe('Analytics Utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('trackEvent', () => {
    it('stores events in localStorage', () => {
      trackEvent('Test', 'Action', 'Label', 100);
      
      const events = getAnalyticsEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toMatchObject({
        category: 'Test',
        action: 'Action',
        label: 'Label',
        value: 100,
      });
    });

    it('includes timestamp and metadata', () => {
      trackEvent('Test', 'Action');
      
      const events = getAnalyticsEvents();
      expect(events[0]).toHaveProperty('timestamp');
      expect(events[0]).toHaveProperty('userAgent');
      expect(events[0]).toHaveProperty('screenSize');
    });
  });

  describe('trackToolClick', () => {
    it('increments click count', () => {
      trackToolClick('tool-1', 'Test Tool', 'Chat');
      trackToolClick('tool-1', 'Test Tool', 'Chat');
      
      const stats = getToolStats();
      expect(stats['tool-1'].count).toBe(2);
    });

    it('stores tool metadata', () => {
      trackToolClick('tool-1', 'Test Tool', 'Chat');
      
      const stats = getToolStats();
      expect(stats['tool-1']).toMatchObject({
        name: 'Test Tool',
        category: 'Chat',
        count: 1,
      });
    });

    it('tracks first and last click times', () => {
      trackToolClick('tool-1', 'Test Tool');
      
      const stats = getToolStats();
      expect(stats['tool-1']).toHaveProperty('firstClicked');
      expect(stats['tool-1']).toHaveProperty('lastClicked');
    });
  });

  describe('trackSearch', () => {
    it('tracks search queries', () => {
      trackSearch('chatgpt', 5);
      
      const events = getAnalyticsEvents();
      expect(events[0]).toMatchObject({
        category: 'Search',
        action: 'Query',
        label: 'chatgpt',
        value: 5,
      });
    });
  });

  describe('trackFilter', () => {
    it('tracks filter usage', () => {
      trackFilter('Category', 'Chat');
      
      const events = getAnalyticsEvents();
      expect(events[0]).toMatchObject({
        category: 'Filter',
        action: 'Category',
        label: 'Chat',
      });
    });
  });

  describe('trackFavorite', () => {
    it('tracks favorite actions', () => {
      trackFavorite('Test Tool', 'add');
      
      const events = getAnalyticsEvents();
      expect(events[0]).toMatchObject({
        category: 'Favorite',
        action: 'add',
        label: 'Test Tool',
      });
    });
  });

  describe('clearAnalytics', () => {
    it('clears all analytics data', () => {
      trackEvent('Test', 'Action');
      trackToolClick('tool-1', 'Tool');
      
      clearAnalytics();
      
      expect(getAnalyticsEvents()).toHaveLength(0);
      expect(getToolStats()).toEqual({});
    });
  });

  describe('event limit', () => {
    it('keeps only last 1000 events', () => {
      // Track 1005 events
      for (let i = 0; i < 1005; i++) {
        trackEvent('Test', 'Action', `Event ${i}`);
      }
      
      const events = getAnalyticsEvents();
      expect(events).toHaveLength(1000);
      expect(events[0].label).toBe('Event 5'); // First 5 should be removed
    });
  });
});
