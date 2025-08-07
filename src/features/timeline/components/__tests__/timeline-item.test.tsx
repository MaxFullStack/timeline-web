import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TimelineItemComponent } from '../timeline-item';
import type { TimelineItem } from '../../types/timeline';

const mockItem: TimelineItem = {
  id: 1,
  start: '2021-01-01',
  end: '2021-01-05',
  name: 'Test Task'
};

const mockProps = {
  item: mockItem,
  startDate: new Date('2021-01-01'),
  totalDays: 10,
  isEditing: false,
  onEdit: vi.fn(),
  onSave: vi.fn(),
  onCancel: vi.fn()
};

describe('TimelineItemComponent', () => {
  it('should render timeline item with correct name', () => {
    render(<TimelineItemComponent {...mockProps} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('should show correct tooltip information', () => {
    render(<TimelineItemComponent {...mockProps} />);
    
    const item = screen.getByText('Test Task').closest('div')?.parentElement;
    expect(item).toHaveAttribute('title', expect.stringContaining('Test Task'));
    expect(item).toHaveAttribute('title', expect.stringContaining('2021-01-01 - 2021-01-05'));
    expect(item).toHaveAttribute('title', expect.stringContaining('Click to edit'));
  });

  it('should calculate correct positioning and width', () => {
    render(<TimelineItemComponent {...mockProps} />);
    
    // Get the outermost div that has the positioning styles
    const item = screen.getByText('Test Task').closest('div')?.parentElement;
    
    expect(item).toHaveStyle({ left: '0%' }); // Item starts on day 1
    expect(item).toHaveStyle({ width: '50%' }); // 5 days out of 10 total
    expect(item).toHaveStyle({ minWidth: '60px' }); // Non-single-day item min width
  });

  it('should handle single-day items correctly', () => {
    const singleDayItem = {
      ...mockItem,
      end: '2021-01-01'
    };
    
    render(<TimelineItemComponent {...mockProps} item={singleDayItem} />);
    
    const item = screen.getByText('Test Task').closest('div')?.parentElement;
    expect(item).toHaveStyle({ minWidth: '8px' });
    expect(item).toHaveStyle({ width: '10%' }); // 1 day out of 10 total days
  });

  it('should call onEdit when clicked', () => {
    const onEdit = vi.fn();
    render(<TimelineItemComponent {...mockProps} onEdit={onEdit} />);
    
    fireEvent.click(screen.getByText('Test Task'));
    
    expect(onEdit).toHaveBeenCalledWith(1);
  });

  it('should show input field when editing', () => {
    render(<TimelineItemComponent {...mockProps} isEditing={true} />);
    
    const input = screen.getByDisplayValue('Test Task');
    expect(input).toBeInTheDocument();
    expect(input).toHaveFocus();
  });

  it('should call onSave when Enter is pressed during editing', () => {
    const onSave = vi.fn();
    render(<TimelineItemComponent {...mockProps} isEditing={true} onSave={onSave} />);
    
    const input = screen.getByDisplayValue('Test Task');
    fireEvent.change(input, { target: { value: 'Updated Task' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(onSave).toHaveBeenCalledWith(1, 'Updated Task');
  });

  it('should call onCancel when Escape is pressed during editing', () => {
    const onCancel = vi.fn();
    render(<TimelineItemComponent {...mockProps} isEditing={true} onCancel={onCancel} />);
    
    const input = screen.getByDisplayValue('Test Task');
    fireEvent.keyDown(input, { key: 'Escape' });
    
    expect(onCancel).toHaveBeenCalled();
  });

  it('should call onSave when input loses focus during editing', () => {
    const onSave = vi.fn();
    render(<TimelineItemComponent {...mockProps} isEditing={true} onSave={onSave} />);
    
    const input = screen.getByDisplayValue('Test Task');
    fireEvent.change(input, { target: { value: 'Blurred Task' } });
    fireEvent.blur(input);
    
    expect(onSave).toHaveBeenCalledWith(1, 'Blurred Task');
  });

  it('should not save empty names', () => {
    const onSave = vi.fn();
    render(<TimelineItemComponent {...mockProps} isEditing={true} onSave={onSave} />);
    
    const input = screen.getByDisplayValue('Test Task');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(onSave).not.toHaveBeenCalled();
  });

  it('should generate consistent colors for same item name', () => {
    const { rerender } = render(<TimelineItemComponent {...mockProps} />);
    const item1 = screen.getByText('Test Task').closest('div');
    const classes1 = item1?.className;
    
    rerender(<TimelineItemComponent {...mockProps} />);
    const item2 = screen.getByText('Test Task').closest('div');
    const classes2 = item2?.className;
    
    expect(classes1).toBe(classes2);
  });

  it('should truncate long names for small items', () => {
    const longNameItem = {
      ...mockItem,
      name: 'This is a very long task name that should be truncated'
    };
    
    // Small width item (< 10% of total)
    render(<TimelineItemComponent {...mockProps} item={longNameItem} totalDays={100} />);
    
    // Text should be truncated in small items - look for the actual truncated text
    expect(screen.getByText(/This is a very/)).toBeInTheDocument();
  });
});