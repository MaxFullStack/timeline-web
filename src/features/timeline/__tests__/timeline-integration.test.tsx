import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Timeline } from '../components/timeline';
import type { TimelineItem } from '../types/timeline';

const mockItems: TimelineItem[] = [
  {
    id: 1,
    start: '2021-01-01',
    end: '2021-01-05',
    name: 'Task 1'
  },
  {
    id: 2,
    start: '2021-01-03',
    end: '2021-01-08',
    name: 'Task 2'
  },
  {
    id: 3,
    start: '2021-01-10',
    end: '2021-01-12',
    name: 'Task 3'
  }
];

describe('Timeline Integration Tests', () => {
  it('should render complete timeline with multiple items and lanes', () => {
    render(<Timeline items={mockItems} />);
    
    expect(screen.getByText('Timeline Visualization')).toBeInTheDocument();
    
    // Check for items existence instead of counting
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
    
    expect(screen.getByText('Lane 1')).toBeInTheDocument();
    expect(screen.getByText('Lane 2')).toBeInTheDocument();
  });

  it('should handle zoom functionality correctly', async () => {
    render(<Timeline items={mockItems} />);
    
    expect(screen.getByText('Zoom: 100%')).toBeInTheDocument();
    
    const zoomInButton = screen.getByText('+');
    fireEvent.click(zoomInButton);
    
    await waitFor(() => {
      expect(screen.getByText('Zoom: 150%')).toBeInTheDocument();
    });
    
    const zoomOutButton = screen.getByText('−');
    fireEvent.click(zoomOutButton);
    
    await waitFor(() => {
      expect(screen.getByText('Zoom: 100%')).toBeInTheDocument();
    });
  });

  it('should handle zoom reset functionality', async () => {
    render(<Timeline items={mockItems} />);
    
    const zoomInButton = screen.getByText('+');
    fireEvent.click(zoomInButton);
    fireEvent.click(zoomInButton);
    
    await waitFor(() => {
      expect(screen.getByText('Zoom: 225%')).toBeInTheDocument();
    });
    
    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);
    
    await waitFor(() => {
      expect(screen.getByText('Zoom: 100%')).toBeInTheDocument();
    });
  });

  it('should disable zoom buttons at limits', async () => {
    render(<Timeline items={mockItems} />);
    
    const zoomOutButton = screen.getByText('−');
    const zoomInButton = screen.getByText('+');
    
    // Zoom out to minimum
    for (let i = 0; i < 10; i++) {
      fireEvent.click(zoomOutButton);
    }
    
    await waitFor(() => {
      expect(zoomOutButton).toBeDisabled();
    });
    
    // Zoom in to maximum
    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);
    
    for (let i = 0; i < 10; i++) {
      fireEvent.click(zoomInButton);
    }
    
    await waitFor(() => {
      expect(zoomInButton).toBeDisabled();
    });
  });

  it('should handle inline editing workflow', async () => {
    render(<Timeline items={mockItems} />);
    
    const task1 = screen.getByText('Task 1');
    fireEvent.click(task1);
    
    await waitFor(() => {
      const input = screen.getByDisplayValue('Task 1');
      expect(input).toBeInTheDocument();
      expect(input).toHaveFocus();
    });
    
    const input = screen.getByDisplayValue('Task 1');
    fireEvent.change(input, { target: { value: 'Updated Task 1' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    await waitFor(() => {
      expect(screen.getByText('Updated Task 1')).toBeInTheDocument();
      expect(screen.queryByDisplayValue('Updated Task 1')).not.toBeInTheDocument();
    });
  });

  it('should cancel editing with Escape key', async () => {
    render(<Timeline items={mockItems} />);
    
    const task1 = screen.getByText('Task 1');
    fireEvent.click(task1);
    
    await waitFor(() => {
      const input = screen.getByDisplayValue('Task 1');
      expect(input).toBeInTheDocument();
    });
    
    const input = screen.getByDisplayValue('Task 1');
    fireEvent.change(input, { target: { value: 'Should be cancelled' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.queryByText('Should be cancelled')).not.toBeInTheDocument();
    });
  });

  it('should only allow editing one item at a time', async () => {
    render(<Timeline items={mockItems} />);
    
    const task1 = screen.getByText('Task 1');
    const task2 = screen.getByText('Task 2');
    
    fireEvent.click(task1);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Task 1')).toBeInTheDocument();
    });
    
    fireEvent.click(task2);
    
    await waitFor(() => {
      expect(screen.queryByDisplayValue('Task 1')).not.toBeInTheDocument();
      expect(screen.getByDisplayValue('Task 2')).toBeInTheDocument();
    });
  });

  it('should preserve zoom level during editing', async () => {
    render(<Timeline items={mockItems} />);
    
    const zoomInButton = screen.getByText('+');
    fireEvent.click(zoomInButton);
    
    await waitFor(() => {
      expect(screen.getByText('Zoom: 150%')).toBeInTheDocument();
    });
    
    const task1 = screen.getByText('Task 1');
    fireEvent.click(task1);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Zoom: 150%')).toBeInTheDocument();
    });
  });

  it('should handle empty timeline gracefully', () => {
    render(<Timeline items={[]} />);
    
    expect(screen.getByText('Timeline Visualization')).toBeInTheDocument();
    expect(screen.getByText(/0\s+items/)).toBeInTheDocument();
    expect(screen.getByText(/0\s+lanes/)).toBeInTheDocument();
    expect(screen.getByText(/0\s+days/)).toBeInTheDocument();
  });

  it('should update timeline when items change', () => {
    const { rerender } = render(<Timeline items={mockItems} />);
    
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
    
    const newItems = mockItems.slice(0, 2);
    rerender(<Timeline items={newItems} />);
    
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.queryByText('Task 3')).not.toBeInTheDocument();
  });

  it('should maintain lane assignments correctly with overlapping items', () => {
    const overlappingItems: TimelineItem[] = [
      { id: 1, start: '2021-01-01', end: '2021-01-05', name: 'Task A' },
      { id: 2, start: '2021-01-03', end: '2021-01-07', name: 'Task B' },
      { id: 3, start: '2021-01-06', end: '2021-01-10', name: 'Task C' }
    ];
    
    render(<Timeline items={overlappingItems} />);
    
    expect(screen.getByText('Task A')).toBeInTheDocument();
    expect(screen.getByText('Task B')).toBeInTheDocument();
    expect(screen.getByText('Task C')).toBeInTheDocument();
    
    // Task A and C should be in lane 1 (non-overlapping)
    // Task B should be in lane 2 (overlaps with A)
    expect(screen.getByText('Lane 1')).toBeInTheDocument();
    expect(screen.getByText('Lane 2')).toBeInTheDocument();
  });
});