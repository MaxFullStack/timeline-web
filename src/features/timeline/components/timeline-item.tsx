'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { TimelineItem } from '../types/timeline';

interface TimelineItemProps {
  item: TimelineItem;
  startDate: Date;
  totalDays: number;
  isEditing: boolean;
  onEdit: (itemId: number) => void;
  onSave: (itemId: number, newName: string) => void;
  onCancel: () => void;
}

const getItemColor = (name: string) => {
  const colors = [
    { bg: 'bg-blue-500', border: 'border-blue-600', text: 'text-white' },
    { bg: 'bg-green-500', border: 'border-green-600', text: 'text-white' },
    { bg: 'bg-purple-500', border: 'border-purple-600', text: 'text-white' },
    { bg: 'bg-orange-500', border: 'border-orange-600', text: 'text-white' },
    { bg: 'bg-red-500', border: 'border-red-600', text: 'text-white' },
    { bg: 'bg-indigo-500', border: 'border-indigo-600', text: 'text-white' },
    { bg: 'bg-pink-500', border: 'border-pink-600', text: 'text-white' },
    { bg: 'bg-teal-500', border: 'border-teal-600', text: 'text-white' },
  ];
  
  const hash = name.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
};

export const TimelineItemComponent = ({ 
  item, 
  startDate, 
  totalDays, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel 
}: TimelineItemProps) => {
  const [editName, setEditName] = useState(item.name);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const itemStart = new Date(item.start);
  const itemEnd = new Date(item.end);
  
  const startOffset = Math.floor((itemStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const duration = Math.max(1, Math.floor((itemEnd.getTime() - itemStart.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  
  const leftPercent = (startOffset / totalDays) * 100;
  const widthPercent = (duration / totalDays) * 100;
  
  const colors = getItemColor(item.name);
  const isDayItem = duration === 1;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    if (!isEditing) {
      onEdit(item.id);
      setEditName(item.name);
    }
  };

  const handleSave = () => {
    if (editName.trim()) {
      onSave(item.id, editName.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditName(item.name);
      onCancel();
    }
  };

  const handleBlur = () => {
    if (isEditing) {
      handleSave();
    }
  };

  return (
    <>
      <div
        className={`absolute ${colors.bg} ${colors.text} text-xs px-2 py-1 rounded-md shadow-sm border ${colors.border} hover:shadow-md transition-shadow ${isEditing ? 'ring-2 ring-white ring-opacity-50' : 'cursor-pointer'} overflow-hidden group`}
        style={{
          left: `${leftPercent}%`,
          width: `${Math.max(widthPercent, 3)}%`,
          height: '36px',
          top: '6px',
          minWidth: isDayItem ? '8px' : '60px',
        }}
        title={isEditing ? undefined : `${item.name}\n${item.start} - ${item.end}\nDuration: ${duration} day${duration > 1 ? 's' : ''}\n\nClick to edit`}
        onClick={handleClick}
      >
        <div className="flex items-center h-full">
          <span className="truncate text-xs font-medium group-hover:font-semibold">
            {widthPercent < 10 ? item.name.substring(0, 15) + '...' : item.name}
          </span>
        </div>
        
        {/* Progress indicator for single-day tasks */}
        {isDayItem && (
          <div className="absolute inset-0 rounded-md bg-gradient-to-r from-transparent to-white opacity-20" />
        )}
      </div>

      {/* Editing overlay */}
      {isEditing && (
        <div
          className="absolute z-50 bg-white border-2 border-blue-500 rounded-md shadow-lg"
          style={{
            left: `${leftPercent}%`,
            top: '6px',
            minWidth: '200px',
            maxWidth: '400px',
            height: '36px',
          }}
        >
          <div className="flex items-center h-full px-2">
            <input
              ref={inputRef}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              className="bg-transparent text-gray-800 text-sm font-medium w-full outline-none"
              placeholder="Enter item name..."
            />
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={handleSave}
                className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                title="Save (Enter)"
              >
                ✓
              </button>
              <button
                onClick={() => {
                  setEditName(item.name);
                  onCancel();
                }}
                className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                title="Cancel (Escape)"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};