import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Timeline } from '../timeline';
import type { TimelineItem } from '../../types/timeline';

const mockItems: TimelineItem[] = [
  { id: 1, start: '2021-01-01', end: '2021-01-05', name: 'Test Task 1' },
  { id: 2, start: '2021-01-06', end: '2021-01-10', name: 'Test Task 2' },
];

describe('Timeline', () => {
  it('should render timeline with items', () => {
    render(<Timeline items={mockItems} />);
    
    expect(screen.getByText('Timeline Visualization')).toBeInTheDocument();
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
  });

  it('should display correct item count', () => {
    render(<Timeline items={mockItems} />);
    
    expect(screen.getByText(/2\s+items/)).toBeInTheDocument();
    expect(screen.getByText(/1\s+lanes/)).toBeInTheDocument();
  });

  it('should render empty timeline', () => {
    render(<Timeline items={[]} />);
    
    expect(screen.getByText('Timeline Visualization')).toBeInTheDocument();
    expect(screen.getByText(/0\s+items/)).toBeInTheDocument();
    expect(screen.getByText(/0\s+lanes/)).toBeInTheDocument();
  });
});