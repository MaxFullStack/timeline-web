import { describe, it, expect } from 'vitest';
import { assignLanes } from '../assign-lanes';
import type { TimelineItem } from '../../types/timeline';

describe('assignLanes', () => {
  it('should assign single item to first lane', () => {
    const items: TimelineItem[] = [
      { id: 1, start: '2021-01-01', end: '2021-01-05', name: 'Task 1' }
    ];
    
    const result = assignLanes(items);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveLength(1);
    expect(result[0][0]).toEqual(items[0]);
  });

  it('should assign non-overlapping items to same lane', () => {
    const items: TimelineItem[] = [
      { id: 1, start: '2021-01-01', end: '2021-01-05', name: 'Task 1' },
      { id: 2, start: '2021-01-06', end: '2021-01-10', name: 'Task 2' }
    ];
    
    const result = assignLanes(items);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveLength(2);
  });

  it('should assign overlapping items to different lanes', () => {
    const items: TimelineItem[] = [
      { id: 1, start: '2021-01-01', end: '2021-01-10', name: 'Task 1' },
      { id: 2, start: '2021-01-05', end: '2021-01-15', name: 'Task 2' }
    ];
    
    const result = assignLanes(items);
    
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveLength(1);
    expect(result[1]).toHaveLength(1);
  });

  it('should sort items by start date', () => {
    const items: TimelineItem[] = [
      { id: 2, start: '2021-01-05', end: '2021-01-10', name: 'Task 2' },
      { id: 1, start: '2021-01-01', end: '2021-01-03', name: 'Task 1' }
    ];
    
    const result = assignLanes(items);
    
    expect(result[0][0].id).toBe(1);
    expect(result[0][1].id).toBe(2);
  });

  it('should handle complex overlapping scenarios', () => {
    const items: TimelineItem[] = [
      { id: 1, start: '2021-01-01', end: '2021-01-05', name: 'Task 1' },
      { id: 2, start: '2021-01-03', end: '2021-01-07', name: 'Task 2' },
      { id: 3, start: '2021-01-06', end: '2021-01-10', name: 'Task 3' },
      { id: 4, start: '2021-01-08', end: '2021-01-12', name: 'Task 4' }
    ];
    
    const result = assignLanes(items);
    
    expect(result).toHaveLength(2);
    expect(result[0]).toContainEqual(items[0]);
    expect(result[0]).toContainEqual(items[2]);
    expect(result[1]).toContainEqual(items[1]);
    expect(result[1]).toContainEqual(items[3]);
  });
});