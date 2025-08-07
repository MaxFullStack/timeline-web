import { describe, it, expect } from 'vitest';
import { timelineItems } from '../timeline-items';

describe('Timeline Items Data', () => {
  it('should have 16 timeline items', () => {
    expect(timelineItems).toHaveLength(16);
  });

  it('should have all required properties for each item', () => {
    timelineItems.forEach(item => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('start');
      expect(item).toHaveProperty('end');
      expect(item).toHaveProperty('name');
      
      expect(typeof item.id).toBe('number');
      expect(typeof item.start).toBe('string');
      expect(typeof item.end).toBe('string');
      expect(typeof item.name).toBe('string');
    });
  });

  it('should have unique IDs for all items', () => {
    const ids = timelineItems.map(item => item.id);
    const uniqueIds = new Set(ids);
    
    expect(uniqueIds.size).toBe(timelineItems.length);
  });

  it('should have valid date formats (YYYY-MM-DD)', () => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    
    timelineItems.forEach(item => {
      expect(item.start).toMatch(dateRegex);
      expect(item.end).toMatch(dateRegex);
    });
  });

  it('should have end date same or after start date', () => {
    timelineItems.forEach(item => {
      const startDate = new Date(item.start);
      const endDate = new Date(item.end);
      
      expect(endDate.getTime()).toBeGreaterThanOrEqual(startDate.getTime());
    });
  });

  it('should have non-empty names', () => {
    timelineItems.forEach(item => {
      expect(item.name.trim()).not.toBe('');
      expect(item.name.length).toBeGreaterThan(0);
    });
  });

  it('should cover the expected date range (2021-01-14 to 2021-05-01)', () => {
    const startDates = timelineItems.map(item => new Date(item.start));
    const endDates = timelineItems.map(item => new Date(item.end));
    
    const earliestStart = new Date(Math.min(...startDates.map(d => d.getTime())));
    const latestEnd = new Date(Math.max(...endDates.map(d => d.getTime())));
    
    expect(earliestStart.toISOString().slice(0, 10)).toBe('2021-01-14');
    expect(latestEnd.toISOString().slice(0, 10)).toBe('2021-05-01');
  });

  it('should have reasonable task names', () => {
    const expectedNames = [
      'Recruit translators',
      'Create lesson plan 1',
      'Translate phrases for lesson 1',
      'Create dark mode design',
      'Recruit copyeditors',
      'Proofread translations for lesson 1',
      'Finalize logo',
      'Implement dark mode',
      'Finalize lesson plan 1',
      'Approve logo',
      'Create lesson plan 2',
      'Translate phrases for lesson 2',
      'Debug mobile notification error',
      'Test debugged mobile notifications',
      'Beta test',
      'Launch day'
    ];
    
    const actualNames = timelineItems.map(item => item.name);
    expect(actualNames).toEqual(expectedNames);
  });

  it('should have sequential IDs from 1 to 16', () => {
    const ids = timelineItems.map(item => item.id).sort((a, b) => a - b);
    const expectedIds = Array.from({ length: 16 }, (_, i) => i + 1);
    
    expect(ids).toEqual(expectedIds);
  });
});