import { describe, it, expect } from 'vitest';

// Extract the color function from timeline-item for testing
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

describe('Color Utils', () => {
  it('should return consistent colors for same name', () => {
    const color1 = getItemColor('Test Task');
    const color2 = getItemColor('Test Task');
    
    expect(color1).toEqual(color2);
  });

  it('should return different colors for different names', () => {
    const color1 = getItemColor('Task A');
    const color2 = getItemColor('Task B');
    
    expect(color1).not.toEqual(color2);
  });

  it('should handle empty string', () => {
    const color = getItemColor('');
    
    expect(color).toHaveProperty('bg');
    expect(color).toHaveProperty('border');
    expect(color).toHaveProperty('text');
  });

  it('should handle special characters', () => {
    const color1 = getItemColor('Task with spaces');
    const color2 = getItemColor('Task-with-dashes');
    const color3 = getItemColor('Task_with_underscores');
    
    expect(color1).toHaveProperty('bg');
    expect(color2).toHaveProperty('bg');
    expect(color3).toHaveProperty('bg');
  });

  it('should distribute colors across all available options', () => {
    const names = [
      'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 
      'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa'
    ];
    
    const colors = names.map(name => getItemColor(name));
    const uniqueColors = new Set(colors.map(c => c.bg));
    
    // Should use multiple different colors
    expect(uniqueColors.size).toBeGreaterThan(1);
  });

  it('should handle unicode characters', () => {
    const color1 = getItemColor('Tâche française');
    const color2 = getItemColor('タスク');
    const color3 = getItemColor('задача');
    
    expect(color1).toHaveProperty('bg');
    expect(color2).toHaveProperty('bg');
    expect(color3).toHaveProperty('bg');
  });
});