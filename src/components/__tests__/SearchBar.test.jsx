import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  it('renders search input', () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    
    const input = screen.getByLabelText('Search AI tools');
    expect(input).toBeInTheDocument();
  });

  it('displays the current value', () => {
    render(<SearchBar value="chatgpt" onChange={vi.fn()} />);
    
    const input = screen.getByLabelText('Search AI tools');
    expect(input).toHaveValue('chatgpt');
  });

  it('calls onChange when typing', () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);
    
    const input = screen.getByLabelText('Search AI tools');
    fireEvent.change(input, { target: { value: 'midjourney' } });
    
    expect(onChange).toHaveBeenCalledWith('midjourney');
  });

  it('shows clear button when value exists', () => {
    render(<SearchBar value="test" onChange={vi.fn()} />);
    
    const clearButton = screen.getByRole('button');
    expect(clearButton).toBeInTheDocument();
  });

  it('clears input when clear button is clicked', () => {
    const onChange = vi.fn();
    render(<SearchBar value="test" onChange={onChange} />);
    
    const clearButton = screen.getByRole('button');
    fireEvent.click(clearButton);
    
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('has proper accessibility attributes', () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    
    const input = screen.getByLabelText('Search AI tools');
    expect(input).toHaveAttribute('aria-label', 'Search AI tools');
  });
});
