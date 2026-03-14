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

    const input = screen.getByPlaceholderText('Search AI tools...');
    expect(input).toHaveValue('chatgpt');
  });

  it('calls onChange when typing', () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);

    const input = screen.getByPlaceholderText('Search AI tools...');
    fireEvent.change(input, { target: { value: 'midjourney' } });

    expect(onChange).toHaveBeenCalledWith('midjourney');
  });

  it('renders the search icon', () => {
    render(<SearchBar value="test" onChange={vi.fn()} />);

    const input = screen.getByPlaceholderText('Search AI tools...');
    expect(input).toBeInTheDocument();
  });

  it('renders with empty value', () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);

    const input = screen.getByPlaceholderText('Search AI tools...');
    expect(input).toHaveValue('');
  });

  it('has proper accessibility attributes', () => {
    render(<SearchBar value="" onChange={vi.fn()} />);

    const input = screen.getByLabelText('Search AI tools');
    expect(input).toHaveAttribute('aria-label', 'Search AI tools');
  });
});
