import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CategoryFilter from '../CategoryFilter';

describe('CategoryFilter', () => {
  const categories = ['All', 'Chat', 'Image', 'Audio', 'Video'];

  it('renders all categories', () => {
    render(
      <CategoryFilter 
        categories={categories} 
        selected="All" 
        onChange={vi.fn()} 
      />
    );
    
    categories.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it('highlights the selected category', () => {
    render(
      <CategoryFilter 
        categories={categories} 
        selected="Chat" 
        onChange={vi.fn()} 
      />
    );
    
    const chatChip = screen.getByLabelText(/Filter by Chat category/i);
    expect(chatChip).toBeInTheDocument();
  });

  it('calls onChange when category is clicked', () => {
    const onChange = vi.fn();
    render(
      <CategoryFilter 
        categories={categories} 
        selected="All" 
        onChange={onChange} 
      />
    );
    
    const imageChip = screen.getByText('Image');
    fireEvent.click(imageChip);
    
    expect(onChange).toHaveBeenCalledWith('Image');
  });

  it('has proper accessibility labels', () => {
    render(
      <CategoryFilter 
        categories={categories} 
        selected="All" 
        onChange={vi.fn()} 
      />
    );
    
    const allChip = screen.getByLabelText(/Filter by All category/i);
    expect(allChip).toBeInTheDocument();
  });
});
